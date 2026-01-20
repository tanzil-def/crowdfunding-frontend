import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users as UsersIcon,
  Search,
  Mail,
  Calendar,
  Shield,
  CheckCircle,
  XCircle,
  Eye,
  X,
} from "lucide-react";
import { toast } from "react-hot-toast";
import adminService from "../../api/adminService";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [verificationFilter, setVerificationFilter] = useState("ALL");
  const [selectedUser, setSelectedUser] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchUsers();
  }, [page, search, roleFilter, verificationFilter]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const params = {
        page,
        page_size: 15,
      };
      if (search) params.search = search;
      if (roleFilter !== "ALL") params.role = roleFilter;
      if (verificationFilter === "VERIFIED") params.is_verified = "true";
      else if (verificationFilter === "UNVERIFIED") params.is_verified = "false";

      const data = await adminService.getUsers(params);
      setUsers(data.results || []);
      setTotalPages(Math.ceil((data.count || 0) / 15));
    } catch (err) {
      console.error("Error fetching users:", err);
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  const viewUserDetail = (user) => {
    setSelectedUser(user);
    setShowDetailModal(true);
  };

  const getRoleBadge = (role) => {
    const config = {
      ADMIN: { bg: "bg-purple-500/20", text: "text-purple-400", border: "border-purple-500/30" },
      DEVELOPER: { bg: "bg-blue-500/20", text: "text-blue-400", border: "border-blue-500/30" },
      INVESTOR: { bg: "bg-green-500/20", text: "text-green-400", border: "border-green-500/30" },
    };
    const c = config[role] || config.INVESTOR;
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${c.bg} ${c.text} ${c.border}`}>
        {role}
      </span>
    );
  };

  if (loading && users.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-5xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent mb-2">
            User Management
          </h1>
          <p className="text-gray-400 text-lg">
            Manage platform users and their roles
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
              placeholder="Search by email or name..."
              className="w-full pl-12 pr-4 py-4 bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl text-white placeholder-gray-400 focus:border-indigo-500 focus:outline-none"
            />
          </div>

          {/* Filters */}
          <div className="flex gap-3 overflow-x-auto pb-2">
            {/* Role Filter */}
            {["ALL", "ADMIN", "DEVELOPER", "INVESTOR"].map((role) => (
              <button
                key={role}
                onClick={() => setRoleFilter(role)}
                className={`px-6 py-3 rounded-xl font-semibold whitespace-nowrap transition-all ${roleFilter === role
                  ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg shadow-indigo-500/50"
                  : "bg-slate-700/50 text-gray-300 hover:bg-slate-700"
                  }`}
              >
                {role}
              </button>
            ))}

            <div className="border-l border-slate-700 mx-2"></div>

            {/* Verification Filter */}
            {["ALL", "VERIFIED", "UNVERIFIED"].map((status) => (
              <button
                key={status}
                onClick={() => setVerificationFilter(status)}
                className={`px-6 py-3 rounded-xl font-semibold whitespace-nowrap transition-all ${verificationFilter === status
                  ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg shadow-green-500/50"
                  : "bg-slate-700/50 text-gray-300 hover:bg-slate-700"
                  }`}
              >
                {status}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Users List */}
        {users.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-12 text-center"
          >
            <UsersIcon className="w-20 h-20 text-indigo-400 mx-auto mb-4 opacity-50" />
            <h2 className="text-2xl font-bold text-white mb-2">No Users Found</h2>
            <p className="text-gray-400">Try adjusting your search or filters</p>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {users.map((user, index) => (
              <motion.div
                key={user.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 hover:border-indigo-500/50 transition-all"
              >
                <div className="flex flex-col lg:flex-row gap-6">
                  {/* User Info */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-white mb-2">
                          {user.full_name}
                        </h3>
                        <div className="flex items-center gap-4 text-sm text-gray-400">
                          <span className="flex items-center gap-1">
                            <Mail className="w-4 h-4" />
                            {user.email}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {new Date(user.date_joined).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {getRoleBadge(user.role)}
                        {user.is_email_verified ? (
                          <span className="flex items-center gap-1 px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-xs font-semibold border border-green-500/30">
                            <CheckCircle className="w-3 h-3" />
                            Verified
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 px-3 py-1 bg-red-500/20 text-red-400 rounded-full text-xs font-semibold border border-red-500/30">
                            <XCircle className="w-3 h-3" />
                            Unverified
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="bg-slate-700/30 p-3 rounded-lg">
                        <p className="text-gray-400 text-xs mb-1">User ID</p>
                        <p className="text-white font-mono text-sm truncate">{user.id}</p>
                      </div>
                      <div className="bg-slate-700/30 p-3 rounded-lg">
                        <p className="text-gray-400 text-xs mb-1">Role</p>
                        <p className="text-white font-semibold">{user.role}</p>
                      </div>
                      <div className="bg-slate-700/30 p-3 rounded-lg">
                        <p className="text-gray-400 text-xs mb-1">Status</p>
                        <p className="text-white font-semibold">
                          {user.is_email_verified ? "Active" : "Pending"}
                        </p>
                      </div>
                      <div className="bg-slate-700/30 p-3 rounded-lg">
                        <p className="text-gray-400 text-xs mb-1">Joined</p>
                        <p className="text-white font-semibold">
                          {new Date(user.date_joined).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-3 lg:w-48">
                    <button
                      onClick={() => viewUserDetail(user)}
                      className="flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl font-semibold hover:from-indigo-600 hover:to-purple-600 transition-all shadow-lg hover:shadow-indigo-500/50"
                    >
                      <Eye className="w-5 h-5" />
                      View Details
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* User Detail Modal */}
        <AnimatePresence>
          {showDetailModal && selectedUser && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                onClick={() => setShowDetailModal(false)}
              />
              <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                className="relative bg-slate-800 border border-slate-700 rounded-3xl p-8 max-w-2xl w-full shadow-2xl overflow-hidden"
              >
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-3xl font-bold text-white">User Details</h2>
                  <button
                    onClick={() => setShowDetailModal(false)}
                    className="p-3 hover:bg-slate-700 rounded-xl transition-colors"
                  >
                    <X className="w-6 h-6 text-gray-400" />
                  </button>
                </div>

                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-slate-700/30 rounded-2xl p-5 border border-slate-700/50">
                      <p className="text-gray-400 text-sm mb-1 uppercase tracking-wider font-semibold">Full Name</p>
                      <p className="text-white text-xl font-bold">{selectedUser.full_name}</p>
                    </div>

                    <div className="bg-slate-700/30 rounded-2xl p-5 border border-slate-700/50">
                      <p className="text-gray-400 text-sm mb-1 uppercase tracking-wider font-semibold">Email</p>
                      <p className="text-white text-xl font-bold truncate">{selectedUser.email}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-slate-700/30 rounded-2xl p-5 border border-slate-700/50">
                      <p className="text-gray-400 text-sm mb-1 uppercase tracking-wider font-semibold">Role</p>
                      <div className="mt-1">{getRoleBadge(selectedUser.role)}</div>
                    </div>
                    <div className="bg-slate-700/30 rounded-2xl p-5 border border-slate-700/50">
                      <p className="text-gray-400 text-sm mb-1 uppercase tracking-wider font-semibold">Email Status</p>
                      <p className={`text-xl font-bold ${selectedUser.is_email_verified ? 'text-green-400' : 'text-red-400'}`}>
                        {selectedUser.is_email_verified ? 'Verified' : 'Unverified'}
                      </p>
                    </div>
                  </div>

                  <div className="bg-slate-700/30 rounded-2xl p-5 border border-slate-700/50">
                    <p className="text-gray-400 text-sm mb-1 uppercase tracking-wider font-semibold">Date Joined</p>
                    <p className="text-white text-xl font-bold">
                      {new Date(selectedUser.date_joined).toLocaleString()}
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Users;