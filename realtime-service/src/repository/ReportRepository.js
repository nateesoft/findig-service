const searchSummaryReport = async ({ payload, db }) => {
  try {
    if (!db.pos) {
      throw new Error('POS database connection not available')
    }

    const { GroupCode, BPCode, BStk, Branch_Start, Branch_End } = payload
    let sql = `select s.BPCode, p.PDesc, p.PGroup, s.BStk, s.Branch, s.BQty24 
      from stkfile s 
      left join product p on s.BPCode=p.PCode 
      where s.BQty24>0 `
    
    const params = []
    
    if (GroupCode) {
      sql += `and p.PGroup = ? `
      params.push(GroupCode)
    }
    if (BPCode) {
      sql += `and s.BPCode like ? `
      params.push(`%${BPCode}%`)
    }
    if (BStk) {
      sql += `and s.BStk = ? `
      params.push(BStk)
    }
    if (Branch_Start && Branch_End) {
      sql += `and s.Branch between ? and ? `
      params.push(Branch_Start, Branch_End)
    }
    
    sql += `order by s.Branch, s.BStk, p.PGroup, s.BPCode`

    const results = await db.pos.query(sql, params)
    return results
  } catch (error) {
    throw new Error(`Database query failed: ${error.message}`)
  }
}

const searchReportSale = async ({ db, payload }) => {
  try {
    if (!db.pos) {
      throw new Error('POS database connection not available')
    }

    const { billno, dateFrom, dateTo, emp_code, 
      branch_code_Start, branch_code_End, barcode } = payload
    let sql = `select 
    d.billno, d.document_date, d.emp_code, d.branch_code, dd.*, p.PGroup 
    from draft_sale d 
    left join draft_sale_details dd on d.billno=dd.billno 
    left join product p on dd.barcode=p.PCode 
    where 1=1 `
    const params = []

    if (billno) {
      sql += `and d.billno = ? `
      params.push(billno)
    }
    if (dateFrom && dateTo) {
      sql += `and d.document_date between ? and ? `
      params.push(dateFrom, dateTo)
    }
    if (emp_code) {
      sql += `and d.emp_code = ? `
      params.push(emp_code)
    }
    if (branch_code_Start && branch_code_End) {
      sql += `and d.branch_code between ? and ? `
      params.push(branch_code_Start, branch_code_End)
    }
    if(barcode){
      sql += `and dd.barcode = ? `
      params.push(barcode)
    }

    sql += `order by d.branch_code, d.document_date, d.billno`
    const results = await db.pos.query(sql, params)
    return results
  } catch (error) {
    throw new Error(`Database query failed: ${error.message}`)
  }
}

const searchReportStcard = async ({ db, payload }) => {
  try {
    if (!db.pos) {
      throw new Error('POS database connection not available')
    }

    const { GroupCode, S_PCode, S_Stk, S_Date_Start, S_Date_End, S_Rem, S_Bran_Start, S_Bran_End } = payload
    let sql = `select p.PCode, p.PDesc, p.PGroup, p.PPrice11, g.GroupName, st.*
      from stcard st
      left join product p on st.S_PCode=p.PCode
      left join groupfile g on p.PGroup=g.GroupCode
      where 1=1 `
    const params = []

    if (GroupCode) {
      sql += `and g.GroupCode = ? `
      params.push(GroupCode)
    }
    if (S_PCode) {
      sql += `and st.S_PCode like ? `
      params.push(`%${S_PCode}%`)
    }
    if (S_Stk) {
      sql += `and st.S_Stk = ? `
      params.push(S_Stk)
    }
    if (S_Date_Start && S_Date_End) {
      sql += `and st.S_Date between ? and ? `
      params.push(S_Date_Start, S_Date_End)
    }
    if (S_Rem) {
      sql += `and st.S_Rem = ? `
      params.push(S_Rem)
    }
    if (S_Bran_Start && S_Bran_End) {
      sql += `and st.S_Bran between ? and ? `
      params.push(S_Bran_Start, S_Bran_End)
    }
    
    sql += `order by st.S_Bran, p.PGroup, st.S_PCode`

    const results = await db.pos.query(sql, params)
    return results
  } catch (error) {
    throw new Error(`Database query failed: ${error.message}`)
  }
}

const getReportStkfile = async ({ db, payload }) => {
  try {
    if (!db.pos) {
      throw new Error('POS database connection not available')
    }

    const { Branch_Start, Branch_End, GroupCode_Start, GroupCode_End, BPCode, BStk, Date_Start, Date_End } = payload

    // ช่วงแบบเลือกได้ทีละฝั่ง: เลือกแค่เริ่มต้น -> >=, แค่สิ้นสุด -> <=
    const rangeFilter = (column, start, end) => {
      if (start && end) return { sql: `and ${column} between ? and ? `, params: [start, end] }
      if (start) return { sql: `and ${column} >= ? `, params: [start] }
      if (end) return { sql: `and ${column} <= ? `, params: [end] }
      return { sql: '', params: [] }
    }

    const params = []
    let sql
    if (Date_End) {
      // ยอด ณ วันที่ Date_End = ยอดปัจจุบัน (BQty24) - ความเคลื่อนไหวใน stcard หลัง Date_End
      // รับ/จ่าย = ความเคลื่อนไหวในช่วง Date_Start..Date_End, ยกมา = คงเหลือ - รับ + จ่าย
      const mvBranch = rangeFilter('S_Bran', Branch_Start, Branch_End)
      let mvSql = `select S_Bran, S_Stk, S_PCode,
          sum(case when S_Date > ? then S_In - S_Out else 0 end) as AfterEndQty,
          sum(case when S_Date <= ? then S_In else 0 end) as InQty,
          sum(case when S_Date <= ? then S_Out else 0 end) as OutQty
        from stcard where 1=1 `
      params.push(Date_End, Date_End, Date_End)
      if (Date_Start) {
        mvSql += `and S_Date >= ? `
        params.push(Date_Start)
      }
      mvSql += mvBranch.sql
      params.push(...mvBranch.params)
      if (BStk) {
        mvSql += `and S_Stk = ? `
        params.push(BStk)
      }
      mvSql += `group by S_Bran, S_Stk, S_PCode`

      sql = `select p.PCode, p.PDesc, p.PGroup, g.GroupName, st.*,
          round(st.BQty24 - ifnull(mv.AfterEndQty, 0), 3) as BalanceQty,
          round(ifnull(mv.InQty, 0), 3) as InQty,
          round(ifnull(mv.OutQty, 0), 3) as OutQty,
          round(st.BQty24 - ifnull(mv.AfterEndQty, 0) - ifnull(mv.InQty, 0) + ifnull(mv.OutQty, 0), 3) as OpeningQty
        from stkfile st
        left join product p on st.BPCode = p.PCode
        left join groupfile g on p.PGroup = g.GroupCode
        left join (${mvSql}) mv on mv.S_Bran = st.Branch and mv.S_Stk = st.BStk and mv.S_PCode = st.BPCode
        where 1=1 `
    } else {
      sql = `select p.PCode, p.PDesc, p.PGroup, g.GroupName, st.*, st.BQty24 as BalanceQty
        from stkfile st
        left join product p on st.BPCode = p.PCode
        left join groupfile g on p.PGroup = g.GroupCode
        where 1=1 `
    }

    const branch = rangeFilter('st.Branch', Branch_Start, Branch_End)
    sql += branch.sql
    params.push(...branch.params)
    const group = rangeFilter('g.GroupCode', GroupCode_Start, GroupCode_End)
    sql += group.sql
    params.push(...group.params)
    if (BPCode) {
      sql += `and st.BPCode like ? `
      params.push(`%${BPCode}%`)
    }
    if (BStk) {
      sql += `and st.BStk = ? `
      params.push(BStk)
    }

    sql += `order by st.Branch, p.PGroup, st.BPCode`

    const results = await db.pos.query(sql, params)
    return results
  } catch (error) {
    throw new Error(`Database query failed: ${error.message}`)
  }
}

module.exports = {
  searchSummaryReport,
  searchReportSale,
  searchReportStcard,
  getReportStkfile
}
