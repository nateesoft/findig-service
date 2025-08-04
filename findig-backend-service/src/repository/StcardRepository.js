const getAllData = async ({ db }) => {
  const sql = `select * from stcard order by S_Bran, S_Date`
  const results = await db.pos?.query(sql)
  return results
}

const getData = async ({ payload, db }) => {
  const { S_Bran } = payload
  const sql = `select * from stcard where S_Bran=? order by S_Date`
  const results = await db.pos?.query(sql, [S_Bran])
  return results
}

const searchData = async ({ payload, db }) => {
  const { S_No, S_Date_Start, S_Date_End, S_Bran, S_User, Data_Sync, S_Stk, S_PCode  } = payload
  let sql = `select * from stcard where 1=1 `
  if (S_No) {
    sql += `and S_No like '%${S_No}%' `
  }
  if (S_Date_Start && S_Date_End) {
    sql += `and S_Date_Start >= '${S_Date_Start}' and S_Date_End <= '%${S_Date_End}%' `
  }
  if (S_User) {
    sql += `and S_User like '%${S_User}%' `
  }
  if (S_Bran) {
    sql += `and S_Bran = '${S_Bran}' `
  }
  if (Data_Sync) {
    sql += `and Data_Sync = '${Data_Sync}' `
  }
  if (S_Stk) {
    sql += `and S_Stk = '${S_Stk}' `
  }
  if (S_PCode) {
    sql += `and S_PCode like '%${S_PCode}%' `
  }
  sql += `order by S_Date`

  const results = await db.pos?.query(sql, [S_Bran])
  return results
}

const getDataByBillNoPCode = async ({ payload, db }) => {
  const { S_Bran, S_No, S_PCode } = payload
  const sql = `select * from stcard where S_Bran=? AND S_No=? AND S_PCode=?`
  const results = await db.pos?.query(sql, [S_Bran, S_No, S_PCode])
  return results
}

const findByBillNoPCode = async ({ payload, db }) => {
  const { S_Bran, S_No, S_PCode } = payload
  const sql = `select * from stcard where S_Bran=? AND S_No=? AND S_PCode=?`
  const results = await db.pos?.query(sql, [S_Bran, S_No, S_PCode])
  return results?.length > 0
}

const createStcard = async ({ payload, db }) => {
  const { S_Bran, S_Date, S_No, S_SubNo, S_Que, 
    S_PCode, S_Stk, S_In, S_Out, S_InCost, S_OutCost, S_ACost, S_Rem, 
    S_User, S_EntryDate, S_EntryTime, S_Link, Source_Data, Data_Sync } = payload
  const sql = `INSERT INTO stcard
  (S_Bran, S_Date, S_No, S_SubNo, S_Que, S_PCode, S_Stk, S_In, S_Out, 
  S_InCost, S_OutCost, S_ACost, S_Rem, S_User, S_EntryDate, S_EntryTime, S_Link, 
  Source_Data, Data_Sync)
  VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
const results = await db.pos?.query(sql, [
  S_Bran, S_Date, S_No, S_SubNo, S_Que, S_PCode, S_Stk, S_In, S_Out, 
  S_InCost, S_OutCost, S_ACost, S_Rem, S_User, S_EntryDate, S_EntryTime, S_Link, 
  Source_Data, Data_Sync])
  return results
}

const updateStcard = async ({ payload, db }) => {
  const { S_Bran, S_Date, S_No, S_SubNo, S_Que, 
    S_PCode, S_Stk, S_In, S_Out, S_InCost, S_OutCost, S_ACost, S_Rem, 
    S_User, S_EntryDate, S_EntryTime, S_Link, Source_Data, Data_Sync } = payload
  const sql = `UPDATE stcard
      SET S_Date=?, S_SubNo=?, S_Que=?, S_Stk=?, 
      S_In=?, S_Out=?, S_InCost=?, S_OutCost=?, S_ACost=?, S_Rem=?, 
      S_User=?, S_EntryDate=?, S_EntryTime=?, S_Link=?, Source_Data=?, Data_Sync=? 
      WHERE S_Bran=? AND S_No=? AND S_PCode=?`
const results = await db.pos?.query(sql, [
    S_Date, S_SubNo, S_Que, S_Stk, 
    S_In, S_Out, S_InCost, S_OutCost, S_ACost, S_Rem, 
    S_User, S_EntryDate, S_EntryTime, S_Link, Source_Data, Data_Sync, 
    S_Bran, S_No, S_PCode])
  return results
}

module.exports = {
  getData,
  getAllData,
  createStcard,
  updateStcard,
  findByBillNoPCode,
  getDataByBillNoPCode,
  searchData
}
