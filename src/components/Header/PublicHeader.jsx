import React from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../store/slices/userSlice";
import authService from "../../api/authService";
import NotificationBell from "./NotificationBell";

const PublicHeader = () => {
  const { isAuthenticated, user } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const handleLogout = async () => {
    await authService.logout();
    dispatch(logout());
  };

  const getDashboardLink = () => {
    if (!user) return "/";
    const role = user.role;
    if (role === "ADMIN") return "/admin";
    if (role === "DEVELOPER") return "/developer";
    if (role === "INVESTOR") return "/investor";
    return "/";
  };

  return (
    <header className="bg-white dark:bg-gray-800 shadow sticky top-0 z-50">
      <div className="w-full px-6 md:px-12 flex justify-between items-center h-20">
        {/* Logo - Far Left */}
        <Link to="/" className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-emerald-600 to-emerald-400 bg-clip-text text-transparent whitespace-nowrap">
          Crowdfunding Trading
        </Link>

        {/* Auth Buttons - Far Right */}
        <div className="flex items-center justify-end gap-4 ml-auto">
          {isAuthenticated ? (
            <>
              <Link
                to={getDashboardLink()}
                className="text-gray-700 dark:text-gray-300 hover:text-gray-900 font-medium whitespace-nowrap"
              >
                Dashboard
              </Link>
              <NotificationBell />
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded text-sm font-bold transition-colors whitespace-nowrap"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-gray-700 dark:text-gray-300 hover:text-gray-900 font-medium whitespace-nowrap">
                Login
              </Link>
              <Link
                to="/register"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm font-bold transition-colors whitespace-nowrap"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default PublicHeader;