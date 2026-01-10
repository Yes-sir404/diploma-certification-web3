import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { diplomaService } from '../services/diplomaService';
import { 
  ShieldCheck, Upload, FileText, Loader2, CheckCircle, XCircle, Search, ExternalLink 
} from 'lucide-react';

const Verify = () => {
  const { id } = useParams(); // Récupère l'ID depuis l'URL (ex: QR Code)
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');
  const [dragActive, setDragActive] = useState(false);

  // 1. DÉTECTION AUTOMATIQUE (QR CODE)
  useEffect(() => {
    if (id) {
      handleVerifyById(id);
    }
  }, [id]);

  const handleVerifyById = async (diplomaId: string) => {
    setLoading(true);
    setError('');
    try {
      const data = await diplomaService.verifyById(diplomaId);
      setResult(data);
    } catch (err) {
      setError("Impossible de récupérer les informations de ce diplôme via l'ID.");
    } finally {
      setLoading(false);
    }
  };

  // 2. GESTION DE L'UPLOAD (DRAG & DROP)
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      await processFile(e.target.files[0]);
    }
  };

  const processFile = async (file: File) => {
    setLoading(true);
    setError('');
    setResult(null);
    
    try {
      const data = await diplomaService.verifyPdf(file);
      setResult(data);
    } catch (err) {
      setError("Erreur lors de l'analyse du fichier. Vérifiez le backend.");
    } finally {
      setLoading(false);
    }
  };

  // UI Drag & Drop
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
    else if (e.type === "dragleave") setDragActive(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      await processFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-10 px-4 flex flex-col items-center">
      
      {/* Header */}
      <div className="text-center mb-10 animate-fade-in-up">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-cyan-500/10 border border-cyan-500/30 mb-6 shadow-[0_0_30px_rgba(6,182,212,0.15)]">
          <ShieldCheck className="h-10 w-10 text-cyan-400" />
        </div>
        <h1 className="text-4xl font-bold text-white mb-3">Vérificateur Public</h1>
        <p className="text-slate-400 max-w-lg mx-auto">
          Vérifiez l'authenticité d'un diplôme instantanément grâce à la Blockchain Ethereum.
        </p>
      </div>

      <div className="w-full max-w-2xl animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
        
        {/* SECTION RESULTAT */}
        {result ? (
          <div className={`glass-panel p-8 rounded-2xl border ${result.valid ? 'border-green-500/30' : 'border-red-500/30'} relative overflow-hidden`}>
            {/* Background Glow */}
            <div className={`absolute top-0 left-0 w-full h-2 ${result.valid ? 'bg-green-500' : 'bg-red-500'}`}></div>

            <div className="text-center mb-8">
               {result.valid ? (
                 <>
                    <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-white">Document Authentique</h2>
                    <p className="text-green-400 mt-1">Certifié sur la Blockchain</p>
                 </>
               ) : (
                 <>
                    <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-white">Document Non Valide</h2>
                    <p className="text-red-400 mt-1">{result.message}</p>
                 </>
               )}
            </div>

            {result.valid && (
              <div className="space-y-4 bg-slate-900/50 p-6 rounded-xl border border-white/5">
                <div className="flex justify-between border-b border-white/5 pb-3">
                  <span className="text-slate-500">Étudiant</span>
                  <span className="text-white font-medium">{result.studentName}</span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-3">
                  <span className="text-slate-500">Diplôme</span>
                  <span className="text-cyan-400 font-medium">{result.speciality}</span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-3">
                  <span className="text-slate-500">Promotion</span>
                  <span className="text-white">{result.graduationYear}</span>
                </div>
                
                {/* Preuve Blockchain */}
                <div className="pt-2">
                  <span className="text-slate-500 text-xs uppercase tracking-wider">Preuve Blockchain (Tx Hash)</span>
                  <a 
                    href={`https://sepolia.etherscan.io/tx/${result.transactionHash}`} // Lien vers Etherscan (adapter selon réseau)
                    target="_blank" 
                    rel="noreferrer"
                    className="flex items-center gap-2 text-xs text-cyan-500 hover:text-cyan-300 mt-1 break-all transition-colors"
                  >
                    {result.transactionHash} <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </div>
            )}
            
            <button 
              onClick={() => { setResult(null); setError(''); }}
              className="mt-6 w-full py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl transition-colors font-medium"
            >
              Vérifier un autre document
            </button>
          </div>
        ) : (
          /* SECTION UPLOAD */
          <div 
            className={`glass-panel p-10 rounded-2xl border-2 border-dashed transition-all cursor-pointer text-center
              ${dragActive ? 'border-cyan-500 bg-cyan-500/10' : 'border-slate-700 hover:border-slate-500'}`}
            onDragEnter={handleDrag} 
            onDragLeave={handleDrag} 
            onDragOver={handleDrag} 
            onDrop={handleDrop}
          >
            <input 
              type="file" 
              id="file-upload" 
              className="hidden" 
              accept=".pdf"
              onChange={handleFileChange} 
            />
            
            <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center">
              {loading ? (
                <>
                  <Loader2 className="h-16 w-16 text-cyan-500 animate-spin mb-4" />
                  <p className="text-white text-lg font-medium">Analyse cryptographique en cours...</p>
                  <p className="text-slate-500 text-sm mt-2">Comparaison du Hash avec la Blockchain</p>
                </>
              ) : (
                <>
                  <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <Upload className="h-10 w-10 text-slate-300" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Glissez votre diplôme PDF ici</h3>
                  <p className="text-slate-400 text-sm mb-6">ou cliquez pour parcourir vos fichiers</p>
                  <span className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-sm font-medium transition-colors">
                    Sélectionner un fichier
                  </span>
                </>
              )}
            </label>
          </div>
        )}

        {error && (
          <div className="mt-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-400">
            <XCircle className="h-5 w-5" />
            <p>{error}</p>
          </div>
        )}

      </div>
    </div>
  );
};

export default Verify;