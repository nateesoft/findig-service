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

    const { billno, document_date_Start, document_date_End, emp_code, branch_code_Start, branch_code_End } = payload
    let sql = `select d.* from draft_sale d where 1=1 `
    const params = []

    if (billno) {
      sql += `and d.billno = ? `
      params.push(billno)
    }
    if (document_date_Start && document_date_End) {
      sql += `and d.document_date between ? and ? `
      params.push(document_date_Start, document_date_End)
    }
    if (emp_code) {
      sql += `and d.emp_code = ? `
      params.push(emp_code)
    }
    if (branch_code_Start && branch_code_End) {
      sql += `and d.branch_code between ? and ? `
      params.push(branch_code_Start, branch_code_End)
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
    let sql = `select p.PCode, p.PDesc, p.PGroup, g.GroupName, st.* 
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
      sql += `and st.S_No like ? `
      params.push(`%${S_Rem}%`)
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

    const { Branch_Start, Branch_End, GroupCode_Start, GroupCode_End, BPCode, BStk } = payload
    let sql = `select p.PCode, p.PDesc, p.PGroup, g.GroupName, st.* 
      from stkfile st 
      left join product p on st.BPCode = p.PCode 
      left join groupfile g on p.PGroup = g.GroupCode 
      where 1=1 `
    const params = []
    
    if (Branch_Start && Branch_End) {
      sql += `and st.Branch between ? and ? `
      params.push(Branch_Start, Branch_End)
    }
    if (GroupCode_Start && GroupCode_End) {
      sql += `and g.GroupCode between ? and ? `
      params.push(GroupCode_Start, GroupCode_End)
    }
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
