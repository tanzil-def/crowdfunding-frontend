import axiosInstance from './axiosInstance';

/**
 * Investor Service
 * Handles all Investor-role specific API calls.
 * Base URL: /api/v1/
 */
const investorService = {
    // Dashboard: Matches backend 'api/v1/dashboard/investor/'
    getDashboardSummary: async () => {
        const { data } = await axiosInstance.get('/api/v1/dashboard/investor/');
        return data.data || data;
    },

    // Portfolio Summary
    getPortfolioSummary: async () => {
        const { data } = await axiosInstance.get('/api/v1/investments/portfolio/summary/');
        return data.data || data;
    },

    // Browse Projects
    getBrowseProjects: async (params = {}) => {
        const { data } = await axiosInstance.get('/api/v1/projects/browse/', { params });
        return data.data || data;
    },

    // Alias for getBrowseProjects to match BrowseProjects component
    browseProjects: async (params = {}) => {
        const { data } = await axiosInstance.get('/api/v1/projects/browse/', { params });
        return data.data || data;
    },

    getProjectDetail: async (id) => {
        const { data } = await axiosInstance.get(`/api/v1/projects/${id}/detail/`);
        return data.data || data;
    },

    // Investments
    initiateInvestment: async (investmentData) => {
        const { data } = await axiosInstance.post('/api/v1/investments/initiate/', investmentData);
        return data.data || data;
    },

    getMyInvestments: async (params = {}) => {
        const { data } = await axiosInstance.get('/api/v1/investments/my/', { params });
        return data.data || data;
    },

    getInvestmentDetail: async (id) => {
        const { data } = await axiosInstance.get(`/api/v1/investments/${id}/`);
        return data.data || data;
    },

    // Favorites
    addToFavorites: async (projectId) => {
        const { data } = await axiosInstance.post('/api/v1/favorites/', { project: projectId });
        return data.data || data;
    },

    removeFromFavorites: async (favId) => {
        const { data } = await axiosInstance.delete(`/api/v1/favorites/${favId}/`);
        return data.data || data;
    },

    getFavorites: async (params = {}) => {
        const { data } = await axiosInstance.get('/api/v1/favorites/list/', { params });
        return data.data || data;
    },

    // Compare Projects
    compareProjects: async (ids) => {
        const { data } = await axiosInstance.get('/api/v1/projects/compare/', {
            params: { project_ids: ids.join(',') },
        });
        return data.data || data;
    },

    // Requests
    getRequests: async (params = {}) => {
        const { data } = await axiosInstance.get('/api/v1/access-requests/my/', { params });
        return data.data || data;
    },

    createAccessRequest: async (requestData) => {
        const { data } = await axiosInstance.post('/api/v1/access-requests/', requestData);
        return data.data || data;
    },

    // Alias for createAccessRequest where reason is provided directly
    requestAccess: async (projectId, reason) => {
        const { data } = await axiosInstance.post('/api/v1/access-requests/', {
            project: projectId,
            reason: reason
        });
        return data.data || data;
    },

    // Notifications: Clean fallback for production stability
    getNotifications: async () => {
        try {
            const { data } = await axiosInstance.get('/api/v1/notifications/');
            const result = data.data || data;
            return result;
        } catch (error) {
            console.error("Notification Service Error:", error);
            return { results: [], count: 0 }; // Consistent empty state
        }
    },

    markNotificationRead: async (id) => {
        const { data } = await axiosInstance.patch(`/api/v1/notifications/${id}/read/`);
        return data.data || data;
    }
};

export default investorService;
