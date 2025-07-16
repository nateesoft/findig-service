const { mappingResultData } = require('../utils/ConvertThai')

const getProductData = async ({ payload, repository, db }) => {
  const results = await repository.listAll({ db })
  return mappingResultData(results)
};

module.exports = {
  getProductData
}
