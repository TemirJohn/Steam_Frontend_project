const API_PROTOCOL = process.env.REACT_APP_USE_HTTPS === 'true' ? 'https' : 'http';
const API_HOST = process.env.REACT_APP_API_HOST || 'localhost';
const API_PORT = process.env.REACT_APP_API_PORT || '3000';

export const API_BASE_URL = `${API_PROTOCOL}://${API_HOST}:${API_PORT}`;

// For convenience
export const API_ENDPOINTS = {
    LOGIN: `${API_BASE_URL}/login`,
    REGISTER: `${API_BASE_URL}/users`,
    GAMES: `${API_BASE_URL}/games`,
    CATEGORIES: `${API_BASE_URL}/categories`,
    REVIEWS: `${API_BASE_URL}/reviews`,
    LIBRARY: `${API_BASE_URL}/library`,
    OWNERSHIP: `${API_BASE_URL}/ownership`,
    USERS: `${API_BASE_URL}/users`,

    // 🆕 CONCURRENT ENDPOINTS
    GAMES_DETAILS: (id) => `${API_BASE_URL}/games/${id}/details`,
    LIBRARY_DETAILED: `${API_BASE_URL}/library/detailed`,
    SEARCH_ADVANCED: `${API_BASE_URL}/games/search/advanced`,
    DASHBOARD_STATS: `${API_BASE_URL}/admin/dashboard/stats`,
    BULK_UPDATE_PRICES: `${API_BASE_URL}/admin/games/bulk-update-prices`,
    VALIDATE_GAMES: `${API_BASE_URL}/admin/games/validate-all`,
};

console.log('🌐 API Base URL:', API_BASE_URL);