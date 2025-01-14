const Patient = require('../models/patient.models');
const logger = require('../utils/logger');


class PatientController {
    static async create(req, res) {
        try {
            const patientData = {
                name: req.body.name,
                diseases: req.body.diseases,
                allergies: req.body.allergies,
                roomNumber: req.body.room_number,
                bedNumber: req.body.bed_number,
                floorNumber: req.body.floor_number,
                age: req.body.age,
                gender: req.body.gender,
                medicalHistory: req.body.medical_history,
                contactNumber: req.body.contact_number,
                emergencyContact: req.body.emergency_contact
            };

            const patient = await Patient.create({
                name: patientData.name,
                diseases: patientData.diseases,
                allergies: patientData.allergies,
                room_number: patientData.roomNumber,
                bed_number: patientData.bedNumber,
                floor_number: patientData.floorNumber,
                age: patientData.age,
                gender: patientData.gender,
                medical_history: patientData.medicalHistory,
                contact_number: patientData.contactNumber,
                emergency_contact: patientData.emergencyContact
            });

            res.status(201).json(patient);
        } catch (error) {
            logger.error('Error creating patient:', error);
            res.status(500).json({ message: 'Error creating patient' });
        }
    }

    static async findAll(req, res) {
        try {
            const patients = await Patient.findAll(req.query);
            res.status(200).json(patients);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    static async update(req, res) {
        try {
            const { id } = req.params;
            const updatedPatient = await Patient.update(id, req.body);
            res.status(200).json(updatedPatient);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    static async delete(req, res) {
        try {
            const { id } = req.params;
            await Patient.delete(id);
            res.status(204).send();
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
}

module.exports = PatientController;
