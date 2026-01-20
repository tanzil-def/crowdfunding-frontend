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
  XCircle
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

  if (loading && !dashboard) {
    return (
      <div className="min-h-screen bg-[#070b14] flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#070b14] flex items-center justify-center p-4">
        <div className="glass-morphism border-red-500/20 p-8 rounded-2xl text-center max-w-md">
          <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-500/20">
            <XCircle className="w-8 h-8 text-red-500" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Error</h2>
          <p className="text-gray-400 mb-6">{error}</p>
          <button
            onClick={fetchDashboard}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-semibold transition-all"
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
      color: "from-indigo-500 to-blue-500",
      change: "+5%",
    },
    {
      title: "Pending Projects",
      value: dashboard?.pending_projects || 0,
      icon: Clock,
      color: "from-amber-500 to-orange-500",
      change: "",
    },
    {
      title: "Total Investments",
      value: dashboard?.total_investments || 0,
      icon: TrendingUp,
      color: "from-emerald-500 to-teal-500",
      change: "+12%",
    },
    {
      title: "Total Revenue",
      value: `$${parseFloat(dashboard?.total_revenue || 0).toLocaleString()}`,
      icon: DollarSign,
      color: "from-purple-500 to-pink-500",
      change: "+18%",
    },
  ];

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-200 p-4 md:p-8">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto space-y-8"
      >
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold text-white mb-1">Admin Dashboard</h1>
            <p className="text-slate-400">Real-time platform metrics and oversight</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="glass-morphism px-4 py-2 rounded-xl border-indigo-500/20 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-sm font-medium text-emerald-500">System Live</span>
            </div>
            {dashboard?.unread_notifications > 0 && (
              <div className="glass-morphism px-4 py-2 rounded-xl border-amber-500/20 flex items-center gap-2">
                <span className="text-sm font-medium text-amber-500">{dashboard.unread_notifications} Unread Alerts</span>
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
              className="glass-morphism group hover:border-indigo-500/30 transition-all p-6 relative"
            >
              <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.color} w-fit mb-4 group-hover:scale-110 transition-transform`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-slate-400 text-sm font-medium mb-1">{stat.title}</p>
                <div className="flex items-end gap-2">
                  <p className="text-3xl font-bold text-white">{stat.value}</p>
                  {stat.change && (
                    <span className="text-emerald-500 text-xs font-bold mb-1.5 flex items-center">
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
          {/* Recent Audits Info */}
          <div className="lg:col-span-1 glass-morphism p-6 flex flex-col justify-between">
            <div>
              <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <Activity className="w-5 h-5 text-indigo-500" />
                Quick Actions
              </h2>
              <div className="space-y-3">
                <Link to="/admin/projects" className="flex items-center justify-between p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-colors border border-white/5 group">
                  <span className="text-slate-300">Pending Reviews</span>
                  <div className="flex items-center gap-2">
                    <span className="bg-amber-500/20 text-amber-500 px-2 py-0.5 rounded text-xs font-bold">{dashboard?.pending_projects || 0}</span>
                    <ArrowRight className="w-4 h-4 text-slate-500 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
                <Link to="/admin/requests" className="flex items-center justify-between p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-colors border border-white/5 group">
                  <span className="text-slate-300">Access Requests</span>
                  <ArrowRight className="w-4 h-4 text-slate-500 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link to="/admin/audit" className="flex items-center justify-between p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-colors border border-white/5 group">
                  <span className="text-slate-300">Audit Logs</span>
                  <ArrowRight className="w-4 h-4 text-slate-500 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </div>

          {/* Charts or Insights placeholder */}
          <div className="lg:col-span-2 glass-morphism p-6 min-h-[300px]">
            <h2 className="text-xl font-bold text-white mb-6">Investment Performance</h2>
            <div style={{ width: '100%', height: 240 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={[{ m: 'Jan', v: 4000 }, { m: 'Feb', v: 3000 }, { m: 'Mar', v: 5000 }, { m: 'Apr', v: 8000 }, { m: 'May', v: 7000 }, { m: 'Jun', v: 10000 }]}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                  <XAxis dataKey="m" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `$${v / 1000}k`} />
                  <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '12px' }} />
                  <Line type="monotone" dataKey="v" stroke="#6366f1" strokeWidth={3} dot={{ r: 4, fill: '#6366f1' }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

// Internal components or helpers
const ArrowRight = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
);

export default AdminDashboard;