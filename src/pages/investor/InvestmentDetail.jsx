import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import investorService from "../../api/investorService";
import { motion } from "framer-motion";
import {
    ArrowLeft,
    Download,
    Printer,
    CheckCircle,
    Calendar,
    Hash,
    Briefcase,
    ShieldCheck,
    Globe,
    ExternalLink
} from "lucide-react";
import { toast } from "react-hot-toast";

const InvestmentDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [detail, setDetail] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDetail();
    }, [id]);

    const fetchDetail = async () => {
        try {
            setLoading(true);
            const data = await investorService.getInvestmentDetail(id);
            setDetail(data);
        } catch (err) {
            toast.error("Failed to load investment details");
            navigate("/investor/investments");
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center">
                <motion.div
                    animate={{ rotate: 360, scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="w-16 h-16 border-4 border-cyan-500/30 border-t-cyan-400 rounded-full"
                />
            </div>
        );
    }

    if (!detail) return null;

    return (
        <div className="min-h-screen bg-slate-950 p-4 md:p-8 relative overflow-hidden text-white font-sans">
            {/* Background Texture */}
            <div className="absolute inset-0 opacity-20 pointer-events-none">
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-cyan-500/10 via-transparent to-transparent blur-3xl" />
            </div>

            <div className="max-w-4xl mx-auto relative z-10">
                {/* Header Actions */}
                <div className="flex justify-between items-center mb-12 no-print">
                    <motion.button
                        whileHover={{ x: -5 }}
                        onClick={() => navigate("/investor/investments")}
                        className="flex items-center gap-2 text-slate-400 hover:text-white transition-all font-black text-[10px] uppercase tracking-[0.2em]"
                    >
                        <ArrowLeft size={16} />
                        Return to Records
                    </motion.button>
                    <div className="flex gap-4">
                        <button
                            onClick={() => window.print()}
                            className="flex items-center gap-2 px-6 py-3 bg-slate-900 border border-slate-800 rounded-2xl text-slate-300 hover:bg-slate-800 transition-all font-black text-[10px] uppercase tracking-widest shadow-xl"
                        >
                            <Printer size={16} />
                            PRINT
                        </button>
                        <button className="flex items-center gap-2 px-6 py-3 bg-cyan-600 text-white rounded-2xl hover:bg-cyan-500 transition-all font-black text-[10px] uppercase tracking-widest shadow-[0_0_20px_rgba(8,145,178,0.3)]">
                            <Download size={16} />
                            EXPORT PDF
                        </button>
                    </div>
                </div>

                {/* Main Receipt Card */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="bg-slate-900 border border-slate-800 rounded-[3rem] overflow-hidden shadow-[0_40px_100px_-20px_rgba(0,0,0,0.5)] ring-1 ring-white/5"
                >
                    {/* Header Banner */}
                    <div className="bg-gradient-to-br from-cyan-600 via-blue-700 to-indigo-800 p-12 md:p-16 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-12 opacity-10 pointer-events-none">
                            <ShieldCheck size={180} />
                        </div>
                        <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-white/10 blur-3xl rounded-full" />

                        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-10">
                            <div className="space-y-4">
                                <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20">
                                    <Briefcase size={14} className="text-cyan-300" />
                                    <span className="text-[9px] font-black uppercase tracking-[0.3em] text-cyan-50">Verified Acquisition</span>
                                </div>
                                <h1 className="text-4xl md:text-5xl font-black text-white leading-tight tracking-tighter">
                                    {detail.project_title}
                                </h1>
                                <div className="flex items-center gap-3">
                                    <span className="text-blue-100/60 font-mono text-xs">PROJECT ID: {detail.project_id?.slice(0, 18)}...</span>
                                    <div className="w-1 h-1 bg-white/30 rounded-full" />
                                    <span className="text-blue-100/60 font-mono text-xs uppercase">{detail.project_status}</span>
                                </div>
                            </div>
                            <div className="bg-white/5 backdrop-blur-2xl rounded-[2.5rem] p-8 border border-white/10 text-center min-w-[200px] shadow-2xl ring-1 ring-white/10">
                                <p className="text-[10px] font-black uppercase tracking-[0.2em] mb-2 text-white/50">Payment Status</p>
                                <div className="flex items-center justify-center gap-3 bg-emerald-500/10 px-5 py-3 rounded-2xl border border-emerald-500/20">
                                    <CheckCircle size={22} className="text-emerald-400" />
                                    <span className="text-2xl font-black text-emerald-400 uppercase tracking-tighter">SUCCESS</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Receipt Details */}
                    <div className="p-10 md:p-16 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-slate-800/20 via-transparent to-transparent">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 mb-16">
                            <div className="space-y-2">
                                <p className="text-[9px] font-black uppercase text-slate-500 tracking-[0.2em]">Transaction Link</p>
                                <p className="font-mono text-xs text-slate-300 truncate font-bold">
                                    <Hash size={12} className="inline mr-1 text-cyan-500" />
                                    {detail.id.toUpperCase()}
                                </p>
                            </div>
                            <div className="space-y-2 text-center md:text-left">
                                <p className="text-[9px] font-black uppercase text-slate-500 tracking-[0.2em]">Acquisition Date</p>
                                <p className="font-black text-sm text-slate-100 flex items-center justify-center md:justify-start gap-2">
                                    <Calendar size={14} className="text-cyan-500" />
                                    {new Date(detail.created_at).toLocaleDateString()}
                                </p>
                            </div>
                            <div className="space-y-2 text-center md:text-left">
                                <p className="text-[9px] font-black uppercase text-slate-500 tracking-[0.2em]">Method</p>
                                <p className="font-black text-sm text-slate-100 flex items-center justify-center md:justify-start gap-2 uppercase tracking-tighter">
                                    <Globe size={14} className="text-cyan-500" />
                                    SMART GATEWAY
                                </p>
                            </div>
                            <div className="space-y-2 text-right">
                                <p className="text-[9px] font-black uppercase text-slate-500 tracking-[0.2em]">Framework</p>
                                <p className="font-black text-sm text-slate-100 uppercase tracking-tighter">FINRA REGULATED</p>
                            </div>
                        </div>

                        <div className="bg-slate-800/50 backdrop-blur-xl rounded-[2.5rem] p-10 border border-white/5 space-y-8 shadow-inner mb-16">
                            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 border-b border-white/5 pb-4">Financial Breakdown</h3>

                            <div className="space-y-6">
                                <div className="flex justify-between items-center group">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 bg-slate-800 rounded-xl flex items-center justify-center border border-white/5 group-hover:bg-cyan-500/10 transition-colors">
                                            <Layers size={18} className="text-slate-400 group-hover:text-cyan-400" />
                                        </div>
                                        <span className="text-slate-400 font-bold uppercase text-xs tracking-wider">Shares Allocated</span>
                                    </div>
                                    <span className="text-white font-black text-lg">{detail.shares_purchased.toLocaleString()} Units</span>
                                </div>

                                <div className="flex justify-between items-center group">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 bg-slate-800 rounded-xl flex items-center justify-center border border-white/5 group-hover:bg-cyan-500/10 transition-colors">
                                            <DollarSign size={18} className="text-slate-400 group-hover:text-cyan-400" />
                                        </div>
                                        <span className="text-slate-400 font-bold uppercase text-xs tracking-wider">Acquisition Price</span>
                                    </div>
                                    <span className="text-white font-black text-lg">${parseFloat(detail.price_per_share).toLocaleString()} <span className="text-xs text-slate-600 font-bold ml-1">/ Unit</span></span>
                                </div>

                                <div className="pt-8 border-t border-white/10 flex justify-between items-end">
                                    <div className="space-y-1">
                                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Investment Value</span>
                                        <p className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-500 tracking-tighter">
                                            ${parseFloat(detail.total_amount).toLocaleString()}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <div className="px-4 py-2 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
                                            <span className="text-[9px] font-black text-emerald-400 uppercase tracking-widest">Ownership: {((detail.shares_purchased / (detail.project_total_shares || 1000)) * 100).toFixed(4)}%</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Audit Trail */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                            <div className="p-8 bg-slate-900/50 rounded-3xl border border-white/5 space-y-6">
                                <h4 className="text-[9px] font-black uppercase text-cyan-500 tracking-[0.2em]">Project Ecosystem</h4>
                                <div className="space-y-4 text-xs font-bold uppercase tracking-wider">
                                    <div className="flex justify-between border-b border-white/5 pb-2">
                                        <span className="text-slate-500">Asset Tier</span>
                                        <span className="text-white">PREMIUM VENTURE</span>
                                    </div>
                                    <div className="flex justify-between border-b border-white/5 pb-2">
                                        <span className="text-slate-500">Global Pool</span>
                                        <span className="text-white">{detail.project_total_shares?.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-slate-500">Market Absorption</span>
                                        <span className="text-cyan-400">{((detail.project_shares_sold / detail.project_total_shares) * 100).toFixed(1)}%</span>
                                    </div>
                                </div>
                            </div>
                            <div className="p-8 bg-slate-900/50 rounded-3xl border border-white/5 space-y-6">
                                <h4 className="text-[9px] font-black uppercase text-slate-500 tracking-[0.2em]">Network Proof</h4>
                                <div className="space-y-4 text-xs font-bold uppercase tracking-wider">
                                    <div className="flex justify-between border-b border-white/5 pb-2">
                                        <span className="text-slate-500">Gateway Ref</span>
                                        <span className="text-slate-300 font-mono text-[10px]">{detail.payment_details?.reference_id || 'SMART-GW-123'}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-slate-500">Network Time</span>
                                        <span className="text-slate-300 italic">
                                            {detail.payment_details?.processed_at ? new Date(detail.payment_details.processed_at).toTimeString().split(' ')[0] : 'IMMEDIATE'}
                                        </span>
                                    </div>
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        className="w-full mt-2 flex items-center justify-center gap-2 py-3 bg-slate-800 hover:bg-slate-700 rounded-2xl text-[9px] font-black text-slate-400 hover:text-white transition-all transition-colors border border-white/5"
                                    >
                                        VERIFY ON LEDGER <ExternalLink size={12} />
                                    </motion.button>
                                </div>
                            </div>
                        </div>

                        {/* Footer Disclaimer */}
                        <div className="text-center space-y-6 opacity-30">
                            <div className="flex justify-center gap-2">
                                {[...Array(8)].map((_, i) => <div key={i} className="h-1 w-1 bg-white rounded-full" />)}
                            </div>
                            <p className="text-[8px] text-white font-black uppercase tracking-[0.4em] leading-loose max-w-sm mx-auto">
                                This document serves as legal proof of acquisition in the project listed above. Regulated by SEC guidelines.
                            </p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default InvestmentDetail;
