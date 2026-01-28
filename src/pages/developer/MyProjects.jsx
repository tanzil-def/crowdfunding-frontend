import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import developerService from "../../api/developerService";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Edit,
  Image as ImageIcon,
  Send,
  TrendingUp,
  Calendar,
  DollarSign,
  Users,
  AlertCircle,
  X
} from "lucide-react";
import { toast } from "react-hot-toast";
import { getMediaUrl } from "../../utils/media";

// --- Custom Professional Modal Component ---
const ConfirmModal = ({ isOpen, onClose, onConfirm, loading }) => (
  <AnimatePresence>
    {isOpen && (
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        {/* Overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
        />
        {/* Modal Card */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="relative bg-slate-900 border border-white/10 p-8 rounded-[2.5rem] max-w-sm w-full shadow-2xl overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-6">
            <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors">
              <X size={20} />
            </button>
          </div>

          <div className="w-16 h-16 bg-emerald-500/10 rounded-2xl flex items-center justify-center mb-6 text-emerald-400">
            <AlertCircle size={32} />
          </div>

          <h3 className="text-2xl font-black text-white mb-2 italic uppercase tracking-tighter">Confirm Submission</h3>
          <p className="text-slate-400 text-sm font-bold leading-relaxed mb-8 uppercase tracking-widest">
            Once submitted, the project will be locked for admin review. You cannot edit it until the review is complete.
          </p>

          <div className="flex gap-4">
            <button
              onClick={onClose}
              disabled={loading}
              className="flex-1 py-4 bg-slate-800 hover:bg-slate-700 text-white font-black rounded-xl transition-all uppercase text-[10px] tracking-widest"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={loading}
              className="flex-1 py-4 bg-gradient-to-r from-emerald-500 to-green-500 text-slate-950 font-black rounded-xl transition-all shadow-lg shadow-emerald-500/20 uppercase text-[10px] tracking-widest flex items-center justify-center gap-2"
            >
              {loading ? <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" /> : "Submit Now"}
            </button>
          </div>
        </motion.div>
      </div>
    )}
  </AnimatePresence>
);

const MyProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("ALL");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchProjects();
  }, [filter, page]);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const params = { page, page_size: 12 };
      if (filter !== "ALL") params.status = filter;
      const data = await developerService.getMyProjects(params);
      setProjects(data.results || []);
      setTotalPages(Math.ceil((data.count || 0) / 12));
    } catch (error) {
      toast.error("Failed to fetch projects");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] p-8 font-sans">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-12">
          <div>
            <h1 className="text-6xl font-black text-white tracking-tighter italic uppercase mb-2">
              My <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">Projects</span>
            </h1>
            <p className="text-slate-500 font-bold uppercase tracking-[0.3em] text-[10px]">Developer Control Center</p>
          </div>
          <Link
            to="/developer/projects/new"
            className="px-8 py-4 bg-white text-slate-950 font-black rounded-2xl transition-all shadow-xl hover:scale-105 active:scale-95 flex items-center gap-2 uppercase text-xs tracking-widest italic"
          >
            <Plus className="w-4 h-4" /> New Launch
          </Link>
        </motion.div>

        {/* Status Filters */}
        <div className="flex gap-3 mb-12 overflow-x-auto pb-4 no-scrollbar">
          {["ALL", "DRAFT", "PENDING_REVIEW", "APPROVED", "REJECTED", "NEEDS_CHANGES"].map((status) => (
            <button
              key={status}
              onClick={() => { setFilter(status); setPage(1); }}
              className={`px-6 py-3 rounded-xl font-black text-[10px] tracking-widest uppercase transition-all border ${filter === status
                ? "bg-emerald-500 border-emerald-400 text-slate-950 shadow-lg shadow-emerald-500/20"
                : "bg-slate-900 border-white/5 text-slate-500 hover:border-white/20 hover:text-white"
                }`}
            >
              {status.replace("_", " ")}
            </button>
          ))}
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map(i => <div key={i} className="h-96 bg-slate-900/50 rounded-[2.5rem] animate-pulse" />)}
          </div>
        ) : projects.length === 0 ? (
          <div className="bg-slate-900/50 border border-white/5 rounded-[3rem] p-20 text-center backdrop-blur-xl">
            <p className="text-slate-500 font-black uppercase tracking-[0.5em] text-xs">No Assets Found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project, index) => (
              <ProjectCard key={project.id} project={project} index={index} onRefresh={fetchProjects} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const ProjectCard = ({ project, index, onRefresh }) => {
  const [coverImage, setCoverImage] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchMedia = async () => {
      try {
        const mediaData = await developerService.getProjectMedia(project.id);
        if (mediaData.results?.length > 0) {
          const imageItem = mediaData.results.find(m => m.type === "IMAGE") || mediaData.results[0];
          setCoverImage(imageItem.file || imageItem.file_url);
        }
      } catch (err) { console.error(err); }
    };
    fetchMedia();
  }, [project.id]);

  const handleConfirmSubmit = async () => {
    setSubmitting(true);
    try {
      await developerService.submitProjectForReview(project.id);
      toast.success("Broadcasted to Admin Successfully");
      setIsModalOpen(false);
      if (onRefresh) onRefresh();
    } catch (err) {
      toast.error(err.response?.data?.detail || "Submission Protocol Failed");
    } finally {
      setSubmitting(false);
    }
  };

  const statusConfig = {
    DRAFT: "bg-slate-500/10 text-slate-400 border-slate-500/20",
    PENDING_REVIEW: "bg-amber-500/10 text-amber-500 border-amber-500/20",
    APPROVED: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    REJECTED: "bg-rose-500/10 text-rose-500 border-rose-500/20",
    NEEDS_CHANGES: "bg-orange-500/10 text-orange-500 border-orange-500/20"
  };

  const progress = project.total_shares > 0 ? ((project.shares_sold || 0) / project.total_shares) * 100 : 0;

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
        className="bg-slate-900/40 border border-white/5 rounded-[2.5rem] overflow-hidden group hover:border-emerald-500/30 transition-all backdrop-blur-3xl shadow-2xl"
      >
        <div className="h-56 relative overflow-hidden">
          <img
            src={getMediaUrl(coverImage) || "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80"}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-60"
          />
          <div className="absolute top-6 right-6">
            <span className={`px-4 py-2 rounded-full text-[10px] font-black border uppercase tracking-widest backdrop-blur-xl ${statusConfig[project.status]}`}>
              {project.status.replace("_", " ")}
            </span>
          </div>
        </div>

        <div className="p-8">
          <h3 className="text-2xl font-black text-white mb-3 italic tracking-tighter line-clamp-1 uppercase">{project.title}</h3>

          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-black/20 p-4 rounded-2xl border border-white/5">
              <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">Asset Value</p>
              <p className="text-sm font-black text-white italic">${parseFloat(project.total_project_value || 0).toLocaleString()}</p>
            </div>
            <div className="bg-black/20 p-4 rounded-2xl border border-white/5">
              <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">Unit Price</p>
              <p className="text-sm font-black text-emerald-400 italic">${parseFloat(project.share_price || 0).toFixed(2)}</p>
            </div>
          </div>

          <div className="mb-8">
            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
              <motion.div initial={{ width: 0 }} animate={{ width: `${progress}%` }} className="bg-emerald-500 h-full shadow-[0_0_10px_emerald]" />
            </div>
            <div className="flex justify-between mt-3 text-[9px] font-black uppercase tracking-widest text-slate-500">
              <span>{progress.toFixed(1)}% Funded</span>
              <span>{project.remaining_shares || 0} Left</span>
            </div>
          </div>

          <div className="flex gap-3">
            <Link to={`/developer/projects/${project.id}/edit`} className="flex-1 py-4 bg-slate-800 hover:bg-white hover:text-slate-950 text-white font-black rounded-xl transition-all text-center text-[10px] uppercase tracking-widest italic flex items-center justify-center gap-2">
              <Edit size={14} /> Update
            </Link>

            <Link to={`/developer/projects/${project.id}/media`} className="w-14 h-14 bg-slate-800 hover:bg-cyan-500 text-white rounded-xl transition-all flex items-center justify-center border border-white/5">
              <ImageIcon size={18} />
            </Link>

            {project.status === "DRAFT" && (
              <button
                onClick={() => setIsModalOpen(true)}
                className="w-14 h-14 bg-emerald-500 text-slate-950 rounded-xl transition-all flex items-center justify-center shadow-lg shadow-emerald-500/20 active:scale-90"
              >
                <Send size={18} />
              </button>
            )}
          </div>
        </div>
      </motion.div>

      {/* Confirmation Modal Hooked Here */}
      <ConfirmModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirmSubmit}
        loading={submitting}
      />
    </>
  );
};

export default MyProjects;