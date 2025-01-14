import { useState, useEffect } from 'react';
import axios from 'axios';
import Table from '../components/Table';
import Button from '../components/Button';
import Modal from '../components/Modal';
import { Plus, Edit, Trash } from 'lucide-react';

export default function DietCharts() {
  const [dietCharts, setDietCharts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentDietChart, setCurrentDietChart] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0
  });

  const columns = [
    { header: 'ID', accessor: 'id' },
    { header: 'Patient ID', accessor: 'patient_id' },
    { header: 'Start Date', accessor: 'start_date' },
    { header: 'End Date', accessor: 'end_date' },
    { header: 'Instructions', accessor: 'special_instructions' },
    {
      header: 'Actions',
      accessor: 'actions',
      Cell: ({ row }) => (
        <div className="flex space-x-2">
          <Button
            onClick={() => handleEdit(row)}
            variant="outline"
            size="sm"
            icon={<Edit className="h-4 w-4" />}
          >
            Edit
          </Button>
          <Button
            onClick={() => handleDelete(row.id)}
            variant="danger"
            size="sm"
            icon={<Trash className="h-4 w-4" />}
          >
            Delete
          </Button>
        </div>
      )
    }
  ];

  useEffect(() => {
    fetchDietCharts();
  }, [pagination.page]);

  const fetchDietCharts = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get('https://hospital-management-ghc3.onrender.com/api/diet-charts', {
        params: {
          limit: pagination.limit,
          offset: (pagination.page - 1) * pagination.limit
        }
      });
      
      if (response.data && Array.isArray(response.data.dietCharts)) {
        setDietCharts(response.data.dietCharts);
        setPagination(prev => ({
          ...prev,
          total: response.data.total || 0
        }));
      } else {
        setDietCharts([]);
        setError('Invalid data format received');
      }
    } catch (error) {
      console.error('Error fetching diet charts:', error);
      setError('Failed to fetch diet charts');
      setDietCharts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (dietChart) => {
    setCurrentDietChart(dietChart);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this diet chart?')) {
      return;
    }

    try {
      await axios.delete(`https://hospital-management-ghc3.onrender.com/api/diet-charts/${id}`);
      await fetchDietCharts();
    } catch (error) {
      console.error('Error deleting diet chart:', error);
    }
  };

  const handleFormSubmit = async (formData) => {
    try {
      if (currentDietChart) {
         await axios.put(`https://hospital-management-ghc3.onrender.com/api/diet-charts/${currentDietChart.id}`, formData);
       } else {
      console.log('formData:', formData);
      
        await axios.post('https://hospital-management-ghc3.onrender.com/api/diet-charts', formData);
    }
      await fetchDietCharts();
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error saving diet chart:', error);
    }
  };

  return (
    <div className="p-4">
      <div className="flex justify-between mb-4">
        <h1 className="text-2xl font-bold">Diet Charts</h1>
        <Button
          onClick={() => {
            setCurrentDietChart(null);
            setIsModalOpen(true);
          }}
          variant="primary"
          icon={<Plus className="h-4 w-4" />}
        >
          New Diet Chart
        </Button>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}

      <Table
        columns={columns}
        data={dietCharts || []}
        loading={loading}
        pagination={pagination}
        onPageChange={(page) => setPagination(prev => ({ ...prev, page }))}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={currentDietChart ? 'Edit Diet Chart' : 'New Diet Chart'}
      >
        <DietChartForm
          dietChart={currentDietChart}
          onSubmit={handleFormSubmit}
          onClose={() => setIsModalOpen(false)}
        />
      </Modal>
    </div>
  );
}

function DietChartForm({ dietChart, onSubmit, onClose }) {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState(
    dietChart || {
      patient_id: '',
      start_date: '',
      end_date: '',
      special_instructions: '',
    }
  );

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      const response = await axios.get('https://hospital-management-ghc3.onrender.com/api/patients');
      setPatients(response.data);
    } catch (err) {
      setError('Error loading patients');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isValidDateRange()) {
      setError('End date must be after start date');
      return;
    }

    setLoading(true);
    try {
      await onSubmit(formData);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Error saving diet chart');
    } finally {
      setLoading(false);
    }
  };

  const isValidDateRange = () => {
    return new Date(formData.end_date) >= new Date(formData.start_date);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-3 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700">Patient</label>
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
          <label className="block text-sm font-medium text-gray-700">Start Date</label>
          <input
            type="date"
            value={formData.start_date}
            onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">End Date</label>
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
}
