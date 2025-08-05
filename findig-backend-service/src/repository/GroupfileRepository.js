const getData = async ({ db }) => {
  const sql = `SELECT * FROM groupfile order by GroupCode`
  const results = await db.pos?.query(sql)
  return results
};

module.exports = {
  getData
}
