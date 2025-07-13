const getData = async ({ payload, db }) => {
  const sql = `select * from stcard where BranchCode=?`
  const results = await db.pos.query(sql, [payload.branchCode])
  return results
}

module.exports = {
  getData
}
