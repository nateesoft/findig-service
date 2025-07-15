const getData = async ({ payload, db }) => {
  const { branch_code } = payload
  const sql = `select * from stcard where BranchCode=?`
  const results = await db.pos.query(sql, [branch_code])
  return results
}

const processStock = async ({ payload, db }) => {
  const { BranchCode, S_Date, S_No, S_SubNo, S_Que, 
    S_PCode, S_PName, S_Stk, S_In, S_Out, S_InCost, S_OutCost, S_ACost, S_Rem, 
    S_User, S_EntryDate, S_EntryTime, S_Link, Source_Data, Data_Sync } = payload
  const sql = `INSERT INTO stcard
  (BranchCode, S_Date, S_No, S_SubNo, S_Que, S_PCode, S_PName, S_Stk, S_In, S_Out, 
  S_InCost, S_OutCost, S_ACost, S_Rem, S_User, S_EntryDate, S_EntryTime, S_Link, Source_Data, Data_Sync)
  VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
const results = await db.pos.query(sql, [BranchCode, S_Date, S_No, S_SubNo, S_Que, S_PCode, S_PName, S_Stk, S_In, S_Out, 
    S_InCost, S_OutCost, S_ACost, S_Rem, S_User, S_EntryDate, S_EntryTime, S_Link, Source_Data, Data_Sync])
  return results
}

module.exports = {
  getData,
  processStock
}
