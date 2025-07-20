const { getMoment } = require("../utils/MomentUtil")

const DraftSaleDetailsService = require("../services/DraftSaleDetailsService")
const DraftSaleDetailsRepository = require('../repository/DraftSaleDetailsRepository')

const StcardService = require("../services/StcardService")
const StcardRepository = require("../repository/StcardRepository")

const StkfileService = require("../services/StkfileService")
const StkfileRepository = require("../repository/StkfileRepository")

const processStockFromSale = async ({ payload, repository, db }) => {
  const { id, billno } = payload

  const resultDetails = await DraftSaleDetailsService.getSaleDetailsByBillNo({
    payload: { billno },
    repository: DraftSaleDetailsRepository,
    db
  })

  const mappingPayload = {
    ...payload,
    S_Date: getMoment().format("YYYY-MM-DD HH:mm:ss")
  }

  const processStcard = await StcardService.processStock({
    payload: {
      billInfo: mappingPayload,
      sale_items: resultDetails
    },
    repository: StcardRepository,
    db
  })

  if (processStcard) {
    const processStkfile = await StkfileService.processStock({
      payload: {
        billInfo: mappingPayload,
        sale_items: resultDetails
      },
      repository: StkfileRepository,
      db
    })

    if (processStkfile) {
      const results = await repository.processStockFromSale({
        payload: { id },
        db
      })
      if (results) {
        return results
      } else {
        // rollback stkfile
        // rollback stcard
        return { error: "Failed to update draft_sale." }
      }
    } else {
      // rollback stcard
      // TODO:

      return { error: "Failed to create stkfile." }
    }
  } else {
    return { error: "Failed to update stcard." }
  }
}

module.exports = {
  processStockFromSale
}
