import React, { useEffect, useState } from "react";
import {
  getAdminPendingProjects,
  approveProject,
  rejectProject,
  requestProjectChanges,
  getProjectDetail,
} from "../../services/api";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle,
  XCircle,
  Edit,
  Eye,
  Calendar,
  DollarSign,
  TrendingUp,
  User,
  MessageSquare,
  X,
} from "lucide-react";
import { toast } from "react-hot-toast";

const PendingProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(null);
  const [reason, setReason] = useState("");
  const [note, setNote] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchPendingProjects();
  }, [page]);

  const fetchPendingProjects = async () => {
    try {
      setLoading(true);
      const res = await getAdminPendingProjects({ page, page_size: 10 });
      // Handle potential { success: true, data: { ... } } wrapper
      const data = res.data || res;
      setProjects(data.results || []);
      setTotalPages(Math.ceil((data.count || 0) / 10));
    } catch (err) {
      console.error("PendingProjects fetch error:", err);
      toast.error("Failed to load pending projects");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      await approveProject(id);
      toast.success("Project approved successfully!");
      fetchPendingProjects();
      setShowModal(false);
    } catch (err) {
      toast.error(err.response?.data?.detail || "Failed to approve project");
    }
  };

  const handleReject = async () => {
    if (!reason.trim()) {
      toast.error("Please provide a reason for rejection");
      return;
    }
    try {
      await rejectProject(selectedProject.id, reason);
      toast.success("Project rejected");
      fetchPendingProjects();
      setShowModal(false);
      setReason("");
    } catch (err) {
      toast.error("Failed to reject project");
    }
  };

  const handleRequestChanges = async () => {
    if (!note.trim()) {
      toast.error("Please provide a note about required changes");
      return;
    }
    try {
      await requestProjectChanges(selectedProject.id, note);
      toast.success("Change request sent to developer");
      fetchPendingProjects();
      setShowModal(false);
      setNote("");
    } catch (err) {
      toast.error("Failed to request changes");
    }
  };

  const openModal = (project, type) => {
    setSelectedProject(project);
    setModalType(type);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedProject(null);
    setModalType(null);
    setReason("");
    setNote("");
  };

  if (loading && projects.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-5xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent mb-2">
            Pending Projects Review
          </h1>
          <p className="text-gray-400 text-lg">
            {projects.length} project{projects.length !== 1 ? "s" : ""} awaiting your review
          </p>
        </motion.div>

        {/* Projects List */}
        {projects.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-12 text-center"
          >
            <CheckCircle className="w-20 h-20 text-green-400 mx-auto mb-4 opacity-50" />
            <h2 className="text-2xl font-bold text-white mb-2">All Caught Up!</h2>
            <p className="text-gray-400">No pending projects to review at the moment.</p>
          </motion.div>
        ) : (
          <div className="space-y-6">
            {projects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 hover:border-indigo-500/50 transition-all"
              >
                <div className="flex flex-col lg:flex-row gap-6">
                  {/* Project Info */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-2xl font-bold text-white mb-2">
                          {project.title}
                        </h3>
                        <div className="flex items-center gap-4 text-sm text-gray-400">
                          <span className="flex items-center gap-1">
                            <User className="w-4 h-4" />
                            {project.developer_name}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {new Date(project.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <span className="px-3 py-1 bg-yellow-500/20 text-yellow-400 rounded-full text-sm font-semibold">
                        {project.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div className="bg-slate-700/30 p-3 rounded-lg">
                        <p className="text-gray-400 text-xs mb-1">Category</p>
                        <p className="text-white font-semibold">{project.category}</p>
                      </div>
                      <div className="bg-slate-700/30 p-3 rounded-lg">
                        <p className="text-gray-400 text-xs mb-1">Duration</p>
                        <p className="text-white font-semibold">{project.duration_days} days</p>
                      </div>
                      <div className="bg-slate-700/30 p-3 rounded-lg">
                        <p className="text-gray-400 text-xs mb-1">Total Value</p>
                        <p className="text-white font-semibold">
                          ${parseFloat(project.total_project_value).toLocaleString()}
                        </p>
                      </div>
                      <div className="bg-slate-700/30 p-3 rounded-lg">
                        <p className="text-gray-400 text-xs mb-1">Total Shares</p>
                        <p className="text-white font-semibold">
                          {project.total_shares.toLocaleString()}
                        </p>
                      </div>
                    </div>

                    <div className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/30 rounded-lg p-3">
                      <p className="text-gray-300 text-sm">
                        <span className="text-indigo-400 font-semibold">Share Price: </span>
                        ${parseFloat(project.share_price).toFixed(2)}
                      </p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col gap-3 lg:w-48">
                    <button
                      onClick={() => handleApprove(project.id)}
                      className="flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl font-semibold hover:from-green-600 hover:to-emerald-600 transition-all shadow-lg hover:shadow-green-500/50"
                    >
                      <CheckCircle className="w-5 h-5" />
                      Approve
                    </button>
                    <button
                      onClick={() => openModal(project, "reject")}
                      className="flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-xl font-semibold hover:from-red-600 hover:to-pink-600 transition-all shadow-lg hover:shadow-red-500/50"
                    >
                      <XCircle className="w-5 h-5" />
                      Reject
                    </button>
                    <button
                      onClick={() => openModal(project, "changes")}
                      className="flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-orange-500 to-yellow-500 text-white rounded-xl font-semibold hover:from-orange-600 hover:to-yellow-600 transition-all shadow-lg hover:shadow-orange-500/50"
                    >
                      <Edit className="w-5 h-5" />
                      Request Changes
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
                  {modalType === "reject" ? "Reject Project" : "Request Changes"}
                </h2>
                <button
                  onClick={closeModal}
                  className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>

              {modalType === "reject" ? (
                <>
                  <p className="text-gray-400 mb-4">
                    Please provide a reason for rejecting "{selectedProject?.title}"
                  </p>
                  <textarea
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    className="w-full h-32 bg-slate-700 text-white rounded-xl p-4 border border-slate-600 focus:border-red-500 focus:outline-none resize-none"
                    placeholder="Enter rejection reason..."
                  />
                  <div className="flex gap-3 mt-6">
                    <button
                      onClick={handleReject}
                      className="flex-1 px-4 py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-xl font-semibold hover:from-red-600 hover:to-pink-600 transition-all"
                    >
                      Confirm Rejection
                    </button>
                    <button
                      onClick={closeModal}
                      className="px-4 py-3 bg-slate-700 text-white rounded-xl hover:bg-slate-600 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <p className="text-gray-400 mb-4">
                    Specify what changes are needed for "{selectedProject?.title}"
                  </p>
                  <textarea
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    className="w-full h-32 bg-slate-700 text-white rounded-xl p-4 border border-slate-600 focus:border-orange-500 focus:outline-none resize-none"
                    placeholder="Enter required changes..."
                  />
                  <div className="flex gap-3 mt-6">
                    <button
                      onClick={handleRequestChanges}
                      className="flex-1 px-4 py-3 bg-gradient-to-r from-orange-500 to-yellow-500 text-white rounded-xl font-semibold hover:from-orange-600 hover:to-yellow-600 transition-all"
                    >
                      Send Request
                    </button>
                    <button
                      onClick={closeModal}
                      className="px-4 py-3 bg-slate-700 text-white rounded-xl hover:bg-slate-600 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PendingProjects;