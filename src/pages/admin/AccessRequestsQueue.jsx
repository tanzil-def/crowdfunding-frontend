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
    try {
      await adminService.approveAccessRequest(id);
      toast.success('Request approved successfully');
      fetchRequests();
    } catch (error) {
      console.error('Approval failed:', error);
      toast.error('Failed to approve request');
    }
  };

  const handleReject = async (id) => {
    try {
      await adminService.rejectAccessRequest(id, "Rejected by admin action");
      toast.success('Request rejected');
      fetchRequests();
    } catch (error) {
      console.error('Rejection failed:', error);
      toast.error('Failed to reject request');
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
                              className="px-3 py-1 bg-green-500 hover:bg-green-600 text-white text-xs font-bold rounded shadow-sm transition-colors"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handleReject(req.id)}
                              className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white text-xs font-bold rounded shadow-sm transition-colors"
                            >
                              Reject
                            </button>
                          </>
                        )}
                        {req.status === 'APPROVED' && (
                          <div className="text-xs text-gray-400 italic">No actions</div>
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


    </div>
  );
};

export default AccessRequestsQueue;