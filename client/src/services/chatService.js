import api from './api.js';

export const chatService = {
  getChats: async () => {
    const response = await api.get('/chats');
    return response.data;
  },

  createOrGetChat: async (userId) => {
    const response = await api.post('/chats', { userId });
    return response.data;
  },

  getChat: async (chatId) => {
    const response = await api.get(`/chats/${chatId}`);
    return response.data;
  },

  getMessages: async (chatId, page = 1, limit = 50) => {
    const response = await api.get(`/chats/${chatId}/messages`, {
      params: { page, limit },
    });
    return response.data;
  },
};




