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

const AdminDashboard = () => {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboard();
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchDashboard, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const res = await adminService.getDashboardSummary();
      // Handle potential { success: true, data: { ... } } wrapper
      const dashData = res.data || res;
      setDashboard(dashData);
      setError(null);
    } catch (err) {
      setError(err.message || "Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  };

  if (loading && !dashboard) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="bg-red-500/10 border border-red-500 rounded-xl p-6 text-red-200">
          <p className="text-lg font-semibold">Error: {error}</p>
          <button
            onClick={fetchDashboard}
            className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const stats = [
    {
      title: "Total Users",
      value: dashboard?.total_users || 0,
      icon: Users,
      color: "from-blue-500 to-cyan-500",
      change: "+12%",
    },
    {
      title: "Total Projects",
      value: dashboard?.total_projects || 0,
      icon: FolderKanban,
      color: "from-purple-500 to-pink-500",
      change: "+8%",
    },
    {
      title: "Total Investments",
      value: `$${(dashboard?.total_investments || 0).toLocaleString()}`,
      icon: DollarSign,
      color: "from-green-500 to-emerald-500",
      change: "+23%",
    },
    {
      title: "Pending Reviews",
      value: dashboard?.pending_reviews || 0,
      icon: Clock,
      color: "from-orange-500 to-yellow-500",
      change: "",
    },
  ];

  const projectStatusData = [
    { name: "Approved", value: dashboard?.approved_projects || 0, color: "#10b981" },
    { name: "Pending", value: dashboard?.pending_reviews || 0, color: "#f59e0b" },
    { name: "Rejected", value: dashboard?.rejected_projects || 0, color: "#ef4444" },
    { name: "Draft", value: dashboard?.draft_projects || 0, color: "#6b7280" },
  ];

  const recentActivity = dashboard?.recent_activities || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto"
      >
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
            Admin Dashboard
          </h1>
          <p className="text-gray-400 text-lg">
            Platform overview and management center
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="relative overflow-hidden rounded-2xl bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 p-6"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-10`} />
              <div className="relative">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.color}`}>
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                  {stat.change && (
                    <span className="text-green-400 text-sm font-semibold flex items-center gap-1">
                      <TrendingUp className="w-4 h-4" />
                      {stat.change}
                    </span>
                  )}
                </div>
                <h3 className="text-gray-400 text-sm font-medium mb-1">
                  {stat.title}
                </h3>
                <p className="text-3xl font-bold text-white">{stat.value}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Project Status Distribution */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6"
          >
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <Activity className="w-6 h-6 text-purple-400" />
              Project Status Distribution
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={projectStatusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name}: ${(percent * 100).toFixed(0)}%`
                  }
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {projectStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(15, 23, 42, 0.9)",
                    border: "1px solid rgba(148, 163, 184, 0.3)",
                    borderRadius: "12px",
                    color: "#fff",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6"
          >
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <Clock className="w-6 h-6 text-purple-400" />
              Recent Activity
            </h2>
            <div className="space-y-4 max-h-[300px] overflow-y-auto">
              {recentActivity.length > 0 ? (
                recentActivity.map((activity, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-start gap-4 p-4 rounded-xl bg-slate-700/30 hover:bg-slate-700/50 transition-colors"
                  >
                    <div className="flex-shrink-0">
                      {activity.type === "approved" ? (
                        <CheckCircle className="w-5 h-5 text-green-400" />
                      ) : activity.type === "rejected" ? (
                        <XCircle className="w-5 h-5 text-red-400" />
                      ) : (
                        <Clock className="w-5 h-5 text-yellow-400" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-white text-sm font-medium">
                        {activity.message}
                      </p>
                      <p className="text-gray-400 text-xs mt-1">
                        {activity.timestamp}
                      </p>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-400">
                  <Activity className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No recent activity</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Access Requests & Transactions Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6"
          >
            <h2 className="text-2xl font-bold text-white mb-4">
              Access Requests Overview
            </h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-4 bg-slate-700/30 rounded-lg">
                <span className="text-gray-300">Pending</span>
                <span className="text-2xl font-bold text-yellow-400">
                  {dashboard?.pending_access_requests || 0}
                </span>
              </div>
              <div className="flex justify-between items-center p-4 bg-slate-700/30 rounded-lg">
                <span className="text-gray-300">Approved</span>
                <span className="text-2xl font-bold text-green-400">
                  {dashboard?.approved_access_requests || 0}
                </span>
              </div>
              <div className="flex justify-between items-center p-4 bg-slate-700/30 rounded-lg">
                <span className="text-gray-300">Rejected</span>
                <span className="text-2xl font-bold text-red-400">
                  {dashboard?.rejected_access_requests || 0}
                </span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6"
          >
            <h2 className="text-2xl font-bold text-white mb-4">
              Transaction Summary
            </h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-4 bg-slate-700/30 rounded-lg">
                <span className="text-gray-300">Total Transactions</span>
                <span className="text-2xl font-bold text-blue-400">
                  {dashboard?.total_transactions || 0}
                </span>
              </div>
              <div className="flex justify-between items-center p-4 bg-slate-700/30 rounded-lg">
                <span className="text-gray-300">Successful</span>
                <span className="text-2xl font-bold text-green-400">
                  {dashboard?.successful_transactions || 0}
                </span>
              </div>
              <div className="flex justify-between items-center p-4 bg-slate-700/30 rounded-lg">
                <span className="text-gray-300">Failed</span>
                <span className="text-2xl font-bold text-red-400">
                  {dashboard?.failed_transactions || 0}
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminDashboard;