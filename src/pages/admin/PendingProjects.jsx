import React, { useState, useEffect } from 'react';
import adminService from '../../api/adminService';
import { toast } from 'react-hot-toast';
import {
  FileText,
  Check,
  X,
  MessageSquare,
  DollarSign,
  Calendar,
  ExternalLink
} from 'lucide-react';
import { Link } from 'react-router-dom';

const PendingProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  // Action Modal State
  const [actionModal, setActionModal] = useState({
    isOpen: false,
    type: null, // 'REJECT' or 'REQUEST_CHANGES'
    projectId: null,
    note: ''
  });

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const data = await adminService.getPendingProjects();
      // Handle both array response or paginated response
      setProjects(Array.isArray(data) ? data : data.results || []);
    } catch (error) {
      console.error('Error fetching projects:', error);
      toast.error('Failed to load pending projects');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleApprove = async (id) => {
    if (!window.confirm('Are you sure you want to approve this project for listing?')) return;
    try {
      await adminService.approveProject(id);
      toast.success('Project approved and listed');
      fetchProjects();
    } catch (error) {
      console.error('Approval failed:', error);
      toast.error('Failed to approve project');
    }
  };

  const openActionModal = (type, id) => {
    setActionModal({
      isOpen: true,
      type,
      projectId: id,
      note: ''
    });
  };

  const handleActionSubmit = async (e) => {
    e.preventDefault();
    const { type, projectId, note } = actionModal;

    try {
      if (type === 'REJECT') {
        await adminService.rejectProject(projectId, note);
        toast.success('Project rejected');
      } else if (type === 'REQUEST_CHANGES') {
        await adminService.requestChanges(projectId, note);
        toast.success('Changes requested');
      }
      setActionModal({ isOpen: false, type: null, projectId: null, note: '' });
      fetchProjects();
    } catch (error) {
      console.error(`${type} failed:`, error);
      toast.error(`Failed to submit action`);
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Pending Projects</h1>
        <p className="text-gray-500">Review and approve project submissions.</p>
      </div>

      {/* Grid Layout for Projects */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : projects.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm">
          <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900">No Pending Projects</h3>
          <p className="text-gray-500">All submitted projects have been reviewed!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {projects.map((project) => (
            <div key={project.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 flex flex-col md:flex-row gap-6">
              {/* Project Info */}
              <div className="flex-1">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-xl font-bold text-gray-900">{project.title}</h3>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                    Pending Review
                  </span>
                </div>
                <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-4">
                  <span className="flex items-center">
                    <FileText className="w-4 h-4 mr-1 text-gray-400" />
                    {project.category}
                  </span>
                  <span className="flex items-center">
                    <DollarSign className="w-4 h-4 mr-1 text-gray-400" />
                    ${Number(project.total_project_value).toLocaleString()}
                  </span>
                  <span className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1 text-gray-400" />
                    {project.duration_days} days
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm border-t pt-4">
                  <div>
                    <span className="block text-gray-500 text-xs uppercase tracking-wide">Developer</span>
                    <span className="font-medium text-gray-800">{project.developer_name}</span>
                    <div className="text-gray-400 text-xs">{project.developer_email}</div>
                  </div>
                  <div>
                    <span className="block text-gray-500 text-xs uppercase tracking-wide">Offering</span>
                    <span className="font-medium text-gray-800">{project.total_shares} Shares @ ${project.share_price}</span>
                  </div>
                </div>
              </div>

              {/* Actions Panel */}
              <div className="flex flex-col gap-3 justify-center min-w-[200px] border-l border-gray-100 pl-0 md:pl-6">
                <button
                  onClick={() => handleApprove(project.id)}
                  className="flex items-center justify-center gap-2 w-full py-2 px-4 bg-green-600 hover:bg-green-700 text-white rounded-md text-sm font-medium transition-colors"
                >
                  <Check className="w-4 h-4" /> Approve Listing
                </button>
                <button
                  onClick={() => openActionModal('REQUEST_CHANGES', project.id)}
                  className="flex items-center justify-center gap-2 w-full py-2 px-4 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-md text-sm font-medium transition-colors"
                >
                  <MessageSquare className="w-4 h-4" /> Request Changes
                </button>
                <button
                  onClick={() => openActionModal('REJECT', project.id)}
                  className="flex items-center justify-center gap-2 w-full py-2 px-4 bg-white border border-red-200 hover:bg-red-50 text-red-600 rounded-md text-sm font-medium transition-colors"
                >
                  <X className="w-4 h-4" /> Reject Project
                </button>
                <Link
                  to={`/projects/${project.id}`}
                  className="flex items-center justify-center gap-2 w-full py-2 px-4 text-blue-600 hover:text-blue-800 text-sm font-medium mt-2"
                >
                  View Full Details <ExternalLink className="w-3 h-3" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Action Modal */}
      {actionModal.isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 opacity-75" onClick={() => setActionModal({ ...actionModal, isOpen: false })}></div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>
            <div className="inline-block align-middle bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <form onSubmit={handleActionSubmit}>
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    {actionModal.type === 'REJECT' ? 'Reject Project' : 'Request Changes'}
                  </h3>
                  <p className="text-sm text-gray-500 mb-4">
                    {actionModal.type === 'REJECT'
                      ? 'Provide a reason for rejection. This will be sent to the developer.'
                      : 'Describe the changes needed before this project can be approved.'}
                  </p>
                  <textarea
                    className="w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-blue-500 focus:border-blue-500 min-h-[100px]"
                    required
                    placeholder={actionModal.type === 'REJECT' ? "Rejection reason..." : "Required changes..."}
                    value={actionModal.note}
                    onChange={(e) => setActionModal({ ...actionModal, note: e.target.value })}
                  />
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="submit"
                    className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 text-base font-medium text-white focus:outline-none sm:ml-3 sm:w-auto sm:text-sm
                                            ${actionModal.type === 'REJECT' ? 'bg-red-600 hover:bg-red-700' : 'bg-indigo-600 hover:bg-indigo-700'}`}
                  >
                    Submit
                  </button>
                  <button
                    type="button"
                    onClick={() => setActionModal({ ...actionModal, isOpen: false })}
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PendingProjects;