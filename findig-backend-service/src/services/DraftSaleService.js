const { mappingResultData } = require("../utils/ConvertThai")
const { getMoment } = require("../utils/MomentUtil")
const { generateUUID } = require("../utils/StringUtil")

const DraftSaleDetailsService = require("../services/DraftSaleDetailsService")
const DraftSaleDetailsRepository = require('../repository/DraftSaleDetailsRepository')

const StcardService = require("../services/StcardService")
const StcardRepository = require("../repository/StcardRepository")
const StkfileService = require("../services/StkfileService")
const StkfileRepository = require("../repository/StkfileRepository")

const getData = async ({ payload, repository, db }) => {
  const results = await repository.getData({ payload, db })
  return mappingResultData(results)
}

const getDataById = async ({ payload, repository, db }) => {
  const results = await repository.getDataById({ payload, db })
  if(results.length > 0) {
    const resultDetails = await DraftSaleDetailsService.getSaleDetailsByBillNo({ 
      payload: { billno: results[0]?.billno },
      repository: DraftSaleDetailsRepository,
      db
    })
    const list1 = mappingResultData(results)
    const list2 = mappingResultData(resultDetails)

    const itemHeaders = list1.map(item => ({
      billNo: item.billno,
      empCode: item.emp_code,
      empName: item.emp_name,
      branchCode: item.branch_code,
      branchName: item.branch_name,
      totalItem: item.total_item,
      totalAmount: item.total_amount,
      postStatus: item.post_status,
      documentDate: item.document_date,
      updateDate: item.update_date
    }))
    const itemDetails = list2.map(item => ({
      barcode: item.barcode,
      productName: item.product_name,
      stock: item.stock_code,
      qty: item.qty
    }))

    return {
      ...itemHeaders[0],
      items: itemDetails
    }
  }

  return []
}

const saveData = async ({ payload, repository, db }) => {
  const { sale_items, billno, emp_code } = payload
  const mappingPayload = {
    ...payload,
    id: generateUUID(),
    document_date: getMoment().format('YYYY-MM-DD HH:mm:ss'),
    post_status: 'N',
    update_date: getMoment().format('YYYY-MM-DD HH:mm:ss')
  }
  const results = await repository.saveData({ payload: mappingPayload, db })
  if(results) {
    // save draft sale details
    sale_items.forEach(async sale => {
      await DraftSaleDetailsService.saveData({
        payload: {
          billno: billno, 
          barcode: sale.barcode, 
          product_name: sale.productName, 
          stock_code: sale.stock, 
          qty: sale.qty, 
          emp_code: emp_code,
          emp_code_update: emp_code
        },
        repository: DraftSaleDetailsRepository,
        db
      })
    });
  }
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

const processStockFromSale = async ({ payload, repository, db }) => {
  const { id, billno } = payload

  const resultDetails = await DraftSaleDetailsService.getSaleDetailsByBillNo({ 
    payload: { billno },
    repository: DraftSaleDetailsRepository,
    db
  })

  const mappingPayload = {
    ...payload,
    S_Date: getMoment().format('YYYY-MM-DD HH:mm:ss')
  }

  const processStcard = await StcardService.processStock({
    payload: {
      billInfo: mappingPayload,
      sale_items: resultDetails
    },
    repository: StcardRepository,
    db
  })

  const processStkfile = await StkfileService.processStock({
    payload: {
      billInfo: mappingPayload,
      sale_items: resultDetails
    },
    repository: StkfileRepository,
    db
  })

  if(processStcard && processStkfile) {
    const results = await repository.processStockFromSale({ payload: { id }, db })
    return results
  } else {
    return { error: "Failed to process stock from sale." }
  }

}

module.exports = {
  getData,
  getDataById,
  saveData,
  updateData,
  deleteData,
  processStockFromSale
}
