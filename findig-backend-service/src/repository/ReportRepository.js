const searchSummaryReport = async ({ payload, db }) => {
  const { GroupCode, BPCode, BStk, Branch_Start, Branch_End  } = payload
  let sql = `select s.BPCode, p.PDesc, g.GroupCode, g.GroupName, s.BStk, s.Branch, s.BQty24 
    from stkfile s 
    left join product p on s.BPCode=p.PCode 
    left join groupfile g on p.PGroup=g.GroupCode 
    left join stcard s2 on s.BPCode=s2.S_PCode 
    where 1=1 `
  if (GroupCode) {
    sql += `and g.GroupCode = '${GroupCode}' `
  }
  if (BPCode) {
    sql += `and s.BPCode like '%${BPCode}%' `
  }
  if (BStk) {
    sql += `and s.BStk = '${BStk}' `
  }
  if (Branch_Start&& Branch_End) {
    sql += `and s.Branch between '${Branch_Start}' and '${Branch_End}' `
  }
  
  sql += `order by st.S_Date, st.S_Bran, st.S_PCode`

  const results = await db.pos?.query(sql)
  return results
}

const searchReportSale = async ({ db, payload }) => {
  const { billno, document_date_Start, document_date_End,  emp_code, branch_code_Start, branch_code_End} = payload
  let sql = `select d.* from draft_sale d where 1=1 `
  if(billno) {
    sql += `and d.billno = '${billno}' `
  }
  if(document_date_Start && document_date_End) {
    sql += `and d.document_date between '${document_date_Start}' and '${document_date_End}' `
  }
  if(emp_code) {  
    sql += `and d.emp_code = '${emp_code}' `
  }
  if(branch_code_Start && branch_code_End) {
    sql += `and d.branch_code between '${branch_code_Start}' and '${branch_code_End}' `
  }

  sql += `order by d.branch_code, d.document_date, d.billno`
  const results = await db.pos?.query(sql)
  return results
}

const searchReportStcard = async ({ db, payload }) => {
  const { GroupCode, S_PCode, S_Stk, S_Date_Start, S_Date_End, S_Rem, S_Bran_Start, S_Bran_End } = payload
  let sql = `select p.PCode, p.PDesc, p.PGroup, g.GroupName  , st.* 
    from stcard st 
    left join product p on st.S_PCode=p.PCode 
    left join groupfile g on p.PGroup=g.GroupCode 
    where 1=1 `
  if (GroupCode) {
    sql += `and g.GroupCode = '${GroupCode}' `
  }
  if (S_PCode) {
    sql += `and st.S_PCode like '%${S_PCode}%' `
  }
  if (S_Stk) {
    sql += `and st.S_Stk = '${S_Stk}' `
  }
  if (S_Date_Start && S_Date_End) {
    sql += `and st.S_Date between '${S_Date_Start}' and '${S_Date_End}' `
  }
  if (S_Rem) {
    sql += `and st.S_No like '%${S_No}%' `
  }
  if (S_Bran_Start && S_Bran_End) {
    sql += `and st.S_Bran between '${S_Bran_Start}' and '${S_Bran_End}' `
  }
  
  sql += `order by st.S_Date, st.S_Bran, st.S_PCode`

  const results = await db.pos?.query(sql)
  return results
}

const getReportStkfile = async ({ db, payload }) => {
  const { Branch_Start, Branch_End, GroupCode_Start, GroupCode_End, BPCode, BStk } = payload
  let sql = `select p.PCode, p.PDesc, p.PGroup, g.GroupName  , st.* 
    from stkfile st 
    left join product p on st.BPCode =p.PCode 
    left join groupfile g on p.PGroup=g.GroupCode 
    where 1=1 `
  
  if (Branch_Start && Branch_End) {
    sql += `and st.Branch between '${Branch_Start}' and '${Branch_End}' `
  }
  if (GroupCode_Start && GroupCode_End) {
    sql += `and g.GroupCode between '${GroupCode_Start}' and '${GroupCode_End}' `
  }
  if (BPCode) {
    sql += `and st.BPCode like '%${BPCode}%' `
  }
  if (BStk) {
    sql += `and st.BStk = '${BStk}' `
  }

  sql += `order by st.Branch, st.BPCode`

  const results = await db.pos?.query(sql)
  return results
}

module.exports = {
  searchSummaryReport,
  searchReportSale,
  searchReportStcard,
  getReportStkfile
}
