const getData = async ({ db }) => {
  try {
    if (!db.pos) {
      throw new Error('POS database connection not available')
    }

    const sql = `SELECT * FROM company`
    const results = await db.pos.query(sql)
    return results
  } catch (error) {
    throw new Error(`Database query failed: ${error.message}`)
  }
};

module.exports = {
  getData
}
