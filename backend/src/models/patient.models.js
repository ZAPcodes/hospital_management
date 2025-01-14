const db = require('../config/database');
const { v4: uuidv4 } = require('uuid');

class Patient {
    /**
     * Patient model handles all database operations related to patient management
     * Includes CRUD operations and data validation
     */
    static async create({ 
        name, 
        age, 
        gender, 
        floor_number, 
        room_number, 
        bed_number,
        diseases,
        allergies,
        medical_history,
        contact_number,
        emergency_contact 
    }) {
        try {
            const id = uuidv4();  // Generate UUID for patient
            const result = await db.query(
                `INSERT INTO patients (
                    id, 
                    name, 
                    age, 
                    gender, 
                    floor_number, 
                    room_number, 
                    bed_number,
                    diseases,
                    allergies,
                    medical_history,
                    contact_number,
                    emergency_contact,
                    created_at,
                    updated_at
                ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, NOW(), NOW()) 
                RETURNING *`,
                [
                    id,
                    name,
                    age,
                    gender,
                    floor_number,
                    room_number,
                    bed_number,
                    diseases,
                    allergies,
                    medical_history,
                    contact_number,
                    emergency_contact
                ]
            );
            return result.rows[0];  // Return the inserted row
        } catch (error) {
            throw new Error(`Error creating patient: ${error.message}`);
        }
    }

    static async findById(id) {
        const result = await db.query(
            'SELECT * FROM patients WHERE id = $1',
            [id]
        );
        return result.rows[0];  // Return the found patient
    }

    static async update(id, { 
        name, 
        age, 
        gender, 
        floor_number, 
        room_number, 
        bed_number,
        diseases,
        allergies,
        medical_history,
        contact_number,
        emergency_contact 
    }) {
        try {
            const result = await db.query(
                `UPDATE patients 
                 SET name = $1, age = $2, gender = $3, floor_number = $4, room_number = $5, bed_number = $6, diseases = $7, allergies = $8, medical_history = $9, contact_number = $10, emergency_contact = $11, updated_at = NOW()
                 WHERE id = $12
                 RETURNING *`,  // Return the updated row
                [
                    name, age, gender, floor_number, room_number, bed_number, diseases, allergies, medical_history, contact_number, emergency_contact, id
                ]
            );
            return result.rows[0];  // Return the updated patient data
        } catch (error) {
            throw new Error(`Error updating patient: ${error.message}`);
        }
    }

    static async delete(id) {
        try {
            const result = await db.query(
                'DELETE FROM patients WHERE id = $1 RETURNING *',
                [id]
            );

            if (result.rows.length === 0) {
                throw new Error('Patient not found');
            }

            return true;  // Return true if deleted
        } catch (error) {
            throw new Error(`Error deleting patient: ${error.message}`);
        }
    }

    static async findAll(filters = {}) {
        let query = 'SELECT * FROM patients';
        const values = [];

        // Add dynamic filtering
        if (Object.keys(filters).length > 0) {
            const whereConditions = Object.entries(filters)
                .map(([key, value], index) => {
                    values.push(value);
                    return `${key.toLowerCase()} = $${index + 1}`;  // Use dynamic indexing for parameters
                })
                .join(' AND ');
            query += ` WHERE ${whereConditions}`;
        }

        const result = await db.query(query, values);
        return result.rows;  // Return all patients matching filters
    }
}

module.exports = Patient;
