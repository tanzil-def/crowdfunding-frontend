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
import { useEffect, useRef } from "react";
import { toast } from "react-hot-toast";

const MasterLayout = ({ role: requiredRole }) => {
  const { user, isAuthenticated } = useSelector((state) => state.user);
  const { pendingProjectsCount } = useSelector((state) => state.admin || { pendingProjectsCount: 0 });
  const dispatch = useDispatch();
  const previousCountRef = useRef(pendingProjectsCount);

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
          // You can call dashboard summary or specific pending endpoints
          const res = await adminService.getDashboardSummary();
          const summary = res.data || res;
          dispatch(setPendingProjectsCount(summary.pending_projects || 0));
        } catch (err) {
          console.error("Polling error:", err);
        }
      };

      fetchCounts();
      const interval = setInterval(fetchCounts, 30000); // Poll every 30 seconds
      return () => clearInterval(interval);
    }
  }, [isAuthenticated, user?.role, dispatch]);

  // Notification Polling for all authenticated users
  const { unreadCount } = useSelector((state) => state.notifications || { unreadCount: 0 });
  const previousUnreadRef = useRef(unreadCount);

  useEffect(() => {
    if (isAuthenticated) {
      const fetchNotifications = async () => {
        try {
          const res = await developerService.getNotifications();
          const data = res.data || res;
          const notificationsList = data.results || [];
          dispatch(setNotifications(notificationsList));

          // Show toast for new notifications
          const currentUnread = notificationsList.filter(n => !n.is_read).length;
          if (currentUnread > previousUnreadRef.current) {
            const newLatest = notificationsList.find(n => !n.is_read);
            if (newLatest) {
              toast.success(newLatest.message, {
                icon: '🔔',
                duration: 5000,
              });
            }
          }
          previousUnreadRef.current = currentUnread;
        } catch (err) {
          console.error("Notification polling error:", err);
        }
      };

      fetchNotifications();
      const interval = setInterval(fetchNotifications, 60000); // Poll every 60 seconds
      return () => clearInterval(interval);
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