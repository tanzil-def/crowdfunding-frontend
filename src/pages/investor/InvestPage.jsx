import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProjectDetail, initiateInvestment } from "../../services/api";
import { motion } from "framer-motion";
import {
  DollarSign,
  TrendingUp,
  ShoppingCart,
  AlertCircle,
  CheckCircle,
  ArrowLeft,
  Lock,
  CreditCard,
  Info,
} from "lucide-react";
import { toast } from "react-hot-toast";

const InvestPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [shares, setShares] = useState(1);
  const [processing, setProcessing] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  useEffect(() => {
    fetchProject();
  }, [id]);

  const fetchProject = async () => {
    try {
      setLoading(true);
      const data = await getProjectDetail(id);
      setProject(data);
    } catch (err) {
      toast.error("Failed to load project details");
      navigate("/investor/browse");
    } finally {
      setLoading(false);
    }
  };

  const handleInvest = async () => {
    if (!agreedToTerms) {
      toast.error("Please agree to terms and conditions");
      return;
    }

    if (shares < 1) {
      toast.error("Minimum 1 share required");
      return;
    }

    if (shares > project.remaining_shares) {
      toast.error(`Only ${project.remaining_shares} shares available`);
      return;
    }

    try {
      setProcessing(true);
      const idempotencyKey = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      
      const response = await initiateInvestment({
        project_id: id,
        shares_requested: shares,
        idempotency_key: idempotencyKey,
      });

      // In production, this would redirect to payment gateway
      // For sandbox, we'll simulate the process
      toast.success("Investment initiated! Redirecting to payment...");
      
      // Simulate payment redirect
      setTimeout(() => {
        toast.success("Payment successful! Investment recorded.");
        navigate("/investor/investments");
      }, 2000);
      
    } catch (err) {
      toast.error(err.response?.data?.detail || "Failed to initiate investment");
    } finally {
      setProcessing(false);
    }
  };

  const totalAmount = shares * parseFloat(project?.share_price || 0);
  const platformFee = totalAmount * 0.02; // 2% platform fee
  const finalAmount = totalAmount + platformFee;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-green-900 to-slate-900 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (!project) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-green-900 to-slate-900 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Project
        </motion.button>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-5xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent mb-2">
            Complete Your Investment
          </h1>
          <p className="text-gray-400 text-lg">
            You're investing in: <span className="text-white font-semibold">{project.title}</span>
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Investment Calculator */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-8"
          >
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <ShoppingCart className="w-6 h-6 text-green-400" />
              Investment Calculator
            </h2>

            {/* Share Input */}
            <div className="mb-6">
              <label className="block text-gray-400 mb-2">Number of Shares</label>
              <div className="relative">
                <input
                  type="number"
                  min="1"
                  max={project.remaining_shares}
                  value={shares}
                  onChange={(e) => setShares(parseInt(e.target.value) || 1)}
                  className="w-full px-4 py-4 bg-slate-700 text-white text-2xl font-bold rounded-xl border border-slate-600 focus:border-green-500 focus:outline-none"
                />
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                  <button
                    onClick={() => setShares((s) => Math.max(1, s - 1))}
                    className="px-3 py-1 bg-slate-600 text-white rounded-lg hover:bg-slate-500 transition-colors"
                  >
                    -
                  </button>
                  <button
                    onClick={() => setShares((s) => Math.min(project.remaining_shares, s + 1))}
                    className="ml-2 px-3 py-1 bg-slate-600 text-white rounded-lg hover:bg-slate-500 transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>
              <p className="text-gray-400 text-sm mt-2">
                Maximum available: {project.remaining_shares.toLocaleString()} shares
              </p>
            </div>

            {/* Quick Select */}
            <div className="grid grid-cols-4 gap-2 mb-6">
              {[10, 25, 50, 100].map((amount) => (
                <button
                  key={amount}
                  onClick={() => setShares(Math.min(amount, project.remaining_shares))}
                  disabled={amount > project.remaining_shares}
                  className="px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-green-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {amount}
                </button>
              ))}
            </div>

            {/* Price Breakdown */}
            <div className="space-y-3 mb-6">
              <div className="flex items-center justify-between p-4 bg-slate-700/30 rounded-lg">
                <span className="text-gray-400">Share Price</span>
                <span className="text-white font-semibold">
                  ${parseFloat(project.share_price).toFixed(2)}
                </span>
              </div>
              <div className="flex items-center justify-between p-4 bg-slate-700/30 rounded-lg">
                <span className="text-gray-400">Shares × Price</span>
                <span className="text-white font-semibold">
                  {shares} × ${parseFloat(project.share_price).toFixed(2)}
                </span>
              </div>
              <div className="flex items-center justify-between p-4 bg-slate-700/30 rounded-lg">
                <span className="text-gray-400">Subtotal</span>
                <span className="text-white font-semibold">${totalAmount.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-slate-700/30 rounded-lg">
                <span className="text-gray-400 flex items-center gap-1">
                  Platform Fee (2%)
                  <Info className="w-4 h-4" />
                </span>
                <span className="text-white font-semibold">${platformFee.toFixed(2)}</span>
              </div>
            </div>

            {/* Total */}
            <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-xl p-6">
              <div className="flex items-center justify-between">
                <span className="text-green-400 font-semibold text-lg">Total Amount</span>
                <span className="text-3xl font-bold text-white">
                  ${finalAmount.toFixed(2)}
                </span>
              </div>
            </div>
          </motion.div>

          {/* Payment Section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-8"
          >
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <CreditCard className="w-6 h-6 text-green-400" />
              Payment Details
            </h2>

            {/* Investment Summary */}
            <div className="bg-slate-700/30 rounded-xl p-6 mb-6">
              <h3 className="text-white font-semibold mb-4">Investment Summary</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Project</span>
                  <span className="text-white">{project.title}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Category</span>
                  <span className="text-white">{project.category}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Ownership</span>
                  <span className="text-white">
                    {((shares / project.total_shares) * 100).toFixed(4)}%
                  </span>
                </div>
              </div>
            </div>

            {/* Sandbox Notice */}
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4 mb-6 flex items-start gap-3">
              <Info className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-blue-400 font-semibold text-sm mb-1">
                  Sandbox Payment Mode
                </p>
                <p className="text-gray-400 text-xs">
                  This is a test environment. No real money will be charged.
                </p>
              </div>
            </div>

            {/* Terms and Conditions */}
            <div className="mb-6">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreedToTerms}
                  onChange={(e) => setAgreedToTerms(e.target.checked)}
                  className="mt-1 w-5 h-5 rounded border-gray-600 text-green-500 focus:ring-green-500 bg-slate-700"
                />
                <span className="text-gray-300 text-sm">
                  I agree to the{" "}
                  <a href="#" className="text-green-400 hover:underline">
                    terms and conditions
                  </a>{" "}
                  and understand the risks associated with crowdfunding investments.
                </span>
              </label>
            </div>

            {/* Investment Button */}
            <button
              onClick={handleInvest}
              disabled={processing || !agreedToTerms || shares < 1}
              className="w-full px-6 py-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-lg font-bold rounded-xl hover:from-green-600 hover:to-emerald-600 transition-all shadow-lg hover:shadow-green-500/50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {processing ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                  />
                  Processing...
                </>
              ) : (
                <>
                  <Lock className="w-5 h-5" />
                  Complete Investment - ${finalAmount.toFixed(2)}
                </>
              )}
            </button>

            {/* Security Notice */}
            <div className="mt-6 flex items-center gap-2 text-gray-400 text-xs">
              <Lock className="w-4 h-4" />
              <span>Secure payment processing with 256-bit encryption</span>
            </div>
          </motion.div>
        </div>

        {/* Risk Warning */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-8 bg-yellow-500/10 border border-yellow-500/30 rounded-2xl p-6"
        >
          <div className="flex items-start gap-3">
            <AlertCircle className="w-6 h-6 text-yellow-400 flex-shrink-0" />
            <div>
              <h3 className="text-yellow-400 font-bold mb-2">Investment Risk Warning</h3>
              <p className="text-gray-300 text-sm">
                Crowdfunding investments carry risk. Capital is at risk and past performance is not
                a reliable indicator of future results. Investments are illiquid and you may not be
                able to sell your investment when you want to. Please ensure you understand the risks
                before investing.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default InvestPage;