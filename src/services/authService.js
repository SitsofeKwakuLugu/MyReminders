import { apiService } from './apiService';

const STORAGE_KEY = "auth_user";
const TOKEN_KEY = "auth_token";

export const authService = {
  async login(email, password) {
    const response = await apiService.post('/auth/login', { email, password });
    
    localStorage.setItem(TOKEN_KEY, response.token);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(response.user));
    
    return response.user;
  },

  async signup({ name, email, password }) {
    const response = await apiService.post('/auth/register', {
      name,
      email,
      password,
    });
    
    localStorage.setItem(TOKEN_KEY, response.token);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(response.user));
    
    return response.user;
  },

  async logout() {
    try {
      await apiService.post('/auth/logout', {});
    } catch (error) {
      console.error('Logout error:', error);
    }
    
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(STORAGE_KEY);
    return true;
  },

  getCurrentUser() {
    const user = localStorage.getItem(STORAGE_KEY);
    return user ? JSON.parse(user) : null;
  },

  getToken() {
    return localStorage.getItem(TOKEN_KEY);
  },

  async updateProfile(data) {
    const response = await apiService.put('/auth/profile', data);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(response.user));
    return response.user;
  },

  async changePassword(currentPassword, newPassword) {
    return apiService.post('/auth/change-password', {
      current_password: currentPassword,
      password: newPassword,
    });
  },

  async getProfile() {
    return apiService.get('/auth/profile');
  },
};
