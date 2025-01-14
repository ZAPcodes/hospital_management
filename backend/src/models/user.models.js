const db = require('../config/database'); // Ensure this connects to your PostgreSQL database
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');

class User {
    /**
     * User model handles all database operations for user management
     * Includes authentication and user data management methods
     */
    static async create({ username, password, email, role }) {
        try {
            // Hash password before storing
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
            const id = uuidv4();  // PostgreSQL UUID

            const result = await db.query(
                `INSERT INTO users (id, username, password, email, role)
                 VALUES ($1, $2, $3, $4, $5) RETURNING id, username, email, role`,
                [id, username, hashedPassword, email, role]
            );

            return result.rows[0];  // Returns the inserted user data
        } catch (error) {
            if (error.code === '23505') {  // PostgreSQL duplicate key error code
                throw new Error('Username or email already exists');
            }
            throw error;
        }
    }

    static async findById(id) {
        const result = await db.query(
            'SELECT id, username, email, role FROM users WHERE id = $1',
            [id]
        );
        return result.rows[0];  // Returns the user data
    }

    static async findByEmail(email) {
        const result = await db.query(
            'SELECT * FROM users WHERE email = $1',
            [email]
        );
        return result.rows[0];  // Returns the user data
    }

    static async validatePassword(user, password) {
        return bcrypt.compare(password, user.password);
    }
}

module.exports = User;
