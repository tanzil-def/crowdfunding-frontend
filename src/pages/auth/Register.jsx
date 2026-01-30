import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import authService from "../../api/authService";
import GoogleLoginButton from "../../components/GoogleLoginButton";
import { toast } from "react-hot-toast";

const Register = () => {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    password_confirm: "",
    role: "INVESTOR",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.password_confirm) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      await authService.register(formData);
      toast.success("Registration successful! Please check your email.");
      navigate("/login");
    } catch (err) {
      console.error("Registration Error:", err.response?.data);
      const errorData = err.response?.data;
      let errorMsg = "Registration failed";
      if (errorData) {
        if (typeof errorData === 'string') {
          errorMsg = errorData;
        } else if (errorData.message) {
          errorMsg = errorData.message;
        } else if (typeof errorData === 'object') {
          const details = Object.entries(errorData)
            .map(([field, msgs]) => {
              const msg = Array.isArray(msgs) ? msgs[0] : msgs;
              return `${field}: ${msg}`;
            })
            .join(" | ");
          errorMsg = details || errorMsg;
        }
      }
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center bg-[#0a0a0b] p-4 md:p-6 overflow-hidden">
      {/* Background Layer with Animated Gradient */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=80"
          alt="Background"
          className="w-full h-full object-cover opacity-30 scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-tr from-black via-black/80 to-emerald-900/20" />
      </div>

      {/* Main Glass Card */}
      <div className="relative w-full max-w-[520px] bg-white/[0.03] backdrop-blur-xl p-8 md:p-12 rounded-[2rem] border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-10 overflow-hidden">

        {/* Subtle Inner Glow */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-emerald-500/10 blur-[80px] rounded-full" />

        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-3 tracking-tight">
            Create <span className="text-emerald-500">Account</span>
          </h2>
          <p className="text-slate-400 font-medium text-sm tracking-wide">
            JOIN THE FUTURE OF INVESTMENT
          </p>
        </div>

        {error && (
          <div className="bg-red-500/10 text-red-400 p-4 rounded-xl mb-6 text-xs font-medium border border-red-500/20 animate-pulse">
            {error}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-5">
          {/* Name Row */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.15em] ml-1">First Name</label>
              <input
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                placeholder="John"
                className="w-full px-4 py-3 bg-white/[0.05] border border-white/10 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:bg-white/[0.08] transition-all duration-300"
                required
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.15em] ml-1">Last Name</label>
              <input
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                placeholder="Doe"
                className="w-full px-4 py-3 bg-white/[0.05] border border-white/10 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:bg-white/[0.08] transition-all duration-300"
                required
              />
            </div>
          </div>

          {/* Email */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.15em] ml-1">Email Address</label>
            <input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="name@company.com"
              className="w-full px-4 py-3 bg-white/[0.05] border border-white/10 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:bg-white/[0.08] transition-all duration-300"
              required
            />
          </div>

          {/* Password Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.15em] ml-1">Password</label>
              <input
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full px-4 py-3 bg-white/[0.05] border border-white/10 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:bg-white/[0.08] transition-all duration-300"
                required
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.15em] ml-1">Confirm</label>
              <input
                name="password_confirm"
                type="password"
                value={formData.password_confirm}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full px-4 py-3 bg-white/[0.05] border border-white/10 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:bg-white/[0.08] transition-all duration-300"
                required
              />
            </div>
          </div>

          {/* Role Selector */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.15em] ml-1">Account Purpose</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-white/[0.05] border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/40 transition-all cursor-pointer appearance-none"
            >
              <option className="bg-[#1a1a1a]" value="INVESTOR">Investor - I want to invest</option>
              <option className="bg-[#1a1a1a]" value="DEVELOPER">Developer - I want to build</option>
            </select>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 mt-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl transition-all duration-300 active:scale-[0.98] shadow-[0_10px_20px_rgba(16,185,129,0.2)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm uppercase tracking-widest"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Processing...
              </span>
            ) : "Create Account"}
          </button>
        </form>

        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/5"></div>
          </div>
          <div className="relative flex justify-center text-[10px] uppercase tracking-[0.2em]">
            <span className="bg-[#121214] px-4 text-slate-500 font-semibold">Or continue with</span>
          </div>
        </div>

        <div className="hover:scale-[1.01] transition-transform duration-300">
          <GoogleLoginButton />
        </div>

        <p className="text-center text-slate-500 text-sm mt-8">
          Already have an account?{" "}
          <Link to="/login" className="text-emerald-500 hover:text-emerald-400 font-bold transition-colors">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;