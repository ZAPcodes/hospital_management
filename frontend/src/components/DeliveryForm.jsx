import { useState, useEffect } from 'react';
import axios from 'axios';

const DeliveryForm = ({ delivery, onSubmit, onClose }) => {
  const [formData, setFormData] = useState({
    patientId: delivery?.patientId || '',
    mealBoxDetails: delivery?.mealBoxDetails || '',
    assignedTo: delivery?.assignedTo || '',  // Staff name as string
    deliveryStatus: delivery?.deliveryStatus || 'Pending'
  });
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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
    if (!formData.assignedTo.trim()) {
      setError('Staff name is required');
      return;
    }
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
          value={formData.patientId}
          onChange={(e) => setFormData({ ...formData, patientId: e.target.value })}
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

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Meal Box Details
        </label>
        <textarea
          value={formData.mealBoxDetails}
          onChange={(e) => setFormData({ ...formData, mealBoxDetails: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500"
          rows="3"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Assigned Staff Name
        </label>
        <input
          type="text"
          value={formData.assignedTo}
          onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500"
          placeholder="Enter staff name"
          required
        />
      </div>

      {delivery && (
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Status
          </label>
          <select
            value={formData.deliveryStatus}
            onChange={(e) => setFormData({ ...formData, deliveryStatus: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500"
          >
            <option value="Pending">Pending</option>
            <option value="InTransit">In Transit</option>
            <option value="Delivered">Delivered</option>
            <option value="Failed">Failed</option>
          </select>
        </div>
      )}

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
          {loading ? 'Saving...' : delivery ? 'Update' : 'Create'}
        </button>
      </div>
    </form>
  );
};

export default DeliveryForm;