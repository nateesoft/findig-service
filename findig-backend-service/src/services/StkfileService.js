const { mappingResultData } = require("../utils/ConvertThai")

const getSTKFile = async ({ payload, repository, db }) => {
  const results = await repository.getData({payload, db })
  return mappingResultData(results)
}

const processStock = async ({ payload, repository, db }) => {
  const results = await repository.processStock({payload, db })
  return results
}

module.exports = {
  getSTKFile,
  processStock
}
