import { createBrowserRouter } from "react-router-dom";
import MasterLayout from "../pages/MasterLayout/MasterLayout";

// Pages
import Home from "../pages/Home";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import DeveloperDashboard from "../pages/developer/Dashboard";
import MyProjects from "../pages/developer/MyProjects";
import Portfolio from "../pages/investor/Portfolio";
import BuyNow from "../pages/BuyNow/BuyNow";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/dashboard",
    element: <MasterLayout />,
    children: [
      {
        index: true,
        element: <DeveloperDashboard />,
      },
      {
        path: "projects",
        element: <MyProjects />,
      },
      {
        path: "portfolio",
        element: <Portfolio />,
      },
      {
        path: "projects/:id/buynow",
        element: <BuyNow />,
      },
    ],
  },
  {
    path: "*",
    element: <div className="min-h-screen flex items-center justify-center text-white">404 - Page Not Found</div>,
  },
]);

export default router;