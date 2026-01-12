import { Outlet, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import Sidebar from "../../components/SideBar/Sidebar";
import PrivateHeader from "../../components/Header/PrivateHeader";

const MasterLayout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      navigate("/login");
    }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-slate-950 text-white flex overflow-hidden">
      {/* Fixed Sidebar */}
      <Sidebar />

      {/* Main content area - push right by sidebar width */}
      <div className="flex-1 flex flex-col ml-64">
        {/* Fixed top header */}
        <PrivateHeader />

        {/* Scrollable main content */}
        <main className="flex-1 overflow-y-auto p-6 lg:p-10">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MasterLayout;