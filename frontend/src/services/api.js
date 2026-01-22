import axios from 'axios';

// Base API instance for Insights
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || '/api/insights', // Default base for insights
    headers: {
        'Content-Type': 'application/json',
    },
});

// Separate instance or direct call for Filters if mount point differs
const filterApi = axios.create({
    baseURL: import.meta.env.VITE_API_URL || '/api', // Base /api
    headers: {
        'Content-Type': 'application/json',
    },
});

export const getInsights = async (filters = {}) => {
    try {
        const cleanFilters = {};
        for (const key in filters) {
            // Strictly exclude All and empty strings.
            // Data import now ensures years are numbers, so strings '2018' from params are fine (express/mongo type casting handles it or regex)
            // But we should send numbers if possible.
            // Actually URL params are always strings.
            if (filters[key] && filters[key] !== "All" && filters[key] !== "") {
                cleanFilters[key] = filters[key];
            }
        }

        const params = new URLSearchParams(cleanFilters);
        const response = await api.get(`/?${params}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching insights:', error);
        throw error;
    }
};

export const getFilters = async () => {
    try {
        // User requested GET /api/filters
        const response = await filterApi.get('/filters');
        return response.data;
    } catch (error) {
        console.error('Error fetching filters:', error);
        throw error;
    }
}

export default api;
