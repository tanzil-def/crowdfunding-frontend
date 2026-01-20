import axiosInstance from './axiosInstance';

/**
 * Admin Service
 * Handles all Admin-role specific API calls.
 * Base URL: /api/v1/
 */
const adminService = {
    // Dashboard: Matches backend 'api/v1/dashboard/admin/'
    getDashboardSummary: async () => {
        const { data } = await axiosInstance.get('/api/v1/dashboard/admin/');
        return data.data || data;
    },

    // Projects (Admin Review)
    getPendingProjects: async (params = {}) => {
        const { data } = await axiosInstance.get('/api/v1/projects/admin/projects/pending/', { params });
        return data.data || data;
    },

    approveProject: async (id) => {
        const { data } = await axiosInstance.post(`/api/v1/projects/admin/projects/${id}/approve/`);
        return data.data || data;
    },

    rejectProject: async (id, reason) => {
        const { data } = await axiosInstance.post(`/api/v1/projects/admin/projects/${id}/reject/`, { reason });
        return data.data || data;
    },

    requestChanges: async (id, note) => {
        const { data } = await axiosInstance.post(`/api/v1/projects/admin/projects/${id}/request-changes/`, { note });
        return data.data || data;
    },

    // Access Requests (Admin Only)
    getAccessRequests: async (params = {}) => {
        const { data } = await axiosInstance.get('/api/v1/access-requests/admin/list/', { params });
        return data.data || data;
    },

    approveAccessRequest: async (id) => {
        const { data } = await axiosInstance.post(`/api/v1/access-requests/admin/${id}/approve/`);
        return data.data || data;
    },

    rejectAccessRequest: async (id, reason) => {
        const { data } = await axiosInstance.post(`/api/v1/access-requests/admin/${id}/reject/`, { reason });
        return data.data || data;
    },

    revokeAccessRequest: async (id, reason) => {
        const { data } = await axiosInstance.post(`/api/v1/access-requests/admin/${id}/revoke/`, { reason });
        return data.data || data;
    },

    // Audit Logs
    getAuditLogs: async (params = {}) => {
        const { data } = await axiosInstance.get('/api/v1/audit/admin/audit-logs/', { params });
        return data.data || data;
    },

    // Payments / Transactions
    getPayments: async (params = {}) => {
        const { data } = await axiosInstance.get('/api/v1/investments/admin/transactions/', { params });
        return data.data || data;
    },

    // Alias for getPayments to match component expectations
    getTransactions: async (params = {}) => {
        const { data } = await axiosInstance.get('/api/v1/investments/admin/transactions/', { params });
        return data.data || data;
    },

    getTransactionDetail: async (id) => {
        const { data } = await axiosInstance.get(`/api/v1/investments/admin/transactions/${id}/detail/`);
        return data.data || data;
    },

    // User Management
    getUsers: async (params = {}) => {
        const { data } = await axiosInstance.get('/api/v1/auth/admin/users/', { params });
        return data.data || data;
    },
};

export default adminService;
