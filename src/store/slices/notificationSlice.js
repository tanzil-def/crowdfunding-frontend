import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    notifications: [],
    unreadCount: 0,
    loading: false,
    wsConnected: false,
};

const notificationSlice = createSlice({
    name: 'notifications',
    initialState,
    reducers: {
        setNotifications: (state, action) => {
            state.notifications = action.payload;
            state.unreadCount = action.payload.filter(n => !n.is_read).length;
        },
        addNotification: (state, action) => {
            state.notifications.unshift(action.payload);
            if (!action.payload.is_read) {
                state.unreadCount += 1;
            }
        },
        markRead: (state, action) => {
            const notification = state.notifications.find(n => n.id === action.payload);
            if (notification && !notification.is_read) {
                notification.is_read = true;
                state.unreadCount = Math.max(0, state.unreadCount - 1);
            }
        },
        markAllRead: (state) => {
            state.notifications.forEach(n => n.is_read = true);
            state.unreadCount = 0;
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setWsConnected: (state, action) => {
            state.wsConnected = action.payload;
        },
        clearNotifications: (state) => {
            state.notifications = [];
            state.unreadCount = 0;
        },
    },
});

export const {
    setNotifications,
    addNotification,
    markRead,
    markAllRead,
    setLoading,
    setWsConnected,
    clearNotifications,
} = notificationSlice.actions;

export default notificationSlice.reducer;
