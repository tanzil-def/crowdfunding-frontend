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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 w-full">
          {/* Logo - Far Left */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="text-xl font-bold text-gray-900 dark:text-white whitespace-nowrap">
              Crowdfunding Trading
            </Link>
          </div>

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
      </div>
    </header>
  );
};

export default PublicHeader;