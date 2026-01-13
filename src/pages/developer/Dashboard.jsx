import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  BarChart, Bar, PieChart, Pie, Cell, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  LineChart, Line
} from 'recharts';
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
  LayoutDashboard,
  Sparkles,
  Target,
  BarChart3,
  Eye,
  Calendar,
  Share2,
  Wallet,
  TrendingDown,
  MoreVertical,
  Bell,
  Settings,
  RefreshCw,
  Download,
  Filter,
  ChevronRight,
  PieChart as PieChartIcon,
  Activity,
  Zap
} from 'lucide-react';
import { useSelector } from 'react-redux';

export default function DeveloperDashboard() {
  const { user } = useSelector((state) => state.auth || {});
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedProject, setSelectedProject] = useState(null);

  // Mock Data with more realistic values
  const projects = [
    { 
      id: 1, 
      title: "Smart City AI Platform", 
      category: "AI/ML",
      status: "APPROVED", 
      sharesSold: 4500, 
      totalShares: 10000, 
      perSharePrice: 50, 
      remainingShares: 5500,
      fundsRaised: 225000,
      target: 500000,
      investors: 42,
      progress: 45,
      duration: "6 months",
      startDate: "2025-01-15",
      color: "#10B981",
      roi: "18.5%"
    },
    { 
      id: 2, 
      title: "Green Energy Hub", 
      category: "Renewable Energy",
      status: "PENDING_REVIEW", 
      sharesSold: 0, 
      totalShares: 5000, 
      perSharePrice: 100, 
      remainingShares: 5000,
      fundsRaised: 0,
      target: 500000,
      investors: 0,
      progress: 0,
      duration: "8 months",
      startDate: "2025-03-01",
      color: "#F59E0B",
      roi: "22%"
    },
    { 
      id: 3, 
      title: "HealthTech AI Assistant", 
      category: "Healthcare",
      status: "APPROVED", 
      sharesSold: 8000, 
      totalShares: 8000, 
      perSharePrice: 25, 
      remainingShares: 0,
      fundsRaised: 200000,
      target: 200000,
      investors: 65,
      progress: 100,
      duration: "4 months",
      startDate: "2024-11-01",
      color: "#8B5CF6",
      roi: "15.3%"
    },
    { 
      id: 4, 
      title: "Blockchain Payment Gateway", 
      category: "Fintech",
      status: "APPROVED", 
      sharesSold: 3200, 
      totalShares: 7500, 
      perSharePrice: 60, 
      remainingShares: 4300,
      fundsRaised: 192000,
      target: 450000,
      investors: 28,
      progress: 43,
      duration: "9 months",
      startDate: "2025-02-10",
      color: "#3B82F6",
      roi: "25%"
    },
  ];

  // Detailed funding data for chart
  const fundingData = [
    { month: 'Jan', funds: 45000, investors: 12, projects: 2 },
    { month: 'Feb', funds: 52000, investors: 18, projects: 3 },
    { month: 'Mar', funds: 48000, investors: 15, projects: 2 },
    { month: 'Apr', funds: 61000, investors: 22, projects: 3 },
    { month: 'May', funds: 55000, investors: 20, projects: 3 },
    { month: 'Jun', funds: 67000, investors: 25, projects: 4 },
    { month: 'Jul', funds: 72000, investors: 28, projects: 4 },
    { month: 'Aug', funds: 68000, investors: 26, projects: 4 },
  ];

  // Performance metrics for radar chart
  const performanceData = [
    { metric: 'Funding Speed', value: 85 },
    { metric: 'Investor Growth', value: 90 },
    { metric: 'ROI', value: 78 },
    { metric: 'Market Fit', value: 92 },
    { metric: 'Team Strength', value: 80 },
    { metric: 'Tech Innovation', value: 88 },
  ];

  // Category distribution for pie chart
  const categoryData = [
    { name: 'AI/ML', value: 35, color: '#10B981' },
    { name: 'Healthcare', value: 25, color: '#8B5CF6' },
    { name: 'Fintech', value: 20, color: '#3B82F6' },
    { name: 'Energy', value: 15, color: '#F59E0B' },
    { name: 'Other', value: 5, color: '#6B7280' },
  ];

  // Recent activities
  const activities = [
    { id: 1, type: 'investment', message: 'New investment of $5,000 in Smart City AI', time: '2 hours ago', user: 'Alex Chen' },
    { id: 2, type: 'project', message: 'Project "Green Energy Hub" submitted for review', time: '5 hours ago', user: 'You' },
    { id: 3, type: 'milestone', message: 'HealthTech AI reached 100% funding milestone', time: '1 day ago', user: 'System' },
    { id: 4, type: 'investor', message: '15 new investors joined this week', time: '2 days ago', user: 'System' },
  ];

  const stats = [
    { label: 'Total Projects', value: projects.length, change: '+12%', icon: FolderKanban, color: 'text-blue-400', bg: 'bg-gradient-to-br from-blue-500/20 to-cyan-500/10' },
    { label: 'Funds Secured', value: '$617,000', change: '+24%', icon: DollarSign, color: 'text-emerald-400', bg: 'bg-gradient-to-br from-emerald-500/20 to-teal-500/10' },
    { label: 'Total Investors', value: '135', change: '+18%', icon: Users, color: 'text-purple-400', bg: 'bg-gradient-to-br from-purple-500/20 to-pink-500/10' },
    { label: 'Avg. ROI', value: '20.2%', change: '+3.2%', icon: TrendingUp, color: 'text-amber-400', bg: 'bg-gradient-to-br from-amber-500/20 to-orange-500/10' },
  ];

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  const getStatusIcon = (status) => {
    switch(status) {
      case 'APPROVED': return <CheckCircle className="w-4 h-4" />;
      case 'PENDING_REVIEW': return <Clock className="w-4 h-4" />;
      case 'DRAFT': return <FileEdit className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'APPROVED': return { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/30' };
      case 'PENDING_REVIEW': return { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/30' };
      case 'DRAFT': return { bg: 'bg-slate-500/10', text: 'text-slate-400', border: 'border-slate-500/30' };
      default: return { bg: 'bg-slate-500/10', text: 'text-slate-400', border: 'border-slate-500/30' };
    }
  };

  const filteredProjects = activeFilter === 'all' 
    ? projects 
    : projects.filter(p => p.status === activeFilter);

  if (loading) return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-emerald-500/10 rounded-full animate-spin"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full animate-pulse"></div>
        </div>
        <div className="absolute -inset-4">
          <div className="w-full h-full border-4 border-emerald-500/5 rounded-full animate-ping"></div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-8 pb-10 px-2">
      {/* Header with Gradient Background */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950/50 p-8 border border-slate-800">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl -translate-y-32 translate-x-32"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-500/5 rounded-full blur-3xl translate-y-24 -translate-x-24"></div>
        
        <div className="relative flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-white/10 backdrop-blur-sm rounded-xl">
                <LayoutDashboard className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-emerald-100 to-cyan-100 bg-clip-text text-transparent">
                Developer Dashboard
              </h1>
            </div>
            <p className="text-slate-300 text-lg mb-6">
              Welcome back, <span className="font-bold text-white">{user?.name || 'Developer'}</span>! Track your projects, analyze performance, and manage investments.
            </p>
            <div className="flex flex-wrap gap-3">
              <span className="px-4 py-2 bg-white/5 backdrop-blur-sm rounded-full text-sm text-slate-300 border border-white/10">
                {projects.length} Active Projects
              </span>
              <span className="px-4 py-2 bg-white/5 backdrop-blur-sm rounded-full text-sm text-slate-300 border border-white/10">
                135 Total Investors
              </span>
              <span className="px-4 py-2 bg-white/5 backdrop-blur-sm rounded-full text-sm text-slate-300 border border-white/10">
                $617K Secured
              </span>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <Link to="/developer/projects/new">
              <button className="group relative px-6 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl font-bold transition-all duration-300 hover:shadow-2xl hover:shadow-emerald-500/30 hover:scale-105 flex items-center gap-3">
                <div className="relative">
                  <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
                  <div className="absolute inset-0 bg-white/20 rounded-full animate-ping"></div>
                </div>
                <span>Create Project</span>
              </button>
            </Link>
            <button className="px-6 py-4 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white rounded-xl font-medium transition-all border border-white/20 flex items-center gap-3">
              <RefreshCw className="w-5 h-5" />
              Refresh Data
            </button>
          </div>
        </div>
      </div>

      {/* Stats Grid with Animations */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.3 }}
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
            className="group relative overflow-hidden bg-gradient-to-br from-slate-900 to-slate-800 p-6 rounded-2xl border border-slate-800 hover:border-emerald-500/30 transition-all duration-300"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            
            <div className="relative flex items-start justify-between">
              <div>
                <p className="text-sm text-slate-400 font-medium mb-2">{stat.label}</p>
                <div className="flex items-baseline gap-2">
                  <h3 className="text-3xl font-bold text-white">{stat.value}</h3>
                  <span className="text-sm font-medium text-emerald-400 flex items-center gap-1">
                    <TrendingUp className="w-4 h-4" />
                    {stat.change}
                  </span>
                </div>
              </div>
              <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
                <stat.icon className="w-6 h-6" />
              </div>
            </div>
            
            <div className="relative mt-4">
              <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-gradient-to-r from-emerald-500 to-teal-500"
                  initial={{ width: 0 }}
                  animate={{ width: '70%' }}
                  transition={{ delay: index * 0.1 + 0.2, duration: 0.8 }}
                />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Funding Trend Chart */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="relative overflow-hidden bg-gradient-to-br from-slate-900 to-slate-800 p-6 rounded-2xl border border-slate-800"
        >
          <div className="absolute top-4 right-4 flex gap-2">
            <button className="p-2 hover:bg-white/5 rounded-lg transition-colors">
              <Download className="w-4 h-4 text-slate-400" />
            </button>
            <button className="p-2 hover:bg-white/5 rounded-lg transition-colors">
              <MoreVertical className="w-4 h-4 text-slate-400" />
            </button>
          </div>
          
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Activity className="w-5 h-5 text-emerald-400" />
                Funding Trend
              </h3>
              <p className="text-sm text-slate-400">Monthly funds secured overview</p>
            </div>
            <div className="flex gap-2">
              <button className="px-3 py-1 text-xs bg-emerald-500/10 text-emerald-400 rounded-lg">
                This Year
              </button>
              <button className="px-3 py-1 text-xs bg-white/5 text-slate-400 hover:text-white rounded-lg">
                Compare
              </button>
            </div>
          </div>
          
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={fundingData}>
                <defs>
                  <linearGradient id="colorFunds" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0.1} />
                  </linearGradient>
                  <linearGradient id="colorInvestors" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                <XAxis 
                  dataKey="month" 
                  stroke="#64748b" 
                  fontSize={11} 
                  tickLine={false} 
                  axisLine={false} 
                />
                <YAxis 
                  stroke="#64748b" 
                  fontSize={11} 
                  tickLine={false} 
                  axisLine={false}
                  tickFormatter={(value) => `$${value / 1000}k`}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(15, 23, 42, 0.95)', 
                    backdropFilter: 'blur(10px)',
                    border: '1px solid #1e293b', 
                    borderRadius: '10px',
                    padding: '12px',
                    boxShadow: '0 10px 40px rgba(0,0,0,0.3)'
                  }}
                  formatter={(value) => [`$${value.toLocaleString()}`, 'Funds']}
                  labelStyle={{ color: '#94a3b8', fontSize: '12px' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="funds" 
                  stroke="#10B981" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorFunds)" 
                  dot={{ stroke: '#10B981', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, strokeWidth: 0 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="investors" 
                  stroke="#8B5CF6" 
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          
          <div className="flex items-center justify-between mt-4 text-sm">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                <span className="text-slate-300">Funds Secured</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                <span className="text-slate-300">Investor Count</span>
              </div>
            </div>
            <span className="text-emerald-400 text-sm font-medium">
              +24% vs last period
            </span>
          </div>
        </motion.div>

        {/* Project Performance Radar */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="relative overflow-hidden bg-gradient-to-br from-slate-900 to-slate-800 p-6 rounded-2xl border border-slate-800"
        >
          <div className="absolute top-4 right-4">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" />
            </div>
          </div>
          
          <div className="mb-6">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Target className="w-5 h-5 text-amber-400" />
              Performance Metrics
            </h3>
            <p className="text-sm text-slate-400">Your project performance across key areas</p>
          </div>
          
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={performanceData}>
                <PolarGrid stroke="#334155" />
                <PolarAngleAxis 
                  dataKey="metric" 
                  stroke="#64748b" 
                  fontSize={11}
                  tickLine={false}
                />
                <PolarRadiusAxis 
                  angle={30} 
                  domain={[0, 100]} 
                  stroke="#334155"
                  tick={false}
                />
                <Radar
                  name="Performance"
                  dataKey="value"
                  stroke="#3B82F6"
                  fill="#3B82F6"
                  fillOpacity={0.4}
                  strokeWidth={2}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(15, 23, 42, 0.95)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid #1e293b', 
                    borderRadius: '10px',
                    padding: '12px'
                  }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div className="p-3 bg-slate-800/30 rounded-lg">
              <div className="text-xs text-slate-400 mb-1">Avg. Score</div>
              <div className="text-xl font-bold text-white">85.5</div>
            </div>
            <div className="p-3 bg-slate-800/30 rounded-lg">
              <div className="text-xs text-slate-400 mb-1">Improvement</div>
              <div className="text-xl font-bold text-emerald-400">+12.4%</div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Projects Table & Categories */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Projects Table */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-2 overflow-hidden bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl border border-slate-800"
        >
          <div className="p-6 border-b border-slate-800 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <FolderKanban className="w-5 h-5 text-blue-400" />
                My Projects
              </h3>
              <p className="text-sm text-slate-400">Manage and track all your projects</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex bg-slate-800/50 rounded-lg p-1">
                {['all', 'APPROVED', 'PENDING_REVIEW', 'DRAFT'].map(filter => {
                  const color = getStatusColor(filter === 'all' ? 'APPROVED' : filter);
                  return (
                    <button
                      key={filter}
                      onClick={() => setActiveFilter(filter === 'all' ? 'all' : filter)}
                      className={`px-3 py-1 text-xs rounded-md transition-all ${
                        activeFilter === filter 
                          ? `${color.bg} ${color.text} font-medium` 
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {filter === 'all' ? 'All' : filter.replace('_', ' ')}
                    </button>
                  );
                })}
              </div>
              <button className="p-2 hover:bg-white/5 rounded-lg transition-colors">
                <Filter className="w-4 h-4 text-slate-400" />
              </button>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-800">
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Project
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Progress
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Funds
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {filteredProjects.map((project) => {
                  const statusColors = getStatusColor(project.status);
                  return (
                    <motion.tr 
                      key={project.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      whileHover={{ backgroundColor: 'rgba(30, 41, 59, 0.5)' }}
                      className="group cursor-pointer transition-all"
                      onClick={() => setSelectedProject(project)}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div 
                            className="w-10 h-10 rounded-lg"
                            style={{ background: project.color }}
                          ></div>
                          <div>
                            <div className="font-semibold text-white group-hover:text-emerald-300">
                              {project.title}
                            </div>
                            <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
                              <Calendar className="w-3 h-3" />
                              {project.duration} • 
                              <span className="px-2 py-0.5 bg-white/5 rounded text-[10px]">
                                {project.category}
                              </span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${statusColors.bg} ${statusColors.text} border ${statusColors.border}`}>
                          {getStatusIcon(project.status)}
                          {project.status.replace('_', ' ')}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="w-48">
                          <div className="flex justify-between text-xs mb-1">
                            <span className="text-slate-300">{project.progress}%</span>
                            <span className="font-medium">
                              {project.sharesSold.toLocaleString()}/{project.totalShares.toLocaleString()} shares
                            </span>
                          </div>
                          <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                            <motion.div 
                              className="h-full rounded-full"
                              style={{ background: project.color }}
                              initial={{ width: 0 }}
                              animate={{ width: `${project.progress}%` }}
                              transition={{ duration: 1, delay: 0.5 }}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <div className="font-bold text-white">
                            ${project.fundsRaised.toLocaleString()}
                          </div>
                          <div className="text-xs text-slate-400">
                            of ${project.target.toLocaleString()}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button className="p-1.5 hover:bg-white/5 rounded-lg transition-colors">
                            <Eye className="w-4 h-4 text-slate-400" />
                          </button>
                          <Link to={`/developer/projects/${project.id}/edit`}>
                            <button className="p-1.5 hover:bg-white/5 rounded-lg transition-colors">
                              <FileEdit className="w-4 h-4 text-blue-400" />
                            </button>
                          </Link>
                          <button className="p-1.5 hover:bg-white/5 rounded-lg transition-colors">
                            <Share2 className="w-4 h-4 text-emerald-400" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          
          <div className="p-6 border-t border-slate-800 flex items-center justify-between">
            <div className="text-sm text-slate-400">
              Showing {filteredProjects.length} of {projects.length} projects
            </div>
            <Link to="/developer/projects">
              <button className="flex items-center gap-2 text-emerald-400 hover:text-emerald-300 font-medium text-sm">
                View All Projects
                <ChevronRight className="w-4 h-4" />
              </button>
            </Link>
          </div>
        </motion.div>

        {/* Categories & Activity Sidebar */}
        <div className="space-y-6">
          {/* Category Distribution */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-gradient-to-br from-slate-900 to-slate-800 p-6 rounded-2xl border border-slate-800"
          >
            <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
              <PieChartIcon className="w-5 h-5 text-purple-400" />
              Category Distribution
            </h3>
            
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value) => [`${value}%`, 'Share']}
                    contentStyle={{ 
                      backgroundColor: 'rgba(15, 23, 42, 0.95)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid #1e293b', 
                      borderRadius: '10px'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            
            <div className="space-y-2 mt-4">
              {categoryData.map((item) => (
                <div key={item.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ background: item.color }}></div>
                    <span className="text-sm text-slate-300">{item.name}</span>
                  </div>
                  <span className="text-sm font-medium text-white">{item.value}%</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Recent Activity */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-gradient-to-br from-slate-900 to-slate-800 p-6 rounded-2xl border border-slate-800"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Activity className="w-5 h-5 text-amber-400" />
                Recent Activity
              </h3>
              <Bell className="w-5 h-5 text-slate-400" />
            </div>
            
            <div className="space-y-4">
              {activities.map((activity) => (
                <motion.div 
                  key={activity.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="group p-3 hover:bg-white/5 rounded-xl transition-colors"
                >
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 flex items-center justify-center">
                      <div className="text-xs font-bold text-white">
                        {activity.user.charAt(0)}
                      </div>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-white mb-1">{activity.message}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-slate-400">{activity.time}</span>
                        <span className="text-xs px-2 py-1 bg-white/5 rounded">
                          {activity.type}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
            
            <button className="w-full mt-6 py-2.5 text-sm text-center text-emerald-400 hover:text-emerald-300 bg-emerald-500/10 hover:bg-emerald-500/20 rounded-lg transition-colors">
              View All Activities
            </button>
          </motion.div>
        </div>
      </div>

      {/* Quick Actions Bar */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="bg-gradient-to-r from-slate-900 to-slate-800 p-6 rounded-2xl border border-slate-800"
      >
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-white mb-2">Need help or have questions?</h3>
            <p className="text-slate-400">Check our documentation or contact support</p>
          </div>
          <div className="flex gap-3">
            <button className="px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-colors border border-white/20">
              Documentation
            </button>
            <button className="px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl font-medium transition-all">
              Contact Support
            </button>
          </div>
        </div>
      </motion.div>

      {/* Project Detail Modal */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedProject(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl border border-slate-800 max-w-2xl w-full overflow-hidden"
              onClick={e => e.stopPropagation()}
            >
              <div className="p-6 border-b border-slate-800">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-white">{selectedProject.title}</h3>
                  <button 
                    onClick={() => setSelectedProject(null)}
                    className="p-2 hover:bg-white/5 rounded-lg"
                  >
                    ×
                  </button>
                </div>
                <p className="text-slate-400 mt-2">{selectedProject.category}</p>
              </div>
              
              <div className="p-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm text-slate-400">Progress</label>
                      <div className="text-2xl font-bold text-white">{selectedProject.progress}%</div>
                    </div>
                    <div>
                      <label className="text-sm text-slate-400">Funds Raised</label>
                      <div className="text-2xl font-bold text-emerald-400">
                        ${selectedProject.fundsRaised.toLocaleString()}
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm text-slate-400">Investors</label>
                      <div className="text-2xl font-bold text-white">{selectedProject.investors}</div>
                    </div>
                    <div>
                      <label className="text-sm text-slate-400">Expected ROI</label>
                      <div className="text-2xl font-bold text-amber-400">{selectedProject.roi}</div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-8">
                  <div className="flex justify-between text-sm text-slate-400 mb-2">
                    <span>Shares Distribution</span>
                    <span>{selectedProject.sharesSold.toLocaleString()}/{selectedProject.totalShares.toLocaleString()}</span>
                  </div>
                  <div className="h-3 bg-slate-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full rounded-full"
                      style={{ 
                        background: selectedProject.color,
                        width: `${selectedProject.progress}%`
                      }}
                    />
                  </div>
                </div>
                
                <div className="mt-8 flex justify-end gap-3">
                  <Link to={`/developer/projects/${selectedProject.id}/edit`}>
                    <button className="px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl font-medium">
                      Edit Project
                    </button>
                  </Link>
                  <button className="px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl">
                    View Details
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}