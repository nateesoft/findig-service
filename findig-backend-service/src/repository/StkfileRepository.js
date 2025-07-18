const getData = async ({ payload, db }) => {
  const { branch_code } = payload
  const sql = `select * from stkfile where BranchCode=?`
  const results = await db.pos?.query(sql, [branch_code])
  return results
}

const getDataByProductStockCode = async ({ payload, db }) => {
  const { BranchCode, BPCode, BStk } = payload
  const sql = `select * from stkfile where BranchCode=? and BPCode=? and BStk=?`
  const results = await db.pos?.query(sql, [BranchCode, BPCode, BStk])
  return results
}

const findByProductStockCode = async ({ payload, db }) => {
  const { BranchCode, BPCode, BStk } = payload
  const sql = `select * from stkfile where BranchCode=? and BPCode=? and BStk=?`
  const results = await db.pos?.query(sql, [BranchCode, BPCode, BStk])
  return results?.length > 0
}

const createStkFile = async ({ payload, db }) => {
  const { BranchCode, BPCode, BStk, BQty, BAmt, BTotalAmt, 
    BQty0, BQty1, BQty2, BQty3, BQty4, BQty5, BQty6, BQty7, BQty8, BQty9, BQty10, BQty11, BQty12, 
    BQty13, BQty14, BQty15, BQty16, BQty17, BQty18, BQty19, BQty20, BQty21, BQty22, BQty23, BQty24, 
    Data_Sync } = payload
  const sql = `INSERT INTO stkfile
              (BranchCode, BPCode, BStk, BQty, BAmt, BTotalAmt, 
              BQty0, BQty1, BQty2, BQty3, BQty4, BQty5, BQty6, BQty7, BQty8, BQty9, BQty10, BQty11, BQty12, 
              BQty13, BQty14, BQty15, BQty16, BQty17, BQty18, BQty19, BQty20, BQty21, BQty22, BQty23, BQty24, 
              Data_Sync)
              VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 
              ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`
  const results = await db.pos?.query(sql, [BranchCode, BPCode, BStk, BQty, BAmt, BTotalAmt, 
    BQty0, BQty1, BQty2, BQty3, BQty4, BQty5, BQty6, BQty7, BQty8, BQty9, BQty10, BQty11, BQty12, 
    BQty13, BQty14, BQty15, BQty16, BQty17, BQty18, BQty19, BQty20, BQty21, BQty22, BQty23, BQty24, 
    Data_Sync])
  return results
}

const updateStkFile = async ({ payload, db }) => {
  const { BranchCode, BPCode, BStk, BQty, BAmt, BTotalAmt, 
    BQty0, BQty1, BQty2, BQty3, BQty4, BQty5, BQty6, BQty7, BQty8, BQty9, BQty10, BQty11, BQty12, 
    BQty13, BQty14, BQty15, BQty16, BQty17, BQty18, BQty19, BQty20, BQty21, BQty22, BQty23, BQty24, 
    Data_Sync } = payload
  const sql = `UPDATE stkfile 
      SET BQty=?, BAmt=?, BTotalAmt=?, BQty0=?,
      BQty1=?, BQty2=?, BQty3=?, BQty4=?, BQty5=?, BQty6=?, 
      BQty7=?, BQty8=?, BQty9=?, BQty10=?, BQty11=?, BQty12=?, 
      BQty13=?, BQty14=?, BQty15=?, BQty16=?, BQty17=?, BQty18=?, 
      BQty19=?, BQty20=?, BQty21=?, BQty22=?, BQty23=?, BQty24=?, 
      Data_Sync=? 
      WHERE BranchCode=? AND BStk=? AND BPCode=?`
  const results = await db.pos?.query(sql, [
    BQty, BAmt, BTotalAmt, BQty0,
    BQty1, BQty2, BQty3, BQty4, BQty5, BQty6, 
    BQty7, BQty8, BQty9, BQty10, BQty11, BQty12, 
    BQty13, BQty14, BQty15, BQty16, BQty17, BQty18, 
    BQty19, BQty20, BQty21, BQty22, BQty23, BQty24, 
    Data_Sync, 
    BranchCode, BStk, BPCode])
  return results
}

module.exports = {
  getData,
  createStkFile,
  updateStkFile,
  getDataByProductStockCode,
  findByProductStockCode
}
