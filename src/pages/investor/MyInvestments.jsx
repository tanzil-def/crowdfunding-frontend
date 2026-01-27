import React, { useEffect, useState } from "react";
import investorService from "../../api/investorService";
import { motion } from "framer-motion";
import {
  FileText,
  Calendar,
  ArrowLeft,
  ArrowUpRight,
} from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-hot-toast";

const MyInvestments = () => {
  const navigate = useNavigate();
  const [investments, setInvestments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchInvestments();
  }, [page]);

  const fetchInvestments = async () => {
    try {
      setLoading(true);
      const data = await investorService.getMyInvestments({ page, page_size: 6 });
      setInvestments(data.results || []);
      setTotalPages(Math.ceil(data.count / 6));
    } catch (err) {
      toast.error("Failed to load investments");
    } finally {
      setLoading(false);
    }
  };

  const viewReceipt = (investmentId) => {
    navigate(`/investor/investments/${investmentId}`);
  };

  const getStatusStyle = (status) => {
    switch (status?.toUpperCase()) {
      case "SUCCESS":
        return "bg-emerald-500/10 text-emerald-400 border-emerald-500/30";
      case "PENDING":
        return "bg-amber-500/10 text-amber-400 border-amber-500/30";
      case "FAILED":
        return "bg-rose-500/10 text-rose-400 border-rose-500/30";
      default:
        return "bg-slate-500/10 text-slate-400 border-slate-500/30";
    }
  };

  if (loading && investments.length === 0) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360, scale: [1, 1.1, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-16 h-16 border-4 border-cyan-500/30 border-t-cyan-400 rounded-full shadow-[0_0_15px_rgba(34,211,238,0.2)]"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white p-4 md:p-8 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-cyan-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6"
        >
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-cyan-500/20 rounded-lg">
                <FileText className="w-6 h-6 text-cyan-400" />
              </div>
              <h1 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent tracking-tight">
                Transaction History
              </h1>
            </div>
            <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] ml-1">Official Share Purchase Records</p>
          </div>
          <div className="flex items-center gap-4 bg-slate-900/50 backdrop-blur-xl border border-slate-800 p-2 rounded-2xl">
            <div className="px-4 py-2 bg-slate-800 rounded-xl">
              <span className="text-xs font-black text-slate-400 uppercase">Total Items: {investments.length}</span>
            </div>
          </div>
        </motion.div>

        {/* Investments Grid */}
        {investments.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-[2.5rem] p-24 text-center"
          >
            <div className="w-24 h-24 bg-slate-800/50 rounded-full flex items-center justify-center mx-auto mb-6">
              <FileText className="w-12 h-12 text-slate-600" />
            </div>
            <h2 className="text-2xl font-black text-white mb-2 uppercase tracking-tight">No Acquisitions Yet</h2>
            <p className="text-slate-500 font-medium">Your investment portfolio records will appear here.</p>
            <Link to="/investor/browse" className="inline-flex mt-8 px-8 py-3 bg-cyan-600 hover:bg-cyan-500 text-white font-black rounded-xl transition-all shadow-xl shadow-cyan-500/20 uppercase text-xs tracking-widest">
              Explore Projects
            </Link>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {investments.map((investment, index) => (
              <motion.div
                key={investment.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ y: -5 }}
                className="bg-slate-900/40 backdrop-blur-xl border border-slate-800/60 rounded-3xl p-6 group hover:border-cyan-500/30 transition-all duration-300"
              >
                <div className="flex justify-between items-start mb-6">
                  <div className="space-y-1">
                    <span className="px-2 py-1 bg-slate-800 text-slate-400 rounded-md text-[9px] font-black uppercase tracking-widest">
                      {investment.project_category || 'VENTURE'}
                    </span>
                    <h3 className="text-xl font-black text-white group-hover:text-cyan-400 transition-colors truncate max-w-[200px]">
                      {investment.project_title}
                    </h3>
                    <div className="flex items-center gap-2 text-slate-500 text-[10px] font-bold uppercase tracking-wider">
                      <Calendar className="w-3 h-3" />
                      {new Date(investment.created_at).toLocaleDateString()}
                    </div>
                  </div>
                  <div className={`px-3 py-1.5 rounded-xl border text-[10px] font-black uppercase tracking-widest backdrop-blur-sm ${getStatusStyle(investment.payment_status)}`}>
                    {investment.payment_status || 'SUCCESS'}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="p-3 bg-slate-800/40 rounded-2xl border border-slate-700/30">
                    <p className="text-slate-500 text-[9px] font-black uppercase mb-1">Shares</p>
                    <p className="text-white font-black">{investment.shares_purchased.toLocaleString()}</p>
                  </div>
                  <div className="p-3 bg-slate-800/40 rounded-2xl border border-slate-700/30 text-center">
                    <p className="text-slate-500 text-[9px] font-black uppercase mb-1">Price</p>
                    <p className="text-white font-black">${parseFloat(investment.price_per_share).toFixed(0)}</p>
                  </div>
                  <div className="p-3 bg-cyan-500/5 rounded-2xl border border-cyan-500/20 text-right">
                    <p className="text-cyan-500/70 text-[9px] font-black uppercase mb-1">Total</p>
                    <p className="text-cyan-400 font-black">${parseFloat(investment.total_amount).toLocaleString()}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-slate-800/50">
                  <div className="flex flex-col">
                    <span className="text-slate-600 text-[8px] font-black uppercase">Gateway Reference</span>
                    <span className="text-slate-400 font-mono text-[10px] mt-0.5">{investment.payment_reference?.slice(0, 12)}...</span>
                  </div>
                  <button
                    onClick={() => viewReceipt(investment.id)}
                    className="flex items-center gap-2 px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white text-[10px] font-black rounded-xl transition-all uppercase tracking-widest border border-slate-700"
                  >
                    Details <ArrowUpRight className="w-3 h-3" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Pagination - Sleek version */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-4 mt-12 bg-slate-900/50 backdrop-blur-xl border border-slate-800 w-fit mx-auto p-2 rounded-2xl">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="p-3 bg-slate-800 text-white rounded-xl disabled:opacity-30 hover:bg-slate-700 transition-all border border-slate-700"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-2 px-4">
              <span className="text-[10px] font-black text-white uppercase tracking-widest">Page</span>
              <div className="w-8 h-8 bg-cyan-500 rounded-lg flex items-center justify-center text-xs font-black text-white shadow-lg shadow-cyan-500/30">
                {page}
              </div>
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">of {totalPages}</span>
            </div>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="p-3 bg-slate-800 text-white rounded-xl disabled:opacity-30 hover:bg-slate-700 transition-all border border-slate-700"
            >
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyInvestments;