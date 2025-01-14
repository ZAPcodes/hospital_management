const db = require('../config/database');
const { v4: uuidv4 } = require('uuid');

class Delivery {
    /**
     * Delivery model handles meal delivery operations and tracking.
     */
    static async create({ patientId, mealBoxDetails, assignedTo, deliveryStatus = 'Pending' }) {
        const id = uuidv4();
        const timestamp = new Date();

        try {
            const result = await db.query(
                `INSERT INTO deliveries (
                    id, patient_id, meal_box_details, assigned_to, delivery_status, timestamp
                ) VALUES ($1, $2, $3, $4, $5, $6)
                RETURNING *`, // Use RETURNING to get the inserted row
                [id, patientId, mealBoxDetails, assignedTo, deliveryStatus, timestamp]
            );

            return result.rows[0]; // Return the newly created delivery
        } catch (error) {
            throw new Error(`Error creating delivery record: ${error.message}`);
        }
    }

    static async updateStatus(id, deliveryStatus) {
        try {
            const result = await db.query(
                `UPDATE deliveries 
                 SET delivery_status = $1, 
                     updated_at = NOW() 
                 WHERE id = $2
                 RETURNING *`, // Use RETURNING to get the updated row
                [deliveryStatus, id]
            );

            if (result.rows.length === 0) {
                return null;
            }

            return result.rows[0]; // Return the updated delivery
        } catch (error) {
            throw new Error(`Error updating delivery status: ${error.message}`);
        }
    }

    static async findByAssignedTo(assignedTo) {
        try {
            const result = await db.query(
                `SELECT * FROM deliveries WHERE assigned_to = $1 ORDER BY timestamp DESC`,
                [assignedTo]
            );
            return result.rows; // Return deliveries by assigned person
        } catch (error) {
            throw new Error(`Error fetching deliveries: ${error.message}`);
        }
    }

    static async findByPatientId(patientId) {
        try {
            const result = await db.query(
                `SELECT * FROM deliveries WHERE patient_id = $1 ORDER BY timestamp DESC`,
                [patientId]
            );
            return result.rows; // Return deliveries for a specific patient
        } catch (error) {
            throw new Error(`Error fetching deliveries: ${error.message}`);
        }
    }

    static async findByStatus(deliveryStatus) {
        try {
            const result = await db.query(
                `SELECT * FROM deliveries WHERE delivery_status = $1 ORDER BY timestamp DESC`,
                [deliveryStatus]
            );
            return result.rows; // Return deliveries by status
        } catch (error) {
            throw new Error(`Error fetching deliveries: ${error.message}`);
        }
    }

    static async findAll({ limit = 10, offset = 0 } = {}) {
        try {
            const result = await db.query(
                `SELECT d.*, p.name as patient_name 
                 FROM deliveries d
                 LEFT JOIN patients p ON d.patient_id = p.id
                 ORDER BY d.timestamp DESC
                 LIMIT $1 OFFSET $2`,
                [limit, offset]
            );

            // Get total count for pagination
            const countResult = await db.query(
                `SELECT COUNT(*) as total FROM deliveries`
            );

            return {
                deliveries: result.rows,
                total: countResult.rows[0].total,
                limit: parseInt(limit),
                offset: parseInt(offset)
            };
        } catch (error) {
            throw new Error(`Error fetching deliveries: ${error.message}`);
        }
    }
}

module.exports = Delivery;
