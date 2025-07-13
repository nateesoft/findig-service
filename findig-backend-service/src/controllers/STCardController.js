const StcardService = require("../services/StcardService")
const StcardRepository = require("../repository/StcardRepository")

const getAllSTCard = async (req, res, next) => {
  try {
    const { branchCode } = req.query
    const stcardInfo = await StcardService.getSTCard({
      branchCode,
      repository: StcardRepository,
      db: req.db
    })
    res.json(stcardInfo)
  } catch (error) {
    next(error)
  }
}

module.exports = {
  getAllSTCard
}
