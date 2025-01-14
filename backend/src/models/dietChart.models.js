const db = require('../config/database');
const { v4: uuidv4 } = require('uuid');

class DietChart {
    /**
     * Create a new diet chart
     */
    static async create({ patientId, startDate, endDate, specialInstructions = '', createdBy }) {
        if (!patientId || !startDate || !endDate || !createdBy) {
            throw new Error('Missing required fields: patientId, startDate, endDate, createdBy');
        }

        const id = uuidv4();

        try {
            const result = await db.query(
                `INSERT INTO diet_charts (
                    id, patient_id, start_date, end_date, 
                    special_instructions, created_by, created_at, updated_at
                ) VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW()) 
                RETURNING *`, // Use RETURNING to get the inserted row
                [id, patientId, startDate, endDate, specialInstructions, createdBy]
            );

            return result.rows[0]; // Return the newly created diet chart
        } catch (error) {
            if (error.code === '23503') { // Foreign key violation
                throw new Error('Patient ID not found');
            }
            throw new Error(`Error creating diet chart: ${error.message}`);
        }
    }

    /**
     * Fetch diet charts and associated meals by patient ID
     */
    static async findByPatientId(patientId, { limit = 10, offset = 0 } = {}) {
        try {
            const result = await db.query(
                `SELECT dc.*, m.id as meal_id, m.meal_type, m.ingredients, m.instructions 
                 FROM diet_charts dc
                 LEFT JOIN meals m ON m.diet_chart_id = dc.id
                 WHERE dc.patient_id = $1
                 ORDER BY dc.created_at DESC
                 LIMIT $2 OFFSET $3`,
                [patientId, limit, offset]
            );

            if (result.rows.length === 0) {
                return [];
            }

            // Group meals by diet chart
            const dietCharts = {};
            result.rows.forEach(row => {
                if (!dietCharts[row.id]) {
                    dietCharts[row.id] = {
                        id: row.id,
                        patientId: row.patient_id,
                        startDate: row.start_date,
                        endDate: row.end_date,
                        specialInstructions: row.special_instructions,
                        createdBy: row.created_by,
                        createdAt: row.created_at,
                        updatedAt: row.updated_at,
                        meals: [],
                    };
                }

                if (row.meal_id) {
                    dietCharts[row.id].meals.push({
                        id: row.meal_id,
                        type: row.meal_type,
                        ingredients: row.ingredients,
                        instructions: row.instructions,
                    });
                }
            });

            return Object.values(dietCharts);
        } catch (error) {
            throw new Error(`Error fetching diet charts: ${error.message}`);
        }
    }

    /**
     * Update a diet chart by ID
     */
    static async update(id, updates) {
        try {
            const { 
                patient_id: patientId, 
                start_date: startDate, 
                end_date: endDate, 
                special_instructions: specialInstructions 
            } = updates;

            // Validate required fields
            if (!patientId || !startDate || !endDate) {
                throw new Error('Missing required fields');
            }

            const result = await db.query(
                `UPDATE diet_charts 
                 SET patient_id = $1,
                     start_date = $2,
                     end_date = $3,
                     special_instructions = $4,
                     updated_at = NOW()
                 WHERE id = $5
                 RETURNING *`, // Use RETURNING to get the updated row
                [patientId, startDate, endDate, specialInstructions, id]
            );

            if (result.rows.length === 0) {
                throw new Error('Diet chart not found');
            }

            return result.rows[0]; // Return the updated diet chart
        } catch (error) {
            throw new Error(`Error updating diet chart: ${error.message}`);
        }
    }

    /**
     * Delete a diet chart by ID
     */
    static async delete(id) {
        try {
            const result = await db.query(
                `DELETE FROM diet_charts WHERE id = $1 RETURNING *`, 
                [id]
            );

            if (result.rows.length === 0) {
                throw new Error('Diet chart not found');
            }

            return { message: 'Diet chart deleted successfully' };
        } catch (error) {
            throw new Error(`Error deleting diet chart: ${error.message}`);
        }
    }
}

module.exports = DietChart;
