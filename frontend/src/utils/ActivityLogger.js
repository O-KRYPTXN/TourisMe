const ACTIVITIES_KEY = 'luxor_provider_activities';

// Activity types
export const ActivityTypes = {
    SERVICE_ADDED: 'SERVICE_ADDED',
    SERVICE_UPDATED: 'SERVICE_UPDATED',
    SERVICE_DELETED: 'SERVICE_DELETED',
    PROFILE_UPDATED: 'PROFILE_UPDATED',
    LOGIN: 'LOGIN'
};

// Activity descriptions
const activityDescriptions = {
    [ActivityTypes.SERVICE_ADDED]: 'Added a new service',
    [ActivityTypes.SERVICE_UPDATED]: 'Updated a service',
    [ActivityTypes.SERVICE_DELETED]: 'Deleted a service',
    [ActivityTypes.PROFILE_UPDATED]: 'Updated company profile',
    [ActivityTypes.LOGIN]: 'Logged in'
};

/**
 * Log a provider activity
 * @param {Object} params - Activity parameters
 * @param {string} params.providerId - Provider's user ID
 * @param {string} params.providerName - Provider's full name
 * @param {string} params.companyName - Provider's company name
 * @param {string} params.type - Activity type from ActivityTypes
 * @param {string} params.description - Custom description (optional)
 * @param {Object} params.metadata - Additional metadata (optional)
 */
export const logActivity = ({ providerId, providerName, companyName, type, description, metadata = {} }) => {
    try {
        // Create activity object
        const activity = {
            id: `activity-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            providerId,
            providerName,
            companyName,
            type,
            description: description || activityDescriptions[type] || 'Performed an action',
            metadata,
            timestamp: new Date().toISOString()
        };

        // Load existing activities
        const existingActivities = getActivities();

        // Add new activity at the beginning (newest first)
        existingActivities.unshift(activity);

        // Keep only the last 100 activities to prevent storage overflow
        const trimmedActivities = existingActivities.slice(0, 100);

        // Save to localStorage
        localStorage.setItem(ACTIVITIES_KEY, JSON.stringify(trimmedActivities));

        return activity;
    } catch (error) {
        console.error('Error logging activity:', error);
        return null;
    }
};

/**
 * Get all activities from localStorage
 * @returns {Array} Array of activity objects
 */
export const getActivities = () => {
    try {
        const activities = localStorage.getItem(ACTIVITIES_KEY);
        return activities ? JSON.parse(activities) : [];
    } catch (error) {
        console.error('Error getting activities:', error);
        return [];
    }
};

/**
 * Get activities for a specific provider
 * @param {string} providerId - Provider's user ID
 * @returns {Array} Array of activity objects for the provider
 */
export const getProviderActivities = (providerId) => {
    try {
        const activities = getActivities();
        return activities.filter(activity => activity.providerId === providerId);
    } catch (error) {
        console.error('Error getting provider activities:', error);
        return [];
    }
};

/**
 * Get recent activities (limited count)
 * @param {number} limit - Maximum number of activities to return
 * @returns {Array} Array of recent activity objects
 */
export const getRecentActivities = (limit = 10) => {
    try {
        const activities = getActivities();
        return activities.slice(0, limit);
    } catch (error) {
        console.error('Error getting recent activities:', error);
        return [];
    }
};

/**
 * Clear all activities (admin function)
 */
export const clearActivities = () => {
    try {
        localStorage.removeItem(ACTIVITIES_KEY);
        return true;
    } catch (error) {
        console.error('Error clearing activities:', error);
        return false;
    }
};

export default {
    ActivityTypes,
    logActivity,
    getActivities,
    getProviderActivities,
    getRecentActivities,
    clearActivities
};
