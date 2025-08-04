const cache = require('../utils/cache')
const { mappingResultData } = require('../utils/ConvertThai')

const searchProduct = async ({ repository, db, searchText }) => {
  const results = await repository.searchProduct({ db, searchText })
  const mapped = mappingResultData(results)
  return mapped
};

module.exports = {
  searchProduct
}
