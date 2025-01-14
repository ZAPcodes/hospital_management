const db = require('../config/database');
const logger = require('../utils/Logger');

class DashboardController {
    async getStats(req, res) {
        try {
            const [totalPatients] = await db.query(
                'SELECT COUNT(*) as count FROM patients'
            );

            const [activeDietCharts] = await db.query(
                'SELECT COUNT(*) as count FROM diet_charts WHERE end_date >= CURDATE()'
            );

            const [mealsToday] = await db.query(
                'SELECT COUNT(*) as count FROM meals WHERE DATE(created_at) = CURDATE()'
            );

            const [pendingDeliveries] = await db.query(
                'SELECT COUNT(*) as count FROM deliveries WHERE delivery_status = "Pending"'
            );

            res.status(200).json({
                totalPatients: totalPatients[0].count,
                activeDietCharts: activeDietCharts[0].count,
                mealsToday: mealsToday[0].count,
                pendingDeliveries: pendingDeliveries[0].count
            });
        } catch (error) {
            logger.error('Error fetching dashboard stats:', error);
            res.status(500).json({ message: 'Error fetching dashboard statistics' });
        }
    }

    async getRecentActivities(req, res) {
        try {
            const [activities] = await db.query(`
                SELECT 
                    'diet_chart' as type,
                    id,
                    created_at,
                    patient_id
                FROM diet_charts
                WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
                UNION ALL
                SELECT 
                    'delivery' as type,
                    id,
                    timestamp as created_at,
                    patient_id
                FROM deliveries
                WHERE timestamp >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
                ORDER BY created_at DESC
                LIMIT 10
            `);

            res.status(200).json(activities);
        } catch (error) {
            logger.error('Error fetching recent activities:', error);
            res.status(500).json({ message: 'Error fetching recent activities' });
        }
    }
}

module.exports = new DashboardController();