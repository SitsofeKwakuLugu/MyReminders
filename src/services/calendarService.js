import { apiService } from './apiService';

export const calendarService = {
  async getEvents(params = {}) {
    const query = new URLSearchParams();
    if (params.start_date) query.append('start_date', params.start_date);
    if (params.end_date) query.append('end_date', params.end_date);
    if (params.page) query.append('page', params.page);

    const queryString = query.toString();
    return apiService.get(`/calendar-events${queryString ? '?' + queryString : ''}`);
  },

  async createEvent(data) {
    return apiService.post('/calendar-events', data);
  },

  async updateEvent(id, data) {
    return apiService.put(`/calendar-events/${id}`, data);
  },

  async deleteEvent(id) {
    return apiService.delete(`/calendar-events/${id}`);
  },

  async getEvent(id) {
    return apiService.get(`/calendar-events/${id}`);
  },
};
