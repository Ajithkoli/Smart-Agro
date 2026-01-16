import { useState, useEffect } from 'react';
import { ArrowUpTrayIcon, BeakerIcon, ExclamationTriangleIcon, CheckCircleIcon, ClockIcon } from '@heroicons/react/24/outline';
import apiClient from '../services/apiClient';

const PlantDiseasePrediction = () => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [prediction, setPrediction] = useState(null);
    const [loading, setLoading] = useState(false);
    const [history, setHistory] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchHistory();
    }, []);

    const fetchHistory = async () => {
        try {
            const res = await apiClient.get('/disease/history');
            setHistory(res.data);
        } catch (err) {
            console.error('Failed to fetch history', err);
        }
    };

    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            setPreview(URL.createObjectURL(file));
            setPrediction(null);
            setError('');
        }
    };

    const handlePredict = async () => {
        if (!selectedFile) return;

        setLoading(true);
        setError('');

        const formData = new FormData();
        formData.append('image', selectedFile);

        try {
            const res = await apiClient.post('/disease/predict', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setPrediction(res.data);
            fetchHistory(); // Refresh history
        } catch (err) {
            console.error(err);
            setError('Prediction failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const getSeverityColor = (severity) => {
        switch (severity) {
            case 'High': return 'text-red-600 bg-red-100 border-red-200';
            case 'Medium': return 'text-orange-600 bg-orange-100 border-orange-200';
            case 'Low': return 'text-green-600 bg-green-100 border-green-200';
            default: return 'text-gray-600 bg-gray-100';
        }
    };

    return (
        <div className="container mx-auto px-6 py-8 pb-20">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Plant Disease Detection</h1>
            <p className="text-gray-500 mb-8">Upload a leaf image to detect diseases using AI.</p>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Upload Section */}
                <div>
                    <div className="card-panel p-8 min-h-[400px] flex flex-col items-center justify-center border-2 border-dashed border-gray-300 hover:border-agri-green-500 transition-colors bg-gray-50 rounded-2xl">
                        {preview ? (
                            <div className="relative w-full h-full flex flex-col items-center">
                                <img src={preview} alt="Leaf Preview" className="max-h-64 object-contain rounded-lg shadow-md mb-6" />
                                <div className="flex gap-4">
                                    <label className="btn-secondary cursor-pointer">
                                        Change Image
                                        <input type="file" className="hidden" accept="image/*" onChange={handleFileSelect} />
                                    </label>
                                    <button
                                        onClick={handlePredict}
                                        disabled={loading}
                                        className="btn-primary flex items-center gap-2"
                                    >
                                        {loading ? (
                                            <>Processing...</>
                                        ) : (
                                            <>
                                                <BeakerIcon className="w-5 h-5" /> Analyze Image
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center">
                                <div className="w-16 h-16 bg-agri-green-100 text-agri-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <ArrowUpTrayIcon className="w-8 h-8" />
                                </div>
                                <h3 className="text-lg font-bold text-gray-900 mb-2">Upload Plant Leaf</h3>
                                <p className="text-gray-500 mb-6 text-sm">Supported formats: JPG, PNG</p>
                                <label className="btn-primary cursor-pointer px-6 py-2">
                                    Browse Files
                                    <input type="file" className="hidden" accept="image/*" onChange={handleFileSelect} />
                                </label>
                            </div>
                        )}
                        {error && <p className="text-red-500 mt-4 font-medium">{error}</p>}
                    </div>
                </div>

                {/* Result Section */}
                <div>
                    {prediction ? (
                        <div className="card-panel p-8 bg-white border border-gray-200 shadow-lg relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-10">
                                <BeakerIcon className="w-40 h-40 text-agri-green-600" />
                            </div>

                            <div className="relative z-10">
                                <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide mb-4 ${getSeverityColor(prediction.severity)}`}>
                                    Severity: {prediction.severity}
                                </span>

                                <h2 className="text-3xl font-bold text-gray-900 mb-2">{prediction.disease}</h2>
                                <p className="text-gray-500 flex items-center gap-2 mb-6">
                                    <CheckCircleIcon className="w-5 h-5 text-agri-green-500" />
                                    Confidence: <span className="font-bold text-gray-800">{prediction.confidence}%</span>
                                </p>

                                <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                                    <h4 className="font-bold text-blue-800 mb-2 flex items-center gap-2">
                                        <ExclamationTriangleIcon className="w-5 h-5" /> Recommended Treatment
                                    </h4>
                                    <p className="text-blue-700 leading-relaxed text-sm">
                                        {prediction.treatment}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-center p-8 text-gray-400 bg-white/50 rounded-2xl border border-gray-100">
                            <BeakerIcon className="w-16 h-16 mb-4 opacity-20" />
                            <p className="text-lg">No analysis result yet.</p>
                            <p className="text-sm">Upload an image and run analysis to see details.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* History Section */}
            <div className="mt-16">
                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <ClockIcon className="w-6 h-6 text-gray-400" /> Prediction History
                </h3>
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 border-b border-gray-100">
                                <tr>
                                    <th className="px-6 py-4 font-semibold text-gray-600 text-sm">Date</th>
                                    <th className="px-6 py-4 font-semibold text-gray-600 text-sm">Disease</th>
                                    <th className="px-6 py-4 font-semibold text-gray-600 text-sm">Confidence</th>
                                    <th className="px-6 py-4 font-semibold text-gray-600 text-sm">Severity</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {history.map((item) => (
                                    <tr key={item._id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 text-sm text-gray-500">
                                            {new Date(item.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 font-medium text-gray-900">{item.disease}</td>
                                        <td className="px-6 py-4 text-sm text-gray-600">{item.confidence}%</td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-block px-2 py-0.5 rounded text-xs font-bold ${getSeverityColor(item.severity)} bg-opacity-20 border-opacity-20`}>
                                                {item.severity}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                                {history.length === 0 && (
                                    <tr>
                                        <td colSpan="4" className="px-6 py-8 text-center text-gray-400 italic">No history found.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PlantDiseasePrediction;
