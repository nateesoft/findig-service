const { mappingResultData } = require("../utils/ConvertThai")
const { getMoment } = require("../utils/MomentUtil")
const { generateUUID } = require("../utils/StringUtil")

const DraftSaleDetailsService = require("../services/DraftSaleDetailsService")
const DraftSaleDetailsRepository = require('../repository/DraftSaleDetailsRepository')

const getData = async ({ payload, repository, db }) => {
  const results = await repository.getData({ payload, db })
  return mappingResultData(results)
}

const getDataById = async ({ payload, repository, db }) => {
  const results = await repository.getData({ payload, db })
  return mappingResultData(results)
}

const saveData = async ({ payload, repository, db }) => {
  const { sale_items, billno, emp_code } = payload
  const mappingPayload = {
    ...payload,
    id: generateUUID(),
    document_date: getMoment().format('YYYY-MM-DD HH:mm:ss'),
    post_status: 'N',
    update_date: getMoment().format('YYYY-MM-DD HH:mm:ss')
  }
  const results = await repository.saveData({ payload: mappingPayload, db })
  if(results) {
    // save draft sale details
    sale_items.forEach(async sale => {
      await DraftSaleDetailsService.saveData({
        payload: {
          billno: billno, 
          barcode: sale.barcode, 
          product_name: sale.productName, 
          stock_code: sale.stock, 
          qty: sale.qty, 
          emp_code: emp_code,
          emp_code_update: emp_code
        },
        repository: DraftSaleDetailsRepository,
        db
      })
    });
  }
  return results
}

const updateData = async ({ payload, repository, db }) => {
  const mappingPayload = {
    ...payload,
    update_date: getMoment().format('YYYY-MM-DD HH:mm:ss')
  }
  const results = await repository.updateData({ payload: mappingPayload, db })
  return results
}

const deleteData = async ({ payload, repository, db }) => {
  const results = await repository.deleteData({ payload, db })
  return results
}

module.exports = {
  getData,
  getDataById,
  saveData,
  updateData,
  deleteData
}
