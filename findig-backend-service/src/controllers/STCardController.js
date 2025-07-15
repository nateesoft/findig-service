const StcardService = require("../services/StcardService")
const StcardRepository = require("../repository/StcardRepository")

const getAllSTCard = async (req, res, next) => {
  try {
    const { branchCode } = req.query
    const stcardInfo = await StcardService.getSTCard({
      payload: { branch_code: branchCode },
      repository: StcardRepository,
      db: req.db
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

module.exports = {
  getAllSTCard,
  processStock
}
