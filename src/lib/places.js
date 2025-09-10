// src/lib/places.js
import api from '@/lib/api';
export const createPlace = (payload) => api.post('/places', payload).then(r => r.data);
export const listFeaturedPlaces = (limit=6) => api.get(`/places?featured=true&limit=${limit}`).then(r=>r.data);
