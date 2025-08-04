
const { mappingResultData } = require('../utils/ConvertThai')
const { Unicode2ASCII } = require('../utils/StringUtil')

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

const getAllUser = async ({ payload, repository, db }) => {
  const results = await repository.listAllUser({ db })
  return mappingResultData(results)
};

const searchUserData = async ({ payload, repository, db }) => {
  const { UserName, Name } = payload

  const results = await repository.searchUser({ db, payload: {
    UserName: UserName,
    Name: Unicode2ASCII(Name)
  } })
  return mappingResultData(results)
};

module.exports = {
    checkLogin,
    processLogout,
    getAllUser,
    searchUserData
}
