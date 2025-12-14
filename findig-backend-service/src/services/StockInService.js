const cache = require('../utils/cache')
const { mappingResultData, mappingResultDataList } = require("../utils/ConvertThai")
const { getMoment } = require("../utils/MomentUtil")
const { generateUUID } = require("../utils/StringUtil")

const validatePayload = (payload, requiredFields = []) => {
  if (!payload || typeof payload !== 'object') {
    throw new Error('Invalid payload: payload must be an object')
  }
  
  for (const field of requiredFields) {
    if (!payload[field]) {
      throw new Error(`Missing required field: ${field}`)
    }
  }
}

const StockInDetailsService = require("./StockInDetailsService")
const StockInDetailsRepository = require('../repository/StockInDetailsRepository')

const getData = async ({ payload, repository, db }) => {
  try {
    const results = await repository.getData({ payload, db })
    const mapped = mappingResultData(results)
    return mapped
  } catch (error) {
    throw new Error(`Service error in getData: ${error.message}`)
  }
}

const getDataForDashboard = async ({ payload, repository, db }) => {
  try {
    const results = await repository.getDataForDashboard({ payload, db })
    const mapped = mappingResultData(results)
    return mapped
  } catch (error) {
    throw new Error(`Service error in getDataForDashboard: ${error.message}`)
  }
}

const getDataById = async ({ payload, repository, db }) => {
  try {
    const results = await repository.getDataById({ payload, db })
    if(results.length > 0) {
      const resultDetails = await StockInDetailsService.getSaleDetailsByBillNo({ 
        payload: { billno: results[0]?.billno },
        repository: StockInDetailsRepository,
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

      const mapped = {
        ...itemHeaders[0],
        items: itemDetails
      }
      
      return mapped
    }

    const emptyResult = []
    return emptyResult
  } catch (error) {
    throw new Error(`Service error in getDataById: ${error.message}`)
  }
}

const saveData = async ({ payload, repository, db }) => {
  try {
    validatePayload(payload, ['sale_items', 'billno', 'emp_code'])
    
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
      // save stock in details
      for (const sale of sale_items) {
        await StockInDetailsService.saveData({
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
          repository: StockInDetailsRepository,
          db
        })
      };
    }
    return results
  } catch (error) {
    throw new Error(`Service error in saveData: ${error.message}`)
  }
}

const updateData = async ({ payload, repository, db }) => {
  try {
    validatePayload(payload, ['saleItems', 'billno', 'empCode'])
    
    const { saleItems, billno, totalItem, empCode, branchStockInCode } = payload
    const mappingPayload = {
      ...payload,
      total_item: totalItem,
      emp_code_update: empCode,
      branch_stock_in_code: branchStockInCode,
      update_date: getMoment().format('YYYY-MM-DD HH:mm:ss')
    }
    const results = await repository.updateData({ payload: mappingPayload, db })
    if(results) {
      // delete old sale details
      await StockInDetailsService.deleteDataByBillNo({
        payload: { billno },
        repository: StockInDetailsRepository,
        db
      })
      // save new stock in details
      for (const sale of saleItems) {
        await StockInDetailsService.saveData({
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
          repository: StockInDetailsRepository,
          db
        })
      };
    }
    return results
  } catch (error) {
    throw new Error(`Service error in updateData: ${error.message}`)
  }
}

const deleteData = async ({ payload, repository, db }) => {
  try {
    validatePayload(payload)
    
    const results = await repository.deleteData({ payload, db })
    return results
  } catch (error) {
    throw new Error(`Service error in deleteData: ${error.message}`)
  }
}

const searchSaleData = async ({ repository, db, payload }) => {
  try {
    const results = await repository.searchSaleData({db, payload })
    const mapped = mappingResultDataList(results)
    return mapped
  } catch (error) {
    throw new Error(`Service error in searchSaleData: ${error.message}`)
  }
}

module.exports = {
  getData,
  getDataById,
  saveData,
  updateData,
  deleteData,
  getDataForDashboard,
  searchSaleData
}
