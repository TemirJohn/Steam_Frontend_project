// src/config/api.js

// Определяем, запущены ли мы локально (npm start)
const isDevelopment = process.env.NODE_ENV === 'development';

// Если разработка -> идем напрямую на бэкенд (8080)
// Если продакшен (Docker/Nginx) -> идем через относительный путь /api
export const API_BASE_URL = isDevelopment 
    ? 'https://localhost:8080' 
    : '/api';

// Остальной код остается без изменений
export const API_ENDPOINTS = {
    LOGIN: `${API_BASE_URL}/login`,
    REGISTER: `${API_BASE_URL}/users`,
    GAMES: `${API_BASE_URL}/games`,
    CATEGORIES: `${API_BASE_URL}/categories`,
    REVIEWS: `${API_BASE_URL}/reviews`,
    LIBRARY: `${API_BASE_URL}/library`,
    OWNERSHIP: `${API_BASE_URL}/ownership`,
    USERS: `${API_BASE_URL}/users`,

    // CONCURRENT ENDPOINTS
    GAMES_DETAILS: (id) => `${API_BASE_URL}/games/${id}/details`,
    LIBRARY_DETAILED: `${API_BASE_URL}/library/detailed`,
    SEARCH_ADVANCED: `${API_BASE_URL}/games/search/advanced`,
    DASHBOARD_STATS: `${API_BASE_URL}/admin/dashboard/stats`,
    BULK_UPDATE_PRICES: `${API_BASE_URL}/admin/games/bulk-update-prices`,
    VALIDATE_GAMES: `${API_BASE_URL}/admin/games/validate-all`,
};

console.log('🌐 API Base URL:', API_BASE_URL);
console.log('🔧 Environment:', process.env.NODE_ENV);