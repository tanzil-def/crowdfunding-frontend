import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import developerService from "../../api/developerService";
import { motion } from "framer-motion";
import { CheckCircle, AlertCircle } from "lucide-react";
import { toast } from "react-hot-toast";

const CreateProject = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    duration_days: 30,
    total_project_value: "",
    total_shares: "",
    restricted_fields: "",
    is_3d_restricted: false,
  });

  const [files, setFiles] = useState({
    images: [],
    model_3d: null
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

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value
    });
  };

  const handleFileChange = (e) => {
    const { name, files: selectedFiles } = e.target;

    if (name === "images") {
      setFiles({ ...files, images: Array.from(selectedFiles) });
    } else if (name === "model_3d") {
      setFiles({ ...files, model_3d: selectedFiles[0] });
    }
  };

  const handleCreateDraft = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await developerService.createProject(formData);
      // Access id from nested data field
      const projectId = response.data.id;

      if (!projectId) {
        throw new Error("Failed to get project ID from response");
      }

      // Upload media if any
      if (files.images.length > 0) {
        for (const image of files.images) {
          const mediaFormData = new FormData();
          mediaFormData.append("type", "IMAGE");
          mediaFormData.append("file", image);
          mediaFormData.append("is_restricted", false);
          await developerService.uploadProjectMedia(projectId, mediaFormData);
        }
      }

      if (files.model_3d) {
        const mediaFormData = new FormData();
        mediaFormData.append("type", "MODEL_3D");
        mediaFormData.append("file", files.model_3d);
        mediaFormData.append("is_restricted", formData.is_3d_restricted);
        await developerService.uploadProjectMedia(projectId, mediaFormData);
      }

      toast.success("Project created as draft!");
      navigate("/developer/projects");
    } catch (err) {
      toast.error(err.response?.data?.detail || "Failed to create project");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAndSubmit = async () => {
    if (!formData.title || !formData.total_project_value || !formData.total_shares) {
      toast.error("Please complete all required fields");
      return;
    }

    setLoading(true);

    try {
      const response = await developerService.createProject(formData);
      // Access id from nested data field
      const projectId = response.data.id;

      if (!projectId) {
        throw new Error("Failed to get project ID from response");
      }

      // Upload media
      if (files.images.length > 0) {
        for (const image of files.images) {
          const mediaFormData = new FormData();
          mediaFormData.append("type", "IMAGE");
          mediaFormData.append("file", image);
          mediaFormData.append("is_restricted", false);
          await developerService.uploadProjectMedia(projectId, mediaFormData);
        }
      }

      if (files.model_3d) {
        const mediaFormData = new FormData();
        mediaFormData.append("type", "MODEL_3D");
        mediaFormData.append("file", files.model_3d);
        mediaFormData.append("is_restricted", formData.is_3d_restricted);
        await developerService.uploadProjectMedia(projectId, mediaFormData);
      }

      // Redirect to submit page
      toast.success("Project created! Redirecting to submit...");
      navigate(`/developer/projects/${projectId}/submit`);
    } catch (err) {
      toast.error(err.response?.data?.detail || "Failed to create project");
    } finally {
      setLoading(false);
    }
  };

  const sharePrice = formData.total_project_value && formData.total_shares
    ? parseFloat(formData.total_project_value) / parseFloat(formData.total_shares)
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-emerald-900 to-slate-900 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-5xl font-bold bg-gradient-to-r from-emerald-400 to-green-400 bg-clip-text text-transparent mb-2">
            Create New Project
          </h1>
          <p className="text-gray-400 text-lg">Fill in the details to create your crowdfunding project</p>
        </motion.div>

        {/* Step Indicators */}
        <div className="flex gap-4 mb-8">
          <StepIndicator active={step === 1} completed={step > 1} number={1} label="Basic Info" />
          <StepIndicator active={step === 2} completed={step > 2} number={2} label="Financial" />
          <StepIndicator active={step === 3} number={3} label="Media & Submit" />
        </div>

        <form onSubmit={handleCreateDraft} className="space-y-6">
          {/* Step 1: Basic Info */}
          {step === 1 && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-8 border border-slate-700/50 space-y-6"
            >
              <div>
                <label className="block text-sm font-bold text-slate-300 mb-2">Project Title *</label>
                <input
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Enter a compelling project title"
                  className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/30 transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-300 mb-2">Description *</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Describe your project in detail..."
                  rows="5"
                  className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/30 transition-all"
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
                    className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/30 transition-all"
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
                    min="1"
                    max="365"
                    className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/30 transition-all"
                    required
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={() => setStep(2)}
                className="w-full py-3 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-emerald-500/50"
              >
                Next: Financial Details
              </button>
            </motion.div>
          )}

          {/* Step 2: Financial */}
          {step === 2 && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-8 border border-slate-700/50 space-y-6"
            >
              <div>
                <label className="block text-sm font-bold text-slate-300 mb-2">Total Project Value ($) *</label>
                <input
                  type="number"
                  name="total_project_value"
                  value={formData.total_project_value}
                  onChange={handleChange}
                  placeholder="1000000"
                  min="1"
                  step="0.01"
                  className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/30 transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-300 mb-2">Total Shares *</label>
                <input
                  type="number"
                  name="total_shares"
                  value={formData.total_shares}
                  onChange={handleChange}
                  placeholder="10000"
                  min="1"
                  className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/30 transition-all"
                  required
                />
              </div>

              {sharePrice > 0 && (
                <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4 flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-emerald-400" />
                  <div>
                    <p className="text-emerald-400 font-bold text-lg">
                      Price per Share: ${sharePrice.toFixed(2)}
                    </p>
                    <p className="text-emerald-300 text-sm">
                      Investors will pay ${sharePrice.toFixed(2)} per share
                    </p>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-bold text-slate-300 mb-2">
                  Restricted Information (Optional)
                </label>
                <textarea
                  name="restricted_fields"
                  value={formData.restricted_fields}
                  onChange={handleChange}
                  placeholder="Enter sensitive project details that require access approval..."
                  rows="3"
                  className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/30 transition-all"
                />
                <p className="text-xs text-gray-500 mt-1">This information will require admin approval for investors to view</p>
              </div>

              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex-1 py-3 bg-slate-700 hover:bg-slate-600 text-white font-bold rounded-xl transition-all"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="flex-1 py-3 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-emerald-500/50"
                >
                  Next: Upload Media
                </button>
              </div>
            </motion.div>
          )}

          {/* Step 3: Media */}
          {step === 3 && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-8 border border-slate-700/50 space-y-6"
            >
              <div>
                <label className="block text-sm font-bold text-slate-300 mb-2">Project Images</label>
                <input
                  type="file"
                  name="images"
                  accept="image/*"
                  multiple
                  onChange={handleFileChange}
                  className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-emerald-600 file:text-white file:font-bold hover:file:bg-emerald-500 transition-all"
                />
                {files.images.length > 0 && (
                  <p className="text-sm text-emerald-400 mt-2 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    {files.images.length} image{files.images.length > 1 ? "s" : ""} selected
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-300 mb-2">3D Model (Optional)</label>
                <input
                  type="file"
                  name="model_3d"
                  accept=".glb,.gltf,.obj,.fbx"
                  onChange={handleFileChange}
                  className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-emerald-600 file:text-white file:font-bold hover:file:bg-emerald-500 transition-all"
                />
                {files.model_3d && (
                  <p className="text-sm text-emerald-400 mt-2 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    {files.model_3d.name}
                  </p>
                )}
              </div>

              {files.model_3d && (
                <div className="flex items-center gap-3 p-4 bg-slate-700/30 rounded-xl">
                  <input
                    type="checkbox"
                    id="is_3d_restricted"
                    name="is_3d_restricted"
                    checked={formData.is_3d_restricted}
                    onChange={handleChange}
                    className="w-5 h-5 rounded border-gray-600 text-emerald-500 focus:ring-emerald-500 bg-slate-700"
                  />
                  <label htmlFor="is_3d_restricted" className="text-gray-300">
                    Restrict 3D model access (requires approval)
                  </label>
                </div>
              )}

              <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-blue-400 font-semibold text-sm mb-1">Note</p>
                  <p className="text-gray-300 text-sm">
                    You can add more media files later from the project media page
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="flex-1 py-3 bg-slate-700 hover:bg-slate-600 text-white font-bold rounded-xl transition-all"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Creating..." : "Save as Draft"}
                </button>
                <button
                  type="button"
                  onClick={handleCreateAndSubmit}
                  disabled={loading}
                  className="flex-1 py-3 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white font-bold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-emerald-500/50"
                >
                  {loading ? "Creating..." : "Create & Submit"}
                </button>
              </div>
            </motion.div>
          )}
        </form>
      </div>
    </div>
  );
};

const StepIndicator = ({ active, completed, number, label }) => (
  <div className="flex items-center gap-2 flex-1">
    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold border-2 transition-all ${completed
      ? "bg-emerald-500 border-emerald-500 text-white"
      : active
        ? "bg-emerald-600 border-emerald-600 text-white"
        : "bg-slate-800 border-slate-600 text-slate-400"
      }`}>
      {completed ? "✓" : number}
    </div>
    <span className={`text-sm font-bold ${active ? "text-white" : "text-slate-500"}`}>
      {label}
    </span>
  </div>
);

export default CreateProject;