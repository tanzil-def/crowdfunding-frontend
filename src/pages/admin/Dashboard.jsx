import React, { useEffect, useState } from "react";
import adminService from "../../api/adminService";
import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend,
} from "recharts";
import {
  Users,
  FolderKanban,
  DollarSign,
  Activity,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  Sparkles,
  Zap,
  ArrowRight
} from "lucide-react";
import { Link } from "react-router-dom";

const AdminDashboard = () => {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboard();
    const interval = setInterval(fetchDashboard, 60000);
    return () => clearInterval(interval);
  }, []);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const data = await adminService.getDashboardSummary();
      setDashboard(data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  };

  if (loading && !dashboard) return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
      <motion.div
        animate={{ rotate: 360, scale: [1, 1.2, 1] }}
        transition={{ rotate: { duration: 2, repeat: Infinity, ease: "linear" }, scale: { duration: 1.5, repeat: Infinity, ease: "easeInOut" } }}
        className="relative"
      >
        <div className="w-16 h-16 border-4 border-indigo-500/30 border-t-indigo-400 rounded-full" />
        <div className="absolute inset-0 w-16 h-16 border-4 border-violet-500/20 border-b-violet-400 rounded-full animate-ping" />
      </motion.div>
    </div>
  );

  if (error) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <div className="bg-slate-900 border border-red-500/20 p-8 rounded-2xl text-center max-w-md shadow-2xl">
          <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-500/20">
            <XCircle className="w-8 h-8 text-red-500" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Error</h2>
          <p className="text-gray-400 mb-6">{error}</p>
          <button
            onClick={fetchDashboard}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-semibold transition-all shadow-lg shadow-indigo-500/20"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const stats = [
    {
      title: "Total Projects",
      value: dashboard?.total_projects || 0,
      icon: FolderKanban,
      gradient: "from-indigo-500 via-blue-500 to-cyan-600",
      glow: "shadow-indigo-500/50",
      change: "+5%",
    },
    {
      title: "Pending Projects",
      value: dashboard?.pending_projects || 0,
      icon: Clock,
      gradient: "from-amber-500 via-orange-500 to-red-600",
      glow: "shadow-amber-500/50",
      change: "",
    },
    {
      title: "Total Investments",
      value: dashboard?.total_investments || 0,
      icon: TrendingUp,
      gradient: "from-emerald-500 via-teal-500 to-green-600",
      glow: "shadow-emerald-500/50",
      change: "+12%",
    },
    {
      title: "Total Revenue",
      value: `$${parseFloat(dashboard?.total_revenue || 0).toLocaleString()}`,
      icon: DollarSign,
      gradient: "from-violet-500 via-purple-500 to-fuchsia-600",
      glow: "shadow-violet-500/50",
      change: "+18%",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white overflow-hidden relative">
      {/* Animated Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0], opacity: [0.03, 0.06, 0.03] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-1/2 -right-1/2 w-full h-full bg-gradient-to-br from-indigo-500/10 to-blue-500/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ scale: [1.2, 1, 1.2], rotate: [90, 0, 90], opacity: [0.04, 0.08, 0.04] }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -bottom-1/2 -left-1/2 w-full h-full bg-gradient-to-tr from-violet-500/10 to-pink-500/10 rounded-full blur-3xl"
        />
      </div>

      <div className="relative z-10 p-4 md:p-8 max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">

          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <motion.div
                animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="p-3 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-2xl shadow-2xl shadow-indigo-500/30"
              >
                <Sparkles className="w-8 h-8 text-white" />
              </motion.div>
              <div>
                <h1 className="text-4xl font-black bg-gradient-to-r from-indigo-400 via-violet-400 to-fuchsia-400 bg-clip-text text-transparent tracking-tight">
                  Admin Dashboard
                </h1>
                <p className="text-slate-400 font-medium">Platform Overview & Management</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="bg-slate-900/50 backdrop-blur-xl px-4 py-2 rounded-xl border border-emerald-500/20 flex items-center gap-2 shadow-lg">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="text-sm font-bold text-emerald-500">System Live</span>
              </div>
              {dashboard?.unread_notifications > 0 && (
                <div className="bg-slate-900/50 backdrop-blur-xl px-4 py-2 rounded-xl border border-amber-500/20 flex items-center gap-2 shadow-lg">
                  <span className="text-sm font-bold text-amber-500">{dashboard.unread_notifications} Unread Alerts</span>
                </div>
              )}
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="group relative"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} rounded-2xl blur-xl opacity-0 group-hover:opacity-40 transition-opacity duration-500`} />

                <div className="relative h-full bg-slate-900/80 backdrop-blur-xl rounded-2xl border border-slate-700/50 group-hover:border-slate-600 p-6 transition-all duration-300 shadow-xl">
                  <motion.div
                    whileHover={{ rotate: [0, -10, 10, 0] }}
                    className={`p-3 rounded-xl bg-gradient-to-br ${stat.gradient} w-fit mb-4 shadow-lg ${stat.glow}`}
                  >
                    <stat.icon className="w-6 h-6 text-white" />
                  </motion.div>

                  <p className="text-slate-400 text-sm font-bold mb-2 uppercase tracking-wider">{stat.title}</p>

                  <div className="flex items-end gap-2">
                    <p className="text-3xl font-black text-white">{stat.value}</p>
                    {stat.change && (
                      <span className="text-emerald-400 text-xs font-bold mb-1.5 flex items-center bg-emerald-400/10 px-2 py-0.5 rounded-full border border-emerald-400/20">
                        <TrendingUp className="w-3 h-3 mr-1" />
                        {stat.change}
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Middle Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="lg:col-span-1 bg-slate-900/60 backdrop-blur-xl p-8 rounded-3xl border border-slate-700/50 shadow-2xl flex flex-col justify-between"
            >
              <div>
                <h2 className="text-2xl font-black text-white mb-6 flex items-center gap-3">
                  <Activity className="w-6 h-6 text-indigo-400" />
                  Quick Actions
                </h2>
                <div className="space-y-4">
                  <Link to="/admin/pending-projects" className="flex items-center justify-between p-4 bg-slate-800/50 rounded-xl hover:bg-slate-700/50 transition-all border border-slate-700 group hover:shadow-lg hover:border-indigo-500/30">
                    <span className="text-slate-300 font-bold group-hover:text-white">Pending Reviews</span>
                    <div className="flex items-center gap-2">
                      <span className="bg-amber-500/20 text-amber-500 px-2.5 py-1 rounded-lg text-xs font-bold border border-amber-500/20">{dashboard?.pending_projects || 0}</span>
                      <ArrowRight className="w-4 h-4 text-slate-500 group-hover:translate-x-1 transition-transform group-hover:text-indigo-400" />
                    </div>
                  </Link>
                  <Link to="/admin/access-requests" className="flex items-center justify-between p-4 bg-slate-800/50 rounded-xl hover:bg-slate-700/50 transition-all border border-slate-700 group hover:shadow-lg hover:border-indigo-500/30">
                    <span className="text-slate-300 font-bold group-hover:text-white">Access Requests</span>
                    <ArrowRight className="w-4 h-4 text-slate-500 group-hover:translate-x-1 transition-transform group-hover:text-indigo-400" />
                  </Link>
                  <Link to="/admin/audit-logs" className="flex items-center justify-between p-4 bg-slate-800/50 rounded-xl hover:bg-slate-700/50 transition-all border border-slate-700 group hover:shadow-lg hover:border-indigo-500/30">
                    <span className="text-slate-300 font-bold group-hover:text-white">Audit Logs</span>
                    <ArrowRight className="w-4 h-4 text-slate-500 group-hover:translate-x-1 transition-transform group-hover:text-indigo-400" />
                  </Link>
                  <Link to="/admin/users" className="flex items-center justify-between p-4 bg-slate-800/50 rounded-xl hover:bg-slate-700/50 transition-all border border-slate-700 group hover:shadow-lg hover:border-indigo-500/30">
                    <span className="text-slate-300 font-bold group-hover:text-white">User Management</span>
                    <ArrowRight className="w-4 h-4 text-slate-500 group-hover:translate-x-1 transition-transform group-hover:text-indigo-400" />
                  </Link>
                </div>
              </div>
            </motion.div>

            {/* Charts Area */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="lg:col-span-2 bg-slate-900/60 backdrop-blur-xl p-8 rounded-3xl border border-slate-700/50 shadow-2xl min-h-[400px]"
            >
              <h2 className="text-2xl font-black text-white mb-8 flex items-center gap-3">
                <TrendingUp className="w-6 h-6 text-emerald-400" />
                Platform Growth
              </h2>
              <div className="w-full h-[300px]">
                <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                  <LineChart data={[{ m: 'Jan', v: 4000 }, { m: 'Feb', v: 3000 }, { m: 'Mar', v: 5000 }, { m: 'Apr', v: 8000 }, { m: 'May', v: 7000 }, { m: 'Jun', v: 10000 }]}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                    <XAxis dataKey="m" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} dy={10} />
                    <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `$${v / 1000}k`} dx={-10} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)' }}
                      labelStyle={{ color: '#94a3b8', marginBottom: '4px' }}
                      itemStyle={{ color: '#fff', fontWeight: 'bold' }}
                    />
                    <Line type="monotone" dataKey="v" stroke="#6366f1" strokeWidth={4} dot={{ r: 4, fill: '#6366f1', strokeWidth: 0 }} activeDot={{ r: 8, stroke: '#818cf8', strokeWidth: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminDashboard;