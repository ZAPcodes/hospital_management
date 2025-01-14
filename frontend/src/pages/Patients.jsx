import { useState, useEffect } from 'react';
import axios from 'axios';
import Table from '../components/Table';
import Modal from '../components/Modal';
import Button from '../components/Button';
import { Plus, Edit, Trash } from 'lucide-react';
import PatientForm from '../components/PatientForm';

export default function Patients() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPatient, setCurrentPatient] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0
  });

  const columns = [
    { header: 'ID', accessor: 'id' },
    { header: 'Name', accessor: 'name' },
    { header: 'Age', accessor: 'age' },
    { header: 'Gender', accessor: 'gender' },
    { header: 'Room No.', accessor: 'room_number' },
    { header: 'Bed No.', accessor: 'bed_number' },
    { header: 'Floor', accessor: 'floor_number' },
    { header: 'Contact', accessor: 'contact_number' },
    { header: 'Emergency', accessor: 'emergency_contact' },
    { 
      header: 'Medical Details', 
      accessor: 'medical_details',
      Cell: ({ row }) => (
        <div className="max-w-xs truncate">
          <p><strong>Diseases:</strong> {row.diseases}</p>
          <p><strong>Allergies:</strong> {row.allergies}</p>
          <p><strong>History:</strong> {row.medical_history}</p>
        </div>
      )
    },
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
    fetchPatients();
  }, [pagination.page]);

  const fetchPatients = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get('http://localhost:8000/api/patients', {
        
        // params: {
        //   limit: pagination.limit,
        //   offset: (pagination.page - 1) * pagination.limit
        // }
      });
      console.log(response);

      if (response.data && Array.isArray(response.data)) {
        setPatients(response.data);
        setPagination(prev => ({
          ...prev,
          total: response.data.length || 0
        }));
      } else {
        setPatients([]);
        setError('Invalid data format received');
      }
    } catch (error) {
      console.error('Error fetching patients:', error);
      setError('Failed to fetch patients');
      setPatients([]);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (patient) => {
    setCurrentPatient(patient);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this patient?')) {
      return;
    }

    try {
      await axios.delete(`http://localhost:8000/api/patients/${id}`);
      await fetchPatients();
    } catch (error) {
      console.error('Error deleting patient:', error);
      setError('Failed to delete patient');
    }
  };

  return (
    <div className="p-4">
      <div className="flex justify-between mb-4">
        <h1 className="text-2xl font-bold">Patients</h1>
        <Button
          onClick={() => {
            setCurrentPatient(null);
            setIsModalOpen(true);
          }}
          variant="primary"
          icon={<Plus className="h-4 w-4" />}
        >
          Add Patient
        </Button>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}

      <Table
        columns={columns}
        data={patients}
        loading={loading}
        pagination={pagination}
        onPageChange={(page) => setPagination(prev => ({ ...prev, page }))}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={currentPatient ? 'Edit Patient' : 'Add Patient'}
      >
        <PatientForm
          patient={currentPatient}
          onSubmit={async (formData) => {
            try {
              if (currentPatient) {
                await axios.put(`http://localhost:8000/api/patients/${currentPatient.id}`, formData);
              } else {
                await axios.post('http://localhost:8000/api/patients', formData);
              }
              await fetchPatients();
              setIsModalOpen(false);
            } catch (error) {
              console.error('Error saving patient:', error);
              setError('Failed to save patient');
            }
          }}
          onClose={() => setIsModalOpen(false)}
        />
      </Modal>
    </div>
  );
}
