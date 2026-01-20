import api from './api.js';

export const userService = {
  getUsers: async (search = '') => {
    const response = await api.get('/users', {
      params: { search },
    });
    return response.data;
  },

  getUser: async (userId) => {
    const response = await api.get(`/users/${userId}`);
    return response.data;
  },

  updateProfile: async (profileData) => {
    const response = await api.put('/users/profile', profileData);
    return response.data;
  },
};




