import React, { useMemo } from 'react';
import { 
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer, 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend 
} from 'recharts';
import { Users, CheckCircle, XCircle, Award } from 'lucide-react';

// Couleurs du thème (Cyan, Blue, Purple, Orange, Green)
const COLORS = ['#06b6d4', '#3b82f6', '#8b5cf6', '#f97316', '#10b981'];

interface DashboardStatsProps {
  diplomas: any[];
}

const DashboardStats = ({ diplomas }: DashboardStatsProps) => {

  // --- 1. CALCUL DES DONNÉES (useMemo pour la performance) ---
  const stats = useMemo(() => {
    const total = diplomas.length;
    const valid = diplomas.filter(d => d.valid).length;
    const revoked = total - valid;

    // A. Calcul par Filière (Major)
    const majorCount: Record<string, number> = {};
    diplomas.forEach(d => {
      const major = d.speciality || "Inconnu";
      majorCount[major] = (majorCount[major] || 0) + 1;
    });

    const dataByMajor = Object.keys(majorCount).map((key, index) => ({
      name: key,
      value: majorCount[key],
      color: COLORS[index % COLORS.length]
    }));

    // B. Calcul par Année
    const yearCount: Record<string, number> = {};
    diplomas.forEach(d => {
      const year = d.graduationYear || "Inconnu";
      yearCount[year] = (yearCount[year] || 0) + 1;
    });

    const dataByYear = Object.keys(yearCount).map(key => ({
      name: key,
      diplomes: yearCount[key]
    }));

    return { total, valid, revoked, dataByMajor, dataByYear };
  }, [diplomas]);

  return (
    <div className="space-y-6 mb-8 animate-fade-in-up">
      
      {/* --- LIGNE 1 : KPI CARDS (CHIFFRES CLÉS) --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Carte Total */}
        <div className="glass-panel p-5 rounded-xl border border-white/5 flex items-center gap-4">
          <div className="p-3 rounded-full bg-blue-500/20 text-blue-400">
            <Users className="h-6 w-6" />
          </div>
          <div>
            <p className="text-slate-400 text-sm">Total Diplômés</p>
            <p className="text-2xl font-bold text-white">{stats.total}</p>
          </div>
        </div>

        {/* Carte Valides */}
        <div className="glass-panel p-5 rounded-xl border border-white/5 flex items-center gap-4">
          <div className="p-3 rounded-full bg-green-500/20 text-green-400">
            <CheckCircle className="h-6 w-6" />
          </div>
          <div>
            <p className="text-slate-400 text-sm">Diplômes Actifs</p>
            <p className="text-2xl font-bold text-white">{stats.valid}</p>
          </div>
        </div>

        {/* Carte Révoqués */}
        <div className="glass-panel p-5 rounded-xl border border-white/5 flex items-center gap-4">
          <div className="p-3 rounded-full bg-red-500/20 text-red-400">
            <XCircle className="h-6 w-6" />
          </div>
          <div>
            <p className="text-slate-400 text-sm">Révoqués</p>
            <p className="text-2xl font-bold text-white">{stats.revoked}</p>
          </div>
        </div>
      </div>

      {/* --- LIGNE 2 : GRAPHIQUES --- */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* GRAPHIQUE 1 : Par Filière (Donut) */}
        <div className="glass-panel p-6 rounded-2xl border border-white/5">
          <h3 className="text-white font-bold mb-4 flex items-center gap-2">
            <Award className="h-4 w-4 text-cyan-400" /> Répartition par Filière
          </h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats.dataByMajor}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {stats.dataByMajor.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#fff' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Legend verticalAlign="bottom" height={36}/>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* GRAPHIQUE 2 : Par Année (Barres) */}
        <div className="glass-panel p-6 rounded-2xl border border-white/5">
          <h3 className="text-white font-bold mb-4 flex items-center gap-2">
            <Award className="h-4 w-4 text-purple-400" /> Évolution par Promotion
          </h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.dataByYear}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                <XAxis dataKey="name" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#fff' }}
                  cursor={{fill: 'rgba(255,255,255,0.05)'}}
                />
                <Bar dataKey="diplomes" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
};

export default DashboardStats;