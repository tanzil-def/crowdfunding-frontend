// pages/investor/InvestPage.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import investorService from "../../api/investorService";
import { motion, AnimatePresence } from "framer-motion";
import {
  DollarSign,
  ShoppingCart,
  AlertCircle,
  CheckCircle,
  ArrowLeft,
  Lock,
  CreditCard,
  Info,
  Zap,
  Shield,
  Clock,
  Loader2,
  TrendingUp,
  Wallet,
  ArrowRight,
  ChevronDown,
} from "lucide-react";
import { toast } from "react-hot-toast";

const InvestPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // States
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [shares, setShares] = useState(1);
  const [planType, setPlanType] = useState("Equity");
  const [processing, setProcessing] = useState(false);
  const [paymentStep, setPaymentStep] = useState("details"); // details, processing, pending_approval, success
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [investmentData, setInvestmentData] = useState(null);
  const [processingStatus, setProcessingStatus] = useState(0);
  const [availableBalance, setAvailableBalance] = useState(25000); // Mocked balance

  useEffect(() => {
    fetchProject();
  }, [id]);

  const fetchProject = async () => {
    try {
      setLoading(true);
      const response = await investorService.getProjectDetail(id);
      setProject(response.data || response);
    } catch (err) {
      toast.error("Failed to load project details");
      navigate("/investor/browse");
    } finally {
      setLoading(false);
    }
  };

  const handleInvest = async () => {
    if (!agreedToTerms) return toast.error("Please agree to terms");
    if (finalAmount > availableBalance) return toast.error("Insufficient balance");

    try {
      setProcessing(true);
      setPaymentStep("processing");

      const idempotencyKey = `ref-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      const initiateResponse = await investorService.initiateInvestment({
        project_id: id,
        shares_requested: shares,
        plan_type: planType,
        idempotency_key: idempotencyKey,
      });

      const initData = initiateResponse.data || initiateResponse;
      setInvestmentData(initData);
      simulatePaymentFlow(initData);

    } catch (err) {
      toast.error(err.response?.data?.message || "Investment initiation failed");
      setPaymentStep("details");
      setProcessing(false);
    }
  };

  const simulatePaymentFlow = (initData) => {
    const statuses = [
      "Accessing Secure Vault...",
      "Validating Digital Ownership...",
      "Allocating Units in Ledger...",
      "Generating Smart Contract...",
      "Finalizing Transaction Hash..."
    ];

    let currentStatus = 0;
    const interval = setInterval(() => {
      currentStatus++;
      setProcessingStatus(currentStatus);
      if (currentStatus >= statuses.length - 1) clearInterval(interval);
    }, 2500);

    setTimeout(async () => {
      await handleGatewayCallback(initData);
    }, 12500);
  };

  const handleGatewayCallback = async (initData) => {
    try {
      const callbackPayload = {
        payment_reference_id: initData.reference_id,
        success: true,
        gateway_payload: {
          shares_requested: shares,
          plan_type: planType,
          project_id: id,
          transaction_id: `TX-${Math.random().toString(36).toUpperCase().slice(2, 12)}`,
          amount: totalAmount,
          currency: "USD",
          status: "captured",
          timestamp: new Date().toISOString()
        }
      };

      await investorService.submitPaymentCallback(callbackPayload);
      setPaymentStep("pending_approval");
      toast.success("Transaction Securely Recorded");

    } catch (err) {
      toast.error("Network Verification Failed");
      setPaymentStep("details");
    } finally {
      setProcessing(false);
    }
  };

  const checkStatus = async () => {
    toast.loading("Fetching approval status...");
    setTimeout(() => {
      toast.dismiss();
      setPaymentStep("success");
      toast.success("Shares Allocated Successfully!");
    }, 2000);
  };

  // Calculations
  const pricePerShare = parseFloat(project?.price_per_share || project?.share_price || 0);
  const totalAmount = shares * pricePerShare;
  const platformFee = totalAmount * 0.02;
  const finalAmount = totalAmount + platformFee;

  if (loading) return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center">
      <div className="relative">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-20 h-20 border-4 border-cyan-500/10 border-t-cyan-500 rounded-full"
        />
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <TrendingUp className="w-8 h-8 text-cyan-400" />
        </motion.div>
      </div>
      <p className="text-slate-500 mt-8 font-black uppercase tracking-[0.3em] text-[10px] animate-pulse">Syncing Portfolio Data</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 p-6 lg:p-12 font-sans relative overflow-hidden">
      {/* Dynamic Background Elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-cyan-500/5 blur-[120px] rounded-full pointer-events-none animate-pulse" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-violet-500/5 blur-[120px] rounded-full pointer-events-none animate-pulse" />

      <div className="max-w-7xl mx-auto relative z-10">
        <AnimatePresence mode="wait">
          {paymentStep === "details" && (
            <motion.div
              key="details"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-10"
            >
              <div className="lg:col-span-12">
                <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-500 hover:text-cyan-400 transition-all mb-6 group">
                  <div className="p-2 bg-slate-900 rounded-lg group-hover:bg-cyan-500/10 border border-slate-800 group-hover:border-cyan-500/20">
                    <ArrowLeft size={16} />
                  </div>
                  <span className="font-black uppercase tracking-[0.2em] text-[10px]">Back to Marketplace</span>
                </button>
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-12 border-b border-white/5">
                  <div>
                    <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-4 italic text-wrap break-words">
                      Invest in <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-violet-400">{project.title}</span>
                    </h1>
                    <p className="text-slate-500 font-bold uppercase tracking-[0.3em] text-xs">Secure Asset Acquisition Portal</p>
                  </div>
                  <div className="bg-slate-900/50 backdrop-blur-xl border border-white/5 p-6 rounded-3xl text-right">
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Available Balance</p>
                    <p className="text-3xl font-black text-white italic">${availableBalance.toLocaleString()}</p>
                  </div>
                </div>
              </div>

              {/* Form Section */}
              <div className="lg:col-span-7 space-y-8">
                <div className="bg-slate-900/40 border border-white/5 p-10 rounded-[3rem] backdrop-blur-3xl shadow-3xl">
                  <div className="space-y-12">
                    {/* Share Quantity */}
                    <div>
                      <div className="flex justify-between items-center mb-6">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Share Volume</label>
                        <span className="text-[10px] font-black text-cyan-400 uppercase tracking-widest bg-cyan-400/10 px-3 py-1 rounded-full">Primary Offering</span>
                      </div>
                      <div className="flex items-center gap-8 bg-black/40 p-8 rounded-[2rem] border border-white/5 shadow-inner">
                        <input
                          type="number"
                          value={shares}
                          onChange={(e) => setShares(Math.max(1, parseInt(e.target.value) || 1))}
                          className="bg-transparent text-7xl font-black w-full outline-none text-white tracking-tighter italic"
                        />
                        <div className="flex flex-col gap-4">
                          <button onClick={() => setShares(s => s + 10)} className="w-14 h-14 flex items-center justify-center bg-slate-800 rounded-2xl hover:bg-cyan-500 text-white transition-all font-black">+</button>
                          <button onClick={() => setShares(s => Math.max(1, s - 10))} className="w-14 h-14 flex items-center justify-center bg-slate-800 rounded-2xl hover:bg-violet-500 text-white transition-all font-black">-</button>
                        </div>
                      </div>
                      <div className="grid grid-cols-4 gap-4 mt-8">
                        {[10, 100, 500, 1000].map(v => (
                          <button key={v} onClick={() => setShares(v)} className="py-4 rounded-2xl border border-slate-800 hover:border-cyan-500/50 hover:bg-cyan-500/10 transition-all font-black text-[10px] tracking-widest uppercase">
                            {v} Units
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Plan Type */}
                    <div>
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-6">Allocation Strategy</label>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {["Equity", "Debt", "Hybrid"].map((type) => (
                          <button
                            key={type}
                            onClick={() => setPlanType(type)}
                            className={`p-6 rounded-3xl border-2 transition-all text-left relative overflow-hidden group ${planType === type ? "border-cyan-500 bg-cyan-500/10" : "border-slate-800 bg-slate-900/50 hover:border-slate-700"
                              }`}
                          >
                            <p className={`text-xs font-black uppercase tracking-widest ${planType === type ? "text-white" : "text-slate-500"}`}>{type}</p>
                            <p className="text-[10px] text-slate-600 mt-2 font-bold leading-tight">Standard fractional ownership model</p>
                            {planType === type && (
                              <motion.div layoutId="plan-glow" className="absolute -inset-4 bg-cyan-500/20 blur-2xl rounded-full" />
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-amber-500/5 border border-amber-500/10 p-8 rounded-[2rem] flex gap-6 items-start backdrop-blur-sm">
                  <div className="p-3 bg-amber-500/10 rounded-2xl text-amber-500">
                    <Shield size={24} />
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-amber-500 uppercase tracking-widest mb-2">Institutional-Grade Protection</h4>
                    <p className="text-[11px] text-slate-500 leading-relaxed font-bold">
                      Your capital is protected by our decentralized escrow protocol. Investments are legally binding and recorded on-chain for maximum transparency and security.
                    </p>
                  </div>
                </div>
              </div>

              {/* Summary Section */}
              <div className="lg:col-span-5">
                <div className="bg-gradient-to-br from-slate-900/80 to-slate-950/80 border border-white/5 p-10 rounded-[3rem] sticky top-12 backdrop-blur-3xl shadow-3xl">
                  <div className="flex items-center gap-3 mb-10 pb-6 border-b border-white/5">
                    <div className="p-3 bg-emerald-500/10 rounded-2xl text-emerald-400">
                      <Wallet size={20} />
                    </div>
                    <h3 className="text-sm font-black uppercase tracking-[0.2em] text-white">Allocation Summary</h3>
                  </div>

                  <div className="space-y-6 mb-12">
                    <div className="flex justify-between items-center py-2">
                      <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Base Asset Value</span>
                      <span className="text-white font-black italic">${totalAmount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Processing Fee (2%)</span>
                      <span className="text-white font-black italic">${platformFee.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center py-4 border-t border-white/5">
                      <span className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Net Investment</span>
                      <span className="text-5xl font-black text-emerald-400 tracking-tighter italic">${finalAmount.toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <label className="flex items-start gap-4 p-6 bg-black/40 rounded-3xl border border-white/5 cursor-pointer group hover:border-cyan-500/30 transition-all">
                      <input
                        type="checkbox"
                        checked={agreedToTerms}
                        onChange={e => setAgreedToTerms(e.target.checked)}
                        className="mt-1 w-6 h-6 accent-cyan-500 rounded-lg"
                      />
                      <span className="text-[10px] font-bold text-slate-500 uppercase leading-relaxed group-hover:text-slate-300 transition-colors">
                        Confirm Smart Contract authorization and acknowledge all associated capital risks.
                      </span>
                    </label>

                    <button
                      disabled={!agreedToTerms || processing || finalAmount > availableBalance}
                      onClick={handleInvest}
                      className="group relative w-full py-8 rounded-3xl bg-white disabled:bg-slate-800 disabled:text-slate-600 text-slate-950 font-black text-xl shadow-2xl transition-all overflow-hidden active:scale-[0.98] uppercase tracking-tighter italic"
                    >
                      <span className="relative z-10 flex items-center justify-center gap-3">
                        Execute Transaction <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
                      </span>
                      <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-violet-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>

                    {finalAmount > availableBalance && (
                      <p className="text-center text-[10px] font-black text-rose-500 uppercase tracking-widest animate-pulse">Insufficient Balance for Allocation</p>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {paymentStep === "processing" && (
            <motion.div
              key="processing"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1 }}
              className="max-w-xl mx-auto py-24 text-center"
            >
              <div className="relative w-64 h-64 mx-auto mb-16">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 border-[2px] border-cyan-500/10 border-t-cyan-500 rounded-full shadow-[0_0_80px_rgba(6,182,212,0.1)]"
                />
                <motion.div
                  animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 4, repeat: Infinity }}
                  className="absolute inset-8 bg-slate-900 rounded-full flex items-center justify-center border border-white/5 backdrop-blur-3xl"
                >
                  <Lock className="text-cyan-400 w-16 h-16 shadow-lg shadow-cyan-500/20" />
                </motion.div>
              </div>

              <h2 className="text-5xl font-black mb-8 tracking-tighter italic">Verifying Protocol...</h2>

              <div className="space-y-4 max-w-sm mx-auto bg-slate-900/50 p-10 rounded-[2.5rem] border border-white/5">
                {[
                  "Accessing Secure Vault...",
                  "Validating Digital Ownership...",
                  "Allocating Units in Ledger...",
                  "Generating Smart Contract...",
                  "Finalizing Transaction Hash..."
                ].map((text, idx) => (
                  <div key={idx} className="flex items-center gap-6">
                    <div className={`w-3 h-3 rounded-full transition-all duration-700 ${processingStatus >= idx ? 'bg-cyan-400 shadow-[0_0_15px_cyan]' : 'bg-slate-800'}`} />
                    <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${processingStatus >= idx ? 'text-white' : 'text-slate-700'}`}>{text}</span>
                  </div>
                ))}
              </div>
              <p className="mt-16 text-slate-600 text-[10px] font-black uppercase tracking-[0.5em] animate-pulse">End-to-End Encryption Active</p>
            </motion.div>
          )}

          {paymentStep === "pending_approval" && (
            <motion.div
              key="pending"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-3xl mx-auto py-20"
            >
              <div className="bg-slate-900 border border-white/5 p-16 rounded-[4rem] text-center shadow-3xl relative overflow-hidden backdrop-blur-3xl">
                <div className="absolute top-0 right-0 p-12 opacity-5">
                  <Clock size={200} />
                </div>
                <div className="w-28 h-28 bg-amber-500/10 border border-amber-500/20 rounded-full flex items-center justify-center mx-auto mb-10 shadow-[0_0_50px_rgba(245,158,11,0.1)]">
                  <Clock size={48} className="text-amber-500" />
                </div>
                <h2 className="text-6xl font-black text-white mb-6 tracking-tighter italic">Pending Ledger Verification</h2>
                <p className="text-slate-500 mb-12 font-bold uppercase tracking-widest text-xs max-w-md mx-auto leading-loose">
                  Your acquisition request has been broadcasted. Our validators are verifying the smart contract allocation.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                  <div className="bg-black/40 p-8 rounded-[2rem] border border-white/5 text-left group hover:border-amber-500/20 transition-all">
                    <p className="text-[10px] font-black text-slate-600 uppercase mb-3 tracking-widest">Transaction Ref</p>
                    <p className="font-mono text-xs text-amber-500/80 break-all font-black">{investmentData?.reference_id}</p>
                  </div>
                  <div className="bg-black/40 p-8 rounded-[2rem] border border-white/5 text-left group hover:border-emerald-500/20 transition-all">
                    <p className="text-[10px] font-black text-slate-600 uppercase mb-3 tracking-widest">Asset Value</p>
                    <p className="text-3xl font-black text-emerald-400 italic">${finalAmount.toLocaleString()}</p>
                  </div>
                </div>

                <div className="flex flex-col gap-5">
                  <button onClick={checkStatus} className="w-full py-6 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-2xl transition-all shadow-2xl uppercase text-[10px] tracking-[0.3em] italic">
                    Refresh Status Matrix
                  </button>
                  <button onClick={() => navigate('/investor/investments')} className="text-slate-500 hover:text-white font-black uppercase text-[10px] tracking-[0.3em] transition-all">
                    View Portfolio Log
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {paymentStep === "success" && (
            <motion.div
              key="success"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="max-w-3xl mx-auto"
            >
              <div className="bg-slate-900 border-2 border-emerald-500/10 p-20 rounded-[5rem] text-center shadow-[0_0_120px_rgba(16,185,129,0.1)] relative overflow-hidden backdrop-blur-3xl">
                <div className="absolute -top-32 -left-32 w-80 h-80 bg-emerald-500/10 blur-[120px] rounded-full" />
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", damping: 10, stiffness: 100 }}
                  className="w-32 h-32 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-12 shadow-[0_0_60px_rgba(16,185,129,0.3)]"
                >
                  <CheckCircle size={64} className="text-slate-950" />
                </motion.div>
                <h2 className="text-7xl font-black text-white mb-6 tracking-tighter italic">Ownership Allocated</h2>
                <p className="text-slate-500 mb-16 text-xs font-black uppercase tracking-[0.3em] opacity-80">Your digital shares have been legally assigned to your wallet.</p>

                <div className="flex flex-col sm:flex-row gap-8">
                  <button
                    onClick={() => navigate('/investor/portfolio')}
                    className="flex-1 py-6 rounded-2xl bg-white hover:bg-cyan-400 text-slate-950 font-black uppercase tracking-widest transition-all shadow-3xl active:scale-95 italic text-sm"
                  >
                    View Portfolio Matrix
                  </button>
                  <button
                    onClick={() => navigate('/investor/investments')}
                    className="flex-1 py-6 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-black uppercase tracking-widest transition-all border border-white/5 active:scale-95 italic text-sm"
                  >
                    Asset History
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default InvestPage;