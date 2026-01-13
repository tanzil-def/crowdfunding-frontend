import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../../components/SideBar/Sidebar"; 
import PrivateHeader from "../../components/Header/PrivateHeader";

const MasterLayout = ({ role }) => {
  return (
    <div className="flex h-screen bg-[#020617] overflow-hidden text-slate-200">
      {/* Sidebar - Fixed Left */}
      <Sidebar role={role} />

      <div className="flex flex-col flex-1 min-w-0 ml-64"> 
        {/* Private Header - Fixed Top inside Content Area */}
        <PrivateHeader />

        {/* Main Content Scrollable Area */}
        <main className="flex-1 overflow-y-auto pt-24 p-8">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default MasterLayout;