import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import developerService from "../../api/developerService";
import { motion } from "framer-motion";
import {
  CheckCircle,
  AlertTriangle,
  FileText,
  Image as ImageIcon,
  DollarSign,
  Users,
  Calendar,
  ArrowRight,
  Send,
} from "lucide-react";
import { toast } from "react-hot-toast";

const SubmitProject = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState([]);
  const [warnings, setWarnings] = useState([]);

  useEffect(() => {
    fetchProjectDetails();
  }, [id]);

  const fetchProjectDetails = async () => {
    try {
      setLoading(true);
      const projectData = await developerService.getProjectDetail(id);
      setProject(projectData);

      // Validate project
      validateProject(projectData);
    } catch (err) {
      toast.error("Failed to load project");
      navigate("/developer/projects");
    } finally {
      setLoading(false);
    }
  };

  const validateProject = (projectData) => {
    const validationErrors = [];
    const validationWarnings = [];

    // Required field checks
    if (!projectData.title || projectData.title.trim().length < 5) {
      validationErrors.push("Project title must be at least 5 characters");
    }

    if (!projectData.description || projectData.description.trim().length < 20) {
      validationErrors.push("Project description must be at least 20 characters");
    }

    if (!projectData.category) {
      validationErrors.push("Project category is required");
    }

    if (!projectData.total_project_value || parseFloat(projectData.total_project_value) <= 0) {
      validationErrors.push("Total project value must be greater than 0");
    }

    if (!projectData.total_shares || projectData.total_shares <= 0) {
      validationErrors.push("Total shares must be greater than 0");
    }

    if (!projectData.duration_days || projectData.duration_days < 1) {
      validationErrors.push("Duration must be at least 1 day");
    }

    // Warning checks
    if (projectData.description && projectData.description.length < 100) {
      validationWarnings.push("Consider adding more details to your project description");
    }

    if (projectData.duration_days && projectData.duration_days > 365) {
      validationWarnings.push("Project duration is very long (>1 year)");
    }

    // Check if project can be submitted
    if (projectData.status !== "DRAFT" && projectData.status !== "NEEDS_CHANGES") {
      validationErrors.push(`Cannot submit project with status: ${projectData.status}`);
    }

    setErrors(validationErrors);
    setWarnings(validationWarnings);
  };

  const handleSubmit = async () => {
    if (errors.length > 0) {
      toast.error("Please fix all errors before submitting");
      return;
    }

    try {
      setSubmitting(true);
      await developerService.submitProjectForReview(id);
      toast.success("Project submitted for admin review!");
      navigate("/developer/projects");
    } catch (err) {
      toast.error(err.response?.data?.detail || "Failed to submit project");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (!project) return null;

  const canSubmit = errors.length === 0;
  const sharePrice = project.total_shares > 0
    ? parseFloat(project.total_project_value) / project.total_shares
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <button
            onClick={() => navigate("/developer/projects")}
            className="text-gray-400 hover:text-white mb-4 flex items-center gap-2"
          >
            ← Back to Projects
          </button>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
            Submit for Review
          </h1>
          <p className="text-gray-400 text-lg">
            Review your project details before submitting to admin
          </p>
        </motion.div>

        {/* Validation Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          {errors.length > 0 && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6 mb-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-6 h-6 text-red-400 flex-shrink-0" />
                <div className="flex-1">
                  <h3 className="text-red-400 font-bold mb-2">
                    {errors.length} Error{errors.length > 1 ? "s" : ""} Found
                  </h3>
                  <ul className="space-y-1">
                    {errors.map((error, index) => (
                      <li key={index} className="text-red-300 text-sm">
                        • {error}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {warnings.length > 0 && (
            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-6 mb-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-6 h-6 text-yellow-400 flex-shrink-0" />
                <div className="flex-1">
                  <h3 className="text-yellow-400 font-bold mb-2">Warnings</h3>
                  <ul className="space-y-1">
                    {warnings.map((warning, index) => (
                      <li key={index} className="text-yellow-300 text-sm">
                        • {warning}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {canSubmit && (
            <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-6">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-6 h-6 text-green-400" />
                <div>
                  <h3 className="text-green-400 font-bold">Ready to Submit</h3>
                  <p className="text-green-300 text-sm">
                    Your project meets all requirements and is ready for admin review
                  </p>
                </div>
              </div>
            </div>
          )}
        </motion.div>

        {/* Project Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-8 mb-8"
        >
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <FileText className="w-6 h-6 text-purple-400" />
            Project Summary
          </h2>

          <div className="space-y-6">
            {/* Title & Description */}
            <div>
              <h3 className="text-white font-bold text-xl mb-2">{project.title}</h3>
              <p className="text-gray-300">{project.description}</p>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-700/30 p-4 rounded-xl">
                <div className="flex items-center gap-2 text-gray-400 mb-2">
                  <DollarSign className="w-4 h-4" />
                  <span className="text-sm">Total Project Value</span>
                </div>
                <p className="text-2xl font-bold text-white">
                  ${parseFloat(project.total_project_value).toLocaleString()}
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
                  <DollarSign className="w-4 h-4" />
                  <span className="text-sm">Price per Share</span>
                </div>
                <p className="text-2xl font-bold text-purple-400">
                  ${sharePrice.toFixed(2)}
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

            {/* Category */}
            <div>
              <p className="text-gray-400 text-sm mb-2">Category</p>
              <span className="px-4 py-2 bg-purple-500/20 text-purple-400 rounded-full text-sm font-semibold">
                {project.category}
              </span>
            </div>
          </div>
        </motion.div>

        {/* What Happens Next */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-8 mb-8"
        >
          <h2 className="text-2xl font-bold text-white mb-6">What Happens Next?</h2>
          <div className="space-y-4">
            {[
              {
                step: 1,
                title: "Admin Review",
                description: "Your project will be reviewed by an administrator",
              },
              {
                step: 2,
                title: "Approval Decision",
                description: "Admin can approve, reject, or request changes",
              },
              {
                step: 3,
                title: "Notification",
                description: "You'll be notified of the decision via email and dashboard",
              },
              {
                step: 4,
                title: "Go Live",
                description: "If approved, your project will be visible to investors",
              },
            ].map((item) => (
              <div key={item.step} className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center font-bold">
                  {item.step}
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-1">{item.title}</h3>
                  <p className="text-gray-400 text-sm">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <button
            onClick={() => navigate(`/developer/projects/${id}/edit`)}
            className="flex-1 px-6 py-4 bg-slate-700 text-white rounded-xl font-semibold hover:bg-slate-600 transition-all"
          >
            Make Changes
          </button>

          <button
            onClick={handleSubmit}
            disabled={!canSubmit || submitting}
            className="flex-1 px-6 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold hover:from-purple-600 hover:to-pink-600 transition-all shadow-lg hover:shadow-purple-500/50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {submitting ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                />
                Submitting...
              </>
            ) : (
              <>
                <Send className="w-5 h-5" />
                Submit for Review
              </>
            )}
          </button>
        </motion.div>

        {/* Current Status */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-6 text-center"
        >
          <p className="text-gray-400 text-sm">
            Current Status:{" "}
            <span className={`font-semibold ${project.status === "DRAFT" ? "text-slate-400" :
              project.status === "NEEDS_CHANGES" ? "text-yellow-400" :
                "text-white"
              }`}>
              {project.status}
            </span>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default SubmitProject;