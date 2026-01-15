import React from "react";
import { Outlet, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Sidebar from "../../components/SideBar/Sidebar.jsx";
import PrivateHeader from "../../components/Header/PrivateHeader";

const MasterLayout = ({ role: requiredRole }) => {
  const { user, isAuthenticated } = useSelector((state) => state.user);

  // 1. Check Authentication
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // 2. Check Role (if route requires a specific role)
  // We assume role names are stored as uppercase string e.g., 'ADMIN', 'DEVELOPER', 'INVESTOR'
  if (requiredRole && user?.role !== requiredRole) {
    // If user has a different role, maybe redirect them to their own dashboard
    // For now, let's send them to login or home to avoid infinite loops
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex min-h-screen bg-slate-950">
      <Sidebar role={user?.role} />

      <div className="flex-1 flex flex-col transition-all duration-300 pl-64">
        <PrivateHeader />

        <main className="flex-1 pt-20 p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MasterLayout;