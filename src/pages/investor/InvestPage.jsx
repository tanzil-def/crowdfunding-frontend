// pages/investor/InvestPage.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import investorService from "../../api/investorService"; // Ensure this matches your API handler
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
} from "lucide-react";
import { toast } from "react-hot-toast";

const InvestPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // States
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [shares, setShares] = useState(1);
  const [processing, setProcessing] = useState(false);
  const [paymentStep, setPaymentStep] = useState("details"); // details, processing, pending_approval, success
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [investmentData, setInvestmentData] = useState(null);
  const [processingStatus, setProcessingStatus] = useState(0);

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

    try {
      setProcessing(true);
      setPaymentStep("processing");

      // 1. INITIATE INVESTMENT
      const idempotencyKey = `ref-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      const initiateResponse = await investorService.initiateInvestment({
        project_id: id,
        shares_requested: shares,
        idempotency_key: idempotencyKey,
      });

      const initData = initiateResponse.data || initiateResponse;
      setInvestmentData(initData);

      // 2. SIMULATE PAYMENT GATEWAY (15 Seconds)
      simulatePaymentFlow(initData);

    } catch (err) {
      toast.error(err.response?.data?.message || "Investment initiation failed");
      setPaymentStep("details");
      setProcessing(false);
    }
  };

  const simulatePaymentFlow = (initData) => {
    const statuses = [
      "Connecting to secure payment gateway...",
      "Authorizing transaction with your bank...",
      "Verifying funds availability...",
      "Gateway processing payment...",
      "Waiting for network confirmation..."
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
      // 3. CALLBACK (Backend API call to record payment)
      const callbackPayload = {
        payment_reference_id: initData.reference_id,
        success: true,
        gateway_payload: {
          shares_requested: shares,
          project_id: id,
          transaction_id: `GW-${Math.random().toString(36).toUpperCase().slice(2, 10)}`,
          amount: totalAmount,
          currency: "USD",
          status: "captured",
          timestamp: new Date().toISOString()
        }
      };

      await investorService.submitPaymentCallback(callbackPayload);
      setPaymentStep("pending_approval");
      toast.success("Payment successful! Waiting for Admin verification.");

    } catch (err) {
      toast.error("Payment Confirmation Failed");
      setPaymentStep("details");
    } finally {
      setProcessing(false);
    }
  };

  const checkStatus = async () => {
    // In a real scenario, we'd poll the backend to see if Admin approved
    toast.loading("Verifying approval status...");
    setTimeout(() => {
      toast.dismiss();
      setPaymentStep("success");
      toast.success("Investment Approved & Shares Allocated!");
    }, 2000);
  };

  // Calculations
  const pricePerShare = parseFloat(project?.price_per_share || project?.share_price || 0);
  const totalAmount = shares * pricePerShare;
  const platformFee = totalAmount * 0.02;
  const finalAmount = totalAmount + platformFee;

  if (loading) return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center">
      <Loader2 className="w-12 h-12 text-cyan-500 animate-spin mb-4" />
      <p className="text-slate-400 animate-pulse font-medium">Loading Investment Portal...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 p-4 lg:p-10 font-sans relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-500/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">

        {/* Step 1: Input Details */}
        {paymentStep === "details" && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-12 mb-4">
              <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-400 hover:text-cyan-400 transition-colors mb-4 group">
                <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                <span className="font-bold uppercase tracking-widest text-xs">Back to Project</span>
              </button>
              <h1 className="text-4xl md:text-5xl font-black tracking-tight">Invest in <span className="text-cyan-400">{project.title}</span></h1>
            </div>

            {/* Left: Calculator */}
            <div className="lg:col-span-7 space-y-6">
              <div className="bg-slate-900/40 border border-slate-800 p-8 rounded-[2.5rem] backdrop-blur-xl shadow-2xl">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] block mb-8">Acquisition Volume</label>
                <div className="flex items-center gap-6 bg-slate-950/50 p-6 rounded-3xl border border-white/5 shadow-inner">
                  <input
                    type="number"
                    value={shares}
                    onChange={(e) => setShares(Math.max(1, parseInt(e.target.value) || 1))}
                    className="bg-transparent text-6xl font-black w-full outline-none text-white tracking-tighter"
                  />
                  <div className="flex flex-col gap-3">
                    <button onClick={() => setShares(s => s + 1)} className="w-12 h-12 flex items-center justify-center bg-slate-800 rounded-2xl hover:bg-cyan-600 transition-all font-black text-xl">+</button>
                    <button onClick={() => setShares(s => Math.max(1, s - 1))} className="w-12 h-12 flex items-center justify-center bg-slate-800 rounded-2xl hover:bg-rose-600 transition-all font-black text-xl">-</button>
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-4 mt-8">
                  {[10, 50, 100, 500].map(v => (
                    <button key={v} onClick={() => setShares(v)} className="py-4 rounded-2xl border border-slate-800 hover:border-cyan-500 hover:bg-cyan-500/10 transition-all font-black text-xs tracking-widest uppercase">
                      {v} Shares
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-amber-500/5 border border-amber-500/20 p-6 rounded-3xl flex gap-4 backdrop-blur-sm">
                <AlertCircle className="text-amber-500 shrink-0" />
                <div className="space-y-1">
                  <p className="text-xs font-black text-amber-500 uppercase tracking-widest">Risk Disclosure</p>
                  <p className="text-xs text-amber-200/50 leading-relaxed font-medium">All capital is at risk. Crowdfunding investments are illiquid and carry higher risk. Verify all project documents before allocation.</p>
                </div>
              </div>
            </div>

            {/* Right: Summary & Pay */}
            <div className="lg:col-span-5">
              <div className="bg-gradient-to-b from-slate-900/60 to-slate-950/60 border border-slate-800 p-8 rounded-[2.5rem] sticky top-8 backdrop-blur-2xl shadow-2xl">
                <h3 className="text-sm font-black uppercase tracking-[0.3em] text-emerald-400 mb-8 flex items-center gap-3">
                  <Shield size={18} /> Financial Summary
                </h3>

                <div className="space-y-5 mb-10">
                  <div className="flex justify-between items-center px-4 py-3 bg-white/5 rounded-2xl border border-white/5">
                    <span className="text-[10px] font-black text-slate-500 uppercase">Unit Price</span>
                    <span className="text-white font-black text-sm">${pricePerShare.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center px-4 py-3 bg-white/5 rounded-2xl border border-white/5">
                    <span className="text-[10px] font-black text-slate-500 uppercase">Allocated Units</span>
                    <span className="text-white font-black text-sm">{shares}</span>
                  </div>
                  <div className="flex justify-between items-center px-4 py-3 bg-white/5 rounded-2xl border border-white/5">
                    <span className="text-[10px] font-black text-slate-500 uppercase text-xs">Service Fee (2%)</span>
                    <span className="text-white font-black text-sm">${platformFee.toFixed(2)}</span>
                  </div>
                  <div className="pt-4 border-t border-white/10 flex justify-between items-end">
                    <span className="font-black text-xs text-slate-400 uppercase tracking-widest">Total Payable</span>
                    <span className="text-4xl font-black text-emerald-400 tracking-tighter">${finalAmount.toFixed(2)}</span>
                  </div>
                </div>

                <label className="flex items-start gap-4 mb-10 cursor-pointer group p-4 bg-slate-950/50 rounded-2xl border border-white/5 border-dashed">
                  <input type="checkbox" checked={agreedToTerms} onChange={e => setAgreedToTerms(e.target.checked)} className="mt-1 w-5 h-5 accent-emerald-500 rounded-lg cursor-pointer" />
                  <span className="text-[10px] font-bold text-slate-500 uppercase leading-relaxed group-hover:text-slate-300 transition-colors">I confirm authorization for this Smart Contract acquisition and acknowledge the risks.</span>
                </label>

                <button
                  disabled={!agreedToTerms || processing}
                  onClick={handleInvest}
                  className="group relative w-full py-6 rounded-[2rem] bg-emerald-500 hover:bg-emerald-400 disabled:bg-slate-800 disabled:text-slate-500 text-slate-950 font-black text-xl shadow-[0_20px_40px_-15px_rgba(16,185,129,0.3)] transition-all overflow-hidden active:scale-[0.98]"
                >
                  <span className="relative z-10 flex items-center justify-center gap-3">
                    <Zap size={20} /> AUTHORIZE PAYMENT
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Step 2: Realistic Processing UI (15-20 Seconds) */}
        {paymentStep === "processing" && (
          <div className="max-w-xl mx-auto py-24 text-center">
            <div className="relative w-48 h-48 mx-auto mb-12">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 border-[6px] border-cyan-500/10 border-t-cyan-500 rounded-full shadow-[0_0_30px_rgba(6,182,212,0.2)]"
              />
              <motion.div
                animate={{ scale: [1, 1.15, 1], opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute inset-6 bg-cyan-500/5 rounded-full flex items-center justify-center backdrop-blur-xl border border-cyan-500/20"
              >
                <Lock className="text-cyan-400 w-12 h-12" />
              </motion.div>
            </div>

            <h2 className="text-4xl font-black mb-6 tracking-tight">Securing Transfer...</h2>

            <div className="space-y-5 max-w-sm mx-auto bg-slate-900 p-8 rounded-3xl border border-white/5 shadow-inner">
              {[
                "Initiating Bank Protocol",
                "Encrypting Payload Data",
                "Awaiting Gateway Signal",
                "Verifying Transaction Integrity",
                "Confirming Network State"
              ].map((text, idx) => (
                <div key={idx} className="flex items-center gap-4 text-left">
                  <div className={`w-2.5 h-2.5 rounded-full transition-all duration-500 ${processingStatus >= idx ? 'bg-cyan-400 shadow-[0_0_12px_cyan]' : 'bg-slate-800'}`} />
                  <span className={`text-[10px] font-black uppercase tracking-widest ${processingStatus >= idx ? 'text-slate-100' : 'text-slate-700'}`}>{text}</span>
                </div>
              ))}
            </div>

            <p className="mt-12 text-slate-500 text-[10px] font-black uppercase tracking-[0.3em] animate-pulse">Encryption sequence active. Do not interrupt.</p>
          </div>
        )}

        {/* Step 3: Pending Approval Screen */}
        {paymentStep === "pending_approval" && (
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="max-w-2xl mx-auto py-20">
            <div className="bg-slate-900 border border-amber-500/30 p-12 rounded-[3.5rem] text-center shadow-3xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-10 opacity-5">
                <Clock size={160} />
              </div>
              <div className="w-24 h-24 bg-amber-500/10 border border-amber-500/30 rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl">
                <Clock size={40} className="text-amber-500 animate-pulse" />
              </div>
              <h2 className="text-4xl font-black text-white mb-4 tracking-tighter">Awaiting Verification</h2>
              <p className="text-slate-400 mb-10 font-bold uppercase tracking-widest text-[10px] max-w-sm mx-auto leading-loose">
                Payment captured. Your investment is currently in the <span className="text-amber-400">Admin Approval Queue</span>. Shares will be allocated once verified.
              </p>

              <div className="grid grid-cols-2 gap-6 mb-12">
                <div className="bg-slate-950 p-6 rounded-3xl border border-white/5 text-left">
                  <p className="text-[8px] font-black text-slate-600 uppercase mb-2">Ref Token</p>
                  <p className="font-mono text-xs text-amber-500/80 truncate font-bold">{investmentData?.reference_id}</p>
                </div>
                <div className="bg-slate-950 p-6 rounded-3xl border border-white/5 text-left">
                  <p className="text-[8px] font-black text-slate-600 uppercase mb-2">Net Value</p>
                  <p className="text-xl font-black text-white">${finalAmount.toFixed(2)}</p>
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <button onClick={checkStatus} className="w-full py-5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-2xl transition-all shadow-xl uppercase text-xs tracking-widest">
                  Refresh Status
                </button>
                <button onClick={() => navigate('/investor/investments')} className="text-slate-500 hover:text-white font-black uppercase text-[10px] tracking-widest transition-colors">
                  Back to Investments
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Step 4: Success Screen */}
        {paymentStep === "success" && (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="max-w-2xl mx-auto bg-slate-900 border-2 border-emerald-500/20 p-16 rounded-[4rem] text-center shadow-[0_40px_100px_-20px_rgba(16,185,129,0.2)] relative overflow-hidden"
          >
            <div className="absolute -top-24 -left-24 w-64 h-64 bg-emerald-500/10 blur-3xl rounded-full" />
            <div className="w-28 h-28 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-10 shadow-[0_0_50px_rgba(16,185,129,0.5)]">
              <CheckCircle size={56} className="text-slate-950" />
            </div>
            <h2 className="text-5xl font-black text-white mb-4 tracking-tighter">Ownership Confirmed</h2>
            <p className="text-slate-400 mb-12 text-sm font-bold uppercase tracking-widest opacity-80">Your digital shares have been legally allocated.</p>

            <div className="flex flex-col sm:flex-row gap-6">
              <button
                onClick={() => navigate('/investor/portfolio')}
                className="flex-1 py-5 rounded-2xl bg-white hover:bg-cyan-400 text-slate-950 font-black uppercase tracking-widest transition-all shadow-2xl active:scale-95"
              >
                Portfolio Matrix
              </button>
              <button
                onClick={() => navigate('/investor/investments')}
                className="flex-1 py-5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-black uppercase tracking-widest transition-all border border-white/5 active:scale-95"
              >
                View History
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default InvestPage;