const getData = async ({ payload, db }) => {
  const { S_Bran } = payload
  const sql = `select * from stcard where S_Bran=?`
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
  createStcard,
  updateStcard,
  findByBillNoPCode,
  getDataByBillNoPCode
}
