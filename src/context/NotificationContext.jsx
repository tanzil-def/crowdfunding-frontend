import React, { createContext, useContext, useEffect, useRef, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addNotification, setWsConnected, markRead, setUnreadCount } from '../store/slices/notificationSlice';
import { toast } from 'react-hot-toast';
import notificationService from '../api/notificationService';

const NotificationContext = createContext(null);

export const NotificationProvider = ({ children }) => {
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.user);
    const { wsConnected } = useSelector((state) => state.notifications);
    const wsRef = useRef(null);
    const reconnectTimeoutRef = useRef(null);
    const reconnectAttempts = useRef(0);
    const pollIntervalRef = useRef(null);

    const fetchUnreadCount = useCallback(async () => {
        try {
            const data = await notificationService.getUnreadCount();
            dispatch(setUnreadCount(data.unread_count || 0));
        } catch (err) {
            console.debug('Failed to fetch unread count:', err);
        }
    }, [dispatch]);

    const connectWebSocket = useCallback(() => {
        const token = localStorage.getItem('accessToken');
        if (!token || !user) return;

        // Clean up existing connection if any
        if (wsRef.current) {
            wsRef.current.onclose = null; // Prevent reconnect loop from this close
            wsRef.current.close();
        }

        const wsUrl = `${import.meta.env.VITE_WS_URL || 'ws://localhost:8000'}/ws/notifications/?token=${token}`;

        try {
            console.log('🔌 Connecting to WebSocket...');
            wsRef.current = new WebSocket(wsUrl);

            wsRef.current.onopen = () => {
                console.log('✅ WebSocket connected');
                dispatch(setWsConnected(true));
                reconnectAttempts.current = 0;
                fetchUnreadCount(); // Sync unread count on connect
            };

            wsRef.current.onmessage = (event) => {
                try {
                    const data = JSON.parse(event.data);

                    const notificationTypes = [
                        'notification',
                        'NEW_NOTIFICATION',
                        'ACCESS_REQUESTED',
                        'ACCESS_APPROVED',
                        'ACCESS_REJECTED',
                        'PROJECT_SUBMITTED',
                        'PROJECT_APPROVED',
                        'PAYMENT_SUCCESS',
                        'PAYMENT_FAILED'
                    ];

                    if (notificationTypes.includes(data.type)) {
                        dispatch(addNotification(data));
                        fetchUnreadCount();

                        const notificationTypeMap = {
                            PROJECT_APPROVED: { icon: '✅' },
                            PROJECT_REJECTED: { icon: '❌' },
                            PROJECT_SUBMITTED: { icon: '📝' },
                            PAYMENT_SUCCESS: { icon: '💰' },
                            PAYMENT_FAILED: { icon: '⚠️' },
                            ACCESS_APPROVED: { icon: '🔓' },
                            ACCESS_REJECTED: { icon: '🔒' },
                            ACCESS_REQUESTED: { icon: '👤' },
                        };

                        const config = notificationTypeMap[data.type] || { icon: '🔔' };
                        toast(data.message || 'New Intel Received', {
                            icon: config.icon,
                            duration: 5000,
                            position: 'top-right',
                        });
                    } else if (data.type === 'notification_read') {
                        dispatch(markRead(data.notification_id));
                        fetchUnreadCount();
                    }
                } catch (err) {
                    console.error('Error parsing WebSocket message:', err);
                }
            };

            wsRef.current.onerror = (error) => {
                console.error('❌ WebSocket error:', error);
                dispatch(setWsConnected(false));
            };

            wsRef.current.onclose = (event) => {
                console.log(`📡 WebSocket closed: ${event.code} ${event.reason}`);
                dispatch(setWsConnected(false));

                // Reconnect logic
                if (reconnectAttempts.current < 10 && user) {
                    const delay = Math.min(1000 * Math.pow(1.5, reconnectAttempts.current), 30000);
                    console.log(`🔄 Reconnecting in ${Math.round(delay)}ms...`);
                    reconnectTimeoutRef.current = setTimeout(() => {
                        reconnectAttempts.current += 1;
                        connectWebSocket();
                    }, delay);
                }
            };
        } catch (err) {
            console.error('Failed to create WebSocket connection:', err);
        }
    }, [user, dispatch, fetchUnreadCount]);

    useEffect(() => {
        if (user && user.id) {
            connectWebSocket();
            fetchUnreadCount();
        } else {
            // Clean up if user logs out
            if (wsRef.current) wsRef.current.close();
        }

        return () => {
            if (reconnectTimeoutRef.current) clearTimeout(reconnectTimeoutRef.current);
            if (wsRef.current) wsRef.current.close();
        };
    }, [user?.id, connectWebSocket, fetchUnreadCount]);

    // Polling fallback when WebSocket is down
    useEffect(() => {
        if (user && !wsConnected) {
            console.log('⚠️ WebSocket disconnected, starting polling fallback...');
            fetchUnreadCount();
            pollIntervalRef.current = setInterval(fetchUnreadCount, 30000); // Poll every 30s
        } else {
            if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
        }

        return () => {
            if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
        };
    }, [user, wsConnected, fetchUnreadCount]);

    return (
        <NotificationContext.Provider value={{ socket: wsRef.current, reconnect: connectWebSocket }}>
            {children}
        </NotificationContext.Provider>
    );
};

export const useNotification = () => useContext(NotificationContext);
