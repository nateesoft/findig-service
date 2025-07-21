const { mappingResultData } = require("../utils/ConvertThai")
const { getMoment } = require("../utils/MomentUtil")
const { generateUUID, Unicode2ASCII } = require("../utils/StringUtil")

const getData = async ({ payload, repository, db }) => {
  const results = await repository.getData({ payload, db })
  return mappingResultData(results)
}

const getDataById = async ({ payload, repository, db }) => {
  const results = await repository.getData({ payload, db })
  return mappingResultData(results)
}

const getSaleDetailsByBillNo = async ({ payload, repository, db }) => {
  const results = await repository.getDataByBillNo({ payload, db })
  return mappingResultData(results)
}

const saveData = async ({ payload, repository, db }) => {
  const { product_name } = payload
  const mappingPayload = {
    ...payload,
    id: generateUUID(),
    product_name: Unicode2ASCII(product_name),
    create_date: getMoment().format('YYYY-MM-DD HH:mm:ss'),
    update_date: getMoment().format('YYYY-MM-DD HH:mm:ss')
  }
  const results = await repository.saveData({ payload: mappingPayload, db })
  return results
}

const updateData = async ({ payload, repository, db }) => {
  const { product_name } = payload
  const mappingPayload = {
    ...payload,
    product_name: Unicode2ASCII(product_name),
    update_date: getMoment().format('YYYY-MM-DD HH:mm:ss')
  }
  const results = await repository.updateData({ payload: mappingPayload, db })
  return results
}

const deleteData = async ({ payload, repository, db }) => {
  const results = await repository.deleteData({ payload, db })
  return results
}

const deleteDataByBillNo = async ({ payload, repository, db }) => {
  const results = await repository.deleteDataByBillNo({ payload, db })
  return results
}

module.exports = {
  getData,
  getDataById,
  saveData,
  updateData,
  deleteData,
  getSaleDetailsByBillNo,
  deleteDataByBillNo
}
