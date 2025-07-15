const DraftSaleService = require("../services/DraftSaleService")
const DraftSaleRepository = require("../repository/DraftSaleRepository")

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

const getDataById = async (req, res, next) => {
  try {
    const { id } = req.params
    const dataInfo = await DraftSaleService.getDataById({
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
    const { id } = req.params
    const { branchCode, billNo, empCode, totalItem, postStatus } = req.body
    const dataInfo = await DraftSaleService.updateData({
      payload: {
        billno: billNo,
        branch_code: branchCode,
        emp_code_update: empCode,
        total_item: totalItem,
        post_status: postStatus,
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

module.exports = {
  getData,
  getDataById,
  saveData,
  updateData,
  deleteData
}
