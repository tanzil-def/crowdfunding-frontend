import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import authService from "../../api/authService";

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState("verifying");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get("token");

    if (!token) {
      setStatus("error");
      setMessage("Verification token is missing");
      return;
    }

    const verify = async () => {
      try {
        const response = await authService.verifyEmail(token);

        if (response.success) {
          setStatus("success");
          setMessage("Email verified successfully! Redirecting to login...");
          setTimeout(() => navigate("/login"), 3000);
        }
      } catch (err) {
        setStatus("error");
        setMessage(err.response?.data?.error || "Verification failed");
      }
    };

    verify();
  }, [searchParams, navigate]);

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
        <div className="text-center">
          {status === "verifying" && (
            <>
              <div className="w-20 h-20 mx-auto mb-6 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
              <h2 className="text-3xl font-black text-white mb-2">Verifying Email</h2>
              <p className="text-slate-400 text-sm">Please wait...</p>
            </>
          )}

          {status === "success" && (
            <>
              <div className="w-20 h-20 mx-auto mb-6 bg-emerald-500/20 rounded-full flex items-center justify-center">
                <svg className="w-12 h-12 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-3xl font-black text-white mb-2">Success!</h2>
              <p className="text-emerald-400 text-sm">{message}</p>
            </>
          )}

          {status === "error" && (
            <>
              <div className="w-20 h-20 mx-auto mb-6 bg-red-500/20 rounded-full flex items-center justify-center">
                <svg className="w-12 h-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <h2 className="text-3xl font-black text-white mb-2">Verification Failed</h2>
              <p className="text-red-400 text-sm mb-6">{message}</p>
              <Link
                to="/login"
                className="inline-block px-8 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-2xl transition-all"
              >
                Go to Login
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;