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
  Zap
} from 'lucide-react';
import developerService from '../../api/developerService';

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
      const [dashRes, projectsRes] = await Promise.all([
        developerService.getDashboardSummary(),
        developerService.getMyProjects({ page_size: 5 })
      ]);

      const dashData = dashRes.data || dashRes;
      setDashboard(dashData);
      setProjects(projectsRes.results || []);
    } catch (err) {
      console.error("Failed to load dashboard:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
      <motion.div
        animate={{
          rotate: 360,
          scale: [1, 1.2, 1]
        }}
        transition={{
          rotate: { duration: 2, repeat: Infinity, ease: "linear" },
          scale: { duration: 1.5, repeat: Infinity, ease: "easeInOut" }
        }}
        className="relative"
      >
        <div className="w-16 h-16 border-4 border-cyan-500/30 border-t-cyan-400 rounded-full" />
        <div className="absolute inset-0 w-16 h-16 border-4 border-violet-500/20 border-b-violet-400 rounded-full animate-ping" />
      </motion.div>
    </div>
  );

  const stats = [
    {
      label: 'Total Projects',
      value: dashboard?.total_projects || 0,
      icon: FolderKanban,
      gradient: 'from-cyan-500 via-blue-500 to-indigo-600',
      glow: 'shadow-cyan-500/50'
    },
    {
      label: 'Investment Received',
      value: dashboard?.total_investment_received || 0,
      icon: DollarSign,
      gradient: 'from-emerald-500 via-teal-500 to-green-600',
      glow: 'shadow-emerald-500/50',
      isMoney: true
    },
    {
      label: 'Total Shares Sold',
      value: dashboard?.total_shares_sold || 0,
      icon: TrendingUp,
      gradient: 'from-violet-500 via-purple-500 to-fuchsia-600',
      glow: 'shadow-violet-500/50'
    },
    {
      label: 'Pending Projects',
      value: dashboard?.pending_projects || 0,
      icon: Clock,
      gradient: 'from-amber-500 via-orange-500 to-red-600',
      glow: 'shadow-amber-500/50'
    },
  ];

  const StatusBadge = ({ status }) => {
    const config = {
      APPROVED: {
        bg: 'bg-emerald-500/10',
        text: 'text-emerald-400',
        border: 'border-emerald-500/30',
        glow: 'shadow-emerald-500/30'
      },
      PENDING_REVIEW: {
        bg: 'bg-amber-500/10',
        text: 'text-amber-400',
        border: 'border-amber-500/30',
        glow: 'shadow-amber-500/30'
      },
      DRAFT: {
        bg: 'bg-slate-500/10',
        text: 'text-slate-400',
        border: 'border-slate-500/30',
        glow: 'shadow-slate-500/20'
      },
      REJECTED: {
        bg: 'bg-rose-500/10',
        text: 'text-rose-400',
        border: 'border-rose-500/30',
        glow: 'shadow-rose-500/30'
      }
    };

    const style = config[status] || config.DRAFT;

    return (
      <span className={`
        px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider
        border ${style.bg} ${style.text} ${style.border} ${style.glow} shadow-lg
        backdrop-blur-sm transition-all duration-300
      `}>
        {status?.replace(/_/g, ' ')}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white overflow-hidden relative">
      {/* Animated Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
            opacity: [0.03, 0.06, 0.03]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-1/2 -right-1/2 w-full h-full bg-gradient-to-br from-cyan-500/10 to-violet-500/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [90, 0, 90],
            opacity: [0.04, 0.08, 0.04]
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -bottom-1/2 -left-1/2 w-full h-full bg-gradient-to-tr from-violet-500/10 to-fuchsia-500/10 rounded-full blur-3xl"
        />
      </div>

      {/* Main Content */}
      <div className="relative z-10 p-4 md:p-8 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-8"
        >
          {/* Header Section */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex items-center gap-4 mb-3">
                <motion.div
                  animate={{
                    rotate: [0, 10, -10, 0],
                    scale: [1, 1.1, 1]
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="p-3 bg-gradient-to-br from-cyan-500 to-violet-600 rounded-2xl shadow-2xl shadow-cyan-500/30"
                >
                  <Sparkles className="w-8 h-8 text-white" />
                </motion.div>
                <h1 className="text-5xl font-black bg-gradient-to-r from-cyan-400 via-violet-400 to-fuchsia-400 bg-clip-text text-transparent tracking-tight">
                  Developer Dashboard
                </h1>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="flex items-center gap-4"
            >
              {dashboard?.unread_notifications > 0 && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="relative group"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl blur-lg opacity-50 group-hover:opacity-70 transition-opacity" />
                  <div className="relative px-5 py-3 bg-slate-900/90 backdrop-blur-xl rounded-xl border border-amber-500/30 flex items-center gap-3">
                    <motion.span
                      animate={{ scale: [1, 1.3, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="w-2.5 h-2.5 rounded-full bg-amber-400 shadow-lg shadow-amber-400/50"
                    />
                    <span className="text-sm font-bold text-amber-400">
                      {dashboard.unread_notifications} New Alerts
                    </span>
                  </div>
                </motion.div>
              )}

              <Link
                to="/developer/projects/create"
                className="group relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl blur-xl opacity-60 group-hover:opacity-100 transition-opacity" />
                <div className="relative flex items-center gap-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white px-6 py-3.5 rounded-xl transition-all font-bold shadow-2xl shadow-emerald-900/50 border border-emerald-400/20">
                  <Plus className="h-5 w-5 group-hover:rotate-180 transition-transform duration-500" />
                  <span>Launch Project</span>
                  <Zap className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
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
                transition={{
                  delay: index * 0.1,
                  duration: 0.5,
                  type: "spring",
                  stiffness: 100
                }}
                whileHover={{
                  scale: 1.05,
                  y: -5
                }}
                className="group relative"
              >
                {/* Glow Effect */}
                <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} rounded-2xl blur-xl opacity-0 group-hover:opacity-40 transition-opacity duration-500`} />

                {/* Card Content */}
                <div className="relative h-full bg-slate-900/80 backdrop-blur-xl rounded-2xl border border-slate-700/50 group-hover:border-slate-600 p-6 transition-all duration-300 shadow-xl">
                  {/* Icon Container */}
                  <motion.div
                    whileHover={{ rotate: [0, -10, 10, 0] }}
                    transition={{ duration: 0.5 }}
                    className={`p-4 rounded-xl bg-gradient-to-br ${stat.gradient} w-fit mb-4 shadow-lg ${stat.glow}`}
                  >
                    <stat.icon className="h-7 w-7 text-white" strokeWidth={2.5} />
                  </motion.div>

                  {/* Label */}
                  <p className="text-slate-400 text-sm font-semibold mb-2 uppercase tracking-wider">
                    {stat.label}
                  </p>

                  {/* Value */}
                  <div className="flex items-baseline gap-2">
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-4xl font-black text-white"
                    >
                      {stat.isMoney ? `$${parseFloat(stat.value).toLocaleString()}` : stat.value}
                    </motion.span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Projects Table */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="relative group"
          >
            {/* Glow Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-violet-500/10 rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

            {/* Table Container */}
            <div className="relative bg-slate-900/50 backdrop-blur-xl rounded-3xl border border-slate-700/50 overflow-hidden shadow-2xl">
              {/* Header */}
              <div className="p-8 border-b border-slate-700/50 flex justify-between items-center bg-gradient-to-r from-slate-900/80 to-slate-800/80">
                <h3 className="text-2xl font-black text-white tracking-tight">
                  Project Overview
                </h3>
                <Link
                  to="/developer/projects"
                  className="group/link flex items-center gap-2 text-cyan-400 hover:text-cyan-300 text-sm font-bold transition-all"
                >
                  <span>View All</span>
                  <ArrowRight className="h-4 w-4 group-hover/link:translate-x-1 transition-transform" />
                </Link>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-800/50 text-slate-300 text-xs font-bold uppercase tracking-widest">
                    <tr>
                      <th className="p-6 text-left">Project Name</th>
                      <th className="p-6 text-left">Status</th>
                      <th className="p-6 text-left">Equity Progress</th>
                      <th className="p-6 text-right">Capital Raised</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700/30">
                    {projects.length > 0 ? projects.map((project, idx) => {
                      const progress = (project.shares_sold / project.total_shares) * 100;
                      const raised = (project.shares_sold || 0) * (project.share_price || 0);

                      return (
                        <motion.tr
                          key={project.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.1 }}
                          className="group/row hover:bg-slate-800/30 transition-all duration-300"
                        >
                          {/* Project Name */}
                          <td className="p-6">
                            <span className="font-bold text-white group-hover/row:text-cyan-400 transition-colors uppercase tracking-wide">
                              {project.title}
                            </span>
                          </td>

                          {/* Status */}
                          <td className="p-6">
                            <StatusBadge status={project.status} />
                          </td>

                          {/* Progress Bar */}
                          <td className="p-6">
                            <div className="flex items-center gap-4">
                              <div className="flex-1 h-2.5 bg-slate-800 rounded-full overflow-hidden shadow-inner">
                                <motion.div
                                  initial={{ width: 0 }}
                                  animate={{ width: `${progress}%` }}
                                  transition={{ duration: 1, delay: idx * 0.1 }}
                                  className="h-full bg-gradient-to-r from-cyan-500 to-violet-500 rounded-full shadow-lg shadow-cyan-500/50"
                                />
                              </div>
                              <span className="text-sm font-bold text-slate-300 min-w-[50px] text-right">
                                {Math.round(progress)}%
                              </span>
                            </div>
                          </td>

                          {/* Capital Raised */}
                          <td className="p-6 text-right">
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/30 rounded-xl">
                              <DollarSign className="h-4 w-4 text-emerald-400" />
                              <span className="font-black text-emerald-400 text-lg">
                                {raised.toLocaleString()}
                              </span>
                            </div>
                          </td>
                        </motion.tr>
                      );
                    }) : (
                      <tr>
                        <td colSpan="4" className="p-16 text-center">
                          <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="flex flex-col items-center gap-6"
                          >
                            <div className="p-6 bg-slate-800/50 rounded-full">
                              <FolderKanban className="w-16 h-16 text-slate-600" />
                            </div>
                            <p className="text-xl font-semibold text-slate-400">
                              No projects yet. Launch your first project to get started.
                            </p>
                            <Link
                              to="/developer/projects/create"
                              className="group/cta flex items-center gap-2 bg-gradient-to-r from-cyan-600 to-violet-600 hover:from-cyan-500 hover:to-violet-500 text-white px-6 py-3 rounded-xl transition-all font-bold shadow-xl shadow-cyan-900/30"
                            >
                              <Plus className="h-5 w-5 group-hover/cta:rotate-90 transition-transform" />
                              Create First Project
                            </Link>
                          </motion.div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default DeveloperDashboard;