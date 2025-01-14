import { useState, useEffect } from 'react';
import axios from 'axios';

const DietChartForm = ({ dietChart, onSubmit, onClose }) => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    patient_id: dietChart?.patient_id || '',
    start_date: dietChart?.start_date || '',
    end_date: dietChart?.end_date || '',
    special_instructions: dietChart?.special_instructions || ''
  });

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/patients');
      setPatients(response.data);
    } catch (error) {
      setError('Error fetching patients');
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
      setError(error.response?.data?.message || 'Error submitting form');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-3 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Patient
        </label>
        <select
          value={formData.patient_id}
          onChange={(e) => setFormData({ ...formData, patient_id: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500"
          required
        >
          <option value="">Select Patient</option>
          {patients.map((patient) => (
            <option key={patient.id} value={patient.id}>
              {patient.name}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Start Date
          </label>
          <input
            type="date"
            value={formData.start_date}
            onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            End Date
          </label>
          <input
            type="date"
            value={formData.end_date}
            onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500"
            required
            min={formData.start_date}
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Special Instructions
        </label>
        <textarea
          value={formData.special_instructions}
          onChange={(e) => setFormData({ ...formData, special_instructions: e.target.value })}
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
          {loading ? 'Saving...' : dietChart ? 'Update' : 'Create'}
        </button>
      </div>
    </form>
  );
};

export default DietChartForm;