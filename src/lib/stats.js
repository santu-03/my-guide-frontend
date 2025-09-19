// // src/lib/stats.js - Dashboard statistics API calls
// import api from './api';

// // Get dashboard statistics
// export const getDashboardStats = async () => {
//   const response = await api.get('/stats/dashboard');
//   return response.data;
// };

// // Get activity statistics
// export const getActivityStats = async (activityId) => {
//   const response = await api.get(`/stats/activities/${activityId}`);
//   return response.data;
// };

// // Get place statistics  
// export const getPlaceStats = async (placeId) => {
//   const response = await api.get(`/stats/places/${placeId}`);
//   return response.data;
// };

// // Get user analytics
// export const getUserAnalytics = async () => {
//   const response = await api.get('/stats/users');
//   return response.data;
// };

// // Get booking statistics
// export const getBookingStats = async (params = {}) => {
//   const response = await api.get('/stats/bookings', { params });
//   return response.data;
// };

// // Get revenue analytics
// export const getRevenueStats = async (params = {}) => {
//   const response = await api.get('/stats/revenue', { params });
//   return response.data;
// };