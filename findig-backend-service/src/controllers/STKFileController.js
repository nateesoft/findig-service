const STKFileService = require("../services/StkfileService")
const StkfileRepository = require("../repository/StkfileRepository")

const getAllSTKFile = async (req, res, next) => {
  try {
    const stkfileInfo = await STKFileService.getAllSTKFile({
      repository: StkfileRepository,
      db: req.db
    })
    res.json(stkfileInfo)
  } catch (error) {
    next(error)
  }
}
const getAllSTKFileByCode = async (req, res, next) => {
  const { branchCode } = req.params
  try {
    const stkfileInfo = await STKFileService.getSTKFile({
      repository: StkfileRepository,
      db: req.db,
      branchCode
    })
    res.json(stkfileInfo)
  } catch (error) {
    next(error)
  }
}

const processStock = async (req, res, next) => {
  try {
    const stkfileInfo = await STKFileService.processStock({
      payload: req.body,
      repository: StkfileRepository,
      db: req.db
    })
    res.json(stkfileInfo)
  } catch (error) {
    next(error)
  }
}


module.exports = {
  getAllSTKFile,
  processStock,
  getAllSTKFileByCode
}
