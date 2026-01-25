/**
 * Notification Utilities
 * Helper functions for notification formatting and routing
 */

/**
 * Get notification icon component based on type
 */
export const getNotificationIcon = (type) => {
    const iconMap = {
        PROJECT_APPROVED: '✅',
        PROJECT_REJECTED: '❌',
        PROJECT_SUBMITTED: '📋',
        PROJECT_CHANGES_REQUESTED: '⚠️',
        PAYMENT_SUCCESS: '💰',
        PAYMENT_FAILED: '⚠️',
        PAYMENT_PENDING: '⏳',
        ACCESS_APPROVED: '🔓',
        ACCESS_REJECTED: '🔒',
        ACCESS_REQUESTED: '🔐',
        ACCESS_REVOKED: '🔒',
        SYSTEM: '🔔',
    };
    return iconMap[type] || '🔔';
};

/**
 * Get notification color based on type
 */
export const getNotificationColor = (type) => {
    if (type.includes('APPROVED') || type.includes('SUCCESS')) {
        return 'emerald';
    }
    if (type.includes('REJECTED') || type.includes('FAILED') || type.includes('REVOKED')) {
        return 'red';
    }
    if (type.includes('PENDING') || type.includes('REQUESTED') || type.includes('CHANGES')) {
        return 'yellow';
    }
    return 'blue';
};

/**
 * Get navigation path based on notification type and metadata
 */
export const getNotificationRoute = (notification, userRole) => {
    const { type, metadata } = notification;
    const role = userRole.toLowerCase();

    // Project-related notifications
    if (type.includes('PROJECT')) {
        if (metadata?.project_id) {
            if (role === 'developer') {
                return `/developer/projects/${metadata.project_id}`;
            } else if (role === 'admin') {
                // Admin doesn't have a direct project detail route currently
                return `/admin/pending-projects`;
            } else {
                return `/investor/projects/${metadata.project_id}`;
            }
        }
        return role === 'admin' ? `/admin/pending-projects` : `/${role}/projects`;
    }

    // Payment/Investment notifications
    if (type.includes('PAYMENT') || type.includes('INVESTMENT')) {
        if (metadata?.investment_id) {
            return `/investor/investments/${metadata.investment_id}`;
        }
        return '/investor/investments';
    }

    // Access request notifications
    if (type.includes('ACCESS')) {
        if (metadata?.project_id) {
            return `/investor/projects/${metadata.project_id}`;
        }
        if (metadata?.access_request_id) {
            return `/investor/requests`;
        }
        return '/investor/requests';
    }

    // Default: dashboard
    return `/${role}`;
};

/**
 * Format time ago string
 */
export const getTimeAgo = (dateString) => {
    const now = new Date();
    const past = new Date(dateString);
    const diffMs = now - past;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    const diffWeeks = Math.floor(diffMs / 604800000);

    if (diffMins < 1) return 'Just now';
    if (diffMins === 1) return '1 minute ago';
    if (diffMins < 60) return `${diffMins} minutes ago`;
    if (diffHours === 1) return '1 hour ago';
    if (diffHours < 24) return `${diffHours} hours ago`;
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffWeeks === 1) return '1 week ago';
    if (diffWeeks < 4) return `${diffWeeks} weeks ago`;

    return past.toLocaleDateString();
};

/**
 * Group notifications by date
 */
export const groupNotificationsByDate = (notifications) => {
    const groups = {
        today: [],
        yesterday: [],
        thisWeek: [],
        older: [],
    };

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const weekAgo = new Date(today);
    weekAgo.setDate(weekAgo.getDate() - 7);

    notifications.forEach((notification) => {
        const notifDate = new Date(notification.created_at);
        const notifDay = new Date(notifDate.getFullYear(), notifDate.getMonth(), notifDate.getDate());

        if (notifDay.getTime() === today.getTime()) {
            groups.today.push(notification);
        } else if (notifDay.getTime() === yesterday.getTime()) {
            groups.yesterday.push(notification);
        } else if (notifDay >= weekAgo) {
            groups.thisWeek.push(notification);
        } else {
            groups.older.push(notification);
        }
    });

    return groups;
};

/**
 * Get notification priority (for sorting)
 */
export const getNotificationPriority = (type) => {
    const priorities = {
        PAYMENT_FAILED: 1,
        PROJECT_REJECTED: 1,
        ACCESS_REJECTED: 1,
        PAYMENT_PENDING: 2,
        PROJECT_CHANGES_REQUESTED: 2,
        ACCESS_REQUESTED: 2,
        PAYMENT_SUCCESS: 3,
        PROJECT_APPROVED: 3,
        ACCESS_APPROVED: 3,
        PROJECT_SUBMITTED: 4,
        ACCESS_REVOKED: 4,
        SYSTEM: 5,
    };
    return priorities[type] || 5;
};

/**
 * Sort notifications by priority and date
 */
export const sortNotifications = (notifications) => {
    return [...notifications].sort((a, b) => {
        // Unread first
        if (a.is_read !== b.is_read) {
            return a.is_read ? 1 : -1;
        }

        // Then by priority
        const priorityDiff = getNotificationPriority(a.type) - getNotificationPriority(b.type);
        if (priorityDiff !== 0) {
            return priorityDiff;
        }

        // Then by date (newest first)
        return new Date(b.created_at) - new Date(a.created_at);
    });
};
