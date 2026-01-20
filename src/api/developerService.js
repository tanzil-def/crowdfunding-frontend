import axiosInstance from "./axiosInstance";

const developerService = {
    // --- Dashboard ---
    getDashboardSummary: async () => {
        const response = await axiosInstance.get("/api/v1/dashboard/developer/");
        return response.data;
    },

    // --- Project Management ---
    getMyProjects: async (params) => {
        const response = await axiosInstance.get("/api/v1/projects/my/", { params });
        return response.data;
    },

    createProject: async (data) => {
        const response = await axiosInstance.post("/api/v1/projects/", data);
        return response.data;
    },

    updateProject: async (id, data) => {
        const response = await axiosInstance.put(`/api/v1/projects/${id}/`, data);
        return response.data;
    },

    patchProject: async (id, data) => {
        const response = await axiosInstance.patch(`/api/v1/projects/${id}/`, data);
        return response.data;
    },

    submitProjectForReview: async (id) => {
        const response = await axiosInstance.post(`/api/v1/projects/${id}/submit/`);
        return response.data;
    },

    // --- Media Management ---
    uploadProjectMedia: async (id, formData) => {
        const response = await axiosInstance.post(`/api/v1/projects/${id}/media/`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        return response.data;
    },

    getProjectMedia: async (id, params) => {
        const response = await axiosInstance.get(`/api/v1/projects/${id}/media/list/`, { params });
        return response.data;
    },

    // --- Project Details ---
    getProjectDetail: async (id) => {
        const response = await axiosInstance.get(`/api/v1/projects/${id}/detail/`);
        return response.data;
    },

    // --- Notifications ---
    getNotifications: async (params) => {
        const response = await axiosInstance.get("/api/v1/notifications/", { params });
        return response.data;
    },

    markNotificationRead: async (id) => {
        const response = await axiosInstance.post(`/api/v1/notifications/${id}/read/`);
        return response.data;
    },
};

export default developerService;
