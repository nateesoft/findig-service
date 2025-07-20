const { mappingResultData } = require('../utils/ConvertThai')

const getBranchData = async ({ payload, repository, db }) => {
  const results = await repository.listAll({ db })
  return mappingResultData(results)
};

const findByCode = async ({ payload, repository, db }) => {
  const { branchCode } = payload
  const results = await repository.findByCode({
     payload: {
        code: branchCode
     }, db })

  if (results.length === 0) return null
    return mappingResultData([results[0]])[0]
};

module.exports = {
  getBranchData,
  findByCode
}
