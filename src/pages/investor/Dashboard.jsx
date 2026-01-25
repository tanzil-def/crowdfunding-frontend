import React, { useEffect, useState } from "react";
import investorService from "../../api/investorService";
import { motion } from "framer-motion";
import {
  TrendingUp,
  DollarSign,
  Briefcase,
  PieChart as PieIcon,
  Activity,
  ArrowUpRight,
  Wallet,
  Sparkles,
  Zap
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
      setDashboard(dashRes.data || dashRes);
      setPortfolio(portfolioRes.data || portfolioRes);
    } catch (err) {
      console.error("Failed to load dashboard:", err);
    } finally {
      setLoading(false);
    }
  };

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

  const stats = [
    {
      label: "Portfolio Value",
      value: dashboard?.portfolio_value || 0,
      icon: Wallet,
      gradient: "from-cyan-500 via-blue-500 to-indigo-600",
      glow: "shadow-cyan-500/50",
      isMoney: true,
      change: portfolio?.profit_loss_percentage ? `+${portfolio.profit_loss_percentage}%` : null,
    },
    {
      label: "Total Investments",
      value: dashboard?.total_investments || 0,
      icon: DollarSign,
      gradient: "from-emerald-500 via-teal-500 to-green-600",
      glow: "shadow-emerald-500/50",
    },
    {
      label: "Favorite Projects",
      value: dashboard?.favorite_projects || 0,
      icon: PieIcon,
      gradient: "from-violet-500 via-purple-500 to-fuchsia-600",
      glow: "shadow-violet-500/50",
    },
    {
      label: "Active Assets",
      value: dashboard?.total_shares_owned || 0,
      icon: Briefcase,
      gradient: "from-amber-500 via-orange-500 to-red-600",
      glow: "shadow-amber-500/50",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white overflow-hidden relative">
      {/* Animated Background Blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0], opacity: [0.03, 0.06, 0.03] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-1/2 -right-1/2 w-full h-full bg-gradient-to-br from-cyan-500/10 to-violet-500/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ scale: [1.2, 1, 1.2], rotate: [90, 0, 90], opacity: [0.04, 0.08, 0.04] }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -bottom-1/2 -left-1/2 w-full h-full bg-gradient-to-tr from-violet-500/10 to-fuchsia-500/10 rounded-full blur-3xl"
        />
      </div>

      <div className="relative z-10 p-4 md:p-8 max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="space-y-8">

          {/* Header Section */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
              <div className="flex items-center gap-4 mb-3">
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  className="p-3 bg-gradient-to-br from-cyan-500 to-violet-600 rounded-2xl shadow-2xl shadow-cyan-500/30"
                >
                  <Sparkles className="w-8 h-8 text-white" />
                </motion.div>
                <h1 className="text-5xl font-black bg-gradient-to-r from-cyan-400 via-violet-400 to-fuchsia-400 bg-clip-text text-transparent tracking-tight">
                  Investor Dashboard
                </h1>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-4">
              {dashboard?.unread_notifications > 0 && (
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl blur-lg opacity-50 transition-opacity" />
                  <div className="relative px-5 py-3 bg-slate-900/90 backdrop-blur-xl rounded-xl border border-amber-500/30 flex items-center gap-3">
                    <motion.span animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 2, repeat: Infinity }} className="w-2.5 h-2.5 rounded-full bg-amber-400 shadow-lg shadow-amber-400/50" />
                    <span className="text-sm font-bold text-amber-400">{dashboard.unread_notifications} Alerts</span>
                  </div>
                </div>
              )}
              <Link to="/projects" className="group relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl blur-xl opacity-60 group-hover:opacity-100 transition-opacity" />
                <div className="relative flex items-center gap-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white px-6 py-3.5 rounded-xl transition-all font-bold shadow-2xl border border-cyan-400/20">
                  <span>Explore Projects</span>
                  <Zap className="h-4 w-4" />
                </div>
              </Link>
            </motion.div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: index * 0.1, duration: 0.5, type: "spring", stiffness: 100 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="group relative"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} rounded-2xl blur-xl opacity-0 group-hover:opacity-40 transition-opacity duration-500`} />
                <div className="relative h-full bg-slate-900/80 backdrop-blur-xl rounded-2xl border border-slate-700/50 group-hover:border-slate-600 p-6 transition-all duration-300 shadow-xl">
                  <motion.div
                    whileHover={{ rotate: [0, -10, 10, 0] }}
                    className={`p-4 rounded-xl bg-gradient-to-br ${stat.gradient} w-fit mb-4 shadow-lg ${stat.glow}`}
                  >
                    <stat.icon className="h-7 w-7 text-white" strokeWidth={2.5} />
                  </motion.div>
                  <p className="text-slate-400 text-sm font-semibold mb-2 uppercase tracking-wider">{stat.label}</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-black text-white">
                      {stat.isMoney ? `$${parseFloat(stat.value).toLocaleString()}` : stat.value}
                    </span>
                    {stat.change && <span className="text-emerald-400 text-xs font-black">{stat.change}</span>}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Main Content Grid */}
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Market Activity Table */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="lg:col-span-2 relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-violet-500/10 rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              <div className="relative bg-slate-900/50 backdrop-blur-xl rounded-3xl border border-slate-700/50 overflow-hidden shadow-2xl">
                <div className="p-8 border-b border-slate-700/50 flex justify-between items-center bg-gradient-to-r from-slate-900/80 to-slate-800/80">
                  <h3 className="text-2xl font-black text-white tracking-tight">Market Activity</h3>
                  <Link to="/investor/investments" className="group/link flex items-center gap-2 text-cyan-400 hover:text-cyan-300 text-sm font-bold transition-all">
                    <span>View All</span>
                    <ArrowUpRight className="h-4 w-4 group-hover/link:translate-x-1 transition-transform" />
                  </Link>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-slate-800/50 text-slate-300 text-xs font-bold uppercase tracking-widest">
                      <tr>
                        <th className="p-6 text-left">Asset</th>
                        <th className="p-6 text-left">Date</th>
                        <th className="p-6 text-left">Status</th>
                        <th className="p-6 text-right">Value</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-700/30">
                      {(dashboard?.recent_transactions || []).length > 0 ? (
                        dashboard.recent_transactions.map((tx, idx) => (
                          <motion.tr
                            key={tx.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className="group/row hover:bg-slate-800/30 transition-all duration-300"
                          >
                            <td className="p-6">
                              <span className="font-bold text-white group-hover/row:text-cyan-400 transition-colors uppercase tracking-wide">
                                {tx.project_title}
                              </span>
                            </td>
                            <td className="p-6 text-slate-400 font-medium">{new Date(tx.created_at).toLocaleDateString()}</td>
                            <td className="p-6">
                              <span className="px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider border bg-emerald-500/10 text-emerald-400 border-emerald-500/30 shadow-lg shadow-emerald-500/30 backdrop-blur-sm">
                                Success
                              </span>
                            </td>
                            <td className="p-6 text-right">
                              <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/30 rounded-xl">
                                <DollarSign className="h-4 w-4 text-emerald-400" />
                                <span className="font-black text-emerald-400 text-lg">
                                  {parseFloat(tx.amount).toLocaleString()}
                                </span>
                              </div>
                            </td>
                          </motion.tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="4" className="p-16 text-center">
                            <div className="flex flex-col items-center gap-4 opacity-20">
                              <Activity className="w-16 h-16 text-slate-500" />
                              <p className="text-xl font-bold uppercase tracking-widest">No Transactions</p>
                            </div>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>

            {/* Performance Summary / Growth Matrix */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 }} className="lg:col-span-1 space-y-6">
              <div className="bg-slate-900/80 backdrop-blur-xl p-8 rounded-3xl border border-slate-700/50 shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                  <TrendingUp className="w-24 h-24 text-cyan-400" />
                </div>
                <h3 className="text-2xl font-black text-white mb-6 uppercase tracking-tighter">Growth Matrix</h3>
                <div className="p-6 bg-gradient-to-br from-cyan-500/10 to-violet-500/10 rounded-2xl border border-cyan-500/20 mb-6">
                  <p className="text-cyan-400 text-xs font-black uppercase tracking-widest mb-1">Unrealized P&L</p>
                  <p className="text-4xl font-black text-white tracking-tighter">$ {parseFloat(portfolio?.profit_loss || 0).toLocaleString()}</p>
                  <div className="mt-4 flex items-center gap-4">
                    <div className="flex-1 h-2.5 bg-slate-800 rounded-full overflow-hidden shadow-inner">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${portfolio?.profit_loss_percentage || 0}%` }}
                        transition={{ duration: 1 }}
                        className="h-full bg-gradient-to-r from-cyan-500 to-violet-500 rounded-full shadow-lg shadow-cyan-500/50"
                      />
                    </div>
                    <span className="text-cyan-400 font-black text-sm">+{portfolio?.profit_loss_percentage || 0}%</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-slate-800/40 rounded-xl border border-slate-700/50">
                    <p className="text-slate-500 text-[10px] font-black uppercase mb-1 tracking-widest">Risk Profile</p>
                    <p className="text-sm font-black text-white">MODERATE</p>
                  </div>
                  <div className="p-4 bg-slate-800/40 rounded-xl border border-slate-700/50">
                    <p className="text-slate-500 text-[10px] font-black uppercase mb-1 tracking-widest">Liquidity</p>
                    <p className="text-sm font-black text-white">HIGH</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default InvestorDashboard;