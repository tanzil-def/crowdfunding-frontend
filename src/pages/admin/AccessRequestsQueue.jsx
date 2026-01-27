import React, { useEffect, useState } from "react";
import adminService from "../../api/adminService";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle,
  XCircle,
  Lock,
  Unlock,
  User,
  Calendar,
  MessageSquare,
  X,
  AlertCircle,
  Search,
} from "lucide-react";
import { toast } from "react-hot-toast";

const AccessRequestsQueue = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(null);
  const [reason, setReason] = useState("");
  const [filter, setFilter] = useState("PENDING");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchAccessRequests();
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [page, filter, searchTerm]);

  const fetchAccessRequests = async () => {
    try {
      setLoading(true);
      const params = { page, page_size: 10 };
      if (filter !== "ALL") {
        params.status = filter;
      }
      if (searchTerm.trim()) {
        params.search = searchTerm;
      }
      const data = await adminService.getAccessRequests(params);
      setRequests(data.results || []);
      setTotalPages(Math.ceil((data.count || 0) / 10));
    } catch (err) {
      console.error("AccessRequests fetch error:", err);
      toast.error("Failed to load access requests");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      await adminService.approveAccessRequest(id);
      toast.success("Access request approved!");
      fetchAccessRequests();
    } catch (err) {
      toast.error("Failed to approve request");
    }
  };

  const handleReject = async () => {
    if (!reason.trim()) {
      toast.error("Please provide a reason for rejection");
      return;
    }
    try {
      await adminService.rejectAccessRequest(selectedRequest.id, reason);
      toast.success("Access request rejected");
      fetchAccessRequests();
      closeModal();
    } catch (err) {
      toast.error("Failed to reject request");
    }
  };

  const handleRevoke = async () => {
    if (!reason.trim()) {
      toast.error("Please provide a reason for revocation");
      return;
    }
    try {
      await adminService.revokeAccessRequest(selectedRequest.id, reason);
      toast.success("Access revoked");
      fetchAccessRequests();
      closeModal();
    } catch (err) {
      toast.error("Failed to revoke access");
    }
  };

  const openModal = (request, type) => {
    setSelectedRequest(request);
    setModalType(type);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedRequest(null);
    setModalType(null);
    setReason("");
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      case "APPROVED":
        return "bg-green-500/20 text-green-400 border-green-500/30";
      case "REJECTED":
        return "bg-red-500/20 text-red-400 border-red-500/30";
      case "REVOKED":
        return "bg-orange-500/20 text-orange-400 border-orange-500/30";
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "PENDING":
        return <AlertCircle className="w-5 h-5" />;
      case "APPROVED":
        return <Unlock className="w-5 h-5" />;
      case "REJECTED":
        return <XCircle className="w-5 h-5" />;
      case "REVOKED":
        return <Lock className="w-5 h-5" />;
      default:
        return <AlertCircle className="w-5 h-5" />;
    }
  };

  if (loading && requests.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-cyan-900 to-slate-900 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-cyan-900 to-slate-900 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-5xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent mb-2">
            Access Requests Management
          </h1>
          <p className="text-gray-400 text-lg">
            Review and manage restricted data access requests
          </p>
        </motion.div>

        {/* Filters and Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 flex flex-col md:flex-row gap-6 items-start md:items-center justify-between"
        >
          <div className="flex gap-3 overflow-x-auto pb-2 w-full md:w-auto">
            {["ALL", "PENDING", "APPROVED", "REJECTED", "REVOKED"].map((status) => (
              <button
                key={status}
                onClick={() => {
                  setFilter(status);
                  setPage(1);
                }}
                className={`px-6 py-3 rounded-xl font-semibold transition-all whitespace-nowrap ${filter === status
                  ? "bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg shadow-cyan-500/50"
                  : "bg-slate-700/50 text-gray-300 hover:bg-slate-700"
                  }`}
              >
                {status}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search project or investor..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPage(1);
              }}
              className="w-full bg-slate-800/50 border border-slate-700/50 rounded-xl py-3 pl-12 pr-4 text-white focus:border-cyan-500 outline-none transition-all placeholder:text-gray-500"
            />
          </div>
        </motion.div>

        {/* Requests List */}
        {requests.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-12 text-center"
          >
            <Lock className="w-20 h-20 text-cyan-400 mx-auto mb-4 opacity-50" />
            <h2 className="text-2xl font-bold text-white mb-2">No Access Requests</h2>
            <p className="text-gray-400">
              No {filter.toLowerCase()} access requests at the moment.
            </p>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {requests.map((request, index) => (
              <motion.div
                key={request.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 hover:border-cyan-500/50 transition-all"
              >
                <div className="flex flex-col lg:flex-row gap-6">
                  {/* Request Info */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-white mb-2">
                          {request.project_title}
                        </h3>
                        <div className="flex items-center gap-4 text-sm text-gray-400 mb-3">
                          <span className="flex items-center gap-1">
                            <User className="w-4 h-4" />
                            Investor: {request.investor_email || "N/A"}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {new Date(request.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <div
                        className={`flex items-center gap-2 px-4 py-2 rounded-full border ${getStatusColor(
                          request.status
                        )}`}
                      >
                        {getStatusIcon(request.status)}
                        <span className="font-semibold">{request.status}</span>
                      </div>
                    </div>

                    {request.reason && (
                      <div className="bg-slate-700/30 rounded-lg p-4 mb-4">
                        <p className="text-gray-400 text-sm mb-1 flex items-center gap-2">
                          <MessageSquare className="w-4 h-4" />
                          Request Reason:
                        </p>
                        <p className="text-white">{request.reason}</p>
                      </div>
                    )}

                    {request.admin_note && (
                      <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-4">
                        <p className="text-cyan-400 text-sm mb-1 flex items-center gap-2">
                          <MessageSquare className="w-4 h-4" />
                          Admin Note:
                        </p>
                        <p className="text-white">{request.admin_note}</p>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  {request.status === "PENDING" && (
                    <div className="flex flex-col gap-3 lg:w-48">
                      <button
                        onClick={() => handleApprove(request.id)}
                        className="flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl font-semibold hover:from-green-600 hover:to-emerald-600 transition-all shadow-lg hover:shadow-green-500/50"
                      >
                        <CheckCircle className="w-5 h-5" />
                        Approve
                      </button>
                      <button
                        onClick={() => openModal(request, "reject")}
                        className="flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-xl font-semibold hover:from-red-600 hover:to-pink-600 transition-all shadow-lg hover:shadow-red-500/50"
                      >
                        <XCircle className="w-5 h-5" />
                        Reject
                      </button>
                    </div>
                  )}

                  {request.status === "APPROVED" && (
                    <div className="flex flex-col gap-3 lg:w-48">
                      <button
                        onClick={() => openModal(request, "revoke")}
                        className="flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-semibold hover:from-orange-600 hover:to-red-600 transition-all shadow-lg hover:shadow-orange-500/50"
                      >
                        <Lock className="w-5 h-5" />
                        Revoke Access
                      </button>
                    </div>
                  )}
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

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={closeModal}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-slate-800 border border-slate-700 rounded-2xl p-8 max-w-md w-full"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">
                  {modalType === "reject" ? "Reject Access Request" : "Revoke Access"}
                </h2>
                <button
                  onClick={closeModal}
                  className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>

              <p className="text-gray-400 mb-4">
                {modalType === "reject"
                  ? "Provide a reason for rejecting this access request:"
                  : "Provide a reason for revoking access:"}
              </p>

              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full h-32 bg-slate-700 text-white rounded-xl p-4 border border-slate-600 focus:border-cyan-500 focus:outline-none resize-none"
                placeholder="Enter reason..."
              />

              <div className="flex gap-3 mt-6">
                <button
                  onClick={modalType === "reject" ? handleReject : handleRevoke}
                  className={`flex-1 px-4 py-3 bg-gradient-to-r ${modalType === "reject"
                    ? "from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600"
                    : "from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
                    } text-white rounded-xl font-semibold transition-all`}
                >
                  Confirm {modalType === "reject" ? "Rejection" : "Revocation"}
                </button>
                <button
                  onClick={closeModal}
                  className="px-4 py-3 bg-slate-700 text-white rounded-xl hover:bg-slate-600 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AccessRequestsQueue;