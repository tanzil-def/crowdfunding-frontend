import React, { useEffect, useState } from "react";
import { browseProjects, addToFavorites, removeFromFavorites, getProjectMedia } from "../../services/api";
import { motion } from "framer-motion";
import {
  Search,
  Filter,
  Heart,
  TrendingUp,
  Clock,
  DollarSign,
  Users,
  ChevronRight,
} from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import { getMediaUrl } from "../../utils/media";

const BrowseProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [sortBy, setSortBy] = useState("-created_at");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [favorites, setFavorites] = useState(new Set());

  const categories = [
    "All",
    "Technology",
    "Healthcare",
    "Finance",
    "Real Estate",
    "Education",
    "Energy",
    "Agriculture",
    "Entertainment",
  ];

  const sortOptions = [
    { value: "-created_at", label: "Newest First" },
    { value: "created_at", label: "Oldest First" },
    { value: "-funding_percentage", label: "Most Funded" },
    { value: "funding_percentage", label: "Least Funded" },
    { value: "-total_project_value", label: "Highest Value" },
    { value: "total_project_value", label: "Lowest Value" },
  ];

  useEffect(() => {
    fetchProjects();
  }, [page, search, category, sortBy]);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const params = {
        page,
        page_size: 12,
        ordering: sortBy,
      };
      if (search) params.search = search;
      if (category && category !== "All") params.category = category;

      const res = await browseProjects(params);
      // Handle potential { success: true, data: { ... } } wrapper
      const data = res.data || res;
      setProjects(data.results || []);
      setTotalPages(Math.ceil((data.count || 0) / 12));
    } catch (err) {
      console.error("BrowseProjects fetch error:", err);
      toast.error("Failed to load projects");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleFavorite = async (project) => {
    try {
      if (favorites.has(project.id)) {
        await removeFromFavorites(project.favorite_id);
        setFavorites((prev) => {
          const newSet = new Set(prev);
          newSet.delete(project.id);
          return newSet;
        });
        toast.success("Removed from favorites");
      } else {
        await addToFavorites(project.id);
        setFavorites((prev) => new Set(prev).add(project.id));
        toast.success("Added to favorites");
      }
    } catch (err) {
      toast.error("Failed to update favorites");
    }
  };

  if (loading && projects.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-violet-900 to-slate-900 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-violet-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-violet-900 to-slate-900 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-5xl font-bold bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent mb-2">
            Discover Projects
          </h1>
          <p className="text-gray-400 text-lg">
            Explore investment opportunities across various categories
          </p>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 space-y-4"
        >
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Search projects by title, description..."
              className="w-full pl-12 pr-4 py-4 bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl text-white placeholder-gray-400 focus:border-violet-500 focus:outline-none"
            />
          </div>

          {/* Category Filters */}
          <div className="flex gap-3 overflow-x-auto pb-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setCategory(cat === "All" ? "" : cat);
                  setPage(1);
                }}
                className={`px-6 py-3 rounded-xl font-semibold whitespace-nowrap transition-all ${(category === cat || (cat === "All" && !category))
                  ? "bg-gradient-to-r from-violet-500 to-purple-500 text-white shadow-lg shadow-violet-500/50"
                  : "bg-slate-700/50 text-gray-300 hover:bg-slate-700"
                  }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Sort Options */}
          <div className="flex items-center gap-3">
            <Filter className="w-5 h-5 text-gray-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white focus:border-violet-500 focus:outline-none"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </motion.div>

        {/* Projects Grid */}
        {projects.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-12 text-center"
          >
            <Search className="w-20 h-20 text-violet-400 mx-auto mb-4 opacity-50" />
            <h2 className="text-2xl font-bold text-white mb-2">No Projects Found</h2>
            <p className="text-gray-400">Try adjusting your search or filters</p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {projects.map((project, index) => (
              <ProjectCard
                key={project.id}
                project={project}
                index={index}
                favorites={favorites}
                onToggleFavorite={handleToggleFavorite}
              />
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2">
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

const ProjectCard = ({ project, index, favorites, onToggleFavorite }) => {
  const [coverImage, setCoverImage] = useState(null);

  useEffect(() => {
    const fetchMedia = async () => {
      try {
        const mediaData = await getProjectMedia(project.id);
        if (mediaData.results && mediaData.results.length > 0) {
          const imageItem = mediaData.results.find(m => m.type === "IMAGE") || mediaData.results[0];
          setCoverImage(imageItem.file || imageItem.file_url);
        }
      } catch (err) {
        console.error("Failed to fetch project media:", err);
      }
    };
    fetchMedia();
  }, [project.id]);

  const getFundingColor = (percentage) => {
    if (percentage >= 75) return "text-green-400";
    if (percentage >= 50) return "text-blue-400";
    if (percentage >= 25) return "text-yellow-400";
    return "text-orange-400";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="group relative bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl overflow-hidden hover:border-violet-500/50 transition-all font-sans"
    >
      {/* Favorite Button */}
      <button
        onClick={() => onToggleFavorite(project)}
        className="absolute top-4 right-4 z-10 p-2 bg-slate-900/80 backdrop-blur-sm rounded-full hover:bg-slate-800 transition-colors"
      >
        <Heart
          className={`w-5 h-5 ${favorites.has(project.id)
            ? "fill-red-500 text-red-500"
            : "text-gray-400"
            }`}
        />
      </button>

      {/* Project Image */}
      <div className="h-48 overflow-hidden relative">
        <img
          src={getMediaUrl(coverImage) || "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"}
          alt={project.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute top-4 left-4 z-10">
          <span className="px-3 py-1 bg-violet-500/80 backdrop-blur-md text-white rounded-full text-xs font-semibold shadow-lg">
            {project.category}
          </span>
        </div>
      </div>

      <div className="p-6">
        {/* Title */}
        <h3 className="text-xl font-bold text-white mb-3 group-hover:text-violet-400 transition-colors line-clamp-2">
          {project.title}
        </h3>

        {/* Stats Grid */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-400 flex items-center gap-1">
              <DollarSign className="w-4 h-4" />
              Total Value
            </span>
            <span className="text-white font-semibold">
              ${parseFloat(project.total_project_value).toLocaleString()}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-400 flex items-center gap-1">
              <TrendingUp className="w-4 h-4" />
              Share Price
            </span>
            <span className="text-white font-semibold">
              ${parseFloat(project.share_price).toFixed(2)}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-400 flex items-center gap-1">
              <Clock className="w-4 h-4" />
              Duration
            </span>
            <span className="text-white font-semibold">
              {project.duration_days} days
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="text-gray-400">Funding Progress</span>
            <span className={`font-bold ${getFundingColor(project.funding_percentage)}`}>
              {project.funding_percentage.toFixed(1)}%
            </span>
          </div>
          <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${project.funding_percentage}%` }}
              transition={{ duration: 1, delay: index * 0.05 }}
              className={`h-full bg-gradient-to-r ${project.funding_percentage >= 75
                ? "from-green-500 to-emerald-500"
                : project.funding_percentage >= 50
                  ? "from-blue-500 to-cyan-500"
                  : project.funding_percentage >= 25
                    ? "from-yellow-500 to-orange-500"
                    : "from-orange-500 to-red-500"
                }`}
            />
          </div>
          <div className="flex items-center justify-between text-xs mt-2">
            <span className="text-gray-400">
              {project.shares_sold.toLocaleString()} / {project.total_shares.toLocaleString()} shares
            </span>
            <span className="text-gray-400">
              {project.remaining_shares.toLocaleString()} left
            </span>
          </div>
        </div>

        {/* View Details Button */}
        <Link
          to={`/investor/projects/${project.id}`}
          className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-gradient-to-r from-violet-500 to-purple-500 text-white rounded-xl font-semibold hover:from-violet-600 hover:to-purple-600 transition-all shadow-lg hover:shadow-violet-500/50"
        >
          View Details
          <ChevronRight className="w-5 h-5" />
        </Link>
      </div>
    </motion.div>
  );
};

export default BrowseProjects;