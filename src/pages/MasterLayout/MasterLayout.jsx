import React, { useEffect, useRef } from "react";
import { Outlet, Navigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import Sidebar from "../../components/SideBar/Sidebar.jsx";
import PrivateHeader from "../../components/Header/PrivateHeader";
import adminService from "../../api/adminService";
import developerService from "../../api/developerService";
import { setPendingProjectsCount } from "../../store/slices/adminSlice";
import { setNotifications } from "../../store/slices/notificationSlice";
import { toast } from "react-hot-toast";

const MasterLayout = ({ role: requiredRole }) => {
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector((state) => state.user);
  const { pendingProjectsCount } = useSelector((state) => state.admin || { pendingProjectsCount: 0 });

  const previousCountRef = useRef(pendingProjectsCount);
  const hasLoadedInitialRef = useRef(false);

  // 1. New Pending Project Toast (Admin only)
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

  // 2. Poll Pending Projects Count (Admin only)
  useEffect(() => {
    if (isAuthenticated && user?.role === "ADMIN") {
      const fetchCounts = async () => {
        try {
          const data = await adminService.getPendingProjects();
          const projects = data.results || data || [];
          const count = Array.isArray(projects) ? projects.length : 0;
          dispatch(setPendingProjectsCount(count));
        } catch (err) {
          console.debug("Admin sync deferred.");
        }
      };

      fetchCounts();
      const interval = setInterval(fetchCounts, 60000);
      return () => clearInterval(interval);
    }
  }, [isAuthenticated, user?.role, dispatch]);

  // 3. Initial Notifications Load (Once per session)
  useEffect(() => {
    if (isAuthenticated && !hasLoadedInitialRef.current) {
      const loadInitial = async () => {
        try {
          const data = await developerService.getNotifications();
          dispatch(setNotifications(data.results || data));
          hasLoadedInitialRef.current = true;
        } catch (err) {
          console.debug("Notification sync deferred.");
        }
      };
      loadInitial();
    }
  }, [isAuthenticated, dispatch]);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && user?.role !== requiredRole) {
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