const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboard.controller');
const authController = require('../controllers/auth.controller');

// Protect all dashboard routes
// router.use(authController.verifyToken);

// Get dashboard statistics
router.get('/stats', dashboardController.getStats);

// Get recent activities
router.get('/recent-activities', dashboardController.getRecentActivities);

module.exports = router;