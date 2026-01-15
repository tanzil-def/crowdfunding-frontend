import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  FolderKanban,
  PlusCircle,
  Bell,
  Settings,
  DollarSign,
  Briefcase,
  Home,
  FileText,
  Shield,
  Users
} from "lucide-react";
import { useSelector } from "react-redux";

const Sidebar = ({ role }) => {
  const location = useLocation();
  const navigate = useNavigate();

  // Safe access to Redux state
  const { user } = useSelector((state) => state.user || {});

  const isActive = (path) => location.pathname === path;

  // STRICTLY DEFINED NAVIGATION ITEMS BY ROLE
  const navItems = {
    // 1. DEVELOPER ROLE
    DEVELOPER: [
      { icon: <LayoutDashboard size={20} />, label: "Dashboard", path: "/developer" },
      { icon: <FolderKanban size={20} />, label: "My Projects", path: "/developer/projects" },
      { icon: <PlusCircle size={20} />, label: "Create Project", path: "/developer/projects/new" },
      { icon: <Settings size={20} />, label: "Account", path: "/account" },
    ],

    // 2. INVESTOR ROLE
    INVESTOR: [
      { icon: <LayoutDashboard size={20} />, label: "Dashboard", path: "/investor" },
      { icon: <Briefcase size={20} />, label: "Marketplace", path: "/investor/browse" },
      { icon: <DollarSign size={20} />, label: "My Investments", path: "/investor/my-investments" },
      { icon: <Briefcase size={20} />, label: "Compare Projects", path: "/investor/compare" },
      { icon: <Bell size={20} />, label: "Notifications", path: "/notifications" },
      { icon: <Settings size={20} />, label: "Account", path: "/account" },
    ],

    // 3. ADMIN ROLE
    ADMIN: [
      { icon: <LayoutDashboard size={20} />, label: "Dashboard", path: "/admin" },
      { icon: <FileText size={20} />, label: "Pending Projects", path: "/admin/pending-projects" },
      { icon: <Users size={20} />, label: "User Management", path: "/admin/users" },
      { icon: <Shield size={20} />, label: "Audit Logs", path: "/admin/audit-logs" },
      { icon: <Shield size={20} />, label: "Access Requests", path: "/admin/access-requests" },
      { icon: <Settings size={20} />, label: "Account", path: "/account" },
    ],
  };

  // Safe fallback: If role is unrecognized, use an empty array or public links
  // DO NOT default to developer links for security/UX reasons.
  const items = navItems[role] || [];

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-slate-900 border-r border-slate-800 z-50 pt-6">
      <div className="p-4">
        {/* User Profile Card */}
        <div className="mb-6 p-4 bg-slate-800/40 rounded-xl border border-slate-700/50">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center font-bold text-white shadow-lg shadow-emerald-500/20">
              {user?.name?.[0]?.toUpperCase() || "U"}
            </div>
            <div className="overflow-hidden">
              <h3 className="font-semibold text-white text-sm truncate">{user?.name || "User"}</h3>
              {/* Display role cleanly */}
              <p className="text-xs text-slate-400 capitalize">
                {role ? role.toLowerCase() : "Guest"}
              </p>
            </div>
          </div>
          <button
            onClick={() => navigate("/")}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-all"
          >
            <Home size={14} /> Back to Home
          </button>
        </div>

        <nav className="space-y-1">
          {items.length > 0 ? (
            items.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all ${isActive(item.path)
                  ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-lg shadow-emerald-500/5"
                  : "text-slate-400 hover:text-white hover:bg-slate-800 border border-transparent"
                  }`}
              >
                <span className="mr-3">{item.icon}</span>
                {item.label}
                {isActive(item.path) && (
                  <div className="ml-auto w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                )}
              </Link>
            ))
          ) : (
            <div className="text-center text-slate-500 text-sm py-4">
              No menu items available.
            </div>
          )}
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;