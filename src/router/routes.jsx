import React from "react";
import { createBrowserRouter, Outlet } from "react-router-dom";
import MasterLayout from "../pages/MasterLayout/MasterLayout";
import PublicHeader from "../components/Header/PublicHeader";

// ==========================
// PUBLIC PAGES
// ==========================
import Home from "../pages/Home";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import ForgotPassword from "../pages/auth/ForgotPassword";
import ResetPassword from "../pages/auth/ResetPassword";
import VerifyEmail from "../pages/auth/VerifyEmail";

// ==========================
// DEVELOPER PAGES
// ==========================
import DeveloperDashboard from "../pages/developer/Dashboard";
import MyProjects from "../pages/developer/MyProjects";
import CreateProject from "../pages/developer/CreateProject";
import EditProject from "../pages/developer/EditProject";
import SubmitProject from "../pages/developer/SubmitProject";
import ProjectMedia from "../pages/developer/ProjectMedia";

// ==========================
// INVESTOR PAGES
// ==========================
import InvestorDashboard from "../pages/investor/Dashboard";
import BrowseProjects from "../pages/investor/BrowseProjects";
import ProjectDetail from "../pages/investor/ProjectDetail";
import InvestPage from "../pages/investor/InvestPage";
import Portfolio from "../pages/investor/Portfolio";
import MyInvestments from "../pages/investor/MyInvestments";
import InvestmentDetail from "../pages/investor/InvestmentDetail";
import Wallet from "../pages/investor/Wallet";
import Favorites from "../pages/investor/Favorites";
import CompareProjects from "../pages/investor/CompareProjects";
import Requests from "../pages/investor/Requests";

// ==========================
// ADMIN PAGES
// ==========================
import AdminDashboard from "../pages/admin/Dashboard";
import PendingProjects from "../pages/admin/PendingProjects";
import AccessRequestsQueue from "../pages/admin/AccessRequestsQueue";
import Users from "../pages/admin/Users";
import Payments from "../pages/admin/Payments";
import AuditLogs from "../pages/admin/AuditLogs";

// ==========================
// COMMON PAGES
// ==========================
import BuyNow from "../pages/BuyNow/BuyNow";
import Account from "../pages/Account/Account";
import NotificationCenter from "../pages/notifications/NotificationCenter";

// ==========================
// PUBLIC LAYOUT
// ==========================
import Footer from "../components/Footer/Footer";

// ==========================
// PUBLIC LAYOUT
// ==========================
const PublicLayout = () => (
  <div className="flex flex-col min-h-screen">
    <PublicHeader />
    <main className="flex-1">
      <Outlet />
    </main>
    <Footer />
  </div>
);

// ==========================
// ROUTER
// ==========================
const router = createBrowserRouter([
  // -------- PUBLIC --------
  {
    path: "/",
    element: <PublicLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: "login", element: <Login /> },
      { path: "register", element: <Register /> },
      { path: "forgot-password", element: <ForgotPassword /> },
      { path: "reset-password", element: <ResetPassword /> },
      { path: "verify-email", element: <VerifyEmail /> },
    ],
  },

  // -------- DEVELOPER --------
  {
    path: "/developer",
    element: <MasterLayout role="DEVELOPER" />,
    children: [
      { index: true, element: <DeveloperDashboard /> },
      { path: "projects", element: <MyProjects /> },
      { path: "projects/new", element: <CreateProject /> },
      { path: "projects/:id/edit", element: <EditProject /> },
      { path: "projects/:id/submit", element: <SubmitProject /> },
      { path: "projects/:id/media", element: <ProjectMedia /> },
    ],
  },

  // -------- INVESTOR --------
  {
    path: "/investor",
    element: <MasterLayout role="INVESTOR" />,
    children: [
      { index: true, element: <InvestorDashboard /> },
      { path: "browse", element: <BrowseProjects /> },
      { path: "projects/:id", element: <ProjectDetail /> },
      { path: "projects/:id/invest", element: <InvestPage /> },
      { path: "projects/:id/buynow", element: <BuyNow /> },
      { path: "portfolio", element: <Portfolio /> },
      { path: "investments", element: <MyInvestments /> },
      { path: "investments/:id", element: <InvestmentDetail /> },
      { path: "wallet", element: <Wallet /> },
      { path: "favorites", element: <Favorites /> },
      { path: "compare", element: <CompareProjects /> },
      { path: "requests", element: <Requests /> },
    ],
  },

  // -------- ADMIN --------
  {
    path: "/admin",
    element: <MasterLayout role="ADMIN" />,
    children: [
      { index: true, element: <AdminDashboard /> },
      { path: "pending-projects", element: <PendingProjects /> },
      { path: "access-requests", element: <AccessRequestsQueue /> },
      { path: "users", element: <Users /> },
      { path: "payments", element: <Payments /> },
      { path: "audit-logs", element: <AuditLogs /> },
    ],
  },

  // -------- COMMON AUTH --------
  {
    path: "/account",
    element: <MasterLayout />,
    children: [{ index: true, element: <Account /> }],
  },
  {
    path: "/notifications",
    element: <MasterLayout />,
    children: [{ index: true, element: <NotificationCenter /> }],
  },
], {
  future: {
    v7_startTransition: true,
    v7_relativeSplatPath: true,
    v7_fetcherPersist: true,
    v7_normalizeFormMethod: true,
    v7_partialHydration: true,
    v7_skipActionErrorRevalidation: true,
  },
});

export default router;
