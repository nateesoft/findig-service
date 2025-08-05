const express = require('express')
const router = express.Router();

const ProductController = require('../controllers/ProductController')
const GroupfileController = require('../controllers/GroupfileController')

const BranchController = require('../controllers/BranchController')
const STCardController = require('../controllers/STCardController')
const STKFileController = require('../controllers/STKFileController')
const PosUserController = require('../controllers/PosUserController')

const DraftSaleController = require('../controllers/DraftSaleController')
const DraftSaleDetailsController = require('../controllers/DraftSaleDetailsController')

router.get('/api/branch', BranchController.getBranchData);
router.get('/api/branch/list', BranchController.findAllBranch);
router.get('/api/branch/:branchCode', BranchController.getBranchByCode);

router.get('/api/stcard', STCardController.getAllSTCard);
router.post('/api/stcard/search', STCardController.searchStCardData);
router.get('/api/stcard/:branchCode', STCardController.getAllSTCardByCode);
router.post('/api/stcard', STCardController.processStock);

router.get('/api/stkfile', STKFileController.getAllSTKFile);
router.post('/api/stkfile/search', STKFileController.searchStkFileData);
router.get('/api/stkfile/:branchCode', STKFileController.getAllSTKFileByCode);
router.post('/api/stkfile', STKFileController.processStock);

router.get('/api/posuser', PosUserController.getAllUser);
router.post('/api/posuser/search', PosUserController.searchUserData);
router.post('/api/posuser/login', PosUserController.validateLogin);
router.patch('/api/posuser/logout', PosUserController.processLogout);

router.get('/api/draftsale', DraftSaleController.getData)
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

router.post('/api/product', ProductController.getProductData);

router.get('/api/groupfile/list', GroupfileController.getAllGroupfile);

module.exports = router
