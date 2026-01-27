import axiosInstance from './axiosInstance';

/**
 * Fetch all notifications for the current user
 */
export const fetchNotifications = async () => {
    try {
        const response = await axiosInstance.get('/api/v1/notifications/');
        return response.data;
    } catch (error) {
        console.error('Failed to fetch notifications:', error);
        throw error;
    }
};

/**
 * Mark a specific notification as read
 */
export const markNotificationAsRead = async (notificationId) => {
    try {
        const response = await axiosInstance.patch(`/api/v1/notifications/${notificationId}/read/`);
        return response.data;
    } catch (error) {
        console.error('Failed to mark notification as read:', error);
        throw error;
    }
};

/**
 * Mark all notifications as read (bulk operation)
 */
export const markAllNotificationsAsRead = async () => {
    try {
        const response = await axiosInstance.post('/api/v1/notifications/mark-all-read/');
        return response.data;
    } catch (error) {
        console.error('Failed to mark all notifications as read:', error);
        throw error;
    }
};

const notificationService = {
    // Primary methods
    fetchNotifications,
    getNotifications: fetchNotifications,

    markNotificationAsRead,
    markNotificationRead: markNotificationAsRead,

    markAllNotificationsAsRead,
    markAllRead: markAllNotificationsAsRead,
};

export default notificationService;