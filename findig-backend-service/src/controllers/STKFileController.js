const STKFileService = require("../services/STKFileService")
const StkfileRepository = require("../repository/StkfileRepository")

const getAllSTKFile = async (req, res, next) => {
  try {
    const { branchCode } = req.query
    const stkfileInfo = await STKFileService.get({
      payload: { branch_code: branchCode },
      repository: StkfileRepository,
      db: req.db
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
  processStock
}
