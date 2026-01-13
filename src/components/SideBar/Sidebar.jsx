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
} from "lucide-react";
import { useSelector } from "react-redux";

const Sidebar = ({ role }) => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Safe access to Redux state
  const { user } = useSelector((state) => state.auth || {});

  const isActive = (path) => location.pathname === path;

  const navItems = {
    developer: [
      { icon: <LayoutDashboard size={20} />, label: "Dashboard", path: "/developer" },
      { icon: <FolderKanban size={20} />, label: "My Projects", path: "/developer/projects" },
      { icon: <PlusCircle size={20} />, label: "Create Project", path: "/developer/projects/new" },
      { icon: <Bell size={20} />, label: "Notifications", path: "/developer/notifications" },
      { icon: <Settings size={20} />, label: "Account", path: "/developer/account" },
    ],
    investor: [
      { icon: <LayoutDashboard size={20} />, label: "Portfolio", path: "/investor" },
      { icon: <DollarSign size={20} />, label: "Investments", path: "/investor/portfolio" },
      { icon: <Briefcase size={20} />, label: "Marketplace", path: "/investor/projects" },
      { icon: <Bell size={20} />, label: "Notifications", path: "/investor/notifications" },
      { icon: <Settings size={20} />, label: "Account", path: "/investor/account" },
    ],
    admin: [
      { icon: <LayoutDashboard size={20} />, label: "Dashboard", path: "/admin" },
      { icon: <FileText size={20} />, label: "Pending Projects", path: "/admin/pending-projects" },
      { icon: <Shield size={20} />, label: "Access Requests", path: "/admin/access-requests" },
      { icon: <Settings size={20} />, label: "Account", path: "/admin/account" },
    ],
  };

  const items = navItems[role] || navItems.developer;

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
              <p className="text-xs text-slate-400 capitalize">{role || "Guest"}</p>
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
          {items.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all ${
                isActive(item.path)
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
          ))}
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;