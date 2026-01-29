import { apiService } from './apiService';

export const authService = {
  async login(email, password) {
    const response = await apiService.post('/auth/login', { email, password });
    if (response.token) {
      localStorage.setItem('auth_token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
    }
    return response.user;
  },

  async signup(data) {
    const response = await apiService.post('/auth/register', data);
    if (response.token) {
      localStorage.setItem('auth_token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
    }
    return response.user;
  },

  getCurrentUser() {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  async logout() {
    await apiService.post('/auth/logout', {});
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
  },

  async getProfile() {
    return apiService.get('/auth/profile');
  },

  async updateProfile(data) {
    const response = await apiService.put('/auth/profile', data);
    localStorage.setItem('user', JSON.stringify(response));
    return response;
  },

  async changePassword(currentPassword, newPassword) {
    return apiService.post('/auth/change-password', {
      current_password: currentPassword,
      password: newPassword,
      password_confirmation: newPassword,
    });
  },
};
