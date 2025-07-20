const { mappingResultData } = require('../utils/ConvertThai')

const getCompanyData = async ({ payload, repository, db }) => {
  const results = await repository.getData({ db })
  return mappingResultData(results)
};

module.exports = {
  getCompanyData
}
