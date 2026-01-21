import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import apiClient from '../services/apiClient';
import StatCard from '../components/StatCard';
import AddFarmModal from '../components/AddFarmModal';
import { MapPinIcon, BellAlertIcon, CubeIcon } from '@heroicons/react/24/outline';

const FarmerDashboard = () => {
    const [farms, setFarms] = useState([]);
    const [stats, setStats] = useState({
        totalFarms: 0,
        activeDevices: 0,
        alerts: 0
    });
    const [recentAlerts, setRecentAlerts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleFarmAdded = (newFarm) => {
        setFarms((prev) => [...prev, newFarm]);
        setStats(prev => ({ ...prev, totalFarms: prev.totalFarms + 1 }));
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                // 1. Fetch Farms
                const farmsRes = await apiClient.get('/farms');
                setFarms(farmsRes.data);

                // 2. Fetch Devices to calculate Active Devices & Alerts
                const devicesRes = await apiClient.get('/devices');
                const devices = devicesRes.data;
                const activeDevs = devices.filter(d => d.status === 'online').length;

                // 3. Move Loading State Update HERE
                setLoading(false); // Show dashboard immediately

                // 4. Calculate Alerts (Background)
                const alertPromises = devices.map(async (device) => {
                    try {
                        const res = await apiClient.get(`/readings/device/${device._id}?limit=1`);
                        const readings = res.data;
                        if (readings.length > 0) {
                            const latest = readings[readings.length - 1];

                            // Threshold Logic & Message Generation
                            if (latest.soilMoisture < 30) {
                                return { device: device.name, type: 'Critical', message: 'Low Soil Moisture', value: `${latest.soilMoisture}%`, time: latest.timestamp };
                            }
                            if (latest.temperature > 35) {
                                return { device: device.name, type: 'Warning', message: 'High Temperature', value: `${latest.temperature}°C`, time: latest.timestamp };
                            }
                            if (latest.humidity < 20) {
                                return { device: device.name, type: 'Warning', message: 'Low Humidity', value: `${latest.humidity}%`, time: latest.timestamp };
                            }
                            if (latest.nitrogen < 40) {
                                return { device: device.name, type: 'Info', message: 'Nutrient Deficiency (N)', value: `${latest.nitrogen} mg/kg`, time: latest.timestamp };
                            }
                        }
                    } catch (e) {
                        return null;
                    }
                    return null;
                });

                const alertResults = await Promise.all(alertPromises);
                const activeAlerts = alertResults.filter(Boolean);

                setRecentAlerts(activeAlerts);
                // Update stats with alert count (functional update to preserve other stats)
                setStats(prev => ({
                    ...prev,
                    alerts: activeAlerts.length
                }));

            } catch (error) {
                console.error('Error fetching dashboard data:', error);
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) return <div className="text-center mt-20 text-agri-green-600 animate-pulse font-semibold">Loading Dashboard...</div>;

    return (
        <div className="container mx-auto px-6 py-8 pb-20">
            <div className="flex justify-between items-end mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Farmer Dashboard</h1>
                    <p className="text-gray-500 mt-1">Manage your crops and sensors.</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="btn-primary shadow-lg shadow-agri-green-500/20"
                >
                    + Add New Farm
                </button>
            </div>

            {/* Overview Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                <StatCard
                    title="Total Farms"
                    value={stats.totalFarms}
                    icon={<MapPinIcon className="w-6 h-6" />}
                    color="green"
                />
                <StatCard
                    title="Active Sensors"
                    value={stats.activeDevices}
                    icon={<CubeIcon className="w-6 h-6" />}
                    color="blue"
                />
                <StatCard
                    title="Critical Alerts"
                    value={stats.alerts}
                    icon={<BellAlertIcon className="w-6 h-6" />}
                    color="red"
                />
            </div>

            {/* Alert Section */}
            {recentAlerts.length > 0 && (
                <div className="mb-12 animate-in fade-in slide-in-from-top-4 duration-500">
                    <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <BellAlertIcon className="w-6 h-6 text-red-500" />
                        Active Actions Required
                    </h2>
                    <div className="bg-white rounded-xl shadow-sm border border-red-100 overflow-hidden">
                        {recentAlerts.map((alert, idx) => (
                            <div key={idx} className="p-4 border-b border-gray-100 last:border-0 flex items-center justify-between hover:bg-red-50 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className={`p-2 rounded-full ${alert.type === 'Critical' ? 'bg-red-100 text-red-600' : 'bg-orange-100 text-orange-600'}`}>
                                        <BellAlertIcon className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-gray-900">{alert.message}</h4>
                                        <p className="text-sm text-gray-500">Sensor: {alert.device}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-gray-900">{alert.value}</p>
                                    <p className="text-xs text-gray-400">Just now</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Farms Grid */}
            <div className="mb-12">
                <h2 className="text-xl font-bold text-gray-800 mb-6">My Farms</h2>

                {farms.length === 0 ? (
                    <div className="card-panel p-16 text-center">
                        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                            <MapPinIcon className="w-10 h-10" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Farms Added</h3>
                        <p className="text-gray-500 mb-6">Start by registering your first farm location.</p>
                        <button onClick={() => setIsModalOpen(true)} className="btn-secondary">Add Farm</button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {farms.map((farm) => (
                            <Link key={farm._id} to={`/farms/${farm._id}`} className="card-panel p-0 hover:shadow-xl group overflow-hidden block transition-all duration-300">
                                <div className="h-40 bg-gray-200 relative">
                                    {/* Farm Image */}
                                    <img
                                        src={farm.imageUrl || `https://images.unsplash.com/photo-1625246333195-bf7fbc267e38?auto=format&fit=crop&q=80&w=500&random=${farm._id}`}
                                        alt="Farm"
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                                    <div className="absolute bottom-4 left-4 text-white">
                                        <h3 className="text-lg font-bold group-hover:text-agri-green-300 transition-colors">{farm.name}</h3>
                                        <p className="text-xs opacity-90">{farm.areaInAcres} Acres</p>
                                    </div>
                                </div>
                                <div className="p-6">
                                    <p className="text-gray-500 text-sm mb-4 flex items-center gap-1">
                                        <MapPinIcon className="w-4 h-4 text-agri-green-600" />
                                        {farm.location?.village}, {farm.location?.district}
                                    </p>
                                    <div className="flex gap-2 flex-wrap">
                                        {farm.primaryCrops?.map(crop => (
                                            <span key={crop} className="text-xs bg-agri-green-50 text-agri-green-700 font-medium px-2 py-1 rounded-md">
                                                {crop}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>

            <AddFarmModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onFarmAdded={handleFarmAdded}
            />
        </div>
    );
};

export default FarmerDashboard;
