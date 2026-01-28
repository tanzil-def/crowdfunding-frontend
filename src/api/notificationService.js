import axiosInstance from './axiosInstance';

const notificationService = {
    fetchAll: async (params = {}) => {
        const { data } = await axiosInstance.get('/api/v1/notifications/', { params });
        return data;
    },

    fetchNotifications: async (params = {}) => {
        const { data } = await axiosInstance.get('/api/v1/notifications/', { params });
        return data;
    },

    markAsRead: async (id) => {
        const { data } = await axiosInstance.patch(`/api/v1/notifications/${id}/read/`);
        return data;
    },

    markAllRead: async () => {
        const { data } = await axiosInstance.post('/api/v1/notifications/mark-all-read/');
        return data;
    },

    getUnreadCount: async () => {
        const { data } = await axiosInstance.get('/api/v1/notifications/unread-count/');
        return data;
    },

    getPreferences: async () => {
        const { data } = await axiosInstance.get('/api/v1/notifications/preferences/');
        return data;
    },

    updatePreferences: async (preferences) => {
        const { data } = await axiosInstance.patch('/api/v1/notifications/preferences/', preferences);
        return data;
    },
};

export default notificationService;