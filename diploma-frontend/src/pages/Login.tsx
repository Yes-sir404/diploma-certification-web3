import { useState, useEffect } from 'react'; // <--- J'ai ajouté useEffect ici
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/authService';
import { User, Lock, Loader2, ArrowRight, Database } from 'lucide-react';

const Login = () => {
  const [cne, setCne] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [focusedInput, setFocusedInput] = useState<string | null>(null);
  
  // J'ai ajouté 'role' et 'isAuthenticated' ici pour pouvoir tester si on est connecté
  const { login, role, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // --- LE FIX DE REDIRECTION EST ICI ---
  useEffect(() => {
    if (isAuthenticated && role === 'STUDENT') {
      navigate('/student-dashboard');
    } else if (isAuthenticated && role === 'ADMIN') {
      navigate('/admin-dashboard');
    }
  }, [isAuthenticated, role, navigate]);
  // -------------------------------------

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = await authService.loginStudent({ cne, password });
      login(data.user, 'STUDENT');
      // La navigation se fera soit ici, soit via le useEffect
      navigate('/student-dashboard');
    } catch (err: any) {
      setError(err.response?.data?.error || "Connexion échouée. Vérifiez vos identifiants.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 pt-24 overflow-hidden bg-slate-900">
      
      {/* Dynamic Background Elements */}
      <div className="absolute inset-0 bg-grid-pattern opacity-20 pointer-events-none"></div>
      
      {/* Floating Orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl animate-float pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl animate-float pointer-events-none" style={{ animationDelay: '-3s' }}></div>

      {/* Main Container */}
      <div className="w-full max-w-md relative z-10 perspective-1000">
        
        {/* Card */}
        <div className="glass-panel p-8 sm:p-10 rounded-2xl shadow-2xl shadow-black/50 border border-white/10 animate-fade-in-up">
          
          {/* Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-40 h-40 mb-2 animate-pulse-glow">
              <img src="/logo pour affiche.png" alt="ENSIASD Logo" className="w-full h-full object-contain" />
            </div>
            <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-cyan-100 to-slate-400 mb-2">
              Espace Étudiant
            </h2>
            <p className="text-slate-400 text-sm font-medium">
              Accédez à vos certificats certifiés sur la blockchain
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-3 text-red-400 text-sm animate-fade-in-up">
              <div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-2 flex-shrink-0" />
              <p>{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Input CNE */}
            <div className={`group relative transition-all duration-300 ${focusedInput === 'cne' ? 'scale-[1.02]' : ''}`}>
              <div className={`absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl blur opacity-0 transition duration-300 group-hover:opacity-50 ${focusedInput === 'cne' ? 'opacity-75' : ''}`}></div>
              <div className="relative bg-slate-900 rounded-xl">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <User className={`h-5 w-5 transition-colors duration-300 ${focusedInput === 'cne' ? 'text-cyan-400' : 'text-slate-500'}`} />
                </div>
                <input
                  type="text"
                  placeholder="Code National Étudiant (CNE)"
                  value={cne}
                  onChange={(e) => setCne(e.target.value)}
                  onFocus={() => setFocusedInput('cne')}
                  onBlur={() => setFocusedInput(null)}
                  className="w-full pl-12 pr-4 py-4 bg-slate-900/90 border border-white/5 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:bg-slate-900 transition-all"
                  required
                />
              </div>
            </div>

            {/* Input Password */}
            <div className={`group relative transition-all duration-300 ${focusedInput === 'password' ? 'scale-[1.02]' : ''}`}>
              <div className={`absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl blur opacity-0 transition duration-300 group-hover:opacity-50 ${focusedInput === 'password' ? 'opacity-75' : ''}`}></div>
              <div className="relative bg-slate-900 rounded-xl">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className={`h-5 w-5 transition-colors duration-300 ${focusedInput === 'password' ? 'text-cyan-400' : 'text-slate-500'}`} />
                </div>
                <input
                  type="password"
                  placeholder="Mot de passe"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setFocusedInput('password')}
                  onBlur={() => setFocusedInput(null)}
                  className="w-full pl-12 pr-4 py-4 bg-slate-900/90 border border-white/5 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:bg-slate-900 transition-all"
                  required
                />
              </div>
            </div>

            {/* Button */}
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full py-4 px-6 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl font-bold text-white shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></div>
              <div className="flex items-center justify-center gap-2">
                {loading ? (
                  <>
                    <Loader2 className="animate-spin h-5 w-5" />
                    <span>Connexion...</span>
                  </>
                ) : (
                  <>
                    <span>Se connecter</span>
                    <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </div>
            </button>
          </form>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-white/5 flex flex-col items-center gap-4">
            <div className="flex items-center gap-2 text-xs font-mono text-slate-500/80">
              <Database className="h-3 w-3" />
              <span>SECURED BY BLOCKCHAIN AND WE PROTECT YOUR DATA</span>
            </div>
            <a href="#" className="text-sm text-slate-400 hover:text-cyan-400 transition-colors">
              Vous avez oublié vos identifiants ?
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;