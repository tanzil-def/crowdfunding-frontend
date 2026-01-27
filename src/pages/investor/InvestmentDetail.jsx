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
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full"
                />
            </div>
        );
    }

    if (!detail) return null;

    return (
        <div className="min-h-screen bg-slate-50 p-4 md:p-8 font-sans">
            <div className="max-w-4xl mx-auto">
                {/* Actions */}
                <div className="flex justify-between items-center mb-8 no-print">
                    <button
                        onClick={() => navigate("/investor/investments")}
                        className="flex items-center gap-2 text-slate-600 hover:text-blue-600 transition-colors font-bold text-sm uppercase tracking-wider"
                    >
                        <ArrowLeft size={18} />
                        Back to History
                    </button>
                    <div className="flex gap-3">
                        <button
                            onClick={() => window.print()}
                            className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-slate-700 hover:bg-slate-50 transition-all shadow-sm font-bold text-xs"
                        >
                            <Printer size={16} />
                            PRINT
                        </button>
                        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 font-bold text-xs">
                            <Download size={16} />
                            DOWNLOAD PDF
                        </button>
                    </div>
                </div>

                {/* Receipt Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/60 overflow-hidden border border-slate-100"
                >
                    {/* Header Banner */}
                    <div className="bg-gradient-to-br from-blue-600 to-blue-800 p-8 md:p-12 text-white relative">
                        <div className="absolute top-0 right-0 p-8 opacity-10">
                            <ShieldCheck size={120} />
                        </div>
                        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                            <div>
                                <div className="flex items-center gap-2 mb-4">
                                    <div className="p-2 bg-white/20 rounded-lg">
                                        <Briefcase size={20} />
                                    </div>
                                    <span className="text-xs font-black uppercase tracking-widest opacity-80">Official Investment Receipt</span>
                                </div>
                                <h1 className="text-3xl md:text-4xl font-black mb-2 leading-tight">
                                    {detail.project_title}
                                </h1>
                                <p className="text-blue-100 font-medium">Project ID: {detail.project_id}</p>
                            </div>
                            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 text-center min-w-[160px]">
                                <p className="text-[10px] font-black uppercase tracking-widest mb-1 opacity-70">Status</p>
                                <div className="flex items-center justify-center gap-2">
                                    <CheckCircle size={18} className="text-emerald-400" />
                                    <span className="text-xl font-black">{detail.payment_details?.status || 'SUCCESS'}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-8 md:p-12 space-y-12">
                        {/* Summary Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                            <div>
                                <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-2">Transaction ID</p>
                                <p className="font-bold text-slate-800 text-sm flex items-center gap-2">
                                    <Hash size={14} className="text-blue-600" />
                                    {detail.id.split('-')[0].toUpperCase()}...
                                </p>
                            </div>
                            <div>
                                <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-2">Date</p>
                                <p className="font-bold text-slate-800 text-sm flex items-center gap-2">
                                    <Calendar size={14} className="text-blue-600" />
                                    {new Date(detail.created_at).toLocaleDateString()}
                                </p>
                            </div>
                            <div>
                                <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-2">Type</p>
                                <p className="font-bold text-slate-800 text-sm flex items-center gap-2">
                                    <Globe size={14} className="text-blue-600" />
                                    Crowdfunding
                                </p>
                            </div>
                            <div>
                                <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-2">Platform</p>
                                <p className="font-bold text-slate-800 text-sm">SEC Regulated</p>
                            </div>
                        </div>

                        <hr className="border-slate-100" />

                        {/* Calculations */}
                        <div className="space-y-6">
                            <h3 className="text-sm font-black uppercase tracking-widest text-slate-800">Investment Breakdown</h3>
                            <div className="bg-slate-50 rounded-3xl p-8 space-y-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-slate-500 font-bold">Shares Purchased</span>
                                    <span className="text-slate-800 font-black">{detail.shares_purchased.toLocaleString()} Units</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-slate-500 font-bold">Price per Share</span>
                                    <span className="text-slate-800 font-black">${parseFloat(detail.price_per_share).toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between items-center pt-4 border-t border-slate-200">
                                    <span className="text-slate-800 font-black">Subtotal</span>
                                    <span className="text-slate-800 font-black">${(detail.shares_purchased * detail.price_per_share).toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-slate-500 font-bold italic">Platform Service Fee (Included)</span>
                                    <span className="text-slate-800 font-black">$0.00</span>
                                </div>
                                <div className="flex justify-between items-center pt-6 mt-2 border-t-2 border-slate-900">
                                    <span className="text-xl font-black text-slate-900 uppercase">Total Invested</span>
                                    <span className="text-3xl font-black text-blue-600">${parseFloat(detail.total_amount).toLocaleString()}</span>
                                </div>
                            </div>
                        </div>

                        {/* Project Context */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="bg-blue-50/50 rounded-3xl p-6 border border-blue-100">
                                <h4 className="text-[10px] font-black uppercase text-blue-600 tracking-widest mb-4">Project Impact</h4>
                                <div className="space-y-3">
                                    <div className="flex justify-between text-xs font-bold">
                                        <span className="text-slate-500">Project Status</span>
                                        <span className="text-blue-700">{detail.project_status}</span>
                                    </div>
                                    <div className="flex justify-between text-xs font-bold">
                                        <span className="text-slate-500">Total Project Shares</span>
                                        <span className="text-slate-800">{detail.project_total_shares?.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between text-xs font-bold">
                                        <span className="text-slate-500">Current Funding Progress</span>
                                        <span className="text-emerald-600">
                                            {((detail.project_shares_sold / detail.project_total_shares) * 100).toFixed(1)}%
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-slate-50 rounded-3xl p-6 border border-slate-100">
                                <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-4">Payment Reference</h4>
                                <div className="space-y-3">
                                    <div className="flex justify-between text-xs font-bold">
                                        <span className="text-slate-500">Gateway Ref</span>
                                        <span className="text-slate-800 font-mono">{detail.payment_details?.reference_id || 'N/A'}</span>
                                    </div>
                                    <div className="flex justify-between text-xs font-bold">
                                        <span className="text-slate-500">Processed Time</span>
                                        <span className="text-slate-800 italic">
                                            {detail.payment_details?.processed_at ? new Date(detail.payment_details.processed_at).toLocaleTimeString() : 'N/A'}
                                        </span>
                                    </div>
                                    <button className="w-full mt-2 flex items-center justify-center gap-2 py-2 bg-white border border-slate-200 rounded-xl text-[10px] font-black text-slate-600 hover:text-blue-600 transition-colors">
                                        VIEW BLOCKCHAIN PROOF <ExternalLink size={12} />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Footer Disclaimer */}
                        <div className="text-center space-y-4 pt-12">
                            <div className="flex justify-center gap-1">
                                {[...Array(50)].map((_, i) => <div key={i} className="h-1 w-1 bg-slate-200 rounded-full" />)}
                            </div>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] leading-loose max-w-lg mx-auto">
                                This is a legally binding receipt. All investments are subject to the terms and conditions agreed upon at the time of purchase. SEC Regulated.
                            </p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default InvestmentDetail;
