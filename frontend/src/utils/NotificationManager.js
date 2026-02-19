// Notification utility for tracking booking status changes
const NOTIFICATIONS_KEY = 'luxor_notifications';

export const createNotification = (notification) => {
    try {
        const stored = localStorage.getItem(NOTIFICATIONS_KEY);
        const notifications = stored ? JSON.parse(stored) : [];

        const newNotification = {
            id: `NOTIF-${Date.now()}`,
            ...notification,
            createdAt: new Date().toISOString(),
            read: false
        };

        notifications.unshift(newNotification);
        localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(notifications));

        return newNotification;
    } catch (error) {
        console.error('Error creating notification:', error);
        return null;
    }
};

export const getUserNotifications = (userId) => {
    try {
        const stored = localStorage.getItem(NOTIFICATIONS_KEY);
        const notifications = stored ? JSON.parse(stored) : [];
        return notifications.filter(n => n.userId === userId);
    } catch (error) {
        console.error('Error getting notifications:', error);
        return [];
    }
};

export const getUnreadCount = (userId) => {
    const notifications = getUserNotifications(userId);
    return notifications.filter(n => !n.read).length;
};

export const markAsRead = (notificationId) => {
    try {
        const stored = localStorage.getItem(NOTIFICATIONS_KEY);
        const notifications = stored ? JSON.parse(stored) : [];

        const updated = notifications.map(n =>
            n.id === notificationId ? { ...n, read: true } : n
        );

        localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(updated));
        return true;
    } catch (error) {
        console.error('Error marking notification as read:', error);
        return false;
    }
};

export const markAllAsRead = (userId) => {
    try {
        const stored = localStorage.getItem(NOTIFICATIONS_KEY);
        const notifications = stored ? JSON.parse(stored) : [];

        const updated = notifications.map(n =>
            n.userId === userId ? { ...n, read: true } : n
        );

        localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(updated));
        return true;
    } catch (error) {
        console.error('Error marking all as read:', error);
        return false;
    }
};

export const clearNotifications = (userId) => {
    try {
        const stored = localStorage.getItem(NOTIFICATIONS_KEY);
        const notifications = stored ? JSON.parse(stored) : [];

        const filtered = notifications.filter(n => n.userId !== userId);
        localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(filtered));
        return true;
    } catch (error) {
        console.error('Error clearing notifications:', error);
        return false;
    }
};
