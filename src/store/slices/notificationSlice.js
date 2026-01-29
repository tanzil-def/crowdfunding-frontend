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
            // If it's a paginated response, results are in .results
            const data = action.payload.results || action.payload;
            state.notifications = Array.isArray(data) ? data : [];
        },
        addNotification: (state, action) => {
            state.notifications.unshift(action.payload);
            if (!action.payload.is_read) {
                state.unreadCount += 1;
            }
        },
        markRead: (state, action) => {
            const id = action.payload;
            const notification = state.notifications.find(n => n.id === id);
            if (notification && !notification.is_read) {
                notification.is_read = true;
                state.unreadCount = Math.max(0, state.unreadCount - 1);
            }
        },
        setUnreadCount: (state, action) => {
            state.unreadCount = action.payload;
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setWsConnected: (state, action) => {
            state.wsConnected = action.payload;
        },
    },
});

export const { setNotifications, addNotification, markRead, setUnreadCount, setLoading, setWsConnected } = notificationSlice.actions;
export default notificationSlice.reducer;
