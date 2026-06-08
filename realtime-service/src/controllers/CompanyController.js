const CompanyService = require('../services/CompanyService')
const CompanyRepository = require("../repository/CompanyRepository")

const getBranchData = async (req, res, next) => {
  try {
    const result = await CompanyService.getCompanyData({
      payload: {},
      repository: CompanyRepository,
      db: req.db
    })
    res.json(result);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getBranchData
}