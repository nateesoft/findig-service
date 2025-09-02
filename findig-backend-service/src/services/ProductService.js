const { mappingResultData } = require('../utils/ConvertThai')

const searchProduct = async ({ repository, db, searchText }) => {
  try {
    const results = await repository.searchProduct({ db, searchText })
    const mapped = mappingResultData(results)
    return mapped
  } catch (error) {
    throw new Error(`Service error in searchProduct: ${error.message}`)
  }
};

module.exports = {
  searchProduct
}
