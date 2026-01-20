import React, { useState } from "react";
import { Bell, LogOut, Search } from "lucide-react";
import NotificationCenter from "../Notifications/NotificationCenter";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../store/slices/userSlice";
import authService from "../../api/authService";

const PrivateHeader = () => {
  const [showNotifications, setShowNotifications] = useState(false);
  const { unreadCount } = useSelector((state) => state.notifications || { unreadCount: 0 });
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
        <button
          onClick={() => setShowNotifications(!showNotifications)}
          className={`p-2.5 bg-slate-900 border rounded-xl transition-all relative ${showNotifications ? 'border-emerald-500 text-emerald-400' : 'border-slate-800 text-slate-400 hover:text-white'
            }`}
        >
          <Bell size={20} />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white border-2 border-[#020617] animate-pulse">
              {unreadCount}
            </span>
          )}
        </button>

        <NotificationCenter
          isOpen={showNotifications}
          onClose={() => setShowNotifications(false)}
        />

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