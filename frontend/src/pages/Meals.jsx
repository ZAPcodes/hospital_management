import { useState, useEffect } from 'react';
import axios from 'axios';
import Table from '../components/Table';
import Button from '../components/Button';
import Modal from '../components/Modal';
import { Plus, Edit, Trash } from 'lucide-react';
import MealForm from '../components/MealForm';

export default function Meals() {
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentMeal, setCurrentMeal] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0
  });

  const columns = [
    { header: 'ID', accessor: 'id' },
    { header: 'Diet Chart ID', accessor: 'diet_chart_id' },
    { header: 'Type', accessor: 'meal_type' },
    { header: 'Ingredients', accessor: 'ingredients' },
    { header: 'Instructions', accessor: 'instructions' },
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
    fetchMeals();
  }, [pagination.page]);

  const fetchMeals = async (dietChartId = null) => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.get("http://localhost:8000/api/meals", {
        params: {
          limit: pagination.limit,
          offset: (pagination.page - 1) * pagination.limit
        }
      });

      console.log('Meals:', response.data);
      
      
      if (response.data && Array.isArray(response.data.meals)) {
        setMeals(response.data.meals);
        setPagination(prev => ({
          ...prev,
          total: response.data.total || 0
        }));
      } else {
        setMeals([]);
        setError('Invalid data format received');
      }
    } catch (error) {
      console.error('Error fetching meals:', error);
      setError('Failed to fetch meals');
      setMeals([]);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (meal) => {
    setCurrentMeal(meal);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this meal?')) {
      return;
    }

    try {
      await axios.delete(`http://localhost:8000/api/meals/${id}`);
      await fetchMeals();
    } catch (error) {
      console.error('Error deleting meal:', error);
    }
  };

  return (
    <div className="p-4">
      <div className="flex justify-between mb-4">
        <h1 className="text-2xl font-bold">Meals</h1>
        <Button
          onClick={() => {
            setCurrentMeal(null);
            setIsModalOpen(true);
          }}
          variant="primary"
          icon={<Plus className="h-4 w-4" />}
        >
          New Meal
        </Button>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}

      <Table
        columns={columns}
        data={meals || []}
        loading={loading}
        pagination={pagination}
        onPageChange={(page) => setPagination(prev => ({ ...prev, page }))}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={currentMeal ? 'Edit Meal' : 'New Meal'}
      >
        <MealForm
          meal={currentMeal}
          onSubmit={async (formData) => {
            try {
              if (currentMeal) {
                await axios.put(`http://localhost:8000/api/meals/${currentMeal.id}`, formData);
              } else {
                await axios.post('http://localhost:8000/api/meals', formData);
              }
              await fetchMeals();
              setIsModalOpen(false);
            } catch (error) {
              console.error('Error saving meal:', error);
            }
          }}
          onClose={() => setIsModalOpen(false)}
        />
      </Modal>
    </div>
  );
}
