import React from "react";
import { NavLink } from "react-router-dom";

const Sidebar = ({ role }) => {
  const common = [
    { name: "Dashboard", to: "" },
    { name: "Notifications", to: "notifications" },
    { name: "Account", to: "account" },
  ];

  const developer = [
    { name: "My Projects", to: "projects" },
    { name: "Create Project", to: "projects/new" },
  ];

  const admin = [
    { name: "Project Reviews", to: "pending-projects" },
    { name: "Access Requests", to: "access-requests" },
    { name: "Transactions", to: "transactions" },
    { name: "Users", to: "users" },
  ];

  const investor = [{ name: "Portfolio", to: "portfolio" }];

  let roleMenus = [];
  if (role === "DEVELOPER") roleMenus = developer;
  if (role === "ADMIN") roleMenus = admin;
  if (role === "INVESTOR") roleMenus = investor;

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-slate-900 border-r border-slate-800">
      <div className="p-6 text-xl font-black text-white">CrowdTrade Pro</div>

      <nav className="px-4 space-y-2">
        {common.map((item) => (
          <NavLink
            key={item.name}
            to={item.to}
            end
            className={({ isActive }) =>
              `block px-4 py-3 rounded-xl text-sm font-semibold ${
                isActive
                  ? "bg-emerald-600 text-white"
                  : "text-slate-400 hover:bg-slate-800"
              }`
            }
          >
            {item.name}
          </NavLink>
        ))}

        <div className="mt-6 px-4 text-xs text-slate-500 uppercase">
          {role}
        </div>

        {roleMenus.map((item) => (
          <NavLink
            key={item.name}
            to={item.to}
            className={({ isActive }) =>
              `block px-4 py-3 rounded-xl text-sm font-semibold ${
                isActive
                  ? "bg-emerald-600 text-white"
                  : "text-slate-400 hover:bg-slate-800"
              }`
            }
          >
            {item.name}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
