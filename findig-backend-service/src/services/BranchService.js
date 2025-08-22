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

const getBranchData = async ({ payload, repository, db }) => {
  try {
    validatePayload(payload)
    
    const cacheKey = generateCacheKey('getBranchData', payload)
    const cached = cache.get(cacheKey)
    if (cached) {
      console.log('🔄 Cache hit for getBranchData')
      return cached
    }

    console.log('🚀 Cache miss, querying DB for getBranchData')
    
    const results = await repository.getData({ payload, db })
    const mapped = mappingResultData(results)
    
    cache.set(cacheKey, mapped, 300) // 5 minutes TTL
    return mapped
  } catch (error) {
    throw new Error(`Service error in getBranchData: ${error.message}`)
  }
};

const findAllBranch = async ({ repository, db }) => {
  try {
    const cacheKey = generateCacheKey('findAllBranch', {})
    
    const cached = cache.get(cacheKey)
    if (cached) {
      console.log('🔄 Cache hit for findAllBranch')
      return cached
    }

    console.log('🚀 Cache miss, querying DB for findAllBranch')
    
    const results = await repository.listAllData({ db })
    const mapped = mappingResultData(results)
    
    cache.set(cacheKey, mapped, 300) // 5 minutes TTL
    return mapped
  } catch (error) {
    throw new Error(`Service error in findAllBranch: ${error.message}`)
  }
};

const findByCode = async ({ payload, repository, db }) => {
  try {
    validatePayload(payload, ['branchCode'])
    
    const cacheKey = generateCacheKey('findByCode', payload)
    const cached = cache.get(cacheKey)
    if (cached) {
      console.log('🔄 Cache hit for findByCode')
      return cached
    }

    console.log('🚀 Cache miss, querying DB for findByCode')
    
    const { branchCode } = payload
    const results = await repository.findByCode({
       payload: {
          code: branchCode
       }, db })

    if (results.length === 0) {
      cache.set(cacheKey, null, 300)
      return null
    }
    
    const mapped = mappingResultData([results[0]])[0]
    cache.set(cacheKey, mapped, 300) // 5 minutes TTL
    return mapped
  } catch (error) {
    throw new Error(`Service error in findByCode: ${error.message}`)
  }
};

module.exports = {
  getBranchData,
  findByCode,
  findAllBranch
}
