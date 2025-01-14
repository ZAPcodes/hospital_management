const Meal = require('../models/meals.models');
const logger = require('../utils/logger');

class MealController {
    async create(req, res) {
        try {
            console.log('Request Body:', req.body);
            
            const { diet_chart_id , meal_type, ingredients, instructions } = req.body;
            
            const meal = await Meal.create({
                dietChartId: diet_chart_id,
                type:  meal_type,
                ingredients: ingredients,
                instructions: instructions
            });

            logger.info(`Meal created successfully with ID: ${meal.id}`);
            res.status(201).json(meal);
        } catch (error) {
            logger.error('Error in meal creation:', error);
            
            if (error.message.includes('Missing required fields')) {
                return res.status(400).json({ message: error.message });
            }
            if (error.message.includes('Invalid meal type')) {
                return res.status(400).json({ message: error.message });
            }
            if (error.message.includes('Diet chart not found')) {
                return res.status(404).json({ message: error.message });
            }
            
            res.status(500).json({ message: 'Internal server error while creating meal' });
        }
    }

    async getMealsByDietChart(req, res) {
        try {
            const { dietChartId } = req.params;
            const { page = 1, limit = 10 } = req.query;
            
            const offset = (page - 1) * limit;
            const meals = await Meal.findByDietChartId(dietChartId, { 
                limit: parseInt(limit), 
                offset: parseInt(offset) 
            });

            res.status(200).json(meals);
        } catch (error) {
            logger.error('Error fetching meals:', error);
            res.status(500).json({ message: 'Error fetching meals' });
        }
    }

    async getAllMeals(req, res) {
        try {
            const { limit, offset } = req.query;
            const meals = await Meal.findAll({ limit, offset });
            res.status(200).json(meals);
        } catch (error) {
            logger.error('Error fetching meals:', error);
            res.status(500).json({ message: 'Error fetching meals' });
        }
    }

    async updateMeal(req, res) {
        try {
            const { id } = req.params;
            const { type, ingredients, instructions } = req.body;

            const result = await Meal.update(id, {
                type,
                ingredients,
                instructions
            });

            res.status(200).json(result);
        } catch (error) {
            logger.error('Error updating meal:', error);
            
            if (error.message.includes('Meal not found')) {
                return res.status(404).json({ message: error.message });
            }
            if (error.message.includes('No fields provided')) {
                return res.status(400).json({ message: error.message });
            }
            
            res.status(500).json({ message: 'Error updating meal' });
        }
    }

    async deleteMeal(req, res) {
        try {
            const { id } = req.params;
            const result = await Meal.delete(id);
            
            res.status(200).json(result);
        } catch (error) {
            logger.error('Error deleting meal:', error);
            
            if (error.message.includes('Meal not found')) {
                return res.status(404).json({ message: error.message });
            }
            
            res.status(500).json({ message: 'Error deleting meal' });
        }
    }

    async getMealById(req, res) {
        try {
            const { id } = req.params;
            const meal = await Meal.findById(id);
            
            if (!meal) {
                return res.status(404).json({ message: 'Meal not found' });
            }
            
            res.status(200).json(meal);
        } catch (error) {
            logger.error('Error fetching meal:', error);
            res.status(500).json({ message: 'Error fetching meal details' });
        }
    }
}

module.exports = new MealController();