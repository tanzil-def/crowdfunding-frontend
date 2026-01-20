import React, { useEffect, useState } from "react";
import { getAdminTransactions, getAdminTransactionDetail } from "../../services/api";
import { motion, AnimatePresence } from "framer-motion";
import {
  DollarSign,
  Search,
  Filter,
  Calendar,
  User,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  Eye,
  X,
  CreditCard,
} from "lucide-react";
import { toast } from "react-hot-toast";

const Payments = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchTransactions();
  }, [page, search, statusFilter]);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const params = { page, page_size: 15 };
      if (search) params.search = search;
      if (statusFilter !== "ALL") params.status = statusFilter;

      const data = await getAdminTransactions(params);
      setTransactions(data.results || []);
      setTotalPages(Math.ceil(data.count / 15));
    } catch (err) {
      toast.error("Failed to load transactions");
    } finally {
      setLoading(false);
    }
  };

  const viewTransactionDetail = async (transaction) => {
    try {
      const detail = await getAdminTransactionDetail(transaction.id);
      setSelectedTransaction(detail);
      setShowDetailModal(true);
    } catch (err) {
      toast.error("Failed to load transaction details");
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "SUCCESS":
        return (
          <span className="flex items-center gap-1 px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-xs font-semibold border border-green-500/30">
            <CheckCircle className="w-3 h-3" />
            Success
          </span>
        );
      case "FAILED":
        return (
          <span className="flex items-center gap-1 px-3 py-1 bg-red-500/20 text-red-400 rounded-full text-xs font-semibold border border-red-500/30">
            <XCircle className="w-3 h-3" />
            Failed
          </span>
        );
      case "INITIATED":
      case "PENDING":
        return (
          <span className="flex items-center gap-1 px-3 py-1 bg-yellow-500/20 text-yellow-400 rounded-full text-xs font-semibold border border-yellow-500/30">
            <Clock className="w-3 h-3" />
            {status}
          </span>
        );
      default:
        return (
          <span className="flex items-center gap-1 px-3 py-1 bg-gray-500/20 text-gray-400 rounded-full text-xs font-semibold border border-gray-500/30">
            <AlertCircle className="w-3 h-3" />
            {status}
          </span>
        );
    }
  };

  const getTotalAmount = () => {
    return transactions
      .filter((t) => t.status === "SUCCESS")
      .reduce((sum, t) => sum + parseFloat(t.amount), 0);
  };

  const getSuccessRate = () => {
    if (transactions.length === 0) return 0;
    const successCount = transactions.filter((t) => t.status === "SUCCESS").length;
    return ((successCount / transactions.length) * 100).toFixed(1);
  };

  if (loading && transactions.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-green-900 to-slate-900 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-green-900 to-slate-900 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-5xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent mb-2">
            Payment Transactions
          </h1>
          <p className="text-gray-400 text-lg">
            Monitor all payment transactions and their status
          </p>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Total Processed</p>
                <p className="text-2xl font-bold text-white">
                  ${getTotalAmount().toLocaleString()}
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl">
                <CreditCard className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Total Transactions</p>
                <p className="text-2xl font-bold text-white">{transactions.length}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Success Rate</p>
                <p className="text-2xl font-bold text-white">{getSuccessRate()}%</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 space-y-4"
        >
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by reference ID, investor, or project..."
              className="w-full pl-12 pr-4 py-4 bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl text-white placeholder-gray-400 focus:border-green-500 focus:outline-none"
            />
          </div>

          {/* Status Filters */}
          <div className="flex gap-3 overflow-x-auto pb-2">
            {["ALL", "SUCCESS", "FAILED", "INITIATED", "PENDING"].map((status) => (
              <button
                key={status}
                onClick={() => {
                  setStatusFilter(status);
                  setPage(1);
                }}
                className={`px-6 py-3 rounded-xl font-semibold whitespace-nowrap transition-all ${
                  statusFilter === status
                    ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg shadow-green-500/50"
                    : "bg-slate-700/50 text-gray-300 hover:bg-slate-700"
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Transactions List */}
        {transactions.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-12 text-center"
          >
            <CreditCard className="w-20 h-20 text-green-400 mx-auto mb-4 opacity-50" />
            <h2 className="text-2xl font-bold text-white mb-2">No Transactions Found</h2>
            <p className="text-gray-400">Try adjusting your search or filters</p>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {transactions.map((transaction, index) => (
              <motion.div
                key={transaction.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 hover:border-green-500/50 transition-all"
              >
                <div className="flex flex-col lg:flex-row gap-6">
                  {/* Transaction Info */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-white mb-2">
                          {transaction.project_title}
                        </h3>
                        <div className="flex items-center gap-4 text-sm text-gray-400">
                          <span className="flex items-center gap-1">
                            <User className="w-4 h-4" />
                            {transaction.investor_email}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {new Date(transaction.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      {getStatusBadge(transaction.status)}
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="bg-slate-700/30 p-3 rounded-lg">
                        <p className="text-gray-400 text-xs mb-1">Reference ID</p>
                        <p className="text-white font-mono text-sm truncate">
                          {transaction.reference_id}
                        </p>
                      </div>
                      <div className="bg-slate-700/30 p-3 rounded-lg">
                        <p className="text-gray-400 text-xs mb-1">Amount</p>
                        <p className="text-white font-bold text-lg">
                          ${parseFloat(transaction.amount).toLocaleString()}
                        </p>
                      </div>
                      <div className="bg-slate-700/30 p-3 rounded-lg">
                        <p className="text-gray-400 text-xs mb-1">Has Purchase</p>
                        <p className="text-white font-semibold">
                          {transaction.has_share_purchase || "N/A"}
                        </p>
                      </div>
                      <div className="bg-slate-700/30 p-3 rounded-lg">
                        <p className="text-gray-400 text-xs mb-1">Processed At</p>
                        <p className="text-white font-semibold text-sm">
                          {transaction.processed_at
                            ? new Date(transaction.processed_at).toLocaleTimeString()
                            : "-"}
                        </p>
                      </div>
                    </div>

                    {transaction.failure_reason && (
                      <div className="mt-4 bg-red-500/10 border border-red-500/30 rounded-lg p-3">
                        <p className="text-red-400 text-sm">
                          <strong>Failure Reason:</strong> {transaction.failure_reason}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-3 lg:w-48">
                    <button
                      onClick={() => viewTransactionDetail(transaction)}
                      className="flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl font-semibold hover:from-green-600 hover:to-emerald-600 transition-all shadow-lg hover:shadow-green-500/50"
                    >
                      <Eye className="w-5 h-5" />
                      View Details
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-8">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-4 py-2 bg-slate-700 text-white rounded-lg disabled:opacity-50 hover:bg-slate-600 transition-colors"
            >
              Previous
            </button>
            <span className="px-4 py-2 bg-slate-800 text-white rounded-lg">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-4 py-2 bg-slate-700 text-white rounded-lg disabled:opacity-50 hover:bg-slate-600 transition-colors"
            >
              Next
            </button>
          </div>
        )}
      </div>

      {/* Transaction Detail Modal */}
      <AnimatePresence>
        {showDetailModal && selectedTransaction && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowDetailModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-slate-800 border border-slate-700 rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">Transaction Details</h2>
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="bg-slate-700/30 rounded-xl p-4">
                  <p className="text-gray-400 text-sm mb-1">Reference ID</p>
                  <p className="text-white text-lg font-mono">
                    {selectedTransaction.reference_id}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-700/30 rounded-xl p-4">
                    <p className="text-gray-400 text-sm mb-1">Investor</p>
                    <p className="text-white font-semibold">
                      {selectedTransaction.investor_email}
                    </p>
                  </div>
                  <div className="bg-slate-700/30 rounded-xl p-4">
                    <p className="text-gray-400 text-sm mb-1">Project</p>
                    <p className="text-white font-semibold">
                      {selectedTransaction.project_title}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-700/30 rounded-xl p-4">
                    <p className="text-gray-400 text-sm mb-1">Amount</p>
                    <p className="text-2xl font-bold text-green-400">
                      ${parseFloat(selectedTransaction.amount).toLocaleString()}
                    </p>
                  </div>
                  <div className="bg-slate-700/30 rounded-xl p-4">
                    <p className="text-gray-400 text-sm mb-1">Status</p>
                    {getStatusBadge(selectedTransaction.status)}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-700/30 rounded-xl p-4">
                    <p className="text-gray-400 text-sm mb-1">Created At</p>
                    <p className="text-white">
                      {new Date(selectedTransaction.created_at).toLocaleString()}
                    </p>
                  </div>
                  <div className="bg-slate-700/30 rounded-xl p-4">
                    <p className="text-gray-400 text-sm mb-1">Processed At</p>
                    <p className="text-white">
                      {selectedTransaction.processed_at
                        ? new Date(selectedTransaction.processed_at).toLocaleString()
                        : "Not processed"}
                    </p>
                  </div>
                </div>

                <div className="bg-slate-700/30 rounded-xl p-4">
                  <p className="text-gray-400 text-sm mb-1">Share Purchase Created</p>
                  <p className="text-white font-semibold">
                    {selectedTransaction.has_share_purchase || "No"}
                  </p>
                </div>

                {selectedTransaction.failure_reason && (
                  <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
                    <p className="text-red-400 text-sm mb-1">Failure Reason</p>
                    <p className="text-white">{selectedTransaction.failure_reason}</p>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Payments;