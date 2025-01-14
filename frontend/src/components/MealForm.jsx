import { useState, useEffect } from 'react';
import axios from 'axios';

const MealForm = ({ meal, onSubmit, onClose }) => {
  const [dietCharts, setDietCharts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    diet_chart_id: meal?.diet_chart_id || '',
    meal_type: meal?.meal_type || 'morning',
    ingredients: meal?.ingredients || '',
    instructions: meal?.instructions || ''
  });

  useEffect(() => {
    fetchDietCharts();
  }, []);

  const fetchDietCharts = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/diet-charts');
      setDietCharts(response.data.dietCharts);
    } catch (error) {
      setError('Error fetching diet charts');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await onSubmit(formData);
      onClose();
    } catch (error) {
      setError(error.response?.data?.message || 'Error saving meal');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-3 bg-red-100 text-red-700 rounded-md">{error}</div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Diet Chart
        </label>
        <select
          value={formData.diet_chart_id}
          onChange={(e) => setFormData({ ...formData, diet_chart_id: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500"
          required
        >
          <option value="">Select Diet Chart</option>
          {dietCharts.map((chart) => (
            <option key={chart.id} value={chart.id}>
              {`Diet Chart - ${chart.patient_name || chart.patient_id}`}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Meal Type
        </label>
        <select
          value={formData.meal_type}
          onChange={(e) => setFormData({ ...formData, meal_type: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500"
          required
        >
          <option value="morning">Morning</option>
          <option value="evening">Evening</option>
          <option value="night">Night</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Ingredients
        </label>
        <textarea
          value={formData.ingredients}
          onChange={(e) => setFormData({ ...formData, ingredients: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500"
          rows="3"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Instructions
        </label>
        <textarea
          value={formData.instructions}
          onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500"
          rows="3"
        />
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 text-sm font-medium text-white bg-yellow-500 rounded-md hover:bg-yellow-600 disabled:opacity-50"
        >
          {loading ? 'Saving...' : meal ? 'Update' : 'Create'}
        </button>
      </div>
    </form>
  );
};

export default MealForm;