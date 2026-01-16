const StatCard = ({ title, value, icon, color }) => {
    // Map prop colors to Tailwind classes
    const colorMap = {
        green: 'bg-agri-green-100 text-agri-green-600',
        blue: 'bg-blue-100 text-blue-600',
        red: 'bg-red-100 text-red-600',
        orange: 'bg-orange-100 text-orange-600'
    };

    return (
        <div className="card-panel p-6 flex items-center justify-between hover:shadow-lg transition-shadow duration-300">
            <div>
                <p className="text-gray-500 text-sm mb-1 font-medium">{title}</p>
                <h3 className="text-2xl font-bold text-gray-800">{value}</h3>
            </div>
            <div className={`p-3 rounded-xl ${colorMap[color] || 'bg-gray-100'}`}>
                {icon}
            </div>
        </div>
    );
};

export default StatCard;
