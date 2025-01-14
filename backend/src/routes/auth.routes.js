const express = require('express');
const AuthController = require('../controllers/auth.controller');
const authenticate = require('../middleware/authenticate.middleware');

const router = express.Router();

// Public routes
router.post('/register', AuthController.register);
router.post('/login', AuthController.login);

// Protected routes
router.get('/get-user', authenticate, AuthController.getCurrentUser);

module.exports = router;
