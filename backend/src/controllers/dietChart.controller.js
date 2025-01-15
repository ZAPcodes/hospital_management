const { log } = require('winston');
const DietChart = require('../models/dietChart.models');
const logger = require('../utils/logger');
const db = require('../config/database');

class DietChartController {
    async create(req, res) {
        try {
            console.log('Request Body:', req.body);
            
            const { patient_id, start_date, end_date, special_instructions } = req.body;
            const createdBy = "ZAP"; // From auth middleware

            console.log('Patient ID:', patient_id),
            console.log('Start Date:', start_date),
            console.log('End Date:', end_date),
            console.log('Special Instructions:', special_instructions),
            console.log('Created By:', createdBy);
    
            const dietChart = await DietChart.create({
                patientId: patient_id,
                startDate: start_date,
                endDate: end_date,
                specialInstructions: special_instructions,
                createdBy
            });

            logger.info(`Diet chart created successfully with ID: ${dietChart.id}`);
            res.status(201).json(dietChart);
        } catch (error) {
            logger.error('Error in diet chart creation:', error);
            
            if (error.message.includes('Missing required fields')) {
                return res.status(400).json({ message: error.message });
            }
            if (error.message.includes('Patient ID not found')) {
                return res.status(404).json({ message: error.message });
            }
            
            res.status(500).json({ message: 'Internal server error while creating diet chart' });
        }
    }

    async getByPatientId(req, res) {
        try {
            const { patientId } = req.params;
            const { page = 1, limit = 10 } = req.query;
            
            const offset = (page - 1) * limit;
            const dietCharts = await DietChart.findByPatientId(patientId, {
                limit: parseInt(limit),
                offset: parseInt(offset)
            });

            res.status(200).json(dietCharts);
        } catch (error) {
            logger.error('Error fetching diet charts:', error);
            res.status(500).json({ message: 'Error fetching diet charts' });
        }
    }

    async deleteDietChart(req, res) {
        try {
            const { id } = req.params;
            const result = await DietChart.delete(id);
            
            res.status(200).json(result);
        } catch (error) {
            logger.error('Error deleting diet chart:', error);
            
            if (error.message.includes('Diet chart not found')) {
                return res.status(404).json({ message: error.message });
            }
            
            res.status(500).json({ message: 'Error deleting diet chart' });
        }
    }

    async updateDietChart(req, res) {
        try {
            const { id } = req.params;
            const updates = req.body;
            console.log('ID:', id);
            
            console.log('Updates:', updates);
            
            
            const result = await DietChart.update(id, updates);
            
            if (!result) {
                return res.status(404).json({ message: 'Diet chart not found' });
            }
            
            res.status(200).json(result);
        } catch (error) {
            logger.error('Error updating diet chart:', error);
            
            if (error.message.includes('Invalid data')) {
                return res.status(400).json({ message: error.message });
            }
            
            res.status(500).json({ message: 'Error updating diet chart' });
        }
    }

    async getDietChartById(req, res) {
        try {
            const { id } = req.params;
            const dietChart = await DietChart.findById(id);
            
            if (!dietChart) {
                return res.status(404).json({ message: 'Diet chart not found' });
            }
            
            res.status(200).json(dietChart);
        } catch (error) {
            logger.error('Error fetching diet chart:', error);
            res.status(500).json({ message: 'Error fetching diet chart details' });
        }
    }

    async getAllDietCharts(req, res) {
        try {
            const { limit = 10, offset = 0 } = req.query;
            
            const result = await db.query(
                `SELECT dc.*, p.name as patient_name
                 FROM diet_charts dc
                 LEFT JOIN patients p ON dc.patient_id = p.id
                 ORDER BY dc.created_at DESC
                 LIMIT $1 OFFSET $2`,
                [parseInt(limit), parseInt(offset)]
            );

            const dietCharts = result.rows;

            // Get total count
            const totalResult = await db.query(
                'SELECT COUNT(*) as count FROM diet_charts'
            );

            const total = totalResult.rows[0].count;

            res.status(200).json({
                dietCharts,
                total,
                limit: parseInt(limit),
                offset: parseInt(offset)
            });
        } catch (error) {
            logger.error('Error fetching diet charts:', error);
            res.status(500).json({ message: 'Error fetching diet charts' });
        }
    }
}

module.exports = new DietChartController();