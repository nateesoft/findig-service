const SaleRemService = require('../services/SaleRemService')
const SaleRemRepository = require("../repository/SaleRemRepository")

const getAllSaleRem = async (req, res, next) => {
  try {
    const result = await SaleRemService.getAllSaleRemData({
      repository: SaleRemRepository,
      db: req.db
    })
    res.json(result);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getAllSaleRem
}