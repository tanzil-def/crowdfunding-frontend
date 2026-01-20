import axiosInstance from "./axiosInstance";

const authService = {
    login: async (email, password) => {
        const response = await axiosInstance.post("/api/v1/auth/login/", { email, password });
        return response.data;
    },

    register: async (data) => {
        const response = await axiosInstance.post("/api/v1/auth/register/", data);
        return response.data;
    },

    verifyEmail: async (token) => {
        const response = await axiosInstance.post("/api/v1/auth/verify-email/", { token });
        return response.data;
    },

    requestPasswordReset: async (email) => {
        const response = await axiosInstance.post("/api/v1/auth/password-reset/", { email });
        return response.data;
    },

    confirmPasswordReset: async (token, password) => {
        const response = await axiosInstance.post("/api/v1/auth/password-reset-confirm/", {
            token,
            password,
            password_confirm: password,
        });
        return response.data;
    },

    logout: async () => {
        const refresh = localStorage.getItem("refreshToken");
        if (refresh) {
            try {
                await axiosInstance.post("/api/v1/auth/logout/", { refresh });
            } catch (e) {
                console.error("Logout error:", e);
            }
        }
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("user");
    },

    getProfile: async () => {
        const response = await axiosInstance.get("/api/v1/auth/profile/");
        return response.data;
    },
};

export default authService;
