const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();  // Configure environment variables first

const logger = require('./src/utils/logger');
const config = require('./src/config/config');  
const pool = require('./src/config/database');
const authRoutes = require('./src/routes/auth.routes');
const patientRoutes = require('./src/routes/patient.routes');
const mealsRoutes = require('./src/routes/meals.routes');
const dietChartRoutes = require('./src/routes/dietChart.routes');
const deliveryRoutes = require('./src/routes/delivery.routes');
const pantryRoutes = require('./src/routes/pantry.routes');
const dashboardRoutes = require('./src/routes/dashboard.routes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database connection with error handling
async function startServer() {
    try {
        // Connect to database
        await pool.getConnection();
        console.log('Database connected successfully');

        // Base route for server health check
        app.get('/', (req, res) => {
            res.send("Hello World");
        });

        // API Routes
        app.use('/api', authRoutes);
        app.use('/api', patientRoutes);
        app.use('/api', mealsRoutes);
        app.use('/api', dietChartRoutes);
        app.use('/api', deliveryRoutes);
        app.use('/api', pantryRoutes);
        app.use('/api/dashboard', dashboardRoutes);

        // Error handling middleware
        app.use((err, req, res, next) => {
            console.error(err.stack);
            res.status(500).send('Something broke!');
        });

        // Start server
        const PORT = 10000;
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        }).on('error', (err) => {
            console.error('Server failed to start:', err);
            process.exit(1);
        });

    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
}

// Start the server
startServer().catch(error => {
    console.error('Unhandled server startup error:', error);
    process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
    process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
    console.error('Unhandled Rejection:', err);
    process.exit(1);
});