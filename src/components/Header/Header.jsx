// src/components/Header/Header.jsx
import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { LogOut, Menu, Globe } from "lucide-react";
import NotificationBell from "./NotificationBell";
import { logout } from "../../store/slices/userSlice";
import authService from "../../api/authService";

const Header = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector(state => state.user?.user || null);
  const isLoggedIn = !!user;
  const role = user?.role;

  const handleLogout = async () => {
    try {
      await authService.logout();
      dispatch(logout());
      navigate("/auth/login");
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <header className="w-full bg-white/90 backdrop-blur-md border-b border-slate-100 sticky top-0 z-50 transition-all">
      <div className="w-full px-6 md:px-12 py-4 flex justify-between items-center">

        {/* --- LEFT SIDE: LOGO --- */}
        <div
          className="flex items-center gap-2 cursor-pointer group"
          onClick={() => navigate("/")}
        >
          <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-200 group-hover:rotate-6 transition-transform">
            <Globe className="text-white" size={24} />
          </div>
          <span className="text-xl font-black text-slate-900 tracking-tighter uppercase">
            Crowdfunding <span className="text-emerald-600 font-light">Trading</span>
          </span>
        </div>

        {/* --- RIGHT SIDE: NAVIGATION --- */}
        <nav className="hidden md:flex items-center gap-10">
          <Link to="/projects/browse" className="text-sm font-bold text-slate-500 hover:text-emerald-600 transition-colors uppercase tracking-widest">
            Browse Market
          </Link>

          {isLoggedIn ? (
            <div className="flex items-center gap-6 pl-6 border-l border-slate-200">
              {/* Conditional Dashboard Links */}
              {role === "INVESTOR" && (
                <Link to="/investor/dashboard" className="text-sm font-black text-slate-900 uppercase">Dashboard</Link>
              )}
              {role === "DEVELOPER" && (
                <Link to="/developer/my-projects" className="text-sm font-black text-slate-900 uppercase">My Projects</Link>
              )}
              {role === "ADMIN" && (
                <Link to="/admin/pending" className="text-sm font-black text-slate-900 uppercase underline decoration-emerald-500 underline-offset-4">Admin Console</Link>
              )}

              {/* Notification & Logout */}
              <div className="flex items-center gap-4">
                <NotificationBell />
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-red-600 transition-all shadow-md active:scale-95"
                >
                  <LogOut size={14} /> Logout
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <Link to="/auth/login" className="text-sm font-bold text-slate-900 hover:text-emerald-600 transition-colors">
                Sign In
              </Link>
              <Link
                to="/auth/register"
                className="bg-emerald-600 text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-emerald-700 shadow-lg shadow-emerald-200 transition-all active:scale-95"
              >
                Get Started
              </Link>
            </div>
          )}
        </nav>

        {/* --- MOBILE TOGGLE --- */}
        <button className="md:hidden p-2 hover:bg-slate-100 rounded-lg transition-colors">
          <Menu size={24} className="text-slate-900" />
        </button>
      </div>
    </header>
  );
};

export default Header;