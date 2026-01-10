import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, ShieldCheck } from 'lucide-react';

const Navbar = () => {
  const { user, role, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-slate-900/60 backdrop-blur-xl transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo / Brand */}
          <Link to="/" className="flex items-center space-x-3 group">
              <div className="relative p-1 rounded-lg border border-white/10 bg-white/5">
                <img src="/logo pour affiche.png" alt="ENSIASD Logo" className="h-8 w-auto object-contain" />
              </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400 group-hover:from-cyan-400 group-hover:to-blue-400 transition-all duration-300">
              ENSIASD Certif
            </span>
          </Link>

          {/* Right Menu */}
          <div className="flex items-center space-x-8">
            {!user && !role ? (
              // Non-authenticated View
              <>
                <Link 
                  to="/verify" 
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${isActive('/verify') ? 'bg-white/10 text-cyan-400' : 'text-slate-300 hover:text-white hover:bg-white/5'}`}
                >
                  <ShieldCheck size={18} />
                  <span>Vérifier</span>
                </Link>

                <div className="h-6 w-px bg-white/10 hidden sm:block"></div>

                <div className="flex items-center gap-4">
                  <Link 
                    to="/login" 
                    className={`text-sm font-medium transition-colors hover:text-cyan-400 ${isActive('/login') ? 'text-cyan-400' : 'text-slate-300'}`}
                  >
                    Étudiant
                  </Link>
                  <Link 
                    to="/admin-login" 
                    className="group relative px-6 py-2.5 rounded-xl font-bold text-white text-sm shadow-lg shadow-cyan-500/20 bg-gradient-to-r from-cyan-500 to-blue-600 hover:shadow-cyan-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 overflow-hidden"
                  >
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></div>
                    <span className="relative z-10 flex items-center gap-2">
                       Accès Admin
                    </span>
                  </Link>
                </div>
              </>
            ) : (
              // Authenticated View
              <div className="flex items-center gap-6">
                <div className="flex flex-col items-end hidden sm:flex">
                  <span className="text-sm font-semibold text-white">
                    {role === 'ADMIN' ? 'Administrateur' : user?.firstName}
                  </span>
                  <span className="text-xs text-slate-400">
                    {role === 'ADMIN' ? 'Super User' : 'Étudiant'}
                  </span>
                </div>
                
                <div className="h-8 w-px bg-white/10 hidden sm:block"></div>

                <button 
                  onClick={handleLogout}
                  className="group flex items-center justify-center p-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-red-500/80 transition-all duration-300 border border-white/5 hover:border-red-500/50 hover:shadow-lg hover:shadow-red-500/20"
                  title="Déconnexion"
                >
                  <LogOut size={18} className="transform group-hover:-translate-x-0.5 transition-transform" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;