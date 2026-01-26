import axios from 'axios';

// Base API instance for Insights
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL
        ? `${import.meta.env.VITE_API_URL}/api/insights`
        : '/api/insights',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Separate instance or direct call for Filters
const filterApi = axios.create({
    baseURL: import.meta.env.VITE_API_URL
        ? `${import.meta.env.VITE_API_URL}/api`
        : '/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

export const getInsights = async (filters = {}) => {
    try {
        const cleanFilters = {};
        for (const key in filters) {
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
