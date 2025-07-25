const DraftSaleService = require("../services/DraftSaleService")
const DraftSaleRepository = require("../repository/DraftSaleRepository")

const StockProcessService = require('../services/StockProcessService')

const getData = async (req, res, next) => {
  try {
    const { branchCode } = req.query
    const dataInfo = await DraftSaleService.getData({
      payload: {
        branch_code: branchCode
      },
      repository: DraftSaleRepository,
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
    const dataInfo = await DraftSaleService.getDataForDashboard({
      payload: {
        branch_code: branchCode
      },
      repository: DraftSaleRepository,
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
    const dataInfo = await DraftSaleService.getDataById({
      payload: { id },
      repository: DraftSaleRepository,
      db: req.db
    })
    res.json(dataInfo)
  } catch (error) {
    next(error)
  }
}

const saveData = async (req, res, next) => {
  try {
    const { branchCode, billNo, empCode, totalItem, saleItems } = req.body
    const dataInfo = await DraftSaleService.saveData({
      payload: {
        billno: billNo,
        branch_code: branchCode,
        emp_code: empCode,
        emp_code_update: empCode,
        total_item: totalItem,
        sale_items: saleItems
      },
      repository: DraftSaleRepository,
      db: req.db
    })
    res.json(dataInfo)
  } catch (error) {
    next(error)
  }
}

const updateData = async (req, res, next) => {
  try {
    const dataInfo = await DraftSaleService.updateData({
      payload: { ...req.body },
      repository: DraftSaleRepository,
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
    const dataInfo = await DraftSaleService.deleteData({
      payload: {
        id
      },
      repository: DraftSaleRepository,
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
    const dataInfo = await StockProcessService.processStockFromSale({
      payload: { ...saleInfo },
      repository: DraftSaleRepository,
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
  getDataForDashboard
}
