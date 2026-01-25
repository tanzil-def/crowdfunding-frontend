import React, { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Bell } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { markRead, setNotifications, markAllRead as markAllReadAction } from '../../store/slices/notificationSlice';
import notificationService from '../../api/notificationService';
import { getNotificationIcon, getTimeAgo, getNotificationRoute } from '../../utils/notificationUtils';
import { toast } from 'react-hot-toast';

const NotificationBell = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { notifications, unreadCount } = useSelector((state) => state.notifications);
  const user = useSelector((state) => state.user.user);

  // Fetch notifications on mount
  useEffect(() => {
    fetchNotifications();

    // Click outside to close
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchNotifications = async () => {
    try {
      const data = await notificationService.getNotifications();
      dispatch(setNotifications(data.results || []));
    } catch (err) {
      console.error('Failed to fetch notifications:', err);
    }
  };

  // derived state: sorted (newest first) and sliced (max 4)
  const displayNotifications = [...notifications]
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, 4);

  const handleNotificationClick = async (notification) => {
    // 1. Mark as read immediately in UI and Backend
    if (!notification.is_read) {
      try {
        await notificationService.markNotificationRead(notification.id);
        dispatch(markRead(notification.id));
      } catch (err) {
        console.error('Failed to mark read:', err);
      }
    }

    // 2. Navigate based on type
    setIsOpen(false);

    try {
      const route = getNotificationRoute(notification, user?.role || 'investor');
      navigate(route);
    } catch (error) {
      console.error("Error determining notification route:", error);
      // Fallback navigation
      navigate(`/${user?.role?.toLowerCase() || 'investor'}/notifications`);
    }
  };

  const markAllRead = async () => {
    if (unreadCount === 0) return;

    try {
      await notificationService.markAllNotificationsAsRead();
      dispatch(markAllReadAction());
      toast.success("All marked as read");
    } catch (error) {
      console.error("Failed to mark all read:", error);
      toast.error("Failed to mark all as read");
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-full hover:bg-slate-800/50 transition-all group"
      >
        <Bell size={22} className="text-slate-300 group-hover:text-emerald-400 transition-colors" />

        {/* Unread Badge */}
        {unreadCount > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-slate-900 shadow-lg shadow-red-500/50"
          >
            {unreadCount > 9 ? '9+' : unreadCount}
          </motion.span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-3 w-96 bg-slate-900 border border-slate-700/50 rounded-2xl shadow-2xl z-50 overflow-hidden backdrop-blur-xl"
          >
            {/* Header */}
            <div className="p-4 border-b border-slate-700/50 flex items-center justify-between bg-slate-800/50">
              <div className="flex items-center gap-2">
                <Bell size={18} className="text-emerald-400" />
                <h2 className="font-bold text-white">Notifications</h2>
                {unreadCount > 0 && (
                  <span className="text-xs bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full font-semibold">
                    {unreadCount} new
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <button
                    onClick={markAllRead}
                    className="text-xs text-slate-400 hover:text-emerald-400 transition-colors"
                  >
                    Mark all read
                  </button>
                )}
              </div>
            </div>

            {/* Notifications List */}
            <div className="max-h-[480px] overflow-y-auto custom-scrollbar">
              {notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-12 text-slate-500 text-center">
                  <Bell size={48} className="mb-4 opacity-20" />
                  <p className="font-medium text-white">No notifications yet</p>
                  <p className="text-xs mt-1">We'll alert you when something happens</p>
                </div>
              ) : (
                <div className="divide-y divide-slate-700/30">
                  {displayNotifications.map((notification) => (
                    <motion.div
                      key={notification.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      onClick={() => handleNotificationClick(notification)}
                      className={`p-4 hover:bg-slate-800/50 transition-all cursor-pointer relative group ${!notification.is_read ? 'bg-slate-800' : ''
                        }`}
                    >
                      {/* Unread Indicator Bar */}
                      {!notification.is_read && (
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-500" />
                      )}

                      <div className="flex gap-3">
                        <div className="mt-1 flex-shrink-0 text-xl">
                          {getNotificationIcon(notification.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          {notification.title && (
                            <p className="text-sm font-semibold mb-1 text-white">
                              {notification.title}
                            </p>
                          )}
                          <p className={`text-sm ${!notification.is_read ? 'text-slate-200 font-medium' : 'text-slate-400'
                            }`}>
                            {notification.message}
                          </p>
                          <div className="flex items-center gap-2 mt-2 text-[10px] text-slate-500 uppercase tracking-wider">
                            <span>{getTimeAgo(notification.created_at)}</span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-3 bg-slate-800/50 border-t border-slate-700/50 flex items-center justify-between">
              <button
                onClick={fetchNotifications}
                className="text-xs font-bold text-slate-400 hover:text-white transition-colors"
              >
                Refresh
              </button>

              {notifications.length > 0 && (
                <button
                  onClick={() => {
                    setIsOpen(false);
                    navigate(`/${user?.role?.toLowerCase() || 'investor'}/notifications`);
                  }}
                  className="text-xs font-bold text-emerald-400 hover:text-emerald-300 transition-colors"
                >
                  View All
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(15, 23, 42, 0.3);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(16, 185, 129, 0.3);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(16, 185, 129, 0.5);
        }
      `}</style>
    </div>
  );
};

export default NotificationBell;