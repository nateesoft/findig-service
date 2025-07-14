const getData = async ({ payload, db }) => {
  const { branch_code } = payload
  const sql = `select * from stcard where BranchCode=?`
  const results = await db.pos.query(sql, [branch_code])
  return results
}

module.exports = {
  getData
}
