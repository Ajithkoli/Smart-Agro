import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import apiClient from '../services/apiClient';
import SensorChart from '../components/SensorChart';
import AddDeviceModal from '../components/AddDeviceModal';
import FarmSettingsModal from '../components/FarmSettingsModal';
import { MapPinIcon, CpuChipIcon, SunIcon, CloudIcon, BeakerIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';

const FarmDetails = () => {
    const { id } = useParams();
    const [farm, setFarm] = useState(null);
    const [devices, setDevices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedDevice, setSelectedDevice] = useState(null);
    const [readings, setReadings] = useState([]);
    const [isDeviceModalOpen, setIsDeviceModalOpen] = useState(false);
    const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

    useEffect(() => {
        const fetchFarmData = async () => {
            try {
                const farmRes = await apiClient.get(`/farms/${id}`);
                setFarm(farmRes.data);

                const devicesRes = await apiClient.get(`/devices?farmId=${id}`);
                setDevices(devicesRes.data);

                if (devicesRes.data.length > 0) {
                    setSelectedDevice(devicesRes.data[0]);
                }

                setLoading(false);
            } catch (error) {
                console.error('Error fetching farm details:', error);
                setLoading(false);
            }
        };

        fetchFarmData();
    }, [id]);

    useEffect(() => {
        if (!selectedDevice) return;

        const fetchReadings = async () => {
            try {
                // Fetch readings from backend (which fetches from Firebase)
                // Use selectedDevice._id to call the API, the backend will look up the device.deviceId
                const res = await apiClient.get(`/readings/device/${selectedDevice._id}?limit=20`);
                setReadings(res.data);
            } catch (error) {
                console.error('Error fetching sensor readings:', error);
            }
        };

        // Initial fetch
        fetchReadings();

        // Poll every 5 seconds for real-time updates
        const interval = setInterval(fetchReadings, 5000);

        return () => clearInterval(interval);
    }, [selectedDevice]);

    if (loading) return <div className="text-center mt-20 text-agri-green-600 animate-pulse font-semibold">Loading Farm Data...</div>;
    if (!farm) return <div className="text-center mt-20 text-red-500 font-semibold">Farm not found</div>;

    return (
        <div className="container mx-auto px-6 py-8 pb-20">
            <div className="mb-8">
                <Link to="/dashboard" className="text-gray-500 hover:text-agri-green-600 mb-4 inline-flex items-center gap-1 font-medium text-sm transition-colors">
                    <ArrowLeftIcon className="w-4 h-4" /> Back to Dashboard
                </Link>
                <div className="flex justify-between items-end">
                    <div>
                        <h1 className="text-4xl font-bold text-gray-900 mb-2">{farm.name}</h1>
                        <p className="text-gray-500 flex items-center gap-2">
                            <MapPinIcon className="w-5 h-5 text-gray-400" />
                            {farm.location?.village}, {farm.location?.district} ({farm.areaInAcres} Acres)
                        </p>
                    </div>
                    <button
                        onClick={() => setIsSettingsModalOpen(true)}
                        className="btn-outline text-gray-600 border-gray-300 hover:border-gray-400"
                    >
                        Settings
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Sidebar: Devices List */}
                <div className="col-span-1 card-panel p-6 h-fit bg-white border border-gray-200 shadow-sm">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold text-lg text-gray-800">Sensors</h3>
                        <button
                            onClick={() => setIsDeviceModalOpen(true)}
                            className="text-xs font-semibold text-agri-green-600 bg-agri-green-50 px-2 py-1 rounded hover:bg-agri-green-100"
                        >
                            + New
                        </button>
                    </div>
                    <div className="space-y-3">
                        {devices.map(device => (
                            <div
                                key={device._id}
                                onClick={() => setSelectedDevice(device)}
                                className={`p-4 rounded-lg cursor-pointer transition-all border flex items-center gap-3 ${selectedDevice?._id === device._id ? 'bg-agri-green-50 border-agri-green-200 ring-1 ring-agri-green-200' : 'bg-white border-gray-100 hover:border-gray-200 hover:bg-gray-50'}`}
                            >
                                <div className={`p-2 rounded-lg ${device.status === 'online' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-500'}`}>
                                    <CpuChipIcon className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="font-bold text-sm text-gray-800">{device.name}</p>
                                    <div className="flex items-center gap-1.5 mt-0.5">
                                        <span className={`w-2 h-2 rounded-full ${device.status === 'online' ? 'bg-green-500' : 'bg-gray-400'}`}></span>
                                        <p className="text-xs text-gray-500 uppercase font-medium">{device.status}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                        {devices.length === 0 && <p className="text-gray-400 text-sm italic">No devices found.</p>}
                    </div>
                </div>

                {/* Main Content: Charts & Map */}
                <div className="col-span-1 lg:col-span-3 space-y-8">
                    {/* Charts Section */}
                    {selectedDevice ? (
                        <div className="space-y-8">
                            {/* Dynamic Chart Rendering */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {(() => {
                                    // Define all possible metrics
                                    const allMetrics = [
                                        { key: 'soilMoisture', label: 'Soil Moisture', unit: '%', color: '#3b82f6', icon: <BeakerIcon className="w-5 h-5" />, bg: 'bg-blue-100', text: 'text-blue-600' },
                                        { key: 'temperature', label: 'Temperature', unit: '°C', color: '#eab308', icon: <SunIcon className="w-5 h-5" />, bg: 'bg-yellow-100', text: 'text-yellow-600' },
                                        { key: 'humidity', label: 'Humidity', unit: '%', color: '#9ca3af', icon: <CloudIcon className="w-5 h-5" />, bg: 'bg-gray-100', text: 'text-gray-600' },
                                        { key: 'nitrogen', label: 'Nitrogen (N)', unit: 'mg/kg', color: '#8b5cf6', icon: <BeakerIcon className="w-5 h-5" />, bg: 'bg-purple-100', text: 'text-purple-600' },
                                        { key: 'phosphorus', label: 'Phosphorus (P)', unit: 'mg/kg', color: '#f97316', icon: <BeakerIcon className="w-5 h-5" />, bg: 'bg-orange-100', text: 'text-orange-600' },
                                        { key: 'potassium', label: 'Potassium (K)', unit: 'mg/kg', color: '#ec4899', icon: <BeakerIcon className="w-5 h-5" />, bg: 'bg-pink-100', text: 'text-pink-600' },
                                        { key: 'pH', label: 'pH Level', unit: '', color: '#14b8a6', icon: <BeakerIcon className="w-5 h-5" />, bg: 'bg-teal-100', text: 'text-teal-600' },
                                    ];

                                    // Filter based on what data is actually present in the readings
                                    const availableMetrics = allMetrics.filter(metric => {
                                        // Check if ANY reading has this key with a valid number
                                        return readings.some(r => r[metric.key] !== undefined && r[metric.key] !== null);
                                    });

                                    if (availableMetrics.length === 0) return <p className="col-span-full text-center text-gray-400">No sensor data available.</p>;

                                    return availableMetrics.map(metric => (
                                        <div key={metric.key} className="card-panel p-6">
                                            <h4 className="text-lg font-bold mb-4 flex items-center gap-2 text-gray-800">
                                                <span className={`${metric.bg} p-1.5 rounded ${metric.text}`}>{metric.icon}</span>
                                                {metric.label}
                                            </h4>
                                            <SensorChart data={readings} dataKey={metric.key} color={metric.color} unit={metric.unit} />
                                        </div>
                                    ));
                                })()}
                            </div>
                        </div>
                    ) : (
                        <div className="card-panel p-16 text-center text-gray-500 bg-gray-50 border-dashed border-2 border-gray-200">
                            <CpuChipIcon className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                            <p>Select a device from the left to view telemetry data.</p>
                        </div>
                    )}
                </div>
            </div>

            <AddDeviceModal
                isOpen={isDeviceModalOpen}
                onClose={() => setIsDeviceModalOpen(false)}
                farmId={id}
                onDeviceAdded={(newDevice) => setDevices(prev => [...prev, newDevice])}
            />

            <FarmSettingsModal
                isOpen={isSettingsModalOpen}
                onClose={() => setIsSettingsModalOpen(false)}
                farm={farm}
                onUpdate={setFarm}
            />
        </div >
    );
};

export default FarmDetails;
