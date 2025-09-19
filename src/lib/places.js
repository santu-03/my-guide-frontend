// src/lib/places.js - Updated with full CRUD operations
import api from './api';

// Get all places with filters and pagination
export const getPlaces = async (params = {}) => {
  const response = await api.get('/places', { params });
  return response.data;
};

// Get single place by ID
export const getPlaceById = async (id) => {
  const response = await api.get(`/places/${id}`);
  return response.data;
};

// Create new place
export const createPlace = (payload) => api.post('/places', payload).then(r => r.data);

// Update existing place
export const updatePlace = async (id, payload) => {
  const response = await api.put(`/places/${id}`, payload);
  return response.data;
};

// Delete place
export const deletePlace = async (id) => {
  const response = await api.delete(`/places/${id}`);
  return response.data;
};

// Get featured places
export const listFeaturedPlaces = (limit = 6) => 
  api.get(`/places?featured=true&limit=${limit}`).then(r => r.data);

// Toggle featured status
export const togglePlaceFeatured = async (id) => {
  const response = await api.patch(`/places/${id}/toggle-featured`);
  return response.data;
};

// Get places by city or category
export const getPlacesByFilter = async (filterType, filterValue, params = {}) => {
  const response = await api.get(`/places?${filterType}=${filterValue}`, { params });
  return response.data;
};