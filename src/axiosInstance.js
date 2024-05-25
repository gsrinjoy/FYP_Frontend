// src/axiosInstance.js
import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'https://api.femizone.in/api',
});

axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        const originalRequest = error.config;
        if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                const refreshToken = localStorage.getItem('refreshToken');
                const response = await axios.post('https://api.femizone.in/api/refresh/', { refresh: refreshToken });
                const newAccessToken = response.data.access;
                localStorage.setItem('token', newAccessToken);
                axiosInstance.defaults.headers['Authorization'] = `Bearer ${newAccessToken}`;
                originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
                return axiosInstance(originalRequest);
            } catch (refreshError) {
                console.error('Refresh token is invalid or expired');
                window.location.href = '/auth';
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;
