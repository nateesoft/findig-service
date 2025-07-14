const { mappingResultData } = require('../utils/ConvertThai')

const getBranchData = async ({ payload, repository, db }) => {
  const results = await repository.listAll({ db })
  return mappingResultData(results)
};

module.exports = {
  getBranchData
}
