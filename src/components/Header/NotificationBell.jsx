import React, { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Bell, Check, X, Clock, CheckCircle, AlertCircle, DollarSign, Lock, Unlock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { markRead, setNotifications } from '../../store/slices/notificationSlice';
import { useNotificationWebSocket } from '../../hooks/useNotificationWebSocket';
import investorService from '../../api/investorService';
import developerService from '../../api/developerService';
import { toast } from 'react-hot-toast';

const NotificationBell = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { notifications, unreadCount, wsConnected } = useSelector((state) => state.notifications);
  const user = useSelector((state) => state.user.user);

  // Initialize WebSocket connection
  useNotificationWebSocket(user);

  useEffect(() => {
    // Fetch initial notifications
    fetchNotifications();

    // Click outside to close
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchNotifications = async () => {
    try {
      const service = user?.role === 'DEVELOPER' ? developerService : investorService;
      const res = await service.getNotifications();
      const data = res.data || res;
      dispatch(setNotifications(data.results || []));
    } catch (err) {
      console.error('Failed to fetch notifications:', err);
    }
  };

  // Mark all unread notifications as read when opening dropdown
  const handleBellClick = async () => {
    const newIsOpen = !isOpen;
    setIsOpen(newIsOpen);

    // If opening the dropdown and there are unread notifications, mark them all as read
    if (newIsOpen && unreadCount > 0) {
      const unreadNotifications = notifications.filter(n => !n.is_read);

      try {
        const service = user?.role === 'DEVELOPER' ? developerService : investorService;

        // Mark all unread as read in parallel
        await Promise.all(
          unreadNotifications.map(notification =>
            service.markNotificationRead(notification.id)
              .then(() => dispatch(markRead(notification.id)))
              .catch(err => console.error(`Failed to mark notification ${notification.id} as read:`, err))
          )
        );
      } catch (err) {
        console.error('Failed to mark notifications as read:', err);
      }
    }
  };

  const handleNotificationClick = async (notification) => {
    // Navigate based on notification type and metadata
    const { type, metadata } = notification;
    const role = user?.role?.toLowerCase() || 'investor';

    // Close dropdown first for immediate feedback
    setIsOpen(false);

    // Determine navigation path based on notification type
    let navigationPath = null;

    if (type.includes('PROJECT')) {
      if (metadata?.project_id) {
        // For developers, go to their project detail page
        // For investors/admins, go to project view page
        if (role === 'developer') {
          navigationPath = `/developer/projects/${metadata.project_id}`;
        } else if (role === 'admin') {
          navigationPath = `/admin/projects/${metadata.project_id}`;
        } else {
          navigationPath = `/investor/projects/${metadata.project_id}`;
        }
      } else {
        // Fallback to projects list
        navigationPath = `/${role}/projects`;
      }
    } else if (type.includes('PAYMENT') || type.includes('INVESTMENT')) {
      if (metadata?.investment_id) {
        navigationPath = `/investor/investments/${metadata.investment_id}`;
      } else {
        navigationPath = `/investor/investments`;
      }
    } else if (type.includes('ACCESS')) {
      if (metadata?.project_id) {
        navigationPath = `/investor/projects/${metadata.project_id}`;
      } else if (metadata?.access_request_id) {
        navigationPath = `/investor/requests`;
      } else {
        navigationPath = `/${role}/dashboard`;
      }
    } else {
      // Default fallback to dashboard
      navigationPath = `/${role}/dashboard`;
    }

    // Navigate to the determined path
    if (navigationPath) {
      navigate(navigationPath);
    }
  };

  const getNotificationIcon = (type) => {
    const iconMap = {
      PROJECT_APPROVED: <CheckCircle className="text-emerald-400" size={18} />,
      PROJECT_REJECTED: <X className="text-red-400" size={18} />,
      PROJECT_SUBMITTED: <Bell className="text-blue-400" size={18} />,
      PROJECT_CHANGES_REQUESTED: <AlertCircle className="text-yellow-400" size={18} />,
      PAYMENT_SUCCESS: <DollarSign className="text-emerald-400" size={18} />,
      PAYMENT_FAILED: <AlertCircle className="text-red-400" size={18} />,
      PAYMENT_PENDING: <Clock className="text-yellow-400" size={18} />,
      ACCESS_APPROVED: <Unlock className="text-emerald-400" size={18} />,
      ACCESS_REJECTED: <Lock className="text-red-400" size={18} />,
      ACCESS_REQUESTED: <Lock className="text-blue-400" size={18} />,
      ACCESS_REVOKED: <Lock className="text-orange-400" size={18} />,
    };
    return iconMap[type] || <Bell className="text-blue-400" size={18} />;
  };

  const getTimeAgo = (dateString) => {
    const now = new Date();
    const past = new Date(dateString);
    const diffMs = now - past;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={handleBellClick}
        className="relative p-2 rounded-full hover:bg-slate-800/50 transition-all group"
      >
        <Bell size={22} className="text-slate-300 group-hover:text-emerald-400 transition-colors" />

        {/* Unread Badge */}
        {unreadCount > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 h-5 w-5 bg-emerald-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-slate-900"
          >
            {unreadCount > 9 ? '9+' : unreadCount}
          </motion.span>
        )}

        {/* WebSocket Connection Indicator */}
        <span
          className={`absolute bottom-0 right-0 h-2 w-2 rounded-full border-2 border-slate-900 ${wsConnected ? 'bg-emerald-500' : 'bg-slate-500'
            }`}
          title={wsConnected ? 'Connected' : 'Disconnected'}
        />
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
              <button
                onClick={() => setIsOpen(false)}
                className="text-slate-400 hover:text-white transition-colors p-1 hover:bg-slate-700 rounded-lg"
              >
                <X size={18} />
              </button>
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
                  {notifications.map((notification) => (
                    <motion.div
                      key={notification.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      onClick={() => handleNotificationClick(notification)}
                      className={`p-4 hover:bg-slate-800/50 transition-all cursor-pointer relative group ${!notification.is_read ? 'bg-emerald-500/[0.03]' : ''
                        }`}
                    >
                      {/* Unread Indicator */}
                      {!notification.is_read && (
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-500" />
                      )}

                      <div className="flex gap-3">
                        <div className="mt-1 flex-shrink-0">
                          {getNotificationIcon(notification.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          {notification.title && (
                            <p className={`text-sm font-semibold mb-1 ${!notification.is_read ? 'text-white' : 'text-slate-300'
                              }`}>
                              {notification.title}
                            </p>
                          )}
                          <p className={`text-sm ${!notification.is_read ? 'text-slate-300' : 'text-slate-400'
                            }`}>
                            {notification.message}
                          </p>
                          <div className="flex items-center gap-2 mt-2 text-[10px] text-slate-500 uppercase tracking-wider">
                            <Clock size={10} />
                            {getTimeAgo(notification.created_at)}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {notifications.length > 0 && (
              <div className="p-3 bg-slate-800/50 border-t border-slate-700/50 flex items-center justify-center">
                <button
                  onClick={() => {
                    setIsOpen(false);
                    navigate(`/${user.role.toLowerCase()}/notifications`);
                  }}
                  className="text-xs font-bold text-emerald-400 hover:text-emerald-300 transition-colors"
                >
                  View All Notifications
                </button>
              </div>
            )}
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