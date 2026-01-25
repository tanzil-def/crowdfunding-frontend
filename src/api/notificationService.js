import axiosInstance from './axiosInstance';

/**
 * Fetch all notifications for the current user
 */
export const fetchNotifications = async () => {
    try {
        const response = await axiosInstance.get('/notifications/');
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
        const response = await axiosInstance.patch(`/notifications/${notificationId}/read/`);
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
        // Fetch all unread notifications first
        const response = await axiosInstance.get('/notifications/');
        const notifications = response.data.results || response.data;

        // Mark each unread notification as read
        const unreadNotifications = notifications.filter(n => !n.is_read);
        const promises = unreadNotifications.map(n => markNotificationAsRead(n.id));

        await Promise.all(promises);
        return { success: true };
    } catch (error) {
        console.error('Failed to mark all notifications as read:', error);
        throw error;
    }
};

const notificationService = {
    // Primary methods
    fetchNotifications,    // Matches request
    getNotifications: fetchNotifications, // Alias for backward compatibility

    markNotificationAsRead, // Matches request
    markNotificationRead: markNotificationAsRead, // Alias for backward compatibility

    markAllNotificationsAsRead,
};

export default notificationService;