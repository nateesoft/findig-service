const cache = require('../utils/cache')
const { mappingResultData } = require('../utils/ConvertThai')
const { getMoment } = require('../utils/MomentUtil')

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

const getCompanyData = async ({ payload, repository, db }) => {
  try {
    validatePayload(payload)
    
    const cacheKey = generateCacheKey('getCompanyData', payload)
    const cached = cache.get(cacheKey)
    if (cached) {
      console.log('🔄 Cache hit for getCompanyData')
      return cached
    }

    console.log('🚀 Cache miss, querying DB for getCompanyData')
    
    const results = await repository.getData({ db })
    const mapped = mappingResultData(results)
    
    cache.set(cacheKey, mapped, 300) // 5 minutes TTL
    return mapped
  } catch (error) {
    throw new Error(`Service error in getCompanyData: ${error.message}`)
  }
};

module.exports = {
  getCompanyData
}
