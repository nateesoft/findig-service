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

const generateCacheKey = (functionName, payload) => {
  const date = getMoment().format('YYYY-MM-DD')
  const payloadHash = JSON.stringify(payload)
  return `${functionName}_${date}_${Buffer.from(payloadHash).toString('base64').slice(0, 10)}`
}

const DraftSaleDetailsService = require("../services/DraftSaleDetailsService")
const DraftSaleDetailsRepository = require('../repository/DraftSaleDetailsRepository')

const getData = async ({ payload, repository, db }) => {
  try {
    validatePayload(payload)
    
    const cacheKey = generateCacheKey('getData', payload)
    const cached = cache.get(cacheKey)
    if (cached) {
      console.log('🔄 Cache hit for getData')
      return cached
    }

    console.log('🚀 Cache miss, querying DB for getData')
    
    const results = await repository.getData({ payload, db })
    const mapped = mappingResultData(results)
    
    cache.set(cacheKey, mapped, 300) // 5 minutes TTL
    return mapped
  } catch (error) {
    throw new Error(`Service error in getData: ${error.message}`)
  }
}

const getDataForDashboard = async ({ payload, repository, db }) => {
  try {
    validatePayload(payload)
    
    const cacheKey = generateCacheKey('getDataForDashboard', payload)
    const cached = cache.get(cacheKey)
    if (cached) {
      console.log('🔄 Cache hit for getDataForDashboard')
      return cached
    }

    console.log('🚀 Cache miss, querying DB for getDataForDashboard')
    
    const results = await repository.getDataForDashboard({ payload, db })
    const mapped = mappingResultData(results)
    
    cache.set(cacheKey, mapped, 300) // 5 minutes TTL
    return mapped
  } catch (error) {
    throw new Error(`Service error in getDataForDashboard: ${error.message}`)
  }
}

const getDataById = async ({ payload, repository, db }) => {
  try {
    validatePayload(payload)
    
    const cacheKey = generateCacheKey('getDataById', payload)
    const cached = cache.get(cacheKey)
    if (cached) {
      console.log('🔄 Cache hit for getDataById')
      return cached
    }

    console.log('🚀 Cache miss, querying DB for getDataById')
    
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

      const mapped = {
        ...itemHeaders[0],
        items: itemDetails
      }
      
      cache.set(cacheKey, mapped, 300) // 5 minutes TTL
      return mapped
    }

    const emptyResult = []
    cache.set(cacheKey, emptyResult, 300)
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
  } catch (error) {
    throw new Error(`Service error in saveData: ${error.message}`)
  }
}

const updateData = async ({ payload, repository, db }) => {
  try {
    validatePayload(payload, ['saleItems', 'billno', 'empCode'])
    
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
    validatePayload(payload)
    
    const cacheKey = generateCacheKey('searchSaleData', payload)
    const cached = cache.get(cacheKey)
    if (cached) {
      console.log('🔄 Cache hit for searchSaleData')
      return cached
    }

    console.log('🚀 Cache miss, querying DB for searchSaleData')
    
    const results = await repository.searchSaleData({db, payload })
    const mapped = mappingResultDataList(results)
    
    cache.set(cacheKey, mapped, 300) // 5 minutes TTL
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
