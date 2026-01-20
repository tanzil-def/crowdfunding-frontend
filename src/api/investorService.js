import axiosInstance from "./axiosInstance";

const investorService = {
    // --- Dashboard ---
    getDashboardSummary: async () => {
        const response = await axiosInstance.get("/api/v1/dashboard/investor/");
        return response.data;
    },

    // --- Projects Marketplace ---
    browseProjects: async (params) => {
        const response = await axiosInstance.get("/api/v1/projects/browse/", { params });
        return response.data;
    },

    compareProjects: async (params) => {
        const response = await axiosInstance.get("/api/v1/projects/compare/", { params });
        return response.data;
    },

    getProjectDetail: async (id) => {
        const response = await axiosInstance.get(`/api/v1/projects/${id}/detail/`);
        return response.data;
    },

    // --- Access Management ---
    requestAccess: async (projectId, reason) => {
        const response = await axiosInstance.post("/api/v1/access-requests/", {
            project: projectId,
            reason: reason,
        });
        return response.data;
    },

    getMyAccessRequests: async (params) => {
        const response = await axiosInstance.get("/api/v1/access-requests/my/", { params });
        return response.data;
    },

    // --- Investment Flow ---
    initiateInvestment: async (data) => {
        // data = { project_id, shares_requested, idempotency_key? }
        const response = await axiosInstance.post("/api/v1/investments/initiate/", data);
        return response.data;
    },

    getInvestmentDetail: async (id) => {
        const response = await axiosInstance.get(`/api/v1/investments/${id}/`);
        return response.data;
    },

    getMyInvestments: async (params) => {
        const response = await axiosInstance.get("/api/v1/investments/my/", { params });
        return response.data;
    },

    getPortfolioSummary: async () => {
        const response = await axiosInstance.get("/api/v1/investments/portfolio/summary/");
        return response.data;
    },

    // --- Favorites ---
    getFavorites: async (params) => {
        const response = await axiosInstance.get("/api/v1/favorites/list/", { params });
        return response.data;
    },

    addToFavorites: async (projectId) => {
        const response = await axiosInstance.post("/api/v1/favorites/", { project: projectId });
        return response.data;
    },

    removeFromFavorites: async (favoriteId) => {
        const response = await axiosInstance.delete(`/api/v1/favorites/${favoriteId}/`);
        return response.data;
    },
};

export default investorService;
