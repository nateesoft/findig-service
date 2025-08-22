const StcardService = require("../services/StcardService")
const StcardRepository = require("../repository/StcardRepository")

const getAllSTCard = async (req, res, next) => {
  try {
    const stcardInfo = await StcardService.getAllSTCard({
      repository: StcardRepository,
      db: req.db
    })
    res.json(stcardInfo)
  } catch (error) {
    next(error)
  }
}

const getReportStcard = async (req, res, next) => {
  try {
    const stcardInfo = await StcardService.getReportStcard({
      repository: StcardRepository,
      db: req.db
    })
    res.json(stcardInfo)
  } catch (error) {
    next(error)
  }
}

const getAllSTCardByCode = async (req, res, next) => {
  const { branchCode } = req.params
  try {
    const stcardInfo = await StcardService.getSTCard({
      repository: StcardRepository,
      db: req.db,
      branchCode
    })
    res.json(stcardInfo)
  } catch (error) {
    next(error)
  }
}

const processStock = async (req, res, next) => {
  try {
    const stcardInfo = await StcardService.processStock({
      payload: req.body,
      repository: StcardRepository,
      db: req.db
    })
    res.json(stcardInfo)
  } catch (error) {
    next(error)
  }
}

const searchStCardData = async (req, res, next) => {
  try {
    const payload = req.body
    const stcardInfo = await StcardService.searchStCardData({
      repository: StcardRepository,
      db: req.db,
      payload
    })
    res.json(stcardInfo)
  } catch (error) {
    next(error)
  }
}


module.exports = {
  getAllSTCard,
  processStock,
  getAllSTCardByCode,
  searchStCardData,
  getReportStcard
}
