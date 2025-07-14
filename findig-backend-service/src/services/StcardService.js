const { mappingResultData } = require("../utils/ConvertThai")

const getSTCard = async ({ payload, repository, db }) => {
  const results = await repository.getData({payload, db })
  return mappingResultData(results)
}

module.exports = {
  getSTCard
}
