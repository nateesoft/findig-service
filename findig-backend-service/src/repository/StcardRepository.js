const getAllData = async ({ db }) => {
  try {
    if (!db.pos) {
      throw new Error('Database connection not available');
    }
    const sql = `select * from stcard order by S_Bran, S_Date`
    const results = await db.pos.query(sql)
    return results
  } catch (error) {
    throw new Error(`Database query failed: ${error.message}`);
  }
}

const getData = async ({ payload, db }) => {
  try {
    if (!db.pos) {
      throw new Error('Database connection not available');
    }
    const { S_Bran } = payload
    const sql = `select * from stcard where S_Bran=? order by S_Date`
    const results = await db.pos.query(sql, [S_Bran])
    return results
  } catch (error) {
    throw new Error(`Database query failed: ${error.message}`);
  }
}

const searchData = async ({ payload, db }) => {
  try {
    if (!db.pos) {
      throw new Error('Database connection not available');
    }
    const { S_No, S_Date_Start, S_Date_End, S_Bran, S_User, Data_Sync, S_Stk, S_PCode, GroupCode  } = payload
    let sql = `select p.PCode, p.PDesc, p.PGroup, g.GroupName  , st.* 
      from stcard st 
      left join product p on st.S_PCode=p.PCode 
      left join groupfile g on p.PGroup=g.GroupCode 
      where 1=1 `
    const params = []
    if (S_No) {
      sql += `and st.S_No like ? `
      params.push(`%${S_No}%`)
    }
    if (S_Date_Start && S_Date_End) {
      sql += `and st.S_Date between ? and ? `
      params.push(S_Date_Start, S_Date_End)
    }
    if (S_User) {
      sql += `and st.S_User like ? `
      params.push(`%${S_User}%`)
    }
    if (S_Bran) {
      sql += `and st.S_Bran = ? `
      params.push(S_Bran)
    }
    if (Data_Sync) {
      sql += `and st.Data_Sync = ? `
      params.push(Data_Sync)
    }
    if (S_Stk) {
      sql += `and st.S_Stk = ? `
      params.push(S_Stk)
    }
    if (GroupCode) {
      sql += `and g.GroupCode = ? `
      params.push(GroupCode)
    }
    if (S_PCode) {
      sql += `and st.S_PCode like ? `
      params.push(`%${S_PCode}%`)
    }
    sql += `order by st.S_Date, st.S_Bran, st.S_PCode`

    const results = await db.pos.query(sql, params)
    return results
  } catch (error) {
    throw new Error(`Database query failed: ${error.message}`);
  }
}

const getDataByBillNoPCode = async ({ payload, db }) => {
  try {
    if (!db.pos) {
      throw new Error('Database connection not available');
    }
    const { S_Bran, S_No, S_PCode } = payload
    const sql = `select * from stcard where S_Bran=? AND S_No=? AND S_PCode=?`
    const results = await db.pos.query(sql, [S_Bran, S_No, S_PCode])
    return results
  } catch (error) {
    throw new Error(`Database query failed: ${error.message}`);
  }
}

const findByBillNoPCode = async ({ payload, db }) => {
  try {
    if (!db.pos) {
      throw new Error('Database connection not available');
    }
    const { S_Bran, S_No, S_PCode } = payload
    const sql = `select * from stcard where S_Bran=? AND S_No=? AND S_PCode=?`
    const results = await db.pos.query(sql, [S_Bran, S_No, S_PCode])
    return results?.length > 0
  } catch (error) {
    throw new Error(`Database query failed: ${error.message}`);
  }
}

const createStcard = async ({ payload, db }) => {
  try {
    if (!db.pos) {
      throw new Error('Database connection not available');
    }
    const { S_Bran, S_Date, S_No, S_SubNo, S_Que, 
      S_PCode, S_Stk, S_In, S_Out, S_InCost, S_OutCost, S_ACost, S_Rem, 
      S_User, S_EntryDate, S_EntryTime, S_Link, Source_Data, Data_Sync } = payload
    const sql = `INSERT INTO stcard
    (S_Bran, S_Date, S_No, S_SubNo, S_Que, S_PCode, S_Stk, S_In, S_Out, 
    S_InCost, S_OutCost, S_ACost, S_Rem, S_User, S_EntryDate, S_EntryTime, S_Link, 
    Source_Data, Data_Sync)
    VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    const results = await db.pos.query(sql, [
      S_Bran, S_Date, S_No, S_SubNo, S_Que, S_PCode, S_Stk, S_In, S_Out, 
      S_InCost, S_OutCost, S_ACost, S_Rem, S_User, S_EntryDate, S_EntryTime, S_Link, 
      Source_Data, Data_Sync])
    return results
  } catch (error) {
    throw new Error(`Database query failed: ${error.message}`);
  }
}

const updateStcard = async ({ payload, db }) => {
  try {
    if (!db.pos) {
      throw new Error('Database connection not available');
    }
    const { S_Bran, S_Date, S_No, S_SubNo, S_Que, 
      S_PCode, S_Stk, S_In, S_Out, S_InCost, S_OutCost, S_ACost, S_Rem, 
      S_User, S_EntryDate, S_EntryTime, S_Link, Source_Data, Data_Sync } = payload
    const sql = `UPDATE stcard
        SET S_Date=?, S_SubNo=?, S_Que=?, S_Stk=?, 
        S_In=?, S_Out=?, S_InCost=?, S_OutCost=?, S_ACost=?, S_Rem=?, 
        S_User=?, S_EntryDate=?, S_EntryTime=?, S_Link=?, Source_Data=?, Data_Sync=? 
        WHERE S_Bran=? AND S_No=? AND S_PCode=?`
    const results = await db.pos.query(sql, [
      S_Date, S_SubNo, S_Que, S_Stk, 
      S_In, S_Out, S_InCost, S_OutCost, S_ACost, S_Rem, 
      S_User, S_EntryDate, S_EntryTime, S_Link, Source_Data, Data_Sync, 
      S_Bran, S_No, S_PCode])
    return results
  } catch (error) {
    throw new Error(`Database query failed: ${error.message}`);
  }
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
