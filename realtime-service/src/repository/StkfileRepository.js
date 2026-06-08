const getData = async ({ payload, db }) => {
  try {
    if (!db.pos) {
      throw new Error('Database connection not available');
    }
    const { Branch } = payload
    const sql = `select * from stkfile where Branch=?`
    const results = await db.pos.query(sql, [Branch])
    return results
  } catch (error) {
    throw new Error(`Database query failed: ${error.message}`);
  }
}

const getAllData = async ({ db }) => {
  try {
    if (!db.pos) {
      throw new Error('Database connection not available');
    }
    const sql = `select * from stkfile order by Branch`
    const results = await db.pos.query(sql)
    return results
  } catch (error) {
    throw new Error(`Database query failed: ${error.message}`);
  }
}

const searchData = async ({ db, payload }) => {
  try {
    if (!db.pos) {
      throw new Error('Database connection not available');
    }
    const { Branch, BPCode, BStk, SendToPOS, GroupCode } = payload
    let sql = `select p.PCode, p.PDesc, p.PGroup, g.GroupName  , st.* 
      from stkfile st 
      left join product p on st.BPCode =p.PCode 
      left join groupfile g on p.PGroup=g.GroupCode 
      where 1=1 `
    const params = []
    if (BPCode) {
      sql += `and st.BPCode like ? `
      params.push(`%${BPCode}%`)
    }
    if (Branch) {
      sql += `and st.Branch = ? `
      params.push(Branch)
    }
    if (BStk) {
      sql += `and st.BStk = ? `
      params.push(BStk)
    }
    if (SendToPOS) {
      sql += `and st.SendToPOS = ? `
      params.push(SendToPOS)
    }
    if (GroupCode) {
      sql += `and g.GroupCode = ? `
      params.push(GroupCode)
    }
    sql += `order by st.Branch, st.BPCode`

    const results = await db.pos.query(sql, params)
    return results
  } catch (error) {
    throw new Error(`Database query failed: ${error.message}`);
  }
}

const findByProductStockCode = async ({ payload, db }) => {
  try {
    if (!db.pos) {
      throw new Error('Database connection not available');
    }
    const { Branch, BPCode, BStk } = payload
    const sql = `select * from stkfile where Branch=? and BPCode=? and BStk=?`
    const results = await db.pos.query(sql, [Branch, BPCode, BStk])
    return results?.length > 0
  } catch (error) {
    throw new Error(`Database query failed: ${error.message}`);
  }
}

const createStkFile = async ({ payload, db }) => {
  try {
    if (!db.pos) {
      throw new Error('Database connection not available');
    }
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
    const results = await db.pos.query(sql, [
      Branch, BPCode, BStk, BQty, BAmt, BTotalAmt, 
      BQty0, BQty1, BQty2, BQty3, BQty4, BQty5, BQty6, 
      BQty7, BQty8, BQty9, BQty10, BQty11, BQty12, 
      BQty13, BQty14, BQty15, BQty16, BQty17, BQty18, 
      BQty19, BQty20, BQty21, BQty22, BQty23, BQty24, 
      SendToPOS, LastUpdate, LastTimeUpdate])
    return results
  } catch (error) {
    throw new Error(`Database query failed: ${error.message}`);
  }
}

const updateStkFile = async ({ payload, db }) => {
  try {
    if (!db.pos) {
      throw new Error('Database connection not available');
    }
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
    const results = await db.pos.query(sql, [
      BQty, BAmt, BTotalAmt, BQty0,
      BQty1, BQty2, BQty3, BQty4, BQty5, BQty6, 
      BQty7, BQty8, BQty9, BQty10, BQty11, BQty12, 
      BQty13, BQty14, BQty15, BQty16, BQty17, BQty18, 
      BQty19, BQty20, BQty21, BQty22, BQty23, BQty24, 
      SendToPOS, LastUpdate, LastTimeUpdate, 
      Branch, BStk, BPCode, ])
    return results
  } catch (error) {
    throw new Error(`Database query failed: ${error.message}`);
  }
}

module.exports = {
  getData,
  getAllData,
  createStkFile,
  updateStkFile,
  findByProductStockCode,
  searchData
}
