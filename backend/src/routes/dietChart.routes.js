const express = require('express');
const router = express.Router();
const dietChartController = require('../controllers/dietChart.controller');
const authController = require('../controllers/auth.controller');

// Protect all routes
// router.use(authController.verifyToken);

// Create new diet chart
router.post(
    '/diet-charts',
    dietChartController.create
);

// Get diet charts by patient ID
router.get(
    '/patients/:patientId/diet-charts',
    dietChartController.getByPatientId
);

// Get single diet chart
router.get(
    '/diet-charts/:id',
    dietChartController.getDietChartById
);

// Get all diet charts
router.get('/diet-charts', dietChartController.getAllDietCharts);

// Update diet chart
router.put(
    '/diet-charts/:id',
    dietChartController.updateDietChart
);

// Delete diet chart
router.delete(
    '/diet-charts/:id',
    dietChartController.deleteDietChart
);

module.exports = router;