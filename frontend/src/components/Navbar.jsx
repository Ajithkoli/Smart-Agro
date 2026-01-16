import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { UserCircleIcon } from '@heroicons/react/24/solid';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="bg-white/90 backdrop-blur-md sticky top-0 z-50 border-b border-gray-100 shadow-sm">
            <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                <Link to="/" className="flex items-center gap-2 group">
                    {/* Logo Icon */}
                    <div className="bg-agri-green-100 p-2 rounded-lg group-hover:bg-agri-green-200 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-agri-green-600">
                            <path d="M12.378 1.602a.75.75 0 0 0-.756 0L3 6.632l9 5.25 9-5.25-8.622-5.03ZM21.75 7.93l-9 5.25v9l8.628-5.032a.75.75 0 0 0 .372-.648V7.93ZM11.25 22.18v-9l-9-5.25v8.57a.75.75 0 0 0 .372.648l8.628 5.033Z" />
                        </svg>
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-gray-900 tracking-tight">Smart<span className="text-agri-green-600">Agri</span></h1>
                        <p className="text-[0.65rem] font-medium text-gray-500 tracking-widest uppercase">SDG 2: Zero Hunger</p>
                    </div>
                </Link>

                <div className="flex items-center gap-6">
                    {user ? (
                        <>
                            <Link to={user.role === 'admin' ? '/admin' : '/dashboard'} className="hidden md:block text-gray-600 hover:text-agri-green-600 font-medium transition-colors">
                                Dashboard
                            </Link>
                            <Link to="/disease-prediction" className="hidden md:block text-gray-600 hover:text-agri-green-600 font-medium transition-colors">
                                Disease Detection
                            </Link>
                            <Link to="/crop-recommendation" className="hidden md:block text-gray-600 hover:text-agri-green-600 font-medium transition-colors">
                                Crop Rec.
                            </Link>
                            <Menu as="div" className="relative">
                                <Menu.Button className="flex items-center gap-2 hover:bg-gray-50 p-2 rounded-full transition-colors">
                                    <span className="hidden md:block text-sm font-medium text-gray-700">{user.name}</span>
                                    <UserCircleIcon className="w-8 h-8 text-gray-400" />
                                </Menu.Button>
                                <Transition
                                    as={Fragment}
                                    enter="transition ease-out duration-100"
                                    enterFrom="transform opacity-0 scale-95"
                                    enterTo="transform opacity-100 scale-100"
                                    leave="transition ease-in duration-75"
                                    leaveFrom="transform opacity-100 scale-100"
                                    leaveTo="transform opacity-0 scale-95"
                                >
                                    <Menu.Items className="absolute right-0 mt-2 w-48 origin-top-right bg-white rounded-lg shadow-xl ring-1 ring-black ring-opacity-5 focus:outline-none flex flex-col p-1">
                                        <Menu.Item>
                                            {({ active }) => (
                                                <button
                                                    onClick={handleLogout}
                                                    className={`${active ? 'bg-agri-green-50 text-agri-green-700' : 'text-gray-700'
                                                        } group flex w-full items-center rounded-md px-4 py-2 text-sm`}
                                                >
                                                    Logout
                                                </button>
                                            )}
                                        </Menu.Item>
                                    </Menu.Items>
                                </Transition>
                            </Menu>
                        </>
                    ) : (
                        <div className="flex gap-4 items-center">
                            <Link to="/login" className="text-gray-600 hover:text-agri-green-600 font-medium transition-colors">Login</Link>
                            <Link to="/register" className="btn-primary py-2 px-5 text-sm shadow-agri-green-200">Get Started</Link>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
