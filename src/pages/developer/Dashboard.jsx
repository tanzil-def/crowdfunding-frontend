import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FolderKanban,
  DollarSign,
  TrendingUp,
  Clock,
  Plus,
  ArrowRight,
  Sparkles,
  Users,
  PieChart as PieIcon,
  Activity
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const DeveloperDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [dashboard, setDashboard] = useState(null);
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const mockDashboard = {
        total_projects: 6,
        total_shares_sold: 3,
        total_investment_received: "1300.00",
        pending_projects: 1,
        unread_notifications: 2
      };

      const mockProjects = [
        {
          id: "98f123bf-6c3e-4cdf-a253-6ebcac1e5d99",
          title: "asdfghjkllkjhgf",
          status: "PENDING",
          total_shares: 3,
          share_price: "33.00",
          shares_sold: 0,
          funding_percentage: 0
        },
        {
          id: "7ca843b4-1e40-4626-8013-84f659dec6e5",
          title: "creative residential tower",
          status: "APPROVED",
          total_shares: 40,
          share_price: "100.00",
          shares_sold: 2,
          funding_percentage: 5
        },
        {
          id: "91ccec6b-aaf1-484f-a28c-019a96c2d67b",
          title: "VitalPulse: IoT Smart ICU",
          status: "APPROVED",
          total_shares: 10,
          share_price: "100.00",
          shares_sold: 1,
          funding_percentage: 10
        }
      ];

      setDashboard(mockDashboard);
      setProjects(mockProjects);
    } catch (err) {
      console.error("Failed to load dashboard:", err);
    } finally {
      setLoading(false);
    }
  };

  const chartData = [
    { name: 'Sold', value: dashboard?.total_shares_sold || 0, color: '#06b6d4' },
    { name: 'Remaining', value: Math.max(0, (dashboard?.total_projects * 10) - (dashboard?.total_shares_sold || 0)), color: '#1e293b' }
  ];

  if (loading) return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
      <motion.div
        animate={{ rotate: 360, scale: [1, 1.2, 1] }}
        transition={{ rotate: { duration: 2, repeat: Infinity, ease: "linear" }, scale: { duration: 1.5, repeat: Infinity, ease: "easeInOut" } }}
        className="relative"
      >
        <div className="w-16 h-16 border-4 border-cyan-500/30 border-t-cyan-400 rounded-full" />
        <div className="absolute inset-0 w-16 h-16 border-4 border-violet-500/20 border-b-violet-400 rounded-full animate-ping" />
      </motion.div>
    </div>
  );

  // Added 'link' property to each stat object
  const stats = [
    { label: 'Total Projects', value: dashboard?.total_projects || 0, icon: FolderKanban, gradient: 'from-cyan-500 via-blue-500 to-indigo-600', glow: 'shadow-cyan-500/50', link: '/developer/projects' },
    { label: 'Investment Received', value: dashboard?.total_investment_received || 0, icon: DollarSign, gradient: 'from-emerald-500 via-teal-500 to-green-600', glow: 'shadow-emerald-500/50', isMoney: true, link: '/developer/projects' },
    { label: 'Total Shares Sold', value: dashboard?.total_shares_sold || 0, icon: TrendingUp, gradient: 'from-violet-500 via-purple-500 to-fuchsia-600', glow: 'shadow-violet-500/50', link: '/developer/projects' },
    { label: 'Pending Projects', value: dashboard?.pending_projects || 0, icon: Clock, gradient: 'from-amber-500 via-orange-500 to-red-600', glow: 'shadow-amber-500/50', link: '/developer/projects' },
  ];

  const StatusBadge = ({ status }) => {
    const config = {
      APPROVED: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/30', glow: 'shadow-emerald-500/30' },
      PENDING: { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/30', glow: 'shadow-amber-500/30' },
      DRAFT: { bg: 'bg-slate-500/10', text: 'text-slate-400', border: 'border-slate-500/30', glow: 'shadow-slate-500/20' },
      REJECTED: { bg: 'bg-rose-500/10', text: 'text-rose-400', border: 'border-rose-500/30', glow: 'shadow-rose-500/30' }
    };
    const style = config[status] || config.DRAFT;
    return (
      <span className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest border ${style.bg} ${style.text} ${style.border} ${style.glow} shadow-lg backdrop-blur-sm transition-all duration-300`}>
        {status?.replace(/_/g, ' ')}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white overflow-hidden relative">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0], opacity: [0.03, 0.06, 0.03] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-1/2 -right-1/2 w-full h-full bg-gradient-to-br from-cyan-500/10 to-violet-500/10 rounded-full blur-3xl"
        />
      </div>

      <div className="relative z-10 p-4 md:p-8 max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-br from-cyan-500 to-violet-600 rounded-2xl">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-4xl font-black bg-gradient-to-r from-cyan-400 to-fuchsia-400 bg-clip-text text-transparent tracking-tighter">
                DeveloperDashboard
              </h1>
            </div>
            <Link to="/developer/projects/new" className="group relative flex items-center gap-3 bg-emerald-600 hover:bg-emerald-500 text-white px-8 py-4 rounded-2xl transition-all font-black shadow-2xl shadow-emerald-900/40 border border-emerald-400/20 uppercase tracking-tighter">
              <Plus className="h-5 w-5 group-hover:rotate-90 transition-transform" />
              <span>Create Now</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat) => (
              <Link to={stat.link} key={stat.label} className="block">
                <motion.div whileHover={{ y: -5 }} className="relative bg-slate-900/80 backdrop-blur-xl rounded-[2rem] border border-slate-800 p-6 shadow-xl hover:border-slate-700 transition-colors cursor-pointer">
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.gradient} w-fit mb-4 shadow-lg ${stat.glow}`}>
                    <stat.icon className="h-6 w-6 text-white" />
                  </div>
                  <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] mb-1">{stat.label}</p>
                  <h3 className="text-3xl font-black text-white tracking-tighter">
                    {stat.isMoney ? `$${parseFloat(stat.value).toLocaleString()}` : stat.value}
                  </h3>
                </motion.div>
              </Link>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 relative bg-slate-900/50 backdrop-blur-xl rounded-[2.5rem] border border-slate-800 overflow-hidden shadow-2xl">
              <div className="p-8 border-b border-slate-800 flex justify-between items-center bg-slate-900/30">
                <h3 className="text-xl font-black text-white tracking-tight flex items-center gap-3">
                  <Activity className="text-cyan-400" /> Project Overview
                </h3>
                <Link to="/developer/projects" className="text-cyan-400 hover:text-cyan-300 text-xs font-black uppercase tracking-widest flex items-center gap-2 transition-all">
                  View All <ArrowRight size={14} />
                </Link>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-slate-950/50 text-slate-500 text-[10px] font-black uppercase tracking-[0.2em]">
                    <tr>
                      <th className="p-6">Project Name</th>
                      <th className="p-6">Status</th>
                      <th className="p-6">Equity Progress</th>
                      <th className="p-6">Investors</th>
                      <th className="p-6 text-right">Capital Raised</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/50">
                    {projects.map((project) => {
                      const progress = project.funding_percentage || ((project.shares_sold / project.total_shares) * 100) || 0;
                      const raised = parseFloat(project.shares_sold || 0) * parseFloat(project.share_price || 0);
                      const displayInvestors = project.investor_count || (project.shares_sold > 0 ? 1 : 0);
                      return (
                        <tr key={project.id} className="hover:bg-slate-800/20 transition-all group">
                          <td className="p-6">
                            <span className="font-black text-slate-200 group-hover:text-cyan-400 transition-colors uppercase text-sm tracking-tight">{project.title}</span>
                          </td>
                          <td className="p-6"><StatusBadge status={project.status} /></td>
                          <td className="p-6">
                            <div className="flex items-center gap-3">
                              <div className="flex-1 h-1.5 bg-slate-800 rounded-full overflow-hidden w-24">
                                <div className="h-full bg-gradient-to-r from-cyan-500 to-violet-500" style={{ width: `${progress}%` }} />
                              </div>
                              <span className="text-[10px] font-black text-slate-400">{Math.round(progress)}%</span>
                            </div>
                          </td>
                          <td className="p-6">
                            <div className="flex items-center gap-2">
                              <Users className={`h-4 w-4 ${displayInvestors > 0 ? 'text-orange-500' : 'text-slate-600'}`} />
                              <span className="font-black text-slate-200">{displayInvestors}</span>
                            </div>
                          </td>
                          <td className="p-6 text-right">
                            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/5 border border-emerald-500/20 rounded-xl">
                              <span className="font-black text-emerald-400 text-sm">${raised.toLocaleString()}</span>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="relative bg-slate-900/50 backdrop-blur-xl rounded-[2.5rem] border border-slate-800 p-8 shadow-2xl flex flex-col items-center justify-center min-h-[450px]">
              <h3 className="text-lg font-black text-white tracking-tight mb-6 flex items-center gap-2 self-start uppercase text-[12px] text-slate-400">
                <PieIcon className="w-4 h-4 text-violet-400" /> Investment Circle
              </h3>

              <div className="w-full h-64 relative overflow-hidden" style={{ minWidth: '0px', minHeight: '256px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartData}
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={8}
                      dataKey="value"
                      isAnimationActive={true}
                    >
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '12px' }}
                      itemStyle={{ color: '#fff' }}
                    />
                  </PieChart>
                </ResponsiveContainer>

                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-3xl font-black text-white">{dashboard?.total_shares_sold}</span>
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Shares Sold</span>
                </div>
              </div>

              <div className="w-full mt-6 space-y-3">
                <div className="flex justify-between items-center p-3 bg-slate-950/50 rounded-xl border border-slate-800/50">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.5)]" />
                    <span className="text-xs font-bold text-slate-400">Shares Sold</span>
                  </div>
                  <span className="text-xs font-black">{dashboard?.total_shares_sold}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-slate-950/50 rounded-xl border border-slate-800/50">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-slate-700" />
                    <span className="text-xs font-bold text-slate-400">Total Capacity</span>
                  </div>
                  <span className="text-xs font-black">{(dashboard?.total_projects || 0) * 10}</span>
                </div>
              </div>
            </div>

          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default DeveloperDashboard;