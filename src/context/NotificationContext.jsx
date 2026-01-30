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
    const isMounted = useRef(true);

    const fetchUnreadCount = useCallback(async () => {
        if (!user?.id || !isMounted.current) return;
        try {
            const data = await notificationService.getUnreadCount();
            dispatch(setUnreadCount(data.unread_count || 0));
        } catch (err) {
            console.debug('Failed to fetch unread count:', err);
        }
    }, [dispatch, user?.id]);

    const connectWebSocket = useCallback(() => {
        if (!isMounted.current || !user?.id) return;

        const token = localStorage.getItem('accessToken');
        if (!token) return;

        if (wsRef.current && (wsRef.current.readyState === WebSocket.CONNECTING || wsRef.current.readyState === WebSocket.OPEN)) {
            return;
        }

        const wsUrl = `${import.meta.env.VITE_WS_URL || 'ws://localhost:8000'}/ws/notifications/?token=${token}`;

        try {
            console.log('🔌 Connecting to WebSocket...');
            const ws = new WebSocket(wsUrl);
            wsRef.current = ws;

            ws.onopen = () => {
                if (!isMounted.current) return;
                console.log('✅ WebSocket connected');
                dispatch(setWsConnected(true));
                reconnectAttempts.current = 0;
                fetchUnreadCount();
            };

            ws.onmessage = (event) => {
                if (!isMounted.current) return;
                try {
                    const data = JSON.parse(event.data);
                    const notificationTypes = [
                        'notification', 'NEW_NOTIFICATION', 'ACCESS_REQUESTED',
                        'ACCESS_APPROVED', 'ACCESS_REJECTED', 'PROJECT_SUBMITTED',
                        'PROJECT_APPROVED', 'PAYMENT_SUCCESS', 'PAYMENT_FAILED'
                    ];

                    if (notificationTypes.includes(data.type)) {
                        dispatch(addNotification(data));
                        fetchUnreadCount();
                        toast(data.message || 'New Notification', {
                            icon: '🔔',
                            duration: 5000,
                            position: 'top-right'
                        });
                    }
                } catch (err) {
                    console.error('Error parsing WebSocket message:', err);
                }
            };

            ws.onclose = (event) => {
                if (!isMounted.current) return;
                console.log(`📡 WebSocket closed: ${event.code}`);
                dispatch(setWsConnected(false));
                wsRef.current = null;

                if (event.code !== 1000 && user?.id) {
                    const delay = Math.min(5000 * Math.pow(1.2, reconnectAttempts.current), 30000);
                    if (reconnectTimeoutRef.current) clearTimeout(reconnectTimeoutRef.current);
                    reconnectTimeoutRef.current = setTimeout(() => {
                        reconnectAttempts.current += 1;
                        connectWebSocket();
                    }, delay);
                }
            };

            ws.onerror = () => {
                if (wsRef.current) wsRef.current.close();
            };

        } catch (err) {
            console.error('Failed to create WebSocket connection:', err);
        }
    }, [user?.id, dispatch, fetchUnreadCount]);

    useEffect(() => {
        isMounted.current = true;
        if (user?.id) {
            connectWebSocket();
            fetchUnreadCount();
        }

        return () => {
            isMounted.current = false;
            if (reconnectTimeoutRef.current) clearTimeout(reconnectTimeoutRef.current);
            if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
            if (wsRef.current) {
                wsRef.current.onclose = null;
                wsRef.current.close();
                wsRef.current = null;
            }
        };
    }, [user?.id, connectWebSocket, fetchUnreadCount]);

    return (
        <NotificationContext.Provider value={{ socket: wsRef.current, reconnect: connectWebSocket }}>
            {children}
        </NotificationContext.Provider>
    );
};

export const useNotification = () => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotification must be used within a NotificationProvider');
    }
    return context;
};