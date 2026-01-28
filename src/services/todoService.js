import { apiService } from './apiService';

export const todoService = {
  async getTodos(params = {}) {
    const query = new URLSearchParams();
    if (params.completed !== undefined) query.append('completed', params.completed);
    if (params.category) query.append('category', params.category);
    if (params.priority) query.append('priority', params.priority);
    if (params.page) query.append('page', params.page);

    const queryString = query.toString();
    return apiService.get(`/todos${queryString ? '?' + queryString : ''}`);
  },

  async createTodo(data) {
    return apiService.post('/todos', data);
  },

  async updateTodo(id, data) {
    return apiService.put(`/todos/${id}`, data);
  },

  async deleteTodo(id) {
    return apiService.delete(`/todos/${id}`);
  },

  async getTodo(id) {
    return apiService.get(`/todos/${id}`);
  },
};
