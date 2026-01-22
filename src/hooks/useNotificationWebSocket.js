import { useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { addNotification, setWsConnected, markRead } from '../store/slices/notificationSlice';
import { toast } from 'react-hot-toast';

/**
 * WebSocket Hook for Real-Time Notifications
 * Connects to Django Channels WebSocket and handles real-time notification events
 */
export const useNotificationWebSocket = (user) => {
    const dispatch = useDispatch();
    const wsRef = useRef(null);
    const reconnectTimeoutRef = useRef(null);
    const reconnectAttempts = useRef(0);

    useEffect(() => {
        if (!user || !user.id) {
            return;
        }

        const connectWebSocket = () => {
            const token = localStorage.getItem('accessToken');
            if (!token) {
                console.warn('No access token found for WebSocket connection');
                return;
            }

            // WebSocket URL - adjust based on your backend configuration
            const wsUrl = `${import.meta.env.VITE_WS_URL || 'ws://localhost:8000'}/ws/notifications/?token=${token}`;

            try {
                wsRef.current = new WebSocket(wsUrl);

                wsRef.current.onopen = () => {
                    console.log('✅ WebSocket connected');
                    dispatch(setWsConnected(true));
                    reconnectAttempts.current = 0;
                };

                wsRef.current.onmessage = (event) => {
                    try {
                        const data = JSON.parse(event.data);

                        if (data.type === 'notification') {
                            // New notification received
                            dispatch(addNotification(data));

                            // Show toast notification
                            const notificationTypeMap = {
                                PROJECT_APPROVED: { icon: '✅', color: 'success' },
                                PROJECT_REJECTED: { icon: '❌', color: 'error' },
                                PAYMENT_SUCCESS: { icon: '💰', color: 'success' },
                                PAYMENT_FAILED: { icon: '⚠️', color: 'error' },
                                ACCESS_APPROVED: { icon: '🔓', color: 'success' },
                                ACCESS_REJECTED: { icon: '🔒', color: 'error' },
                            };

                            const config = notificationTypeMap[data.type] || { icon: '🔔', color: 'default' };

                            toast(data.message, {
                                icon: config.icon,
                                duration: 5000,
                                position: 'top-right',
                            });
                        } else if (data.type === 'notification_read') {
                            // Sync read status across tabs
                            dispatch(markRead(data.notification_id));
                        } else if (data.type === 'connection') {
                            console.log('WebSocket connection confirmed:', data.message);
                        }
                    } catch (err) {
                        console.error('Error parsing WebSocket message:', err);
                    }
                };

                wsRef.current.onerror = (error) => {
                    console.error('WebSocket error:', error);
                    dispatch(setWsConnected(false));
                };

                wsRef.current.onclose = (event) => {
                    console.log('WebSocket closed:', event.code, event.reason);
                    dispatch(setWsConnected(false));

                    // Attempt to reconnect with exponential backoff
                    if (reconnectAttempts.current < 5) {
                        const delay = Math.min(1000 * Math.pow(2, reconnectAttempts.current), 30000);
                        console.log(`Reconnecting in ${delay}ms...`);

                        reconnectTimeoutRef.current = setTimeout(() => {
                            reconnectAttempts.current += 1;
                            connectWebSocket();
                        }, delay);
                    }
                };
            } catch (err) {
                console.error('Failed to create WebSocket connection:', err);
            }
        };

        connectWebSocket();

        // Cleanup on unmount
        return () => {
            if (reconnectTimeoutRef.current) {
                clearTimeout(reconnectTimeoutRef.current);
            }
            if (wsRef.current) {
                wsRef.current.close();
            }
        };
    }, [user, dispatch]);

    return wsRef.current;
};
