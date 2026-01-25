import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Toaster } from 'react-hot-toast';
import { useNotificationWebSocket } from '../hooks/useNotificationWebSocket';
import { setNotifications } from '../store/slices/notificationSlice';
import notificationService from '../api/notificationService';

// Import your existing components
import Header from '../components/Header/Header';
import Sidebar from '../components/SideBar/Sidebar';

const MainLayout = () => {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.user?.user);

    // ✅ Initialize WebSocket for real-time notifications
    useNotificationWebSocket(user);

    // ✅ Fetch initial notifications on mount
    useEffect(() => {
        if (user) {
            loadInitialNotifications();
        }
    }, [user]);

    const loadInitialNotifications = async () => {
        try {
            const data = await notificationService.fetchNotifications();
            const notificationList = data.results || data;
            dispatch(setNotifications(notificationList));
        } catch (error) {
            console.error('Failed to load initial notifications:', error);
        }
    };

    return (
        <div className="min-h-screen bg-slate-950">
            {/* Header with NotificationBell */}
            <Header />

            <div className="flex">
                {/* Sidebar (if you have one) */}
                <Sidebar />

                {/* Main Content */}
                <main className="flex-1">
                    <Outlet />
                </main>
            </div>

            {/* Toast Notifications */}
            <Toaster
                position="top-right"
                toastOptions={{
                    duration: 4000,
                    style: {
                        background: '#1e293b',
                        color: '#fff',
                        border: '1px solid #334155',
                        borderRadius: '12px',
                    },
                    success: {
                        iconTheme: {
                            primary: '#10b981',
                            secondary: '#fff',
                        },
                    },
                    error: {
                        iconTheme: {
                            primary: '#ef4444',
                            secondary: '#fff',
                        },
                    },
                }}
            />
        </div>
    );
};

export default MainLayout;