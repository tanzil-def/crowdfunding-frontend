import React, { useState, useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Bell } from 'lucide-react';
import NotificationDropdown from '../Notifications/NotificationDropdown';

const NotificationBell = () => {
  const { unreadCount, notifications } = useSelector((state) => state.notifications);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-3 bg-slate-900 rounded-2xl border border-white/5 hover:border-emerald-500/30 transition-all group active:scale-95"
      >
        <Bell
          size={20}
          className={`${unreadCount > 0 ? 'text-emerald-400' : 'text-slate-400'} group-hover:text-emerald-400 transition-colors`}
        />

        {unreadCount > 0 && (
          <span className="absolute top-2 right-2 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[8px] font-black text-white shadow-lg border-2 border-slate-900">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <NotificationDropdown
          notifications={notifications}
          onClose={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

export default NotificationBell;