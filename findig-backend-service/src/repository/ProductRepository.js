const listAll = async ({ db }) => {
  const sql = `SELECT * FROM product`
  const results = await db.pos.query(sql)
  return results
};

const findByCode = async ({ payload, db }) => {
  const { Code } = payload
  const sql = `SELECT * FROM product where Code = ?`
  const results = await db.pos.query(sql, [Code])
  return results
};

module.exports = {
  listAll,
  findByCode
}