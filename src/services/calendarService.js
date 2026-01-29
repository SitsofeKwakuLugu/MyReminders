import { apiService } from './apiService';

export const calendarService = {
  getEvents() {
    return apiService.get('/events');
  },

  getEventById(id) {
    return apiService.get(`/events/${id}`);
  },

  createEvent(data) {
    return apiService.post('/events', data);
  },

  updateEvent(id, data) {
    return apiService.put(`/events/${id}`, data);
  },

  deleteEvent(id) {
    return apiService.delete(`/events/${id}`);
  },
};
