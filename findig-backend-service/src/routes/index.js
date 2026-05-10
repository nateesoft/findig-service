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

router.get('/api/findig-backend-service/branch', BranchController.getBranchData);
router.get('/api/findig-backend-service/branch/list', BranchController.findAllBranch);
router.get('/api/findig-backend-service/branch/:branchCode', BranchController.getBranchByCode);

router.get('/api/findig-backend-service/stcard', STCardController.getAllSTCard);
router.post('/api/findig-backend-service/stcard/search', STCardController.searchStCardData);
router.get('/api/findig-backend-service/stcard/:branchCode', STCardController.getAllSTCardByCode);
router.post('/api/findig-backend-service/stcard', STCardController.processStock);

/* for reports */
router.post('/api/findig-backend-service/report/summary', ReportController.searchSummaryReport);
router.post('/api/findig-backend-service/report/sale', ReportController.searchReportSale)
router.post('/api/findig-backend-service/report/stcard', ReportController.searchReportStcard);
router.post('/api/findig-backend-service/report/stkfile', ReportController.getReportStkfile);

router.get('/api/findig-backend-service/stkfile', STKFileController.getAllSTKFile);
router.post('/api/findig-backend-service/stkfile/search', STKFileController.searchStkFileData);
router.get('/api/findig-backend-service/stkfile/:branchCode', STKFileController.getAllSTKFileByCode);
router.post('/api/findig-backend-service/stkfile', STKFileController.processStock);

router.get('/api/findig-backend-service/posuser', PosUserController.getAllUser);
router.post('/api/findig-backend-service/posuser/search', PosUserController.searchUserData);
router.post('/api/findig-backend-service/posuser/login', PosUserController.validateLogin);
router.patch('/api/findig-backend-service/posuser/logout', PosUserController.processLogout);

router.get('/api/findig-backend-service/draftsale', DraftSaleController.getData)
router.post('/api/findig-backend-service/draftsale/search', DraftSaleController.searchSaleData)
router.get('/api/findig-backend-service/draftsale/dashboard', DraftSaleController.getDataForDashboard)
router.get('/api/findig-backend-service/draftsale/:id', DraftSaleController.getDataById)
router.post('/api/findig-backend-service/draftsale', DraftSaleController.saveData)
router.put('/api/findig-backend-service/draftsale/:id', DraftSaleController.updateData)
router.delete('/api/findig-backend-service/draftsale/:id', DraftSaleController.deleteData)
router.post('/api/findig-backend-service/draftsale/process-stock', DraftSaleController.processStockFromSale)

router.get('/api/findig-backend-service/draftsale_detail', DraftSaleDetailsController.getData)
router.get('/api/findig-backend-service/draftsale_detail/:id', DraftSaleDetailsController.getDataById)
router.post('/api/findig-backend-service/draftsale_detail', DraftSaleDetailsController.saveData)
router.put('/api/findig-backend-service/draftsale_detail/:id', DraftSaleDetailsController.updateData)
router.delete('/api/findig-backend-service/draftsale_detail/:id', DraftSaleDetailsController.deleteData)

// stock in routes
router.get('/api/findig-backend-service/stock-in', StockInController.getData)
router.post('/api/findig-backend-service/stock-in/search', StockInController.searchSaleData)
router.get('/api/findig-backend-service/stock-in/dashboard', StockInController.getDataForDashboard)
router.get('/api/findig-backend-service/stock-in/:id', StockInController.getDataById)
router.post('/api/findig-backend-service/stock-in', StockInController.saveData)
router.put('/api/findig-backend-service/stock-in/:id', StockInController.updateData)
router.delete('/api/findig-backend-service/stock-in/:id', StockInController.deleteData)
router.post('/api/findig-backend-service/stock-in/process-stock', StockInController.processStockFromSale)

router.get('/api/findig-backend-service/stock-in-details', StockInDetailsController.getData)
router.get('/api/findig-backend-service/stock-in-details/:id', StockInDetailsController.getDataById)
router.post('/api/findig-backend-service/stock-in-details', StockInDetailsController.saveData)
router.put('/api/findig-backend-service/stock-in-details/:id', StockInDetailsController.updateData)
router.delete('/api/findig-backend-service/stock-in-details/:id', StockInDetailsController.deleteData)

// stock out routes
router.get('/api/findig-backend-service/stock-out', StockOutController.getData)
router.post('/api/findig-backend-service/stock-out/search', StockOutController.searchSaleData)
router.get('/api/findig-backend-service/stock-out/dashboard', StockOutController.getDataForDashboard)
router.get('/api/findig-backend-service/stock-out/:id', StockOutController.getDataById)
router.post('/api/findig-backend-service/stock-out', StockOutController.saveData)
router.put('/api/findig-backend-service/stock-out/:id', StockOutController.updateData)
router.delete('/api/findig-backend-service/stock-out/:id', StockOutController.deleteData)
router.post('/api/findig-backend-service/stock-out/process-stock', StockOutController.processStockFromSale)

router.get('/api/findig-backend-service/stock-out-details', StockOutDetailsController.getData)
router.get('/api/findig-backend-service/stock-out-details/:id', StockOutDetailsController.getDataById)
router.post('/api/findig-backend-service/stock-out-details', StockOutDetailsController.saveData)
router.put('/api/findig-backend-service/stock-out-details/:id', StockOutDetailsController.updateData)
router.delete('/api/findig-backend-service/stock-out-details/:id', StockOutDetailsController.deleteData)

// backup routes
router.post('/api/findig-backend-service/backup/pos', BackupController.createBackup)
router.get('/api/findig-backend-service/backup/list', BackupController.listBackups)

router.post('/api/findig-backend-service/product', ProductController.getProductData);
router.get('/api/findig-backend-service/groupfile/list', GroupfileController.getAllGroupfile);
router.get('/api/findig-backend-service/salerem/list', SaleRemController.getAllSaleRem);

module.exports = router
