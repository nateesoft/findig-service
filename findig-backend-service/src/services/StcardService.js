const { mappingResultData } = require("../utils/ConvertThai")

const getSTCard = async ({ branchCode, repository, db }) => {
  const results = await repository.getData({ payload: { branchCode }, db })
  return mappingResultData(results)
}

module.exports = {
  getSTCard
}
