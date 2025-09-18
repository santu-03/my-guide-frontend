// src/lib/activities.js - Updated with full CRUD operations
import api from './api';

// Get all activities with filters and pagination
export const getActivities = async (params = {}) => {
  const response = await api.get('/activities', { params });
  return response.data;
};

// Get single activity by ID
export const getActivityById = async (id) => {
  const response = await api.get(`/activities/${id}`);
  return response.data;
};

// Create new activity
export const createActivity = (payload) => api.post('/activities', payload).then(r => r.data);

// Update existing activity
export const updateActivity = async (id, payload) => {
  const response = await api.put(`/activities/${id}`, payload);
  return response.data;
};

// Delete activity
export const deleteActivity = async (id) => {
  const response = await api.delete(`/activities/${id}`);
  return response.data;
};

// Get featured activities
export const listFeaturedActivities = (limit = 8) => 
  api.get(`/activities?featured=true&limit=${limit}`).then(r => r.data);

// Get activities by place
export const getActivitiesByPlace = async (placeId, params = {}) => {
  const response = await api.get(`/activities/place/${placeId}`, { params });
  return response.data;
};

// Toggle featured status
export const toggleActivityFeatured = async (id) => {
  const response = await api.patch(`/activities/${id}/toggle-featured`);
  return response.data;
};

// Toggle published status  
export const toggleActivityPublished = async (id) => {
  const response = await api.patch(`/activities/${id}/toggle-published`);
  return response.data;
};