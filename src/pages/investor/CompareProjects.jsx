import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import investorService from "../../api/investorService";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  X,
  DollarSign,
  TrendingUp,
  Calendar,
  Users,
  Lock,
  Unlock,
  Search,
  AlertCircle,
  CheckCircle,
  Eye,
} from "lucide-react";
import { toast } from "react-hot-toast";

const CompareProjects = () => {
  const navigate = useNavigate();
  const [selectedProjects, setSelectedProjects] = useState([]);
  const [compareData, setCompareData] = useState([]);
  const [availableProjects, setAvailableProjects] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchAvailableProjects();
  }, [search]);

  useEffect(() => {
    if (selectedProjects.length >= 2) {
      fetchCompareData();
    } else {
      setCompareData([]);
    }
  }, [selectedProjects]);

  const fetchAvailableProjects = async () => {
    try {
      const params = { page_size: 20 };
      if (search) params.search = search;
      const data = await investorService.browseProjects(params);
      setAvailableProjects(data.results || []);
    } catch (err) {
      toast.error("Failed to load projects");
    }
  };

  const fetchCompareData = async () => {
    try {
      setLoading(true);
      const data = await investorService.compareProjects(selectedProjects);
      setCompareData(data.projects || data.results || []);
    } catch (err) {
      console.error("Compare error:", err);
      toast.error("Failed to compare projects");
    } finally {
      setLoading(false);
    }
  };

  const addProject = (projectId) => {
    if (selectedProjects.length >= 4) {
      toast.error("Maximum 4 projects can be compared");
      return;
    }
    if (selectedProjects.includes(projectId)) {
      toast.error("Project already added");
      return;
    }
    setSelectedProjects([...selectedProjects, projectId]);
    setShowAddModal(false);
    toast.success("Project added to comparison");
  };

  const removeProject = (projectId) => {
    setSelectedProjects(selectedProjects.filter((id) => id !== projectId));
    toast.success("Project removed from comparison");
  };

  const handleRequestAccess = async (projectId) => {
    try {
      await investorService.requestAccess(projectId, "Requesting access to restricted fields for comparison");
      toast.success("Access request sent successfully");
    } catch (err) {
      toast.error("Failed to request access");
    }
  };

  const comparisonFields = [
    { label: "Category", key: "category", icon: <TrendingUp size={14} /> },
    {
      label: "Total Value",
      key: "total_project_value",
      icon: <DollarSign size={14} />,
      format: (v) => `$${parseFloat(v).toLocaleString()}`,
      highlight: true
    },
    {
      label: "Total Shares",
      key: "total_shares",
      format: (v) => v.toLocaleString(),
      highlight: true
    },
    {
      label: "Share Price",
      key: "share_price",
      icon: <DollarSign size={14} />,
      format: (v) => `$${parseFloat(v).toFixed(2)}`,
      highlight: true
    },
    {
      label: "Shares Sold",
      key: "shares_sold",
      format: (v) => v.toLocaleString()
    },
    {
      label: "Remaining Shares",
      key: "remaining_shares",
      format: (v) => v.toLocaleString(),
      highlight: true
    },
    {
      label: "Funding Progress",
      key: "funding_percentage",
      icon: <TrendingUp size={14} />,
      format: (v) => `${v.toFixed(1)}%`,
      highlight: true,
      isProgress: true
    },
    {
      label: "Duration",
      key: "duration_days",
      icon: <Calendar size={14} />,
      format: (v) => `${v} days`
    },
    {
      label: "Developer",
      key: "developer_name",
      icon: <Users size={14} />
    },
    {
      label: "Created Date",
      key: "created_at",
      format: (v) => new Date(v).toLocaleDateString()
    },
  ];

  const getHighlightClass = (field, value, allValues) => {
    if (!field.highlight) return "";

    const numericValues = allValues.map(v => parseFloat(v) || 0);
    const max = Math.max(...numericValues);
    const min = Math.min(...numericValues);
    const current = parseFloat(value) || 0;

    if (field.key === "funding_percentage" || field.key === "remaining_shares") {
      if (current === max) return "bg-emerald-500/10 border-emerald-500/30";
      if (current === min) return "bg-red-500/10 border-red-500/30";
    } else if (field.key === "share_price") {
      if (current === min) return "bg-emerald-500/10 border-emerald-500/30";
      if (current === max) return "bg-yellow-500/10 border-yellow-500/30";
    }

    return "";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
            Compare Projects
          </h1>
          <p className="text-gray-400 text-lg">
            Compare up to 4 projects side-by-side to make informed investment decisions
          </p>
        </motion.div>

        {/* Add Project Button */}
        {selectedProjects.length < 4 && (
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={() => setShowAddModal(true)}
            className="mb-6 flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold hover:from-purple-600 hover:to-pink-600 transition-all shadow-lg hover:shadow-purple-500/50"
          >
            <Plus className="w-5 h-5" />
            Add Project to Compare ({selectedProjects.length}/4)
          </motion.button>
        )}

        {/* Comparison Table */}
        {selectedProjects.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-12 text-center"
          >
            <Search className="w-20 h-20 text-purple-400 mx-auto mb-4 opacity-50" />
            <h2 className="text-2xl font-bold text-white mb-2">No Projects Selected</h2>
            <p className="text-gray-400 mb-6">
              Add at least 2 projects to compare their features side-by-side
            </p>
            <button
              onClick={() => setShowAddModal(true)}
              className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold hover:from-purple-600 hover:to-pink-600 transition-all"
            >
              Get Started
            </button>
          </motion.div>
        ) : selectedProjects.length === 1 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-12 text-center"
          >
            <AlertCircle className="w-20 h-20 text-yellow-400 mx-auto mb-4 opacity-50" />
            <h2 className="text-2xl font-bold text-white mb-2">Add One More Project</h2>
            <p className="text-gray-400 mb-6">
              You need at least 2 projects to start comparing
            </p>
            <button
              onClick={() => setShowAddModal(true)}
              className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold hover:from-purple-600 hover:to-pink-600 transition-all"
            >
              Add Another Project
            </button>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl overflow-hidden"
          >
            {loading ? (
              <div className="flex items-center justify-center p-12">
                <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-slate-700/50">
                      <th className="p-4 text-left text-gray-400 font-semibold sticky left-0 bg-slate-700/50 z-10 min-w-[180px]">
                        Feature
                      </th>
                      {compareData.map((project) => (
                        <th key={project.id} className="p-4 text-center min-w-[250px]">
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1">
                              <h3 className="text-white font-bold text-lg mb-1">
                                {project.title}
                              </h3>
                              <div className="flex items-center justify-center gap-2">
                                <button
                                  onClick={() => navigate(`/investor/projects/${project.id}`)}
                                  className="text-purple-400 hover:text-purple-300 text-sm flex items-center gap-1"
                                >
                                  <Eye size={14} />
                                  View Details
                                </button>
                              </div>
                            </div>
                            <button
                              onClick={() => removeProject(project.id)}
                              className="p-2 hover:bg-slate-600 rounded-lg transition-colors"
                            >
                              <X className="w-4 h-4 text-gray-400" />
                            </button>
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {comparisonFields.map((field, index) => (
                      <tr
                        key={field.key}
                        className={index % 2 === 0 ? "bg-slate-700/20" : "bg-transparent"}
                      >
                        <td className="p-4 text-gray-300 font-semibold sticky left-0 bg-slate-800/90 z-10">
                          <div className="flex items-center gap-2">
                            {field.icon}
                            {field.label}
                          </div>
                        </td>
                        {compareData.map((project) => {
                          const value = project[field.key];
                          const allValues = compareData.map(p => p[field.key]);
                          const highlightClass = getHighlightClass(field, value, allValues);

                          return (
                            <td
                              key={project.id}
                              className={`p-4 text-center text-white border border-transparent ${highlightClass}`}
                            >
                              {field.isProgress ? (
                                <div className="space-y-2">
                                  <div className="text-sm font-semibold">
                                    {field.format ? field.format(value) : value}
                                  </div>
                                  <div className="w-full bg-slate-700 rounded-full h-2">
                                    <div
                                      className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all"
                                      style={{ width: `${Math.min(value, 100)}%` }}
                                    />
                                  </div>
                                </div>
                              ) : (
                                field.format ? field.format(value) : value
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    ))}

                    {/* Restricted Fields Row */}
                    <tr className="bg-slate-700/30">
                      <td className="p-4 text-gray-300 font-semibold sticky left-0 bg-slate-700/30 z-10">
                        <div className="flex items-center gap-2">
                          <Lock size={14} />
                          Restricted Access
                        </div>
                      </td>
                      {compareData.map((project) => (
                        <td key={project.id} className="p-4 text-center">
                          {project.has_access ? (
                            <div className="flex items-center justify-center gap-2 text-emerald-400">
                              <Unlock size={16} />
                              <span className="text-sm">Full Access</span>
                            </div>
                          ) : project.restricted_fields && project.restricted_fields.length > 0 ? (
                            <div className="space-y-2">
                              <div className="flex items-center justify-center gap-2 text-yellow-400">
                                <Lock size={16} />
                                <span className="text-sm">{project.restricted_fields.length} fields locked</span>
                              </div>
                              <button
                                onClick={() => handleRequestAccess(project.id)}
                                className="text-xs px-3 py-1 bg-purple-500/20 text-purple-400 rounded-lg hover:bg-purple-500/30 transition-all"
                              >
                                Request Access
                              </button>
                            </div>
                          ) : (
                            <div className="flex items-center justify-center gap-2 text-gray-500">
                              <CheckCircle size={16} />
                              <span className="text-sm">No Restrictions</span>
                            </div>
                          )}
                        </td>
                      ))}
                    </tr>

                    {/* Action Row */}
                    <tr className="bg-slate-700/30">
                      <td className="p-4 text-gray-300 font-semibold sticky left-0 bg-slate-700/30 z-10">
                        Action
                      </td>
                      {compareData.map((project) => (
                        <td key={project.id} className="p-4 text-center">
                          <button
                            onClick={() => navigate(`/investor/projects/${project.id}/invest`)}
                            disabled={project.remaining_shares === 0}
                            className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-semibold hover:from-purple-600 hover:to-pink-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {project.remaining_shares > 0 ? "Invest Now" : "Fully Funded"}
                          </button>
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            )}

            {/* Footer Note */}
            <div className="p-4 bg-slate-700/20 border-t border-slate-700/50 text-center">
              <p className="text-xs text-gray-500">
                <AlertCircle size={12} className="inline mr-1" />
                Metrics are real-time. Highlighted values show best/worst performers. Restricted fields require admin approval.
              </p>
            </div>
          </motion.div>
        )}

        {/* Add Project Modal */}
        <AnimatePresence>
          {showAddModal && (
            <div
              className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
              onClick={() => setShowAddModal(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-slate-800 border border-slate-700 rounded-2xl p-8 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-white">Select Project to Compare</h2>
                  <button
                    onClick={() => setShowAddModal(false)}
                    className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-400" />
                  </button>
                </div>

                {/* Search */}
                <div className="relative mb-6">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search projects..."
                    className="w-full pl-12 pr-4 py-3 bg-slate-700 text-white rounded-xl border border-slate-600 focus:border-purple-500 focus:outline-none"
                  />
                </div>

                {/* Projects List */}
                <div className="space-y-3">
                  {availableProjects
                    .filter((p) => !selectedProjects.includes(p.id))
                    .map((project) => (
                      <div
                        key={project.id}
                        onClick={() => addProject(project.id)}
                        className="p-4 bg-slate-700/30 hover:bg-slate-700/50 rounded-xl cursor-pointer transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <h3 className="text-white font-semibold mb-1">{project.title}</h3>
                            <div className="flex items-center gap-3 text-sm text-gray-400">
                              <span>{project.category}</span>
                              <span>•</span>
                              <span>${parseFloat(project.share_price).toFixed(2)}/share</span>
                              <span>•</span>
                              <span>{project.funding_percentage.toFixed(0)}% funded</span>
                            </div>
                          </div>
                          <Plus className="w-5 h-5 text-purple-400" />
                        </div>
                      </div>
                    ))}
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default CompareProjects;