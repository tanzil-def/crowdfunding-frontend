import React, { useEffect, useState } from "react";
import { getMyAccessRequests } from "../../services/api";
import { motion } from "framer-motion";
import {
  Lock,
  Unlock,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  MessageSquare,
  Calendar,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { Link } from "react-router-dom";

const AccessRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("ALL");

  useEffect(() => {
    fetchRequests();
  }, [filter]);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const params = {};
      if (filter !== "ALL") {
        params.status = filter;
      }
      const data = await getMyAccessRequests(params);
      setRequests(data.results || []);
    } catch (err) {
      toast.error("Failed to load access requests");
    } finally {
      setLoading(false);
    }
  };

  const getStatusConfig = (status) => {
    switch (status) {
      case "PENDING":
        return {
          icon: Clock,
          color: "yellow",
          bgClass: "bg-yellow-500/20",
          textClass: "text-yellow-400",
          borderClass: "border-yellow-500/30",
        };
      case "APPROVED":
        return {
          icon: Unlock,
          color: "green",
          bgClass: "bg-green-500/20",
          textClass: "text-green-400",
          borderClass: "border-green-500/30",
        };
      case "REJECTED":
        return {
          icon: XCircle,
          color: "red",
          bgClass: "bg-red-500/20",
          textClass: "text-red-400",
          borderClass: "border-red-500/30",
        };
      case "REVOKED":
        return {
          icon: Lock,
          color: "orange",
          bgClass: "bg-orange-500/20",
          textClass: "text-orange-400",
          borderClass: "border-orange-500/30",
        };
      default:
        return {
          icon: AlertCircle,
          color: "gray",
          bgClass: "bg-gray-500/20",
          textClass: "text-gray-400",
          borderClass: "border-gray-500/30",
        };
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-orange-900 to-slate-900 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-orange-900 to-slate-900 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-5xl font-bold bg-gradient-to-r from-orange-400 to-amber-400 bg-clip-text text-transparent mb-2">
            My Access Requests
          </h1>
          <p className="text-gray-400 text-lg">
            Track your requests for restricted project information
          </p>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 flex gap-3 overflow-x-auto pb-2"
        >
          {["ALL", "PENDING", "APPROVED", "REJECTED", "REVOKED"].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-6 py-3 rounded-xl font-semibold transition-all whitespace-nowrap ${
                filter === status
                  ? "bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg shadow-orange-500/50"
                  : "bg-slate-700/50 text-gray-300 hover:bg-slate-700"
              }`}
            >
              {status}
            </button>
          ))}
        </motion.div>

        {/* Requests List */}
        {requests.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-12 text-center"
          >
            <Lock className="w-20 h-20 text-orange-400 mx-auto mb-4 opacity-50" />
            <h2 className="text-2xl font-bold text-white mb-2">No Access Requests</h2>
            <p className="text-gray-400 mb-6">
              You haven't requested access to any restricted project information yet
            </p>
            <Link
              to="/investor/browse"
              className="inline-block px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl font-semibold hover:from-orange-600 hover:to-amber-600 transition-all"
            >
              Browse Projects
            </Link>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {requests.map((request, index) => {
              const statusConfig = getStatusConfig(request.status);
              const StatusIcon = statusConfig.icon;

              return (
                <motion.div
                  key={request.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 hover:border-orange-500/50 transition-all"
                >
                  <div className="flex flex-col lg:flex-row gap-6">
                    {/* Request Info */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <Link
                            to={`/investor/projects/${request.project}`}
                            className="text-2xl font-bold text-white hover:text-orange-400 transition-colors"
                          >
                            {request.project_title}
                          </Link>
                          <div className="flex items-center gap-4 text-sm text-gray-400 mt-2">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              {new Date(request.created_at).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        <div
                          className={`flex items-center gap-2 px-4 py-2 rounded-full border ${statusConfig.bgClass} ${statusConfig.textClass} ${statusConfig.borderClass}`}
                        >
                          <StatusIcon className="w-5 h-5" />
                          <span className="font-semibold">{request.status}</span>
                        </div>
                      </div>

                      {/* Request Reason */}
                      {request.reason && (
                        <div className="bg-slate-700/30 rounded-xl p-4 mb-4">
                          <p className="text-gray-400 text-sm mb-2 flex items-center gap-2">
                            <MessageSquare className="w-4 h-4" />
                            Your Request:
                          </p>
                          <p className="text-white">{request.reason}</p>
                        </div>
                      )}

                      {/* Admin Response */}
                      {(request.status === "REJECTED" || request.status === "REVOKED") &&
                        request.admin_reason && (
                          <div
                            className={`rounded-xl p-4 border ${
                              request.status === "REJECTED"
                                ? "bg-red-500/10 border-red-500/30"
                                : "bg-orange-500/10 border-orange-500/30"
                            }`}
                          >
                            <p
                              className={`text-sm mb-2 flex items-center gap-2 ${
                                request.status === "REJECTED"
                                  ? "text-red-400"
                                  : "text-orange-400"
                              }`}
                            >
                              <AlertCircle className="w-4 h-4" />
                              Admin Response:
                            </p>
                            <p className="text-white">{request.admin_reason}</p>
                          </div>
                        )}

                      {/* Success Message */}
                      {request.status === "APPROVED" && (
                        <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4 flex items-start gap-3">
                          <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="text-green-400 font-semibold mb-1">
                              Access Granted!
                            </p>
                            <p className="text-gray-300 text-sm">
                              You can now view this project's restricted information
                            </p>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Action Button */}
                    <div className="flex flex-col gap-3 lg:w-48">
                      {request.status === "APPROVED" && (
                        <Link
                          to={`/investor/projects/${request.project}`}
                          className="flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl font-semibold hover:from-green-600 hover:to-emerald-600 transition-all shadow-lg hover:shadow-green-500/50"
                        >
                          <Unlock className="w-5 h-5" />
                          View Project
                        </Link>
                      )}
                      {request.status === "PENDING" && (
                        <div className="flex items-center justify-center gap-2 px-4 py-3 bg-yellow-500/20 text-yellow-400 rounded-xl font-semibold border border-yellow-500/30">
                          <Clock className="w-5 h-5" />
                          Under Review
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default AccessRequests;