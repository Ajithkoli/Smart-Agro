import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import FarmerDashboard from './pages/FarmerDashboard';
import FarmDetails from './pages/FarmDetails';

import AdminDashboard from './pages/AdminDashboard';
import PlantDiseasePrediction from './pages/PlantDiseasePrediction';
import CropRecommendation from './pages/CropRecommendation'; // Import new page

const ProtectedRoute = ({ children, roles = [] }) => {
  // Ideally check auth here
  return children;
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen bg-agri-green-50 text-gray-800">
          <Routes>
            <Route path="/" element={<><Navbar /><LandingPage /></>} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/dashboard" element={<><Navbar /><ProtectedRoute><FarmerDashboard /></ProtectedRoute></>} />
            <Route path="/farms/:id" element={<><Navbar /><ProtectedRoute><FarmDetails /></ProtectedRoute></>} />
            <Route path="/disease-prediction" element={<><Navbar /><ProtectedRoute><PlantDiseasePrediction /></ProtectedRoute></>} />
            <Route path="/crop-recommendation" element={<><Navbar /><ProtectedRoute><CropRecommendation /></ProtectedRoute></>} />
            <Route path="/admin" element={<><Navbar /><ProtectedRoute roles={['admin']}><AdminDashboard /></ProtectedRoute></>} />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
