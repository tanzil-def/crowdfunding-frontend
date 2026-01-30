import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import developerService from "../../api/developerService";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, AlertCircle, ChevronRight, ChevronLeft, Upload, Info } from "lucide-react";
import { toast } from "react-hot-toast";

const CreateProject = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);

  const [formData, setFormData] = useState({
    title: "",
    short_description: "",
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
    { value: "TECHNOLOGY", label: "Technology" },
    { value: "REAL_ESTATE", label: "Real Estate" },
    { value: "ENERGY", label: "Energy" },
    { value: "HEALTHCARE", label: "Healthcare" },
    { value: "AGRICULTURE", label: "Agriculture" },
    { value: "MANUFACTURING", label: "Manufacturing" },
    { value: "RETAIL", label: "Retail" },
    { value: "SERVICES", label: "Services" },
    { value: "OTHER", label: "Other" },
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
    if (e) e.preventDefault();
    setLoading(true);
    try {
      const submitData = {
        title: formData.title || "Untitled Project",
        description: formData.description || "No description provided",
        category: formData.category || "OTHER",
        duration_days: parseInt(formData.duration_days) || 30,
        total_project_value: parseFloat(formData.total_project_value) || 0,
        total_shares: parseInt(formData.total_shares) || 1,
        restricted_fields: formData.restricted_fields ? formData.restricted_fields.split(",").map(f => f.trim()) : [],
        is_3d_restricted: !!formData.is_3d_restricted,
      };

      const response = await developerService.createProject(submitData);
      const projectId = response.id || response.data?.id;

      if (!projectId) throw new Error("Failed to get project ID");

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

      toast.success("Project saved as draft!");
      navigate("/developer/projects");
    } catch (err) {
      toast.error("Failed to create project");
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
      const submitData = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        duration_days: parseInt(formData.duration_days) || 30,
        total_project_value: parseFloat(formData.total_project_value) || 0,
        total_shares: parseInt(formData.total_shares) || 1,
        restricted_fields: formData.restricted_fields ? formData.restricted_fields.split(",").map(f => f.trim()) : [],
        is_3d_restricted: !!formData.is_3d_restricted,
      };

      const response = await developerService.createProject(submitData);
      const projectId = response.id || response.data?.id;

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

      toast.success("Project created! Submitting...");
      navigate(`/developer/projects/${projectId}/submit`);
    } catch (err) {
      toast.error("Failed to create and submit project");
    } finally {
      setLoading(false);
    }
  };

  const sharePrice = formData.total_project_value && formData.total_shares
    ? parseFloat(formData.total_project_value) / parseFloat(formData.total_shares)
    : 0;

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-12 font-sans text-slate-900">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-10 text-center md:text-left">
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-2">
            Create <span className="text-emerald-600">New Project</span>
          </h1>
          <p className="text-slate-500 font-medium">Crowdfunding Platform.</p>
        </div>

        {/* Custom Progress Stepper */}
        <div className="flex items-center justify-between mb-12 relative">
          <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-200 -z-10"></div>
          <StepCircle number={1} label="Basic Info" active={step >= 1} current={step === 1} />
          <StepCircle number={2} label="Financials" active={step >= 2} current={step === 2} />
          <StepCircle number={3} label="Media" active={step === 3} current={step === 3} />
        </div>

        <AnimatePresence mode="wait">
          {/* Step 1 */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200 space-y-6"
            >
              <InputGroup label="Project Title *" name="title" value={formData.title} onChange={handleChange} placeholder="e.g. Solar City Initiative" />

              <InputGroup label="Short Description *" name="short_description" value={formData.short_description} onChange={handleChange} placeholder="Brief pitch for your project" maxLength="500" />

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Full Description *</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="5"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
                  placeholder="Tell your story..."
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Category *</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-emerald-500 outline-none transition-all cursor-pointer"
                    required
                  >
                    <option value="">Choose category</option>
                    {categories.map((cat) => (
                      <option key={cat.value} value={cat.value}>{cat.label}</option>
                    ))}
                  </select>
                </div>
                <InputGroup label="Duration (Days) *" name="duration_days" type="number" value={formData.duration_days} onChange={handleChange} />
              </div>

              <button onClick={() => setStep(2)} className="w-full py-4 bg-slate-900 text-white font-bold rounded-2xl hover:bg-slate-800 transition-all flex items-center justify-center gap-2">
                Continue <ChevronRight size={18} />
              </button>
            </motion.div>
          )}

          {/* Step 2 */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200 space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputGroup label="Total Value ($) *" name="total_project_value" type="number" value={formData.total_project_value} onChange={handleChange} placeholder="0.00" />
                <InputGroup label="Total Shares *" name="total_shares" type="number" value={formData.total_shares} onChange={handleChange} placeholder="1000" />
              </div>

              {sharePrice > 0 && (
                <div className="bg-emerald-50 p-4 rounded-2xl flex items-center gap-4 border border-emerald-100">
                  <div className="p-2 bg-emerald-500 rounded-full text-white">
                    <CheckCircle size={20} />
                  </div>
                  <div>
                    <p className="text-emerald-800 font-bold">Estimated Share Price: ${sharePrice.toFixed(2)}</p>
                    <p className="text-emerald-600 text-xs">Calculated based on value and total shares.</p>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Restricted Data (Optional)</label>
                <textarea
                  name="restricted_fields"
                  value={formData.restricted_fields}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-emerald-500 outline-none transition-all"
                  placeholder="Private details for approved investors..."
                />
              </div>

              <div className="flex gap-4">
                <button onClick={() => setStep(1)} className="flex-1 py-4 bg-slate-100 text-slate-600 font-bold rounded-2xl hover:bg-slate-200 transition-all flex items-center justify-center gap-2">
                  <ChevronLeft size={18} /> Back
                </button>
                <button onClick={() => setStep(3)} className="flex-1 py-4 bg-slate-900 text-white font-bold rounded-2xl hover:bg-slate-800 transition-all flex items-center justify-center gap-2">
                  Continue <ChevronRight size={18} />
                </button>
              </div>
            </motion.div>
          )}

          {/* Step 3 */}
          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200 space-y-8"
            >
              <div className="space-y-4">
                <div className="border-2 border-dashed border-slate-200 rounded-3xl p-10 text-center hover:border-emerald-500 transition-all relative">
                  <input type="file" name="images" multiple onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer" />
                  <Upload className="mx-auto text-slate-400 mb-3" size={32} />
                  <p className="text-slate-600 font-bold">Click to upload images</p>
                  <p className="text-slate-400 text-xs mt-1">PNG, JPG up to 10MB</p>
                  {files.images.length > 0 && <p className="mt-4 text-emerald-600 font-bold text-sm">{files.images.length} files selected</p>}
                </div>

                <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200">
                  <label className="block text-sm font-bold text-slate-700 mb-3">3D Model (Optional)</label>
                  <input type="file" name="model_3d" onChange={handleFileChange} className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 cursor-pointer" />
                </div>
              </div>

              <div className="flex flex-col md:flex-row gap-4">
                <button onClick={() => setStep(2)} className="py-4 px-6 bg-slate-100 text-slate-600 font-bold rounded-2xl hover:bg-slate-200 transition-all">
                  Back
                </button>
                <button onClick={handleCreateDraft} disabled={loading} className="flex-1 py-4 border-2 border-slate-900 text-slate-900 font-bold rounded-2xl hover:bg-slate-50 transition-all disabled:opacity-50">
                  {loading ? "Saving..." : "Save Draft"}
                </button>
                <button onClick={handleCreateAndSubmit} disabled={loading} className="flex-1 py-4 bg-emerald-600 text-white font-bold rounded-2xl hover:bg-emerald-700 shadow-lg shadow-emerald-200 transition-all disabled:opacity-50">
                  {loading ? "Creating..." : "Create & Submit"}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

// UI Components
const StepCircle = ({ number, label, active, current }) => (
  <div className="flex flex-col items-center gap-2">
    <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold transition-all duration-500 ${current ? "bg-emerald-600 text-white ring-4 ring-emerald-100" :
      active ? "bg-emerald-500 text-white" : "bg-white text-slate-400 border border-slate-200"
      }`}>
      {active && !current && number < 3 ? "✓" : number}
    </div>
    <span className={`text-xs font-bold uppercase tracking-wider ${active ? "text-slate-900" : "text-slate-400"}`}>{label}</span>
  </div>
);

const InputGroup = ({ label, ...props }) => (
  <div className="w-full">
    <label className="block text-sm font-bold text-slate-700 mb-2">{label}</label>
    <input
      {...props}
      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all placeholder:text-slate-400"
    />
  </div>
);

export default CreateProject;