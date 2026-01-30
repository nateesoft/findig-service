const cache = require('../utils/cache')
const { mappingResultData, mappingResultDataList } = require("../utils/ConvertThai")
const { getMoment } = require("../utils/MomentUtil")

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

const getSTCard = async ({ branchCode, repository, db }) => {
  try {
    const payload = { branchCode }
    validatePayload(payload, ['branchCode'])
    
    const cacheKey = generateCacheKey('getSTCard', payload)
    const cached = cache.get(cacheKey)
    if (cached) {
      console.log('🔄 Cache hit for getSTCard')
      return cached
    }

    console.log('🚀 Cache miss, querying DB for getSTCard')
    
    const results = await repository.getData({payload: { 
      S_Bran: branchCode 
    }, db })
    const mapped = mappingResultData(results)

    cache.set(cacheKey, mapped, 300) // 5 minutes TTL
    return mapped
  } catch (error) {
    throw new Error(`Service error in getSTCard: ${error.message}`)
  }
}

const getAllSTCard = async ({ repository, db }) => {
  try {
    const cacheKey = generateCacheKey('getAllSTCard', {})
    const cached = cache.get(cacheKey)
    if (cached) {
      console.log('🔄 Cache hit for getAllSTCard')
      return cached
    }

    console.log('🚀 Cache miss, querying DB for getAllSTCard')
    
    const results = await repository.getAllData({db })
    const mapped = mappingResultData(results)
    
    cache.set(cacheKey, mapped, 300) // 5 minutes TTL
    return mapped
  } catch (error) {
    throw new Error(`Service error in getAllSTCard: ${error.message}`)
  }
}

const getReportStcard = async ({ repository, db }) => {
  try {
    const cacheKey = generateCacheKey('getReportStcard', {})
    const cached = cache.get(cacheKey)
    if (cached) {
      console.log('🔄 Cache hit for getReportStcard')
      return cached
    }

    console.log('🚀 Cache miss, querying DB for getReportStcard')
    
    const results = await repository.getReportStcard({db })
    const mapped = mappingResultDataList(results)
    
    cache.set(cacheKey, mapped, 300) // 5 minutes TTL
    return mapped
  } catch (error) {
    throw new Error(`Service error in getReportStcard: ${error.message}`)
  }
}

const searchStCardData = async ({ repository, db, payload }) => {
  try {
    validatePayload(payload)
    
    const cacheKey = generateCacheKey('searchStCardData', payload)
    const cached = cache.get(cacheKey)
    if (cached) {
      console.log('🔄 Cache hit for searchStCardData')
      return cached
    }

    console.log('🚀 Cache miss, querying DB for searchStCardData')
    
    const results = await repository.searchData({db, payload })
    const mapped = mappingResultData(results)
    
    cache.set(cacheKey, mapped, 300) // 5 minutes TTL
    return mapped
  } catch (error) {
    throw new Error(`Service error in searchStCardData: ${error.message}`)
  }
}

const processStock = async ({ payload, repository, db }) => {
  try {
    validatePayload(payload, ['billInfo', 'sale_items'])
    
    const { billInfo, sale_items } = payload
    for (const [index, item] of sale_items.entries()) {
      const existing = await repository.findByBillNoPCode({
        payload: {
          S_Bran: billInfo.branch_code,
          S_No: billInfo.billno,
          S_PCode: item.barcode
        },
        db
      })

      const stcard = {
        S_Bran: billInfo.branch_code,
        S_Date: getMoment(item.create_date).format('YYYY-MM-DD HH:mm:ss'),
        S_No: billInfo.billno,
        S_SubNo: "",
        S_Que: (index + 1),
        S_PCode: item.barcode,
        S_Stk: item.stock_code,
        S_In: 0,
        S_Out: item.qty,
        S_InCost: 0,
        S_OutCost: 0,
        S_ACost: 0,
        S_Rem: "SAL",
        S_User: item.emp_code_update,
        S_EntryDate: getMoment().format('YYYY-MM-DD'),
        S_EntryTime: getMoment().format('HH:mm:ss'),
        S_Link: "",
        Source_Data: "WEB",
        Data_Sync: "N"
      }

      if (existing) {
        await repository.updateStcard({ payload: { ...stcard }, db })
      } else {
        await repository.createStcard({ payload: { ...stcard }, db })
      }
    }

    return true
  } catch (error) {
    throw new Error(`Service error in processStock: ${error.message}`)
  }
}

const processStockTranfer = async ({ payload, repository, db, stockTranType }) => {
  try {
    validatePayload(payload, ['billInfo', 'sale_items'])

    let stockRem = null
    if(stockTranType == 'stock-in') {
      stockRem = 'TRI_HQ'
    } else if(stockTranType == 'stock-out') {
      stockRem = 'TRO_HQ'
    } else {
      throw new Error('Invalid stockTranType: must be "stock-in" or "stock-out"')
    }
    
    const { billInfo, sale_items } = payload
    for (const [index, item] of sale_items.entries()) {
      const existing = await repository.findByBillNoPCode({
        payload: {
          S_Bran: billInfo.branch_code,
          S_No: billInfo.billno,
          S_PCode: item.barcode
        },
        db
      })

      let stockInQty = 0
      let stockOutQty = 0
      let inCost = 0
      let outCost = 0
      if(stockTranType == 'stock-in') {
        stockInQty = item.qty || 0
        inCost = item.product_price || 0
      } else if(stockTranType == 'stock-out') {
        stockOutQty = item.qty || 0
        outCost = item.product_price || 0
      }

      const stcard = {
        S_Bran: billInfo.branch_code,
        S_Date: getMoment(item.create_date).format('YYYY-MM-DD HH:mm:ss'),
        S_No: billInfo.billno,
        S_SubNo: "",
        S_Que: (index + 1),
        S_PCode: item.barcode,
        S_Stk: item.stock_code,
        S_In: stockInQty,
        S_Out: stockOutQty,
        S_InCost: inCost,
        S_OutCost: outCost,
        S_ACost: 0,
        S_Rem: stockRem,
        S_User: item.emp_code_update,
        S_EntryDate: getMoment().format('YYYY-MM-DD'),
        S_EntryTime: getMoment().format('HH:mm:ss'),
        S_Link: "",
        Source_Data: "WEB",
        Data_Sync: "N"
      }

      if (existing) {
        await repository.updateStcard({ payload: { ...stcard }, db })
      } else {
        await repository.createStcard({ payload: { ...stcard }, db })
      }
    }

    return true
  } catch (error) {
    throw new Error(`Service error in processStock: ${error.message}`)
  }
}

module.exports = {
  getSTCard,
  getAllSTCard,
  processStock,
  searchStCardData,
  getReportStcard,
  processStockTranfer
}
