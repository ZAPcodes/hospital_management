const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
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
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
pool.getConnection();
dotenv.config();

app.listen(config.port, () => {
    logger.info(`Server started on port ${config.port}`);
});

app.use('/api', authRoutes);
app.use('/api', patientRoutes);
app.use('/api', mealsRoutes);
app.use('/api', dietChartRoutes);
app.use('/api', deliveryRoutes);
app.use('/api', pantryRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/',(req,res)=>{
    res.send("Hello World");
})




