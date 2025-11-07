import axios from 'axios';
import { API_BASE_URL } from './api';

// Создаём настроенный instance axios
const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// CSRF token storage
let csrfToken = null;

// Function to fetch CSRF token
export const fetchCSRFToken = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/csrf-token`);
        csrfToken = response.data.csrf_token;
        console.log('🛡️ CSRF token fetched:', csrfToken);
        return csrfToken;
    } catch (error) {
        console.error('Failed to fetch CSRF token:', error);
        throw error;
    }
};

// Автоматически добавляем токен и CSRF к каждому запросу
axiosInstance.interceptors.request.use(
    async (config) => {
        // Add JWT token
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        // Add CSRF token for non-GET requests
        if (config.method !== 'get' && config.method !== 'head' && config.method !== 'options') {
            // If no CSRF token, fetch it
            if (!csrfToken) {
                await fetchCSRFToken();
            }
            
            if (csrfToken) {
                config.headers['X-CSRF-Token'] = csrfToken;
            }
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Обработка ответов
axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // If CSRF token is invalid or expired, fetch new one and retry
        if (error.response?.status === 403 && 
            error.response?.data?.error?.includes('CSRF') &&
            !originalRequest._retry) {
            
            originalRequest._retry = true;
            console.log('🔄 CSRF token invalid, fetching new one...');
            
            try {
                await fetchCSRFToken();
                // Retry the request with new token
                originalRequest.headers['X-CSRF-Token'] = csrfToken;
                return axiosInstance(originalRequest);
            } catch (err) {
                return Promise.reject(err);
            }
        }

        // If JWT token is invalid, logout
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            csrfToken = null; // Clear CSRF token too
            window.location.href = '/login';
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;