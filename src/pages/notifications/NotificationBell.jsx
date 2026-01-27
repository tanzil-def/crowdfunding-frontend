import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Check, Info, AlertCircle, Clock } from 'lucide-react';
import investorService from '../../api/investorService';

const NotificationBell = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    fetchNotifications();
    // Poll every 60 seconds for new notifications
    const interval = setInterval(fetchNotifications, 60000);
    return () => clearInterval(interval);
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await investorService.getNotifications();
      setNotifications(res.results || []);
    } catch (error) {
      console.error("Failed to fetch notifications", error);
    }
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setIsOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNotificationClick = async (notif) => {
    // Mark as read
    if (!notif.is_read) {
      try {
        await investorService.markNotificationRead(notif.id);
        setNotifications(prev => prev.map(n => n.id === notif.id ? { ...n, is_read: true } : n));
      } catch (err) {
        console.error("Failed to mark as read", err);
      }
    }

    // Navigate based on type
    setIsOpen(false);
    switch (notif.type) {
      case 'INVESTMENT_SUCCESS':
      case 'INVESTMENT_FAILED':
        navigate('/investor/my-investments');
        break;
      case 'PROJECT_APPROVED':
      case 'PROJECT_REJECTED':
        navigate('/investor/browse');
        break;
      case 'NEW_ACCESS_REQUEST':
        navigate('/admin/access-requests');
        break;
      default:
        navigate('/notifications');
    }
  };

  const unreadCount = notifications.filter(n => !n.is_read).length;

  const getTimeAgo = (dateStr) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) return 'just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  };

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
            <span className="text-xs text-blue-600 font-medium cursor-pointer hover:underline" onClick={fetchNotifications}>Sync</span>
          </div>
          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-slate-400">
                <Info size={32} className="mx-auto mb-2 opacity-20" />
                <p className="text-sm">No new notifications</p>
              </div>
            ) : (
              notifications.map(n => (
                <div
                  key={n.id}
                  onClick={() => handleNotificationClick(n)}
                  className={`p-4 hover:bg-slate-50 dark:hover:bg-gray-800/50 border-b border-slate-50 dark:border-gray-800 last:border-0 cursor-pointer transition-colors ${!n.is_read ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''}`}
                >
                  <div className="flex justify-between items-start gap-2">
                    <p className={`text-sm dark:text-white ${!n.is_read ? 'font-bold' : 'font-medium'}`}>
                      {n.type?.replace(/_/g, ' ')}
                    </p>
                    {!n.is_read && <span className="h-2 w-2 bg-blue-600 rounded-full flex-shrink-0 mt-1.5" />}
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">{n.message}</p>
                  <div className="flex items-center gap-1 mt-2">
                    <Clock size={10} className="text-slate-400" />
                    <p className="text-[10px] text-slate-400 font-medium">{getTimeAgo(n.created_at)}</p>
                  </div>
                </div>
              ))
            )}
          </div>
          <div className="p-3 border-t border-slate-100 dark:border-gray-800 text-center">
            <button
              onClick={() => { navigate('/notifications'); setIsOpen(false); }}
              className="text-xs text-slate-500 dark:text-slate-400 font-bold hover:text-blue-600 transition-colors"
            >
              VIEW ALL STATUS
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;