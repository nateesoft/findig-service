const checkLogin = async ({ payload, db }) => {
  try {
    if (!db.pos) {
      throw new Error('Database connection not available');
    }
    const { username, password } = payload
    const sql = `select * from posuser where username=? and password=? `
    const results = await db.pos.query(sql, [username, password])
    return results
  } catch (error) {
    throw new Error(`Database query failed: ${error.message}`);
  }
}

const updateUserLogout = async ({ payload, db }) => {
  try {
    if (!db.pos) {
      throw new Error('Database connection not available');
    }
    const { username } = payload
    const sql = `update posuser set onact='N' where username=?`
    const resultUpdate = await db.pos.query(sql, [username])
    return resultUpdate
  } catch (error) {
    throw new Error(`Database query failed: ${error.message}`);
  }
}

const listAllUser = async ({ db }) => {
  try {
    if (!db.pos) {
      throw new Error('Database connection not available');
    }
    const sql = `SELECT * FROM posuser`
    const results = await db.pos.query(sql)
    return results
  } catch (error) {
    throw new Error(`Database query failed: ${error.message}`);
  }
};

const searchUser = async ({ db, payload }) => {
  try {
    if (!db.pos) {
      throw new Error('Database connection not available');
    }
    const { UserName, Name } = payload
    let sql = `SELECT * FROM posuser where 1=1 `
    const params = []
    if (UserName) {
      sql += `and Username like ? `
      params.push(`%${UserName}%`)
    }
    if (Name) {
      sql += ` and Name like ? `
      params.push(`%${Name}%`)
    }
    sql += `order by Username `
    const results = await db.pos.query(sql, params)
    return results
  } catch (error) {
    throw new Error(`Database query failed: ${error.message}`);
  }
};

module.exports = {
    checkLogin,
    updateUserLogout,
    listAllUser,
    searchUser
}
