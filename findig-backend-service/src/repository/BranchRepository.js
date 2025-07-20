const listAll = async ({ db }) => {
  const sql = `SELECT * FROM branch`
  const results = await db.pos?.query(sql)
  return results
};

const findByCode = async ({ payload, db }) => {
  const { code } = payload
  const sql = `SELECT * FROM branch where Code = ?`
  const results = await db.pos?.query(sql, [code])
  return results
};

module.exports = {
  listAll,
  findByCode
}