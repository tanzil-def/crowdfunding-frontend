import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import {
  FolderKanban,
  DollarSign,
  Users,
  TrendingUp,
  Plus,
  ArrowRight,
  Clock,
  CheckCircle,
  FileEdit,
  LayoutDashboard
} from 'lucide-react';
import developerService from '../../api/developerService';
import { toast } from 'react-hot-toast';

const LocalMoney = ({ amount }) => (
  <span className="font-semibold">${amount?.toLocaleString()}</span>
);

const LocalStatusBadge = ({ status }) => {
  const styles = {
    APPROVED: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    PENDING_REVIEW: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    DRAFT: "bg-slate-500/10 text-slate-400 border-slate-500/20",
    REJECTED: "bg-red-500/10 text-red-400 border-red-500/20"
  };
  return (
    <span className={`px-2 py-1 rounded-full text-xs border ${styles[status] || styles.DRAFT}`}>
      {status}
    </span>
  );
};

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
    <div className="min-h-screen bg-[#020617] flex items-center justify-center">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full"
      />
    </div>
  );

  const stats = [
    {
      label: 'Total Projects',
      value: dashboard?.total_projects || 0,
      icon: FolderKanban,
      color: 'from-blue-500 to-indigo-500',
      change: projects.length > 0 ? '+1' : '0'
    },
    {
      label: 'Investment Received',
      value: dashboard?.total_investment_received || 0,
      icon: DollarSign,
      color: 'from-emerald-500 to-teal-500',
      isMoney: true,
      change: '+15%'
    },
    {
      label: 'Total Shares Sold',
      value: dashboard?.total_shares_sold || 0,
      icon: TrendingUp,
      color: 'from-purple-500 to-pink-500',
      change: '+22%'
    },
    {
      label: 'Pending Projects',
      value: dashboard?.pending_projects || 0,
      icon: Clock,
      color: 'from-amber-500 to-orange-500'
    },
  ];

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 p-4 md:p-8">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto space-y-8"
      >
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Developer Studio</h1>
            <p className="text-slate-400">Track project fundraising and manage equity</p>
          </div>
          <div className="flex items-center gap-3">
            {dashboard?.unread_notifications > 0 && (
              <div className="glass-morphism px-4 py-2 rounded-xl border-amber-500/20 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
                <span className="text-sm font-medium text-amber-500">{dashboard.unread_notifications} New Alerts</span>
              </div>
            )}
            <Link
              to="/developer/projects/create"
              className="group flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-3 rounded-xl transition-all font-semibold shadow-lg shadow-emerald-900/20"
            >
              <Plus className="h-5 w-5 group-hover:rotate-90 transition-transform" />
              Launch New Project
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="glass-morphism p-6 group hover:border-emerald-500/30 transition-all"
            >
              <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.color} w-fit mb-4`}>
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

        {/* Projects Preview */}
        <div className="glass-morphism rounded-2xl overflow-hidden">
          <div className="p-6 border-b border-white/5 flex justify-between items-center">
            <h3 className="text-xl font-bold text-white">Strategic Overview</h3>
            <Link to="/developer/projects" className="text-emerald-400 hover:text-emerald-300 text-sm font-semibold flex items-center gap-1 transition-colors">
              View All Projects <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-white/5 text-slate-400 text-xs uppercase tracking-wider">
                <tr>
                  <th className="p-6 font-semibold">Project</th>
                  <th className="p-6 font-semibold">Status</th>
                  <th className="p-6 font-semibold">Equity Progress</th>
                  <th className="p-6 font-semibold">Capital Raised</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {projects.length > 0 ? projects.map((project) => (
                  <tr key={project.id} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="p-6 font-medium text-white group-hover:text-emerald-400 transition-colors uppercase tracking-tight">{project.title}</td>
                    <td className="p-6">
                      <LocalStatusBadge status={project.status} />
                    </td>
                    <td className="p-6">
                      <div className="flex items-center gap-3 max-w-[200px]">
                        <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-emerald-500 rounded-full"
                            style={{ width: `${(project.shares_sold / project.total_shares) * 100}%` }}
                          />
                        </div>
                        <span className="text-xs text-slate-400 min-w-[40px] font-medium">
                          {Math.round((project.shares_sold / project.total_shares) * 100)}%
                        </span>
                      </div>
                    </td>
                    <td className="p-6 text-emerald-400 font-bold bg-emerald-400/5">$ {((project.shares_sold || 0) * (project.share_price || 0)).toLocaleString()}</td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="4" className="p-12 text-center text-slate-500">
                      <div className="flex flex-col items-center gap-4">
                        <FolderKanban className="w-12 h-12 opacity-20" />
                        <p className="text-lg">Initiate your first project to start tracking equity.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default DeveloperDashboard;