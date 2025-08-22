const { mappingResultData, mappingResultDataList } = require("../utils/ConvertThai")
const { getMoment } = require("../utils/MomentUtil")
const { generateUUID } = require("../utils/StringUtil")

const DraftSaleDetailsService = require("../services/DraftSaleDetailsService")
const DraftSaleDetailsRepository = require('../repository/DraftSaleDetailsRepository')

const getAllData = async ({ payload, repository, db }) => {
  const results = await repository.getAllData({ db })
  return mappingResultDataList(results)
}

const getData = async ({ payload, repository, db }) => {
  const results = await repository.getData({ payload, db })
  return mappingResultData(results)
}

const getDataForDashboard = async ({ payload, repository, db }) => {
  const results = await repository.getDataForDashboard({ payload, db })
  return mappingResultData(results)
}

const getDataById = async ({ payload, repository, db }) => {
  const results = await repository.getDataById({ payload, db })
  if(results.length > 0) {
    const resultDetails = await DraftSaleDetailsService.getSaleDetailsByBillNo({ 
      payload: { billno: results[0]?.billno },
      repository: DraftSaleDetailsRepository,
      db
    })
    const list1 = mappingResultData(results)
    const list2 = mappingResultData(resultDetails)

    const itemHeaders = list1.map(item => ({
      ...item,
      billNo: item.billno,
      empCode: item.emp_code,
      empName: item.emp_name,
      branchCode: item.branch_code,
      branchName: item.branch_name,
      totalItem: item.total_item,
      totalAmount: item.total_amount,
      postStatus: item.post_status,
      documentDate: item.document_date,
      updateDate: item.update_date
    }))
    const itemDetails = list2.map(item => ({
      id: item.id,
      billNo: item.billno,
      createDate: item.create_date,
      barcode: item.barcode,
      productName: item.product_name,
      stock: item.stock_code,
      qty: item.qty,
      updateData: item.update_date,
      empCode: item.emp_code,
      empCodeUpdate: item.emp_code_update,
      canStock: item.can_stock,
      canSet: item.can_set
    }))

    return {
      ...itemHeaders[0],
      items: itemDetails
    }
  }

  return []
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
    for (const sale of sale_items) {
      await DraftSaleDetailsService.saveData({
        payload: {
          billno: billno, 
          barcode: sale.barcode, 
          product_name: sale.productName, 
          stock_code: sale.stock, 
          qty: sale.qty, 
          emp_code: emp_code,
          emp_code_update: emp_code,
          can_stock: sale.canStock,
          can_set: sale.canSet
        },
        repository: DraftSaleDetailsRepository,
        db
      })
    };
  }
  return results
}

const updateData = async ({ payload, repository, db }) => {
  const { saleItems, billno, totalItem, empCode } = payload
  const mappingPayload = {
    ...payload,
    total_item: totalItem,
    emp_code_update: empCode,
    update_date: getMoment().format('YYYY-MM-DD HH:mm:ss')
  }
  const results = await repository.updateData({ payload: mappingPayload, db })
  if(results) {
    // delete old sale details
    await DraftSaleDetailsService.deleteDataByBillNo({
      payload: { billno },
      repository: DraftSaleDetailsRepository,
      db
    })
    // save new draft sale details
    for (const sale of saleItems) {
      await DraftSaleDetailsService.saveData({
        payload: {
          billno: billno, 
          barcode: sale.barcode, 
          product_name: sale.productName, 
          stock_code: sale.stock, 
          qty: sale.qty, 
          emp_code: empCode,
          emp_code_update: empCode,
          can_stock: sale.canStock,
          can_set: sale.canSet
        },
        repository: DraftSaleDetailsRepository,
        db
      })
    };
  }
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
  deleteData,
  getDataForDashboard,
  getAllData
}
