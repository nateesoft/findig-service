const ProductService = require('../services/ProductService')
const ProductRepository = require("../repository/ProductRepository")

const getProductData = async (req, res, next) => {
  try {
    const { searchText } = req.body
    const result = await ProductService.searchProduct({
      searchText,
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