import { useState, useEffect } from 'react';
import axios from 'axios';
import Table from '../components/Table';
import Modal from '../components/Modal';
import Button from '../components/Button';
import { Plus, Edit, Trash2 } from 'lucide-react';
import PantryStaffForm from '../components/PantryStaffForm';

export default function PantryStaff() {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentStaff, setCurrentStaff] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0
  });

  const columns = [
    { header: 'ID', accessor: 'id' },
    { header: 'Name', accessor: 'name' },
    { header: 'Contact Info', accessor: 'contact_info' },
    { header: 'Location', accessor: 'location' },
    { header: 'Status', accessor: 'status' },
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
            icon={<Trash2 className="h-4 w-4" />}
          >
            Delete
          </Button>
        </div>
      )
    }
  ];

  useEffect(() => {
    fetchStaff();
  }, [pagination.page]);

  const fetchStaff = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get('https://hospital-management-ghc3.onrender.com/api/pantry/staff', {
        params: {
          limit: pagination.limit,
          offset: (pagination.page - 1) * pagination.limit
        }
      });

      if (response.data && Array.isArray(response.data)) {
        setStaff(response.data);
        setPagination(prev => ({
          ...prev,
          total: response.data.length || 0
        }));
      } else {
        setStaff([]);
        setError('Invalid data format received');
      }
    } catch (error) {
      console.error('Error fetching staff:', error);
      setError('Failed to fetch staff members');
      setStaff([]);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (staff) => {
    setCurrentStaff(staff);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this staff member?')) {
      return;
    }

    try {
      await axios.delete(`https://hospital-management-ghc3.onrender.com/api/pantry/staff/${id}`);
      await fetchStaff();
    } catch (error) {
      console.error('Error deleting staff:', error);
      setError('Failed to delete staff member');
    }
  };

  return (
    <div className="p-4">
      <div className="flex justify-between mb-4">
        <h1 className="text-2xl font-bold">Pantry Staff</h1>
        <Button
          onClick={() => {
            setCurrentStaff(null);
            setIsModalOpen(true);
          }}
          variant="primary"
          icon={<Plus className="h-4 w-4" />}
        >
          Add Staff
        </Button>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}

      <Table
        columns={columns}
        data={staff}
        loading={loading}
        pagination={pagination}
        onPageChange={(page) => setPagination(prev => ({ ...prev, page }))}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={currentStaff ? 'Edit Staff Member' : 'Add Staff Member'}
      >
        <PantryStaffForm
          staff={currentStaff}
          onSubmit={async (formData) => {
            try {
              if (currentStaff) {
                await axios.put(`https://hospital-management-ghc3.onrender.com/api/pantry/staff/${currentStaff.id}`, formData);
              } else {
                await axios.post('https://hospital-management-ghc3.onrender.com/api/pantry/staff', formData);
              }
              await fetchStaff();
              setIsModalOpen(false);
            } catch (error) {
              console.error('Error saving staff:', error);
              setError('Failed to save staff member');
            }
          }}
          onClose={() => setIsModalOpen(false)}
        />
      </Modal>
    </div>
  );
}
