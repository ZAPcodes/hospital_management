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
            const id = uuidv4().slice(0, 4);
            const [result] = await db.query(
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
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
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
            
            return { 
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
            };
        } catch (error) {
            throw new Error(`Error creating patient: ${error.message}`);
        }
    }

    static async findById(id) {
        const [patients] = await db.query(
            'SELECT * FROM patients WHERE id = ?',
            [id]
        );
        return patients[0];
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
            const [result] = await db.query(
                `UPDATE patients 
                 SET name = ?, age = ?, gender = ?, floor_number = ?, room_number = ?, bed_number = ?, diseases = ?, allergies = ?, medical_history = ?, contact_number = ?, emergency_contact = ?, updated_at = NOW()
                 WHERE id = ?`,
                [name, age, gender, floor_number, room_number, bed_number, diseases, allergies, medical_history, contact_number, emergency_contact, id]
            );
            return result.affectedRows > 0;
        } catch (error) {
            throw new Error(`Error updating patient: ${error.message}`);
        }
    }

    static async delete(id) {
        try {
            const [result] = await db.query(
                'DELETE FROM patients WHERE id = ?',
                [id]
            );

            if (result.affectedRows === 0) {
                throw new Error('Patient not found');
            }

            return true;
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
                .map(([key, value]) => {
                    values.push(value);
                    return `${key.toLowerCase()} = ?`;
                })
                .join(' AND ');
            query += ` WHERE ${whereConditions}`;
        }

        const [patients] = await db.query(query, values);
        return patients;
    }
}

module.exports = Patient;
