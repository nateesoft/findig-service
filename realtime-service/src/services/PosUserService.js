const cache = require('../utils/cache')
const { mappingResultData } = require('../utils/ConvertThai')
const { Unicode2ASCII } = require('../utils/StringUtil')
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

const checkLogin = async ({ payload, repository, db }) => {
  try {
    validatePayload(payload)
    
    const cacheKey = generateCacheKey('checkLogin', payload)
    const cached = cache.get(cacheKey)
    if (cached) {
      console.log('🔄 Cache hit for checkLogin')
      return cached
    }

    console.log('🚀 Cache miss, querying DB for checkLogin')
    
    const results = await repository.checkLogin({ payload, db })
    if (results.length > 0) {
        const newResult = mappingResultData(results)
        const mapped = {...newResult[0], Password: ""}
        
        cache.set(cacheKey, mapped, 300) // 5 minutes TTL
        return mapped
    }
    
    cache.set(cacheKey, null, 300)
    return null
  } catch (error) {
    throw new Error(`Service error in checkLogin: ${error.message}`)
  }
}

const processLogout = async ({ payload, repository, db }) => {
  try {
    validatePayload(payload)
    
    const result = await repository.updateUserLogout({ payload, db})
    return result.affectedRows > 0
  } catch (error) {
    throw new Error(`Service error in processLogout: ${error.message}`)
  }
}

const getAllUser = async ({ payload, repository, db }) => {
  try {
    validatePayload(payload)
    
    const cacheKey = generateCacheKey('getAllUser', payload)
    const cached = cache.get(cacheKey)
    if (cached) {
      console.log('🔄 Cache hit for getAllUser')
      return cached
    }

    console.log('🚀 Cache miss, querying DB for getAllUser')
    
    const results = await repository.listAllUser({ db })
    const mapped = mappingResultData(results)
    
    cache.set(cacheKey, mapped, 300) // 5 minutes TTL
    return mapped
  } catch (error) {
    throw new Error(`Service error in getAllUser: ${error.message}`)
  }
};

const searchUserData = async ({ payload, repository, db }) => {
  try {
    validatePayload(payload)
    
    const cacheKey = generateCacheKey('searchUserData', payload)
    const cached = cache.get(cacheKey)
    if (cached) {
      console.log('🔄 Cache hit for searchUserData')
      return cached
    }

    console.log('🚀 Cache miss, querying DB for searchUserData')
    
    const { UserName, Name } = payload

    const results = await repository.searchUser({ db, payload: {
      UserName: UserName,
      Name: Unicode2ASCII(Name)
    } })
    const mapped = mappingResultData(results)
    
    cache.set(cacheKey, mapped, 300) // 5 minutes TTL
    return mapped
  } catch (error) {
    throw new Error(`Service error in searchUserData: ${error.message}`)
  }
};

module.exports = {
    checkLogin,
    processLogout,
    getAllUser,
    searchUserData
}
