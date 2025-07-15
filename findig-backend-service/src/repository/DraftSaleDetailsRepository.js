const getData = async ({ payload, db }) => {
  const { branch_code } = payload
  const sql = `select * from draft_sale_details where branch_code=?`
  const results = await db.pos.query(sql, [branch_code])
  return results
}

const getDataById = async ({ payload, db }) => {
  const { id } = payload
  const sql = `select * from draft_sale_details where id=?`
  const results = await db.pos.query(sql, [id])
  return results
}

const getDataByBillNo = async ({ payload, db }) => {
  const { billno } = payload
  const sql = `select * from draft_sale_details where billno=?`
  const results = await db.pos.query(sql, [billno])
  return results
}

const saveData = async ({ payload, db }) => {
  const { id, billno, create_date, barcode, product_name, stock_code, qty, 
        update_date, emp_code, emp_code_update } = payload
  const sql = `INSERT INTO draft_sale_details
            (id, billno, create_date, barcode, product_name, stock_code, qty, update_date, emp_code, emp_code_update)
            VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`
  const results = await db.pos.query(sql, 
    [id, billno, create_date, barcode, product_name, stock_code, qty, 
      update_date, emp_code, emp_code_update])
  return results
}

const updateData = async ({ payload, db }) => {
  const { id, stock_code, qty, update_date, emp_code_update } = payload
  const sql = `UPDATE draft_sale_details
              SET stock_code=?, qty=?, update_date=?, emp_code_update=? 
              WHERE id=?`
  const results = await db.pos.query(sql, 
    [stock_code, qty, update_date, emp_code_update, id])
  return results
}

const deleteData = async ({ payload, db }) => {
  const { id } = payload
  const sql = `DELETE FROM draft_sale_details WHERE id=?`
  const results = await db.pos.query(sql, [id])
  return results
}

module.exports = {
  getData,
  getDataById,
  saveData,
  updateData,
  deleteData,
  getDataByBillNo
}
