import React, { useEffect, useState } from "react";
import investorService from "../../api/investorService";
import { motion } from "framer-motion";
import {
  Briefcase,
  TrendingUp,
  PieChart as PieIcon,
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  Shield,
  Zap,
  Layers,
  Award
} from "lucide-react";
import { Link } from "react-router-dom";

const Portfolio = () => {
  const [portfolio, setPortfolio] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPortfolio();
  }, []);

  const fetchPortfolio = async () => {
    try {
      setLoading(true);
      const data = await investorService.getPortfolioSummary();
      setPortfolio(data);
    } catch (err) {
      console.error("Failed to load portfolio:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center">
      <motion.div
        animate={{ rotate: 360, scale: [1, 1.2, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="w-16 h-16 border-4 border-cyan-500/30 border-t-cyan-400 rounded-full"
      />
    </div>
  );

  const highlights = [
    {
      label: "Total Invested",
      value: portfolio?.total_invested || 0,
      icon: Wallet,
      color: "text-cyan-400",
      bg: "bg-cyan-500/10",
      isMoney: true
    },
    {
      label: "Project Count",
      value: portfolio?.projects_invested || 0,
      icon: Briefcase,
      color: "text-violet-400",
      bg: "bg-violet-500/10",
    },
    {
      label: "Shares Owned",
      value: portfolio?.total_shares_owned || 0,
      icon: Layers,
      color: "text-emerald-400",
      bg: "bg-emerald-500/10",
    },
    {
      label: "Investment Count",
      value: portfolio?.investment_count || 0,
      icon: Activity,
      color: "text-amber-400",
      bg: "bg-amber-500/10",
    }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white relative overflow-hidden">
      {/* Dynamic Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-violet-600/10 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2" />
      </div>

      <div className="relative z-10 p-4 md:p-8 max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-4 mb-4"
          >
            <div className="p-3 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl shadow-xl shadow-cyan-500/20">
              <PieIcon className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
                Investor Portfolio
              </h1>
              <p className="text-slate-400 font-bold uppercase tracking-widest text-xs mt-1">Real-time Financial Overview</p>
            </div>
          </motion.div>
        </div>

        {/* Global Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {highlights.map((item, idx) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ y: -5 }}
              className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 group hover:border-slate-700 transition-all duration-300"
            >
              <div className={`w-12 h-12 ${item.bg} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <item.icon className={`w-6 h-6 ${item.color}`} />
              </div>
              <p className="text-slate-500 text-xs font-black uppercase tracking-widest mb-1">{item.label}</p>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black">
                  {item.isMoney ? `$${parseFloat(item.value).toLocaleString()}` : item.value}
                </span>
                {idx === 0 && <ArrowUpRight className="w-4 h-4 text-emerald-400" />}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Portfolio Analysis Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Performance Chart Area (Simulated) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="lg:col-span-2 bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-[2.5rem] p-8 relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 p-8 opacity-5">
              <Activity className="w-32 h-32" />
            </div>

            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center gap-3">
                <div className="w-1 h-8 bg-cyan-500 rounded-full" />
                <h3 className="text-xl font-black uppercase tracking-tight">Performance Analytics</h3>
              </div>
              <div className="flex gap-2">
                {['1W', '1M', '3M', '1Y', 'ALL'].map(t => (
                  <button key={t} className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${t === '1M' ? 'bg-cyan-500 text-white' : 'bg-slate-800/50 text-slate-400 hover:bg-slate-800'}`}>
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Simulated Chart Placeholder */}
            <div className="h-64 relative flex items-end gap-2 px-4 mb-4">
              {[40, 60, 45, 75, 55, 90, 85, 95, 80, 100].map((h, i) => (
                <motion.div
                  key={i}
                  initial={{ height: 0 }}
                  animate={{ height: `${h}%` }}
                  transition={{ delay: i * 0.05, duration: 1 }}
                  className="flex-1 bg-gradient-to-t from-cyan-500/20 to-cyan-500/60 rounded-t-lg group-hover:from-cyan-500/40 transition-all"
                />
              ))}
            </div>
            <div className="grid grid-cols-5 text-center text-[10px] font-black text-slate-600 uppercase tracking-widest">
              <span>JAN</span>
              <span>FEB</span>
              <span>MAR</span>
              <span>APR</span>
              <span>MAY</span>
            </div>
          </motion.div>

          {/* Quick Stats & Badges */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-gradient-to-br from-violet-600/20 to-fuchsia-600/20 border border-violet-500/20 rounded-3xl p-8 backdrop-blur-xl relative overflow-hidden group"
            >
              <div className="absolute bottom-0 right-0 p-4 opacity-10 group-hover:scale-125 transition-transform duration-500">
                <Shield className="w-24 h-24" />
              </div>
              <h4 className="text-sm font-black uppercase tracking-widest text-violet-400 mb-6 flex items-center gap-2">
                <Shield className="w-4 h-4" />
                Security Profile
              </h4>
              <div className="space-y-4">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-400 font-bold uppercase tracking-tighter">Diversification</span>
                  <span className="text-white font-black">EXCELLENT</span>
                </div>
                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <motion.div animate={{ width: "85%" }} className="h-full bg-violet-500 shadow-[0_0_15px_rgba(139,92,246,0.5)]" />
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-400 font-bold uppercase tracking-tighter">Risk Score</span>
                  <span className="text-white font-black">LOW (3.2/10)</span>
                </div>
                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <motion.div animate={{ width: "32%" }} className="h-full bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)]" />
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 group overflow-hidden relative"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-amber-500/10 rounded-2xl group-hover:bg-amber-500/20 transition-colors">
                  <Award className="w-6 h-6 text-amber-500" />
                </div>
                <div>
                  <h4 className="font-black text-white uppercase tracking-tight">Investor Level</h4>
                  <p className="text-amber-500 text-[10px] font-bold uppercase tracking-widest">TIER: ELITE PARTNER</p>
                </div>
              </div>
              <Link to="/investor/browse" className="flex items-center justify-between group/btn bg-slate-800 hover:bg-slate-700 p-4 rounded-2xl transition-all">
                <span className="text-xs font-black uppercase text-slate-300">New Opportunities</span>
                <Zap className="w-4 h-4 text-cyan-400 group-hover/btn:animate-pulse" />
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Portfolio;
