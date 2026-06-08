const StockOutDetailsService = require("../services/StockOutDetailsService")
const StockOutDetailsRepository = require("../repository/StockOutDetailsRepository")

const getData = async (req, res, next) => {
  try {
    const { branchCode } = req.query
    const dataInfo = await StockOutDetailsService.getData({
      payload: {
        branch_code: branchCode
      },
      repository: StockOutDetailsRepository,
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
    const dataInfo = await StockOutDetailsService.getDataById({
      payload: {
        id
      },
      repository: StockOutDetailsRepository,
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
    const dataInfo = await StockOutDetailsService.saveData({
      payload: {
        billno: billNo, 
        barcode, 
        product_name: productName, 
        stock_code: stockCode, 
        qty, 
        emp_code: empCode, 
        emp_code_update: empCode
      },
      repository: StockOutDetailsRepository,
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
    const dataInfo = await StockOutDetailsService.updateData({
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
      repository: StockOutDetailsRepository,
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
    const dataInfo = await StockOutDetailsService.deleteData({
      payload: { id },
      repository: StockOutDetailsRepository,
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
