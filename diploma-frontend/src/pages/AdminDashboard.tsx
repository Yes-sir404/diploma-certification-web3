import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { diplomaService } from '../services/diplomaService';
import { 
  Award, User, Loader2, CheckCircle, AlertTriangle, 
  Download, FileText, X, ShieldCheck, GraduationCap, Ban, RefreshCw, XCircle,
  Plus, ArrowLeft 
} from 'lucide-react';
import DashboardStats from '../components/DashboardStats'; // <--- Import
// --- COMPOSANT NOTIFICATION (Toast) ---
const Toast = ({ message, onClose }: { message: string, onClose: () => void }) => (
  <div className="fixed top-5 right-5 z-50 bg-slate-900 border border-green-500/50 text-green-400 px-6 py-4 rounded-xl shadow-2xl animate-fade-in-up flex items-center gap-3">
    <CheckCircle className="h-6 w-6" />
    <div>
      <h4 className="font-bold text-sm">Succès !</h4>
      <p className="text-xs text-slate-300">{message}</p>
    </div>
    <button onClick={onClose} className="ml-4 hover:text-white"><X className="h-4 w-4" /></button>
  </div>
);

const AdminDashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false); // <--- New State to toggle views

  // États UI
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showToast, setShowToast] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [diplomas, setDiplomas] = useState<any[]>([]);

  // --- NOUVEAUX ÉTATS POUR LE STATUT ---
  const [statusLoading, setStatusLoading] = useState(false);
  const [selectedDiploma, setSelectedDiploma] = useState<any>(null);
  const [showStatusModal, setShowStatusModal] = useState(false);

  // État du formulaire
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    cne: '',
    cni: '',
    email: '',
    birthDate: '',
    major: 'Génie Logiciel',
    graduationYear: new Date().getFullYear().toString(),
  });

  // Charger les diplômes au démarrage
  useEffect(() => {
    fetchDiplomas();
  }, []);

  const fetchDiplomas = async () => {
    try {
      const data = await diplomaService.getAllDiplomas();
      // On inverse pour voir les plus récents en premier
      setDiplomas(data.reverse());
    } catch (err) {

    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 1. Clic sur "Certifier" -> Ouvre la Modal
  const handlePreSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setShowConfirmModal(true);
  };

  // 2. Confirmation dans la Modal -> Envoi Backend
  const handleFinalSubmit = async () => {
    setLoading(true);
    setShowConfirmModal(false); // On ferme la modal
    
    try {
      await diplomaService.certifyDiploma(formData);
      
      // Succès
      setShowToast("Diplôme créé et ancré sur la Blockchain avec succès.");
      setFormData({ ...formData, cne: '', firstName: '', lastName: '', cni: '', email: '' }); // Reset partiel
      fetchDiplomas(); // Rafraîchir la liste
      
      setFormData({ ...formData, cne: '', firstName: '', lastName: '', cni: '', email: '' }); // Reset partiel
      fetchDiplomas(); // Rafraîchir la liste
      setShowCreateForm(false); // <--- Return to dashboard after success
      
      // Cacher le toast après 5 secondes
      setTimeout(() => setShowToast(null), 5000);
      
    } catch (err: any) {

      setError("Erreur lors de la certification. Vérifiez le backend.");
    } finally {
      setLoading(false);
    }
  };

  // --- LOGIQUE DU BOUTON STATUT ---
  const handleStatusClick = (diploma: any) => {
    setSelectedDiploma(diploma);
    setShowStatusModal(true);
  };

  const handleConfirmStatusChange = async () => {
    if (!selectedDiploma) return;
    setStatusLoading(true);

    try {
      const cne = selectedDiploma.student?.cne; // On récupère le CNE

      if (selectedDiploma.valid) {
        // Si c'est valide, on appelle REVOKE
        await diplomaService.revokeDiploma(cne);
      } else {
        // Si c'est invalide, on appelle REACTIVATE
        await diplomaService.reactivateDiploma(cne);
      }
      
      setShowStatusModal(false);
      fetchDiplomas(); // Rafraîchir le tableau pour voir le changement
      setShowToast("Statut mis à jour sur la Blockchain avec succès !");
      setTimeout(() => setShowToast(null), 5000);

    } catch (err) {

      setError("Erreur lors de la transaction Blockchain.");
    } finally {
      setStatusLoading(false);
      setSelectedDiploma(null);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-10 px-4">
      {/* Toast Notification */}
      {showToast && <Toast message={showToast} onClose={() => setShowToast(null)} />}
      
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* En-tête (Commun) */}
        <div className="flex flex-col md:flex-row justify-between items-end gap-4 animate-fade-in-up">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">🎓 Panneau de Certification</h1>
            <p className="text-slate-400">
              Connecté en tant que : <span className="text-cyan-400 font-mono">{user?.walletAddress || "Admin"}</span>
            </p>
          </div>
          <div className="flex items-center gap-4">
             <span className="px-3 py-1 rounded-full bg-green-500/10 text-green-400 text-xs border border-green-500/20">
               ● Système Connecté
             </span>
             
             {/* Bouton Retour (Visible seulement si on est sur le formulaire) */}
             {showCreateForm && (
               <button 
                 onClick={() => setShowCreateForm(false)}
                 className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl transition-all border border-slate-700"
               >
                 <ArrowLeft className="h-4 w-4" /> Retour au Dashboard
               </button>
             )}
          </div>
        </div>

        {/* --- VUE 1 : DASHBOARD & LISTE (Par défaut) --- */}
        {!showCreateForm && (
          <div className="animate-fade-in-up space-y-8">
            
            {/* Stats */}
            <DashboardStats diplomas={diplomas} />
            
            {/* Zone d'action "Créer" */}
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <FileText className="text-cyan-400" /> Diplômes Émis ({diplomas.length})
              </h2>
              
              <button 
                onClick={() => setShowCreateForm(true)}
                className="group relative px-6 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold rounded-xl shadow-lg shadow-cyan-900/20 hover:shadow-cyan-500/30 transition-all flex items-center gap-2 overflow-hidden"
              >
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                <Plus className="h-5 w-5 relative z-10" /> 
                <span className="relative z-10">Nouveau Diplôme</span>
              </button>
            </div>

            {/* Tableau des diplômes */}
            <div className="glass-panel overflow-hidden rounded-2xl border border-white/5">
            <table className="w-full text-left text-sm text-slate-400">
              <thead className="bg-slate-900/50 text-xs uppercase text-slate-200">
                <tr>
                  <th className="px-6 py-4">Étudiant</th>
                  <th className="px-6 py-4">CNE</th>
                  <th className="px-6 py-4 text-center">Statut</th>
                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {diplomas.map((d) => (
                  <tr key={d.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 font-medium text-white">
                      {d.student?.firstName} {d.student?.lastName}
                    </td>
                    <td className="px-6 py-4 font-mono">{d.student?.cne}</td>
                    
                    {/* 1. Colonne Statut Visuel */}
                    <td className="px-6 py-4 text-center">
                      {d.valid ? (
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-green-500/10 text-green-400 text-xs border border-green-500/20">
                          <CheckCircle className="h-3 w-3" /> Valide
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-red-500/10 text-red-400 text-xs border border-red-500/20">
                          <XCircle className="h-3 w-3" /> Révoqué
                        </span>
                      )}
                    </td>

                    {/* 2. Colonne Bouton Action Dynamique */}
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end items-center gap-2">
                        
                        {/* Bouton Télécharger (Toujours visible) */}
                        <a 
                          href={diplomaService.getDownloadUrl(d.id)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-all border border-slate-700"
                          title="Télécharger le PDF"
                        >
                          <Download className="h-4 w-4" />
                        </a>

                        {/* --- BOUTON DYNAMIQUE (SWITCH) --- */}
                        {d.valid ? (
                          // CAS 1 : Le diplôme est VALIDE -> On affiche le bouton ROUGE "Révoquer"
                          <button 
                            onClick={() => handleStatusClick(d)}
                            className="flex items-center gap-2 px-3 py-2 bg-slate-800 hover:bg-red-900/30 text-red-400 border border-slate-700 hover:border-red-500 rounded-lg transition-all text-xs font-bold group"
                          >
                            <Ban className="h-4 w-4 group-hover:scale-110 transition-transform" />
                            <span>Révoquer</span>
                          </button>
                        ) : (
                          // CAS 2 : Le diplôme est INVALIDE -> On affiche le bouton VERT "Réactiver"
                          <button 
                            onClick={() => handleStatusClick(d)}
                            className="flex items-center gap-2 px-3 py-2 bg-slate-800 hover:bg-green-900/30 text-green-400 border border-slate-700 hover:border-green-500 rounded-lg transition-all text-xs font-bold group"
                          >
                            <RefreshCw className="h-4 w-4 group-hover:rotate-180 transition-transform duration-500" />
                            <span>Réactiver</span>
                          </button>
                        )}

                      </div>
                    </td>
                  </tr>
                ))}
                {diplomas.length === 0 && (
                   <tr>
                     <td colSpan={5} className="px-6 py-8 text-center text-slate-500">Aucun diplôme émis pour le moment.</td>
                   </tr>
                )}
              </tbody>
            </table>
          </div>
          </div>
        )}

        {/* --- VUE 2 : CRÉATION (Form + Preview) --- */}
        {showCreateForm && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-fade-in-up">
            
            {/* COLONNE GAUCHE : FORMULAIRE */}
            <div className="glass-panel p-8 rounded-2xl">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <User className="text-cyan-400" /> Nouvel Étudiant
            </h2>

            {error && (
              <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-3 text-red-400 text-sm">
                <AlertTriangle className="h-5 w-5 flex-shrink-0" />
                <p>{error}</p>
              </div>
            )}

            <form onSubmit={handlePreSubmit} className="space-y-4">
              {/* Ligne 1 : Noms */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs text-slate-400 ml-1">Prénom</label>
                  <input name="firstName" value={formData.firstName} onChange={handleChange} required
                    className="w-full px-4 py-3 bg-slate-950/50 border border-slate-700 rounded-xl text-white outline-none focus:border-cyan-500 transition-all" placeholder="Ex: Yassir" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-slate-400 ml-1">Nom</label>
                  <input name="lastName" value={formData.lastName} onChange={handleChange} required
                    className="w-full px-4 py-3 bg-slate-950/50 border border-slate-700 rounded-xl text-white outline-none focus:border-cyan-500 transition-all" placeholder="Ex: El Amrani" />
                </div>
              </div>

              {/* Ligne 2 : Identifiants */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs text-slate-400 ml-1">CNE</label>
                  <input name="cne" value={formData.cne} onChange={handleChange} required
                    className="w-full px-4 py-3 bg-slate-950/50 border border-slate-700 rounded-xl text-white outline-none focus:border-cyan-500 transition-all" placeholder="D13000..." />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-slate-400 ml-1">CNI</label>
                  <input name="cni" value={formData.cni} onChange={handleChange} required
                    className="w-full px-4 py-3 bg-slate-950/50 border border-slate-700 rounded-xl text-white outline-none focus:border-cyan-500 transition-all" placeholder="AB123456" />
                </div>
              </div>

              {/* Ligne 3 : Infos Privées */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                   <label className="text-xs text-slate-400 ml-1">Email</label>
                   <input type="email" name="email" value={formData.email} onChange={handleChange} required
                     className="w-full px-4 py-3 bg-slate-950/50 border border-slate-700 rounded-xl text-white outline-none focus:border-cyan-500 transition-all" placeholder="etudiant@ecole.ma" />
                </div>
                <div className="space-y-1">
                   <label className="text-xs text-slate-400 ml-1">Date de Naissance</label>
                   <input type="date" name="birthDate" value={formData.birthDate} onChange={handleChange} required
                     className="w-full px-4 py-3 bg-slate-950/50 border border-slate-700 rounded-xl text-white outline-none focus:border-cyan-500 transition-all" />
                </div>
              </div>

              {/* Ligne 4 : Diplôme */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs text-slate-400 ml-1">Filière</label>
                  <select name="major" value={formData.major} onChange={handleChange}
                    className="w-full px-4 py-3 bg-slate-950/50 border border-slate-700 rounded-xl text-white outline-none focus:border-cyan-500 transition-all">
                    <option>Génie Logiciel</option>
                    <option>Intelligence Artificielle</option>
                    <option>Sécurité Informatique</option>
                    <option>Data Science</option>
                    <option>Systèmes Embarqués</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-slate-400 ml-1">Année</label>
                  <input type="number" name="graduationYear" value={formData.graduationYear} onChange={handleChange} required
                    className="w-full px-4 py-3 bg-slate-950/50 border border-slate-700 rounded-xl text-white outline-none focus:border-cyan-500 transition-all" />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 mt-4 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold rounded-xl shadow-lg shadow-cyan-900/20 hover:shadow-cyan-500/30 transform hover:-translate-y-0.5 transition-all flex justify-center items-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin h-5 w-5" /> Signature & Minage en cours...
                  </>
                ) : (
                  <>
                    <Award className="h-5 w-5" /> Vérifier & Certifier
                  </>
                )}
              </button>
            </form>
          </div>

          {/* COLONNE DROITE : PREVISUALISATION (Preserved from original) */}
          <div className="relative animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 to-purple-500/20 blur-3xl -z-10 rounded-full"></div>
            
            <div className="glass-panel p-1 border-2 border-white/20 rounded-2xl h-full">
              <div className="bg-slate-950/80 rounded-xl p-8 h-full flex flex-col items-center justify-center text-center border border-white/5 relative overflow-hidden">
                
                {/* Filigrane de fond */}
                <GraduationCap className="absolute w-64 h-64 text-white/5 -rotate-12" />

                <div className="relative z-10 space-y-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full mx-auto flex items-center justify-center shadow-lg shadow-yellow-500/20">
                    <Award className="h-10 w-10 text-white" />
                  </div>
                  
                  <div>
                    <h3 className="text-2xl font-serif text-white tracking-wide">DIPLÔME D'INGÉNIEUR</h3>
                    <p className="text-cyan-500 font-medium mt-1">École Nationale Supérieure (ENSIASD)</p>
                  </div>

                  <div className="py-6 border-y border-white/10 w-full">
                    <p className="text-slate-400 text-sm mb-1">Délivré à</p>
                    <p className="text-2xl font-bold text-white">
                      {formData.firstName || "Prénom"} {formData.lastName || "Nom"}
                    </p>
                    <p className="text-slate-500 text-sm mt-2 font-mono">{formData.cne || "CNE-XXXXXX"}</p>
                  </div>

                  <div>
                    <p className="text-slate-400 text-sm">Filière</p>
                    <p className="text-lg text-cyan-100">{formData.major}</p>
                    <p className="text-slate-500 text-xs mt-1">Promotion {formData.graduationYear}</p>
                  </div>

                  <div className="pt-4">
                     <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-slate-900 border border-white/10">
                        <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></div>
                        <span className="text-[10px] text-slate-400 font-mono">Awaiting Signature</span>
                     </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          </div>
        )}
      </div>

      {/* --- MODAL DE CONFIRMATION (CERTIFICATION) --- */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-slate-900 border border-white/10 rounded-2xl max-w-md w-full p-6 shadow-2xl relative">
            
            <button onClick={() => setShowConfirmModal(false)} className="absolute top-4 right-4 text-slate-400 hover:text-white">
              <X className="h-5 w-5" />
            </button>

            <div className="flex flex-col items-center text-center mb-6">
              <div className="w-16 h-16 bg-cyan-500/10 rounded-full flex items-center justify-center mb-4 border border-cyan-500/30">
                <ShieldCheck className="h-8 w-8 text-cyan-400" />
              </div>
              <h3 className="text-2xl font-bold text-white">Confirmation</h3>
              <p className="text-slate-400 text-sm mt-1">Veuillez vérifier les informations avant l'ancrage définitif sur la Blockchain.</p>
            </div>

            <div className="bg-slate-950/50 p-4 rounded-xl space-y-3 text-sm mb-6 border border-white/5">
              <div className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-slate-500">Étudiant :</span>
                <span className="text-white font-medium">{formData.firstName} {formData.lastName}</span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-slate-500">CNE / CNI :</span>
                <span className="text-white font-mono">{formData.cne} / {formData.cni}</span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-slate-500">Email :</span>
                <span className="text-white">{formData.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Diplôme :</span>
                <span className="text-cyan-400">{formData.major} ({formData.graduationYear})</span>
              </div>
            </div>

            <div className="flex gap-3">
              <button 
                onClick={() => setShowConfirmModal(false)}
                className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-medium transition-colors"
              >
                Annuler
              </button>
              <button 
                onClick={handleFinalSubmit}
                disabled={loading}
                className="flex-1 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-xl font-bold shadow-lg flex justify-center items-center gap-2 transition-all"
              >
                {loading ? <Loader2 className="animate-spin h-5 w-5" /> : "Confirmer & Certifier"}
              </button>
            </div>

          </div>
        </div>
      )}

      {/* --- MODALE DE CONFIRMATION (STATUS) --- */}
      {showStatusModal && selectedDiploma && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className={`bg-slate-900 border rounded-2xl max-w-md w-full p-6 shadow-2xl relative ${selectedDiploma.valid ? 'border-red-500/30' : 'border-green-500/30'}`}>
            
            <button onClick={() => setShowStatusModal(false)} className="absolute top-4 right-4 text-slate-400 hover:text-white">
              <X className="h-5 w-5" />
            </button>

            <div className="text-center mb-6">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 border ${selectedDiploma.valid ? 'bg-red-500/10 border-red-500/30 text-red-500' : 'bg-green-500/10 border-green-500/30 text-green-500'}`}>
                {selectedDiploma.valid ? <Ban className="h-8 w-8" /> : <RefreshCw className="h-8 w-8" />}
              </div>
              <h3 className="text-2xl font-bold text-white">
                {selectedDiploma.valid ? "Révoquer le Diplôme ?" : "Réactiver le Diplôme ?"}
              </h3>
              <p className="text-slate-400 text-sm mt-2">
                Action irréversible sur la Blockchain (coûte du Gaz).
              </p>
            </div>

            <div className="flex gap-3">
              <button 
                onClick={() => setShowStatusModal(false)}
                className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-medium transition-colors"
              >
                Annuler
              </button>
              <button 
                onClick={handleConfirmStatusChange}
                disabled={statusLoading}
                className={`flex-1 py-3 text-white rounded-xl font-bold flex justify-center items-center gap-2 transition-all
                  ${selectedDiploma.valid ? 'bg-red-600 hover:bg-red-500' : 'bg-green-600 hover:bg-green-500'}`}
              >
                {statusLoading ? <Loader2 className="animate-spin h-5 w-5" /> : "Confirmer"}
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default AdminDashboard;