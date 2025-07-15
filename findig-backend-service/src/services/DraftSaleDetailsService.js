const { mappingResultData } = require("../utils/ConvertThai")
const { getMoment } = require("../utils/MomentUtil")
const { generateUUID } = require("../utils/StringUtil")

const getData = async ({ payload, repository, db }) => {
  const results = await repository.getData({ payload, db })
  return mappingResultData(results)
}

const getDataById = async ({ payload, repository, db }) => {
  const results = await repository.getData({ payload, db })
  return mappingResultData(results)
}

const saveData = async ({ payload, repository, db }) => {
  const mappingPayload = {
    ...payload,
    id: generateUUID(),
    create_date: getMoment().format('YYYY-MM-DD HH:mm:ss'),
    update_date: getMoment().format('YYYY-MM-DD HH:mm:ss')
  }
  const results = await repository.saveData({ payload: mappingPayload, db })
  return results
}

const updateData = async ({ payload, repository, db }) => {
  const mappingPayload = {
    ...payload,
    update_date: getMoment().format('YYYY-MM-DD HH:mm:ss')
  }
  const results = await repository.updateData({ payload: mappingPayload, db })
  return results
}

const deleteData = async ({ payload, repository, db }) => {
  const results = await repository.deleteData({ payload, db })
  return results
}

module.exports = {
  getData,
  getDataById,
  saveData,
  updateData,
  deleteData
}
