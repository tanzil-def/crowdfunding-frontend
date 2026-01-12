import React from "react";
import NotificationBell from "./NotificationBell";

const PrivateHeader = () => {
  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  return (
    <header className="bg-slate-900 border-b border-slate-800 px-8 py-4 flex items-center justify-between fixed top-0 left-64 right-0 z-40">
      <h1 className="text-xl font-bold text-white tracking-tight">
        Developer Dashboard
      </h1>

      <div className="flex items-center gap-6">
        <NotificationBell />
        <button
          onClick={handleLogout}
          className="px-6 py-2.5 bg-red-600/20 text-red-400 rounded-lg hover:bg-red-600 hover:text-white transition-colors font-medium"
        >
          Logout
        </button>
      </div>
    </header>
  );
};

export default PrivateHeader;