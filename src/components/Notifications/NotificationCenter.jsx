import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import developerService from "../../api/developerService";
import { markRead, setNotifications } from "../../store/slices/notificationSlice";
import { Bell, Check, Clock, X, AlertCircle, CheckCircle, Info } from "lucide-react";
import { getNotificationRoute } from "../../utils/notificationUtils";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";

const NotificationCenter = ({ isOpen, onClose }) => {
    const { notifications, loading } = useSelector((state) => state.notifications);
    const { user } = useSelector((state) => state.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const fetchNotifications = async () => {
        try {
            const res = await developerService.getNotifications();
            const data = res.data || res;
            dispatch(setNotifications(data.results || []));
            toast.success("Notifications updated");
        } catch (err) {
            console.error("Failed to fetch notifications:", err);
            toast.error("Failed to update notifications");
        }
    };

    const handleNotificationClick = async (notification) => {
        // 1. Mark as read
        if (!notification.is_read) {
            try {
                await developerService.markNotificationRead(notification.id);
                dispatch(markRead(notification.id));
            } catch (err) {
                console.error("Failed to mark read:", err);
            }
        }

        // 2. Navigate
        onClose();
        try {
            const route = getNotificationRoute(notification, user?.role || 'investor');
            navigate(route);
        } catch (error) {
            console.error("Navigation error:", error);
            navigate(`/${user?.role?.toLowerCase() || 'investor'}/notifications`);
        }
    };

    const handleMarkAsRead = async (e, id) => {
        e.stopPropagation(); // Prevent navigation when clicking the check mark
        try {
            await developerService.markNotificationRead(id);
            dispatch(markRead(id));
            toast.success("Marked as read");
        } catch (err) {
            toast.error("Failed to mark notification as read");
        }
    };

    const getIcon = (type) => {
        switch (type) {
            case 'SUCCESS': return <CheckCircle className="text-emerald-400" size={18} />;
            case 'WARNING': return <AlertCircle className="text-yellow-400" size={18} />;
            case 'ERROR': return <X className="text-red-400" size={18} />;
            default: return <Info className="text-blue-400" size={18} />;
        }
    };

    if (!isOpen) return null;

    return (
        <div className="absolute top-20 right-8 w-96 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl z-50 overflow-hidden font-sans animate-in fade-in zoom-in duration-200">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-800/50 backdrop-blur-md">
                <div className="flex items-center gap-2">
                    <Bell size={18} className="text-emerald-400" />
                    <h2 className="font-bold text-white">Notifications</h2>
                </div>
                <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
                    <X size={20} />
                </button>
            </div>

            <div className="max-h-[480px] overflow-y-auto custom-scrollbar">
                {loading && notifications.length === 0 ? (
                    <div className="flex flex-col items-center justify-center p-12 text-slate-500">
                        <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mb-4" />
                        <p>Loading notifications...</p>
                    </div>
                ) : notifications.length === 0 ? (
                    <div className="flex flex-col items-center justify-center p-12 text-slate-500 text-center">
                        <Bell size={48} className="mb-4 opacity-20" />
                        <p className="font-medium text-white">No notifications yet</p>
                        <p className="text-xs text-slate-400 mt-1">We'll alert you when something happens</p>
                    </div>
                ) : (
                    <div className="divide-y divide-slate-800/50">
                        {notifications.map((notification) => (
                            <div
                                key={notification.id}
                                onClick={() => handleNotificationClick(notification)}
                                className={`p-4 hover:bg-slate-800/50 transition-all cursor-pointer relative group ${!notification.is_read ? 'bg-emerald-500/[0.05]' : ''}`}
                            >
                                {!notification.is_read && (
                                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-500" />
                                )}
                                <div className="flex gap-4">
                                    <div className="mt-1 flex-shrink-0">
                                        {getIcon(notification.type)}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className={`text-sm ${!notification.is_read ? 'text-white font-semibold' : 'text-slate-400'}`}>
                                            {notification.message}
                                        </p>
                                        <div className="flex items-center gap-2 mt-2 text-[10px] text-slate-500 uppercase tracking-wider font-medium">
                                            <Clock size={10} />
                                            {new Date(notification.created_at).toLocaleString()}
                                        </div>
                                    </div>
                                    {!notification.is_read && (
                                        <button
                                            onClick={(e) => handleMarkAsRead(e, notification.id)}
                                            className="ml-2 p-2 hover:bg-emerald-500/20 text-emerald-400 rounded-lg transition-all self-start"
                                            title="Mark as read"
                                        >
                                            <Check size={14} />
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="p-3 bg-slate-800/50 border-t border-slate-800 text-center backdrop-blur-md">
                <button
                    onClick={fetchNotifications}
                    className="text-xs font-bold text-emerald-400 hover:text-emerald-300 transition-colors uppercase tracking-wider flex items-center justify-center gap-2 w-full py-2"
                >
                    Refresh List
                </button>
            </div>


        </div>
    );
};

export default NotificationCenter;
