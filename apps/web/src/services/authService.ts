import api from './api';

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
