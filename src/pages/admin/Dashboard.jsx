import React, { useState, useEffect } from 'react';
import adminService from '../../api/adminService';
import { Link } from 'react-router-dom';
import {
  Users,
  FileText,
  DollarSign,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  Bell
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [projectStats, setProjectStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [basicStats, projStats] = await Promise.all([
          adminService.getDashboardSummary(),
          adminService.getStatistics()
        ]);
        setStats(basicStats);
        setProjectStats(projStats);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!stats) return null;

  // Data for charts
  const projectStatusData = projectStats ? Object.entries(projectStats.by_status).map(([name, value]) => ({ name, value })) : [];
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
        <p className="text-gray-500">Platform overview and performance metrics.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
              <DollarSign className="w-6 h-6" />
            </div>
            <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full flex items-center">
              <ArrowUpRight className="w-3 h-3 mr-1" /> +12%
            </span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">${Number(stats.total_revenue).toLocaleString()}</h3>
          <p className="text-sm text-gray-500">Total Revenue</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
              <Activity className="w-6 h-6" />
            </div>
            <span className="text-xs font-medium text-gray-500 bg-gray-50 px-2 py-1 rounded-full">
              Lifetime
            </span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">{stats.total_investments}</h3>
          <p className="text-sm text-gray-500">Total Investments</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-purple-50 rounded-lg text-purple-600">
              <FileText className="w-6 h-6" />
            </div>
            {stats.pending_projects > 0 && (
              <span className="text-xs font-medium text-orange-600 bg-orange-50 px-2 py-1 rounded-full animate-pulse">
                {stats.pending_projects} Pending
              </span>
            )}
          </div>
          <h3 className="text-2xl font-bold text-gray-900">{stats.total_projects}</h3>
          <p className="text-sm text-gray-500">Total Projects</p>
          {stats.pending_projects > 0 && (
            <Link to="/admin/projects/pending" className="text-xs text-blue-600 hover:underline mt-2 block">
              Review Pending &rarr;
            </Link>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-red-50 rounded-lg text-red-600">
              <Bell className="w-6 h-6" />
            </div>
            <span className="text-xs font-medium text-gray-500 bg-gray-50 px-2 py-1 rounded-full">
              Action Needed
            </span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">{stats.unread_notifications}</h3>
          <p className="text-sm text-gray-500">Unread Alerts</p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Project Status Distribution */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-6">Projects by Status</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={projectStatusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                >
                  {projectStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <RechartsTooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap justify-center gap-4 mt-4">
            {projectStatusData.map((entry, index) => (
              <div key={entry.name} className="flex items-center text-sm">
                <span className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: COLORS[index % COLORS.length] }}></span>
                <span className="text-gray-600">{entry.name}: {entry.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-6">Quick Actions</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link
              to="/admin/users"
              className="p-4 rounded-lg border border-gray-100 hover:border-blue-200 hover:bg-blue-50 transition-all group"
            >
              <Users className="w-8 h-8 text-blue-500 mb-3 group-hover:scale-110 transition-transform" />
              <h4 className="font-semibold text-gray-900">Manage Users</h4>
              <p className="text-sm text-gray-500 mt-1">View, edit, and verify users.</p>
            </Link>

            <Link
              to="/admin/access-requests"
              className="p-4 rounded-lg border border-gray-100 hover:border-green-200 hover:bg-green-50 transition-all group"
            >
              <div className="flex justify-between">
                <Activity className="w-8 h-8 text-green-500 mb-3 group-hover:scale-110 transition-transform" />
                {stats.pending_projects > 0 && <span className="h-2 w-2 rounded-full bg-red-500"></span>}
              </div>
              <h4 className="font-semibold text-gray-900">Access Requests</h4>
              <p className="text-sm text-gray-500 mt-1">Approve investor access.</p>
            </Link>

            <Link
              to="/admin/payments"
              className="p-4 rounded-lg border border-gray-100 hover:border-purple-200 hover:bg-purple-50 transition-all group"
            >
              <DollarSign className="w-8 h-8 text-purple-500 mb-3 group-hover:scale-110 transition-transform" />
              <h4 className="font-semibold text-gray-900">Transactions</h4>
              <p className="text-sm text-gray-500 mt-1">Review financial history.</p>
            </Link>

            <Link
              to="/admin/audit-logs"
              className="p-4 rounded-lg border border-gray-100 hover:border-orange-200 hover:bg-orange-50 transition-all group"
            >
              <FileText className="w-8 h-8 text-orange-500 mb-3 group-hover:scale-110 transition-transform" />
              <h4 className="font-semibold text-gray-900">Audit Logs</h4>
              <p className="text-sm text-gray-500 mt-1">System activity records.</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;