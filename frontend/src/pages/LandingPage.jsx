import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

const LandingPage = () => {
    const { user } = useAuth();
    return (
        <div className="min-h-screen bg-white text-gray-800">

            {/* Hero Section */}
            <div className="relative h-[600px] flex items-center justify-center overflow-hidden">
                {/* Background Image Overlay */}
                <div className="absolute inset-0 z-0">
                    <img
                        src="https://images.unsplash.com/photo-1495107334309-fcf20504a5ab?q=80&w=1920&auto=format&fit=crop"
                        alt="Smart Farm Field"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/30"></div>
                </div>

                <div className="relative z-10 container mx-auto px-6 text-center text-white">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <span className="inline-block py-1 px-3 rounded-full bg-agri-green-500/30 border border-agri-green-400 backdrop-blur-sm text-sm font-semibold tracking-wider mb-4">
                            POWERED BY IOT & AI
                        </span>
                        <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
                            Cultivating a <br />
                            <span className="text-agri-green-400">Zero Hunger</span> Future
                        </h1>
                        <p className="text-xl md:text-2xl font-light text-gray-200 mb-8 max-w-3xl mx-auto">
                            Empowering farmers with real-time soil data, smart irrigation insights, and precision agriculture tools to maximize yield.
                        </p>

                        <div className="flex gap-4 justify-center">
                            {user ? (
                                <Link to={user.role === 'admin' ? '/admin' : '/dashboard'} className="btn-primary text-lg px-8 py-3 shadow-xl shadow-agri-green-900/20">
                                    Go to Dashboard
                                </Link>
                            ) : (
                                <Link to="/register" className="btn-primary text-lg px-8 py-3 shadow-xl shadow-agri-green-900/20">
                                    Join the Platform
                                </Link>
                            )}
                            <a href="#features" className="px-8 py-3 rounded-lg border border-white/30 hover:bg-white/10 transition-all font-semibold">
                                Learn More
                            </a>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Features Section */}
            <section id="features" className="py-20 bg-agri-green-50">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Smart Agriculture?</h2>
                        <p className="text-gray-600 max-w-2xl mx-auto">
                            We combine traditional farming wisdom with cutting-edge technology to solve the world's most pressing food challenges.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {/* Card 1 */}
                        <div className="card-panel p-8 hover:-translate-y-2 transition-transform">
                            <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center mb-6 text-blue-600">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.25 9.75v-4.5m0 4.5h4.5m-4.5 0l6-6m-9.75 6.908l-.511-.476a1.125 1.125 0 00-1.077-.282c-.837.195-1.407.961-1.407 1.838v2.664c0 .858.6 1.626 1.439 1.777l1.045.188c1.397.251 2.21 1.761 1.688 3.033A19.85 19.85 0 0113.884 19.957a1.125 1.125 0 00-.773-.805 13.916 13.916 0 01-6.192-3.111l-.475-.512a1.125 1.125 0 00-1.121-.303c-.85.228-1.405 1.05-1.405 1.944v2.09c0 .927.604 1.748 1.487 1.936l.24.048c1.558.309 3.064-.42 5.09-2.126.96-.807 2.658-.807 3.618 0 .502.421 1.25.32 1.636-.239a54.346 54.346 0 003.56-5.875c.421-.861.169-1.896-.583-2.427a15.86 15.86 0 00-4.633-2.227 1.125 1.125 0 00-1.189.605l-.332.79a1.125 1.125 0 01-1.393.638l-1.078-.316a1.125 1.125 0 01-.795-1.002z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold mb-3 text-gray-800">Water Conservation</h3>
                            <p className="text-gray-500 leading-relaxed">
                                Optimize irrigation based on real-time soil moisture levels. Save water while ensuring crops get exactly what they need.
                            </p>
                        </div>

                        {/* Card 2 */}
                        <div className="card-panel p-8 hover:-translate-y-2 transition-transform">
                            <div className="w-14 h-14 bg-agri-green-100 rounded-2xl flex items-center justify-center mb-6 text-agri-green-600">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold mb-3 text-gray-800">Real-Time Insights</h3>
                            <p className="text-gray-500 leading-relaxed">
                                Monitor temperature, humidity, and chemical balance from anywhere. Get instant alerts on your phone.
                            </p>
                        </div>

                        {/* Card 3 */}
                        <div className="card-panel p-8 hover:-translate-y-2 transition-transform">
                            <div className="w-14 h-14 bg-orange-100 rounded-2xl flex items-center justify-center mb-6 text-orange-600">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold mb-3 text-gray-800">Yield Prediction</h3>
                            <p className="text-gray-500 leading-relaxed">
                                Use historical data and predictive analytics to forecast crop yields and plan harvest seasons better.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Sustainable Development Goal Section */}
            <section className="py-20">
                <div className="container mx-auto px-6">
                    <div className="flex flex-col md:flex-row items-center gap-12">
                        <div className="md:w-1/2">
                            <img
                                src="https://images.unsplash.com/photo-1464226184884-fa280b87c399?q=80&w=1000&auto=format&fit=crop"
                                alt="Sustainable Farming"
                                className="rounded-2xl shadow-2xl"
                            />
                        </div>
                        <div className="md:w-1/2">
                            <h4 className="text-agri-green-600 font-bold tracking-widest uppercase mb-2">UN Goal</h4>
                            <h2 className="text-4xl font-bold mb-6 text-gray-900">SDG 2: Zero Hunger</h2>
                            <p className="text-gray-600 mb-6 text-lg">
                                Our platform directly contributes to the United Nations Sustainable Development Goal 2. By equipping small-holder farmers with technology previously reserved for industrial giants, we are democratizing food security.
                            </p>
                            <ul className="space-y-4">
                                <li className="flex items-center gap-4">
                                    <div className="w-8 h-8 rounded-full bg-agri-green-100 flex items-center justify-center text-agri-green-600 font-bold">1</div>
                                    <span className="text-gray-700 font-medium">Double agricultural productivity</span>
                                </li>
                                <li className="flex items-center gap-4">
                                    <div className="w-8 h-8 rounded-full bg-agri-green-100 flex items-center justify-center text-agri-green-600 font-bold">2</div>
                                    <span className="text-gray-700 font-medium">Ensure sustainable food production systems</span>
                                </li>
                                <li className="flex items-center gap-4">
                                    <div className="w-8 h-8 rounded-full bg-agri-green-100 flex items-center justify-center text-agri-green-600 font-bold">3</div>
                                    <span className="text-gray-700 font-medium">Maintain genetic diversity of seeds</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default LandingPage;
