import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || '',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to attach JWT token
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor for token refresh
axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // Handle Network Errors (no response from server)
        if (!error.response) {
            console.error("Network Error: Please check if the backend server is running and reachable.", error.message);
            return Promise.reject(new Error("Network Error: Impossible to connect to the server."));
        }

        // If 401 and we haven't retried yet
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const refreshToken = localStorage.getItem('refreshToken');
                if (!refreshToken) {
                    throw new Error('No refresh token');
                }

                // Attempt to refresh the token using a clean axios instance to avoid infinite loops
                const refreshResponse = await axios.post(
                    `${import.meta.env.VITE_API_BASE_URL || ''}/api/v1/auth/token/refresh/`,
                    { refresh: refreshToken }
                );

                const { access } = refreshResponse.data.data || refreshResponse.data;
                localStorage.setItem('accessToken', access);

                // Retry original request with new token
                originalRequest.headers.Authorization = `Bearer ${access}`;
                return axiosInstance(originalRequest);
            } catch (refreshError) {
                console.error("Session expired. Redirecting to login...");
                // Refresh failed, logout user
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');
                localStorage.removeItem('user');
                window.location.href = '/login';
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;
