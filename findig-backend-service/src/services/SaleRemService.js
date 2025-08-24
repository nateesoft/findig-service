const cache = require('../utils/cache')
const { mappingResultData } = require('../utils/ConvertThai')
const { getMoment } = require('../utils/MomentUtil')

const generateCacheKey = (functionName, payload) => {
  const date = getMoment().format('YYYY-MM-DD')
  const payloadHash = JSON.stringify(payload)
  return `${functionName}_${date}_${Buffer.from(payloadHash).toString('base64').slice(0, 10)}`
}

const getAllSaleRemData = async ({ repository, db }) => {
  try {
    const cacheKey = generateCacheKey('getAllSaleRemData', {})
    const cached = cache.get(cacheKey)
    if (cached) {
      console.log('🔄 Cache hit for getAllSaleRemData')
      return cached
    }

    console.log('🚀 Cache miss, querying DB for getAllSaleRemData')
    
    const results = await repository.getAllData({ db })
    const mapped = mappingResultData(results)
    
    cache.set(cacheKey, mapped, 300) // 5 minutes TTL
    return mapped
  } catch (error) {
    throw new Error(`Service error in getAllGroupFile: ${error.message}`)
  }
};

module.exports = {
  getAllSaleRemData
}
