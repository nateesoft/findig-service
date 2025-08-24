const { mappingResultDataList } = require("../utils/ConvertThai")

const searchSummaryReport = async ({ repository, db, payload }) => {
  const results = await repository.searchSummaryReport({ db, payload })
  const mapped = mappingResultDataList(results)
  return mapped
}

const searchReportSale = async ({ repository, db, payload }) => {
  const results = await repository.searchReportSale({ db, payload })
  const mapped = mappingResultDataList(results)
  return mapped
}

const searchReportStcard = async ({ repository, db, payload }) => {
  const results = await repository.searchReportStcard({ db, payload })
  const mapped = mappingResultDataList(results)
  return mapped
}

const getReportStkfile = async ({ repository, db, payload }) => {
  const results = await repository.getReportStkfile({ db, payload })
  const mapped = mappingResultDataList(results)
  return mapped
}

module.exports = {
  searchSummaryReport,
  searchReportSale,
  searchReportStcard,
  getReportStkfile
}
