import React, { useEffect, useState } from "react";
import adminService from "../../api/adminService";
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
  ArrowLeft,
  ArrowUpRight,
  ShieldCheck,
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

      const data = await adminService.getTransactions(params);
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
      const detail = await adminService.getTransactionDetail(transaction.id);
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

  const handleApprove = async (id) => {
    try {
      setLoading(true);
      await adminService.approveInvestment(id);
      toast.success("Investment approved successfully!");
      setShowDetailModal(false);
      fetchTransactions();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to approve investment");
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async (id) => {
    const reason = window.prompt("Enter rejection reason:");
    if (!reason) return;

    try {
      setLoading(true);
      await adminService.rejectInvestment(id, reason);
      toast.success("Investment rejected.");
      setShowDetailModal(false);
      fetchTransactions();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to reject investment");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 p-8 relative overflow-hidden">
      {/* Background Texture */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-green-500/10 via-transparent to-transparent blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6"
        >
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-green-500/20 rounded-lg">
                <DollarSign className="w-8 h-8 text-green-400" />
              </div>
              <h1 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent tracking-tight">
                Acquisition Control
              </h1>
            </div>
            <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] ml-1">Central Investment Registry & Verification</p>
          </div>
          <div className="flex gap-4">
            <div className="px-6 py-3 bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl flex flex-col">
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Global Payout</span>
              <span className="text-xl font-black text-white">${getTotalAmount().toLocaleString()}</span>
            </div>
          </div>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 space-y-6"
        >
          {/* Search */}
          <div className="relative group">
            <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 text-slate-500 w-5 h-5 group-focus-within:text-green-400 transition-colors" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search Ledger: Token, Email, or Project Asset..."
              className="w-full pl-16 pr-6 py-5 bg-slate-900/50 backdrop-blur-3xl border border-slate-800 rounded-3xl text-white placeholder-slate-600 focus:border-green-500 focus:outline-none transition-all shadow-2xl"
            />
          </div>

          {/* Status Filters */}
          <div className="flex gap-4 overflow-x-auto pb-2 no-scrollbar">
            {["ALL", "SUCCESS", "FAILED", "INITIATED", "PENDING"].map((status) => (
              <button
                key={status}
                onClick={() => {
                  setStatusFilter(status);
                  setPage(1);
                }}
                className={`px-8 py-3.5 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all relative overflow-hidden ${statusFilter === status
                  ? "bg-green-600 text-slate-950 shadow-[0_0_20px_rgba(34,197,94,0.3)]"
                  : "bg-slate-900/50 text-slate-500 border border-slate-800 hover:border-slate-700 hover:text-white"
                  }`}
              >
                {status}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Transactions Grid */}
        {transactions.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-[3rem] p-24 text-center"
          >
            <AlertCircle className="w-20 h-20 text-slate-800 mx-auto mb-6" />
            <h2 className="text-2xl font-black text-white mb-2 uppercase tracking-tight">Ledger Empty</h2>
            <p className="text-slate-500 font-medium">No transaction records match the current criteria.</p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {transactions.map((transaction, index) => (
              <motion.div
                key={transaction.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-slate-900/40 backdrop-blur-xl border border-slate-800/50 rounded-3xl p-6 group hover:bg-slate-900/80 hover:border-green-500/30 transition-all duration-300"
              >
                <div className="flex flex-col lg:flex-row items-center gap-8">
                  <div className="w-12 h-12 bg-slate-800 rounded-2xl flex items-center justify-center shrink-0 border border-white/5 group-hover:bg-green-500/10 transition-colors">
                    <CreditCard className="text-slate-500 group-hover:text-green-400" size={24} />
                  </div>

                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center gap-3">
                      <h3 className="text-lg font-black text-white truncate group-hover:text-green-400 transition-colors tracking-tight">
                        {transaction.project_title}
                      </h3>
                      <div className="h-1 w-1 bg-slate-700 rounded-full" />
                      {getStatusBadge(transaction.status)}
                    </div>
                    <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-slate-500">
                      <span className="flex items-center gap-1.5"><User size={12} /> {transaction.investor_email}</span>
                      <span className="flex items-center gap-1.5"><Calendar size={12} /> {new Date(transaction.created_at).toLocaleDateString()}</span>
                      <span className="text-slate-700 font-mono">#{transaction.reference_id}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-8 w-full lg:w-auto border-t lg:border-t-0 border-slate-800 pt-4 lg:pt-0">
                    <div className="text-right">
                      <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Acquisition Val</p>
                      <p className="text-2xl font-black text-white tracking-tighter">${parseFloat(transaction.amount).toLocaleString()}</p>
                    </div>
                    <button
                      onClick={() => viewTransactionDetail(transaction)}
                      className="px-6 py-3.5 bg-slate-800 hover:bg-slate-700 text-white rounded-2xl transition-all font-black text-[10px] uppercase tracking-widest flex items-center gap-2 border border-white/5"
                    >
                      Verify <Eye size={14} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-12 flex justify-center items-center gap-4 bg-slate-900/50 backdrop-blur-xl border border-slate-800 w-fit mx-auto p-2 rounded-2xl shadow-2xl">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="p-3 bg-slate-800 text-white rounded-xl disabled:opacity-30 hover:bg-slate-700 transition-all border border-slate-700"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div className="bg-slate-950 px-4 py-2 rounded-xl border border-slate-800">
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Page <span className="text-white">{page}</span> of <span className="text-white">{totalPages}</span></span>
            </div>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="p-3 bg-slate-800 text-white rounded-xl disabled:opacity-30 hover:bg-slate-700 transition-all border border-slate-700"
            >
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Transaction Detail Modal - REFINED PREMIUM */}
      <AnimatePresence>
        {showDetailModal && selectedTransaction && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-950/90 backdrop-blur-2xl flex items-center justify-center z-50 p-4"
            onClick={() => setShowDetailModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-slate-900 border border-slate-800 rounded-[3rem] p-10 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-[0_50px_100px_-20px_rgba(0,0,0,0.8)] relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
                <DollarSign size={200} />
              </div>

              <div className="flex items-center justify-between mb-10 relative z-10">
                <h2 className="text-2xl font-black text-white uppercase tracking-tighter flex items-center gap-3">
                  <ShieldCheck className="text-green-500" />
                  Acquisition Audit
                </h2>
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="p-3 bg-slate-800 hover:bg-slate-700 rounded-2xl transition-all border border-white/5"
                >
                  <X className="w-5 h-5 text-slate-400" />
                </button>
              </div>

              <div className="space-y-6 relative z-10">
                <div className="bg-slate-950/50 p-8 rounded-[2rem] border border-white/5 shadow-inner">
                  <div className="grid grid-cols-2 gap-8">
                    <div className="space-y-1">
                      <p className="text-[8px] font-black text-slate-600 uppercase tracking-widest">Protocol Reference</p>
                      <p className="text-xs font-mono font-bold text-green-400 truncate">{selectedTransaction.reference_id}</p>
                    </div>
                    <div className="space-y-1 text-right">
                      <p className="text-[8px] font-black text-slate-600 uppercase tracking-widest">Acquisition Status</p>
                      {getStatusBadge(selectedTransaction.status)}
                    </div>
                  </div>
                  <div className="mt-8 pt-8 border-t border-white/5 flex justify-between items-end">
                    <div className="space-y-1">
                      <p className="text-[8px] font-black text-slate-600 uppercase tracking-widest">Settlement Value</p>
                      <p className="text-4xl font-black text-white tracking-tighter">${parseFloat(selectedTransaction.amount).toLocaleString()}</p>
                    </div>
                    <div className="px-5 py-2.5 bg-green-500/10 rounded-xl border border-green-500/20">
                      <span className="text-[10px] font-black text-green-400 uppercase tracking-widest">USDC SETTLED</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="p-6 bg-slate-800/40 rounded-3xl border border-white/5">
                    <p className="text-[8px] font-black text-slate-600 uppercase mb-2">Investor Hub</p>
                    <p className="text-sm font-black text-white truncate">{selectedTransaction.investor_email}</p>
                  </div>
                  <div className="p-6 bg-slate-800/40 rounded-3xl border border-white/5">
                    <p className="text-[8px] font-black text-slate-600 uppercase mb-2">Target Asset</p>
                    <p className="text-sm font-black text-white truncate">{selectedTransaction.project_title}</p>
                  </div>
                </div>

                {selectedTransaction.failure_reason && (
                  <div className="p-6 bg-rose-500/5 border border-rose-500/20 rounded-3xl">
                    <p className="text-[8px] font-black text-rose-500 uppercase mb-2 tracking-[0.2em]">Acquisition Failure Reason</p>
                    <p className="text-sm text-rose-200/50 font-medium">{selectedTransaction.failure_reason}</p>
                  </div>
                )}

                {/* ACTION BUTTONS FOR ADMIN APPROVAL */}
                {(selectedTransaction.status === "PENDING" || selectedTransaction.status === "INITIATED") && (
                  <div className="grid grid-cols-2 gap-6 pt-6 mt-6 border-t border-white/10">
                    <button
                      onClick={() => handleReject(selectedTransaction.id)}
                      className="flex items-center justify-center gap-2 py-5 bg-rose-600/10 hover:bg-rose-600/20 text-rose-500 rounded-3xl font-black text-[10px] uppercase tracking-[0.2em] border border-rose-500/20 transition-all active:scale-95"
                    >
                      <XCircle size={14} /> Reject Acquisition
                    </button>
                    <button
                      onClick={() => handleApprove(selectedTransaction.id)}
                      className="flex items-center justify-center gap-2 py-5 bg-green-600 hover:bg-green-500 text-slate-950 rounded-3xl font-black text-[10px] uppercase tracking-[0.2em] shadow-[0_20px_40px_-10px_rgba(34,197,94,0.4)] transition-all active:scale-95"
                    >
                      <CheckCircle size={14} /> Approve & Allocate
                    </button>
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