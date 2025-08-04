const cache = require('../utils/cache')
const { mappingResultData } = require('../utils/ConvertThai')

const getBranchData = async ({ payload, repository, db }) => {
  const results = await repository.getData({ payload, db })
  return mappingResultData(results)
};

const findAllBranch = async ({ repository, db }) => {
  const cacheKey = 'findAllBranch'

  // 1. check cache
  const cached = cache.get(cacheKey)
  if (cached) {
      console.log('🔄 Cache hit')
      return cached;
  }

  console.log('🚀 Cache miss, querying DB')

  const results = await repository.listAllData({ db })
  const mapped = mappingResultData(results)

  // 3. store to cache
  cache.set(cacheKey, mapped, 600); // TTL = 60 sec
  return mapped
};

const findByCode = async ({ payload, repository, db }) => {
  const { branchCode } = payload
  const results = await repository.findByCode({
     payload: {
        code: branchCode
     }, db })

  if (results.length === 0) return null
    return mappingResultData([results[0]])[0]
};

module.exports = {
  getBranchData,
  findByCode,
  findAllBranch
}
