const { mappingResultDataList } = require("../utils/ConvertThai")
const { convertToMySQLDate, getMoment } = require("../utils/MomentUtil")

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
  const Date_Start = convertToMySQLDate(payload.Date_Start)
  // เลือกแค่วันที่เริ่มต้น -> คิดยอดถึงวันนี้
  const Date_End = convertToMySQLDate(payload.Date_End) || (Date_Start ? getMoment().format('YYYY-MM-DD') : '')
  if (Date_Start && Date_End && Date_Start > Date_End) {
    const error = new Error('วันที่เริ่มต้นต้องไม่มากกว่าวันที่สิ้นสุด')
    error.statusCode = 400
    throw error
  }
  const convPayload = { ...payload, Date_Start, Date_End }
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
