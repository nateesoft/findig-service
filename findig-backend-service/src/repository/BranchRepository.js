const listAll = async ({ payload, db }) => {
  const sql = `SELECT * FROM branch`
  const results = await db.pos.query(sql)
  return results
};

const findByCode = async ({ payload, db }) => {
  const sql = `SELECT * FROM branch where Code = ?`
  const results = await db.pos.query(sql, [payload.Code])
  return results
};

const createData = async ({ payload, db }) => {
  const sql = `SELECT * FROM branch where Code = ?`
  const results = await db.pos.query(sql, [payload.Code])
  return results
};

module.exports = {
  listAll,
  findByCode,
  createData
}