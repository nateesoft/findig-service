
const { mappingResultData } = require('../utils/ConvertThai')

const checkLogin = async ({ payload, repository, db }) => {
    const results = await repository.checkLogin({ payload, db })
    if (results.length > 0) {
        const newResult = mappingResultData(results)
        return {...newResult[0], Password: ""}
    }
    return null
}

const processLogout = async ({ payload, repository, db }) => {
  const result = await repository.updateUserLogout({ payload, db})
  return result.affectedRows > 0
}

module.exports = {
    checkLogin,
    processLogout
}
