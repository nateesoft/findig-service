const StockInService = require("../services/StockInService")
const StockInRepository = require("../repository/StockInRepository")

const StockInProcessService = require('../services/StockInProcessService')

const getData = async (req, res, next) => {
  try {
    const { branchCode } = req.query
    const dataInfo = await StockInService.getData({
      payload: {
        branch_code: branchCode
      },
      repository: StockInRepository,
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
    const dataInfo = await StockInService.getDataForDashboard({
      payload: {
        branch_code: branchCode
      },
      repository: StockInRepository,
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
    const dataInfo = await StockInService.getDataById({
      payload: { id },
      repository: StockInRepository,
      db: req.db
    })
    res.json(dataInfo)
  } catch (error) {
    next(error)
  }
}

const saveData = async (req, res, next) => {
  try {
    const { branchCode, branchStockInCode, billNo, empCode, totalItem, saleItems } = req.body
    const dataInfo = await StockInService.saveData({
      payload: {
        billno: billNo,
        branch_code: branchCode,
        branch_stock_in_code: branchStockInCode,
        emp_code: empCode,
        emp_code_update: empCode,
        total_item: totalItem,
        sale_items: saleItems
      },
      repository: StockInRepository,
      db: req.db
    })
    res.json(dataInfo)
  } catch (error) {
    next(error)
  }
}

const updateData = async (req, res, next) => {
  try {
    const dataInfo = await StockInService.updateData({
      payload: { ...req.body },
      repository: StockInRepository,
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
    const dataInfo = await StockInService.deleteData({
      payload: {
        id
      },
      repository: StockInRepository,
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
    const dataInfo = await StockInProcessService.processStockFromSale({
      payload: { ...saleInfo },
      db: req.db
    })
    res.json(dataInfo)
  } catch (error) {
    next(error)
  }
}

const searchSaleData = async (req, res, next) => {
  try {
    const dataInfo = await StockInService.searchSaleData({
      payload: req.body,
      repository: StockInRepository,
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
