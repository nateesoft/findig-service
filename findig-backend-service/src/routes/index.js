const express = require('express')
const router = express.Router();

const ProductController = require('../controllers/ProductController')
const GroupfileController = require('../controllers/GroupfileController')
const SaleRemController = require('../controllers/SaleRemController')

const BranchController = require('../controllers/BranchController')
const STCardController = require('../controllers/STCardController')
const STKFileController = require('../controllers/STKFileController')
const PosUserController = require('../controllers/PosUserController')

const DraftSaleController = require('../controllers/DraftSaleController')
const DraftSaleDetailsController = require('../controllers/DraftSaleDetailsController')

// stock in process
const StockInController = require('../controllers/StockInController')
const StockInDetailsController = require('../controllers/StockInDetailsController')

// stock out process
const StockOutController = require('../controllers/StockOutController')
const StockOutDetailsController = require('../controllers/StockOutDetailsController')

const ReportController = require('../controllers/ReportController')

router.get('/api/branch', BranchController.getBranchData);
router.get('/api/branch/list', BranchController.findAllBranch);
router.get('/api/branch/:branchCode', BranchController.getBranchByCode);

router.get('/api/stcard', STCardController.getAllSTCard);
router.post('/api/stcard/search', STCardController.searchStCardData);
router.get('/api/stcard/:branchCode', STCardController.getAllSTCardByCode);
router.post('/api/stcard', STCardController.processStock);

/* for reports */
router.post('/api/report/summary', ReportController.searchSummaryReport);
router.post('/api/report/sale', ReportController.searchReportSale)
router.post('/api/report/stcard', ReportController.searchReportStcard);
router.post('/api/report/stkfile', ReportController.getReportStkfile);

router.get('/api/stkfile', STKFileController.getAllSTKFile);
router.post('/api/stkfile/search', STKFileController.searchStkFileData);
router.get('/api/stkfile/:branchCode', STKFileController.getAllSTKFileByCode);
router.post('/api/stkfile', STKFileController.processStock);

router.get('/api/posuser', PosUserController.getAllUser);
router.post('/api/posuser/search', PosUserController.searchUserData);
router.post('/api/posuser/login', PosUserController.validateLogin);
router.patch('/api/posuser/logout', PosUserController.processLogout);

router.get('/api/draftsale', DraftSaleController.getData)
router.post('/api/draftsale/search', DraftSaleController.searchSaleData)
router.get('/api/draftsale/dashboard', DraftSaleController.getDataForDashboard)
router.get('/api/draftsale/:id', DraftSaleController.getDataById)
router.post('/api/draftsale', DraftSaleController.saveData)
router.put('/api/draftsale/:id', DraftSaleController.updateData)
router.delete('/api/draftsale/:id', DraftSaleController.deleteData)
router.post('/api/draftsale/process-stock', DraftSaleController.processStockFromSale)

router.get('/api/draftsale_detail', DraftSaleDetailsController.getData)
router.get('/api/draftsale_detail/:id', DraftSaleDetailsController.getDataById)
router.post('/api/draftsale_detail', DraftSaleDetailsController.saveData)
router.put('/api/draftsale_detail/:id', DraftSaleDetailsController.updateData)
router.delete('/api/draftsale_detail/:id', DraftSaleDetailsController.deleteData)

// stock in routes
router.get('/api/stock-in', StockInController.getData)
router.post('/api/stock-in/search', StockInController.searchSaleData)
router.get('/api/stock-in/dashboard', StockInController.getDataForDashboard)
router.get('/api/stock-in/:id', StockInController.getDataById)
router.post('/api/stock-in', StockInController.saveData)
router.put('/api/stock-in/:id', StockInController.updateData)
router.delete('/api/stock-in/:id', StockInController.deleteData)
router.post('/api/stock-in/process-stock', StockInController.processStockFromSale)

router.get('/api/stock-in-details', StockInDetailsController.getData)
router.get('/api/stock-in-details/:id', StockInDetailsController.getDataById)
router.post('/api/stock-in-details', StockInDetailsController.saveData)
router.put('/api/stock-in-details/:id', StockInDetailsController.updateData)
router.delete('/api/stock-in-details/:id', StockInDetailsController.deleteData)

// stock out routes
router.get('/api/stock-out', StockOutController.getData)
router.post('/api/stock-out/search', StockOutController.searchSaleData)
router.get('/api/stock-out/dashboard', StockOutController.getDataForDashboard)
router.get('/api/stock-out/:id', StockOutController.getDataById)
router.post('/api/stock-out', StockOutController.saveData)
router.put('/api/stock-out/:id', StockOutController.updateData)
router.delete('/api/stock-out/:id', StockOutController.deleteData)
router.post('/api/stock-out/process-stock', StockOutController.processStockFromSale)

router.get('/api/stock-out-details', StockOutDetailsController.getData)
router.get('/api/stock-out-details/:id', StockOutDetailsController.getDataById)
router.post('/api/stock-out-details', StockOutDetailsController.saveData)
router.put('/api/stock-out-details/:id', StockOutDetailsController.updateData)
router.delete('/api/stock-out-details/:id', StockOutDetailsController.deleteData)

router.post('/api/product', ProductController.getProductData);
router.get('/api/groupfile/list', GroupfileController.getAllGroupfile);
router.get('/api/salerem/list', SaleRemController.getAllSaleRem);

module.exports = router
