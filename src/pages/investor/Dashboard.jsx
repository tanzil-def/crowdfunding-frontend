import React, { useEffect, useState } from "react";
import investorService from "../../api/investorService";
import { motion } from "framer-motion";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LineChart,
  Line,
} from "recharts";
import {
  TrendingUp,
  DollarSign,
  Briefcase,
  PieChart as PieIcon,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  Wallet,
} from "lucide-react";
import { Link } from "react-router-dom";

const InvestorDashboard = () => {
  const [dashboard, setDashboard] = useState(null);
  const [portfolio, setPortfolio] = useState(null);
  const [recentInvestments, setRecentInvestments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [dashRes, portfolioRes, investmentsRes] = await Promise.all([
        investorService.getDashboardSummary(),
        investorService.getPortfolioSummary(),
        investorService.getMyInvestments({ page_size: 5 }),
      ]);

      // Handle potential { success: true, data: { ... } } wrapper for dashboard & portfolio
      const dashData = dashRes.data || dashRes;
      const portfolioData = portfolioRes.data || portfolioRes;

      setDashboard(dashData);
      setPortfolio(portfolioData);
      setRecentInvestments(investmentsRes.results || []);
    } catch (err) {
      console.error("Failed to load dashboard:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-emerald-900 to-slate-900 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  const stats = [
    {
      title: "Total Invested",
      value: `$${(portfolio?.total_invested || 0).toLocaleString()}`,
      icon: DollarSign,
      color: "from-emerald-500 to-green-500",
      trend: "+15.3%",
      trendUp: true,
    },
    {
      title: "Active Projects",
      value: portfolio?.total_projects || 0,
      icon: Briefcase,
      color: "from-blue-500 to-cyan-500",
      trend: "+2",
      trendUp: true,
    },
    {
      title: "Total Shares",
      value: portfolio?.total_shares || 0,
      icon: PieIcon,
      color: "from-purple-500 to-pink-500",
      trend: "+120",
      trendUp: true,
    },
    {
      title: "Portfolio Value",
      value: `$${((portfolio?.total_invested || 0) * 1.08).toLocaleString()}`,
      icon: Wallet,
      color: "from-orange-500 to-yellow-500",
      trend: "+8.2%",
      trendUp: true,
    },
  ];

  // Mock allocation data - in production, this would come from backend
  const allocationData = dashboard?.project_allocation || [
    { name: "Technology", value: 35, color: "#3b82f6" },
    { name: "Healthcare", value: 25, color: "#10b981" },
    { name: "Finance", value: 20, color: "#8b5cf6" },
    { name: "Real Estate", value: 15, color: "#f59e0b" },
    { name: "Others", value: 5, color: "#6b7280" },
  ];

  // Performance data
  const performanceData = dashboard?.performance_data || [
    { month: "Jan", value: 5000 },
    { month: "Feb", value: 7500 },
    { month: "Mar", value: 6800 },
    { month: "Apr", value: 9200 },
    { month: "May", value: 11500 },
    { month: "Jun", value: 15000 },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-emerald-900 to-slate-900 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-5xl font-bold bg-gradient-to-r from-emerald-400 to-green-400 bg-clip-text text-transparent mb-2">
            Investment Dashboard
          </h1>
          <p className="text-gray-400 text-lg">
            Track your portfolio performance and investments
          </p>
        </motion.div>

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
                  <div className={`flex items-center gap-1 text-sm font-semibold ${stat.trendUp ? "text-green-400" : "text-red-400"
                    }`}>
                    {stat.trendUp ? (
                      <ArrowUpRight className="w-4 h-4" />
                    ) : (
                      <ArrowDownRight className="w-4 h-4" />
                    )}
                    {stat.trend}
                  </div>
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
          {/* Portfolio Allocation */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6"
          >
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <PieIcon className="w-6 h-6 text-emerald-400" />
              Portfolio Allocation
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={allocationData}
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
                  {allocationData.map((entry, index) => (
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

          {/* Performance Chart */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6"
          >
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-emerald-400" />
              Investment Growth
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="month" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(15, 23, 42, 0.9)",
                    border: "1px solid rgba(148, 163, 184, 0.3)",
                    borderRadius: "12px",
                    color: "#fff",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#10b981"
                  strokeWidth={3}
                  dot={{ fill: "#10b981", r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        {/* Recent Investments */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <Activity className="w-6 h-6 text-emerald-400" />
              Recent Investments
            </h2>
            <Link
              to="/investor/investments"
              className="text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1"
            >
              View All
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>

          {recentInvestments.length > 0 ? (
            <div className="space-y-3">
              {recentInvestments.map((investment, index) => (
                <motion.div
                  key={investment.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center justify-between p-4 bg-slate-700/30 rounded-xl hover:bg-slate-700/50 transition-colors"
                >
                  <div className="flex-1">
                    <h3 className="text-white font-semibold mb-1">
                      {investment.project_title}
                    </h3>
                    <div className="flex items-center gap-4 text-sm text-gray-400">
                      <span>{investment.project_category}</span>
                      <span>•</span>
                      <span>{investment.shares_purchased} shares</span>
                      <span>•</span>
                      <span>{new Date(investment.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-white font-bold text-lg">
                      ${parseFloat(investment.total_amount).toLocaleString()}
                    </p>
                    <p className="text-gray-400 text-sm">
                      ${parseFloat(investment.price_per_share).toFixed(2)}/share
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-400">
              <Briefcase className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p className="text-lg mb-2">No investments yet</p>
              <Link
                to="/investor/browse"
                className="inline-block mt-4 px-6 py-3 bg-gradient-to-r from-emerald-500 to-green-500 text-white rounded-xl font-semibold hover:from-emerald-600 hover:to-green-600 transition-all"
              >
                Browse Projects
              </Link>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default InvestorDashboard;