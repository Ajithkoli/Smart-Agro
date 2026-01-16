import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const RegisterPage = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        phone: '',
        role: 'farmer'
    });
    const [error, setError] = useState('');
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setError('');
            await register(formData);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to register');
        }
    };

    return (
        <div className="min-h-screen flex bg-white">
            {/* Left Side - Image */}
            <div className="hidden lg:block w-1/2 relative order-2">
                <img
                    src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=1000"
                    alt="Green Field Sunset"
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-agri-green-900/30 flex items-end p-12">
                    <div className="text-white">
                        <h2 className="text-3xl font-bold mb-2">Grow More, Use Less</h2>
                        <p className="opacity-90">Start your journey towards precision agriculture today.</p>
                    </div>
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 order-1">
                <div className="max-w-md w-full">
                    <div className="text-center mb-8">
                        <Link to="/" className="text-3xl font-bold text-gray-900">Smart<span className="text-agri-green-600">Agri</span></Link>
                        <h2 className="text-2xl font-semibold mt-6 text-gray-800">Create Account</h2>
                        <p className="text-gray-500 mt-2">Join global network of smart farmers.</p>
                    </div>

                    {error && <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-6 text-sm">{error}</div>}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                            <input
                                name="name"
                                type="text"
                                required
                                className="input-field"
                                placeholder="John Doe"
                                value={formData.name}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                            <input
                                name="email"
                                type="email"
                                required
                                className="input-field"
                                placeholder="john@farmemail.com"
                                value={formData.email}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Phone (Optional)</label>
                            <input
                                name="phone"
                                type="text"
                                className="input-field"
                                placeholder="+1 234 567 890"
                                value={formData.phone}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                            <input
                                name="password"
                                type="password"
                                required
                                className="input-field"
                                placeholder="Min 8 characters"
                                value={formData.password}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <label className="flex items-center gap-2 text-sm text-gray-600">
                                <input type="checkbox" required className="rounded border-gray-300 text-agri-green-600 focus:ring-agri-green-500" />
                                I agree to the <a href="#" className="text-agri-green-600 hover:underline">Terms of Service</a>
                            </label>
                        </div>
                        <button type="submit" className="btn-primary w-full mt-4">
                            Create Account
                        </button>
                    </form>

                    <p className="mt-8 text-center text-sm text-gray-500">
                        Already have an account?{' '}
                        <Link to="/login" className="text-agri-green-600 font-semibold hover:underline">
                            Login here
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;
