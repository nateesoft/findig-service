const { mappingResultData } = require('../utils/ConvertThai')

const getAllGroupFile = async ({ repository, db }) => {
  const results = await repository.getData({ db })
  return mappingResultData(results)
};

module.exports = {
  getAllGroupFile
}
