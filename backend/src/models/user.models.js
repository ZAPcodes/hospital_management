const db = require('../config/database');
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
            const id = uuidv4().slice(0, 4);

            const [result] = await db.query(
                `INSERT INTO users (id, username, password, email, role)
                 VALUES (?, ?, ?, ?, ?)`,
                [id, username, hashedPassword, email, role]
            );

            return { id, username, email, role };
        } catch (error) {
            if (error.code === 'ER_DUP_ENTRY') {
                throw new Error('Username or email already exists');
            }
            throw error;
        }
    }

    static async findById(id) {
        const [users] = await db.query(
            'SELECT id, username, email, role FROM users WHERE id = ?',
            [id]
        );
        return users[0];
    }

    static async findByEmail(email) {
        const [users] = await db.query(
            'SELECT * FROM users WHERE email = ?',
            [email]
        );
        return users[0];
    }

    static async validatePassword(user, password) {
        return bcrypt.compare(password, user.password);
    }
}

module.exports = User;