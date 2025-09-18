// src/lib/users.js - User management API calls
import api from './api';

// Get all users with filters
export const getUsers = async (params = {}) => {
  const response = await api.get('/users', { params });
  return response.data;
};

// Get single user by ID
export const getUserById = async (id) => {
  const response = await api.get(`/users/${id}`);
  return response.data;
};

// Update user
export const updateUser = async (id, updates) => {
  const response = await api.put(`/users/${id}`, updates);
  return response.data;
};

// Delete user
export const deleteUser = async (id) => {
  const response = await api.delete(`/users/${id}`);
  return response.data;
};

// Update user status (active/suspended)
export const updateUserStatus = async (id, status) => {
  const response = await api.patch(`/users/${id}/status`, { status });
  return response.data;
};

// Get user statistics
export const getUserStats = async () => {
  const response = await api.get('/users/stats');
  return response.data;
};