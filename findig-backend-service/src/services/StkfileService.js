const { mappingResultData } = require("../utils/ConvertThai")
const { getMoment } = require("../utils/MomentUtil")

const CompanyService = require('../services/CompanyService')
const CompanyRepository = require('../repository/CompanyRepository')

const getSTKFile = async ({ payload, repository, db }) => {
  const { branch_code } = payload
  const results = await repository.getData({ payload: {
    Branch: branch_code
  }, db })
  return mappingResultData(results)
}

const GetActionMon = async ({ db }) => {
  const Company = await CompanyService.getCompanyData({
    payload: {},
    repository: CompanyRepository,
    db
  })
  let TempYear = Company.Accterm ? getMoment(Company.Accterm).format("YYYY") : getMoment().format("YYYY")
  let CurYear = getMoment().format('YYYY')
  let CurMonth = getMoment().format('MM')

  let responseMonth = 0
  if (TempYear === CurYear) {
      responseMonth = parseInt(CurMonth) + 12
  } else {
      if (parseInt(CurYear) === parseInt(TempYear) - 1) {
          responseMonth = parseInt(CurMonth)
      } else {
          responseMonth = 0
      }
  }
  return responseMonth
}

const processStock = async ({ payload, repository, db }) => {
  const { billInfo, sale_items } = payload
  for (const product of sale_items) {
    if(product.can_stock === 'Y') {
      let actionMon = await GetActionMon({ db });
      const existing = await repository.findByProductStockCode({
        payload: {
          Branch: billInfo.branch_code,
          BPCode: product.barcode,
          BStk: product.stock_code
        },
        db
      })
  
      const stkfile = {
        Branch: billInfo.branch_code,
        BPCode: product.barcode,
        BStk: product.stock_code,
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
  
      if(!existing) {
        await repository.createStkFile({ payload: { ...stkfile }, db })
      }

      const qtyAdjust = product.qty
      for (let i = actionMon; i <= 24; i++) {
        stkfile[`BQty${i}`] = qtyAdjust
      }
      
      await repository.updateStkFile({ payload: { ...stkfile }, db })
    }
  }

  return true
}

module.exports = {
  getSTKFile,
  processStock
}
