import axiosInstance from './axiosInstance';

/**
 * Developer Service
 * Handles all Developer-role specific API calls.
 * Base URL is handled by axiosInstance.
 */
const developerService = {

    // Dashboard: Matches backend 'api/v1/dashboard/developer/'
    getDashboardSummary: async () => {
        const { data } = await axiosInstance.get('/api/v1/dashboard/developer/');
        return data.data || data;
    },

    // Projects: Matches backend 'api/v1/projects/my/'
    getMyProjects: async (params = {}) => {
        const { data } = await axiosInstance.get('/api/v1/projects/my/', { params });
        return data.data || data;
    },

    getProject: async (id) => {
        const { data } = await axiosInstance.get(`/api/v1/projects/${id}/detail/`);
        return data.data || data;
    },

    // Alias for getProject to match some components
    getProjectDetail: async (id) => {
        const { data } = await axiosInstance.get(`/api/v1/projects/${id}/detail/`);
        return data.data || data;
    },

    createProject: async (projectData) => {
        const { data } = await axiosInstance.post('/api/v1/projects/', projectData);
        return data.data || data;
    },

    updateProject: async (id, projectData) => {
        const { data } = await axiosInstance.put(`/api/v1/projects/${id}/`, projectData);
        return data.data || data;
    },

    deleteProject: async (id) => {
        await axiosInstance.delete(`/api/v1/projects/${id}/`);
        return true;
    },

    // Media: Uses FormData for file uploads
    uploadMedia: async (id, formData) => {
        const { data } = await axiosInstance.post(
            `/api/v1/projects/${id}/media/`,
            formData,
            { headers: { 'Content-Type': 'multipart/form-data' } }
        );
        return data.data || data;
    },

    // Alias for uploadMedia to match component expectations
    uploadProjectMedia: async (id, formData) => {
        const { data } = await axiosInstance.post(
            `/api/v1/projects/${id}/media/`,
            formData,
            { headers: { 'Content-Type': 'multipart/form-data' } }
        );
        return data.data || data;
    },

    getProjectMedia: async (id) => {
        const { data } = await axiosInstance.get(`/api/v1/projects/${id}/media/list/`);
        return data.data || data;
    },

    deleteMedia: async (projectId, mediaId) => {
        await axiosInstance.delete(`/api/v1/projects/${projectId}/media/${mediaId}/`);
        return true;
    },

    // Submit for review
    submitProject: async (id) => {
        const { data } = await axiosInstance.post(`/api/v1/projects/${id}/submit/`);
        return data.data || data;
    },

    // Alias for submitProject
    submitProjectForReview: async (id) => {
        const { data } = await axiosInstance.post(`/api/v1/projects/${id}/submit/`);
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

export default developerService;
