import { useState } from 'react';

const PatientForm = ({ patient, onSubmit, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: patient?.name || '',
    age: patient?.age || '',
    gender: patient?.gender || '',
    room_number: patient?.room_number || '',
    bed_number: patient?.bed_number || '',
    floor_number: patient?.floor_number || '',
    diseases: patient?.diseases || '',
    allergies: patient?.allergies || '',
    medical_history: patient?.medical_history || '',
    contact_number: patient?.contact_number || '',
    emergency_contact: patient?.emergency_contact || ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const requiredFields = [
      'name', 'age', 'gender', 'room_number', 
      'bed_number', 'floor_number', 'diseases',
      'allergies', 'medical_history', 'contact_number',
      'emergency_contact'
    ];

    const missingFields = requiredFields.filter(field => !formData[field]);
    if (missingFields.length > 0) {
      setError(`Please fill all required fields: ${missingFields.join(', ')}`);
      return;
    }

    setLoading(true);
    try {
      await onSubmit(formData);
      onClose();
    } catch (error) {
      setError(error.response?.data?.message || 'Error saving patient');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-3 text-sm text-red-500 bg-red-50 rounded-md">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-gray-700">Name</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Age</label>
          <input
            type="number"
            value={formData.age}
            onChange={(e) => setFormData({ ...formData, age: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Gender</label>
          <select
            value={formData.gender}
            onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500"
            required
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Room Number</label>
          <input
            type="text"
            value={formData.room_number}
            onChange={(e) => setFormData({ ...formData, room_number: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Bed Number</label>
          <input
            type="text"
            value={formData.bed_number}
            onChange={(e) => setFormData({ ...formData, bed_number: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Floor Number</label>
          <input
            type="text"
            value={formData.floor_number}
            onChange={(e) => setFormData({ ...formData, floor_number: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500"
            required
          />
        </div>

        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700">Diseases</label>
          <textarea
            value={formData.diseases}
            onChange={(e) => setFormData({ ...formData, diseases: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500"
            rows="2"
            required
          />
        </div>

        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700">Allergies</label>
          <textarea
            value={formData.allergies}
            onChange={(e) => setFormData({ ...formData, allergies: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500"
            rows="2"
            required
          />
        </div>

        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700">Medical History</label>
          <textarea
            value={formData.medical_history}
            onChange={(e) => setFormData({ ...formData, medical_history: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500"
            rows="3"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Contact Number</label>
          <input
            type="tel"
            value={formData.contact_number}
            onChange={(e) => setFormData({ ...formData, contact_number: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Emergency Contact</label>
          <input
            type="tel"
            value={formData.emergency_contact}
            onChange={(e) => setFormData({ ...formData, emergency_contact: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500"
            required
          />
        </div>
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          disabled={loading}
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 text-sm font-medium text-white bg-yellow-500 rounded-md hover:bg-yellow-600 disabled:opacity-50"
        >
          {loading ? 'Saving...' : patient ? 'Update Patient' : 'Add Patient'}
        </button>
      </div>
    </form>
  );
};

export default PatientForm;
