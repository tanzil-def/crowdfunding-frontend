import axiosInstance from './axiosInstance';

const authService = {
    // Login
    login: async (email, password) => {
        const { data } = await axiosInstance.post('/api/v1/auth/login/', {
            email,
            password,
        });
        return data.data || data;
    },

    // Register
    register: async (userData) => {
        const { data } = await axiosInstance.post('/api/v1/auth/register/', userData);
        return data.data || data;
    },

    // Get user profile
    getProfile: async () => {
        const { data } = await axiosInstance.get('/api/v1/auth/profile/');
        return data.data || data;
    },

    // Verify email
    verifyEmail: async (token) => {
        const { data } = await axiosInstance.post('/api/v1/auth/verify-email/', {
            token,
        });
        return data.data || data;
    },

    // Request password reset (Forgot password)
    forgotPassword: async (email) => {
        const { data } = await axiosInstance.post('/api/v1/auth/password-reset/', {
            email,
        });
        return data.data || data;
    },

    // Confirm password reset
    resetPassword: async (token, password, password_confirm) => {
        const { data } = await axiosInstance.post('/api/v1/auth/password-reset-confirm/', {
            token,
            password,
            password_confirm: password_confirm || password
        });
        return data.data || data;
    },

    // Google Login
    googleLogin: async (googleToken, role = 'INVESTOR') => {
        const { data } = await axiosInstance.post('/api/v1/auth/google/', {
            token: googleToken,
            role,
        });
        return data.data || data;
    },

    // Logout
    logout: async () => {
        try {
            const refresh = localStorage.getItem('refreshToken');
            if (refresh) {
                await axiosInstance.post('/api/v1/auth/logout/', { refresh });
            }
        } catch (error) {
            console.error("Logout error:", error);
        } finally {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('user');
        }
    },
};

export default authService;
