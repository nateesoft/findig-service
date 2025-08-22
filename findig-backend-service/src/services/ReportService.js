const cache = require('../utils/cache')

const { mappingResultDataList } = require("../utils/ConvertThai")
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

const searchSummaryReport = async ({ repository, db, payload }) => {
  try {
    validatePayload(payload)
    
    const cacheKey = generateCacheKey('searchSummaryReport', payload)

    const cached = cache.get(cacheKey)
    if (cached) {
      console.log('🔄 Cache hit for searchSummaryReport')
      return cached
    }

    console.log('🚀 Cache miss, querying DB for searchSummaryReport')
    
    const results = await repository.searchSummaryReport({ db, payload })
    const mapped = mappingResultDataList(results)
    
    cache.set(cacheKey, mapped, 300) // 5 minutes TTL
    return mapped
  } catch (error) {
    throw new Error(`Service error in searchSummaryReport: ${error.message}`)
  }
}

const searchReportSale = async ({ repository, db, payload }) => {
  try {
    validatePayload(payload)
    
    const cacheKey = generateCacheKey('searchReportSale', payload)

    const cached = cache.get(cacheKey)
    if (cached) {
      console.log('🔄 Cache hit for searchReportSale')
      return cached
    }

    console.log('🚀 Cache miss, querying DB for searchReportSale')
    
    const results = await repository.searchReportSale({ db, payload })
    const mapped = mappingResultDataList(results)
    
    cache.set(cacheKey, mapped, 300) // 5 minutes TTL
    return mapped
  } catch (error) {
    throw new Error(`Service error in searchReportSale: ${error.message}`)
  }
}

const searchReportStcard = async ({ repository, db, payload }) => {
  try {
    validatePayload(payload)
    
    const cacheKey = generateCacheKey('searchReportStcard', payload)

    const cached = cache.get(cacheKey)
    if (cached) {
      console.log('🔄 Cache hit for searchReportStcard')
      return cached
    }

    console.log('🚀 Cache miss, querying DB for searchReportStcard')
    
    const results = await repository.searchReportStcard({ db, payload })
    const mapped = mappingResultDataList(results)
    
    cache.set(cacheKey, mapped, 300) // 5 minutes TTL
    return mapped
  } catch (error) {
    throw new Error(`Service error in searchReportStcard: ${error.message}`)
  }
}

const getReportStkfile = async ({ repository, db, payload }) => {
  try {
    validatePayload(payload)
    
    const cacheKey = generateCacheKey('getReportStkfile', payload)

    const cached = cache.get(cacheKey)
    if (cached) {
      console.log('🔄 Cache hit for getReportStkfile')
      return cached
    }

    console.log('🚀 Cache miss, querying DB for getReportStkfile')
    
    const results = await repository.getReportStkfile({ db, payload })
    const mapped = mappingResultDataList(results)
    
    cache.set(cacheKey, mapped, 300) // 5 minutes TTL
    return mapped
  } catch (error) {
    throw new Error(`Service error in getReportStkfile: ${error.message}`)
  }
}

module.exports = {
  searchSummaryReport,
  searchReportSale,
  searchReportStcard,
  getReportStkfile
}
