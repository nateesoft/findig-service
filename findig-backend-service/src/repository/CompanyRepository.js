const getData = async ({ db }) => {
  const sql = `SELECT * FROM company`
  const results = await db.pos?.query(sql)
  return results
};

module.exports = {
  getData
}
