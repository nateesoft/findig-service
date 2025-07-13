const { mappingResultData } = require('../utils/ConvertThai')

const getBranchData = async ({ payload, repository, db }) => {
  const results = await repository.listAll({payload, db})
  return mappingResultData(results)
};

module.exports = {
  getBranchData
}
