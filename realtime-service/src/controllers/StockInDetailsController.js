const StockInDetailsService = require("../services/StockInDetailsService")
const StockInDetailsRepository = require("../repository/StockInDetailsRepository")

const getData = async (req, res, next) => {
  try {
    const { branchCode } = req.query
    const dataInfo = await StockInDetailsService.getData({
      payload: {
        branch_code: branchCode
      },
      repository: StockInDetailsRepository,
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
    const dataInfo = await StockInDetailsService.getDataById({
      payload: {
        id
      },
      repository: StockInDetailsRepository,
      db: req.db
    })
    res.json(dataInfo)
  } catch (error) {
    next(error)
  }
}

const saveData = async (req, res, next) => {
  try {
    const { billNo, barcode, productName, stockCode, qty, empCode } = req.body
    const dataInfo = await StockInDetailsService.saveData({
      payload: {
        billno: billNo, 
        barcode, 
        product_name: productName, 
        stock_code: stockCode, 
        qty, 
        emp_code: empCode, 
        emp_code_update: empCode
      },
      repository: StockInDetailsRepository,
      db: req.db
    })
    res.json(dataInfo)
  } catch (error) {
    next(error)
  }
}

const updateData = async (req, res, next) => {
  try {
    const { id } = req.params
    const { billNo, barcode, productName, stockCode, qty, empCode } = req.body
    const dataInfo = await StockInDetailsService.updateData({
      payload: {
        billno: billNo, 
        barcode, 
        product_name: productName, 
        stock_code: stockCode, 
        qty, 
        emp_code: empCode, 
        emp_code_update: empCode,
        id
      },
      repository: StockInDetailsRepository,
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
    const dataInfo = await StockInDetailsService.deleteData({
      payload: { id },
      repository: StockInDetailsRepository,
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
  deleteData
}
