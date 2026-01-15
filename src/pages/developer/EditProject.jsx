import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { updateProject, submitProjectForReview } from "../../services/api";
import api from "../../services/api";
import { motion } from "framer-motion";
import { Save, Send, X, AlertCircle, CheckCircle } from "lucide-react";
import { toast } from "react-hot-toast";

const EditProject = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    duration_days: 30,
    total_project_value: "",
    total_shares: "",
    restricted_fields: "",
    is_3d_restricted: false,
    status: ""
  });

  const categories = [
    "Technology",
    "Healthcare",
    "Finance",
    "Real Estate",
    "Education",
    "Energy",
    "Agriculture",
    "Entertainment",
  ];

  useEffect(() => {
    fetchProject();
  }, [id]);

  const fetchProject = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/api/v1/projects/${id}/detail/`);
      const data = response.data;
      
      // Set form data with correct field names
      setFormData({
        title: data.title || "",
        description: data.description || "",
        category: data.category || "",
        duration_days: data.duration_days || 30,
        total_project_value: data.total_project_value || "",
        total_shares: data.total_shares || "",
        restricted_fields: data.restricted_fields || "",
        is_3d_restricted: data.is_3d_restricted || false,
        status: data.status || "DRAFT"
      });
    } catch (err) {
      toast.error("Failed to load project");
      navigate("/developer/projects");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ 
      ...formData, 
      [name]: type === "checkbox" ? checked : value 
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      // Only send fields that can be updated
      const updateData = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        duration_days: parseInt(formData.duration_days),
        restricted_fields: formData.restricted_fields,
        is_3d_restricted: formData.is_3d_restricted,
      };

      await updateProject(id, updateData);
      toast.success("Project updated successfully!");
      navigate("/developer/projects");
    } catch (err) {
      toast.error(err.response?.data?.detail || "Failed to update project");
    } finally {
      setSaving(false);
    }
  };

  const handleSubmitForReview = async () => {
    try {
      await submitProjectForReview(id);
      toast.success("Project submitted for review!");
      navigate("/developer/projects");
    } catch (err) {
      toast.error(err.response?.data?.detail || "Failed to submit project");
    }
  };

  const handleAddMedia = () => {
    navigate(`/developer/projects/${id}/media`);
  };

  if (loading) {
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

  const canEdit = ["DRAFT", "NEEDS_CHANGES"].includes(formData.status);
  const sharePrice = formData.total_project_value && formData.total_shares
    ? parseFloat(formData.total_project_value) / parseFloat(formData.total_shares)
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-8">
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
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-2">
            Edit Project
          </h1>
          <p className="text-gray-400 text-lg">Update your project details</p>
          <div className="flex items-center gap-3 mt-4">
            <span className={`px-4 py-2 rounded-full text-sm font-bold border ${
              formData.status === "APPROVED" ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" :
              formData.status === "PENDING_REVIEW" ? "bg-yellow-500/20 text-yellow-400 border-yellow-500/30" :
              formData.status === "REJECTED" ? "bg-red-500/20 text-red-400 border-red-500/30" :
              formData.status === "NEEDS_CHANGES" ? "bg-orange-500/20 text-orange-400 border-orange-500/30" :
              "bg-slate-500/20 text-slate-400 border-slate-500/30"
            }`}>
              {formData.status}
            </span>
            {canEdit && (
              <span className="text-green-400 text-sm flex items-center gap-1">
                <CheckCircle className="w-4 h-4" />
                Can be edited
              </span>
            )}
          </div>
        </motion.div>

        {/* Warning if can't edit */}
        {!canEdit && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-6"
          >
            <div className="flex items-start gap-3">
              <AlertCircle className="w-6 h-6 text-yellow-400 flex-shrink-0" />
              <div>
                <h3 className="text-yellow-400 font-bold mb-1">Cannot Edit</h3>
                <p className="text-yellow-300 text-sm">
                  This project cannot be edited in its current status ({formData.status}). 
                  Only DRAFT and NEEDS_CHANGES projects can be modified.
                </p>
              </div>
            </div>
          </motion.div>
        )}

        <form onSubmit={handleUpdate} className="space-y-6">
          {/* Basic Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-8 border border-slate-700/50 space-y-6"
          >
            <h2 className="text-2xl font-bold text-white mb-4">Basic Information</h2>
            
            <div>
              <label className="block text-sm font-bold text-slate-300 mb-2">Project Title *</label>
              <input
                name="title"
                value={formData.title}
                onChange={handleChange}
                disabled={!canEdit}
                className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl text-white disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 transition-all"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-300 mb-2">Description *</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                disabled={!canEdit}
                rows="5"
                className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl text-white disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 transition-all"
                required
              />
              <p className="text-xs text-gray-500 mt-1">{formData.description.length} characters</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-slate-300 mb-2">Category *</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  disabled={!canEdit}
                  className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl text-white disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 transition-all"
                  required
                >
                  <option value="">Select a category</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-300 mb-2">Duration (days) *</label>
                <input
                  type="number"
                  name="duration_days"
                  value={formData.duration_days}
                  onChange={handleChange}
                  disabled={!canEdit}
                  min="1"
                  max="365"
                  className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl text-white disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 transition-all"
                  required
                />
              </div>
            </div>
          </motion.div>

          {/* Financial Information (Read-only) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-8 border border-slate-700/50"
          >
            <h2 className="text-2xl font-bold text-white mb-4">Financial Details</h2>
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4 mb-6">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                <p className="text-blue-300 text-sm">
                  Financial values cannot be changed after project creation
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-slate-700/30 p-4 rounded-xl">
                <p className="text-gray-400 text-sm mb-2">Total Project Value</p>
                <p className="text-2xl font-bold text-white">
                  ${parseFloat(formData.total_project_value || 0).toLocaleString()}
                </p>
              </div>

              <div className="bg-slate-700/30 p-4 rounded-xl">
                <p className="text-gray-400 text-sm mb-2">Total Shares</p>
                <p className="text-2xl font-bold text-white">
                  {parseInt(formData.total_shares || 0).toLocaleString()}
                </p>
              </div>

              <div className="bg-slate-700/30 p-4 rounded-xl md:col-span-2">
                <p className="text-gray-400 text-sm mb-2">Price per Share</p>
                <p className="text-3xl font-bold text-blue-400">
                  ${sharePrice.toFixed(2)}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Restricted Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-8 border border-slate-700/50 space-y-6"
          >
            <h2 className="text-2xl font-bold text-white mb-4">Restricted Information</h2>
            
            <div>
              <label className="block text-sm font-bold text-slate-300 mb-2">
                Restricted Content (Optional)
              </label>
              <textarea
                name="restricted_fields"
                value={formData.restricted_fields}
                onChange={handleChange}
                disabled={!canEdit}
                placeholder="Sensitive information that requires access approval..."
                rows="3"
                className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 transition-all"
              />
            </div>

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="is_3d_restricted"
                name="is_3d_restricted"
                checked={formData.is_3d_restricted}
                onChange={handleChange}
                disabled={!canEdit}
                className="w-5 h-5 rounded border-gray-600 text-blue-500 focus:ring-blue-500 bg-slate-700 disabled:opacity-50"
              />
              <label htmlFor="is_3d_restricted" className="text-gray-300">
                Restrict 3D model access (requires approval)
              </label>
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
              type="button"
              onClick={() => navigate("/developer/projects")}
              className="flex-1 px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2"
            >
              <X className="w-5 h-5" />
              Cancel
            </button>

            <button
              type="button"
              onClick={handleAddMedia}
              className="flex-1 px-6 py-3 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl transition-all"
            >
              Manage Media
            </button>
            
            {canEdit && (
              <>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-blue-500/50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {saving ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                      />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-5 h-5" />
                      Save Changes
                    </>
                  )}
                </button>
                
                {formData.status === "DRAFT" && (
                  <button
                    type="button"
                    onClick={handleSubmitForReview}
                    disabled={saving}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-emerald-500/50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    <Send className="w-5 h-5" />
                    Submit for Review
                  </button>
                )}
              </>
            )}
          </motion.div>
        </form>
      </div>
    </div>
  );
};

export default EditProject;