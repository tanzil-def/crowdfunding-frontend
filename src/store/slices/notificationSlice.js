import { createSlice } from '@reduxjs/toolkit';

const notificationSlice = createSlice({
    name: 'notifications',
    initialState: {
        notifications: [],
        unreadCount: 0,
        loading: false,
    },
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
                state.unreadCount -= 1;
            }
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
    },
});

export const {
    setNotifications,
    addNotification,
    markRead,
    setLoading,
} = notificationSlice.actions;

export default notificationSlice.reducer;
