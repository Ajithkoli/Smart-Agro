import { useState } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import apiClient from '../services/apiClient';

const AddDeviceModal = ({ isOpen, onClose, farmId, onDeviceAdded }) => {
    const [formData, setFormData] = useState({
        name: '',
        deviceId: '',
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
                ...formData,
                farmId
            };

            const res = await apiClient.post('/devices', payload);
            if (onDeviceAdded) onDeviceAdded(res.data);
            onClose();
            setFormData({ name: '', deviceId: '' });
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || 'Failed to add device');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className="flex justify-between items-center p-6 border-b border-gray-100">
                    <h2 className="text-xl font-bold text-gray-900">Add New Sensor</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
                        <XMarkIcon className="w-6 h-6" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">{error}</div>}

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Sensor Name</label>
                        <input
                            name="name"
                            required
                            value={formData.name}
                            onChange={handleChange}
                            className="input-field"
                            placeholder="e.g. Field Alpha Moisture"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Device Hardware ID</label>
                        <input
                            name="deviceId"
                            required
                            value={formData.deviceId}
                            onChange={handleChange}
                            className="input-field"
                            placeholder="e.g. SN-2024-ABC-001"
                        />
                        <p className="text-xs text-gray-400 mt-1">Usually found on the bottom of the device.</p>
                    </div>

                    <div className="pt-4 flex justify-end gap-3">
                        <button type="button" onClick={onClose} className="btn-secondary">Cancel</button>
                        <button type="submit" disabled={loading} className="btn-primary">
                            {loading ? 'Registering...' : 'Register Device'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddDeviceModal;
