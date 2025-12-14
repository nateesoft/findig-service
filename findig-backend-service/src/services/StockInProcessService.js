const { getMoment } = require("../utils/MomentUtil")

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

const StockInDetailsService = require("./StockInDetailsService")
const StockInDetailsRepository = require('../repository/StockInDetailsRepository')

const StcardService = require("./StcardService")
const StcardRepository = require("../repository/StcardRepository")

const processStockFromSale = async ({ payload, repository, db }) => {
  try {
    validatePayload(payload, ['id', 'billno'])
    
    const { id, billno } = payload

    const resultDetails = await StockInDetailsService.getSaleDetailsByBillNo({
      payload: { billno },
      repository: StockInDetailsRepository,
      db
    })

    const mappingPayload = {
      ...payload,
      S_Date: getMoment().format("YYYY-MM-DD HH:mm:ss")
    }

    const processStcard = await StcardService.processStockTranfer({
      payload: {
        billInfo: mappingPayload,
        sale_items: resultDetails
      },
      repository: StcardRepository,
      db,
      stockTranType: 'stock-in'
    })

    if(processStcard) {
      const results = await repository.processStockFromSale({
          payload: { id },
          db
        })
        if (results) {
          return results
        } else {
          return { error: "Failed to update stock_in." }
        }
    } else {
      return { error: "Failed to update stcard." }
    }
  } catch (error) {
    throw new Error(`Service error in processStockFromStockIn: ${error.message}`)
  }
}

module.exports = {
  processStockFromSale
}
