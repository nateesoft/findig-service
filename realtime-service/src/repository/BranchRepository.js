const getData = async ({ payload, db }) => {
  try {
    if (!db.pos) {
      throw new Error('POS database connection not available')
    }

    const { Code } = payload
    const sql = `SELECT * FROM branfile where Code = ?`
    const results = await db.pos.query(sql, [Code])
    return results
  } catch (error) {
    throw new Error(`Database query failed: ${error.message}`)
  }
};

const listAllData = async ({ db }) => {
  try {
    if (!db.pos) {
      throw new Error('POS database connection not available')
    }

    const sql = `SELECT * FROM branfile order by Code`
    const results = await db.pos.query(sql)
    return results
  } catch (error) {
    throw new Error(`Database query failed: ${error.message}`)
  }
};

const findByCode = async ({ payload, db }) => {
  try {
    if (!db.pos) {
      throw new Error('POS database connection not available')
    }

    const { code } = payload
    const sql = `SELECT * FROM branfile where Code = ?`
    const results = await db.pos.query(sql, [code])
    return results
  } catch (error) {
    throw new Error(`Database query failed: ${error.message}`)
  }
};

module.exports = {
  getData,
  listAllData,
  findByCode
}