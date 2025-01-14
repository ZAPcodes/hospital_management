const mysql = require('mysql2/promise');
const logger = require('../utils/logger');
const dotenv = require('dotenv');
dotenv.config();

/**
 * Database configuration and connection pool setup
 * Uses environment variables for secure configuration
 */
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    timezone: '+00:00'
});

// Test database connection
pool.getConnection()
    .then(connection => {
        logger.info('Database connection established successfully');
        connection.release();
    })
    .catch(error => {
        logger.error('Error connecting to database:', error);
        process.exit(1);
    });

module.exports = pool;