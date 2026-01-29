import { apiService } from './apiService';

export const todoService = {
  getTodos() {
    return apiService.get('/todos');
  },

  getTodo(id) {
    return apiService.get(`/todos/${id}`);
  },

  createTodo(data) {
    return apiService.post('/todos', data);
  },

  updateTodo(id, data) {
    return apiService.put(`/todos/${id}`, data);
  },

  deleteTodo(id) {
    return apiService.delete(`/todos/${id}`);
  },

  createSubTodo(parentId, data) {
    return apiService.post(`/todos/${parentId}/subtodos`, data);
  },

  updateSubTodo(parentId, subId, data) {
    return apiService.put(`/todos/${parentId}/subtodos/${subId}`, data);
  },

  deleteSubTodo(parentId, subId) {
    return apiService.delete(`/todos/${parentId}/subtodos/${subId}`);
  },
};
