const dotenv = require('dotenv');
dotenv.config();

const config = {
    env: process.env.NODE_ENV || 'development',
    port: process.env.PORT || 3000,
    jwtSecret: process.env.JWT_SECRET,
    jwtExpirationInterval: process.env.JWT_EXPIRATION_INTERVAL || '1h',
    
    // Logging configuration
    logs: {
        level: process.env.LOG_LEVEL || 'info',
    },
    
    // API configuration
    api: {
        prefix: '/api/v1',
    },
    
    // Cors configuration
    cors: {
        origin: process.env.CORS_ORIGIN || '*',
        credentials: true,
    }
};

module.exports = config;