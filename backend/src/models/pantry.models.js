const db = require('../config/database');
const { v4: uuidv4 } = require('uuid');

class Pantry {
    /**
     * Add a new pantry staff member.
     */
    static async addStaff({ name, contactInfo, location }) {
        if (!name || !contactInfo || !location) {
            throw new Error('Name, contact info, and location are required.');
        }

        const id = uuidv4();

        try {
            const result = await db.query(
                `INSERT INTO pantry_staff (id, name, contact_info, location)
                 VALUES ($1, $2, $3, $4)
                 RETURNING *`, // Return the inserted staff member
                [id, name, contactInfo, location]
            );
            return result.rows[0]; // Return the inserted staff member
        } catch (error) {
            if (error.code === '23505') { // PostgreSQL unique violation error
                throw new Error('Staff member with the same contact info already exists.');
            }
            throw new Error(`Error adding pantry staff: ${error.message}`);
        }
    }

    /**
     * Get all pantry staff or filter by criteria.
     */
    static async getStaff({ name, location } = {}) {
        let query = 'SELECT * FROM pantry_staff';
        const params = [];

        if (name || location) {
            query += ' WHERE';
            if (name) {
                query += ' name LIKE $' + (params.length + 1);  // Use dynamic parameterization
                params.push(`%${name}%`);
            }
            if (location) {
                if (params.length > 0) query += ' AND';
                query += ' location = $' + (params.length + 1);  // Use dynamic parameterization
                params.push(location);
            }
        }

        try {
            const result = await db.query(query, params);
            return result.rows;  // Return all staff members
        } catch (error) {
            throw new Error(`Error fetching pantry staff: ${error.message}`);
        }
    }

    /**
     * Update pantry staff details.
     */
    static async updateStaff(id, updates) {
        const allowedFields = ['name', 'contact_info', 'location'];
        const updateKeys = Object.keys(updates).filter(key => allowedFields.includes(key));

        if (updateKeys.length === 0) {
            throw new Error('No valid fields to update.');
        }

        const updateQuery = updateKeys.map((key, index) => `${key} = $${index + 1}`).join(', ');
        const params = [...updateKeys.map(key => updates[key]), id];

        try {
            const result = await db.query(
                `UPDATE pantry_staff SET ${updateQuery} WHERE id = $${params.length + 1} RETURNING *`,
                [...params, id]  // Add id at the end for WHERE clause
            );

            if (result.rows.length === 0) {
                throw new Error('Pantry staff not found.');
            }
            return result.rows[0];  // Return the updated staff member
        } catch (error) {
            throw new Error(`Error updating pantry staff: ${error.message}`);
        }
    }

    /**
     * Delete a pantry staff member.
     */
    static async deleteStaff(id) {
        try {
            const result = await db.query('DELETE FROM pantry_staff WHERE id = $1 RETURNING *', [id]);

            if (result.rows.length === 0) {
                throw new Error('Pantry staff not found.');
            }
            return true;  // Return true if deleted
        } catch (error) {
            throw new Error(`Error deleting pantry staff: ${error.message}`);
        }
    }

    /**
     * Find a pantry staff member by ID.
     */
    static async findById(id) {
        try {
            const result = await db.query('SELECT * FROM pantry_staff WHERE id = $1', [id]);
            return result.rows[0] || null;  // Return the staff member or null
        } catch (error) {
            throw new Error(`Error fetching pantry staff by ID: ${error.message}`);
        }
    }
}

module.exports = Pantry;
