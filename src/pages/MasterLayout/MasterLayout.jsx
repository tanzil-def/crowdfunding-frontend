import React from "react";
import { Outlet, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Sidebar from "../../components/SideBar/Sidebar.jsx";
import PrivateHeader from "../../components/Header/PrivateHeader";
import { useDispatch } from "react-redux";
import adminService from "../../api/adminService";
import developerService from "../../api/developerService";
import { setPendingProjectsCount } from "../../store/slices/adminSlice";
import { setNotifications } from "../../store/slices/notificationSlice";
import { useNotificationWebSocket } from "../../hooks/useNotificationWebSocket";
import { useEffect, useRef } from "react";
import { toast } from "react-hot-toast";

const MasterLayout = ({ role: requiredRole }) => {
  const { user, isAuthenticated } = useSelector((state) => state.user);
  const { pendingProjectsCount } = useSelector((state) => state.admin || { pendingProjectsCount: 0 });
  const dispatch = useDispatch();
  const previousCountRef = useRef(pendingProjectsCount);

  // ✅ Initialize WebSocket for real-time notifications
  useNotificationWebSocket(user);

  useEffect(() => {
    if (isAuthenticated && user?.role === "ADMIN") {
      if (pendingProjectsCount > previousCountRef.current) {
        toast.success(`New pending projects awaiting review!`, {
          icon: '🚀',
          duration: 5000,
        });
      }
      previousCountRef.current = pendingProjectsCount;
    }
  }, [pendingProjectsCount, isAuthenticated, user?.role]);

  useEffect(() => {
    if (isAuthenticated && user?.role === "ADMIN") {
      const fetchCounts = async () => {
        try {
          // Fetch pending projects from the dedicated endpoint
          const data = await adminService.getPendingProjects();
          const projects = data.results || data || [];
          const count = Array.isArray(projects) ? projects.length : 0;
          dispatch(setPendingProjectsCount(count));
        } catch (err) {
          // Professionally handle polling errors without console spam
          if (err.response?.status !== 404 && err.response?.status !== 401) {
            console.debug("Admin polling background sync deferred.");
          }
        }
      };

      fetchCounts();
      const interval = setInterval(fetchCounts, 45000); // Poll every 45 seconds (slightly reduced frequency)
      return () => clearInterval(interval);
    }
  }, [isAuthenticated, user?.role, dispatch]);

  // Fetch initial notifications once on mount
  useEffect(() => {
    if (isAuthenticated) {
      const loadInitial = async () => {
        try {
          const data = await developerService.getNotifications();
          dispatch(setNotifications(data.results || data));
        } catch (err) {
          console.debug("Initial notification sync deferred.");
        }
      };
      loadInitial();
    }
  }, [isAuthenticated, dispatch]);

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