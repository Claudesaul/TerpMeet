import axios from 'axios';

const API_BASE_URL = import.meta.env.PROD ? '/api' : 'http://localhost:5001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// User APIs
export const createUser = (userData) => api.post('/users', userData);
export const getAllUsers = () => api.get('/users');
export const getUser = (id) => api.get(`/users/${id}`);
export const updateUser = (id, userData) => api.put(`/users/${id}`, userData);
export const deleteUser = (id) => api.delete(`/users/${id}`);
export const loginUser = async (username, password) => {
  const response = await api.get('/users');
  const user = response.data.find(
    u => u.username === username && u.password === password
  );
  return user;
};

// Event APIs
export const createEvent = (eventData) => api.post('/events', eventData);
export const getAllEvents = () => api.get('/events');
export const getEvent = (id) => api.get(`/events/${id}`);
export const updateEvent = (id, eventData) => api.put(`/events/${id}`, eventData);
export const deleteEvent = (id) => api.delete(`/events/${id}`);
export const attendEvent = (eventId, userId) => api.post(`/events/${eventId}/attend`, { userId });
export const leaveEvent = (eventId, userId) => api.delete(`/events/${eventId}/attend`, { data: { userId } });
export const sendMessage = (eventId, userId, text) => api.post(`/events/${eventId}/messages`, { userId, text });

export default api;
