import React, { useState, useEffect } from 'react';
import adminService from '../../api/adminService';
import { toast } from 'react-hot-toast';
import {
  DollarSign,
  Search,
  Filter,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  CreditCard
} from 'lucide-react';

const Payments = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ count: 0, next: null, previous: null });
  const [filters, setFilters] = useState({
    page: 1,
    page_size: 10,
    status: '', // All
    search: '',
    ordering: '-created_at'
  });

  // Detail Modal
  const [selectedTxn, setSelectedTxn] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const data = await adminService.getTransactions(filters);
      setTransactions(data.results || []);
      setStats({
        count: data.count,
        next: data.next,
        previous: data.previous
      });
    } catch (error) {
      console.error('Error fetching transactions:', error);
      toast.error('Failed to load transactions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const debounce = setTimeout(() => {
      fetchTransactions();
    }, 500);
    return () => clearTimeout(debounce);
  }, [filters.page, filters.status, filters.search]);

  const handleSearchChange = (e) => {
    setFilters(prev => ({ ...prev, search: e.target.value, page: 1 }));
  };

  const handleStatusChange = (status) => {
    setFilters(prev => ({ ...prev, status, page: 1 }));
  };

  const handlePageChange = (newPage) => {
    setFilters(prev => ({ ...prev, page: newPage }));
  };

  const handleViewDetails = async (id) => {
    try {
      // Optimistically can use existing data, but requirement says fetch detail
      const data = await adminService.getTransactionDetail(id);
      setSelectedTxn(data);
      setIsModalOpen(true);
    } catch (error) {
      console.error('Fetch detail failed:', error);
      toast.error('Failed to load details');
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'SUCCESS': return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" /> Success</span>;
      case 'FAILED': return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800"><XCircle className="w-3 h-3 mr-1" /> Failed</span>;
      case 'INITIATED': return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"><Clock className="w-3 h-3 mr-1" /> Initiated</span>;
      default: return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">{status}</span>;
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Payment Transactions</h1>
        <p className="text-gray-500">Monitor all financial transactions and investments.</p>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm mb-6 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search reference ID, email..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={filters.search}
              onChange={handleSearchChange}
            />
          </div>
        </div>

        <div className="flex gap-2 w-full md:w-auto overflow-x-auto">
          {['', 'SUCCESS', 'FAILED', 'INITIATED'].map((status) => (
            <button
              key={status}
              onClick={() => handleStatusChange(status)}
              className={`px-4 py-2 text-sm font-medium rounded-md whitespace-nowrap ${filters.status === status
                  ? 'bg-blue-600 text-white'
                  : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
                }`}
            >
              {status === '' ? 'All Transactions' : status.charAt(0) + status.slice(1).toLowerCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Reference ID</th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Investor</th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Project</th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr><td colSpan="7" className="px-6 py-8 text-center text-gray-500">Loading transactions...</td></tr>
              ) : transactions.length === 0 ? (
                <tr><td colSpan="7" className="px-6 py-8 text-center text-gray-500">No transactions found.</td></tr>
              ) : (
                transactions.map((txn) => (
                  <tr key={txn.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-mono text-sm text-gray-600">{txn.reference_id}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{txn.investor_email}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{txn.project_title}</td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">${txn.amount}</td>
                    <td className="px-6 py-4">{getStatusBadge(txn.status)}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(txn.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleViewDetails(txn.id)}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium hover:underline inline-flex items-center"
                      >
                        <Eye className="w-3 h-3 mr-1" /> View
                      </button>
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

      {/* Details Modal */}
      {isModalOpen && selectedTxn && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 opacity-75" onClick={() => setIsModalOpen(false)}></div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>
            <div className="inline-block align-middle bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-blue-600" />
                    Transaction Details
                  </h3>
                  <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-500">
                    <span className="text-2xl">&times;</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">Payment Info</h4>
                    <div className="space-y-3">
                      <div>
                        <div className="text-sm text-gray-500">Amount</div>
                        <div className="text-xl font-bold text-gray-900">${selectedTxn.amount}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500">Status</div>
                        <div className="mt-1">{getStatusBadge(selectedTxn.status)}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500">Reference ID</div>
                        <div className="text-sm font-mono bg-white border px-2 py-1 rounded inline-block">{selectedTxn.reference_id}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500">Date</div>
                        <div className="text-sm font-medium">{new Date(selectedTxn.created_at).toLocaleString()}</div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">Context</h4>
                    <div className="space-y-3">
                      <div>
                        <div className="text-sm text-gray-500">Investor Email</div>
                        <div className="text-sm font-medium break-all">{selectedTxn.investor_email}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500">Project</div>
                        <div className="text-base font-medium text-blue-600">{selectedTxn.project_title}</div>
                      </div>
                      {selectedTxn.failure_reason && (
                        <div className="bg-red-50 p-3 rounded border border-red-100">
                          <div className="text-xs font-bold text-red-600 uppercase mb-1">Failure Reason</div>
                          <div className="text-sm text-red-700">{selectedTxn.failure_reason}</div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {selectedTxn.processed_at && (
                  <div className="mt-6 pt-4 border-t border-gray-100 text-sm text-gray-500">
                    Processed at: {new Date(selectedTxn.processed_at).toLocaleString()}
                  </div>
                )}
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Payments;