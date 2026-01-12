import React, { useState, useRef, useEffect } from 'react';
import { Bell, Check, Info, AlertCircle } from 'lucide-react';

const NotificationBell = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const [notifications] = useState([
    { id: 1, type: 'success', title: 'Investment Successful', message: 'Your $5,000 investment confirmed.', time: '2h ago', read: false },
    { id: 2, type: 'info', title: 'New Project', message: 'Luxe Tower is now open for funding.', time: '1d ago', read: false },
  ]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setIsOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="relative" ref={dropdownRef}>
      <button onClick={() => setIsOpen(!isOpen)} className="relative p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-gray-800 transition-all">
        <Bell size={22} className="text-slate-600 dark:text-slate-300" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 h-4 w-4 bg-red-500 border-2 border-white dark:border-gray-900 rounded-full flex items-center justify-center text-[10px] text-white">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-3 w-80 bg-white dark:bg-gray-900 shadow-2xl rounded-2xl border border-slate-200 dark:border-gray-800 z-50 overflow-hidden animate-in fade-in zoom-in duration-200">
          <div className="p-4 border-b border-slate-100 dark:border-gray-800 flex justify-between items-center">
            <h4 className="font-bold dark:text-white">Notifications</h4>
            <span className="text-xs text-blue-600 font-medium cursor-pointer">Mark all as read</span>
          </div>
          <div className="max-h-80 overflow-y-auto">
            {notifications.map(n => (
              <div key={n.id} className="p-4 hover:bg-slate-50 dark:hover:bg-gray-800/50 border-b border-slate-50 dark:border-gray-800 last:border-0 cursor-pointer">
                <p className="text-sm font-bold dark:text-white">{n.title}</p>
                <p className="text-xs text-slate-500 mt-1">{n.message}</p>
                <p className="text-[10px] text-slate-400 mt-2">{n.time}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;