const BranchService = require('../services/BranchService')
const BranchRepository = require("../repository/BranchRepository")

const getBranchData = async (req, res, next) => {
  try {
    const result = await BranchService.getBranchData({
      payload: {},
      repository: BranchRepository,
      db: req.db
    })
    res.json(result);
  } catch (err) {
    next(err);
  }
};

const getBranchByCode = async (req, res, next) => {
  try {
    const { branchCode } = req.params
    const result = await BranchService.findByCode({
      payload: {
        branchCode
      },
      repository: BranchRepository,
      db: req.db
    })
    res.json(result);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getBranchData,
  getBranchByCode
}