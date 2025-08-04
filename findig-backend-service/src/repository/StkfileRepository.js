const getData = async ({ payload, db }) => {
  const { Branch } = payload
  const sql = `select * from stkfile where Branch=?`
  const results = await db.pos?.query(sql, [Branch])
  return results
}

const getAllData = async ({ db }) => {
  const sql = `select * from stkfile order by Branch`
  const results = await db.pos?.query(sql)
  return results
}

const findByProductStockCode = async ({ payload, db }) => {
  const { Branch, BPCode, BStk } = payload
  const sql = `select * from stkfile where Branch=? and BPCode=? and BStk=?`
  const results = await db.pos?.query(sql, [Branch, BPCode, BStk])
  return results?.length > 0
}

const createStkFile = async ({ payload, db }) => {
  const { Branch, BPCode, BStk, BQty, BAmt, BTotalAmt, 
    BQty0, BQty1, BQty2, BQty3, BQty4, BQty5, BQty6, 
    BQty7, BQty8, BQty9, BQty10, BQty11, BQty12, 
    BQty13, BQty14, BQty15, BQty16, BQty17, BQty18, 
    BQty19, BQty20, BQty21, BQty22, BQty23, BQty24, 
    SendToPOS, LastUpdate, LastTimeUpdate } = payload
  const sql = `INSERT INTO stkfile
              (Branch, BPCode, BStk, BQty, BAmt, BTotalAmt, 
              BQty0, BQty1, BQty2, BQty3, BQty4, BQty5, BQty6, 
              BQty7, BQty8, BQty9, BQty10, BQty11, BQty12, 
              BQty13, BQty14, BQty15, BQty16, BQty17, BQty18, 
              BQty19, BQty20, BQty21, BQty22, BQty23, BQty24, 
              SendToPOS, LastUpdate, LastTimeUpdate)
              VALUES(?, ?, ?, ?, ?, ?, 
              ?, ?, ?, ?, ?, ?, ?, 
              ?, ?, ?, ?, ?, ?, 
              ?, ?, ?, ?, ?, ?, 
              ?, ?, ?, ?, ?, ?, 
              ?, ?, ?);`
  const results = await db.pos?.query(sql, [
    Branch, BPCode, BStk, BQty, BAmt, BTotalAmt, 
    BQty0, BQty1, BQty2, BQty3, BQty4, BQty5, BQty6, 
    BQty7, BQty8, BQty9, BQty10, BQty11, BQty12, 
    BQty13, BQty14, BQty15, BQty16, BQty17, BQty18, 
    BQty19, BQty20, BQty21, BQty22, BQty23, BQty24, 
    SendToPOS, LastUpdate, LastTimeUpdate])
  return results
}

const updateStkFile = async ({ payload, db }) => {
  const { Branch, BPCode, BStk, BQty, BAmt, BTotalAmt, 
    BQty0, BQty1, BQty2, BQty3, BQty4, BQty5, BQty6, 
    BQty7, BQty8, BQty9, BQty10, BQty11, BQty12, 
    BQty13, BQty14, BQty15, BQty16, BQty17, BQty18, 
    BQty19, BQty20, BQty21, BQty22, BQty23, BQty24, 
    SendToPOS, LastUpdate, LastTimeUpdate } = payload
  const sql = `UPDATE stkfile 
      SET BQty=?, BAmt=?, BTotalAmt=?, BQty0=?,
      BQty1=?, BQty2=?, BQty3=?, BQty4=?, BQty5=?, BQty6=?, 
      BQty7=?, BQty8=?, BQty9=?, BQty10=?, BQty11=?, BQty12=?, 
      BQty13=?, BQty14=?, BQty15=?, BQty16=?, BQty17=?, BQty18=?, 
      BQty19=?, BQty20=?, BQty21=?, BQty22=?, BQty23=?, BQty24=?, 
      SendToPOS=?,LastUpdate=?, LastTimeUpdate=? 
      WHERE Branch=? AND BStk=? AND BPCode=?`
  const results = await db.pos?.query(sql, [
    BQty, BAmt, BTotalAmt, BQty0,
    BQty1, BQty2, BQty3, BQty4, BQty5, BQty6, 
    BQty7, BQty8, BQty9, BQty10, BQty11, BQty12, 
    BQty13, BQty14, BQty15, BQty16, BQty17, BQty18, 
    BQty19, BQty20, BQty21, BQty22, BQty23, BQty24, 
    SendToPOS, LastUpdate, LastTimeUpdate, 
    Branch, BStk, BPCode, ])
  return results
}

module.exports = {
  getData,
  getAllData,
  createStkFile,
  updateStkFile,
  findByProductStockCode
}
