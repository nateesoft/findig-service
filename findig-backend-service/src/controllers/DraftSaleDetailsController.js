const DraftSaleDetailsService = require("../services/DraftSaleDetailsService")
const DraftSaleDetailsRepository = require("../repository/DraftSaleDetailsRepository")

const getData = async (req, res, next) => {
  try {
    const { branchCode } = req.query
    const dataInfo = await DraftSaleDetailsService.getData({
      payload: {
        branch_code: branchCode
      },
      repository: DraftSaleDetailsRepository,
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
    const dataInfo = await DraftSaleDetailsService.getDataById({
      payload: {
        id
      },
      repository: DraftSaleDetailsRepository,
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
    const dataInfo = await DraftSaleDetailsService.saveData({
      payload: {
        billno: billNo, 
        barcode, 
        product_name: productName, 
        stock_code: stockCode, 
        qty, 
        emp_code: empCode, 
        emp_code_update: empCode
      },
      repository: DraftSaleDetailsRepository,
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
    const dataInfo = await DraftSaleDetailsService.updateData({
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
      repository: DraftSaleDetailsRepository,
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
    const dataInfo = await DraftSaleDetailsService.deleteData({
      payload: { id },
      repository: DraftSaleDetailsRepository,
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
