const getAllData = async ({ db }) => {
  try {
    if (!db.pos) {
      throw new Error('POS database connection not available')
    }

    const sql = `select * from stock_in`
    const results = await db.pos.query(sql)
    return results
  } catch (error) {
    throw new Error(`Database query failed: ${error.message}`)
  }
}

const getData = async ({ payload, db }) => {
  try {
    if (!db.pos) {
      throw new Error('POS database connection not available')
    }

    const { branch_code } = payload
    const sql = `select * from stock_in where branch_code=?`
    const results = await db.pos.query(sql, [branch_code])
    return results
  } catch (error) {
    throw new Error(`Database query failed: ${error.message}`)
  }
}

const searchSaleData = async ({ payload, db }) => {
  try {
    if (!db.pos) {
      throw new Error('POS database connection not available')
    }

    const { billno, document_date_start, document_date_end, branch_code, emp_code, post_status } = payload
    let sql = `select * from stock_in where 1=1 `
    const params = []

    if (billno) {
      sql += `and billno like ? `
      params.push(`%${billno}%`)
    }
    if (document_date_start && document_date_end) {
      sql += `and document_date between ? and ? `
      params.push(`${document_date_start} 00:00:00`, `${document_date_end} 23:59:59`)
    }
    if (branch_code) {
      sql += `and branch_code = ? `
      params.push(branch_code)
    }
    if (emp_code) {
      sql += `and emp_code like ? `
      params.push(`%${emp_code}%`)
    }
    if (post_status) {
      sql += `and post_status = ? `
      params.push(post_status)
    }
    sql += `order by branch_code, document_date, billno`
    
    const results = await db.pos.query(sql, params)
    return results
  } catch (error) {
    throw new Error(`Database query failed: ${error.message}`)
  }
}

const getDataForDashboard = async ({ payload, db }) => {
  try {
    if (!db.pos) {
      throw new Error('POS database connection not available')
    }

    const { branch_code } = payload
    const sql = `select * from stock_in where branch_code=? limit 0, 10`
    const results = await db.pos.query(sql, [branch_code])
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
    const sql = `select * from stock_in where id=?`
    const results = await db.pos.query(sql, [id])
    return results
  } catch (error) {
    throw new Error(`Database query failed: ${error.message}`)
  }
}

const getAllBillNotProcess = async ({ payload, db }) => {
  try {
    if (!db.pos) {
      throw new Error('POS database connection not available')
    }

    const { branch_code } = payload
    const sql = `select * from stock_in where branch_code=? and post_status=?`
    const results = await db.pos.query(sql, [branch_code, 'N'])
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

    const { id, billno, document_date, branch_code, post_status, 
      emp_code, update_date, total_item, emp_code_update, branch_stock_in_code } = payload
    const sql = `INSERT INTO stock_in
                (id, billno, document_date, branch_code, post_status, 
                emp_code, update_date, total_item, emp_code_update, branch_stock_in_code)
                VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    const results = await db.pos.query(sql, 
      [id, billno, document_date, branch_code, post_status, emp_code, update_date, total_item, emp_code_update, branch_stock_in_code])
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

    const { id, branch_code, post_status, emp_code_update, update_date, total_item, branch_stock_in_code } = payload
    const sql = `UPDATE stock_in
                SET branch_code=?, post_status=?, emp_code_update=?, update_date=?, total_item=?, branch_stock_in_code=?
                WHERE id=?`
    const results = await db.pos.query(sql, 
      [branch_code, post_status, emp_code_update, update_date, total_item, branch_stock_in_code, id])
    return results
  } catch (error) {
    throw new Error(`Database query failed: ${error.message}`)
  }
}

const processStockFromSale = async ({ payload, db }) => {
  try {
    if (!db.pos) {
      throw new Error('POS database connection not available')
    }

    const { id } = payload
    const sql = `UPDATE stock_in SET post_status='Y' WHERE id=?`
    const results = await db.pos.query(sql, [id])
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
    const sql = `DELETE FROM stock_in WHERE id=?`
    const results = await db.pos.query(sql, [id])
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
  processStockFromSale,
  getAllBillNotProcess,
  getDataForDashboard,
  getAllData,
  searchSaleData
}
