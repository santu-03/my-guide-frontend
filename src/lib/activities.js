// src/lib/activities.js
import api from '@/lib/api';
export const createActivity = (payload) => api.post('/activities', payload).then(r => r.data);
export const listFeaturedActivities = (limit=8) => api.get(`/activities?featured=true&limit=${limit}`).then(r=>r.data);
