const getData = async ({ payload, db }) => {
  const { Code } = payload
  const sql = `SELECT * FROM branfile where Code=? `
  const results = await db.pos?.query(sql, [Code])
  return results
};

const listAllData = async ({ db }) => {
  const sql = `SELECT * FROM branfile order by Code`
  const results = await db.pos?.query(sql)
  return results
};

const findByCode = async ({ payload, db }) => {
  const { code } = payload
  const sql = `SELECT * FROM branfile where Code = ?`
  const results = await db.pos?.query(sql, [code])
  return results
};

module.exports = {
  getData,
  listAllData,
  findByCode
}