import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, FolderKanban, PlusCircle, 
  Key, Bell, LogOut 
} from 'lucide-react';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  const menuItems = [
    { name: 'Overview', icon: LayoutDashboard, path: '/dashboard' },
    { name: 'My Projects', icon: FolderKanban, path: '/dashboard/projects' },
    { name: 'Add New Project', icon: PlusCircle, path: '/dashboard/projects/new' },
    { name: 'Access Requests', icon: Key, path: '/dashboard/requests' },
    { name: 'Notifications', icon: Bell, path: '/dashboard/notifications' },
  ];

  return (
    <aside className="w-64 h-screen bg-slate-950 border-r border-slate-800 flex flex-col fixed left-0 top-0 z-50">
      {/* Clickable Logo Area → Goes to Home */}
      <div 
        className="p-6 border-b border-slate-800 cursor-pointer hover:bg-slate-800/50 transition-colors"
        onClick={() => navigate('/')}
      >
        <h2 className="text-2xl font-black text-white tracking-tight">
          Crowd<span className="text-emerald-500">Castle</span>
        </h2>
        <p className="text-xs text-slate-500 mt-1 font-medium">Developer Panel</p>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {menuItems.map((item) => {
          const isActive = currentPath === item.path || currentPath.startsWith(item.path + '/');
          return (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors font-medium ${
                isActive 
                  ? 'bg-emerald-600/20 text-emerald-400' 
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <item.icon size={20} />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-800 mt-auto">
        <button className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-red-600/10 text-red-400 rounded-xl hover:bg-red-600 hover:text-white transition-colors font-medium">
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;