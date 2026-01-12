import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = () => {
  const menus = [
    { name: 'Overview', icon: '📊', link: '/dashboard/developer' },
    { name: 'My Projects', icon: '🏗️', link: '/dashboard/developer/projects' },
    { name: 'Add New Project', icon: '➕', link: '/dashboard/developer/add-project' },
    { name: 'Access Requests', icon: '🔑', link: '/dashboard/developer/requests' },
    { name: 'Notifications', icon: '🔔', link: '/dashboard/developer/notifications' },
  ];

  return (
    <div className="w-64 h-screen bg-slate-900 border-r border-slate-800 p-6 fixed left-0 top-0">
      <div className="mb-10 text-emerald-500 font-bold text-2xl tracking-tighter">
        CROWD CASTLE <span className="text-white text-xs block text-right">DEV PANEL</span>
      </div>
      <nav className="space-y-2">
        {menus.map((menu) => (
          <Link
            key={menu.name}
            to={menu.link}
            className="flex items-center gap-3 text-slate-400 hover:text-white hover:bg-white/5 p-3 rounded-xl transition-all font-medium"
          >
            <span>{menu.icon}</span>
            {menu.name}
          </Link>
        ))}
      </nav>
      <div className="absolute bottom-10 left-6 right-6">
         <button className="w-full p-3 bg-red-500/10 text-red-500 rounded-xl font-bold hover:bg-red-500 hover:text-white transition-all">
           Logout
         </button>
      </div>
    </div>
  );
};

export default Sidebar;