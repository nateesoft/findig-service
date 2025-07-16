const express = require('express')
const router = express.Router();

const ProductController = require('../controllers/ProductController')

const BranchController = require('../controllers/BranchController')
const STCardController = require('../controllers/STCardController')
const STKFileController = require('../controllers/STKFileController')
const PosUserController = require('../controllers/PosUserController')

const DraftSaleController = require('../controllers/DraftSaleController')
const DraftSaleDetailsController = require('../controllers/DraftSaleDetailsController')

router.get('/api/branch', BranchController.getBranchData);

router.get('/api/stcard', STCardController.getAllSTCard);
router.post('/api/stcard', STCardController.processStock);

router.get('/api/stkfile', STKFileController.getAllSTKFile);
router.post('/api/stkfile', STKFileController.processStock);

router.post('/api/posuser/login', PosUserController.validateLogin);
router.patch('/api/posuser/logout', PosUserController.processLogout);

router.get('/api/draftsale', DraftSaleController.getData)
router.get('/api/draftsale/:id', DraftSaleController.getDataById)
router.post('/api/draftsale', DraftSaleController.saveData)
router.put('/api/draftsale/:id', DraftSaleController.updateData)
router.delete('/api/draftsale/:id', DraftSaleController.deleteData)

router.get('/api/draftsale_detail', DraftSaleDetailsController.getData)
router.get('/api/draftsale_detail/:id', DraftSaleDetailsController.getDataById)
router.post('/api/draftsale_detail', DraftSaleDetailsController.saveData)
router.put('/api/draftsale_detail/:id', DraftSaleDetailsController.updateData)
router.delete('/api/draftsale_detail/:id', DraftSaleDetailsController.deleteData)

router.get('/api/product', ProductController.getProductData);

module.exports = router
