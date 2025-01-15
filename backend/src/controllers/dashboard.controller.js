const db = require('../config/database');
const logger = require('../utils/logger');

class DashboardController {
    async getStats(req, res) {
        try {
            const totalPatientsResult = await db.query(
                'SELECT COUNT(*) as count FROM patients'
            );
            const totalPatients = totalPatientsResult.rows[0].count;

            const activeDietChartsResult = await db.query(
                'SELECT COUNT(*) as count FROM diet_charts WHERE end_date >= CURRENT_DATE'
            );
            const activeDietCharts = activeDietChartsResult.rows[0].count;

            const mealsTodayResult = await db.query(
                'SELECT COUNT(*) as count FROM meals WHERE DATE(created_at) = CURRENT_DATE'
            );
            const mealsToday = mealsTodayResult.rows[0].count;

            const pendingDeliveriesResult = await db.query(
                'SELECT COUNT(*) as count FROM deliveries WHERE delivery_status = $1',
                ['Pending']
            );
            const pendingDeliveries = pendingDeliveriesResult.rows[0].count;

            res.status(200).json({
                totalPatients,
                activeDietCharts,
                mealsToday,
                pendingDeliveries
            });
        } catch (error) {
            logger.error('Error fetching dashboard stats:', error);
            res.status(500).json({ message: 'Error fetching dashboard stats' });
        }
    }

    async getRecentActivities(req, res) {
        try {
            const result = await db.query(`
                SELECT 
                    'diet_chart' as type,
                    id,
                    created_at,
                    patient_id
                FROM diet_charts
                WHERE created_at >= NOW() - INTERVAL '7 days'
                UNION ALL
                SELECT 
                    'delivery' as type,
                    id,
                    timestamp as created_at,
                    patient_id
                FROM deliveries
                WHERE timestamp >= NOW() - INTERVAL '7 days'
                ORDER BY created_at DESC
                LIMIT 10
            `);

            const activities = result.rows;

            res.status(200).json(activities);
        } catch (error) {
            logger.error('Error fetching recent activities:', error);
            res.status(500).json({ message: 'Error fetching recent activities' });
        }
    }
}

module.exports = new DashboardController();