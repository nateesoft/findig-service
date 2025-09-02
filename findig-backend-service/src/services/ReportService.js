const { mappingResultDataList } = require("../utils/ConvertThai")
const { convertToMySQLDate } = require("../utils/MomentUtil")

const searchSummaryReport = async ({ repository, db, payload }) => {
  const results = await repository.searchSummaryReport({ db, payload })
  const mapped = mappingResultDataList(results)
  return mapped
}

const searchReportSale = async ({ repository, db, payload }) => {
  const { dateFrom, dateTo} = payload
  const convPayload = { 
    ...payload, 
    dateFrom: convertToMySQLDate(dateFrom),
    dateTo: convertToMySQLDate(dateTo) 
  }
  const results = await repository.searchReportSale({ db, payload: convPayload })
  const mapped = mappingResultDataList(results)
  return mapped
}

const searchReportStcard = async ({ repository, db, payload }) => {
  const {S_Date_Start, S_Date_End} = payload
  const convPayload = { 
    ...payload, 
    S_Date_Start: convertToMySQLDate(S_Date_Start),
    S_Date_End: convertToMySQLDate(S_Date_End) }
  const results = await repository.searchReportStcard({ db, payload: convPayload })
  const mapped = mappingResultDataList(results)
  return mapped
}

const getReportStkfile = async ({ repository, db, payload }) => {
  const { Date_Start, Date_End} = payload
  const convPayload = { 
    ...payload, 
    Date_Start: convertToMySQLDate(Date_Start),
    Date_End: convertToMySQLDate(Date_End) 
  }
  const results = await repository.getReportStkfile({ db, payload: convPayload })
  const mapped = mappingResultDataList(results)
  return mapped
}

module.exports = {
  searchSummaryReport,
  searchReportSale,
  searchReportStcard,
  getReportStkfile
}
