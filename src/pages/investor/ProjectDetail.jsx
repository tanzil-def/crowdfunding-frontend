import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getProjectDetail,
  requestRestrictedAccess,
  getProjectMedia,
  addToFavorites,
  removeFromFavorites,
} from "../../services/api";
import { motion, AnimatePresence } from "framer-motion";
import {
  DollarSign,
  Calendar,
  TrendingUp,
  Users,
  Lock,
  Unlock,
  Heart,
  Share2,
  ArrowLeft,
  AlertCircle,
  CheckCircle,
  Clock,
  Image as ImageIcon,
  Box,
  X,
} from "lucide-react";
import { toast } from "react-hot-toast";
import ThreeDViewer from "../../components/ThreeDViewer";
import { getMediaUrl } from "../../utils/media";

const ProjectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAccessModal, setShowAccessModal] = useState(false);
  const [accessReason, setAccessReason] = useState("");
  const [isFavorite, setIsFavorite] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    fetchProjectData();
  }, [id]);

  const fetchProjectData = async () => {
    try {
      setLoading(true);
      const [projectRes, mediaRes] = await Promise.all([
        getProjectDetail(id),
        getProjectMedia(id),
      ]);

      // Handle potential { success: true, data: { ... } } wrapper
      const projectData = projectRes.data || projectRes;

      setProject(projectData);
      setMedia(mediaRes.results || []);
    } catch (err) {
      console.error("Project Detail Error:", err);
      toast.error("Failed to load project details");
    } finally {
      setLoading(false);
    }
  };

  const handleRequestAccess = async () => {
    if (!accessReason.trim()) {
      toast.error("Please provide a reason for access request");
      return;
    }

    try {
      await requestRestrictedAccess(id, accessReason);
      toast.success("Access request submitted successfully!");
      setShowAccessModal(false);
      setAccessReason("");
      fetchProjectData(); // Refresh to show updated status
    } catch (err) {
      toast.error(err.response?.data?.detail || "Failed to submit access request");
    }
  };

  const handleToggleFavorite = async () => {
    try {
      if (isFavorite) {
        await removeFromFavorites(project.favorite_id);
        setIsFavorite(false);
        toast.success("Removed from favorites");
      } else {
        await addToFavorites(id);
        setIsFavorite(true);
        toast.success("Added to favorites");
      }
    } catch (err) {
      toast.error("Failed to update favorites");
    }
  };

  const getFundingColor = (percentage) => {
    if (percentage >= 75) return "from-green-500 to-emerald-500";
    if (percentage >= 50) return "from-blue-500 to-cyan-500";
    if (percentage >= 25) return "from-yellow-500 to-orange-500";
    return "from-orange-500 to-red-500";
  };

  if (loading) {
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

  if (!project) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-20 h-20 text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Project Not Found</h2>
          <button
            onClick={() => navigate("/investor/browse")}
            className="mt-4 px-6 py-3 bg-indigo-500 text-white rounded-xl hover:bg-indigo-600"
          >
            Browse Projects
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back
        </motion.button>

        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-8 mb-8"
        >
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="flex-1">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <span className="px-3 py-1 bg-indigo-500/20 text-indigo-400 rounded-full text-sm font-semibold">
                    {project.category}
                  </span>
                  <h1 className="text-4xl font-bold text-white mt-4 mb-2">
                    {project.title}
                  </h1>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleToggleFavorite}
                    className="p-3 bg-slate-700/50 hover:bg-slate-700 rounded-xl transition-colors"
                  >
                    <Heart
                      className={`w-6 h-6 ${isFavorite ? "fill-red-500 text-red-500" : "text-gray-400"
                        }`}
                    />
                  </button>
                  <button className="p-3 bg-slate-700/50 hover:bg-slate-700 rounded-xl transition-colors">
                    <Share2 className="w-6 h-6 text-gray-400" />
                  </button>
                </div>
              </div>

              <p className="text-gray-300 text-lg mb-6">{project.description}</p>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-slate-700/30 p-4 rounded-xl">
                  <div className="flex items-center gap-2 text-gray-400 mb-2">
                    <DollarSign className="w-4 h-4" />
                    <span className="text-sm">Total Value</span>
                  </div>
                  <p className="text-2xl font-bold text-white">
                    ${parseFloat(project.total_project_value).toLocaleString()}
                  </p>
                </div>
                <div className="bg-slate-700/30 p-4 rounded-xl">
                  <div className="flex items-center gap-2 text-gray-400 mb-2">
                    <TrendingUp className="w-4 h-4" />
                    <span className="text-sm">Share Price</span>
                  </div>
                  <p className="text-2xl font-bold text-white">
                    ${parseFloat(project.share_price).toFixed(2)}
                  </p>
                </div>
                <div className="bg-slate-700/30 p-4 rounded-xl">
                  <div className="flex items-center gap-2 text-gray-400 mb-2">
                    <Users className="w-4 h-4" />
                    <span className="text-sm">Total Shares</span>
                  </div>
                  <p className="text-2xl font-bold text-white">
                    {project.total_shares.toLocaleString()}
                  </p>
                </div>
                <div className="bg-slate-700/30 p-4 rounded-xl">
                  <div className="flex items-center gap-2 text-gray-400 mb-2">
                    <Calendar className="w-4 h-4" />
                    <span className="text-sm">Duration</span>
                  </div>
                  <p className="text-2xl font-bold text-white">
                    {project.duration_days} days
                  </p>
                </div>
              </div>

              {/* Funding Progress */}
              <div className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/30 rounded-xl p-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-white font-semibold">Funding Progress</span>
                  <span className="text-2xl font-bold text-indigo-400">
                    {project.funding_percentage.toFixed(1)}%
                  </span>
                </div>
                <div className="h-3 bg-slate-700 rounded-full overflow-hidden mb-3">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${project.funding_percentage}%` }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className={`h-full bg-gradient-to-r ${getFundingColor(
                      project.funding_percentage
                    )}`}
                  />
                </div>
                <div className="flex justify-between text-sm text-gray-400">
                  <span>{project.shares_sold.toLocaleString()} shares sold</span>
                  <span>{project.remaining_shares.toLocaleString()} remaining</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Media Gallery */}
        {media.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-8 mb-8"
          >
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <ImageIcon className="w-6 h-6 text-indigo-400" />
              Project Media
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Main Media Display (First Item or Selected) */}
              <div className="col-span-1 md:col-span-2 aspect-video bg-slate-900/50 rounded-2xl overflow-hidden border border-slate-700/50 relative">
                {media[0]?.type === 'MODEL_3D' ? (
                  <ThreeDViewer fileUrl={getMediaUrl(media[0].file_url)} />
                ) : (
                  <img
                    src={getMediaUrl(media[0]?.file_url)}
                    alt="Main Visual"
                    className="w-full h-full object-cover"
                  />
                )}
                {media[0]?.is_restricted && !project.has_access && (
                  <div className="absolute inset-0 bg-black/80 flex items-center justify-center">
                    <Lock className="w-12 h-12 text-gray-400" />
                    <p className="text-gray-400 mt-4 font-semibold">Restricted Access</p>
                  </div>
                )}
              </div>

              {/* Thumbnails */}
              {media.slice(1).map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => item.type === "IMAGE" && setSelectedImage(item)}
                  className="relative aspect-video bg-slate-700/30 rounded-xl overflow-hidden cursor-pointer hover:ring-2 hover:ring-indigo-500 transition-all"
                >
                  {item.type === "IMAGE" ? (
                    <img
                      src={getMediaUrl(item.file_url)}
                      alt="Project media"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full">
                      <ThreeDViewer fileUrl={getMediaUrl(item.file_url)} />
                    </div>
                  )}
                  {item.is_restricted && !project.has_access && (
                    <div className="absolute inset-0 bg-black/80 flex items-center justify-center">
                      <Lock className="w-8 h-8 text-gray-400" />
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Restricted Content */}
        {project.restricted_fields && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-8 mb-8"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                {project.has_access ? (
                  <>
                    <Unlock className="w-6 h-6 text-green-400" />
                    Restricted Content (Access Granted)
                  </>
                ) : (
                  <>
                    <Lock className="w-6 h-6 text-yellow-400" />
                    Restricted Content
                  </>
                )}
              </h2>
              {!project.has_access && (
                <button
                  onClick={() => setShowAccessModal(true)}
                  className="px-6 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-xl font-semibold hover:from-yellow-600 hover:to-orange-600 transition-all"
                >
                  Request Access
                </button>
              )}
            </div>

            {project.has_access ? (
              <div className="bg-slate-700/30 rounded-xl p-6">
                <pre className="text-gray-300 whitespace-pre-wrap font-sans">
                  {project.restricted_fields}
                </pre>
              </div>
            ) : (
              <div className="text-center py-12">
                <Lock className="w-16 h-16 text-yellow-400 mx-auto mb-4 opacity-50" />
                <p className="text-gray-400 text-lg">
                  This content is restricted. Request access to view sensitive project
                  details.
                </p>
              </div>
            )}
          </motion.div>
        )}

        {/* Investment CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="sticky bottom-8 z-30"
        >
          <div className="bg-slate-900/90 backdrop-blur-xl border border-indigo-500/30 rounded-2xl p-6 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h2 className="text-xl font-bold text-white mb-1">
                Investment Opportunity
              </h2>
              <p className="text-slate-400 text-sm">
                {project.remaining_shares > 0
                  ? `${project.remaining_shares.toLocaleString()} shares remaining at $${parseFloat(project.share_price).toFixed(2)}`
                  : "This project is fully funded"}
              </p>
            </div>
            <button
              onClick={() => navigate(`/investor/projects/${id}/invest`)}
              disabled={project.remaining_shares === 0}
              className="w-full md:w-auto px-8 py-3 bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-xl font-bold hover:shadow-lg hover:shadow-emerald-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {project.remaining_shares > 0 ? "Invest Now" : "Sold Out"}
            </button>
          </div>
        </motion.div>
      </div>

      {/* Access Request Modal */}
      <AnimatePresence>
        {showAccessModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowAccessModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-slate-800 border border-slate-700 rounded-2xl p-8 max-w-md w-full"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">Request Restricted Access</h2>
                <button
                  onClick={() => setShowAccessModal(false)}
                  className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>

              <p className="text-gray-400 mb-4">
                Please explain why you need access to this project's restricted information:
              </p>

              <textarea
                value={accessReason}
                onChange={(e) => setAccessReason(e.target.value)}
                className="w-full h-32 bg-slate-700 text-white rounded-xl p-4 border border-slate-600 focus:border-indigo-500 focus:outline-none resize-none mb-6"
                placeholder="Enter your reason..."
              />

              <div className="flex gap-3">
                <button
                  onClick={handleRequestAccess}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-xl font-semibold hover:from-yellow-600 hover:to-orange-600 transition-all"
                >
                  Submit Request
                </button>
                <button
                  onClick={() => setShowAccessModal(false)}
                  className="px-4 py-3 bg-slate-700 text-white rounded-xl hover:bg-slate-600 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Image Lightbox */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/95 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedImage(null)}
          >
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 p-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
            >
              <X className="w-6 h-6 text-white" />
            </button>
            <motion.img
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              src={getMediaUrl(selectedImage.file_url)}
              alt="Project media"
              className="max-w-full max-h-full object-contain rounded-xl"
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProjectDetail;