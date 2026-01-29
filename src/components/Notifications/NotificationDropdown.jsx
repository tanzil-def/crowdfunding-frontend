import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { markRead } from '../../store/slices/notificationSlice';
import { getTimeAgo } from '../../utils/notificationUtils';
import notificationService from '../../api/notificationService';
import { CheckCircle, XCircle, DollarSign, Clock, Shield, Bell, ArrowRight } from 'lucide-react';

const NotificationDropdown = ({ notifications, onClose }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleNotificationClick = async (notification) => {
        try {
            // Mark as read in API
            if (!notification.is_read) {
                await notificationService.markAsRead(notification.id);
                dispatch(markRead(notification.id));
            }

            const meta = notification.metadata || {};

            // Route mapping based on backend types and actual routes.jsx
            switch (notification.type) {
                // Project Events
                case 'PROJECT_APPROVED':
                    navigate('/developer/projects');
                    break;
                case 'PROJECT_REJECTED':
                case 'PROJECT_CHANGES_REQUESTED':
                    navigate(`/developer/projects/${meta.project_id || notification.id}/edit`);
                    break;
                case 'PROJECT_SUBMITTED':
                    navigate('/admin/pending-projects');
                    break;

                // Access Events
                case 'ACCESS_REQUESTED':
                    navigate('/admin/access-requests');
                    break;
                case 'ACCESS_APPROVED':
                    navigate('/investor/portfolio');
                    break;
                case 'ACCESS_REJECTED':
                    navigate('/investor/browse');
                    break;

                // Investment Events
                case 'PAYMENT_SUCCESS':
                case 'PAYMENT_FAILED':
                    navigate('/investor/investments');
                    break;

                // General Fallback
                default:
                    navigate('/notifications');
            }
            onClose();
        } catch (error) {
            console.error('Error handling notification click:', error);
        }
    };

    const getIcon = (type) => {
        switch (type) {
            case 'PROJECT_APPROVED':
            case 'ACCESS_APPROVED':
                return <CheckCircle className="text-emerald-500" size={16} />;
            case 'PROJECT_REJECTED':
            case 'PAYMENT_FAILED':
                return <XCircle className="text-rose-500" size={16} />;
            case 'PAYMENT_SUCCESS':
                return <DollarSign className="text-emerald-500" size={16} />;
            case 'ACCESS_REQUESTED':
                return <Shield className="text-blue-500" size={16} />;
            default:
                return <Bell className="text-slate-400" size={16} />;
        }
    };

    return (
        <div className="absolute right-0 mt-4 w-96 bg-slate-900 border border-white/10 rounded-3xl shadow-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="p-4 border-b border-white/5 flex justify-between items-center bg-slate-900/50">
                <h3 className="text-xs font-black uppercase tracking-widest text-white italic">Notifications</h3>
                <button
                    onClick={() => navigate('/notifications')}
                    className="text-[10px] font-bold text-emerald-500 hover:text-emerald-400 transition-colors uppercase tracking-widest"
                >
                    View All
                </button>
            </div>

            <div className="max-h-[400px] overflow-y-auto no-scrollbar">
                {notifications.length === 0 ? (
                    <div className="p-10 text-center">
                        <Bell className="mx-auto text-slate-700 mb-3 opacity-20" size={40} />
                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 italic">No New Intel</p>
                    </div>
                ) : (
                    <div className="divide-y divide-white/5">
                        {notifications.slice(0, 10).map((n) => (
                            <div
                                key={n.id}
                                onClick={() => handleNotificationClick(n)}
                                className={`p-4 hover:bg-white/5 cursor-pointer transition-all flex gap-4 items-start group ${!n.is_read ? 'bg-emerald-500/5' : ''}`}
                            >
                                <div className="mt-1 p-2 bg-slate-800 rounded-xl group-hover:bg-slate-700 transition-colors">
                                    {getIcon(n.type)}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className={`text-sm leading-tight mb-1 ${!n.is_read ? 'text-white font-bold italic' : 'text-slate-400 font-medium italic'}`}>
                                        {n.message}
                                    </p>
                                    <div className="flex items-center gap-2">
                                        <Clock size={10} className="text-slate-600" />
                                        <span className="text-[9px] font-bold text-slate-600 uppercase tracking-tighter">
                                            {getTimeAgo(n.created_at)}
                                        </span>
                                    </div>
                                </div>
                                {!n.is_read && (
                                    <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)] mt-2" />
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="p-4 bg-slate-950/50 border-t border-white/5 text-center">
                <button
                    onClick={onClose}
                    className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-500 hover:text-white transition-colors"
                >
                    Close Log
                </button>
            </div>
        </div>
    );
};

export default NotificationDropdown;
