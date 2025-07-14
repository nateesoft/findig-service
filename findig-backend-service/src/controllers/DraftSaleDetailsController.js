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
    const { id } = req.query
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
    const { branchCode, billNo, empCode, totalItem } = req.body
    const dataInfo = await DraftSaleDetailsService.saveData({
      payload: {
        billno: billNo,
        branch_code: branchCode,
        emp_code: empCode,
        emp_code_update: empCode,
        total_item: totalItem
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
    const { id, branchCode, billNo, empCode, totalItem, postStatus } = req.body
    const dataInfo = await DraftSaleDetailsService.updateData({
      payload: {
        billno: billNo,
        branch_code: branchCode,
        emp_code_update: empCode,
        total_item: totalItem,
        post_status: postStatus,
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
    const { id } = req.body
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
