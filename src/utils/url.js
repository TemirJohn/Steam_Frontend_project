import { API_BASE_URL } from '../config/api';

export const buildAssetUrl = (path) => {
    if (!path) {
        return '';
    }

    if (path.startsWith('http://') || path.startsWith('https://')) {
        return path;
    }

    const normalizedPath = path.replace(/^\/+/, '');
    return `${API_BASE_URL}/${normalizedPath}`;
};

