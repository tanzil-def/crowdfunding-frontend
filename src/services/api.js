import axios from "axios";

// =======================
// BASE CONFIGURATION
// =======================
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: false,
});

// =======================
// INTERCEPTORS
// =======================
api.interceptors.request.use(
  (config) => {
    // 1. Check for public endpoints that usually don't need auth
    const publicEndpoints = [
      "/api/v1/auth/login/",
      "/api/v1/auth/register/",
      "/api/v1/auth/verify-email/",
      "/api/v1/auth/password-reset/",
      "/api/v1/auth/password-reset-confirm/",
    ];

    const isPublic = publicEndpoints.some((endpoint) =>
      config.url.includes(endpoint)
    );

    // 2. Attach Token if available
    if (!isPublic) {
      const token = localStorage.getItem("accessToken");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    // 3. Attach CSRF Token (if using Session Auth / Cookies alongside JWT)
    const csrfToken = document.cookie
      .split("; ")
      .find((row) => row.startsWith("csrftoken="))
      ?.split("=")[1];

    if (csrfToken) {
      config.headers["X-CSRFToken"] = csrfToken;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error)
);

// =======================
// AUTH SERVICES
// =======================
// POST /api/v1/auth/login/
export const loginUser = async ({ email, password }) => {
  const response = await api.post("/api/v1/auth/login/", { email, password });
  return response.data;
};

// POST /api/v1/auth/register/
export const registerUser = async (data) => {
  const response = await api.post("/api/v1/auth/register/", data);
  return response.data;
};

// POST /api/v1/auth/verify-email/
export const verifyEmail = async (token) => {
  const response = await api.post("/api/v1/auth/verify-email/", { token });
  return response.data;
};

// POST /api/v1/auth/password-reset/
export const requestPasswordReset = async (email) => {
  const response = await api.post("/api/v1/auth/password-reset/", { email });
  return response.data;
};

// POST /api/v1/auth/password-reset-confirm/
export const confirmPasswordReset = async (token, password) => {
  const response = await api.post("/api/v1/auth/password-reset-confirm/", {
    token,
    password,
    password_confirm: password, // Swagger shows password_confirm
  });
  return response.data;
};

// POST /api/v1/auth/logout/
export const logoutUser = async () => {
  const refresh = localStorage.getItem("refreshToken");
  if (refresh) {
    try {
      await api.post("/api/v1/auth/logout/", { refresh });
    } catch (e) {
      console.error("Logout error:", e);
    }
  }
  // Cleanup local storage
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("user");
};

// GET /api/v1/auth/profile/
export const getMyProfile = async () => {
  const response = await api.get("/api/v1/auth/profile/");
  return response.data;
};


// =======================
// DASHBOARD SERVICES
// =======================
// GET /api/v1/dashboard/admin/
export const getAdminDashboard = async () => {
  const response = await api.get("/api/v1/dashboard/admin/");
  return response.data;
};

// GET /api/v1/dashboard/developer/
export const getDeveloperDashboard = async () => {
  const response = await api.get("/api/v1/dashboard/developer/");
  return response.data;
};

// GET /api/v1/dashboard/investor/
export const getInvestorDashboard = async () => {
  const response = await api.get("/api/v1/dashboard/investor/");
  return response.data;
};


// =======================
// PROJECT SERVICES
// =======================

// POST /api/v1/projects/ (Create - Developer)
export const createProject = async (data) => {
  const response = await api.post("/api/v1/projects/", data);
  return response.data;
};

// GET /api/v1/projects/my/ (Developer's Projects)
export const getMyProjects = async (params) => {
  const response = await api.get("/api/v1/projects/my/", { params });
  return response.data;
};

// Alias for getMyProjects as requested
export const getDeveloperProjects = getMyProjects;

// GET /api/v1/projects/browse/ (Investor Browse)
export const browseProjects = async (params) => {
  const response = await api.get("/api/v1/projects/browse/", { params });
  return response.data;
};

// GET /api/v1/projects/compare/ (Investor Compare)
export const compareProjects = async (params) => {
  const response = await api.get("/api/v1/projects/compare/", { params });
  return response.data;
};

// GET /api/v1/projects/{id}/detail/ (Read Approved Project w/ restricted filtering)
export const getProjectDetail = async (id) => {
  const response = await api.get(`/api/v1/projects/${id}/detail/`);
  return response.data;
};

// PUT /api/v1/projects/{id}/
export const updateProject = async (id, data) => {
  const response = await api.put(`/api/v1/projects/${id}/`, data);
  return response.data;
};

// DELETE /api/v1/projects/{id}/
export const deleteProject = async (id) => {
  const response = await api.delete(`/api/v1/projects/${id}/`);
  return response.data;
};

// POST /api/v1/projects/{id}/submit/
export const submitProjectForReview = async (id) => {
  const response = await api.post(`/api/v1/projects/${id}/submit/`);
  return response.data;
};

// POST /api/v1/projects/{id}/media/
export const uploadProjectMedia = async (id, formData) => {
  const response = await api.post(`/api/v1/projects/${id}/media/`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

// GET /api/v1/projects/{id}/media/list/
export const getProjectMedia = async (id) => {
  const response = await api.get(`/api/v1/projects/${id}/media/list/`);
  return response.data;
};

// --- ADMIN PROJECT ACTIONS ---

// GET /api/v1/projects/admin/projects/pending/
export const getAdminPendingProjects = async (params) => {
  const response = await api.get("/api/v1/projects/admin/projects/pending/", { params });
  return response.data;
};

// POST /api/v1/projects/admin/projects/{id}/approve/
export const approveProject = async (id) => {
  const response = await api.post(`/api/v1/projects/admin/projects/${id}/approve/`);
  return response.data;
};

// POST /api/v1/projects/admin/projects/{id}/reject/
export const rejectProject = async (id, reason) => {
  const response = await api.post(`/api/v1/projects/admin/projects/${id}/reject/`, { reason });
  return response.data;
};

// POST /api/v1/projects/admin/projects/{id}/request-changes/
export const requestProjectChanges = async (id, changes) => {
  const response = await api.post(`/api/v1/projects/admin/projects/${id}/request-changes/`, { changes });
  return response.data;
};


// =======================
// ACCESS REQUEST SERVICES
// =======================

// POST /api/v1/access-requests/ (Generic create)
export const claimAccess = async (projectId, reason) => {
  // Note: The UI function might need to be renamed to requestRestrictedAccess logic
  // But payload is { project: UUID, reason: string }
  const response = await api.post("/api/v1/access-requests/", {
    project: projectId,
    reason: reason
  });
  return response.data;
};
// Alias for backward compatibility if needed, but better to update UI
export const requestRestrictedAccess = claimAccess;

// GET /api/v1/access-requests/my/
export const getMyAccessRequests = async (params) => {
  const response = await api.get("/api/v1/access-requests/my/", { params });
  return response.data;
};

// GET /api/v1/access-requests/ (Admin view - using generic list endpoint if restricted by role)
export const getAdminAccessRequests = async (params) => {
  const response = await api.get("/api/v1/access-requests/", { params });
  return response.data;
};

// POST /api/v1/access-requests/admin/{id}/approve/
export const approveAccessRequest = async (id) => {
  const response = await api.post(`/api/v1/access-requests/admin/${id}/approve/`);
  return response.data;
};

// POST /api/v1/access-requests/admin/{id}/reject/
export const rejectAccessRequest = async (id, reason) => {
  const response = await api.post(`/api/v1/access-requests/admin/${id}/reject/`, { reason });
  return response.data;
};

// POST /api/v1/access-requests/admin/{id}/revoke/
export const revokeAccessRequest = async (id, reason) => {
  const response = await api.post(`/api/v1/access-requests/admin/${id}/revoke/`, { reason });
  return response.data;
};


// =======================
// INVESTMENT SERVICES
// =======================

// POST /api/v1/investments/initiate/
export const initiateInvestment = async (data) => {
  // data = { project_id, shares_requested, idempotency_key? }
  const response = await api.post("/api/v1/investments/initiate/", data);
  return response.data;
};

// GET /api/v1/investments/my/
export const getMyInvestments = async (params) => {
  const response = await api.get("/api/v1/investments/my/", { params });
  return response.data;
};

// GET /api/v1/investments/{id}/
export const getInvestmentDetail = async (id) => {
  const response = await api.get(`/api/v1/investments/${id}/`);
  return response.data;
};

// GET /api/v1/investments/portfolio/summary/
export const getPortfolioSummary = async () => {
  const response = await api.get("/api/v1/investments/portfolio/summary/");
  return response.data;
};

// GET /api/v1/investments/admin/transactions/
export const getAdminTransactions = async (params) => {
  const response = await api.get("/api/v1/investments/admin/transactions/", { params });
  return response.data;
};

// GET /api/v1/investments/admin/transactions/{id}/
export const getAdminTransactionDetail = async (id) => {
  const response = await api.get(`/api/v1/investments/admin/transactions/${id}/`);
  return response.data;
};


// =======================
// FAVORITE SERVICES
// =======================

// POST /api/v1/favorites/
export const addToFavorites = async (project_id) => {
  const response = await api.post("/api/v1/favorites/", { project: project_id });
  return response.data;
};

// DELETE /api/v1/favorites/{id}/
export const removeFromFavorites = async (id) => {
  const response = await api.delete(`/api/v1/favorites/${id}/`);
  return response.data;
};

// GET /api/v1/favorites/list/
export const getFavorites = async (params) => {
  const response = await api.get("/api/v1/favorites/list/", { params });
  return response.data;
};


// =======================
// COMMON & AUDIT SERVICES
// =======================

// GET /api/v1/notifications/
export const getNotifications = async (params) => {
  const response = await api.get("/api/v1/notifications/", { params });
  return response.data;
};

// POST /api/v1/notifications/{id}/read/
export const markNotificationRead = async (id) => {
  const response = await api.post(`/api/v1/notifications/${id}/read/`);
  return response.data;
};

// GET /api/v1/audit/admin/audit-logs/
// (Note: Swagger had "GET /api/v1/audit/admin/audit-logs/" title but "/admin/audit-logs/" desc. 
// Using strict path from swagger Title if possible, or common DRF pattern.)
export const getAdminAuditLogs = async (params) => {
  const response = await api.get("/api/v1/audit/admin/audit-logs/", { params });
  return response.data;
};

export default api;