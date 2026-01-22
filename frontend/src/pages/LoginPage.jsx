import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setError('');
            const user = await login(email, password);
            // For demo, ensure role check works, otherwise default to dashboard
            if (user.role === 'admin') {
                navigate('/admin');
            } else {
                navigate('/dashboard');
            }
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || 'Failed to login');
        }
    };

    return (
        <div className="min-h-screen flex bg-white">
            {/* Left Side - Image */}
            <div className="hidden lg:block w-1/2 relative">
                <img
                    src="https://images.unsplash.com/photo-1628352081506-83c43123ed6d?auto=format&fit=crop&q=80&w=1000"
                    alt="Farmer looking at tablet"
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-agri-green-900/40 flex items-end p-12">
                    <div className="text-white">
                        <h2 className="text-3xl font-bold mb-2">Smart Farming for a Better Tomorrow</h2>
                        <p className="opacity-90">Join thousands of farmers optimizing their yield with data.</p>
                    </div>
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
                <div className="max-w-md w-full">
                    <div className="text-center mb-10">
                        <Link to="/" className="text-3xl font-bold text-gray-900">Smart<span className="text-agri-green-600">Agri</span></Link>
                        <h2 className="text-2xl font-semibold mt-6 text-gray-800">Welcome Back</h2>
                        <p className="text-gray-500 mt-2">Log in to your dashboard to view sensor data.</p>
                    </div>

                    {error && <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-6 text-sm">{error}</div>}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                required
                                className="input-field"
                                placeholder="farmer@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                autocomplete="email"
                            />
                        </div>
                        <div>
                            <div className="flex justify-between items-center mb-1">
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                                <a href="#" className="text-sm text-agri-green-600 hover:underline">Forgot password?</a>
                            </div>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                required
                                className="input-field"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                autocomplete="current-password"
                            />
                        </div>
                        <button type="submit" className="btn-primary w-full shadow-lg">
                            Sign In
                        </button>
                    </form>

                    <p className="mt-8 text-center text-sm text-gray-500">
                        Don't have an account?{' '}
                        <Link to="/register" className="text-agri-green-600 font-semibold hover:underline">
                            Create an account
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
