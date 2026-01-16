import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import apiClient from '../services/apiClient';
import StatCard from '../components/StatCard';
import AddFarmModal from '../components/AddFarmModal';
import { MapPinIcon, BellAlertIcon, CubeIcon } from '@heroicons/react/24/outline';

const FarmerDashboard = () => {
    const [farms, setFarms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleFarmAdded = (newFarm) => {
        setFarms((prev) => [...prev, newFarm]);
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const farmsRes = await apiClient.get('/farms');
                setFarms(farmsRes.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) return <div className="text-center mt-20 text-agri-green-600 animate-pulse font-semibold">Loading Dashboard...</div>;

    return (
        <div className="container mx-auto px-6 py-8">
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
                    value={farms.length}
                    icon={<MapPinIcon className="w-6 h-6" />}
                    color="green"
                />
                <StatCard
                    title="Active Devices"
                    value={farms.length * 2} // Mock for demo
                    icon={<CubeIcon className="w-6 h-6" />}
                    color="blue"
                />
                <StatCard
                    title="Recent Alerts"
                    value={3} // Mock for demo
                    icon={<BellAlertIcon className="w-6 h-6" />}
                    color="red"
                />
            </div>

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
                            <Link key={farm._id} to={`/farms/${farm._id}`} className="card-panel p-0 hover:shadow-xl group overflow-hidden block">
                                <div className="h-40 bg-gray-200 relative">
                                    {/* Placeholder Farm Image */}
                                    <img
                                        src="https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&q=80&w=500"
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
