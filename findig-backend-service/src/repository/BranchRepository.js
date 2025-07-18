const listAll = async ({ db }) => {
  const sql = `SELECT * FROM branch`
  const results = await db.pos?.query(sql)
  return results
};

const findByCode = async ({ payload, db }) => {
  const { Code } = payload
  const sql = `SELECT * FROM branch where Code = ?`
  const results = await db.pos?.query(sql, [Code])
  return results
};

const createData = async ({ payload, db }) => {
  const { Code } = payload
  const sql = `SELECT * FROM branch where Code = ?`
  const results = await db.pos?.query(sql, [Code])
  return results
};

module.exports = {
  listAll,
  findByCode,
  createData
}