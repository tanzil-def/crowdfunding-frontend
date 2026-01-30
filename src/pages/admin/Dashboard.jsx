import React, { useState, useEffect } from 'react';
import adminService from '../../api/adminService';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Users,
  FileText,
  DollarSign,
  Activity,
  ArrowUpRight,
  Bell,
  CheckCircle,
  Clock,
  ChevronRight,
  TrendingUp
} from 'lucide-react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
} from 'recharts';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [projectStats, setProjectStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [basicStats, projStats] = await Promise.all([
          adminService.getDashboardSummary(),
          adminService.getStatistics()
        ]);
        setStats(basicStats);
        setProjectStats(projStats);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-[#020617]">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          className="h-12 w-12 border-4 border-emerald-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (!stats) return null;

  // Modern Chart Colors
  const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6'];
  const projectStatusData = projectStats
    ? Object.entries(projectStats.by_status).map(([name, value]) => ({ name, value }))
    : [];

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, staggerChildren: 0.1 } }
  };

  return (
    <div className="p-8 bg-[#020617] min-h-screen text-slate-100 font-sans">
      {/* Header */}
      <div className="mb-10 flex justify-between items-end">
        <div>
          <motion.h1
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-4xl font-black italic tracking-tighter text-white"
          >
            ADMIN <span className="text-emerald-500">DASHBOARD</span>
          </motion.h1>
          <p className="text-slate-400 text-sm mt-2 uppercase tracking-[0.2em] font-bold">Protocol Overview & Real-time Metrics</p>
        </div>
        <div className="text-right hidden md:block">
          <div className="text-emerald-500 font-mono text-xs mb-1 uppercase tracking-widest animate-pulse">● System Live</div>
          <div className="text-slate-500 text-[10px] uppercase tracking-widest font-bold">Last Sync: Just Now</div>
        </div>
      </div>

      {/* Stats Cards Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10"
      >
        {/* Revenue Card */}
        <div className="bg-slate-900/50 border border-white/5 p-6 rounded-[2rem] hover:border-emerald-500/30 transition-all group relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <DollarSign size={80} className="text-emerald-500" />
          </div>
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-emerald-500/10 rounded-2xl text-emerald-500">
              <TrendingUp size={24} />
            </div>
            <span className="flex items-center text-[10px] font-black bg-emerald-500/20 text-emerald-400 px-2 py-1 rounded-full italic">
              <ArrowUpRight size={12} className="mr-1" /> +12%
            </span>
          </div>
          <h3 className="text-3xl font-black text-white italic tracking-tight">${Number(stats.total_revenue).toLocaleString()}</h3>
          <p className="text-slate-500 text-[10px] uppercase font-bold tracking-widest mt-1">Total Revenue</p>
        </div>

        {/* Investment Card */}
        <div className="bg-slate-900/50 border border-white/5 p-6 rounded-[2rem] hover:border-blue-500/30 transition-all group">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-blue-500/10 rounded-2xl text-blue-500">
              <Activity size={24} />
            </div>
            <span className="text-[10px] font-black bg-slate-800 text-slate-400 px-2 py-1 rounded-full uppercase">Lifetime</span>
          </div>
          <h3 className="text-3xl font-black text-white italic tracking-tight">{stats.total_investments}</h3>
          <p className="text-slate-500 text-[10px] uppercase font-bold tracking-widest mt-1">Active Investments</p>
        </div>

        {/* Projects Card */}
        <div className="bg-slate-900/50 border border-white/5 p-6 rounded-[2rem] hover:border-purple-500/30 transition-all group">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-purple-500/10 rounded-2xl text-purple-500">
              <FileText size={24} />
            </div>
            {stats.pending_projects > 0 && (
              <span className="animate-pulse text-[10px] font-black bg-orange-500/20 text-orange-400 px-2 py-1 rounded-full uppercase">
                {stats.pending_projects} Pending
              </span>
            )}
          </div>
          <h3 className="text-3xl font-black text-white italic tracking-tight">{stats.total_projects}</h3>
          <p className="text-slate-500 text-[10px] uppercase font-bold tracking-widest mt-1">Total Assets</p>
        </div>

        {/* Notifications Card */}
        <div className="bg-slate-900/50 border border-white/5 p-6 rounded-[2rem] hover:border-red-500/30 transition-all group">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-red-500/10 rounded-2xl text-red-500">
              <Bell size={24} />
            </div>
            <div className="h-2 w-2 rounded-full bg-red-500 shadow-[0_0_10px_red]" />
          </div>
          <h3 className="text-3xl font-black text-white italic tracking-tight">{stats.unread_notifications}</h3>
          <p className="text-slate-500 text-[10px] uppercase font-bold tracking-widest mt-1">System Alerts</p>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
        {/* Donut Chart Section */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="lg:col-span-1 bg-slate-900/40 border border-white/5 p-8 rounded-[2.5rem] relative"
        >
          <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 mb-8 italic">Asset Allocation</h3>
          <div className="h-64 relative" style={{ minWidth: 0, display: 'block' }}>
            <ResponsiveContainer width="100%" height="100%" debounce={100}>
              <PieChart>
                <Pie
                  data={projectStatusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={90}
                  paddingAngle={8}
                  dataKey="value"
                  stroke="none"
                >
                  {projectStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <RechartsTooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderRadius: '15px', border: '1px solid rgba(255,255,255,0.1)' }}
                  itemStyle={{ color: '#fff', fontSize: '12px', fontWeight: 'bold' }}
                />
              </PieChart>
            </ResponsiveContainer>
            {/* Center Text for Chart */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-2xl font-black text-white italic">{stats.total_projects}</span>
              <span className="text-[8px] text-slate-500 uppercase tracking-widest">Total</span>
            </div>
          </div>

          <div className="mt-6 space-y-3">
            {projectStatusData.map((entry, index) => (
              <div key={entry.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-tighter">{entry.name}</span>
                </div>
                <span className="text-xs font-black text-white italic">{entry.value}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Quick Actions Grid */}
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { to: "/admin/users", icon: <Users />, label: "User Control", desc: "Verify and manage accounts", color: "blue" },
            { to: "/admin/pending-projects", icon: <CheckCircle />, label: "Pending Projects", desc: "Approve pending assets", count: stats.pending_projects, color: "emerald" },
            { to: "/admin/payments", icon: <DollarSign />, label: "Settlements", desc: "Review financial history", color: "purple" },
            { to: "/admin/audit-logs", icon: <Clock />, label: "System Logs", desc: "Audit protocol activity", color: "orange" },
          ].map((action, i) => (
            <Link key={i} to={action.to}>
              <motion.div
                whileHover={{ y: -5, backgroundColor: 'rgba(255,255,255,0.05)' }}
                className="p-6 h-full bg-slate-900/30 border border-white/5 rounded-[2rem] flex flex-col group transition-all"
              >
                <div className={`p-4 bg-${action.color}-500/10 text-${action.color}-500 w-fit rounded-2xl mb-4 group-hover:scale-110 transition-transform`}>
                  {React.cloneElement(action.icon, { size: 28 })}
                </div>
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-sm font-black text-white uppercase tracking-widest italic">{action.label}</h4>
                    <p className="text-[10px] text-slate-500 font-bold mt-1 uppercase tracking-tight">{action.desc}</p>
                  </div>
                  {action.count > 0 && (
                    <div className="bg-red-500 text-white text-[10px] px-2 py-1 rounded-lg font-black">{action.count}</div>
                  )}
                </div>
                <div className="mt-auto pt-6 flex items-center text-emerald-500 gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-[9px] font-black uppercase tracking-widest">Execute Access</span>
                  <ChevronRight size={14} />
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;