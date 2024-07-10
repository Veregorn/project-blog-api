import axios from 'axios';

// Configuring the base URL for our API
const api = axios.create({
  baseURL: 'http://localhost:3001',
});

// Interceptor to add the token to the request headers
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

export default api;