import React, { useState, useRef, useEffect } from 'react';
import { Bell, Check, Info, AlertCircle } from 'lucide-react';

const NotificationBell = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const [notifications] = useState([
    { id: 1, type: 'success', title: 'Payment Received', message: 'You received $500 from an investor.', time: '5m ago', read: false },
    { id: 2, type: 'info', title: 'Project Update', message: 'Green Valley project reached 80%.', time: '1h ago', read: false },
  ]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setIsOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button onClick={() => setIsOpen(!isOpen)} className="relative p-2 rounded-full hover:bg-slate-100 dark:hover:bg-gray-800 transition-all">
        <Bell size={22} className="text-slate-600 dark:text-slate-300" />
        <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full border-2 border-white dark:border-gray-950"></span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-3 w-80 bg-white dark:bg-gray-900 shadow-2xl rounded-2xl border border-slate-200 dark:border-gray-800 z-50 overflow-hidden">
          <div className="p-4 border-b border-slate-100 dark:border-gray-800 font-bold dark:text-white">Notifications</div>
          <div className="max-h-60 overflow-y-auto">
            {notifications.map(n => (
              <div key={n.id} className="p-4 hover:bg-slate-50 dark:hover:bg-gray-800/50 border-b border-slate-50 dark:border-gray-800 last:border-0">
                <p className="text-sm font-semibold dark:text-white">{n.title}</p>
                <p className="text-xs text-slate-500 mt-1">{n.message}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;