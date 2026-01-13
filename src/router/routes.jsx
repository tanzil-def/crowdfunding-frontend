import React from "react";
import { createBrowserRouter, Outlet, Navigate } from "react-router-dom";

// Layouts
import MasterLayout from "../pages/MasterLayout/MasterLayout";
import PublicHeader from "../components/Header/PublicHeader";

// Pages
import Home from "../pages/Home";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import ForgotPassword from "../pages/auth/ForgotPassword";      // ← নতুন যোগ করা
import DeveloperDashboard from "../pages/developer/Dashboard";
import MyProjects from "../pages/developer/MyProjects";
import CreateProject from "../pages/developer/CreateProject";
import EditProject from "../pages/developer/EditProject";
import Account from "../pages/Account/Account";
import NotificationCenter from "../pages/notifications/NotificationCenter";
import Portfolio from "../pages/investor/Portfolio";
import BuyNow from "../pages/BuyNow/BuyNow";
import PendingProjects from "../pages/admin/PendingProjects";
import AccessRequestsQueue from "../pages/admin/AccessRequestsQueue";

// Public Layout Wrapper
const PublicLayout = () => (
  <div className="min-h-screen bg-[#020617] selection:bg-emerald-500/30">
    <PublicHeader />
    <Outlet />
  </div>
);

const router = createBrowserRouter([
  // Redirect /dashboard to /developer
  {
    path: "/dashboard",
    element: <Navigate to="/developer" replace />,
  },

  // Public Routes (এখানে Forgot Password যোগ করা হলো)
  {
    path: "/",
    element: <PublicLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: "login", element: <Login /> },
      { path: "register", element: <Register /> },
      { path: "forgot-password", element: <ForgotPassword /> },   // ← এই লাইনটা যোগ করো
    ],
  },

  // Developer Routes
  {
    path: "/developer",
    element: <MasterLayout role="developer" />,
    children: [
      { index: true, element: <DeveloperDashboard /> },
      { path: "projects", element: <MyProjects /> },
      { path: "projects/new", element: <CreateProject /> },
      { path: "projects/:id/edit", element: <EditProject /> },
      { path: "notifications", element: <NotificationCenter /> },
      { path: "account", element: <Account /> },
    ],
  },

  // Investor Routes
  {
    path: "/investor",
    element: <MasterLayout role="investor" />,
    children: [
      { index: true, element: <Portfolio /> },
      { path: "portfolio", element: <Portfolio /> },
      { path: "projects/:id/buynow", element: <BuyNow /> },
      { path: "notifications", element: <NotificationCenter /> },
      { path: "account", element: <Account /> },
    ],
  },

  // Admin Routes
  {
    path: "/admin",
    element: <MasterLayout role="admin" />,
    children: [
      { index: true, element: <PendingProjects /> },
      { path: "pending-projects", element: <PendingProjects /> },
      { path: "access-requests", element: <AccessRequestsQueue /> },
      { path: "account", element: <Account /> },
    ],
  },

  // 404 Page
  {
    path: "*",
    element: (
      <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-center text-white p-4">
        <h1 className="text-9xl font-black text-emerald-500/10">404</h1>
        <h2 className="text-3xl font-bold -mt-10 mb-4">Oops! Page not found</h2>
        <button
          onClick={() => window.history.back()}
          className="px-8 py-3 bg-emerald-600 rounded-xl font-bold"
        >
          Go Back
        </button>
      </div>
    ),
  },
]);

export default router;