import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/authService';
import { Wallet, Loader2, ArrowRight, ShieldAlert, Database } from 'lucide-react';
const AdminLogin = () => {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Pour la redirection si déjà connecté
  const { login, role, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Redirection automatique si déjà admin
  useEffect(() => {
    if (isAuthenticated && role === 'ADMIN') {
      navigate('/admin-dashboard');
    } else if (isAuthenticated && role === 'STUDENT') {
        navigate('/student-dashboard');
    }
  }, [isAuthenticated, role, navigate]);

  // --- LOGIQUE METAMASK ---
  const handleConnectWallet = async () => {
    setError('');
    setLoading(true);

    // 1. Vérifier si MetaMask est installé
    if (typeof window.ethereum === 'undefined') {
        setError("MetaMask n'est pas détecté. Veuillez l'installer pour continuer.");
        setLoading(false);
        return;
    }

    try {
        // 2. Demander la connexion au wallet
        // Nous utilisons "any" ici car le type window.ethereum n'est pas standardisé par défaut
        const accounts = await (window.ethereum as any).request({ method: 'eth_requestAccounts' });
        const address = accounts[0];

        console.log("Adresse wallet détectée :", address);

        // 3. Envoyer l'adresse au Backend pour vérification
        const data = await authService.loginAdmin(address);

        // 4. Si succès, mise à jour du contexte et redirection
        login(data.token, 'ADMIN');
        navigate('/admin-dashboard');

    } catch (err: any) {
        console.error(err);
        // Gestion des erreurs spécifiques
        if (err.code === 4001) {
            // L'utilisateur a cliqué sur "Annuler" dans MetaMask
            setError("Vous avez refusé la demande de connexion.");
        } else {
            // Erreur venant du backend (ex: adresse non whitelistée)
            setError(err.response?.data?.error || "Authentification échouée. Cette adresse n'est pas administrateur.");
        }
    } finally {
        setLoading(false);
    }
  };
  // ------------------------

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 overflow-hidden bg-slate-900">
      
      {/* --- MEME FOND QUE LE LOGIN ETUDIANT --- */}
      <div className="absolute inset-0 bg-grid-pattern opacity-20 pointer-events-none"></div>
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-float pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-600/20 rounded-full blur-3xl animate-float pointer-events-none" style={{ animationDelay: '-3s' }}></div>

      <div className="w-full max-w-md relative z-10 perspective-1000">
        
        {/* --- CARTE GLASSMORPHISM --- */}
        <div className="glass-panel p-8 sm:p-10 rounded-2xl shadow-2xl shadow-black/50 border border-white/10 animate-fade-in-up">
          
          {/* Header Admin */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500/20 to-cyan-600/20 border border-white/10 mb-6 shadow-inner animate-pulse-glow">
              {/* Icône Wallet pour changer */}
              <Wallet className="w-8 h-8 text-purple-300" />
            </div>
            <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-purple-200 to-cyan-200 mb-2">
              Accès Administrateur
            </h2>
            <p className="text-slate-400 text-sm font-medium">
              Connexion sécurisée via Web3 Wallet (MetaMask)
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-3 text-red-400 text-sm animate-fade-in-up">
              <ShieldAlert className="h-5 w-5 flex-shrink-0 mt-0.5" />
              <p>{error}</p>
            </div>
          )}

          {/* Zone centrale informative à la place des inputs */}
          <div className="mb-8 p-4 bg-slate-900/50 rounded-xl border border-white/5 text-center">
              <p className="text-slate-300 text-sm leading-relaxed">
                  Pour émettre des diplômes sur la blockchain, vous devez vous authentifier avec l'adresse Ethereum autorisée.
              </p>
          </div>


          {/* BOUTON DE CONNEXION WALLET */}
          <button
            onClick={handleConnectWallet}
            disabled={loading}
            className="group relative w-full py-4 px-6 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-xl font-bold text-white shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></div>
            <div className="flex items-center justify-center gap-2">
              {loading ? (
                <>
                  <Loader2 className="animate-spin h-5 w-5" />
                  <span>Connexion à MetaMask...</span>
                </>
              ) : (
                <>
                  <Wallet className="h-5 w-5" />
                  <span>Connecter le Wallet</span>
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform ml-1" />
                </>
              )}
            </div>
          </button>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-white/5 flex flex-col items-center gap-4">
            <div className="flex items-center gap-2 text-xs font-mono text-slate-500/80">
              <Database className="h-3 w-3" />
              <span>RESTRICTED AREA - BLOCKCHAIN AUTHORIZATION REQUIRED</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
