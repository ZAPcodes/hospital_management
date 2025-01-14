const express = require('express');
const router = express.Router();
const pantryController = require('../controllers/pantry.controller');
const authController = require('../controllers/auth.controller');

// Protect all routes
// router.use(authController.verifyToken);

// Add new pantry staff
router.post(
    '/pantry/staff',
    pantryController.addStaff
);

// Get all staff members
router.get(
    '/pantry/staff',
    pantryController.getAllStaff
);

// Get staff member by ID
router.get(
    '/pantry/staff/:id',
    pantryController.getStaffById
);

// Update staff member
router.put(
    '/pantry/staff/:id',
    pantryController.updateStaff
);

// Delete staff member
router.delete(
    '/pantry/staff/:id',
    pantryController.deleteStaff
);

// Get staff by location
router.get(
    '/pantry/staff/location/:location',
    pantryController.getStaffByLocation
);

module.exports = router;