import React, { useEffect, useState } from "react";
import adminService from "../../api/adminService";
import { motion } from "framer-motion";
import {
  FileText,
  Search,
  Filter,
  Calendar,
  User,
  Activity,
  Database,
  Clock,
} from "lucide-react";
import { toast } from "react-hot-toast";

const AuditLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [actionFilter, setActionFilter] = useState("ALL");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchLogs();
  }, [page, search, actionFilter]);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const params = { page, page_size: 20 };
      if (search) params.search = search;
      if (actionFilter !== "ALL") params.action = actionFilter;

      const res = await adminService.getAuditLogs(params);
      // Handle potential { success: true, data: { ... } } wrapper
      const data = res.data || res;
      setLogs(data.results || []);
      setTotalPages(Math.ceil((data.count || 0) / 20));
    } catch (err) {
      console.error("AuditLogs fetch error:", err);
      toast.error("Failed to load audit logs");
    } finally {
      setLoading(false);
    }
  };

  const getActionColor = (action) => {
    const actionLower = action.toLowerCase();
    if (actionLower.includes("approve")) return "text-green-400 bg-green-500/10";
    if (actionLower.includes("reject")) return "text-red-400 bg-red-500/10";
    if (actionLower.includes("revoke")) return "text-orange-400 bg-orange-500/10";
    if (actionLower.includes("create")) return "text-blue-400 bg-blue-500/10";
    if (actionLower.includes("update")) return "text-purple-400 bg-purple-500/10";
    if (actionLower.includes("delete")) return "text-red-400 bg-red-500/10";
    return "text-gray-400 bg-gray-500/10";
  };

  const getEntityIcon = (entityType) => {
    const type = entityType?.toLowerCase();
    if (type?.includes("project")) return Activity;
    if (type?.includes("user")) return User;
    if (type?.includes("payment") || type?.includes("investment")) return Database;
    return FileText;
  };

  if (loading && logs.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-900 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-gray-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-900 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-5xl font-bold bg-gradient-to-r from-gray-400 to-slate-400 bg-clip-text text-transparent mb-2">
            Audit Logs
          </h1>
          <p className="text-gray-400 text-lg">
            Complete audit trail of all critical platform actions
          </p>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 space-y-4"
        >
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search logs by actor, action, or entity..."
              className="w-full pl-12 pr-4 py-4 bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl text-white placeholder-gray-400 focus:border-gray-500 focus:outline-none"
            />
          </div>

          {/* Action Filters */}
          <div className="flex gap-3 overflow-x-auto pb-2">
            {["ALL", "APPROVE", "REJECT", "REVOKE", "CREATE", "UPDATE", "DELETE"].map((action) => (
              <button
                key={action}
                onClick={() => {
                  setActionFilter(action);
                  setPage(1);
                }}
                className={`px-6 py-3 rounded-xl font-semibold whitespace-nowrap transition-all ${actionFilter === action
                  ? "bg-gradient-to-r from-gray-500 to-slate-500 text-white shadow-lg shadow-gray-500/50"
                  : "bg-slate-700/50 text-gray-300 hover:bg-slate-700"
                  }`}
              >
                {action}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Logs List */}
        {logs.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-12 text-center"
          >
            <FileText className="w-20 h-20 text-gray-400 mx-auto mb-4 opacity-50" />
            <h2 className="text-2xl font-bold text-white mb-2">No Audit Logs Found</h2>
            <p className="text-gray-400">Try adjusting your search or filters</p>
          </motion.div>
        ) : (
          <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-700/50 border-b border-slate-700">
                  <tr>
                    <th className="px-6 py-4 text-left text-gray-400 font-semibold">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        Timestamp
                      </div>
                    </th>
                    <th className="px-6 py-4 text-left text-gray-400 font-semibold">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4" />
                        Actor
                      </div>
                    </th>
                    <th className="px-6 py-4 text-left text-gray-400 font-semibold">
                      <div className="flex items-center gap-2">
                        <Activity className="w-4 h-4" />
                        Action
                      </div>
                    </th>
                    <th className="px-6 py-4 text-left text-gray-400 font-semibold">
                      <div className="flex items-center gap-2">
                        <Database className="w-4 h-4" />
                        Entity
                      </div>
                    </th>
                    <th className="px-6 py-4 text-left text-gray-400 font-semibold">
                      Metadata
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {logs.map((log, index) => {
                    const EntityIcon = getEntityIcon(log.entity_type);
                    return (
                      <motion.tr
                        key={log.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.02 }}
                        className="border-b border-slate-700/50 hover:bg-slate-700/20 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2 text-sm text-gray-300">
                            <Calendar className="w-4 h-4 text-gray-500" />
                            <div>
                              <p className="font-medium">
                                {new Date(log.created_at).toLocaleDateString()}
                              </p>
                              <p className="text-xs text-gray-500">
                                {new Date(log.created_at).toLocaleTimeString()}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4 text-gray-500" />
                            <span className="text-white font-medium">{log.actor_email}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${getActionColor(
                              log.action
                            )}`}
                          >
                            {log.action}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <EntityIcon className="w-4 h-4 text-gray-500" />
                            <div>
                              <p className="text-white font-medium">{log.entity_type}</p>
                              <p className="text-xs text-gray-500 font-mono">
                                {log.entity_id?.substring(0, 8)}...
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          {log.metadata && (
                            <div className="max-w-md">
                              <pre className="text-xs text-gray-400 overflow-hidden text-ellipsis">
                                {typeof log.metadata === "string"
                                  ? log.metadata.substring(0, 100)
                                  : JSON.stringify(log.metadata).substring(0, 100)}
                                {(typeof log.metadata === "string"
                                  ? log.metadata.length
                                  : JSON.stringify(log.metadata).length) > 100 && "..."}
                              </pre>
                            </div>
                          )}
                        </td>
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
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

        {/* Stats Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-xl p-6">
            <p className="text-gray-400 text-sm mb-1">Total Logs</p>
            <p className="text-3xl font-bold text-white">{logs.length}</p>
          </div>
          <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-xl p-6">
            <p className="text-gray-400 text-sm mb-1">Unique Actors</p>
            <p className="text-3xl font-bold text-white">
              {new Set(logs.map((l) => l.actor_email)).size}
            </p>
          </div>
          <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-xl p-6">
            <p className="text-gray-400 text-sm mb-1">Today's Activity</p>
            <p className="text-3xl font-bold text-white">
              {
                logs.filter(
                  (l) =>
                    new Date(l.created_at).toDateString() === new Date().toDateString()
                ).length
              }
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AuditLogs;