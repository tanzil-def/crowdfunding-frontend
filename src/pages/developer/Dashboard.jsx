import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar 
} from 'recharts';
import { 
  LayoutDashboard, Users, Bell, Plus, 
  TrendingUp, LogOut, Wallet, 
  CheckCircle, Clock, FileEdit, BarChart3, PieChart as PieIcon,
  FolderKanban, DollarSign, ArrowRight
} from 'lucide-react';

/**
 * Note: If your local environment import paths are correct, 
 * uncomment these lines to connect your live data.
 */
// import { useAuthStore } from '@/store/authStore';
// import { statsApi } from '@/lib/statsApi';
// import { investmentsApi } from '@/lib/investmentsApi';
// import { projectsApi } from '@/lib/projectsApi';

const DeveloperDashboard = () => {
  const [projects, setProjects] = useState([]);
  const [dashboardStats, setDashboardStats] = useState(null);
  const [investments, setInvestments] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Dummy user object for preview
  const user = { name: "Developer" };

  useEffect(() => {
    const loadDashboardData = async () => {
      setLoading(true);
      try {
        /**
         * Real API connection logic (Un-comment in your local project):
         * const [projectsData, statsData, investmentData] = await Promise.all([
         * projectsApi.getMine(),
         * statsApi.getDeveloper(),
         * investmentsApi.list(),
         * ]);
         * setProjects(projectsData || []);
         * setDashboardStats(statsData || null);
         * setInvestments(investmentData || []);
         */

        // Placeholder data for preview stability
        setProjects([
          { id: 1, title: 'Skyline Luxury Tower', status: 'APPROVED', sharesSold: 850, totalShares: 1000, perSharePrice: 150, category: 'Real Estate' },
          { id: 2, title: 'Green Valley Resort', status: 'PENDING_REVIEW', sharesSold: 120, totalShares: 500, perSharePrice: 220, category: 'Hospitality' },
          { id: 3, title: 'Eco Villas', status: 'DRAFT', sharesSold: 0, totalShares: 300, perSharePrice: 500, category: 'Nature' },
        ]);
        
        setDashboardStats({
          totalFundsSecured: 127500,
          totalInvestors: 45,
          totalSharesSold: 970,
          totalProjects: 3
        });

        setInvestments([
          { createdAt: '2023-01-01', totalAmount: 5000 },
          { createdAt: '2023-02-01', totalAmount: 12000 },
          { createdAt: '2023-03-01', totalAmount: 8000 },
          { createdAt: '2023-04-01', totalAmount: 15000 },
        ]);

      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  const approvedProjects = projects.filter(p => p.status === 'APPROVED');
  const pendingProjects = projects.filter(p => p.status === 'PENDING_REVIEW');
  const draftProjects = projects.filter(p => p.status === 'DRAFT' || p.status === 'NEEDS_CHANGES');

  const totalFundsSecured = dashboardStats?.totalFundsSecured ?? 
    approvedProjects.reduce((sum, p) => sum + (p.sharesSold * p.perSharePrice), 0);
  
  const totalInvestors = dashboardStats?.totalInvestors ?? 0;
  const totalSharesSold = dashboardStats?.totalSharesSold ?? 
    approvedProjects.reduce((sum, p) => sum + p.sharesSold, 0);
  
  const totalSharesAvailable = approvedProjects.reduce((sum, p) => sum + p.totalShares, 0);

  const fundingChartData = investments.map(inv => ({
    month: new Date(inv.createdAt).toLocaleString('default', { month: 'short' }),
    funds: inv.totalAmount
  }));

  if (loading) {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-emerald-500 font-bold animate-pulse">Loading Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 flex font-sans">
      {/* Sidebar Section */}
      <aside className="w-72 bg-[#0f172a] border-r border-slate-800 p-8 hidden lg:flex flex-col sticky top-0 h-screen">
        <div className="flex items-center gap-3 mb-10">
          <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center text-slate-950 font-black text-xl shadow-lg shadow-emerald-500/20">C</div>
          <h2 className="text-xl font-black text-white italic tracking-tight">CASTLE<span className="text-emerald-500">.</span></h2>
        </div>
        
        <nav className="flex-1 space-y-2">
          <SidebarItem icon={<LayoutDashboard size={18} />} label="Overview" active />
          <SidebarItem icon={<FolderKanban size={18} />} label="My Projects" />
          <SidebarItem icon={<Plus size={18} />} label="Create Project" />
          <SidebarItem icon={<Users size={18} />} label="Investors" />
          <SidebarItem icon={<Wallet size={18} />} label="Funding" />
          <SidebarItem icon={<Bell size={18} />} label="Notifications" badge="3" />
        </nav>

        <div className="mt-auto pt-6 border-t border-slate-800">
          <button className="flex items-center gap-4 text-slate-500 p-4 w-full hover:text-red-400 font-bold transition-all group rounded-2xl hover:bg-red-500/5">
            <LogOut size={18} /> Logout
          </button>
        </div>
      </aside>

      {/* Main Dashboard Area */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
          <div>
            <h1 className="text-3xl font-black text-white">Developer Dashboard</h1>
            <p className="text-slate-500 text-sm font-medium mt-1 uppercase tracking-wider">Castle Platform • Welcome, {user?.name || 'Developer'}</p>
          </div>
          <button className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-6 py-3 rounded-2xl font-black flex items-center gap-2 transition-all shadow-lg shadow-emerald-500/20 active:scale-95">
            <Plus size={20} strokeWidth={3} /> Create New Project
          </button>
        </header>

        {/* Top Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
          <StatCard title="Total Projects" value={projects.length} icon={<FolderKanban className="text-emerald-500" />} color="emerald" />
          <StatCard title="Funds Secured" value={`$${totalFundsSecured.toLocaleString()}`} icon={<DollarSign className="text-blue-500" />} color="blue" />
          <StatCard title="Total Investors" value={totalInvestors} icon={<Users className="text-purple-500" />} color="purple" />
          <StatCard title="Shares Sold" value={`${totalSharesSold} / ${totalSharesAvailable}`} icon={<TrendingUp className="text-orange-500" />} color="orange" />
        </div>

        {/* Project Status Overview */}
        <div className="grid md:grid-cols-3 gap-6 mb-10">
          <StatusSmallCard label="Pending Review" count={pendingProjects.length} icon={<Clock className="text-orange-400" />} border="border-l-orange-400" />
          <StatusSmallCard label="Live Projects" count={approvedProjects.length} icon={<CheckCircle className="text-emerald-400" />} border="border-l-emerald-400" />
          <StatusSmallCard label="Draft Projects" count={draftProjects.length} icon={<FileEdit className="text-slate-400" />} border="border-l-slate-400" />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
          <div className="bg-[#0f172a] p-8 rounded-[2.5rem] border border-slate-800 shadow-2xl">
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-6 flex items-center gap-2">
              <BarChart3 size={16} className="text-emerald-500" /> Funding Growth
            </h3>
            <div className="h-[280px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={fundingChartData}>
                  <defs>
                    <linearGradient id="colorFunds" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                  <XAxis dataKey="month" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `$${v/1000}k`} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '16px' }} 
                    itemStyle={{ color: '#10b981', fontWeight: 'bold' }}
                  />
                  <Area type="monotone" dataKey="funds" stroke="#10b981" strokeWidth={4} fill="url(#colorFunds)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-[#0f172a] p-8 rounded-[2.5rem] border border-slate-800 shadow-2xl">
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-6 flex items-center gap-2">
              <PieIcon size={16} className="text-emerald-500" /> Share Distribution
            </h3>
            <div className="h-[280px] w-full">
               <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={approvedProjects} layout="vertical" margin={{ left: 20 }}>
                    <XAxis type="number" hide />
                    <YAxis dataKey="title" type="category" stroke="#64748b" fontSize={10} width={100} tickLine={false} axisLine={false} />
                    <Tooltip cursor={{fill: '#1e293b'}} contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '12px' }} />
                    <Bar dataKey="sharesSold" fill="#10b981" radius={[0, 4, 4, 0]} barSize={20} />
                  </BarChart>
               </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Project Table */}
        <div className="bg-[#0f172a] rounded-[2.5rem] border border-slate-800 shadow-2xl overflow-hidden">
          <div className="p-8 border-b border-slate-800 flex justify-between items-center bg-slate-900/30">
            <h3 className="font-black uppercase tracking-widest text-sm">Project Portfolio</h3>
            <button className="text-emerald-500 text-xs font-black flex items-center gap-1 hover:gap-2 transition-all">View All <ArrowRight size={14}/></button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-[#020617] text-slate-500 text-[10px] font-black uppercase tracking-[0.2em]">
                  <th className="p-8">Project Name</th>
                  <th className="p-8">Status</th>
                  <th className="p-8">Shares Sold</th>
                  <th className="p-8">Revenue</th>
                  <th className="p-8">Progress</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {projects.map((project) => (
                  <tr key={project.id} className="hover:bg-slate-800/40 transition-colors group">
                    <td className="p-8">
                      <div className="font-bold text-white group-hover:text-emerald-400 transition-colors">{project.title}</div>
                      <div className="text-[10px] text-slate-600 font-bold uppercase">{project.category}</div>
                    </td>
                    <td className="p-8">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter ${
                        project.status === 'APPROVED' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 
                        project.status === 'PENDING_REVIEW' ? 'bg-orange-500/10 text-orange-500 border border-orange-500/20' :
                        'bg-slate-500/10 text-slate-500 border border-slate-500/20'
                      }`}>
                        {project.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="p-8 text-sm font-bold text-slate-300">{project.sharesSold.toLocaleString()} / {project.totalShares.toLocaleString()}</td>
                    <td className="p-8 text-sm font-bold text-white">${(project.sharesSold * project.perSharePrice).toLocaleString()}</td>
                    <td className="p-8">
                       <div className="w-24 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${(project.sharesSold / project.totalShares) * 100}%` }}
                            transition={{ duration: 1 }}
                            className="h-full bg-emerald-500"
                          ></motion.div>
                       </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

const SidebarItem = ({ icon, label, active = false, badge = null }) => (
  <div className={`flex items-center justify-between p-4 rounded-2xl cursor-pointer transition-all font-bold text-sm group ${
    active ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/30' : 'text-slate-500 hover:bg-slate-800/60 hover:text-slate-200'
  }`}>
    <div className="flex items-center gap-4">
      <span className={`${active ? 'text-slate-950' : 'group-hover:text-emerald-500'} transition-colors`}>{icon}</span>
      <span>{label}</span>
    </div>
    {badge && <span className="bg-emerald-500 text-slate-950 text-[10px] px-2 py-0.5 rounded-full font-black">{badge}</span>}
  </div>
);

const StatCard = ({ title, value, icon, color }) => (
  <div className="bg-[#0f172a] p-6 rounded-[2rem] border border-slate-800 shadow-xl hover:border-slate-700 transition-all group">
    <div className={`w-12 h-12 rounded-2xl bg-${color}-500/10 flex items-center justify-center mb-4 border border-${color}-500/20 group-hover:scale-110 transition-transform`}>
      {icon}
    </div>
    <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">{title}</p>
    <h2 className="text-2xl font-black text-white mt-1 leading-tight">{value}</h2>
  </div>
);

const StatusSmallCard = ({ label, count, icon, border }) => (
  <div className={`bg-[#0f172a] p-6 rounded-2xl border border-slate-800 border-l-4 ${border} flex items-center gap-4 shadow-lg hover:bg-[#151e33] transition-colors`}>
    <div className="p-3 bg-slate-900/50 rounded-xl">{icon}</div>
    <div>
      <p className="text-2xl font-black text-white leading-none">{count}</p>
      <p className="text-xs text-slate-500 font-bold uppercase mt-1.5 tracking-tighter">{label}</p>
    </div>
  </div>
);

export default DeveloperDashboard;