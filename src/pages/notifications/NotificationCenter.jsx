import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Bell, Check, Loader2, RefreshCw, Trash2 } from 'lucide-react';
import { setNotifications, markRead, markAllRead } from '../../store/slices/notificationSlice';
import notificationService from '../../api/notificationService';
import {
  getNotificationIcon,
  getNotificationColor,
  getTimeAgo,
  getNotificationRoute,
  groupNotificationsByDate
} from '../../utils/notificationUtils';
import { toast } from 'react-hot-toast';

const NotificationCenter = () => {
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { notifications } = useSelector((state) => state.notifications);
  const user = useSelector((state) => state.user?.user);

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    try {
      setLoading(true);
      const data = await notificationService.fetchNotifications();
      const notificationList = data.results || data;
      dispatch(setNotifications(notificationList));
    } catch (error) {
      console.error('Failed to load notifications:', error);
      toast.error('Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    try {
      setRefreshing(true);
      await loadNotifications();
      toast.success('Notifications refreshed');
    } catch (error) {
      toast.error('Failed to refresh');
    } finally {
      setRefreshing(false);
    }
  };

  const handleNotificationClick = async (notification) => {
    try {
      if (!notification.is_read) {
        await notificationService.markNotificationAsRead(notification.id);
        dispatch(markRead(notification.id));
      }

      const route = getNotificationRoute(notification, user?.role || 'investor');
      navigate(route);
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
      toast.error('Failed to update notification');
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await notificationService.markAllNotificationsAsRead();
      dispatch(markAllRead());
      toast.success('All notifications marked as read');
    } catch (error) {
      toast.error('Failed to mark all as read');
    }
  };

  // Group notifications by date
  const groupedNotifications = groupNotificationsByDate(notifications);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-12 h-12 text-cyan-400 animate-spin" />
          <p className="text-slate-400">Loading notifications...</p>
        </div>
      </div>
    );
  }

  const NotificationGroup = ({ title, items }) => {
    if (items.length === 0) return null;

    return (
      <div className="mb-8">
        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 px-4">
          {title}
        </h3>
        <div className="space-y-2">
          {items.map((notification, index) => {
            const color = getNotificationColor(notification.type);
            const icon = getNotificationIcon(notification.type);

            return (
              <motion.div
                key={notification.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.03 }}
                onClick={() => handleNotificationClick(notification)}
                className={`
                  group relative cursor-pointer
                  ${notification.is_read
                    ? 'bg-slate-900/30 hover:bg-slate-800/40'
                    : 'bg-slate-800/50 hover:bg-slate-800/70'
                  }
                  backdrop-blur-xl rounded-2xl border border-slate-700/30
                  p-5 transition-all duration-300
                `}
              >
                {/* Unread Indicator Line */}
                {!notification.is_read && (
                  <div className={`
                    absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl
                    ${color === 'emerald' ? 'bg-gradient-to-b from-emerald-500 to-teal-500' : ''}
                    ${color === 'red' ? 'bg-gradient-to-b from-rose-500 to-red-500' : ''}
                    ${color === 'yellow' ? 'bg-gradient-to-b from-amber-500 to-orange-500' : ''}
                    ${color === 'blue' ? 'bg-gradient-to-b from-cyan-500 to-blue-500' : ''}
                  `} />
                )}

                <div className="flex gap-4">
                  {/* Icon */}
                  <div className={`
                    flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center
                    ${color === 'emerald' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : ''}
                    ${color === 'red' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' : ''}
                    ${color === 'yellow' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : ''}
                    ${color === 'blue' ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20' : ''}
                  `}>
                    <span className="text-2xl">{icon}</span>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <h4 className={`
                        font-bold text-base leading-tight
                        ${notification.is_read ? 'text-slate-300' : 'text-white'}
                      `}>
                        {notification.title || notification.type.replace(/_/g, ' ')}
                      </h4>

                      {!notification.is_read && (
                        <div className="flex-shrink-0 w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-lg shadow-cyan-400/50 mt-1" />
                      )}
                    </div>

                    <p className="text-sm text-slate-400 mb-3 leading-relaxed">
                      {notification.message}
                    </p>

                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-500 font-medium">
                        {getTimeAgo(notification.created_at)}
                      </span>

                      {/* Type Badge */}
                      <span className={`
                        text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-lg
                        ${color === 'emerald' ? 'bg-emerald-500/10 text-emerald-400' : ''}
                        ${color === 'red' ? 'bg-rose-500/10 text-rose-400' : ''}
                        ${color === 'yellow' ? 'bg-amber-500/10 text-amber-400' : ''}
                        ${color === 'blue' ? 'bg-cyan-500/10 text-cyan-400' : ''}
                      `}>
                        {notification.type.replace(/_/g, ' ')}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white p-4 md:p-8">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
            opacity: [0.03, 0.06, 0.03]
          }}
          transition={{ duration: 20, repeat: Infinity }}
          className="absolute -top-1/2 -right-1/2 w-full h-full bg-gradient-to-br from-cyan-500/10 to-violet-500/10 rounded-full blur-3xl"
        />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-br from-cyan-500 to-violet-600 rounded-2xl shadow-xl shadow-cyan-500/30">
                <Bell className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-black bg-gradient-to-r from-cyan-400 to-violet-400 bg-clip-text text-transparent">
                  Notification Center
                </h1>
                <p className="text-slate-400 text-sm mt-1">
                  {notifications.length} total notifications
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <motion.button
                onClick={handleRefresh}
                disabled={refreshing}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 px-4 py-2.5 bg-slate-800/50 hover:bg-slate-800 text-slate-300 rounded-xl transition-all border border-slate-700/50 disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                <span className="font-semibold text-sm">Refresh</span>
              </motion.button>

              {notifications.some(n => !n.is_read) && (
                <motion.button
                  onClick={handleMarkAllRead}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-cyan-600 to-violet-600 hover:from-cyan-500 hover:to-violet-500 text-white rounded-xl transition-all font-bold shadow-lg shadow-cyan-900/30"
                >
                  <Check className="w-4 h-4" />
                  <span className="text-sm">Mark All Read</span>
                </motion.button>
              )}
            </div>
          </div>

          {/* Notifications List */}
          {notifications.length > 0 ? (
            <div className="space-y-8">
              <NotificationGroup title="Today" items={groupedNotifications.today} />
              <NotificationGroup title="Yesterday" items={groupedNotifications.yesterday} />
              <NotificationGroup title="This Week" items={groupedNotifications.thisWeek} />
              <NotificationGroup title="Older" items={groupedNotifications.older} />
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center gap-6 py-20"
            >
              <div className="p-8 bg-slate-800/50 rounded-full">
                <Bell size={64} className="text-slate-600" />
              </div>
              <div className="text-center">
                <h3 className="text-2xl font-bold text-slate-300 mb-2">No Notifications</h3>
                <p className="text-slate-500">You're all caught up!</p>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default NotificationCenter;