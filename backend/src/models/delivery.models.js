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
            const [result] = await db.query(
                `INSERT INTO deliveries (
                    id, patient_id, meal_box_details, assigned_to, delivery_status, timestamp
                ) VALUES (?, ?, ?, ?, ?, ?)`,
                [id, patientId, mealBoxDetails, assignedTo, deliveryStatus, timestamp]
            );
            return { id, patientId, mealBoxDetails, assignedTo, deliveryStatus, timestamp };
        } catch (error) {
            throw new Error(`Error creating delivery record: ${error.message}`);
        }
    }

    static async updateStatus(id, deliveryStatus) {
        try {
            const [result] = await db.query(
                `UPDATE deliveries 
                 SET delivery_status = ?, 
                     updated_at = NOW() 
                 WHERE id = ?`,
                [deliveryStatus, id]
            );

            if (result.affectedRows === 0) {
                return null;
            }

            const [updated] = await db.query(
                'SELECT * FROM deliveries WHERE id = ?',
                [id]
            );

            return updated[0];
        } catch (error) {
            throw new Error(`Error updating delivery status: ${error.message}`);
        }
    }

    static async findByAssignedTo(assignedTo) {
        try {
            const [deliveries] = await db.query(
                'SELECT * FROM deliveries WHERE assigned_to = ? ORDER BY timestamp DESC',
                [assignedTo]
            );
            return deliveries;
        } catch (error) {
            throw new Error(`Error fetching deliveries: ${error.message}`);
        }
    }

    static async findByPatientId(patientId) {
        try {
            const [deliveries] = await db.query(
                'SELECT * FROM deliveries WHERE patient_id = ? ORDER BY timestamp DESC',
                [patientId]
            );
            return deliveries;
        } catch (error) {
            throw new Error(`Error fetching deliveries: ${error.message}`);
        }
    }

    static async findByStatus(deliveryStatus) {
        try {
            const [deliveries] = await db.query(
                'SELECT * FROM deliveries WHERE delivery_status = ? ORDER BY timestamp DESC',
                [deliveryStatus]
            );
            return deliveries;
        } catch (error) {
            throw new Error(`Error fetching deliveries: ${error.message}`);
        }
    }
    static async findAll({ limit = 10, offset = 0 } = {}) {
        try {
            const [deliveries] = await db.query(
                `SELECT d.*, p.name as patient_name 
                 FROM deliveries d
                 LEFT JOIN patients p ON d.patient_id = p.id
                 ORDER BY d.timestamp DESC
                 LIMIT ? OFFSET ?`,
                [parseInt(limit), parseInt(offset)]
            );

            // Get total count for pagination
            const [countResult] = await db.query(
                'SELECT COUNT(*) as total FROM deliveries'
            );

            return {
                deliveries,
                total: countResult[0].total,
                limit: parseInt(limit),
                offset: parseInt(offset)
            };
        } catch (error) {
            throw new Error(`Error fetching deliveries: ${error.message}`);
        }
    }
}

module.exports = Delivery;
