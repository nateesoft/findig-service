const express = require('express')
const router = express.Router();

const BranchController = require('../controllers/BranchController')
const STCardController = require('../controllers/STCardController')
const PosUserController = require('../controllers/PosUserController')

router.get('/api/branch', BranchController.getBranchData);
router.get('/api/stcard', STCardController.getAllSTCard);

router.post('/api/posuser/login', PosUserController.validateLogin);
router.patch('/api/posuser/logout', PosUserController.processLogout);

module.exports = router
