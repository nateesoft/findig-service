const getData = async ({ payload, db }) => {
  const { branch_code } = payload
  const sql = `select * from draft_sale where branch_code=?`
  const results = await db.pos?.query(sql, [branch_code])
  return results
}

const getDataForDashboard = async ({ payload, db }) => {
  const { branch_code } = payload
  const sql = `select * from draft_sale where branch_code=? limit 0, 10`
  const results = await db.pos?.query(sql, [branch_code])
  return results
}

const getDataById = async ({ payload, db }) => {
  const { id } = payload
  const sql = `select * from draft_sale where id=?`
  const results = await db.pos?.query(sql, [id])
  return results
}

const getAllBillNotProcess = async ({ payload, db }) => {
  const { branch_code } = payload
  const sql = `select * from draft_sale where branch_code=? and post_status=?`
  const results = await db.pos?.query(sql, [branch_code, 'N'])
  return results
}

const saveData = async ({ payload, db }) => {
  const { id, billno, document_date, branch_code, post_status, 
    emp_code, update_date, total_item, emp_code_update } = payload
  const sql = `INSERT INTO draft_sale
              (id, billno, document_date, branch_code, post_status, 
              emp_code, update_date, total_item, emp_code_update)
              VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?)`
  const results = await db.pos?.query(sql, 
    [id, billno, document_date, branch_code, post_status, emp_code, update_date, total_item, emp_code_update])
  return results
}

const updateData = async ({ payload, db }) => {
  const { id, branch_code, post_status, emp_code_update, update_date, total_item } = payload
  const sql = `UPDATE draft_sale
              SET branch_code=?, post_status=?, emp_code_update=?, update_date=?, total_item=?
              WHERE id=?`
  const results = await db.pos?.query(sql, 
    [branch_code, post_status, emp_code_update, update_date, total_item, id])
  return results
}

const processStockFromSale = async ({ payload, db }) => {
  const { id } = payload
  const sql = `UPDATE draft_sale SET post_status='Y' WHERE id=?`
  const results = await db.pos?.query(sql, [id])
  return results
}

const deleteData = async ({ payload, db }) => {
  const { id } = payload
  const sql = `DELETE FROM draft_sale WHERE id=?`
  const results = await db.pos?.query(sql, [id])
  return results
}

module.exports = {
  getData,
  getDataById,
  saveData,
  updateData,
  deleteData,
  processStockFromSale,
  getAllBillNotProcess,
  getDataForDashboard
}
