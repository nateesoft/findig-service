const getData = async ({ payload, db }) => {
  try {
    if (!db.pos) {
      throw new Error('POS database connection not available')
    }

    const sql = `select * from draft_sale_details`
    const results = await db.pos.query(sql)
    return results
  } catch (error) {
    throw new Error(`Database query failed: ${error.message}`)
  }
}

const getDataById = async ({ payload, db }) => {
  try {
    if (!db.pos) {
      throw new Error('POS database connection not available')
    }

    const { id } = payload
    const sql = `select * from draft_sale_details where id=?`
    const results = await db.pos.query(sql, [id])
    return results
  } catch (error) {
    throw new Error(`Database query failed: ${error.message}`)
  }
}

const getDataByBillNo = async ({ payload, db }) => {
  try {
    if (!db.pos) {
      throw new Error('POS database connection not available')
    }

    const { billno } = payload
    const sql = `select * from draft_sale_details where billno=?`
    const results = await db.pos.query(sql, [billno])
    return results
  } catch (error) {
    throw new Error(`Database query failed: ${error.message}`)
  }
}

const saveData = async ({ payload, db }) => {
  try {
    if (!db.pos) {
      throw new Error('POS database connection not available')
    }

    const { id, billno, create_date, barcode, product_name, stock_code, qty, 
          update_date, emp_code, emp_code_update, can_stock, can_set } = payload
    const sql = `INSERT INTO draft_sale_details
              (id, billno, create_date, barcode, product_name, stock_code, qty, update_date, 
              emp_code, emp_code_update, can_stock, can_set)
              VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`
    const results = await db.pos.query(sql, 
      [id, billno, create_date, barcode, product_name, stock_code, qty, 
        update_date, emp_code, emp_code_update, can_stock, can_set])
    return results
  } catch (error) {
    throw new Error(`Database query failed: ${error.message}`)
  }
}

const updateData = async ({ payload, db }) => {
  try {
    if (!db.pos) {
      throw new Error('POS database connection not available')
    }

    const { id, stock_code, qty, update_date, emp_code_update, can_stock, can_set } = payload
    const sql = `UPDATE draft_sale_details
                SET stock_code=?, qty=?, update_date=?, emp_code_update=?,
                can_stock=?, can_set=? 
                WHERE id=?`
    const results = await db.pos.query(sql, 
      [stock_code, qty, update_date, emp_code_update, can_stock, can_set, id])
    return results
  } catch (error) {
    throw new Error(`Database query failed: ${error.message}`)
  }
}

const deleteData = async ({ payload, db }) => {
  try {
    if (!db.pos) {
      throw new Error('POS database connection not available')
    }

    const { id } = payload
    const sql = `DELETE FROM draft_sale_details WHERE id=?`
    const results = await db.pos.query(sql, [id])
    return results
  } catch (error) {
    throw new Error(`Database query failed: ${error.message}`)
  }
}

const deleteDataByBillNo = async ({ payload, db }) => {
  try {
    if (!db.pos) {
      throw new Error('POS database connection not available')
    }

    const { billno } = payload
    const sql = `DELETE FROM draft_sale_details WHERE billno=?`
    const results = await db.pos.query(sql, [billno])
    return results
  } catch (error) {
    throw new Error(`Database query failed: ${error.message}`)
  }
}

module.exports = {
  getData,
  getDataById,
  saveData,
  updateData,
  deleteData,
  getDataByBillNo,
  deleteDataByBillNo
}
