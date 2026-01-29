import { apiService } from './apiService';

export const noteService = {
  getNotes() {
    return apiService.get('/notes');
  },

  getNoteById(id) {
    return apiService.get(`/notes/${id}`);
  },

  createNote(data) {
    return apiService.post('/notes', data);
  },

  updateNote(id, data) {
    return apiService.put(`/notes/${id}`, data);
  },

  deleteNote(id) {
    return apiService.delete(`/notes/${id}`);
  },
};
