const db = require('../config/database');
const { v4: uuidv4 } = require('uuid');

class Meal {
    /**
     * Create a new meal for a diet chart
     */
    static async create({ dietChartId, type, ingredients, instructions = '' }) {
        if (!dietChartId || !type || !ingredients) {
            throw new Error('Missing required fields: dietChartId, type, ingredients');
        }

        const allowedTypes = ['morning', 'evening', 'night'];
        if (!allowedTypes.includes(type.toLowerCase())) {
            throw new Error(`Invalid meal type: ${type}. Allowed types are ${allowedTypes.join(', ')}`);
        }

        const id = uuidv4();

        try {
            const result = await db.query(
                `INSERT INTO meals (id, diet_chart_id, meal_type, ingredients, instructions, created_at, updated_at)
                 VALUES ($1, $2, $3, $4, $5, NOW(), NOW()) 
                 RETURNING *`, // Use RETURNING to get the inserted row
                [id, dietChartId, type.toLowerCase(), ingredients, instructions]
            );

            return result.rows[0]; // Return the newly created meal
        } catch (error) {
            if (error.code === '23503') { // Foreign key violation for dietChartId
                throw new Error('Invalid dietChartId. Diet chart not found.');
            }
            throw new Error(`Error creating meal: ${error.message}`);
        }
    }

    /**
     * Find meals by diet chart ID
     */
    static async findByDietChartId(dietChartId, { limit = 10, offset = 0 } = {}) {
        try {
            const result = await db.query(
                `SELECT * FROM meals 
                 WHERE diet_chart_id = $1
                 ORDER BY created_at ASC
                 LIMIT $2 OFFSET $3`,
                [dietChartId, limit, offset]
            );

            return result.rows; // Return meals
        } catch (error) {
            throw new Error(`Error fetching meals: ${error.message}`);
        }
    }

    /**
     * Find all meals with pagination
     */
    static async findAll({ limit = 10, offset = 0 } = {}) {
        try {
            const result = await db.query(
                `SELECT m.*, dc.patient_id 
                 FROM meals m
                 LEFT JOIN diet_charts dc ON m.diet_chart_id = dc.id
                 ORDER BY m.created_at DESC
                 LIMIT $1 OFFSET $2`,
                [limit, offset]
            );

            const totalResult = await db.query(
                'SELECT COUNT(*) as count FROM meals'
            );

            return {
                meals: result.rows,
                total: totalResult.rows[0].count,
                limit: parseInt(limit),
                offset: parseInt(offset)
            };
        } catch (error) {
            throw new Error(`Error fetching meals: ${error.message}`);
        }
    }

    /**
     * Update meal details
     */
    static async update(id, { type, ingredients, instructions }) {
        if (!id) {
            throw new Error('Meal ID is required for update');
        }

        const updates = [];
        const values = [];

        if (type) {
            updates.push('meal_type = $' + (values.length + 1));
            values.push(type.toLowerCase());
        }
        if (ingredients) {
            updates.push('ingredients = $' + (values.length + 1));
            values.push(ingredients);
        }
        if (instructions) {
            updates.push('instructions = $' + (values.length + 1));
            values.push(instructions);
        }

        if (updates.length === 0) {
            throw new Error('No fields provided for update');
        }

        values.push(id);

        try {
            const result = await db.query(
                `UPDATE meals 
                 SET ${updates.join(', ')}, updated_at = NOW()
                 WHERE id = $${values.length} 
                 RETURNING *`, // Use RETURNING to get the updated meal
                values
            );

            if (result.rows.length === 0) {
                throw new Error('Meal not found or no changes made');
            }

            return result.rows[0]; // Return the updated meal
        } catch (error) {
            throw new Error(`Error updating meal: ${error.message}`);
        }
    }

    /**
     * Delete a meal by ID
     */
    static async delete(id) {
        try {
            const result = await db.query('DELETE FROM meals WHERE id = $1 RETURNING *', [id]);

            if (result.rows.length === 0) {
                throw new Error('Meal not found');
            }

            return { message: 'Meal deleted successfully' };
        } catch (error) {
            throw new Error(`Error deleting meal: ${error.message}`);
        }
    }
}

module.exports = Meal;
