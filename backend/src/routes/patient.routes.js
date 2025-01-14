const express = require('express');
const router = express.Router();
const PatientController = require('../controllers/patient.controller');
const authController = require('../controllers/auth.controller');
const Patient = require('../models/patient.models');

// Protect all routes
// router.use(authController.verifyToken);

// Create patient
router.post(
    '/patients', 
    PatientController.create
);

// Get all patients
router.get(
    '/patients',
    PatientController.findAll
);

// Get single patient
router.get(
    '/patients/:id',
    async (req, res) => {
        try {
            const { id } = req.params;
            const patient = await Patient.findById(id);
            if (!patient) {
                return res.status(404).json({ message: 'Patient not found' });
            }
            res.status(200).json(patient);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
);

// Update patient
router.put(
    '/patients/:id',
    PatientController.update
);

// Delete patient
router.delete(
    '/patients/:id',
    PatientController.delete
);

module.exports = router;