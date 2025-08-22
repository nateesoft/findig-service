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

const searchProduct = async ({ repository, db, searchText }) => {
  try {
    const payload = { searchText }
    validatePayload(payload)
    
    const cacheKey = generateCacheKey('searchProduct', payload)
    const cached = cache.get(cacheKey)
    if (cached) {
      console.log('🔄 Cache hit for searchProduct')
      return cached
    }

    console.log('🚀 Cache miss, querying DB for searchProduct')
    
    const results = await repository.searchProduct({ db, searchText })
    const mapped = mappingResultData(results)
    
    cache.set(cacheKey, mapped, 300) // 5 minutes TTL
    return mapped
  } catch (error) {
    throw new Error(`Service error in searchProduct: ${error.message}`)
  }
};

module.exports = {
  searchProduct
}
