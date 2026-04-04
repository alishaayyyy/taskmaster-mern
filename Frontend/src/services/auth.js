import API from './api.js';

export const authService = {
  async login(email, password) {
    const response = await API.post('/user/login', { email, password });
    localStorage.setItem('token', response.data.token);
    return response.data;
  },

  async signup(name, email, password) {
    const response = await API.post('/user/register', { name, email, password });
    localStorage.setItem('token', response.data.token);
    return response.data;
  },

  async getCurrentUser() {
    const response = await API.get('/user/me');
    return response.data.user;  // Backend me user object return hota hai
  },

  async updateProfile(name, email) {
    const response = await API.put('/user/profile', { name, email });
    return response.data.user;
  },

  async updatePassword(currentPassword, newPassword) {
    const response = await API.put('/user/password', { 
      currentPassword, 
      newPassword 
    });
    return response.data;
  },

  logout() {
    localStorage.removeItem('token');
  },

  isAuthenticated() {
    return !!localStorage.getItem('token');
  }
};