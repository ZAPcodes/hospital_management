import { useState, useEffect } from 'react';
import axios from 'axios';
import Table from '../components/Table';
import Modal from '../components/Modal';
import Button from '../components/Button';
import { Plus, Edit, Truck } from 'lucide-react';
import DeliveryForm from '../components/DeliveryForm';

export default function Deliveries() {
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentDelivery, setCurrentDelivery] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0
  });

  const columns = [
    { header: 'ID', accessor: 'id' },
    { header: 'Patient', accessor: 'patient_name' },
    { header: 'Status', accessor: 'delivery_status' },
    { header: 'Assigned To', accessor: 'assigned_to' },
    { header: 'Time', accessor: 'timestamp' },
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
            onClick={() => handleStatusUpdate(row)}
            variant="primary"
            size="sm"
            icon={<Truck className="h-4 w-4" />}
            disabled={row.delivery_status === 'Delivered'}
            className={`${
              row.delivery_status === 'Delivered' 
                ? 'opacity-50 cursor-not-allowed' 
                : 'hover:bg-yellow-600'
            }`}
          >
            {row.delivery_status === 'Delivered' ? 'Delivered' : 'Update Status'}
          </Button>
        </div>
      )
    }
  ];

  useEffect(() => {
    fetchDeliveries();
  }, [pagination.page]);

  const fetchDeliveries = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`https://hospital-management-ghc3.onrender.com/api/deliveries`, {
        params: {
          limit: pagination.limit,
          offset: (pagination.page - 1) * pagination.limit
        }
      });
      
      setDeliveries(response.data.deliveries);
      setPagination(prev => ({
        ...prev,
        total: response.data.total
      }));
    } catch (error) {
      console.error('Error fetching deliveries:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (delivery) => {
    setCurrentDelivery(delivery);
    setIsModalOpen(true);
  };

  const handleStatusUpdate = async (delivery) => {
    try {
      await axios.patch(`https://hospital-management-ghc3.onrender.com/api/deliveries/${delivery.id}/status`, {
        deliveryStatus: getNextStatus(delivery.delivery_status) 
      });
      await fetchDeliveries();
    } catch (error) {
      console.error('Error updating delivery status:', error);
    }
  };

  const getNextStatus = (currentStatus) => {
    const statusFlow = {
      'Pending': 'InTransit',
        'InTransit': 'Delivered',
        'Delivered': 'Completed',
        'Failed': 'Failed'
    };
    return statusFlow[currentStatus] || currentStatus;
  };

  return (
    <div className="p-4">
      <div className="flex justify-between mb-4">
        <h1 className="text-2xl font-bold">Deliveries</h1>
        <Button
          onClick={() => {
            setCurrentDelivery(null);
            setIsModalOpen(true);
          }}
          variant="primary"
          icon={<Plus className="h-4 w-4" />}
        >
          New Delivery
        </Button>
      </div>

      <Table
        columns={columns}
        data={deliveries}
        loading={loading}
        pagination={pagination}
        onPageChange={(page) => setPagination(prev => ({ ...prev, page }))}
      />

<Modal
  isOpen={isModalOpen}
  onClose={() => setIsModalOpen(false)}
  title={currentDelivery ? 'Edit Delivery' : 'New Delivery'}
>
  <DeliveryForm
    delivery={currentDelivery}
    onSubmit={async (formData) => {
      if (currentDelivery) {
        await axios.put(`https://hospital-management-ghc3.onrender.com/api/deliveries/${currentDelivery.id}`, formData);
      } else {
        await axios.post('https://hospital-management-ghc3.onrender.com/api/deliveries', formData);
      }
      fetchDeliveries();
      setIsModalOpen(false);
    }}
    onClose={() => setIsModalOpen(false)}
  />
</Modal>
    </div>
  );
}
