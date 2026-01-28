import { apiService } from './apiService';

export const noteService = {
  async getNotes(params = {}) {
    const query = new URLSearchParams();
    if (params.pinned !== undefined) query.append('pinned', params.pinned);
    if (params.color) query.append('color', params.color);
    if (params.page) query.append('page', params.page);

    const queryString = query.toString();
    return apiService.get(`/notes${queryString ? '?' + queryString : ''}`);
  },

  async createNote(data) {
    return apiService.post('/notes', data);
  },

  async updateNote(id, data) {
    return apiService.put(`/notes/${id}`, data);
  },

  async deleteNote(id) {
    return apiService.delete(`/notes/${id}`);
  },

  async getNote(id) {
    return apiService.get(`/notes/${id}`);
  },
};
