const express = require('express');
const router = express.Router();
const mealsController = require('../controllers/meal.controller');
const authController = require('../controllers/auth.controller');

// Protect all routes
// router.use(authController.verifyToken);

// Create new meal
router.post(
    '/meals',
    mealsController.create
);

// Get meals by diet chart ID
router.get(
    '/diet-charts/:dietChartId/meals',
    mealsController.getMealsByDietChart
);

// Get single meal
router.get(
    '/meals/:id',
    mealsController.getMealById
);

// Update meal
router.put(
    '/meals/:id',
    mealsController.updateMeal
);

// Delete meal
router.delete(
    '/meals/:id',
    mealsController.deleteMeal
);

// Get all meals
router.get('/meals', mealsController.getAllMeals);

module.exports = router;