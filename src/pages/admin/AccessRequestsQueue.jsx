import React, { useState, useEffect } from 'react';
import adminService from '../../api/adminService';
import { toast } from 'react-hot-toast';
import {
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  Eye,
  RotateCcw
} from 'lucide-react';

const AccessRequestsQueue = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ count: 0, next: null, previous: null });
  const [filters, setFilters] = useState({
    page: 1,
    page_size: 10,
    status: 'PENDING',
    search: '',
  });

  // Action Modal State
  const [actionModal, setActionModal] = useState({
    isOpen: false,
    type: null, // 'REJECT' or 'REVOKE'
    requestId: null,
    reason: ''
  });

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const data = await adminService.getAccessRequests(filters);
      setRequests(data.results || []);
      setStats({
        count: data.count,
        next: data.next,
        previous: data.previous
      });
    } catch (error) {
      console.error('Error fetching requests:', error);
      toast.error('Failed to load access requests');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [filters.page, filters.status]);

  const handleStatusChange = (status) => {
    setFilters(prev => ({ ...prev, status, page: 1 }));
  };

  const handlePageChange = (newPage) => {
    setFilters(prev => ({ ...prev, page: newPage }));
  };

  const handleApprove = async (id) => {
    if (!window.confirm('Are you sure you want to approve this request?')) return;
    try {
      await adminService.approveAccessRequest(id);
      toast.success('Request approved successfully');
      fetchRequests();
    } catch (error) {
      console.error('Approval failed:', error);
      toast.error('Failed to approve request');
    }
  };

  const openActionModal = (type, id) => {
    setActionModal({
      isOpen: true,
      type,
      requestId: id,
      reason: ''
    });
  };

  const handleActionSubmit = async (e) => {
    e.preventDefault();
    const { type, requestId, reason } = actionModal;

    try {
      if (type === 'REJECT') {
        await adminService.rejectAccessRequest(requestId, reason);
        toast.success('Request rejected');
      } else if (type === 'REVOKE') {
        await adminService.revokeAccessRequest(requestId, reason);
        toast.success('Access revoked');
      }
      setActionModal({ isOpen: false, type: null, requestId: null, reason: '' });
      fetchRequests();
    } catch (error) {
      console.error(`${type} failed:`, error);
      toast.error(`Failed to ${type.toLowerCase()} request`);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'APPROVED': return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" /> Approved</span>;
      case 'REJECTED': return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800"><XCircle className="w-3 h-3 mr-1" /> Rejected</span>;
      case 'REVOKED': return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800"><AlertTriangle className="w-3 h-3 mr-1" /> Revoked</span>;
      default: return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"><Clock className="w-3 h-3 mr-1" /> Pending</span>;
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Access Requests</h1>
        <p className="text-gray-500">Manage investor access to project financials.</p>
      </div>

      {/* Status Tabs */}
      <div className="bg-white p-1 rounded-lg shadow-sm mb-6 inline-flex overflow-hidden">
        {['PENDING', 'APPROVED', 'REJECTED', 'REVOKED'].map((status) => (
          <button
            key={status}
            onClick={() => handleStatusChange(status)}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${filters.status === status
                ? 'bg-blue-50 text-blue-600 shadow-sm'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
          >
            {status.charAt(0) + status.slice(1).toLowerCase()}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Project</th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Investor</th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Reason</th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr><td colSpan="6" className="px-6 py-8 text-center text-gray-500">Loading requests...</td></tr>
              ) : requests.length === 0 ? (
                <tr><td colSpan="6" className="px-6 py-8 text-center text-gray-500">No requests found.</td></tr>
              ) : (
                requests.map((req) => (
                  <tr key={req.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-900">{req.project_title}</td>
                    <td className="px-6 py-4 text-gray-600">{req.requester_email}</td>
                    <td className="px-6 py-4">{getStatusBadge(req.status)}</td>
                    <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate" title={req.reason}>
                      {req.reason}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(req.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        {req.status === 'PENDING' && (
                          <>
                            <button
                              onClick={() => handleApprove(req.id)}
                              className="text-green-600 hover:text-green-800 text-sm font-medium hover:underline"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => openActionModal('REJECT', req.id)}
                              className="text-red-600 hover:text-red-800 text-sm font-medium hover:underline"
                            >
                              Reject
                            </button>
                          </>
                        )}
                        {req.status === 'APPROVED' && (
                          <button
                            onClick={() => openActionModal('REVOKE', req.id)}
                            className="text-orange-600 hover:text-orange-800 text-sm font-medium hover:underline flex items-center gap-1"
                          >
                            <RotateCcw className="w-3 h-3" /> Revoke
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
          <button
            disabled={!stats.previous}
            onClick={() => handlePageChange(filters.page - 1)}
            className={`px-4 py-2 border rounded-md text-sm font-medium ${!stats.previous ? 'bg-gray-50 text-gray-400' : 'bg-white hover:bg-gray-50'}`}
          >
            Previous
          </button>
          <span className="text-sm text-gray-600">Page {filters.page}</span>
          <button
            disabled={!stats.next}
            onClick={() => handlePageChange(filters.page + 1)}
            className={`px-4 py-2 border rounded-md text-sm font-medium ${!stats.next ? 'bg-gray-50 text-gray-400' : 'bg-white hover:bg-gray-50'}`}
          >
            Next
          </button>
        </div>
      </div>

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
                    {actionModal.type === 'REJECT' ? 'Reject Request' : 'Revoke Access'}
                  </h3>
                  <p className="text-sm text-gray-500 mb-4">
                    Please provide a reason for this action.
                  </p>
                  <textarea
                    className="w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                    rows="3"
                    required
                    placeholder="Reason..."
                    value={actionModal.reason}
                    onChange={(e) => setActionModal({ ...actionModal, reason: e.target.value })}
                  />
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="submit"
                    className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 text-base font-medium text-white focus:outline-none sm:ml-3 sm:w-auto sm:text-sm
                                            ${actionModal.type === 'REJECT' ? 'bg-red-600 hover:bg-red-700' : 'bg-orange-600 hover:bg-orange-700'}`}
                  >
                    Confirm
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

export default AccessRequestsQueue;