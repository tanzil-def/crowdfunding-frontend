import React, { useState, useEffect } from "react";
import { getNotifications, markNotificationRead } from "../../services/api";
import { Bell, Check, Clock, X, AlertCircle, CheckCircle, Info } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";

const NotificationCenter = ({ isOpen, onClose }) => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (isOpen) {
            fetchNotifications();
        }
    }, [isOpen]);

    const fetchNotifications = async () => {
        try {
            setLoading(true);
            const res = await getNotifications();
            const data = res.data || res;
            setNotifications(data.results || []);
        } catch (err) {
            console.error("Failed to fetch notifications:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleMarkAsRead = async (id) => {
        try {
            await markNotificationRead(id);
            setNotifications(prev =>
                prev.map(n => n.id === id ? { ...n, is_read: true } : n)
            );
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
        <div className="absolute top-20 right-8 w-96 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl z-50 overflow-hidden font-sans">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-800/50">
                <div className="flex items-center gap-2">
                    <Bell size={18} className="text-emerald-400" />
                    <h2 className="font-bold text-white">Notifications</h2>
                </div>
                <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
                    <X size={20} />
                </button>
            </div>

            <div className="max-h-[480px] overflow-auto">
                {loading && notifications.length === 0 ? (
                    <div className="flex flex-col items-center justify-center p-12 text-slate-500">
                        <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mb-4" />
                        <p>Loading notifications...</p>
                    </div>
                ) : notifications.length === 0 ? (
                    <div className="flex flex-col items-center justify-center p-12 text-slate-500 text-center">
                        <Bell size={48} className="mb-4 opacity-20" />
                        <p className="font-medium text-white">No notifications yet</p>
                        <p className="text-xs">We'll alert you when something happens</p>
                    </div>
                ) : (
                    <div className="divide-y divide-slate-800">
                        {notifications.map((notification) => (
                            <div
                                key={notification.id}
                                className={`p-4 hover:bg-slate-800/30 transition-colors relative group ${!notification.is_read ? 'bg-emerald-500/[0.02]' : ''}`}
                            >
                                {!notification.is_read && (
                                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-500" />
                                )}
                                <div className="flex gap-3">
                                    <div className="mt-1 flex-shrink-0">
                                        {getIcon(notification.type)}
                                    </div>
                                    <div className="flex-1">
                                        <p className={`text-sm ${!notification.is_read ? 'text-white font-semibold' : 'text-slate-300'}`}>
                                            {notification.message}
                                        </p>
                                        <div className="flex items-center gap-2 mt-2 text-[10px] text-slate-500 uppercase tracking-wider">
                                            <Clock size={10} />
                                            {new Date(notification.created_at).toLocaleString()}
                                        </div>
                                    </div>
                                    {!notification.is_read && (
                                        <button
                                            onClick={() => handleMarkAsRead(notification.id)}
                                            className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-emerald-500/20 text-emerald-400 rounded-lg transition-all"
                                            title="Mark as read"
                                        >
                                            <Check size={16} />
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {notifications.length > 0 && (
                <div className="p-3 bg-slate-800/50 border-t border-slate-800 text-center">
                    <button
                        onClick={fetchNotifications}
                        className="text-xs font-bold text-emerald-400 hover:text-emerald-300 transition-colors"
                    >
                        Refresh List
                    </button>
                </div>
            )}
        </div>
    );
};

export default NotificationCenter;
