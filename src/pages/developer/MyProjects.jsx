import React, { useState, useEffect } from 'react';
import { 
  LayoutGrid, List, Search, Plus, MoreVertical, ExternalLink, 
  Edit3, Trash2, Clock, CheckCircle2, AlertCircle, Archive, DollarSign 
} from 'lucide-react';

const MyProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMyProjects = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        if (!token) throw new Error('No authentication token found. Please login again.');

        const response = await fetch('http://127.0.0.1:8000/api/v1/projects/my/', {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error(`Failed to load projects (${response.status})`);
        }

        const data = await response.json();
        // Handle both paginated (results) and direct array response
        setProjects(data.results || data);
      } catch (err) {
        setError(err.message || 'Unable to fetch your projects');
      } finally {
        setLoading(false);
      }
    };

    fetchMyProjects();
  }, []);

  const getStatusStyle = (status) => {
    switch (status?.toUpperCase()) {
      case 'APPROVED': return 'bg-green-100 text-green-700 border-green-200';
      case 'PENDING': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'REJECTED': return 'bg-red-100 text-red-700 border-red-200';
      case 'DRAFT': return 'bg-gray-100 text-gray-700 border-gray-200';
      default: return 'bg-blue-100 text-blue-700 border-blue-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toUpperCase()) {
      case 'APPROVED': return <CheckCircle2 size={14} />;
      case 'PENDING': return <Clock size={14} />;
      case 'REJECTED': return <AlertCircle size={14} />;
      case 'DRAFT': return <Archive size={14} />;
      default: return null;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 p-8 rounded-xl text-center max-w-2xl mx-auto">
        <AlertCircle className="mx-auto mb-4" size={40} />
        <h3 className="text-xl font-bold mb-2">Error Loading Projects</h3>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Projects</h1>
          <p className="text-gray-500">Manage and monitor your crowdfunding listings</p>
        </div>
        <button className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-medium transition-all shadow-md">
          <Plus size={18} />
          Create New Project
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
          <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Total Projects</p>
          <p className="text-2xl font-black text-gray-900 mt-1">{projects.length}</p>
        </div>
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm border-l-4 border-l-green-500">
          <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Approved</p>
          <p className="text-2xl font-black text-green-600 mt-1">
            {projects.filter(p => p.status?.toUpperCase() === 'APPROVED').length}
          </p>
        </div>
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm border-l-4 border-l-yellow-500">
          <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">In Review</p>
          <p className="text-2xl font-black text-yellow-600 mt-1">
            {projects.filter(p => p.status?.toUpperCase() === 'PENDING').length}
          </p>
        </div>
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm border-l-4 border-l-blue-500">
          <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Total Shares Sold</p>
          <p className="text-2xl font-black text-blue-600 mt-1">
            {projects.reduce((acc, p) => acc + (p.shares_sold || 0), 0).toLocaleString()}
          </p>
        </div>
      </div>

      {/* Search & View Toggle */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm mb-6 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Search your projects..."
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          />
        </div>
        <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-lg border border-gray-200">
          <button className="p-2 bg-white rounded-md text-blue-600 shadow-sm">
            <LayoutGrid size={18} />
          </button>
          <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
            <List size={18} />
          </button>
        </div>
      </div>

      {/* Projects Grid */}
      {projects.length === 0 ? (
        <div className="bg-white p-12 rounded-2xl text-center border border-gray-200 shadow-sm">
          <FolderKanban className="mx-auto text-gray-400 mb-4" size={64} />
          <h3 className="text-2xl font-bold text-gray-700 mb-3">No Projects Yet</h3>
          <p className="text-gray-500 mb-6 max-w-md mx-auto">
            You haven't created any crowdfunding projects yet. Start your first one now!
          </p>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-medium inline-flex items-center gap-2 shadow-md">
            <Plus size={20} /> Create New Project
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div key={project.id} className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-lg transition-all overflow-hidden flex flex-col">
              {/* Project Image / Placeholder */}
              <div className="h-48 bg-gray-100 relative overflow-hidden">
                {project.main_image || project.thumbnail ? (
                  <img 
                    src={project.main_image || project.thumbnail} 
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    onError={(e) => { e.target.src = 'https://via.placeholder.com/400x200?text=No+Image'; }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                    <Archive size={64} className="text-gray-300" />
                  </div>
                )}
              </div>

              <div className="p-6 flex-grow">
                <div className="flex justify-between items-start mb-4">
                  <span className={`px-2.5 py-1 rounded-md text-[11px] font-bold border flex items-center gap-1.5 uppercase tracking-wide ${getStatusStyle(project.status)}`}>
                    {getStatusIcon(project.status)}
                    {project.status || 'UNKNOWN'}
                  </span>
                  <button className="text-gray-400 hover:text-gray-600">
                    <MoreVertical size={20} />
                  </button>
                </div>

                <h3 className="text-lg font-bold text-gray-900 mb-1 leading-tight">{project.title}</h3>
                <p className="text-sm text-gray-500 mb-6">{project.category}</p>

                <div className="space-y-4 pt-4 border-t border-gray-100">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500 flex items-center gap-1">
                      <DollarSign size={14} className="text-gray-400" /> Valuation:
                    </span>
                    <span className="font-bold text-gray-900">
                      ${Number(project.total_project_value || 0).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500 font-medium">Funding Progress:</span>
                    <span className="font-bold text-gray-900">
                      {Math.round((project.shares_sold || 0) / (project.total_shares || 1) * 100)}%
                    </span>
                  </div>
                  
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-700 ease-out" 
                      style={{ width: `${Math.min(100, (project.shares_sold || 0) / (project.total_shares || 1) * 100)}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-[11px] text-gray-400 font-bold uppercase tracking-tight">
                    <span>{(project.shares_sold || 0).toLocaleString()} Sold</span>
                    <span>{(project.total_shares || 0).toLocaleString()} Total</span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 px-6 py-4 flex items-center justify-between border-t border-gray-100">
                <span className="text-xs text-gray-400 font-medium italic">
                  Created: {project.created_at ? new Date(project.created_at).toLocaleDateString() : 'N/A'}
                </span>
                <div className="flex gap-2">
                  <button className="p-2 text-gray-500 hover:bg-white hover:text-blue-600 rounded-lg transition-all border border-transparent hover:border-gray-200 shadow-sm" title="Edit">
                    <Edit3 size={18} />
                  </button>
                  <button className="p-2 text-gray-500 hover:bg-white hover:text-red-600 rounded-lg transition-all border border-transparent hover:border-gray-200 shadow-sm" title="Delete">
                    <Trash2 size={18} />
                  </button>
                  <button className="p-2 text-gray-500 hover:bg-white hover:text-gray-900 rounded-lg transition-all border border-transparent hover:border-gray-200 shadow-sm" title="View Details">
                    <ExternalLink size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyProjects;