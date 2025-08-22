const ReportService = require("../services/ReportService")
const ReportRepository = require("../repository/ReportRepository")

const searchSummaryReport = async (req, res, next) => {
  try {
    const response = await ReportService.searchSummaryReport({
      repository: ReportRepository,
      db: req.db,
      payload: req.body
    })
    res.json(response)
  } catch (error) {
    next(error)
  }
}
const searchReportSale = async (req, res, next) => {
  try {
    const response = await ReportService.searchReportSale({
      repository: ReportRepository,
      db: req.db,
      payload: req.body
    })
    res.json(response)
  } catch (error) {
    next(error)
  }
}
const searchReportStcard = async (req, res, next) => {
  try {
    const response = await ReportService.searchReportStcard({
      repository: ReportRepository,
      db: req.db,
      payload: req.body
    })
    res.json(response)
  } catch (error) {
    next(error)
  }
}
const getReportStkfile = async (req, res, next) => {
  try {
    const response = await ReportService.getReportStkfile({
      repository: ReportRepository,
      db: req.db,
      payload: req.body
    })
    res.json(response)
  } catch (error) {
    next(error)
  }
}

module.exports = {
  searchSummaryReport,
  searchReportSale,
  searchReportStcard,
  getReportStkfile
}
