import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    setLoading(true);

    try {
      const response = await axios.post("/api/v1/auth/password-reset/", {
        email,
      });

      setMessage(response.data.message || "Password reset link sent to your email!");
    } catch (err) {
      setError(
        err.response?.data?.error ||
          err.response?.data?.message ||
          "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center bg-black p-6 overflow-hidden font-sans">
      {/* Background Image & Overlay */}
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
            Forgot Password
          </h2>
          <p className="text-slate-400 text-sm">
            Enter your email to receive a reset link
          </p>
        </div>

        {message && (
          <div className="bg-emerald-500/10 text-emerald-400 p-4 rounded-2xl text-sm font-medium border border-emerald-500/20 text-center mb-6">
            {message}
          </div>
        )}

        {error && (
          <div className="bg-red-500/10 text-red-400 p-4 rounded-2xl text-sm font-medium border border-red-500/20 text-center mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              placeholder="email@example.com"
              className="w-full px-6 py-4 bg-slate-950/80 border border-slate-700 rounded-2xl text-gray-100 placeholder-gray-400 focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all duration-300 shadow-inner"
              autoComplete="email"
            />
          </div>

          <button
            type="submit"
            disabled={loading || !email.trim()}
            className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-2xl transition-all active:scale-[0.98] shadow-lg shadow-emerald-900/20 disabled:opacity-50 flex items-center justify-center gap-2 text-lg"
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>

        <p className="text-center text-slate-400 text-sm mt-8">
          Remembered your password?{" "}
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
}