import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, Filter, Heart, CheckCircle2, ArrowRight,
  Lock, Unlock, LayoutGrid, X, Info, TrendingUp, DollarSign
} from "lucide-react";
import { toast } from "react-hot-toast";
import investorService from "../../api/investorService";

const CompareProjects = () => {
  const navigate = useNavigate();

  // States
  const [projects, setProjects] = useState([]);
  const [favoriteMap, setFavoriteMap] = useState({}); // Stores Project ID -> Favorite ID mapping
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [loading, setLoading] = useState(true);

  // Selection for Comparison
  const [selectedIds, setSelectedIds] = useState([]);
  const [compareData, setCompareData] = useState(null);
  const [isComparing, setIsComparing] = useState(false);

  const categories = ["All", "Sustainability", "Technology", "Infrastructure", "Energy"];

  // 1. Fetch Projects & Favorites on Mount
  useEffect(() => {
    fetchData();
  }, [search, selectedCategory]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const params = {
        page_size: 24,
        search: search,
        category: selectedCategory === "All" ? undefined : selectedCategory
      };

      // Fetching both projects and current favorites
      const [projRes, favRes] = await Promise.all([
        investorService.browseProjects(params),
        investorService.getFavorites() // GET /api/v1/favorites/list/
      ]);

      setProjects(projRes.results || []);

      // Map favorite results: { project_id: favorite_record_id }
      const favMap = {};
      if (favRes.results) {
        favRes.results.forEach(fav => {
          favMap[fav.project] = fav.id;
        });
      }
      setFavoriteMap(favMap);

    } catch (err) {
      console.error(err);
      toast.error("Error connecting to server");
    } finally {
      setLoading(false);
    }
  };

  // 2. Favorite Toggle Logic (POST/DELETE)
  const toggleFavorite = async (e, projectId) => {
    e.stopPropagation(); // Prevent selecting for comparison when clicking heart
    const favoriteId = favoriteMap[projectId];

    try {
      if (favoriteId) {
        // DELETE /api/v1/favorites/{id}/
        await investorService.removeFromFavorites(favoriteId);

        // Update local state
        setFavoriteMap(prev => {
          const newMap = { ...prev };
          delete newMap[projectId];
          return newMap;
        });
        toast.success("Removed from favorites");
      } else {
        // POST /api/v1/favorites/
        const res = await investorService.addToFavorites(projectId);

        // Update local state with new favorite ID
        setFavoriteMap(prev => ({
          ...prev,
          [projectId]: res.id
        }));
        toast.success("Added to favorites");
      }
    } catch (err) {
      console.error(err);
      toast.error("Could not update favorites");
    }
  };

  // 3. Comparison Logic (GET /api/v1/projects/compare/)
  const handleCompare = async () => {
    if (selectedIds.length < 2) return toast.error("Select at least 2 projects");
    setIsComparing(true);
    try {
      const res = await investorService.compareProjects(selectedIds);
      setCompareData(res.data || res); // Handle potentially nested response
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

      {/* Header Area */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-black tracking-tight text-slate-800">INVESTOR <span className="text-blue-600">COMPARE</span></h1>
          </div>
          <div className="flex gap-4">
            {selectedIds.length >= 2 && (
              <motion.button
                initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                onClick={handleCompare}
                className="px-6 py-2 bg-blue-600 text-white rounded-full font-bold text-sm shadow-lg shadow-blue-200 flex items-center gap-2"
              >
                COMPARE {selectedIds.length} ITEMS <ArrowRight size={16} />
              </motion.button>
            )}
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8">

        {/* Filter Sidebar (GSM Arena Style) */}
        <aside className="lg:col-span-3 space-y-6">
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-6 flex items-center gap-2">
              <Filter size={16} /> Filter Assets
            </h3>

            <div className="space-y-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="text"
                  placeholder="Search project..."
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm"
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              <div>
                <p className="text-[11px] font-bold text-slate-400 uppercase mb-3">Categories</p>
                <div className="flex flex-col gap-2">
                  {categories.map(cat => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`text-left px-4 py-2 rounded-xl text-sm font-semibold transition-all ${selectedCategory === cat
                        ? "bg-blue-50 text-blue-600"
                        : "text-slate-600 hover:bg-slate-50"
                        }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Project Grid */}
        <main className="lg:col-span-9">
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => <div key={i} className="h-80 bg-slate-200 animate-pulse rounded-3xl"></div>)}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {projects.map((project) => (
                <motion.div
                  layout
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  key={project.id}
                  className={`group relative bg-white rounded-[2rem] border-2 transition-all cursor-pointer overflow-hidden ${selectedIds.includes(project.id) ? "border-blue-500 shadow-xl shadow-blue-100" : "border-transparent shadow-sm"
                    }`}
                  onClick={() => toggleSelection(project.id)}
                >
                  {/* Top Actions */}
                  <div className="absolute top-4 inset-x-4 flex justify-between z-10">
                    <button
                      onClick={(e) => toggleFavorite(e, project.id)}
                      className={`p-2 rounded-full backdrop-blur-md transition-all shadow-sm ${favoriteMap[project.id] ? "bg-white text-red-500" : "bg-white/80 text-slate-400 hover:text-red-500"
                        }`}
                    >
                      <Heart size={18} fill={favoriteMap[project.id] ? "currentColor" : "none"} />
                    </button>
                    {selectedIds.includes(project.id) && (
                      <div className="bg-blue-600 text-white p-1 rounded-full"><CheckCircle2 size={20} /></div>
                    )}
                  </div>

                  {/* Image Placeholder */}
                  <div className="aspect-[4/5] bg-slate-100 relative overflow-hidden">
                    <img
                      src={project.image || project.thumbnail || `https://api.dicebear.com/7.x/shapes/svg?seed=${project.title}`}
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>

                  <div className="p-5">
                    <p className="text-[10px] font-black text-blue-600 uppercase mb-1 tracking-widest">{project.category}</p>
                    <h3 className="font-bold text-slate-800 line-clamp-1 mb-3">{project.title}</h3>
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-black text-slate-900">${project.share_price}</span>
                      <div className="flex flex-col items-end">
                        <span className="text-[10px] text-slate-400 font-bold uppercase">Funding</span>
                        <span className="text-xs font-bold text-emerald-500">{project.funding_percentage}%</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Comparison Modal (GSM Arena Spec Style) */}
      <AnimatePresence>
        {compareData && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-slate-900/90 backdrop-blur-md flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
              className="bg-white w-full max-w-6xl max-h-[90vh] rounded-[3rem] overflow-hidden shadow-2xl flex flex-col"
            >
              <div className="p-8 border-b flex justify-between items-center">
                <h2 className="text-2xl font-black text-slate-800 uppercase italic tracking-tighter">Technical <span className="text-blue-600">Specs</span></h2>
                <button onClick={() => setCompareData(null)} className="p-3 bg-slate-100 hover:bg-slate-200 rounded-full transition-all">
                  <X size={20} />
                </button>
              </div>

              <div className="flex-1 overflow-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-slate-50">
                      <th className="p-6 text-left text-xs font-black text-slate-400 uppercase border-b">Feature</th>
                      {compareData.projects.map(p => (
                        <th key={p.id} className="p-6 text-center border-b min-w-[200px]">
                          <div className="w-20 h-24 bg-slate-200 rounded-xl mx-auto mb-3 overflow-hidden">
                            <img src={p.image} className="w-full h-full object-cover" alt="" />
                          </div>
                          <p className="font-black text-slate-800 text-sm">{p.title}</p>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {/* Rows */}
                    {[
                      { label: "Total Value", key: "total_project_value", icon: <DollarSign size={14} />, format: (v) => `$${parseFloat(v).toLocaleString()}` },
                      { label: "Share Price", key: "share_price", icon: <TrendingUp size={14} />, format: (v) => `$${v}` },
                      { label: "Duration", key: "duration_days", icon: <Info size={14} />, format: (v) => `${v} Days` },
                      { label: "Developer", key: "developer_name", icon: <Info size={14} /> },
                    ].map((row) => (
                      <tr key={row.label} className="hover:bg-slate-50 transition-colors">
                        <td className="p-6 font-bold text-slate-400 text-xs uppercase flex items-center gap-2">
                          {row.icon} {row.label}
                        </td>
                        {compareData.projects.map(p => (
                          <td key={p.id} className="p-6 text-center font-bold text-slate-700 text-sm">
                            {p.has_access ? (row.format ? row.format(p[row.key]) : p[row.key]) : (
                              <span className="text-amber-500 flex items-center justify-center gap-1"><Lock size={12} /> Locked</span>
                            )}
                          </td>
                        ))}
                      </tr>
                    ))}
                    {/* Access Row */}
                    <tr className="bg-blue-50/50">
                      <td className="p-6 font-bold text-blue-600 text-xs uppercase">Platform Access</td>
                      {compareData.projects.map(p => (
                        <td key={p.id} className="p-6 text-center">
                          {p.has_access ? <span className="text-emerald-600 font-bold text-xs uppercase">Approved</span> : (
                            <button className="text-[10px] font-black bg-blue-600 text-white px-4 py-2 rounded-lg">REQUEST ACCESS</button>
                          )}
                        </td>
                      ))}
                    </tr>
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