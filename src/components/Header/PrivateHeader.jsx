import React, { useState } from "react";
import { Bell, LogOut, Search } from "lucide-react";
import NotificationBell from "./NotificationBell";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../store/slices/userSlice";
import authService from "../../api/authService";

const PrivateHeader = () => {
  const dispatch = useDispatch();

  const handleLogout = async () => {
    await authService.logout();
    dispatch(logout());
    window.location.href = "/login";
  };

  return (
    <header className="h-20 bg-[#020617]/80 backdrop-blur-md border-b border-slate-800/50 px-8 flex items-center justify-between fixed top-0 left-64 right-0 z-40">
      <div className="flex items-center bg-slate-900/50 border border-slate-800 rounded-xl px-4 py-2 w-96">
        <Search size={18} className="text-slate-500" />
        <input
          type="text"
          placeholder="Search something..."
          className="bg-transparent border-none focus:ring-0 text-sm ml-2 text-white outline-none w-full"
        />
      </div>

      <div className="flex items-center gap-4 relative">
        <NotificationBell />

        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-4 py-2 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all text-sm font-bold border border-red-500/20"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </header>
  );
};

export default PrivateHeader;