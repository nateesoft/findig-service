const StockOutService = require("../services/StockOutService")
const StockOutRepository = require("../repository/StockOutRepository")

const StockOutProcessService = require('../services/StockOutProcessService')

const getData = async (req, res, next) => {
  try {
    const { branchCode } = req.query
    const dataInfo = await StockOutService.getData({
      payload: {
        branch_code: branchCode
      },
      repository: StockOutRepository,
      db: req.db
    })
    res.json(dataInfo)
  } catch (error) {
    next(error)
  }
}

const getDataForDashboard = async (req, res, next) => {
  try {
    const { branchCode } = req.query
    const dataInfo = await StockOutService.getDataForDashboard({
      payload: {
        branch_code: branchCode
      },
      repository: StockOutRepository,
      db: req.db
    })
    res.json(dataInfo)
  } catch (error) {
    next(error)
  }
}

const getDataById = async (req, res, next) => {
  try {
    const { id } = req.params
    const dataInfo = await StockOutService.getDataById({
      payload: { id },
      repository: StockOutRepository,
      db: req.db
    })
    res.json(dataInfo)
  } catch (error) {
    next(error)
  }
}

const saveData = async (req, res, next) => {
  try {
    const { branchCode, branchStockOutCode, billNo, empCode, totalItem, saleItems } = req.body
    const dataInfo = await StockOutService.saveData({
      payload: {
        billno: billNo,
        branch_code: branchCode,
        branch_stock_out_code: branchStockOutCode,
        emp_code: empCode,
        emp_code_update: empCode,
        total_item: totalItem,
        sale_items: saleItems
      },
      repository: StockOutRepository,
      db: req.db
    })
    res.json(dataInfo)
  } catch (error) {
    next(error)
  }
}

const updateData = async (req, res, next) => {
  try {
    const dataInfo = await StockOutService.updateData({
      payload: { ...req.body },
      repository: StockOutRepository,
      db: req.db
    })
    res.json(dataInfo)
  } catch (error) {
    next(error)
  }
}

const deleteData = async (req, res, next) => {
  try {
    const { id } = req.params
    const dataInfo = await StockOutService.deleteData({
      payload: {
        id
      },
      repository: StockOutRepository,
      db: req.db
    })
    res.json(dataInfo)
  } catch (error) {
    next(error)
  }
}

const processStockFromSale = async (req, res, next) => {
  try {
    const { saleInfo } = req.body
    const dataInfo = await StockOutProcessService.processStockFromSale({
      payload: { ...saleInfo },
      repository: StockOutRepository,
      db: req.db
    })
    res.json(dataInfo)
  } catch (error) {
    next(error)
  }
}

const searchSaleData = async (req, res, next) => {
  try {
    const dataInfo = await StockOutService.searchSaleData({
      payload: req.body,
      repository: StockOutRepository,
      db: req.db
    })
    res.json(dataInfo)
  } catch (error) {
    next(error)
  }
}

module.exports = {
  getData,
  getDataById,
  saveData,
  updateData,
  deleteData,
  processStockFromSale,
  getDataForDashboard,
  searchSaleData
}
