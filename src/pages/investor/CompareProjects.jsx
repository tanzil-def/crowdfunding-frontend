import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, Filter, Heart, CheckCircle2, ArrowRight,
  Lock, X, Info, TrendingUp, DollarSign
} from "lucide-react";
import { toast } from "react-hot-toast";
import investorService from "../../api/investorService";
import { getMediaUrl } from "../../utils/media";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

const CompareProjects = () => {
  const navigate = useNavigate();

  const [projects, setProjects] = useState([]);
  const [favoriteMap, setFavoriteMap] = useState({});
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState([]);
  const [compareData, setCompareData] = useState(null);
  const [isComparing, setIsComparing] = useState(false);

  const categories = ["All", "Sustainability", "Technology", "Infrastructure", "Energy"];

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        page_size: 24,
        search: search,
        category: selectedCategory === "All" ? undefined : selectedCategory
      };

      const [projRes, favRes] = await Promise.all([
        investorService.browseProjects(params),
        investorService.getFavorites({ page_size: 100 })
      ]);

      setProjects(projRes.results || []);

      const favMap = {};
      const results = favRes.results || (Array.isArray(favRes) ? favRes : []);
      results.forEach(fav => {
        const projectId = typeof fav.project === 'object' ? fav.project.id : fav.project;
        favMap[projectId] = fav.id;
      });
      setFavoriteMap(favMap);
    } catch (err) {
      console.error(err);
      toast.error("Error connecting to server");
    } finally {
      setLoading(false);
    }
  }, [search, selectedCategory]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const getImageUrl = (project) => {
    const path = project.image || project.thumbnail || project.image_url || project.cover_image;
    return getMediaUrl(path) || `https://api.dicebear.com/7.x/shapes/svg?seed=${project.id || 'default'}`;
  };

  const toggleFavorite = async (e, projectId) => {
    e.stopPropagation();
    const favoriteId = favoriteMap[projectId];
    try {
      if (favoriteId) {
        await investorService.removeFromFavorites(favoriteId);
        setFavoriteMap(prev => {
          const newMap = { ...prev };
          delete newMap[projectId];
          return newMap;
        });
        toast.success("Removed from favorites");
      } else {
        const res = await investorService.addToFavorites(projectId);
        setFavoriteMap(prev => ({ ...prev, [projectId]: res.id }));
        toast.success("Added to favorites");
      }
    } catch (err) {
      if (err.response?.status === 409) {
        fetchData();
      } else {
        toast.error("Could not update favorites");
      }
    }
  };

  const handleCompare = async () => {
    if (selectedIds.length < 2) return toast.error("Select at least 2 projects");
    setIsComparing(true);
    try {
      const res = await investorService.compareProjects(selectedIds);
      // Backend res format can be { projects: [], restricted_fields: [] }
      setCompareData(res.data || res);
    } catch (err) {
      toast.error("Comparison failed");
    } finally {
      setIsComparing(false);
    }
  };

  const toggleSelection = (id) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(i => i !== id));
    } else {
      if (selectedIds.length >= 4) return toast.error("Max 4 projects");
      setSelectedIds([...selectedIds, id]);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-black tracking-tight text-slate-800">
            INVESTOR <span className="text-blue-600">COMPARE</span>
          </h1>
          <AnimatePresence>
            {selectedIds.length >= 2 && (
              <motion.button
                initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.8, opacity: 0 }}
                onClick={handleCompare}
                className="px-6 py-2 bg-blue-600 text-white rounded-full font-bold text-sm shadow-lg shadow-blue-200 flex items-center gap-2 hover:bg-blue-700 transition-colors"
                disabled={isComparing}
              >
                {isComparing ? "LOADING..." : `COMPARE ${selectedIds.length} ITEMS`} <ArrowRight size={16} />
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Sidebar */}
        <aside className="lg:col-span-3 space-y-6">
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-6 flex items-center gap-2"><Filter size={16} /> Filter</h3>
            <div className="space-y-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="text" placeholder="Search..."
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-2">
                {categories.map(cat => (
                  <button
                    key={cat} onClick={() => setSelectedCategory(cat)}
                    className={`text-left px-4 py-2 rounded-xl text-sm font-semibold transition-all ${selectedCategory === cat ? "bg-blue-50 text-blue-600" : "text-slate-600 hover:bg-slate-50"}`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* Main Grid */}
        <main className="lg:col-span-9">
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => <div key={i} className="h-80 bg-slate-200 animate-pulse rounded-3xl"></div>)}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {projects.map((project) => (
                <motion.div
                  layout key={project.id}
                  onClick={() => toggleSelection(project.id)}
                  className={`group relative bg-white rounded-[2rem] border-2 transition-all cursor-pointer overflow-hidden ${selectedIds.includes(project.id) ? "border-blue-500 shadow-xl shadow-blue-100" : "border-transparent shadow-sm"}`}
                >
                  <div className="absolute top-4 inset-x-4 flex justify-between z-10">
                    <button onClick={(e) => toggleFavorite(e, project.id)} className={`p-2 rounded-full backdrop-blur-md transition-all ${favoriteMap[project.id] ? "bg-white text-red-500" : "bg-white/80 text-slate-400"}`}>
                      <Heart size={18} fill={favoriteMap[project.id] ? "currentColor" : "none"} />
                    </button>
                    {selectedIds.includes(project.id) && <div className="bg-blue-600 text-white p-1 rounded-full"><CheckCircle2 size={20} /></div>}
                  </div>
                  <div className="aspect-[4/5] bg-slate-100 relative">
                    <img src={getImageUrl(project)} alt={project.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  </div>
                  <div className="p-5">
                    <p className="text-[10px] font-black text-blue-600 uppercase mb-1">{project.category}</p>
                    <h3 className="font-bold text-slate-800 line-clamp-1 mb-3">{project.title}</h3>
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-black text-slate-900">${project.share_price}</span>
                      <span className="text-xs font-bold text-emerald-500">{project.funding_percentage}%</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Comparison Modal */}
      <AnimatePresence>
        {compareData && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-slate-900/90 backdrop-blur-md flex items-center justify-center p-4">
            <motion.div initial={{ y: 50 }} animate={{ y: 0 }} className="bg-white w-full max-w-6xl max-h-[90vh] rounded-[3rem] overflow-hidden flex flex-col">
              <div className="p-8 border-b flex justify-between items-center">
                <h2 className="text-2xl font-black text-slate-800 uppercase italic">Technical <span className="text-blue-600">Specs</span></h2>
                <button onClick={() => setCompareData(null)} className="p-3 bg-slate-100 rounded-full hover:bg-slate-200 transition-all"><X size={20} /></button>
              </div>
              <div className="flex-1 overflow-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-slate-50">
                      <th className="p-6 text-left text-xs font-black text-slate-400 uppercase">Feature</th>
                      {compareData.projects?.map(p => (
                        <th key={p.id} className="p-6 text-center min-w-[200px]">
                          <div className="w-24 h-24 bg-slate-200 rounded-2xl mx-auto mb-3 overflow-hidden border-2 border-white shadow-md">
                            <img src={getImageUrl(p)} className="w-full h-full object-cover" alt="" />
                          </div>
                          <p className="font-black text-slate-800 text-sm leading-tight">{p.title}</p>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {[
                      { label: "Total Value", key: "total_project_value", icon: <DollarSign size={14} />, format: (v) => `$${parseFloat(v).toLocaleString()}`, isPublic: true },
                      { label: "Share Price", key: "share_price", icon: <TrendingUp size={14} />, format: (v) => `$${v}`, isPublic: true },
                      { label: "Duration", key: "duration_days", icon: <Info size={14} />, format: (v) => `${v} Days`, isPublic: true },
                      { label: "Developer", key: "developer_name", icon: <Info size={14} />, isPublic: true },
                    ].map((row) => (
                      <tr key={row.label} className="hover:bg-slate-50 transition-colors">
                        <td className="p-6 font-bold text-slate-400 text-xs uppercase flex items-center gap-2">{row.icon} {row.label}</td>
                        {compareData.projects?.map(p => (
                          <td key={p.id} className="p-6 text-center font-bold text-slate-700 text-sm">
                            {(row.isPublic || p.has_access) ? (row.format ? row.format(p[row.key]) : p[row.key]) : (
                              <span className="text-amber-500 flex items-center justify-center gap-1"><Lock size={12} /> Locked</span>
                            )}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CompareProjects;