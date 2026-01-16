import { useState, useEffect } from 'react';
import apiClient from '../services/apiClient';
import { BeakerIcon, CloudIcon, SunIcon } from '@heroicons/react/24/outline';

const CropRecommendation = () => {
    const [formData, setFormData] = useState({
        N: '',
        P: '',
        K: '',
        temperature: '',
        humidity: '',
        ph: '',
        rainfall: ''
    });
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [history, setHistory] = useState([]);

    useEffect(() => {
        fetchHistory();
    }, []);

    const fetchHistory = async () => {
        try {
            const res = await apiClient.get('/crop/history');
            setHistory(res.data);
        } catch (err) {
            console.error('Failed to fetch history', err);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setResult(null);

        try {
            const res = await apiClient.post('/crop/recommend', formData);
            setResult(res.data);
            fetchHistory(); // Refresh history
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || 'Failed to get recommendation');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto px-6 py-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Crop Recommendation System</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Input Form */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                        <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                            <BeakerIcon className="w-6 h-6 text-agri-green-600" />
                            Soil & Climate Data
                        </h2>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Nitrogen (N)</label>
                                    <input type="number" name="N" required value={formData.N} onChange={handleChange} className="w-full rounded-lg border-gray-300 focus:ring-agri-green-500 focus:border-agri-green-500" placeholder="0-140" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Phosphorus (P)</label>
                                    <input type="number" name="P" required value={formData.P} onChange={handleChange} className="w-full rounded-lg border-gray-300 focus:ring-agri-green-500 focus:border-agri-green-500" placeholder="0-145" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Potassium (K)</label>
                                    <input type="number" name="K" required value={formData.K} onChange={handleChange} className="w-full rounded-lg border-gray-300 focus:ring-agri-green-500 focus:border-agri-green-500" placeholder="0-205" />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1"><SunIcon className="w-4 h-4" /> Temp (°C)</label>
                                    <input type="number" step="0.1" name="temperature" required value={formData.temperature} onChange={handleChange} className="w-full rounded-lg border-gray-300 focus:ring-agri-green-500 focus:border-agri-green-500" placeholder="25.0" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1"><CloudIcon className="w-4 h-4" /> Humidity (%)</label>
                                    <input type="number" step="0.1" name="humidity" required value={formData.humidity} onChange={handleChange} className="w-full rounded-lg border-gray-300 focus:ring-agri-green-500 focus:border-agri-green-500" placeholder="70.0" />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">pH Level</label>
                                    <input type="number" step="0.1" name="ph" required value={formData.ph} onChange={handleChange} className="w-full rounded-lg border-gray-300 focus:ring-agri-green-500 focus:border-agri-green-500" placeholder="6.5" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Rainfall (mm)</label>
                                    <input type="number" step="0.1" name="rainfall" required value={formData.rainfall} onChange={handleChange} className="w-full rounded-lg border-gray-300 focus:ring-agri-green-500 focus:border-agri-green-500" placeholder="200" />
                                </div>
                            </div>

                            {error && <div className="text-red-500 text-sm bg-red-50 p-3 rounded-lg">{error}</div>}

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full btn-primary py-3 text-lg font-semibold shadow-md flex justify-center items-center gap-2"
                            >
                                {loading ? (
                                    <>Processing...</>
                                ) : (
                                    <>Get Recommendation</>
                                )}
                            </button>
                        </form>
                    </div>

                    {/* Result Card */}
                    {result && (
                        <div className="bg-gradient-to-br from-agri-green-50 to-green-100 rounded-xl shadow-lg p-6 mt-6 border border-agri-green-200 animate-fade-in-up">
                            <h3 className="text-gray-600 font-medium mb-1">Recommended Crop</h3>
                            <div className="text-4xl font-extrabold text-agri-green-800 mb-4 capitalize">
                                {result.recommendedCrop}
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-600">Confidence Score</span>
                                <span className="text-lg font-bold text-agri-green-700">{result.confidence}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                                <div className="bg-agri-green-600 h-2.5 rounded-full" style={{ width: `${result.confidence}%` }}></div>
                            </div>
                        </div>
                    )}
                </div>

                {/* History Table */}
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
                            <h3 className="font-bold text-gray-800">Use History</h3>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="text-xs text-gray-500 uppercase bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3">Date</th>
                                        <th className="px-6 py-3">N-P-K</th>
                                        <th className="px-6 py-3">Env (T/H/pH/R)</th>
                                        <th className="px-6 py-3">Recommendation</th>
                                        <th className="px-6 py-3">Conf.</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {history.map((item) => (
                                        <tr key={item._id} className="border-b hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {new Date(item.createdAt).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 font-mono text-xs">
                                                {item.N}-{item.P}-{item.K}
                                            </td>
                                            <td className="px-6 py-4 text-xs text-gray-500">
                                                {item.temperature}°C / {item.humidity}% / {item.ph}pH / {item.rainfall}mm
                                            </td>
                                            <td className="px-6 py-4 font-bold text-agri-green-700 capitalize">
                                                {item.recommendedCrop}
                                            </td>
                                            <td className="px-6 py-4 text-gray-500">
                                                {item.confidence}%
                                            </td>
                                        </tr>
                                    ))}
                                    {history.length === 0 && (
                                        <tr>
                                            <td colSpan="5" className="px-6 py-8 text-center text-gray-400">
                                                No history available.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CropRecommendation;
