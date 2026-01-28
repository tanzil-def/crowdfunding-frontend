import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { markRead, setNotifications, setUnreadCount } from '../../store/slices/notificationSlice';
import { getTimeAgo } from '../../utils/notificationUtils';
import notificationService from '../../api/notificationService';
import { useSelector, useDispatch } from 'react-redux';
import {
  Bell,
  CheckCircle,
  XCircle,
  DollarSign,
  Shield,
  Clock,
  Search,
  Filter,
  CheckSquare,
  Trash2,
  ChevronRight,
  ArrowRight,
  TrendingUp,
  Inbox
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';

const NotificationCenter = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { notifications, loading } = useSelector((state) => state.notifications);
  const { user } = useSelector((state) => state.user);

  const [filter, setFilter] = useState('ALL'); // ALL, UNREAD
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const data = await notificationService.fetchAll();
      dispatch(setNotifications(data.results || data));

      const unreadData = await notificationService.getUnreadCount();
      dispatch(setUnreadCount(unreadData.unread_count || 0));
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
      toast.error('Failed to sync notifications');
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await notificationService.markAllRead();
      fetchNotifications();
      toast.success('All records marked as read');
    } catch (error) {
      toast.error('Operation failed');
    }
  };

  const handleNotificationClick = async (notification) => {
    try {
      if (!notification.is_read) {
        await notificationService.markAsRead(notification.id);
        dispatch(markRead(notification.id));
      }

      // Route based on type
      switch (notification.type) {
        case 'PROJECT_APPROVED':
          navigate('/developer/projects');
          break;
        case 'PROJECT_REJECTED':
        case 'PROJECT_CHANGES_REQUESTED':
          navigate(`/developer/projects/${notification.metadata?.project_id}/edit`);
          break;
        case 'ACCESS_APPROVED':
          navigate('/investor/portfolio');
          break;
        case 'ACCESS_REQUESTED':
          navigate('/admin/access-requests');
          break;
        case 'PAYMENT_SUCCESS':
        case 'PAYMENT_FAILED':
          navigate('/investor/investments');
          break;
        default:
        // Stay on page
      }
    } catch (error) {
      console.error('Error handling notification click:', error);
    }
  };

  const filteredNotifications = notifications.filter(n => {
    const matchesFilter = filter === 'ALL' || (filter === 'UNREAD' && !n.is_read);
    const matchesSearch = n.message.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getIcon = (type) => {
    switch (type) {
      case 'PROJECT_APPROVED':
      case 'ACCESS_APPROVED':
        return <CheckCircle className="text-emerald-500" size={24} />;
      case 'PROJECT_REJECTED':
      case 'PAYMENT_FAILED':
        return <XCircle className="text-rose-500" size={24} />;
      case 'PAYMENT_SUCCESS':
        return <DollarSign className="text-emerald-500" size={24} />;
      case 'ACCESS_REQUESTED':
        return <Shield className="text-blue-500" size={24} />;
      default:
        return <Bell className="text-slate-500" size={24} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] p-8 lg:p-12 font-sans text-slate-200">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
          <div>
            <h1 className="text-6xl font-black italic tracking-tighter text-white uppercase mb-4">
              Control <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">Center</span>
            </h1>
            <p className="text-slate-500 font-bold uppercase tracking-[0.3em] text-xs">Communication Protocol & Activity Log</p>
          </div>

          <div className="flex gap-4">
            <button
              onClick={handleMarkAllRead}
              className="px-6 py-4 bg-slate-900 border border-white/5 rounded-2xl hover:border-emerald-500/30 transition-all text-[10px] font-black uppercase tracking-widest flex items-center gap-2 group"
            >
              <CheckSquare size={16} className="text-slate-500 group-hover:text-emerald-500 transition-colors" /> Clear Buffer
            </button>
          </div>
        </div>

        {/* Filters & Search */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-10">
          <div className="lg:col-span-4 flex gap-2 bg-slate-900/50 p-1.5 rounded-2xl border border-white/5">
            {['ALL', 'UNREAD'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${filter === f ? 'bg-emerald-500 text-slate-950 font-black' : 'text-slate-500 hover:text-white'}`}
              >
                {f} Logs
              </button>
            ))}
          </div>

          <div className="lg:col-span-8 relative">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
            <input
              type="text"
              placeholder="Search event logs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900/50 border border-white/5 rounded-2xl py-4 pl-16 pr-6 outline-none focus:border-emerald-500/30 transition-all italic text-sm"
            />
          </div>
        </div>

        {/* List */}
        <div className="space-y-4">
          <AnimatePresence mode="popLayout">
            {filteredNotifications.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-slate-900/30 border border-white/5 rounded-[2.5rem] p-20 text-center backdrop-blur-3xl"
              >
                <div className="w-20 h-20 bg-slate-800 rounded-3xl flex items-center justify-center mx-auto mb-6">
                  <Inbox className="text-slate-700" size={40} />
                </div>
                <p className="text-slate-500 font-black uppercase tracking-[0.5em] text-xs">No Records Found</p>
              </motion.div>
            ) : (
              filteredNotifications.map((n, idx) => (
                <motion.div
                  key={n.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  onClick={() => handleNotificationClick(n)}
                  className={`relative p-8 rounded-[2.5rem] border border-white/5 hover:border-emerald-500/20 transition-all cursor-pointer overflow-hidden group backdrop-blur-xl ${!n.is_read ? 'bg-slate-900/80 shadow-2xl' : 'bg-slate-900/20 opacity-60'}`}
                >
                  <div className="flex gap-8 items-start relative z-10">
                    <div className="p-4 bg-slate-800 rounded-3xl group-hover:bg-slate-700 transition-colors shadow-lg">
                      {getIcon(n.type)}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <p className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.2em] mb-1">{n.type.replace(/_/g, ' ')}</p>
                          <h3 className={`text-xl font-black italic tracking-tighter uppercase ${!n.is_read ? 'text-white' : 'text-slate-400'}`}>
                            {n.message}
                          </h3>
                        </div>
                        <div className="flex items-center gap-2 text-slate-500">
                          <Clock size={14} />
                          <span className="text-[10px] font-bold uppercase tracking-widest">
                            {getTimeAgo(n.created_at)}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <button className="text-[9px] font-black uppercase tracking-widest text-emerald-500 flex items-center gap-2 group-hover:translate-x-2 transition-transform">
                          View Details <ArrowRight size={14} />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Decorative Elements */}
                  {!n.is_read && (
                    <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 blur-3xl rounded-full" />
                  )}
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default NotificationCenter;