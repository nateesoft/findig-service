const listAll = async ({ db }) => {
  try {
    if (!db.pos) {
      throw new Error('Database connection not available');
    }
    const sql = `SELECT PCode, PDesc, PStock, PSet FROM product`
    const results = await db.pos.query(sql)
    return results
  } catch (error) {
    throw new Error(`Database query failed: ${error.message}`);
  }
};

const searchProduct = async ({ db, searchText }) => {
  try {
    if (!db.pos) {
      throw new Error('Database connection not available');
    }
    const sql = `SELECT PCode, PDesc, PStock, PSet FROM product 
      where PCode like '%${searchText}%' or PDesc like '%${searchText}%' 
      limit 10`
    const results = await db.pos.query(sql)
    return results
  } catch (error) {
    throw new Error(`Database query failed: ${error.message}`);
  }
};

const findByCode = async ({ payload, db }) => {
  try {
    if (!db.pos) {
      throw new Error('Database connection not available');
    }
    const { Code } = payload
    const sql = `SELECT * FROM product where Code = ?`
    const results = await db.pos.query(sql, [Code])
    return results
  } catch (error) {
    throw new Error(`Database query failed: ${error.message}`);
  }
};

module.exports = {
  listAll,
  findByCode,
  searchProduct
}