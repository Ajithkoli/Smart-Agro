import { useState } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import apiClient from '../services/apiClient';

const AddFarmModal = ({ isOpen, onClose, onFarmAdded }) => {
    const [formData, setFormData] = useState({
        name: '',
        village: '',
        district: '',
        state: '',
        areaInAcres: '',
        primaryCrops: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    if (!isOpen) return null;

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const payload = {
                name: formData.name,
                location: {
                    village: formData.village,
                    district: formData.district,
                    state: formData.state
                },
                areaInAcres: Number(formData.areaInAcres),
                primaryCrops: formData.primaryCrops.split(',').map(crop => crop.trim())
            };

            const res = await apiClient.post('/farms', payload);
            onFarmAdded(res.data);
            onClose();
            setFormData({ name: '', village: '', district: '', state: '', areaInAcres: '', primaryCrops: '' }); // Reset
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || 'Failed to add farm');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className="flex justify-between items-center p-6 border-b border-gray-100">
                    <h2 className="text-xl font-bold text-gray-900">Add New Farm</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
                        <XMarkIcon className="w-6 h-6" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">{error}</div>}

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Farm Name</label>
                        <input name="name" required value={formData.name} onChange={handleChange} className="input-field" placeholder="e.g. Green Valley Plot" />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Village</label>
                            <input name="village" required value={formData.village} onChange={handleChange} className="input-field" placeholder="Village Name" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">District</label>
                            <input name="district" required value={formData.district} onChange={handleChange} className="input-field" placeholder="District" />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                            <input name="state" required value={formData.state} onChange={handleChange} className="input-field" placeholder="State" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Area (Acres)</label>
                            <input name="areaInAcres" type="number" step="0.1" required value={formData.areaInAcres} onChange={handleChange} className="input-field" placeholder="e.g. 2.5" />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Crops (Comma separated)</label>
                        <input name="primaryCrops" required value={formData.primaryCrops} onChange={handleChange} className="input-field" placeholder="Wheat, Rice, Corn" />
                    </div>

                    <div className="pt-4 flex justify-end gap-3">
                        <button type="button" onClick={onClose} className="btn-secondary">Cancel</button>
                        <button type="submit" disabled={loading} className="btn-primary">
                            {loading ? 'Adding...' : 'Create Farm'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddFarmModal;
