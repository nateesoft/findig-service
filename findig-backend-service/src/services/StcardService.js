const cache = require('../utils/cache')

const { mappingResultData } = require("../utils/ConvertThai")
const { getMoment } = require("../utils/MomentUtil")

const getSTCard = async ({ branchCode, repository, db }) => {
  const cacheKey = 'getSTCard_'+getMoment().format('YYYY-MM-DD')

  const cached = cache.get(cacheKey)
  if (cached) {
    console.log('🔄 Cache hit')
    return cached;
  } else {
    console.log('🚀 Cache miss, querying DB')

    const results = await repository.getData({payload: { 
      S_Bran: branchCode 
    }, db })
    const mapped = mappingResultData(results)

    cache.set(cacheKey, mapped, 60);
    return mapped
  }
}

const getAllSTCard = async ({ repository, db }) => {
  const cacheKey = 'getAllSTCard_'+getMoment().format('YYYY-MM-DD')

  const cached = cache.get(cacheKey)
  if (cached) {
    console.log('🔄 Cache hit')
    return cached;
  } else {
    console.log('🚀 Cache miss, querying DB')
  
    const results = await repository.getAllData({db })
    const mapped = mappingResultData(results)
  
    cache.set(cacheKey, mapped, 60);
    return mapped
  }
}

const processStock = async ({ payload, repository, db }) => {
  const { billInfo, sale_items } = payload
  for (const [index, item] of sale_items.entries()) {
    const existing = await repository.findByBillNoPCode({
      payload: {
        S_Bran: billInfo.branch_code,
        S_No: billInfo.billno,
        S_PCode: item.barcode
      },
      db
    })

    const stcard = {
      S_Bran: billInfo.branch_code,
      S_Date: getMoment(item.create_date).format('YYYY-MM-DD HH:mm:ss'),
      S_No: billInfo.billno,
      S_SubNo: "",
      S_Que: (index + 1),
      S_PCode: item.barcode,
      S_Stk: item.stock_code,
      S_In: 0,
      S_Out: item.qty,
      S_InCost: 0,
      S_OutCost: 0,
      S_ACost: 0,
      S_Rem: "SAL",
      S_User: item.emp_code_update,
      S_EntryDate: getMoment().format('YYYY-MM-DD'),
      S_EntryTime: getMoment().format('HH:mm:ss'),
      S_Link: "",
      Source_Data: "WEB",
      Data_Sync: "N"
    }

    if (existing) {
      await repository.updateStcard({ payload: { ...stcard }, db })
    } else {
      await repository.createStcard({ payload: { ...stcard }, db })
    }
  }

  return true
}

module.exports = {
  getSTCard,
  getAllSTCard,
  processStock
}
