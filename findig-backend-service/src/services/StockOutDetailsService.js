const cache = require('../utils/cache')
const { mappingResultData } = require("../utils/ConvertThai")
const { getMoment } = require("../utils/MomentUtil")
const { generateUUID, Unicode2ASCII } = require("../utils/StringUtil")

const validatePayload = (payload, requiredFields = []) => {
  if (!payload || typeof payload !== 'object') {
    throw new Error('Invalid payload: payload must be an object')
  }
  
  for (const field of requiredFields) {
    if (!payload[field]) {
      throw new Error(`Missing required field: ${field}`)
    }
  }
}

const getData = async ({ payload, repository, db }) => {
  try {
    const results = await repository.getData({ payload, db })
    const mapped = mappingResultData(results)
    return mapped
  } catch (error) {
    throw new Error(`Service error in getData: ${error.message}`)
  }
}

const getDataById = async ({ payload, repository, db }) => {
  try {
    const results = await repository.getData({ payload, db })
    const mapped = mappingResultData(results)
    return mapped
  } catch (error) {
    throw new Error(`Service error in getDataById: ${error.message}`)
  }
}

const getSaleDetailsByBillNo = async ({ payload, repository, db }) => {
  try {
    const results = await repository.getDataByBillNo({ payload, db })
    const mapped = mappingResultData(results)
    return mapped
  } catch (error) {
    throw new Error(`Service error in getSaleDetailsByBillNo: ${error.message}`)
  }
}

const saveData = async ({ payload, repository, db }) => {
  try {
    validatePayload(payload, ['product_name'])
    
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
  } catch (error) {
    throw new Error(`Service error in saveData: ${error.message}`)
  }
}

const updateData = async ({ payload, repository, db }) => {
  try {
    validatePayload(payload, ['product_name'])
    
    const { product_name } = payload
    const mappingPayload = {
      ...payload,
      product_name: Unicode2ASCII(product_name),
      update_date: getMoment().format('YYYY-MM-DD HH:mm:ss')
    }
    const results = await repository.updateData({ payload: mappingPayload, db })
    return results
  } catch (error) {
    throw new Error(`Service error in updateData: ${error.message}`)
  }
}

const deleteData = async ({ payload, repository, db }) => {
  try {
    validatePayload(payload)
    
    const results = await repository.deleteData({ payload, db })
    return results
  } catch (error) {
    throw new Error(`Service error in deleteData: ${error.message}`)
  }
}

const deleteDataByBillNo = async ({ payload, repository, db }) => {
  try {
    validatePayload(payload)
    
    const results = await repository.deleteDataByBillNo({ payload, db })
    return results
  } catch (error) {
    throw new Error(`Service error in deleteDataByBillNo: ${error.message}`)
  }
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
