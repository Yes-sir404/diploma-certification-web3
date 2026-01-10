
import { useNavigate } from 'react-router-dom';
import { 
  ShieldCheck, 
  Globe, 
  Zap, 
  ChevronRight, 
  Award, 
  Database,
  Lock,
  CheckCircle2
} from 'lucide-react';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-900 relative overflow-hidden font-sans text-slate-100 selection:bg-cyan-500/30">
      
      {/* Background Elements */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-grid-pattern opacity-20"></div>
        <div className="absolute top-0 right-0 w-[800px] h-[600px] bg-blue-600/10 rounded-full blur-[100px] animate-pulse-glow"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[100px] animate-float" style={{ animationDelay: '-2s' }}></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-16">
        
        {/* Hero Section */}
        <div className="text-center max-w-4xl mx-auto mb-24 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-800/50 border border-cyan-500/30 text-cyan-400 text-sm font-medium mb-8 backdrop-blur-md">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
            </span>
            La certification du futur est ici
          </div>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8 leading-tight">
            Vos diplômes, <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 animate-pulse-glow">
              Certifiés & Sécurisés
            </span>
            <br /> par la Blockchain
          </h1>

          <p className="text-xl text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed">
            Une plateforme décentralisée garantissant l'authenticité, la traçabilité et l'immutabilité de vos certifications académiques.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button 
              onClick={() => navigate('/login')}
              className="group relative px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl font-bold text-white shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></div>
              <div className="flex items-center gap-2">
                <span>Espace Étudiant</span>
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>
            
            <button 
              onClick={() => navigate('/verify')}
              className="group px-8 py-4 bg-slate-800/50 border border-white/10 rounded-xl font-bold text-slate-300 hover:bg-slate-800 hover:text-white hover:border-white/20 transition-all duration-200 backdrop-blur-md"
            >
              Vérifier un diplôme
            </button>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-32 border-y border-white/5 py-12 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          {[
            { label: 'Diplômes Sécurisés', value: '10K+' },
            { label: 'Institutions', value: '50+' },
            { label: 'Blockchain Transactions', value: '100%' },
            { label: 'Disponibilité', value: '24/7' },
          ].map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
              <div className="text-sm text-slate-500 font-medium uppercase tracking-wider">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-24">
          {[
            {
              icon: <Lock className="w-8 h-8 text-cyan-400" />,
              title: "Immuabilité Totale",
              desc: "Une fois enregistré sur la blockchain, un diplôme ne peut être ni modifié ni supprimé, garantissant une intégrité absolue."
            },
            {
              icon: <Globe className="w-8 h-8 text-blue-400" />,
              title: "Reconnaissance Mondiale",
              desc: "Les diplômes sont vérifiables instantanément de n'importe où dans le monde, sans intermédiaires."
            },
            {
              icon: <Zap className="w-8 h-8 text-purple-400" />,
              title: "Vérification Instantanée",
              desc: "Fini les délais administratifs. Vérifiez l'authenticité d'un document en quelques millisecondes."
            }
          ].map((feature, index) => (
            <div 
              key={index}
              className="glass-panel p-8 rounded-2xl glass-card-hover group animate-fade-in-up"
              style={{ animationDelay: `${0.3 + index * 0.1}s` }}
            >
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 border border-white/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg group-hover:shadow-cyan-500/20">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-white mb-3 group-hover:text-cyan-400 transition-colors">
                {feature.title}
              </h3>
              <p className="text-slate-400 leading-relaxed">
                {feature.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Blockchain Visual / Trust Section */}
        <div className="glass-panel p-1 rounded-3xl animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
          <div className="bg-slate-900/90 rounded-[22px] p-8 md:p-16 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-b from-cyan-500/10 to-transparent rounded-full blur-3xl pointer-events-none"></div>
            
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
              <div className="md:w-1/2">
                <h2 className="text-3xl md:text-4xl font-bold mb-6">
                  Technologie <span className="text-cyan-400">Web3</span> Avancée
                </h2>
                <div className="space-y-4">
                  {[
                    "Smart Contracts Audités",
                    "Architecture Décentralisée",
                    "Cryptographie de Pointe",
                    "Standard ERC-721 / Soulbound Tokens"
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-cyan-500/20 flex items-center justify-center">
                        <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                      </div>
                      <span className="text-slate-300 font-medium">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Abstract Blockchain Representation */}
              <div className="md:w-1/2 flex justify-center">
                <div className="relative w-64 h-64">
                  <div className="absolute inset-0 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl opacity-20 rotate-12 blur-xl animate-pulse-glow"></div>
                  <div className="absolute inset-0 border border-white/10 bg-slate-800/50 backdrop-blur-xl rounded-2xl flex items-center justify-center transform rotate-6 hover:rotate-0 transition-transform duration-500">
                    <Database className="w-24 h-24 text-white/80" />
                  </div>
                  <div className="absolute -top-6 -right-6 w-20 h-20 bg-slate-800 border border-white/10 rounded-xl flex items-center justify-center animate-float shadow-xl">
                     <ShieldCheck className="w-10 h-10 text-cyan-400" />
                  </div>
                  <div className="absolute -bottom-6 -left-6 w-20 h-20 bg-slate-800 border border-white/10 rounded-xl flex items-center justify-center animate-float shadow-xl" style={{ animationDelay: '-1.5s' }}>
                     <Award className="w-10 h-10 text-purple-400" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default LandingPage;
