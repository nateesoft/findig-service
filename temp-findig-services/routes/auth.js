const express = require('express');
const router = express.Router();

const AuthController = require('../controllers/authController');
const { authenticateToken } = require('../middleware/auth');
const { validateLogin } = require('../middleware/validation');

// Login
router.post('/login', validateLogin, AuthController.login);

// Get Profile (ต้อง login)
router.get('/profile', authenticateToken, AuthController.getProfile);

module.exports = router;