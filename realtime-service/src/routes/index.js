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
const BackupController = require('../controllers/BackupController')

router.get('/branch', BranchController.getBranchData);
router.get('/branch/list', BranchController.findAllBranch);
router.get('/branch/:branchCode', BranchController.getBranchByCode);

router.get('/stcard', STCardController.getAllSTCard);
router.post('/stcard/search', STCardController.searchStCardData);
router.get('/stcard/:branchCode', STCardController.getAllSTCardByCode);
router.post('/stcard', STCardController.processStock);

/* for reports */
router.post('/report/summary', ReportController.searchSummaryReport);
router.post('/report/sale', ReportController.searchReportSale)
router.post('/report/stcard', ReportController.searchReportStcard);
router.post('/report/stkfile', ReportController.getReportStkfile);

router.get('/stkfile', STKFileController.getAllSTKFile);
router.post('/stkfile/search', STKFileController.searchStkFileData);
router.get('/stkfile/:branchCode', STKFileController.getAllSTKFileByCode);
router.post('/stkfile', STKFileController.processStock);

router.get('/posuser', PosUserController.getAllUser);
router.post('/posuser/search', PosUserController.searchUserData);
router.post('/posuser/login', PosUserController.validateLogin);
router.patch('/posuser/logout', PosUserController.processLogout);

router.get('/draftsale', DraftSaleController.getData)
router.post('/draftsale/search', DraftSaleController.searchSaleData)
router.get('/draftsale/dashboard', DraftSaleController.getDataForDashboard)
router.get('/draftsale/:id', DraftSaleController.getDataById)
router.post('/draftsale', DraftSaleController.saveData)
router.put('/draftsale/:id', DraftSaleController.updateData)
router.delete('/draftsale/:id', DraftSaleController.deleteData)
router.post('/draftsale/process-stock', DraftSaleController.processStockFromSale)

router.get('/draftsale_detail', DraftSaleDetailsController.getData)
router.get('/draftsale_detail/:id', DraftSaleDetailsController.getDataById)
router.post('/draftsale_detail', DraftSaleDetailsController.saveData)
router.put('/draftsale_detail/:id', DraftSaleDetailsController.updateData)
router.delete('/draftsale_detail/:id', DraftSaleDetailsController.deleteData)

// stock in routes
router.get('/stock-in', StockInController.getData)
router.post('/stock-in/search', StockInController.searchSaleData)
router.get('/stock-in/dashboard', StockInController.getDataForDashboard)
router.get('/stock-in/:id', StockInController.getDataById)
router.post('/stock-in', StockInController.saveData)
router.put('/stock-in/:id', StockInController.updateData)
router.delete('/stock-in/:id', StockInController.deleteData)
router.post('/stock-in/process-stock', StockInController.processStockFromSale)

router.get('/stock-in-details', StockInDetailsController.getData)
router.get('/stock-in-details/:id', StockInDetailsController.getDataById)
router.post('/stock-in-details', StockInDetailsController.saveData)
router.put('/stock-in-details/:id', StockInDetailsController.updateData)
router.delete('/stock-in-details/:id', StockInDetailsController.deleteData)

// stock out routes
router.get('/stock-out', StockOutController.getData)
router.post('/stock-out/search', StockOutController.searchSaleData)
router.get('/stock-out/dashboard', StockOutController.getDataForDashboard)
router.get('/stock-out/:id', StockOutController.getDataById)
router.post('/stock-out', StockOutController.saveData)
router.put('/stock-out/:id', StockOutController.updateData)
router.delete('/stock-out/:id', StockOutController.deleteData)
router.post('/stock-out/process-stock', StockOutController.processStockFromSale)

router.get('/stock-out-details', StockOutDetailsController.getData)
router.get('/stock-out-details/:id', StockOutDetailsController.getDataById)
router.post('/stock-out-details', StockOutDetailsController.saveData)
router.put('/stock-out-details/:id', StockOutDetailsController.updateData)
router.delete('/stock-out-details/:id', StockOutDetailsController.deleteData)

// backup routes
router.post('/backup/pos', BackupController.createBackup)
router.get('/backup/list', BackupController.listBackups)

router.post('/product', ProductController.getProductData);
router.get('/groupfile/list', GroupfileController.getAllGroupfile);
router.get('/salerem/list', SaleRemController.getAllSaleRem);

module.exports = router
