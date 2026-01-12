import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Request interceptor
api.interceptors.request.use((config) => {
  // Only add Authorization header for requests **other than login/register**
  if (!config.url.includes('/auth/login/') && !config.url.includes('/auth/register/')) {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }

  // CSRF token
  const csrfToken = document.cookie
    .split('; ')
    .find(row => row.startsWith('csrftoken='))
    ?.split('=')[1];
  if (csrfToken) {
    config.headers['X-CSRFToken'] = csrfToken;
  }

  return config;
});

export const loginUser = async ({ email, password }) => {
  // Do not include any Authorization header for login
  const response = await api.post('/api/v1/auth/login/', { email, password });
  return response.data;
};

export const registerUser = async ({ name, email, password, role }) => {
  const response = await api.post('/api/v1/auth/register/', { name, email, password, role });
  return response.data;
};

export const logoutUser = async () => {
  const refresh = localStorage.getItem('refreshToken');
  if (refresh) {
    await api.post('/api/v1/auth/logout/', { refresh });
  }
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('user');
};

export default api;
