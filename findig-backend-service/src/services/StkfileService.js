const { mappingResultData } = require("../utils/ConvertThai")
const { getMoment } = require("../utils/MomentUtil")

const getSTKFile = async ({ payload, repository, db }) => {
  const { branch_code } = payload
  const results = await repository.getData({ payload: {
    Branch: branch_code
  }, db })
  return mappingResultData(results)
}

const processStock = async ({ payload, repository, db }) => {
  const { billInfo, sale_items } = payload
  sale_items.forEach(async item => {
    const existing = await repository.findByProductStockCode({
      payload: {
        Branch: billInfo.branch_code,
        BPCode: item.barcode,
        BStk: item.stock_code
      },
      db
    })

    const stkfile = {
      Branch: billInfo.branch_code,
      BPCode: item.barcode,
      BStk: item.stock_code,
      BQty: 0,
      BAmt: 0,
      BTotalAmt: 0,
      BQty0: 0,
      BQty1: 0,
      BQty2: 0,
      BQty3: 0,
      BQty4: 0,
      BQty5: 0,
      BQty6: 0,
      BQty7: 0,
      BQty8: 0,
      BQty9: 0,
      BQty10: 0,
      BQty11: 0,
      BQty12: 0,
      BQty13: 0,
      BQty14: 0,
      BQty15: 0,
      BQty16: 0,
      BQty17: 0,
      BQty18: 0,
      BQty19: 0,
      BQty20: 0,
      BQty21: 0,
      BQty22: 0,
      BQty23: 0,
      BQty24: 0,
      SendToPOS: "N",
      LastUpdate: getMoment().format("YYYY-MM-DD"),
      LastTimeUpdate: getMoment().format("HH:mm:ss")
    }

    if (existing) {
      await repository.updateStkFile({ payload: { ...stkfile }, db })
    } else {
      await repository.createStkFile({ payload: { ...stkfile }, db })
    }
  })

  return true
}

module.exports = {
  getSTKFile,
  processStock
}
