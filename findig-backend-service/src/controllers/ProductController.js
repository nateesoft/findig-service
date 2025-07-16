const ProductService = require('../services/ProductService')
const ProductRepository = require("../repository/ProductRepository")

const getProductData = async (req, res, next) => {
  try {
    const result = await ProductService.getProductData({
      payload: {},
      repository: ProductRepository,
      db: req.db
    })
    res.json(result);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getProductData
}