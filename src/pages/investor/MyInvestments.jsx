import React, { useEffect, useState } from "react";
import investorService from "../../api/investorService";
import { motion, AnimatePresence } from "framer-motion";
import {
  TrendingUp,
  DollarSign,
  Calendar,
  FileText,
  Download,
  Eye,
  X,
  CheckCircle,
  Clock,
  XCircle,
} from "lucide-react";
import { toast } from "react-hot-toast";

const MyInvestments = () => {
  const [investments, setInvestments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedInvestment, setSelectedInvestment] = useState(null);
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchInvestments();
  }, [page]);

  const fetchInvestments = async () => {
    try {
      setLoading(true);
      const data = await investorService.getMyInvestments({ page, page_size: 10 });
      setInvestments(data.results || []);
      setTotalPages(Math.ceil(data.count / 10));
    } catch (err) {
      toast.error("Failed to load investments");
    } finally {
      setLoading(false);
    }
  };

  const viewReceipt = async (investment) => {
    try {
      const detail = await investorService.getInvestmentDetail(investment.id);
      setSelectedInvestment(detail);
      setShowReceiptModal(true);
    } catch (err) {
      toast.error("Failed to load receipt");
    }
  };

  const getPaymentStatusBadge = (status) => {
    switch (status?.toUpperCase()) {
      case "SUCCESS":
        return (
          <span className="flex items-center gap-1 px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-xs font-semibold">
            <CheckCircle className="w-3 h-3" />
            Success
          </span>
        );
      case "PENDING":
        return (
          <span className="flex items-center gap-1 px-3 py-1 bg-yellow-500/20 text-yellow-400 rounded-full text-xs font-semibold">
            <Clock className="w-3 h-3" />
            Pending
          </span>
        );
      case "FAILED":
        return (
          <span className="flex items-center gap-1 px-3 py-1 bg-red-500/20 text-red-400 rounded-full text-xs font-semibold">
            <XCircle className="w-3 h-3" />
            Failed
          </span>
        );
      default:
        return (
          <span className="px-3 py-1 bg-gray-500/20 text-gray-400 rounded-full text-xs font-semibold">
            {status}
          </span>
        );
    }
  };

  if (loading && investments.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-2">
            My Investments
          </h1>
          <p className="text-gray-400 text-lg">
            Track all your investment transactions and receipts
          </p>
        </motion.div>

        {/* Investments List */}
        {investments.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-12 text-center"
          >
            <FileText className="w-20 h-20 text-blue-400 mx-auto mb-4 opacity-50" />
            <h2 className="text-2xl font-bold text-white mb-2">No Investments Yet</h2>
            <p className="text-gray-400">Start investing in projects to see them here.</p>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {investments.map((investment, index) => (
              <motion.div
                key={investment.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 hover:border-blue-500/50 transition-all"
              >
                <div className="flex flex-col lg:flex-row gap-6">
                  {/* Investment Info */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-white mb-2">
                          {investment.project_title}
                        </h3>
                        <div className="flex items-center gap-4 text-sm text-gray-400">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {new Date(investment.created_at).toLocaleDateString()}
                          </span>
                          <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded-full text-xs">
                            {investment.project_category}
                          </span>
                        </div>
                      </div>
                      {getPaymentStatusBadge(investment.payment_status)}
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="bg-slate-700/30 p-3 rounded-lg">
                        <p className="text-gray-400 text-xs mb-1">Shares Purchased</p>
                        <p className="text-white font-bold text-lg">
                          {investment.shares_purchased.toLocaleString()}
                        </p>
                      </div>
                      <div className="bg-slate-700/30 p-3 rounded-lg">
                        <p className="text-gray-400 text-xs mb-1">Price per Share</p>
                        <p className="text-white font-bold text-lg">
                          ${parseFloat(investment.price_per_share).toFixed(2)}
                        </p>
                      </div>
                      <div className="bg-slate-700/30 p-3 rounded-lg">
                        <p className="text-gray-400 text-xs mb-1">Total Investment</p>
                        <p className="text-white font-bold text-lg">
                          ${parseFloat(investment.total_amount).toLocaleString()}
                        </p>
                      </div>
                      <div className="bg-slate-700/30 p-3 rounded-lg">
                        <p className="text-gray-400 text-xs mb-1">Reference</p>
                        <p className="text-white font-mono text-xs truncate">
                          {investment.payment_reference || "N/A"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col gap-3 lg:w-48">
                    <button
                      onClick={() => viewReceipt(investment)}
                      className="flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl font-semibold hover:from-blue-600 hover:to-cyan-600 transition-all shadow-lg hover:shadow-blue-500/50"
                    >
                      <Eye className="w-5 h-5" />
                      View Receipt
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

      {/* Receipt Modal */}
      <AnimatePresence>
        {showReceiptModal && selectedInvestment && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowReceiptModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-slate-800 border border-slate-700 rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              {/* Receipt Header */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-white">Investment Receipt</h2>
                  <p className="text-gray-400 text-sm">
                    Transaction ID: {selectedInvestment.id}
                  </p>
                </div>
                <button
                  onClick={() => setShowReceiptModal(false)}
                  className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>

              {/* Receipt Content */}
              <div className="space-y-6">
                {/* Project Details */}
                <div className="bg-slate-700/30 rounded-xl p-6">
                  <h3 className="text-white font-bold mb-4">Project Details</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Project Name</span>
                      <span className="text-white font-semibold">
                        {selectedInvestment.project_title}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Project Status</span>
                      <span className="text-white">{selectedInvestment.project_status}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Total Project Shares</span>
                      <span className="text-white">
                        {selectedInvestment.project_total_shares?.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Shares Sold</span>
                      <span className="text-white">
                        {selectedInvestment.project_shares_sold?.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Investment Details */}
                <div className="bg-slate-700/30 rounded-xl p-6">
                  <h3 className="text-white font-bold mb-4">Your Investment</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Shares Purchased</span>
                      <span className="text-white font-semibold">
                        {selectedInvestment.shares_purchased}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Price per Share</span>
                      <span className="text-white">
                        ${parseFloat(selectedInvestment.price_per_share).toFixed(2)}
                      </span>
                    </div>
                    <div className="border-t border-slate-600 pt-3 flex justify-between">
                      <span className="text-gray-400 font-semibold">Total Amount</span>
                      <span className="text-2xl font-bold text-blue-400">
                        ${parseFloat(selectedInvestment.total_amount).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Transaction Details */}
                <div className="bg-slate-700/30 rounded-xl p-6">
                  <h3 className="text-white font-bold mb-4">Transaction Details</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Date & Time</span>
                      <span className="text-white">
                        {new Date(selectedInvestment.created_at).toLocaleString()}
                      </span>
                    </div>
                    {selectedInvestment.payment_details && (
                      <div className="flex justify-between">
                        <span className="text-gray-400">Payment Details</span>
                        <span className="text-white font-mono text-xs">
                          {selectedInvestment.payment_details}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Download Button */}
                <button
                  onClick={() => toast.success("Receipt download feature coming soon")}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl font-semibold hover:from-blue-600 hover:to-cyan-600 transition-all"
                >
                  <Download className="w-5 h-5" />
                  Download Receipt (PDF)
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MyInvestments;