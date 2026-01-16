import { useEffect, useState } from 'react';
import apiClient from '../services/apiClient';
import StatCard from '../components/StatCard';
import { UserGroupIcon, MapIcon, CpuChipIcon, TrashIcon } from '@heroicons/react/24/outline';

const AdminDashboard = () => {
    const [users, setUsers] = useState([]);
    const [farms, setFarms] = useState([]);
    const [devices, setDevices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [usersRes, farmsRes, devicesRes] = await Promise.all([
                    apiClient.get('/users'),
                    apiClient.get('/farms'),
                    apiClient.get('/devices')
                ]);

                setUsers(usersRes.data);
                setFarms(farmsRes.data);
                setDevices(devicesRes.data);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching admin data:', err);
                setError('Failed to load system data');
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleDeleteUser = async (userId) => {
        if (!window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) return;
        try {
            await apiClient.delete(`/users/${userId}`);
            setUsers(users.filter(u => u._id !== userId));
        } catch (err) {
            alert('Failed to delete user');
        }
    };

    if (loading) return <div className="text-center mt-20 text-agri-green-600 animate-pulse font-semibold">Loading Admin Panel...</div>;

    return (
        <div className="container mx-auto px-6 py-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">System Administration</h1>
            <p className="text-gray-500 mb-8">Overview of platform metrics and user management.</p>

            {/* Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                <StatCard
                    title="Total Users"
                    value={users.length}
                    icon={<UserGroupIcon className="w-6 h-6" />}
                    color="blue"
                />
                <StatCard
                    title="Total Farms"
                    value={farms.length}
                    icon={<MapIcon className="w-6 h-6" />}
                    color="green"
                />
                <StatCard
                    title="Active Devices"
                    value={devices.length}
                    icon={<CpuChipIcon className="w-6 h-6" />}
                    color="orange"
                />
            </div>

            {/* Users List */}
            <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                    <h2 className="font-bold text-gray-800">User Management</h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-gray-600">
                        <thead className="bg-gray-50 text-xs uppercase font-semibold text-gray-500">
                            <tr>
                                <th className="px-6 py-3">Name</th>
                                <th className="px-6 py-3">Email</th>
                                <th className="px-6 py-3">Role</th>
                                <th className="px-6 py-3">Joined</th>
                                <th className="px-6 py-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {users.map((user) => (
                                <tr key={user._id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 font-medium text-gray-900">{user.name}</td>
                                    <td className="px-6 py-4">{user.email}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded text-xs font-semibold ${user.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-agri-green-100 text-agri-green-700'}`}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">{new Date(user.createdAt).toLocaleDateString()}</td>
                                    <td className="px-6 py-4 text-right">
                                        {user.role !== 'admin' && ( // Prevent deleting other admins for safety in this demo
                                            <button
                                                onClick={() => handleDeleteUser(user._id)}
                                                className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 rounded-full transition-colors"
                                                title="Delete User"
                                            >
                                                <TrashIcon className="w-5 h-5" />
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
