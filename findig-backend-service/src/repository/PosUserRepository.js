const checkLogin = async ({ payload, db }) => {
  const { username, password } = payload
    const sql = `select * from posuser where username=? and password=? `
    const results = await db.pos?.query(sql, [username, password])
    return results
}

const updateUserLogout = async ({ payload, db }) => {
  const { username } = payload
  const sql = `update posuser set onact='N' where username=?`
  const resultUpdate = await db.pos?.query(sql, [username])
  return resultUpdate
}

const listAllUser = async ({ db }) => {
  const sql = `SELECT * FROM posuser`
  const results = await db.pos?.query(sql)
  return results
};


module.exports = {
    checkLogin,
    updateUserLogout,
    listAllUser
}
