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

const CompanyService = require('../services/CompanyService')
const CompanyRepository = require('../repository/CompanyRepository')

const getSTKFile = async ({ branchCode, repository, db }) => {
  try {
    const payload = { branchCode }
    validatePayload(payload, ['branchCode'])
    
    const cacheKey = generateCacheKey('getSTKFile', payload)
    const cached = cache.get(cacheKey)
    if (cached) {
      console.log('🔄 Cache hit for getSTKFile')
      return cached
    }

    console.log('🚀 Cache miss, querying DB for getSTKFile')
    
    const results = await repository.getData({ payload: {
      Branch: branchCode
    }, db })
    const mapped = mappingResultData(results)

    cache.set(cacheKey, mapped, 300) // 5 minutes TTL
    return mapped
  } catch (error) {
    throw new Error(`Service error in getSTKFile: ${error.message}`)
  }
}

const getAllSTKFile = async ({ repository, db }) => {
  try {
    const cacheKey = generateCacheKey('getAllSTKFile', {})
    const cached = cache.get(cacheKey)
    if (cached) {
      console.log('🔄 Cache hit for getAllSTKFile')
      return cached
    }

    console.log('🚀 Cache miss, querying DB for getAllSTKFile')
    
    const results = await repository.getAllData({ db })
    const mapped = mappingResultData(results)
    
    cache.set(cacheKey, mapped, 300) // 5 minutes TTL
    return mapped
  } catch (error) {
    throw new Error(`Service error in getAllSTKFile: ${error.message}`)
  }
}

const getReportStkfile = async ({ repository, db }) => {
  try {
    const cacheKey = generateCacheKey('getReportStkfile', {})
    const cached = cache.get(cacheKey)
    if (cached) {
      console.log('🔄 Cache hit for getReportStkfile')
      return cached
    }

    console.log('🚀 Cache miss, querying DB for getReportStkfile')
    
    const results = await repository.getReportStkfile({ db })
    const mapped = mappingResultDataList(results)
    
    cache.set(cacheKey, mapped, 300) // 5 minutes TTL
    return mapped
  } catch (error) {
    throw new Error(`Service error in getReportStkfile: ${error.message}`)
  }
}

const searchStkFileData = async ({ repository, db, payload }) => {
  try {
    validatePayload(payload)
    
    const cacheKey = generateCacheKey('searchStkFileData', payload)
    const cached = cache.get(cacheKey)
    if (cached) {
      console.log('🔄 Cache hit for searchStkFileData')
      return cached
    }

    console.log('🚀 Cache miss, querying DB for searchStkFileData')
    
    const results = await repository.searchData({ db, payload })
    const mapped = mappingResultData(results)
    
    cache.set(cacheKey, mapped, 300) // 5 minutes TTL
    return mapped
  } catch (error) {
    throw new Error(`Service error in searchStkFileData: ${error.message}`)
  }
}

const getAllSTKFileByCode = async ({ repository, db, payload }) => {
  try {
    validatePayload(payload, ['branchCode'])
    
    const cacheKey = generateCacheKey('getAllSTKFileByCode', payload)
    const cached = cache.get(cacheKey)
    if (cached) {
      console.log('🔄 Cache hit for getAllSTKFileByCode')
      return cached
    }

    console.log('🚀 Cache miss, querying DB for getAllSTKFileByCode')
    
    const { branchCode } = payload
    const results = await repository.getData({ db, branchCode })
    const mapped = mappingResultData(results)
    
    cache.set(cacheKey, mapped, 300) // 5 minutes TTL
    return mapped
  } catch (error) {
    throw new Error(`Service error in getAllSTKFileByCode: ${error.message}`)
  }
}

const GetActionMon = async ({ db }) => {
  try {
    const Company = await CompanyService.getCompanyData({
      payload: {},
      repository: CompanyRepository,
      db
    })
    let TempYear = Company.Accterm ? getMoment(Company.Accterm).format("YYYY") : getMoment().format("YYYY")
    let CurYear = getMoment().format('YYYY')
    let CurMonth = getMoment().format('MM')

    let responseMonth = 0
    if (TempYear === CurYear) {
        responseMonth = parseInt(CurMonth) + 12
    } else {
        if (parseInt(CurYear) === parseInt(TempYear) - 1) {
            responseMonth = parseInt(CurMonth)
        } else {
            responseMonth = 0
        }
    }
    return responseMonth
  } catch (error) {
    throw new Error(`Service error in GetActionMon: ${error.message}`)
  }
}

const processStock = async ({ payload, repository, db }) => {
  try {
    validatePayload(payload, ['billInfo', 'sale_items'])
    
    const { billInfo, sale_items } = payload
    for (const product of sale_items) {
      if(product.can_stock === 'Y') {
        let actionMon = await GetActionMon({ db });
        const existing = await repository.findByProductStockCode({
          payload: {
            Branch: billInfo.branch_code,
            BPCode: product.barcode,
            BStk: product.stock_code
          },
          db
        })
    
        const stkfile = {
          Branch: billInfo.branch_code,
          BPCode: product.barcode,
          BStk: product.stock_code,
          BQty: 0,
          BAmt: 0,
          BTotalAmt: 0,
          BQty0: 0,
          BQty1: 0,
          BQty2: 0,
          BQty3: 0,
          BQty4: 0,
          BQty5: 0,
          BQty6: 0,
          BQty7: 0,
          BQty8: 0,
          BQty9: 0,
          BQty10: 0,
          BQty11: 0,
          BQty12: 0,
          BQty13: 0,
          BQty14: 0,
          BQty15: 0,
          BQty16: 0,
          BQty17: 0,
          BQty18: 0,
          BQty19: 0,
          BQty20: 0,
          BQty21: 0,
          BQty22: 0,
          BQty23: 0,
          BQty24: 0,
          SendToPOS: "N",
          LastUpdate: getMoment().format("YYYY-MM-DD"),
          LastTimeUpdate: getMoment().format("HH:mm:ss")
        }
    
        if(!existing) {
          await repository.createStkFile({ payload: { ...stkfile }, db })
        }

        const qtyAdjust = product.qty
        for (let i = actionMon; i <= 24; i++) {
          stkfile[`BQty${i}`] = qtyAdjust
        }
        
        await repository.updateStkFile({ payload: { ...stkfile }, db })
      }
    }

    return true
  } catch (error) {
    throw new Error(`Service error in processStock: ${error.message}`)
  }
}

module.exports = {
  getSTKFile,
  getAllSTKFile,
  processStock,
  getAllSTKFileByCode,
  searchStkFileData,
  getReportStkfile
}
