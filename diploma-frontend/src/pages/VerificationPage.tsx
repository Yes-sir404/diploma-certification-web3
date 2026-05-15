import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { diplomaService } from '../services/diplomaService';
import { CheckCircle, XCircle, Loader2, ShieldCheck } from 'lucide-react';

const VerificationPage = () => {
  const { cne } = useParams(); // Récupère le CNE depuis l'URL (ex: /verify/F13...)
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState<any>(null);

  useEffect(() => {
    if (cne) {
      verifyDiploma();
    }
  }, [cne]);

  const verifyDiploma = async () => {
    try {
      setLoading(true);
      // Appel au backend via CNE
      const data = await diplomaService.verifyByCne(cne!);
      setResult(data);
    } catch (error) {

      setResult({ valid: false, message: "Erreur de connexion au serveur." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      
      {/* Fond décoratif */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 bg-blue-600/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 w-full max-w-lg">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-slate-900 border border-white/10 mb-4 shadow-xl">
            <ShieldCheck className="h-8 w-8 text-cyan-400" />
          </div>
          <h1 className="text-2xl font-bold text-white">Vérification Blockchain</h1>
          <p className="text-slate-400 text-sm mt-2">Système de certification décentralisé</p>
        </div>

        {/* LOADING STATE */}
        {loading && (
          <div className="bg-slate-900/50 backdrop-blur-md border border-white/10 rounded-2xl p-8 text-center shadow-2xl">
            <Loader2 className="h-10 w-10 text-cyan-500 animate-spin mx-auto mb-4" />
            <p className="text-white font-medium">Analyse de la Blockchain en cours...</p>
            <p className="text-slate-500 text-xs mt-2">Vérification de l'intégrité du hash et de la signature.</p>
          </div>
        )}

        {/* RESULTAT */}
        {!loading && result && (
          <div className={`backdrop-blur-md border rounded-2xl p-1 shadow-2xl animate-fade-in-up ${result.valid ? 'bg-gradient-to-br from-green-500/20 to-emerald-900/20 border-green-500/30' : 'bg-gradient-to-br from-red-500/20 to-orange-900/20 border-red-500/30'}`}>
            <div className="bg-slate-900/90 rounded-xl p-8 text-center h-full">
              
              {/* Icône de statut */}
              <div className={`mx-auto w-20 h-20 rounded-full flex items-center justify-center mb-6 ${result.valid ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                {result.valid ? <CheckCircle className="h-10 w-10" /> : <XCircle className="h-10 w-10" />}
              </div>

              {/* Titre Statut */}
              <h2 className={`text-2xl font-bold mb-2 ${result.valid ? 'text-green-400' : 'text-red-400'}`}>
                {result.valid ? "DIPLÔME AUTHENTIQUE" : "DOCUMENT INVALIDE"}
              </h2>
              
              <p className="text-slate-400 text-sm mb-6">{result.message}</p>

              {/* Détails du diplôme (Si valide) */}
              {result.valid && (
                <div className="text-left bg-slate-950/50 rounded-xl p-4 space-y-3 border border-white/5 mb-6">
                  <div>
                    <p className="text-slate-500 text-xs uppercase tracking-wider">Étudiant</p>
                    <p className="text-white font-medium text-lg">{result.studentName}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-slate-500 text-xs uppercase tracking-wider">Filière</p>
                      <p className="text-cyan-400 font-medium">{result.speciality}</p>
                    </div>
                    <div>
                      <p className="text-slate-500 text-xs uppercase tracking-wider">Année</p>
                      <p className="text-white font-mono">{result.graduationYear}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-slate-500 text-xs uppercase tracking-wider">Transaction ID</p>
                    <p className="text-xs text-slate-500 font-mono break-all mt-1 bg-black/20 p-2 rounded">
                      {result.transactionHash}
                    </p>
                  </div>
                </div>
              )}

              {/* Bouton retour */}
              <Link to="/" className="inline-block w-full py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-medium transition-colors">
                Scanner un autre document
              </Link>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default VerificationPage;