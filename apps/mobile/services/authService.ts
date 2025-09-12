import axios from 'axios';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://192.168.100.9:4000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    // Get token from AsyncStorage
    // This is a simplified version - in a real app you'd get it from AsyncStorage
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // In a real app, you'd get the refresh token from AsyncStorage
        // and handle the refresh logic here
        throw new Error('Token refresh not implemented');
      } catch (refreshError) {
        // Refresh failed, redirect to login
        throw refreshError;
      }
    }

    return Promise.reject(error);
  }
);

export const authService = {
  async login(email: string, password: string) {
    const response = await api.post('/auth/login', { email, password });
    return response.data.data;
  },

  async register(nombre: string, email: string, password: string) {
    const response = await api.post('/auth/register', { nombre, email, password });
    return response.data.data;
  },

  async refreshToken(refreshToken: string) {
    const response = await api.post('/auth/refresh', { refreshToken });
    return response.data.data;
  },

  async logout() {
    await api.post('/auth/logout');
  },

  async getProfile() {
    const response = await api.get('/auth/me');
    return response.data.data;
  },
};
