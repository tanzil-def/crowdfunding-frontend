import React, { useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { confirmPasswordReset } from "../../services/api";

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    setLoading(true);

    try {
      const token = searchParams.get("token");
      
      if (!token) {
        setError("Invalid reset link");
        return;
      }

      const response = await confirmPasswordReset(token, password);
      
      if (response.success) {
        alert("Password reset successful! Please login.");
        navigate("/login");
      }
    } catch (err) {
      setError(err.response?.data?.error || "Password reset failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center bg-black p-6 overflow-hidden">
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=80"
          alt="Background"
          className="w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950/95 via-slate-900/80 to-black/95" />
      </div>

      <div className="relative w-full max-w-md bg-slate-900/85 backdrop-blur-2xl p-8 md:p-10 rounded-[2.5rem] border border-slate-700/50 shadow-2xl z-10">
        <div className="text-center mb-10">
          <h2 className="text-4xl font-black text-white mb-2 tracking-tight uppercase">
            Reset Password
          </h2>
          <p className="text-slate-400 text-sm">Enter your new password</p>
        </div>

        {error && (
          <div className="bg-red-500/10 text-red-400 p-4 rounded-2xl text-sm font-medium border border-red-500/20 text-center mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">
              New Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-6 py-4 bg-slate-950/80 border border-slate-700 rounded-2xl text-gray-100 placeholder-gray-400 focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all duration-300 shadow-inner"
            />
            <p className="text-xs text-slate-500 mt-2 ml-1">Must be at least 8 characters</p>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">
              Confirm Password
            </label>
            <input
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-6 py-4 bg-slate-950/80 border border-slate-700 rounded-2xl text-gray-100 placeholder-gray-400 focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all duration-300 shadow-inner"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-2xl transition-all active:scale-[0.98] shadow-lg shadow-emerald-900/20 disabled:opacity-50 flex items-center justify-center gap-2 text-lg"
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>

        <p className="text-center text-slate-400 text-sm mt-8">
          Remember your password?{" "}
          <Link
            to="/login"
            className="text-emerald-500 hover:text-emerald-400 font-bold underline underline-offset-4"
          >
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ResetPassword;