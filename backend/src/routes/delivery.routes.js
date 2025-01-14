const express = require('express');
const router = express.Router();
const deliveryController = require('../controllers/delivery.controller');
const authController = require('../controllers/auth.controller');

// Protect all routes
// router.use(authController.verifyToken);

// Create new delivery
router.post(
    '/deliveries',
    deliveryController.createDelivery
);

// Get all deliveries with pagination
router.get(
    '/deliveries',
    deliveryController.getAllDeliveries
);

// Get delivery by ID
router.get(
    '/deliveries/:id',
    deliveryController.getDeliveryById
);

// Update delivery status
router.patch(
    '/deliveries/:id/status',
    deliveryController.updateDeliveryStatus
);

// Delete delivery
router.delete(
    '/deliveries/:id',
    deliveryController.deleteDelivery
);

// Get deliveries by status
router.get(
    '/deliveries/status/:status',
    deliveryController.getDeliveriesByStatus
);

module.exports = router;