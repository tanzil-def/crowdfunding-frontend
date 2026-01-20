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

export default function DeveloperDashboard() {
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

      // Handle potential { success: true, data: { ... } } wrapper for dashboard
      const dashData = dashRes.data || dashRes;
      setDashboard(dashData);

      // Projects usually are paginated directly
      setProjects(projectsRes.results || []);
    } catch (err) {
      console.error("Failed to load dashboard:", err);
      // toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const approvedProjectsCount = dashboard?.total_approved || 0;
  const pendingProjectsCount = dashboard?.total_pending || 0;
  const draftProjectsCount = dashboard?.total_drafts || 0;

  if (loading) return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <div className="w-16 h-16 border-4 border-emerald-500/10 border-t-emerald-500 rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="space-y-6 p-4 md:p-8 bg-slate-950 min-h-screen text-slate-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
            Developer Dashboard
          </h1>
          <p className="text-slate-400 mt-1">Manage your projects and track performance</p>
        </div>
        <Link
          to="/developer/projects/create"
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg transition-all font-medium"
        >
          <Plus className="h-4 w-4" />
          Create Project
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: 'Total Projects',
            value: dashboard?.total_projects || 0,
            icon: FolderKanban,
            color: 'text-blue-400'
          },
          {
            label: 'Funds Secured',
            value: dashboard?.total_funds_raised || 0,
            icon: DollarSign,
            color: 'text-emerald-400',
            isMoney: true
          },
          {
            label: 'Total Investors',
            value: dashboard?.total_investors || 0,
            icon: Users,
            color: 'text-purple-400'
          },
          {
            label: 'Growth',
            value: '+12%', // Mock growth for now if not in API
            icon: TrendingUp,
            color: 'text-amber-400'
          },
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-slate-900 border border-slate-800 p-6 rounded-2xl"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-slate-400">{stat.label}</p>
                <div className="text-2xl font-bold mt-1 text-white">
                  {stat.isMoney ? <LocalMoney amount={stat.value} /> : stat.value}
                </div>
              </div>
              <div className={`p-3 bg-slate-800 rounded-xl ${stat.color}`}>
                <stat.icon className="h-6 w-6" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Quick Status Info */}
      <div className="grid md:grid-cols-3 gap-4">
        <div className="bg-slate-900 border-l-4 border-amber-500 p-4 rounded-xl flex items-center gap-4">
          <Clock className="text-amber-500 h-6 w-6" />
          <div>
            <p className="text-xl font-bold text-white">{pendingProjectsCount}</p>
            <p className="text-xs text-slate-400 uppercase tracking-wider">Pending Review</p>
          </div>
        </div>
        <div className="bg-slate-900 border-l-4 border-emerald-500 p-4 rounded-xl flex items-center gap-4">
          <CheckCircle className="text-emerald-500 h-6 w-6" />
          <div>
            <p className="text-xl font-bold text-white">{approvedProjectsCount}</p>
            <p className="text-xs text-slate-400 uppercase tracking-wider">Live Projects</p>
          </div>
        </div>
        <div className="bg-slate-900 border-l-4 border-slate-500 p-4 rounded-xl flex items-center gap-4">
          <FileEdit className="text-slate-500 h-6 w-6" />
          <div>
            <p className="text-xl font-bold text-white">{draftProjectsCount}</p>
            <p className="text-xs text-slate-400 uppercase tracking-wider">Drafts</p>
          </div>
        </div>
      </div>

      {/* Charts Section - Using Mock data for charts as transient history might not be in basic dashboard API yet */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
          <h3 className="text-lg font-bold mb-6 text-white">Funds Secured Over Time</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dashboard?.funding_history || []}>
                <defs>
                  <linearGradient id="colorFunds" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
                <YAxis stroke="#64748b" fontSize={12} tickFormatter={(v) => `$${v / 1000}k`} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b' }} />
                <Area type="monotone" dataKey="funds" stroke="#10b981" fill="url(#colorFunds)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
          <h3 className="text-lg font-bold mb-6 text-white">Shares Distribution</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={projects.slice(0, 5)} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" horizontal={false} />
                <XAxis type="number" stroke="#64748b" fontSize={12} />
                <YAxis dataKey="title" type="category" stroke="#64748b" fontSize={10} width={80} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b' }} />
                <Bar dataKey="shares_sold" fill="#10b981" radius={[0, 4, 4, 0]} name="Sold" />
                <Bar dataKey="remaining_shares" fill="#334155" radius={[0, 4, 4, 0]} name="Remaining" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Projects Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
        <div className="p-6 border-b border-slate-800 flex justify-between items-center">
          <h3 className="font-bold text-white">Recent Project Activities</h3>
          <Link to="/developer/projects" className="text-emerald-400 text-sm hover:underline flex items-center gap-1">
            View All Projects <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-800/50 text-slate-400 text-xs uppercase">
              <tr>
                <th className="p-4 font-semibold">Project Title</th>
                <th className="p-4 font-semibold">Status</th>
                <th className="p-4 font-semibold">Shares Sold</th>
                <th className="p-4 font-semibold">Funds</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {projects.length > 0 ? projects.map((project) => (
                <tr key={project.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="p-4 font-medium text-white">{project.title}</td>
                  <td className="p-4">
                    <LocalStatusBadge status={project.status} />
                  </td>
                  <td className="p-4 text-slate-300">
                    {project.shares_sold?.toLocaleString()} / {project.total_shares?.toLocaleString()}
                  </td>
                  <td className="p-4 text-emerald-400">
                    <LocalMoney amount={(project.shares_sold || 0) * (project.share_price || 0)} />
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="4" className="p-8 text-center text-slate-500">
                    No projects found. Create your first project!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}