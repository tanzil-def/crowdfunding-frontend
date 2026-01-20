import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import developerService from "../../api/developerService";
import { motion } from "framer-motion";
import {
  Plus,
  Edit,
  Image as ImageIcon,
  Send,
  TrendingUp,
  Calendar,
  DollarSign,
  Users
} from "lucide-react";
import { toast } from "react-hot-toast";
import { getMediaUrl } from "../../utils/media";

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
      if (filter !== "ALL") {
        params.status = filter;
      }

      const data = await developerService.getMyProjects(params);
      setProjects(data.results || []);
      setTotalPages(Math.ceil((data.count || 0) / 12));
    } catch (error) {
      console.error("MyProjects fetch error:", error);
      toast.error("Failed to fetch projects");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-emerald-900 to-slate-900 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8"
        >
          <div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-emerald-400 to-green-400 bg-clip-text text-transparent mb-2">
              My Projects
            </h1>
            <p className="text-gray-400 text-lg">
              Manage and track all your crowdfunding projects
            </p>
          </div>
          <Link
            to="/developer/projects/new"
            className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-emerald-500/50 flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            New Project
          </Link>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex gap-3 mb-8 overflow-x-auto pb-2"
        >
          {["ALL", "DRAFT", "PENDING_REVIEW", "APPROVED", "REJECTED", "NEEDS_CHANGES"].map((status) => (
            <button
              key={status}
              onClick={() => {
                setFilter(status);
                setPage(1);
              }}
              className={`px-6 py-3 rounded-xl font-semibold whitespace-nowrap transition-all ${filter === status
                ? "bg-gradient-to-r from-emerald-600 to-green-600 text-white shadow-lg shadow-emerald-500/50"
                : "bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white"
                }`}
            >
              {status.replace("_", " ")}
            </button>
          ))}
        </motion.div>

        {/* Projects Grid */}
        {projects.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-12 text-center"
          >
            <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Plus className="w-10 h-10 text-emerald-400" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">No Projects Found</h2>
            <p className="text-gray-400 mb-6">
              {filter === "ALL"
                ? "Create your first crowdfunding project to get started"
                : `No ${filter.toLowerCase()} projects`}
            </p>
            <Link
              to="/developer/projects/new"
              className="inline-block px-6 py-3 bg-gradient-to-r from-emerald-600 to-green-600 text-white font-bold rounded-xl hover:from-emerald-500 hover:to-green-500 transition-all"
            >
              Create Project
            </Link>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project, index) => (
              <ProjectCard
                key={project.id}
                project={project}
                index={index}
                onRefresh={fetchProjects}
              />
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
    </div>
  );
};

const ProjectCard = ({ project, index, onRefresh }) => {
  const [coverImage, setCoverImage] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchMedia = async () => {
      try {
        const mediaData = await developerService.getProjectMedia(project.id);
        if (mediaData.results && mediaData.results.length > 0) {
          // Find the first IMAGE type media
          const imageItem = mediaData.results.find(m => m.type === "IMAGE") || mediaData.results[0];
          setCoverImage(imageItem.file || imageItem.file_url);
        }
      } catch (err) {
        console.error("Failed to fetch project media:", err);
      }
    };
    fetchMedia();
  }, [project.id]);

  const handleSubmitReview = async () => {
    if (!window.confirm("Are you sure you want to submit this project for review?")) return;

    setSubmitting(true);
    try {
      await developerService.submitProjectForReview(project.id);
      toast.success("Project submitted for review successfully!");
      if (onRefresh) onRefresh();
    } catch (err) {
      toast.error(err.response?.data?.detail || "Failed to submit project");
      console.error("Submission error:", err);
    } finally {
      setSubmitting(false);
    }
  };

  const statusConfig = {
    DRAFT: {
      bg: "bg-slate-500/20",
      text: "text-slate-400",
      border: "border-slate-500/30"
    },
    PENDING_REVIEW: {
      bg: "bg-yellow-500/20",
      text: "text-yellow-400",
      border: "border-yellow-500/30"
    },
    APPROVED: {
      bg: "bg-emerald-500/20",
      text: "text-emerald-400",
      border: "border-emerald-500/30"
    },
    REJECTED: {
      bg: "bg-red-500/20",
      text: "text-red-400",
      border: "border-red-500/30"
    },
    NEEDS_CHANGES: {
      bg: "bg-orange-500/20",
      text: "text-orange-400",
      border: "border-orange-500/30"
    }
  };

  const status = statusConfig[project.status] || statusConfig.DRAFT;
  const progress = project.total_shares > 0
    ? ((project.shares_sold || 0) / project.total_shares) * 100
    : 0;

  const sharePrice = project.total_shares > 0
    ? parseFloat(project.share_price || 0)
    : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-700/50 hover:border-emerald-500/50 transition-all overflow-hidden group"
    >
      {/* Project Image */}
      <div className="h-48 overflow-hidden relative">
        <img
          src={getMediaUrl(coverImage) || "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"}
          alt={project.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute top-4 right-4 z-10">
          <span className={`px-3 py-1 rounded-full text-xs font-bold border whitespace-nowrap backdrop-blur-md ${status.bg} ${status.text} ${status.border}`}>
            {project.status}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <h3 className="text-xl font-bold text-white line-clamp-2 flex-1">
            {project.title}
          </h3>
        </div>

        <p className="text-slate-400 text-sm mb-4 line-clamp-2">
          {project.description}
        </p>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-slate-700/30 p-3 rounded-lg">
            <div className="flex items-center gap-1 text-gray-400 mb-1">
              <DollarSign className="w-3 h-3" />
              <span className="text-xs">Share Price</span>
            </div>
            <p className="text-white font-bold">
              ${sharePrice.toFixed(2)}
            </p>
          </div>

          <div className="bg-slate-700/30 p-3 rounded-lg">
            <div className="flex items-center gap-1 text-gray-400 mb-1">
              <Users className="w-3 h-3" />
              <span className="text-xs">Total Shares</span>
            </div>
            <p className="text-white font-bold">
              {(project.total_shares || 0).toLocaleString()}
            </p>
          </div>

          <div className="bg-slate-700/30 p-3 rounded-lg">
            <div className="flex items-center gap-1 text-gray-400 mb-1">
              <TrendingUp className="w-3 h-3" />
              <span className="text-xs">Value</span>
            </div>
            <p className="text-white font-bold text-sm">
              ${parseFloat(project.total_project_value || 0).toLocaleString()}
            </p>
          </div>

          <div className="bg-slate-700/30 p-3 rounded-lg">
            <div className="flex items-center gap-1 text-gray-400 mb-1">
              <Calendar className="w-3 h-3" />
              <span className="text-xs">Duration</span>
            </div>
            <p className="text-white font-bold">
              {project.duration_days || 0}d
            </p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-slate-400">Funding Progress</span>
            <span className="text-white font-bold">{progress.toFixed(1)}%</span>
          </div>
          <div className="w-full bg-slate-700 rounded-full h-2 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1, delay: index * 0.05 }}
              className="bg-gradient-to-r from-emerald-500 to-green-500 h-2 rounded-full"
            />
          </div>
          <div className="flex justify-between text-xs text-slate-400 mt-1">
            <span>{project.shares_sold || 0} sold</span>
            <span>{project.remaining_shares || project.total_shares} left</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Link
            to={`/developer/projects/${project.id}/edit`}
            className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-bold rounded-lg transition-all flex items-center justify-center gap-2"
          >
            <Edit className="w-4 h-4" />
            Edit
          </Link>

          <Link
            to={`/developer/projects/${project.id}/media`}
            className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-all flex items-center justify-center"
            title="Manage Media"
          >
            <ImageIcon className="w-4 h-4" />
          </Link>

          {project.status === "DRAFT" && (
            <button
              onClick={handleSubmitReview}
              disabled={submitting}
              className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white rounded-lg transition-all flex items-center justify-center disabled:opacity-50"
              title="Submit for Review"
            >
              {submitting ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default MyProjects;