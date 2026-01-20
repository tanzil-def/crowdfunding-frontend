import axios from "axios";

const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000",
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: false,
});

// Request interceptor for token injection
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("accessToken");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        // CSRF Token logic if needed
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

// Response interceptor for global error handling
axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        const isLoginRequest = error.config?.url?.includes("/api/v1/auth/login/");
        if (error.response?.status === 401 && !isLoginRequest) {
            // Handle unauthorized access (e.g., logout or refresh token)
            console.error("Unauthorized access - logic for refresh token goes here if needed");
            // Optional: force logout if token is expired and refresh fails
            // localStorage.clear();
            // window.location.href = "/login";
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;
