import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import {
  LayoutDashboard, FolderKanban, Plus, Users, DollarSign, TrendingUp, Globe
} from 'lucide-react';

const DeveloperDashboard = () => {
  const [projects, setProjects] = useState([]);
  const [stats, setStats] = useState({});
  const [fundingData, setFundingData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setProjects([
        { id: 1, title: 'Skyline Luxury Tower', status: 'APPROVED', sharesSold: 850, totalShares: 1000, raised: 127500 },
        { id: 2, title: 'Green Valley Resort', status: 'PENDING_REVIEW', sharesSold: 120, totalShares: 500, raised: 26400 },
        { id: 3, title: 'Eco Villas', status: 'DRAFT', sharesSold: 0, totalShares: 300, raised: 0 },
      ]);

      setStats({
        totalProjects: 3,
        fundsSecured: 153900,
        investors: 45,
        progress: 78
      });

      setFundingData([
        { month: 'Jan', amount: 45000 },
        { month: 'Feb', amount: 72000 },
        { month: 'Mar', amount: 38000 },
        { month: 'Apr', amount: 85000 },
        { month: 'May', amount: 62000 },
      ]);

      setLoading(false);
    }, 800);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[70vh]">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="pt-20 pb-12 max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Projects" 
          value={stats.totalProjects} 
          icon={FolderKanban} 
          color="emerald" 
        />
        <StatCard 
          title="Funds Secured" 
          value={`$${stats.fundsSecured.toLocaleString()}`} 
          icon={DollarSign} 
          color="blue" 
        />
        <StatCard 
          title="Active Investors" 
          value={stats.investors} 
          icon={Users} 
          color="purple" 
        />
        <StatCard 
          title="Funding Progress" 
          value={`${stats.progress}%`} 
          icon={TrendingUp} 
          color="amber" 
        />
      </div>

      {/* Funding Growth Chart */}
      <div className="bg-slate-900/80 backdrop-blur-sm border border-slate-700 rounded-2xl p-8 shadow-2xl">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-2xl font-bold text-white flex items-center gap-3">
            <TrendingUp size={24} className="text-emerald-500" />
            Funding Growth
          </h3>
          <span className="text-sm text-slate-400">Last 5 Months</span>
        </div>
        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={fundingData}>
              <defs>
                <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
              <XAxis dataKey="month" stroke="#64748b" tick={{ fill: '#94a3b8' }} />
              <YAxis stroke="#64748b" tick={{ fill: '#94a3b8' }} tickFormatter={(v) => `$${v/1000}k`} />
              <Tooltip 
                contentStyle={{ 
                  background: '#0f172a', 
                  border: '1px solid #334155', 
                  borderRadius: '12px', 
                  color: '#e2e8f0' 
                }}
              />
              <Area 
                type="monotone" 
                dataKey="amount" 
                stroke="#10b981" 
                strokeWidth={3}
                fill="url(#colorAmount)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Projects Table */}
      <div className="bg-slate-900/80 backdrop-blur-sm border border-slate-700 rounded-2xl overflow-hidden shadow-2xl">
        <div className="p-8 border-b border-slate-700 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
          <h3 className="text-2xl font-bold text-white">Your Projects</h3>
          <button className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-3 rounded-xl font-medium flex items-center gap-2 transition transform hover:scale-105 active:scale-95">
            <Plus size={18} />
            New Project
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px]">
            <thead>
              <tr className="bg-slate-800/50">
                <th className="p-6 text-left text-slate-300 font-semibold">Project</th>
                <th className="p-6 text-left text-slate-300 font-semibold">Status</th>
                <th className="p-6 text-left text-slate-300 font-semibold">Raised</th>
                <th className="p-6 text-left text-slate-300 font-semibold">Progress</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {projects.map(p => (
                <tr key={p.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="p-6 font-medium text-white">{p.title}</td>
                  <td className="p-6">
                    <span className={`inline-block px-4 py-1.5 rounded-full text-xs font-medium ${
                      p.status === 'APPROVED' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                      p.status === 'PENDING_REVIEW' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                      'bg-slate-500/20 text-slate-400 border border-slate-500/30'
                    }`}>
                      {p.status}
                    </span>
                  </td>
                  <td className="p-6 font-medium text-white">${p.raised.toLocaleString()}</td>
                  <td className="p-6">
                    <div className="w-40 h-2 bg-slate-700 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-1000"
                        style={{ width: `${(p.sharesSold / p.totalShares) * 100}%` }}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon: Icon, color }) => (
  <div className="bg-slate-900/80 backdrop-blur-sm border border-slate-700 rounded-2xl p-6 hover:border-slate-600 transition-all shadow-lg">
    <div className="flex items-center justify-between mb-3">
      <p className="text-slate-400 text-sm font-medium">{title}</p>
      <div className={`p-3 rounded-xl bg-${color}-500/10`}>
        <Icon size={22} className={`text-${color}-500`} />
      </div>
    </div>
    <p className="text-3xl font-bold text-white tracking-tight">{value}</p>
  </div>
);

export default DeveloperDashboard;