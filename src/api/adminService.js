import axiosInstance from "./axiosInstance";

const adminService = {
    // --- Dashboard ---
    getDashboardSummary: async () => {
        const response = await axiosInstance.get("/api/v1/dashboard/admin/");
        return response.data;
    },

    // --- Access Management ---
    getAccessRequests: async (params) => {
        const response = await axiosInstance.get("/api/v1/access-requests/my/", { params }); // Note: Using /my/ or admin list? Backend schema says /api/v1/access-requests/ for list
        return response.data;
    },

    approveAccessRequest: async (id) => {
        const response = await axiosInstance.post(`/api/v1/access-requests/admin/${id}/approve/`);
        return response.data;
    },

    rejectAccessRequest: async (id, reason) => {
        const response = await axiosInstance.post(`/api/v1/access-requests/admin/${id}/reject/`, { reason });
        return response.data;
    },

    revokeAccessRequest: async (id, reason) => {
        const response = await axiosInstance.post(`/api/v1/access-requests/admin/${id}/revoke/`, { reason });
        return response.data;
    },

    // --- Project Approval Flow ---
    getPendingProjects: async (params) => {
        const response = await axiosInstance.get("/api/v1/projects/admin/projects/pending/", { params });
        return response.data;
    },

    approveProject: async (id) => {
        const response = await axiosInstance.post(`/api/v1/projects/admin/projects/${id}/approve/`);
        return response.data;
    },

    rejectProject: async (id, reason) => {
        const response = await axiosInstance.post(`/api/v1/projects/admin/projects/${id}/reject/`, { reason });
        return response.data;
    },

    requestProjectChanges: async (id, note) => {
        const response = await axiosInstance.post(`/api/v1/projects/admin/projects/${id}/request-changes/`, { note });
        return response.data;
    },

    // --- Finance & Transactions ---
    getTransactions: async (params) => {
        const response = await axiosInstance.get("/api/v1/investments/admin/transactions/", { params });
        return response.data;
    },

    getTransactionDetail: async (id) => {
        const response = await axiosInstance.get(`/api/v1/investments/admin/transactions/${id}/`);
        return response.data;
    },

    // --- Audit Logs ---
    getAuditLogs: async (params) => {
        const response = await axiosInstance.get("/api/v1/audit/admin/audit-logs/", { params });
        return response.data;
    },
};

export default adminService;
