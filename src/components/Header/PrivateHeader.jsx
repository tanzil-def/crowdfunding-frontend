import React, { useState, useEffect } from "react";
import { Bell, LogOut, Search } from "lucide-react";
import NotificationCenter from "../Notifications/NotificationCenter";
import { getNotifications } from "../../services/api";

const PrivateHeader = () => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [hasUnread, setHasUnread] = useState(false);

  useEffect(() => {
    checkUnread();
    // Poll for notifications every 30 seconds
    const interval = setInterval(checkUnread, 30000);
    return () => clearInterval(interval);
  }, []);

  const checkUnread = async () => {
    try {
      const res = await getNotifications();
      const data = res.data || res;
      const unreadCount = data.results?.filter(n => !n.is_read).length || 0;
      setHasUnread(unreadCount > 0);
    } catch (err) {
      console.error("Unread check failed:", err);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
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
          {hasUnread && (
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-slate-900 animate-pulse" />
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