import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { diplomaService } from '../services/diplomaService';
import { 
  User, Award, Download, Calendar, Mail, 
  CheckCircle, XCircle, FileText, Fingerprint, Linkedin, ExternalLink 
} from 'lucide-react';

const StudentDashboard = () => {
  const { user } = useAuth();
  const [diplomas, setDiplomas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && user.id) {
      fetchMyDiplomas();
    }
  }, [user]);

  const fetchMyDiplomas = async () => {
    try {
      const data = await diplomaService.getMyDiplomas(user.id);
      setDiplomas(data);
    } catch (err) {
      console.error("Erreur chargement diplômes", err);
    } finally {
      setLoading(false);
    }
  };

  // --- FONCTION MAGIQUE LINKEDIN ---
  const addToLinkedIn = (diploma: any) => {
    // 1. Construire l'URL de vérification (ton IP locale pour la démo)
    // Remplace par ton IP si besoin, ou window.location.origin
    const verifyUrl = `${window.location.protocol}//${window.location.hostname}:5173/verify/${user.cne}`;

    // 2. Préparer les paramètres
    const params = new URLSearchParams({
      startTask: 'CERTIFICATION_NAME',
      name: `Diplôme d'Ingénieur en ${diploma.speciality}`, // Titre du diplôme
      organizationName: 'ENSIASD', // Nom de l'école
      issueYear: diploma.graduationYear.toString(),
      issueMonth: '6', // Juin par défaut
      certId: diploma.transactionHash ? diploma.transactionHash.substring(0, 10) + '...' : diploma.id, // ID court
      certUrl: verifyUrl // Le lien QR Code
    });

    // 3. Ouvrir LinkedIn dans un nouvel onglet
    window.open(`https://www.linkedin.com/profile/add?${params.toString()}`, '_blank');
  };

  return (
    <div className="min-h-screen pt-24 pb-10 px-4">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* EN-TÊTE */}
        <div className="flex flex-col md:flex-row justify-between items-end gap-4 animate-fade-in-up">
          <div>
            <h1 className="text-3xl font-bold text-white">
              Bonjour, <span className="text-cyan-400">{user?.firstName}</span> 👋
            </h1>
            <p className="text-slate-400 mt-2">Gérez et partagez vos certifications blockchain.</p>
          </div>
          <div className="px-4 py-2 bg-slate-800/50 rounded-full border border-white/10 text-xs text-slate-300 font-mono">
            ID Étudiant: {user?.cne}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* CARTE D'IDENTITÉ (Gauche) */}
          <div className="lg:col-span-1 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            <div className="glass-panel p-6 rounded-2xl border border-white/10 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl -mr-16 -mt-16 transition-all group-hover:bg-cyan-500/20"></div>
              
              <div className="flex flex-col items-center text-center mb-6">
                <div className="w-24 h-24 bg-gradient-to-br from-slate-800 to-slate-900 rounded-full flex items-center justify-center mb-4 border-2 border-cyan-500/30 shadow-lg shadow-cyan-900/20">
                  <User className="h-10 w-10 text-cyan-400" />
                </div>
                <h2 className="text-xl font-bold text-white">{user?.firstName} {user?.lastName}</h2>
                <p className="text-cyan-500 text-sm font-medium">Étudiant Ingénieur</p>
              </div>

              <div className="space-y-4 text-sm">
                <div className="flex items-center gap-3 text-slate-300 p-3 bg-slate-900/50 rounded-xl border border-white/5">
                  <Fingerprint className="h-4 w-4 text-slate-500" />
                  <div>
                    <p className="text-xs text-slate-500 uppercase">CNE</p>
                    <p className="font-mono">{user?.cne}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-slate-300 p-3 bg-slate-900/50 rounded-xl border border-white/5">
                  <Mail className="h-4 w-4 text-slate-500" />
                  <div>
                    <p className="text-xs text-slate-500 uppercase">Email</p>
                    <p>{user?.email}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* LISTE DES DIPLÔMES (Droite) */}
          <div className="lg:col-span-2 space-y-6 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <Award className="text-cyan-400" /> Mes Diplômes Certifiés
            </h3>

            {loading ? (
               <div className="text-center py-10 text-slate-500">Chargement...</div>
            ) : diplomas.length === 0 ? (
               <div className="glass-panel p-8 rounded-2xl text-center border-dashed border-2 border-slate-700">
                 <p className="text-slate-400">Aucun diplôme disponible pour le moment.</p>
               </div>
            ) : (
              <div className="grid gap-4">
                {diplomas.map((d) => (
                  <div key={d.id} className="glass-panel p-6 rounded-2xl border border-white/5 hover:border-cyan-500/30 transition-all flex flex-col gap-6 group">
                    
                    {/* Info Diplôme */}
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-blue-600/20 rounded-xl flex items-center justify-center flex-shrink-0 border border-blue-500/30">
                        <FileText className="h-6 w-6 text-blue-400" />
                      </div>
                      <div>
                        <h4 className="text-lg font-bold text-white group-hover:text-cyan-400 transition-colors">
                          Diplôme d'Ingénieur d'État
                        </h4>
                        <p className="text-slate-400 text-sm">Spécialité : <span className="text-white">{d.speciality}</span></p>
                        <div className="flex items-center gap-4 mt-2 text-xs text-slate-500">
                          <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> Promotion {d.graduationYear}</span>
                        </div>
                      </div>
                    </div>

                    {/* BARRE D'ACTION (Boutons) */}
                    <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-white/5">
                      
                      {/* Statut */}
                      {d.valid ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-500/10 text-green-400 text-xs border border-green-500/20 font-medium">
                          <CheckCircle className="h-3 w-3" /> Certifié
                        </span>
                      ) : (
                         <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/10 text-red-400 text-xs border border-red-500/20 font-medium">
                          <XCircle className="h-3 w-3" /> Révoqué
                        </span>
                      )}

                      <div className="flex gap-2">
                         {/* --- BOUTON LINKEDIN --- */}
                         {d.valid && (
                            <button 
                              onClick={() => addToLinkedIn(d)}
                              className="flex items-center gap-2 px-4 py-2 bg-[#0077b5] hover:bg-[#006097] text-white rounded-lg transition-all text-sm font-bold shadow-lg shadow-blue-900/20"
                            >
                              <Linkedin className="h-4 w-4" /> Ajouter au profil
                            </button>
                         )}

                        {/* Bouton Télécharger */}
                        <a 
                          href={diplomaService.getDownloadUrl(d.id)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-all border border-slate-700 hover:border-slate-500 text-sm font-bold"
                        >
                          <Download className="h-4 w-4" /> PDF
                        </a>
                      </div>
                    </div>

                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;