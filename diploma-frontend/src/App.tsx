import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Login from './pages/Login';
import LandingPage from './pages/LandingPage';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import Verify from './pages/Verify'; // <--- IMPORT DU FICHIER CRÉÉ
import VerificationPage from './pages/VerificationPage';
import StudentDashboard from './pages/StudentDashboard';

// Placeholder pour l'instant

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-transparent flex flex-col">
          <Navbar />
          <div className="container mx-auto px-4 flex-grow">
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/admin-login" element={<AdminLogin />} />
              <Route path="/admin-dashboard" element={<AdminDashboard />} />
              <Route path="/student-dashboard" element={<StudentDashboard />} />
              
              {/* 1. Route pour l'UPLOAD manuel (http://.../verify) */}
              {/* On enlève le "/:id?" car l'upload n'a pas besoin d'ID */}
              <Route path="/verify" element={<Verify />} />

              {/* 2. Route pour le QR CODE (http://.../verify/F136102099) */}
              {/* Cette page s'affiche UNIQUEMENT s'il y a un CNE dans l'URL */}
              <Route path="/verify/:cne" element={<VerificationPage />} />
            </Routes>
          </div>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;