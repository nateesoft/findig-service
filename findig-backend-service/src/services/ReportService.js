const cache = require('../utils/cache')

const { mappingResultDataList } = require("../utils/ConvertThai")
const { getMoment } = require("../utils/MomentUtil")

const searchSummaryReport = async ({ repository, db }) => {
  const cacheKey = 'searchSummaryReport_'+getMoment().format('YYYY-MM-DD')

  const cached = cache.get(cacheKey)
  if (cached) {
    console.log('🔄 Cache hit')
    return cached;
  } else {
    console.log('🚀 Cache miss, querying DB')
  
    const results = await repository.searchSummaryReport({db })
    const mapped = mappingResultDataList(results)
  
    cache.set(cacheKey, mapped, 60);
    return mapped
  }
}

const searchReportSale = async ({ repository, db }) => {
  const cacheKey = 'searchReportSale_'+getMoment().format('YYYY-MM-DD')

  const cached = cache.get(cacheKey)
  if (cached) {
    console.log('🔄 Cache hit')
    return cached;
  } else {
    console.log('🚀 Cache miss, querying DB')
  
    const results = await repository.searchReportSale({db })
    const mapped = mappingResultDataList(results)
  
    cache.set(cacheKey, mapped, 60);
    return mapped
  }
}

const searchReportStcard = async ({ repository, db }) => {
  const cacheKey = 'getReportStcard_'+getMoment().format('YYYY-MM-DD')

  const cached = cache.get(cacheKey)
  if (cached) {
    console.log('🔄 Cache hit')
    return cached;
  } else {
    console.log('🚀 Cache miss, querying DB')
  
    const results = await repository.searchReportStcard({db })
    const mapped = mappingResultDataList(results)
  
    cache.set(cacheKey, mapped, 60);
    return mapped
  }
}

const getReportStkfile = async ({ repository, db }) => {
  const cacheKey = 'getReportStkfile_'+getMoment().format('YYYY-MM-DD')

  const cached = cache.get(cacheKey)
  if (cached) {
    console.log('🔄 Cache hit')
    return cached;
  } else {
    console.log('🚀 Cache miss, querying DB')
  
    const results = await repository.getReportStkfile({db })
    const mapped = mappingResultDataList(results)
  
    cache.set(cacheKey, mapped, 60);
    return mapped
  }
}

module.exports = {
  searchSummaryReport,
  searchReportSale,
  searchReportStcard,
  getReportStkfile
}
