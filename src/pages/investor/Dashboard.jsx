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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [dashRes, portfolioRes] = await Promise.all([
        investorService.getDashboardSummary(),
        investorService.getPortfolioSummary(),
      ]);

      const dashData = dashRes.data || dashRes;
      const portfolioData = portfolioRes.data || portfolioRes;

      setDashboard(dashData);
      setPortfolio(portfolioData);
    } catch (err) {
      console.error("Failed to load dashboard:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#030712] flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  const stats = [
    {
      label: "Portfolio Value",
      value: dashboard?.portfolio_value || 0,
      icon: Wallet,
      color: "from-blue-600 to-indigo-600",
      isMoney: true,
      change: portfolio?.profit_loss_percentage ? `+${portfolio.profit_loss_percentage}%` : null,
    },
    {
      label: "Total Investments",
      value: dashboard?.total_investments || 0,
      icon: DollarSign,
      color: "from-emerald-600 to-teal-600",
      change: "+2",
    },
    {
      label: "Favorite Projects",
      value: dashboard?.favorite_projects || 0,
      icon: PieIcon,
      color: "from-purple-600 to-pink-600",
    },
    {
      label: "Active Assets",
      value: dashboard?.total_shares_owned || 0, // Fallback if still using local naming or keep as extra
      icon: Briefcase,
      color: "from-amber-600 to-orange-600",
    },
  ];

  return (
    <div className="min-h-screen bg-[#030712] text-slate-200 p-4 md:p-8">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto space-y-8"
      >
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Investor Terminal</h1>
            <p className="text-slate-400">Monitor your assets and explore new ventures</p>
          </div>
          <div className="flex items-center gap-3">
            {dashboard?.unread_notifications > 0 && (
              <div className="glass-morphism px-4 py-2 rounded-xl border-blue-500/20 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
                <span className="text-sm font-medium text-blue-500">{dashboard.unread_notifications} New Messages</span>
              </div>
            )}
            <Link
              to="/projects"
              className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-xl transition-all font-semibold shadow-lg shadow-blue-900/20 flex items-center gap-2"
            >
              Explore Projects
              <ArrowUpRight className="w-5 h-5" />
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="glass-morphism p-6 group hover:border-blue-500/30 transition-all"
            >
              <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.color} w-fit mb-4 group-hover:scale-110 transition-transform`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
              <p className="text-slate-400 text-sm font-medium mb-1">{stat.label}</p>
              <div className="flex items-end gap-2">
                <span className="text-3xl font-bold text-white">
                  {stat.isMoney ? `$${parseFloat(stat.value).toLocaleString()}` : stat.value}
                </span>
                {stat.change && (
                  <span className="text-emerald-500 text-xs font-bold mb-1.5">{stat.change}</span>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Recent Transactions */}
          <div className="lg:col-span-2 glass-morphism rounded-2xl overflow-hidden flex flex-col">
            <div className="p-6 border-b border-white/5 flex justify-between items-center">
              <h3 className="text-xl font-bold text-white">Market Activity</h3>
              <Link to="/investor/investments" className="text-blue-400 hover:text-blue-300 text-sm font-semibold transition-colors">
                View All History
              </Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-white/5 text-slate-400 text-xs uppercase tracking-wider">
                  <tr>
                    <th className="p-6 font-semibold">Asset</th>
                    <th className="p-6 font-semibold">Date</th>
                    <th className="p-6 font-semibold">Status</th>
                    <th className="p-6 font-semibold">Value</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {(dashboard?.recent_transactions || []).length > 0 ? (
                    dashboard.recent_transactions.map((tx) => (
                      <tr key={tx.id} className="hover:bg-white/[0.02] transition-colors">
                        <td className="p-6 font-medium text-white">{tx.project_title}</td>
                        <td className="p-6 text-slate-400">{new Date(tx.created_at).toLocaleDateString()}</td>
                        <td className="p-6">
                          <span className="px-2 py-1 rounded-full text-[10px] font-bold uppercase bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                            Success
                          </span>
                        </td>
                        <td className="p-6 text-emerald-400 font-bold">$ {parseFloat(tx.amount).toLocaleString()}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="p-12 text-center text-slate-500">
                        <div className="flex flex-col items-center gap-4">
                          <Activity className="w-12 h-12 opacity-20" />
                          <p>No recent activity found.</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Performance Summary */}
          <div className="lg:col-span-1 glass-morphism p-6 flex flex-col">
            <h3 className="text-xl font-bold text-white mb-6">Growth Matrix</h3>
            <div className="flex-1 space-y-6">
              <div className="p-6 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 rounded-2xl border border-blue-500/20">
                <p className="text-blue-400 text-sm font-medium mb-1">Unrealized P&L</p>
                <p className="text-4xl font-black text-white">$ {parseFloat(portfolio?.profit_loss || 0).toLocaleString()}</p>
                <div className="mt-4 flex items-center gap-2">
                  <div className="flex-1 h-2 bg-blue-900/50 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500 rounded-full"
                      style={{ width: `${portfolio?.profit_loss_percentage || 0}%` }}
                    />
                  </div>
                  <span className="text-blue-400 font-bold text-sm">+{portfolio?.profit_loss_percentage || 0}%</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                  <p className="text-slate-400 text-xs mb-1">Average Entry</p>
                  <p className="text-lg font-bold text-white">$ 124.50</p>
                </div>
                <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                  <p className="text-slate-400 text-xs mb-1">Diversification</p>
                  <p className="text-lg font-bold text-white">High</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default InvestorDashboard;