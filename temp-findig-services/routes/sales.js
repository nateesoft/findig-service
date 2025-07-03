const express = require('express');
const router = express.Router();
const SalesController = require('../controllers/salesController');
const { authenticateToken, requireRole } = require('../middleware/auth');
const { validateSale } = require('../middleware/validation');

// Get all sales (ต้อง login)
router.get('/', authenticateToken, SalesController.getAll);

// Get sale by ID (ต้อง login)
router.get('/:id', authenticateToken, SalesController.getById);

// Create new sale (ต้อง login)
router.post('/', authenticateToken, validateSale, SalesController.create);

// Update sale (ต้อง login)
router.put('/:id', authenticateToken, validateSale, SalesController.update);

// Delete sale (ต้อง login และเป็น admin)
router.delete('/:id', authenticateToken, requireRole(['admin']), SalesController.delete);

module.exports = router;