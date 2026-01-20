// src/components/Header/Header.jsx
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { Bell, LogOut, Menu, X, Search } from "lucide-react";

const NotificationBell = () => {
  const [isOpen, setIsOpen] = useState(false);

  const notifications = [
    { id: 1, title: "Investment Success", message: "You invested in Project X", read: false },
    { id: 2, title: "Project Approved", message: "Your project got approved!", read: true },
  ];

  const unread = notifications.filter(n => !n.read).length;

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
      >
        <Bell size={22} />
        {unread > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1.5">
            {unread}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-3 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-xl border z-50">
          <div className="p-4 font-bold border-b">Notifications</div>
          {notifications.map(n => (
            <div key={n.id} className="p-3 border-b hover:bg-gray-100">
              <p className="font-medium">{n.title}</p>
              <p className="text-sm text-gray-600">{n.message}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const Header = () => {
  const navigate = useNavigate();
  const user = useSelector(state => state.user?.user || null);
  const isLoggedIn = !!user;
  const role = user?.role;

  return (
    <header className="bg-white dark:bg-gray-900 shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        {/* Logo */}
        <div
          className="text-xl font-bold cursor-pointer"
          onClick={() => navigate("/")}
        >
          Crowdfunding Trading
        </div>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-6">
          <Link to="/projects/browse" className="hover:text-blue-600">Browse</Link>

          {isLoggedIn ? (
            <>
              {role === "INVESTOR" && <Link to="/investor/dashboard">Dashboard</Link>}
              {role === "DEVELOPER" && <Link to="/developer/my-projects">My Projects</Link>}
              {role === "ADMIN" && <Link to="/admin/pending">Admin</Link>}
              <NotificationBell />
              <button
                onClick={() => {
                  // logout logic
                  navigate("/auth/login");
                }}
                className="flex items-center gap-2 text-red-600"
              >
                <LogOut size={18} /> Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/auth/login">Login</Link>
              <Link to="/auth/register" className="bg-blue-600 text-white px-4 py-2 rounded">
                Register
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button className="md:hidden">
          <Menu size={28} />
        </button>
      </div>
    </header>
  );
};

export default Header;