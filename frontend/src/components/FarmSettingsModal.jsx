import { useState, useEffect } from 'react';
import { XMarkIcon, TrashIcon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';
import apiClient from '../services/apiClient';

const FarmSettingsModal = ({ isOpen, onClose, farm, onUpdate }) => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        village: '',
        district: '',
        state: '',
        areaInAcres: '',
        primaryCrops: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (farm) {
            setFormData({
                name: farm.name || '',
                village: farm.location?.village || '',
                district: farm.location?.district || '',
                state: farm.location?.state || '',
                areaInAcres: farm.areaInAcres || '',
                primaryCrops: farm.primaryCrops?.join(', ') || '',
            });
        }
    }, [farm]);

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
                    state: formData.state,
                },
                areaInAcres: Number(formData.areaInAcres),
                primaryCrops: formData.primaryCrops.split(',').map((crop) => crop.trim()),
            };

            const res = await apiClient.patch(`/farms/${farm._id}`, payload);
            onUpdate(res.data);
            onClose();
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || 'Failed to update farm');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!window.confirm('Are you sure you want to delete this farm? This action cannot be undone.')) return;

        setLoading(true);
        try {
            await apiClient.delete(`/farms/${farm._id}`);
            navigate('/dashboard');
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || 'Failed to delete farm');
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className="flex justify-between items-center p-6 border-b border-gray-100">
                    <h2 className="text-xl font-bold text-gray-900">Farm Settings</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
                        <XMarkIcon className="w-6 h-6" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">{error}</div>}

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Farm Name</label>
                        <input name="name" required value={formData.name} onChange={handleChange} className="input-field" />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Village</label>
                            <input name="village" required value={formData.village} onChange={handleChange} className="input-field" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">District</label>
                            <input name="district" required value={formData.district} onChange={handleChange} className="input-field" />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                            <input name="state" required value={formData.state} onChange={handleChange} className="input-field" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Area (Acres)</label>
                            <input name="areaInAcres" type="number" step="0.1" required value={formData.areaInAcres} onChange={handleChange} className="input-field" />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Crops</label>
                        <input name="primaryCrops" required value={formData.primaryCrops} onChange={handleChange} className="input-field" />
                    </div>

                    <div className="pt-6 border-t border-gray-100 flex justify-between items-center">
                        <button
                            type="button"
                            onClick={handleDelete}
                            className="text-red-600 hover:text-red-700 text-sm font-medium flex items-center gap-1"
                        >
                            <TrashIcon className="w-4 h-4" /> Delete Farm
                        </button>
                        <div className="flex gap-3">
                            <button type="button" onClick={onClose} className="btn-secondary">Cancel</button>
                            <button type="submit" disabled={loading} className="btn-primary">
                                {loading ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default FarmSettingsModal;
