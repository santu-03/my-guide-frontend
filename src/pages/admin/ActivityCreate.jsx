// // import { useEffect, useState, useCallback } from "react";
// // import { useNavigate } from "react-router-dom";
// // import axios from "axios";

// // import DashboardLayout from '@/components/Layout/DashboardLayout';
// // import Button from '@/components/ui/Button';
// // import { Card, CardContent } from '@/components/ui/Card';
// // import {
// //   Upload,
// //   X,
// //   MapPin,
// //   Clock,
// //   DollarSign,
// //   Users,
// //   Star,
// //   Eye,
// //   Save,
// //   ArrowLeft,
// //   Loader2,
// // } from 'lucide-react';
// // import toast from 'react-hot-toast';

// // /* ---------------- local API (aligned with your backend) ---------------- */
// // const API_BASE =
// //   import.meta.env.VITE_BACKEND_URL ||
// //   import.meta.env.VITE_API_URL ||
// //   'http://localhost:5000/api';

// // const api = axios.create({ baseURL: API_BASE });


// // // Activities
// // async function createActivity(payload) {
// //   // payload: {title, description, category, price, durationMinutes, place, featured, isPublished, capacity?, tags[], images[] (string urls) }
// //   return api.post('/activities', payload);
// // }

// // // Places (list for select)
// // async function getPlaces({ limit = 200 } = {}) {
// //   return api.get('/places', { params: { limit } });
// // }

// // // Uploads: prefer bulk, then fallback to single
// // async function uploadMediaMany(files) {
// //   const list = Array.from(files || []);
// //   if (!list.length) return [];

// //   const toUrl = (x) =>
// //     typeof x === 'string'
// //       ? x
// //       : x?.url || x?.secure_url || x?.Location || x?.location || '';

// //   // 1) Try /upload/many
// //   try {
// //     const fd = new FormData();
// //     list.forEach((f) => fd.append('images', f));
// //     const r = await api.post('/upload/many', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
// //     const out = r?.data?.urls || r?.data?.files || r?.data?.data || r?.data || [];
// //     const urls = (Array.isArray(out) ? out : [out]).map(toUrl).filter(Boolean);
// //     if (urls.length) return urls;
// //   } catch {
// //     // ignore and try alternative
// //   }

// //   // 2) Try /media/upload-many
// //   try {
// //     const fd = new FormData();
// //     list.forEach((f) => fd.append('images', f));
// //     const r = await api.post('/media/upload-many', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
// //     const out = r?.data?.urls || r?.data?.files || r?.data?.data || r?.data || [];
// //     const urls = (Array.isArray(out) ? out : [out]).map(toUrl).filter(Boolean);
// //     if (urls.length) return urls;
// //   } catch {
// //     // ignore and fallback to singles
// //   }

// //   // 3) Fallback: single /upload per file
// //   const urls = [];
// //   for (const f of list) {
// //     const fd = new FormData();
// //     fd.append('file', f);
// //     const r = await api.post('/upload', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
// //     const item = r?.data?.data || r?.data;
// //     const url = toUrl(item);
// //     if (url) urls.push(url);
// //   }
// //   return urls;
// // }

// // // Minimal shim for user (no global store)
// // function useAuthStore() {
// //   try {
// //     const user = JSON.parse(localStorage.getItem('user') || 'null');
// //     const isAuthenticated = !!localStorage.getItem('token');
// //     return { user, isAuthenticated };
// //   } catch {
// //     return { user: null, isAuthenticated: false };
// //   }
// // }
// // /* ---------------------------------------------------------------------- */

// // export default function ActivityCreate() {
// //   const navigate = useNavigate();
// //   const { user } = useAuthStore();

// //   const [form, setForm] = useState({
// //     title: '',
// //     description: '',
// //     category: '',
// //     price: '',
// //     durationMinutes: 60,
// //     placeId: '',
// //     featured: false,
// //     isPublished: true,
// //     tags: '',
// //     capacity: '',
// //   });

// //   // images => string[] (URLs) per your model
// //   const [images, setImages] = useState([]);
// //   const [places, setPlaces] = useState([]);
// //   const [dragActive, setDragActive] = useState(false);
// //   const [loading, setLoading] = useState(false);
// //   const [uploadingImages, setUploadingImages] = useState(false);
// //   const [placesLoading, setPlacesLoading] = useState(true);

// //   // Load places
// //   useEffect(() => {
// //     (async () => {
// //       try {
// //         setPlacesLoading(true);
// //         const response = await getPlaces({ limit: 200 });
// //         const placesData =
// //           response?.data?.places ||
// //           response?.data?.docs ||
// //           response?.data ||
// //           response?.places ||
// //           response?.docs ||
// //           response ||
// //           [];
// //         setPlaces(Array.isArray(placesData) ? placesData : []);
// //       } catch (error) {
// //         console.error('Error fetching places:', error);
// //         toast.error('Failed to load places');
// //         setPlaces([]);
// //       } finally {
// //         setPlacesLoading(false);
// //       }
// //     })();
// //   }, []);

// //   const handleChange = (e) => {
// //     const { name, value, type, checked } = e.target;
// //     setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
// //   };

// //   // Upload images -> urls[]
// //   const handleImageUpload = async (fileList) => {
// //     const files = Array.from(fileList || []);
// //     if (!files.length) return;
// //     try {
// //       setUploadingImages(true);
// //       const urls = await uploadMediaMany(files); // string[]
// //       if (urls?.length) {
// //         setImages((prev) => [...prev, ...urls]);
// //         toast.success(`${urls.length} image${urls.length > 1 ? 's' : ''} uploaded`);
// //       }
// //     } catch (err) {
// //       console.error('Image upload error:', err);
// //       toast.error('Image upload failed');
// //     } finally {
// //       setUploadingImages(false);
// //     }
// //   };

// //   const removeImage = (idx) => setImages((prev) => prev.filter((_, i) => i !== idx));

// //   const handleDrag = (e) => {
// //     e.preventDefault();
// //     e.stopPropagation();
// //     if (e.type === 'dragenter' || e.type === 'dragover') setDragActive(true);
// //     if (e.type === 'dragleave') setDragActive(false);
// //   };

// //   const handleDrop = (e) => {
// //     e.preventDefault();
// //     e.stopPropagation();
// //     setDragActive(false);
// //     if (e.dataTransfer.files?.length) {
// //       handleImageUpload(e.dataTransfer.files);
// //     }
// //   };

// //   const handleSubmit = async (e) => {
// //     e.preventDefault();
// //     if (loading) return;

// //     // Validations aligned to your schema
// //     if (!form.title.trim()) return toast.error('Activity title is required');
// //     if (!form.placeId) return toast.error('Select a place');
// //     if (!form.category) return toast.error('Select a category');

// //     const priceNum = Number(form.price);
// //     if (!Number.isFinite(priceNum) || priceNum < 0 || priceNum > 50000)
// //       return toast.error('Price must be between 0 and 50000');

// //     const duration = Number(form.durationMinutes) || 60;
// //     if (duration < 15 || duration > 1440)
// //       return toast.error('Duration must be between 15 and 1440 minutes');

// //     if (form.capacity) {
// //       const cap = Number(form.capacity);
// //       if (!Number.isFinite(cap) || cap < 1 || cap > 100)
// //         return toast.error('Capacity must be between 1 and 100');
// //     }

// //     if (!images.length) return toast.error('Add at least one image');

// //     try {
// //       setLoading(true);

// //       const payload = {
// //         title: form.title.trim(),
// //         description: (form.description || '').trim(),
// //         category: form.category.trim(),
// //         price: priceNum,
// //         durationMinutes: duration,
// //         place: form.placeId, // ObjectId string field name = "place"
// //         featured: !!form.featured,
// //         isPublished: !!form.isPublished,
// //         capacity: form.capacity ? Number(form.capacity) : undefined,
// //         tags: form.tags
// //           ? form.tags
// //               .split(',')
// //               .map((t) => t.trim())
// //               .filter(Boolean)
// //               .map((t) => t.slice(0, 50))
// //           : [],
// //         images, // string[] (URLs)
// //       };

// //       await createActivity(payload);
// //       toast.success('Activity created');
// //       navigate('/admin/activities');
// //     } catch (error) {
// //       console.error('Error creating activity:', error);
// //       const message = error?.response?.data?.message || error?.message;
// //       if (error?.response?.status === 400) toast.error(message || 'Invalid data');
// //       else if (error?.response?.status === 401) toast.error('Unauthorized');
// //       else toast.error(message || 'Failed to create activity');
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   const categories = [
// //     'cultural',
// //     'nature',
// //     'art',
// //     'spiritual',
// //     'food',
// //     'adventure',
// //     'entertainment',
// //     'shopping',
// //     'historical',
// //   ];

// //   return (
// //     <DashboardLayout role="admin" title="Create Activity" user={user}>
// //       {/* Header */}
// //       <div className="flex items-center gap-4 mb-6">
// //         <Button
// //           variant="outline"
// //           onClick={() => navigate('/admin/activities')}
// //           className="inline-flex items-center gap-2"
// //         >
// //           <ArrowLeft className="h-4 w-4" />
// //           Back to Activities
// //         </Button>
// //         <div>
// //           <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Create New Activity</h1>
// //           <p className="text-gray-600 dark:text-gray-400">Add a new tour activity</p>
// //         </div>
// //       </div>

// //       <form onSubmit={handleSubmit} className="space-y-6">
// //         {/* Basic Information */}
// //         <Card>
// //           <CardContent className="p-6">
// //             <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
// //               Basic Information
// //             </h2>

// //             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
// //               {/* Title */}
// //               <div className="md:col-span-2">
// //                 <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
// //                   Activity Title *
// //                 </label>
// //                 <input
// //                   type="text"
// //                   name="title"
// //                   value={form.title}
// //                   onChange={handleChange}
// //                   required
// //                   placeholder="e.g., Heritage Walk at Victoria Memorial"
// //                   className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-800"
// //                 />
// //               </div>

// //               {/* Category */}
// //               <div>
// //                 <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
// //                   Category *
// //                 </label>
// //                 <select
// //                   name="category"
// //                   value={form.category}
// //                   onChange={handleChange}
// //                   required
// //                   className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-800"
// //                 >
// //                   <option value="">Select category</option>
// //                   {categories.map((c) => (
// //                     <option key={c} value={c} className="capitalize">
// //                       {c}
// //                     </option>
// //                   ))}
// //                 </select>
// //               </div>

// //               {/* Price */}
// //               <div>
// //                 <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
// //                   Price (₹) *
// //                 </label>
// //                 <div className="relative">
// //                   <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
// //                   <input
// //                     type="number"
// //                     name="price"
// //                     value={form.price}
// //                     onChange={handleChange}
// //                     min="0"
// //                     max="50000"
// //                     step="1"
// //                     required
// //                     placeholder="e.g., 499"
// //                     className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-800"
// //                   />
// //                 </div>
// //               </div>

// //               {/* Duration */}
// //               <div>
// //                 <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
// //                   Duration (minutes)
// //                 </label>
// //                 <div className="relative">
// //                   <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
// //                   <input
// //                     type="number"
// //                     name="durationMinutes"
// //                     value={form.durationMinutes}
// //                     onChange={handleChange}
// //                     min="15"
// //                     max="1440"
// //                     step="15"
// //                     className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-800"
// //                   />
// //                 </div>
// //               </div>

// //               {/* Capacity (optional) */}
// //               <div>
// //                 <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
// //                   Capacity (people)
// //                 </label>
// //                 <div className="relative">
// //                   <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
// //                   <input
// //                     type="number"
// //                     name="capacity"
// //                     value={form.capacity}
// //                     onChange={handleChange}
// //                     min="1"
// //                     max="100"
// //                     step="1"
// //                     placeholder="e.g., 20"
// //                     className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-800"
// //                   />
// //                 </div>
// //               </div>

// //               {/* Place */}
// //               <div className="md:col-span-2">
// //                 <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
// //                   Place *
// //                 </label>
// //                 <div className="relative">
// //                   <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
// //                   <select
// //                     name="placeId"
// //                     value={form.placeId}
// //                     onChange={handleChange}
// //                     required
// //                     disabled={placesLoading}
// //                     className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-800"
// //                   >
// //                     <option value="">{placesLoading ? 'Loading places…' : 'Select a place'}</option>
// //                     {places.map((p) => (
// //                       <option key={p._id || p.id} value={p._id || p.id}>
// //                         {p.name} • {(p.city || p.address?.city) ?? '—'}, {(p.country || p.address?.country) ?? '—'}
// //                       </option>
// //                     ))}
// //                   </select>
// //                 </div>
// //               </div>

// //               {/* Tags */}
// //               <div className="md:col-span-2">
// //                 <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
// //                   Tags
// //                 </label>
// //                 <input
// //                   type="text"
// //                   name="tags"
// //                   value={form.tags}
// //                   onChange={handleChange}
// //                   placeholder="heritage, guided tour (comma separated)"
// //                   className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-800"
// //                 />
// //               </div>

// //               {/* Published / Featured */}
// //               <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
// //                 <label className="flex items-center gap-3 cursor-pointer">
// //                   <input
// //                     type="checkbox"
// //                     name="featured"
// //                     checked={form.featured}
// //                     onChange={handleChange}
// //                     className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
// //                   />
// //                   <div className="flex items-center gap-2">
// //                     <Star className="h-4 w-4 text-yellow-500" />
// //                     <span className="text-gray-700 dark:text-gray-300">Featured</span>
// //                   </div>
// //                   <span className="text-sm text-gray-500">(Highlight on homepage)</span>
// //                 </label>

// //                 <label className="flex items-center gap-3 cursor-pointer">
// //                   <input
// //                     type="checkbox"
// //                     name="isPublished"
// //                     checked={form.isPublished}
// //                     onChange={handleChange}
// //                     className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
// //                   />
// //                   <div className="flex items-center gap-2">
// //                     <Eye className="h-4 w-4 text-green-500" />
// //                     <span className="text-gray-700 dark:text-gray-300">Published</span>
// //                   </div>
// //                   <span className="text-sm text-gray-500">(Visible to public)</span>
// //                 </label>
// //               </div>
// //             </div>
// //           </CardContent>
// //         </Card>

// //         {/* Images */}
// //         <Card>
// //           <CardContent className="p-6">
// //             <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Images *</h2>

// //             <div
// //               className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
// //                 dragActive
// //                   ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/10'
// //                   : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
// //               }`}
// //               onDragEnter={handleDrag}
// //               onDragLeave={handleDrag}
// //               onDragOver={handleDrag}
// //               onDrop={handleDrop}
// //             >
// //               <input
// //                 type="file"
// //                 accept="image/*"
// //                 multiple
// //                 onChange={(e) => handleImageUpload(e.target.files)}
// //                 className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
// //               />
// //               <Upload className="h-10 w-10 text-gray-400 mx-auto mb-4" />
// //               <p className="text-gray-600 dark:text-gray-400 mb-2">
// //                 Drop images here or <span className="text-primary-600 font-medium">browse</span>
// //               </p>
// //               <p className="text-sm text-gray-500">
// //                 JPG/PNG/WEBP up to 10MB each. At least one image required.
// //               </p>
// //             </div>

// //             {!!images.length && (
// //               <div className="mt-6">
// //                 <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
// //                   Uploaded Images ({images.length})
// //                 </h3>
// //                 <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
// //                   {images.map((img, idx) => (
// //                     <div key={img + idx} className="relative group">
// //                       <img
// //                         src={img}
// //                         alt={`Activity ${idx}`}
// //                         className="w-full h-24 object-cover rounded-lg"
// //                         onError={(e) => (e.currentTarget.src = '/assets/images/placeholder-image.jpg')}
// //                       />
// //                       {idx === 0 && (
// //                         <div className="absolute bottom-1 left-1 bg-green-500 text-white text-xs px-2 py-1 rounded">
// //                           Main
// //                         </div>
// //                       )}
// //                       <button
// //                         type="button"
// //                         onClick={() => removeImage(idx)}
// //                         className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
// //                         aria-label="Remove image"
// //                       >
// //                         <X className="h-3 w-3" />
// //                       </button>
// //                     </div>
// //                   ))}
// //                 </div>
// //                 <p className="text-xs text-gray-500 mt-2">First image is used as the cover.</p>
// //               </div>
// //             )}

// //             {uploadingImages && (
// //               <div className="flex items-center gap-2 text-sm text-gray-500 mt-3">
// //                 <Loader2 className="h-4 w-4 animate-spin" />
// //                 Uploading images…
// //               </div>
// //             )}
// //           </CardContent>
// //         </Card>

// //         {/* Actions */}
// //         <div className="flex items-center justify-end gap-4">
// //           <Button type="button" variant="outline" onClick={() => navigate('/admin/activities')} disabled={loading}>
// //             Cancel
// //           </Button>
// //           <Button type="submit" disabled={loading} className="inline-flex items-center gap-2">
// //             {loading ? (
// //               <>
// //                 <Loader2 className="h-4 w-4 animate-spin" />
// //                 Saving…
// //               </>
// //             ) : (
// //               <>
// //                 <Save className="h-4 w-4" />
// //                 Create Activity
// //               </>
// //             )}
// //           </Button>
// //         </div>
// //       </form>
// //     </DashboardLayout>
// //   );
// // }
// import { useEffect, useState, useCallback } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";

// import DashboardLayout from '@/components/Layout/DashboardLayout';
// import Button from '@/components/ui/Button';
// import { Card, CardContent } from '@/components/ui/Card';
// import {
//   Upload,
//   X,
//   MapPin,
//   Clock,
//   DollarSign,
//   Users,
//   Star,
//   Eye,
//   Save,
//   ArrowLeft,
//   Loader2,
// } from 'lucide-react';
// import toast from 'react-hot-toast';

// // ======== NEW: auth-aware axios (token + cookies) =========================
// // If you have the real store:  import { useAuthStore } from '@/store/auth';
// function getAuthToken() {
//   // Prefer Zustand (if available)
//   try {
//     const store = window?.__AUTH_STORE__?.getState?.(); // fallback shim
//     if (store?.token) return store.token;
//   } catch {}
//   // Fallbacks your app already uses
//   const local = localStorage.getItem('token');
//   if (local) return local;
//   const sess = sessionStorage.getItem('token');
//   if (sess) return sess;
//   return null;
// }

// const API_BASE =
//   import.meta.env.VITE_API_BASE_URL ||   // align with your auth.js
//   import.meta.env.VITE_BACKEND_URL ||
//   import.meta.env.VITE_API_URL ||
//   'http://localhost:5000/api';

// const api = axios.create({
//   baseURL: API_BASE,
//   withCredentials: true,        // <- allow cookie-based backends
//   timeout: 60_000,              // generous for large uploads
// });

// api.interceptors.request.use((config) => {
//   const t = getAuthToken();
//   if (t) {
//     config.headers.Authorization = `Bearer ${t}`;
//     // config.headers['x-auth-token'] = t; // uncomment if server expects it
//   }
//   return config;
// });

// // helper: safely pick arrays from many envelopes
// function pickArray(res, preferred) {
//   const d = res?.data;
//   if (preferred && Array.isArray(d?.[preferred])) return d[preferred];
//   if (Array.isArray(d?.data)) return d.data;
//   if (Array.isArray(d?.items)) return d.items;
//   if (Array.isArray(d?.results)) return d.results;
//   if (Array.isArray(d?.docs)) return d.docs;
//   if (Array.isArray(d?.places)) return d.places;
//   if (Array.isArray(d?.activities)) return d.activities;
//   if (Array.isArray(d)) return d;
//   return [];
// }

// // ======== API wrappers =====================================================

// async function createActivity(payload) {
//   return api.post('/activities', payload);
// }

// async function getPlaces({ limit = 200 } = {}) {
//   return api.get('/places', { params: { limit } });
// }

// // ==== UPDATED: robust multi-endpoint, multi-field upload ===================

// /**
//  * Normalize any item to a URL string:
//  * - supports { url }, { secure_url }, { location/Location }, string, etc.
//  */
// function toUrl(x) {
//   if (!x) return '';
//   if (typeof x === 'string') return x;
//   return x.url || x.secure_url || x.Location || x.location || x.path || '';
// }

// /**
//  * Append files using a specific field name.
//  */
// function buildFormData(files, field = 'images') {
//   const fd = new FormData();
//   Array.from(files || []).forEach((f) => fd.append(field, f));
//   return fd;
// }

// /**
//  * Try a single endpoint + field name combo and return URL[] on success.
//  */
// async function tryUpload(path, files, field) {
//   const fd = buildFormData(files, field);
//   const r = await api.post(path, fd, {
//     headers: { 'Content-Type': 'multipart/form-data' },
//   });
//   const d = r?.data;
//   // Common shapes:
//   // { urls:[] }, { data:{urls:[]} }, { files:[{url}] }, { data:[{url}] }, string, array of strings/objects…
//   const raw =
//     d?.urls ??
//     d?.data?.urls ??
//     d?.files ??
//     d?.data ??
//     d;
//   const arr = Array.isArray(raw) ? raw : [raw];
//   const urls = arr.map(toUrl).filter(Boolean);
//   return urls;
// }

// /**
//  * Upload many files with several fallbacks:
//  * - endpoints: ['/upload/many', '/uploads', '/media/upload-many', '/media', '/upload']
//  * - field names: ['images', 'files', 'file', 'image']
//  * The first combo that yields URLs wins.
//  */
// async function uploadMediaMany(files) {
//   const list = Array.from(files || []);
//   if (!list.length) return [];

//   // 1) bulk endpoints first
//   const bulkEndpoints = ['/upload/many', '/uploads', '/media/upload-many', '/media'];
//   const fields = ['images', 'files', 'file', 'image'];

//   for (const ep of bulkEndpoints) {
//     for (const field of fields) {
//       try {
//         const urls = await tryUpload(ep, list, field);
//         if (urls.length) return urls;
//       } catch {
//         // try next combo
//       }
//     }
//   }

//   // 2) fallback: single uploads to '/upload' (and variants)
//   const singleEndpoints = ['/upload', '/media/upload', '/file/upload'];
//   const out = [];
//   for (const f of list) {
//     for (const ep of singleEndpoints) {
//       for (const field of fields) {
//         try {
//           const urls = await tryUpload(ep, [f], field);
//           if (urls.length) {
//             out.push(urls[0]);
//             break; // move to next file
//           }
//         } catch {
//           // try next
//         }
//       }
//       if (out.length && out.length >= 1 && out[out.length - 1]) break;
//     }
//   }
//   return out;
// }

// // ==================== Component ===========================================

// export default function ActivityCreate() {
//   const navigate = useNavigate();

//   // If you have a real auth store, get user from there:
//   let user = null;
//   try {
//     user = JSON.parse(localStorage.getItem('user') || 'null');
//   } catch {}

//   const [form, setForm] = useState({
//     title: '',
//     description: '',
//     category: '',
//     price: '',
//     durationMinutes: 60,
//     placeId: '',
//     featured: false,
//     isPublished: true,
//     tags: '',
//     capacity: '',
//   });

//   const [images, setImages] = useState([]);         // string URLs
//   const [places, setPlaces] = useState([]);
//   const [dragActive, setDragActive] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [uploadingImages, setUploadingImages] = useState(false);
//   const [placesLoading, setPlacesLoading] = useState(true);

//   // Load places (auth + safe parse)
//   useEffect(() => {
//     (async () => {
//       try {
//         setPlacesLoading(true);
//         const res = await getPlaces({ limit: 200 });
//         setPlaces(pickArray(res));
//       } catch (e) {
//         console.error('Error fetching places:', e);
//         toast.error('Failed to load places');
//         setPlaces([]);
//       } finally {
//         setPlacesLoading(false);
//       }
//     })();
//   }, []);

//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
//   };

//   // Validate basic file constraints client-side (optional but helpful)
//   function validateFiles(files) {
//     const list = Array.from(files || []);
//     const MAX_MB = 10;
//     const ALLOWED = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
//     for (const f of list) {
//       if (!ALLOWED.includes(f.type)) {
//         toast.error(`Unsupported type: ${f.type || f.name}`);
//         return false;
//       }
//       if (f.size > MAX_MB * 1024 * 1024) {
//         toast.error(`${f.name} is larger than ${MAX_MB}MB`);
//         return false;
//       }
//     }
//     return true;
//   }

//   // Upload images -> urls[]
//   const handleImageUpload = async (fileList) => {
//     const files = Array.from(fileList || []);
//     if (!files.length) return;
//     if (!validateFiles(files)) return;

//     try {
//       setUploadingImages(true);
//       const urls = await uploadMediaMany(files);
//       if (urls?.length) {
//         setImages((prev) => [...prev, ...urls]);
//         toast.success(`${urls.length} image${urls.length > 1 ? 's' : ''} uploaded`);
//       } else {
//         toast.error('Upload endpoint did not return any URLs');
//       }
//     } catch (err) {
//       console.error('Image upload error:', err);
//       const msg = err?.response?.data?.message || err?.message || 'Image upload failed';
//       toast.error(msg);
//     } finally {
//       setUploadingImages(false);
//     }
//   };

//   const removeImage = (idx) => setImages((prev) => prev.filter((_, i) => i !== idx));

//   const handleDrag = (e) => {
//     e.preventDefault();
//     e.stopPropagation();
//     if (e.type === 'dragenter' || e.type === 'dragover') setDragActive(true);
//     if (e.type === 'dragleave') setDragActive(false);
//   };

//   const handleDrop = (e) => {
//     e.preventDefault();
//     e.stopPropagation();
//     setDragActive(false);
//     if (e.dataTransfer.files?.length) {
//       handleImageUpload(e.dataTransfer.files);
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (loading) return;

//     // Validations aligned to your schema
//     if (!form.title.trim()) return toast.error('Activity title is required');
//     if (!form.placeId) return toast.error('Select a place');
//     if (!form.category) return toast.error('Select a category');

//     const priceNum = Number(form.price);
//     if (!Number.isFinite(priceNum) || priceNum < 0 || priceNum > 50000)
//       return toast.error('Price must be between 0 and 50000');

//     const duration = Number(form.durationMinutes) || 60;
//     if (duration < 15 || duration > 1440)
//       return toast.error('Duration must be between 15 and 1440 minutes');

//     if (form.capacity) {
//       const cap = Number(form.capacity);
//       if (!Number.isFinite(cap) || cap < 1 || cap > 100)
//         return toast.error('Capacity must be between 1 and 100');
//     }

//     if (!images.length) return toast.error('Add at least one image');

//     try {
//       setLoading(true);

//       const payload = {
//         title: form.title.trim(),
//         description: (form.description || '').trim(),
//         category: form.category.trim(),
//         price: priceNum,
//         basePrice: priceNum,             // also provide basePrice for other pages
//         durationMinutes: duration,
//         place: form.placeId,             // ObjectId string field name = "place"
//         featured: !!form.featured,
//         isPublished: !!form.isPublished,
//         capacity: form.capacity ? Number(form.capacity) : undefined,
//         tags: form.tags
//           ? form.tags
//               .split(',')
//               .map((t) => t.trim())
//               .filter(Boolean)
//               .map((t) => t.slice(0, 50))
//           : [],
//         images, // string[] URLs returned from upload
//       };

//       await createActivity(payload);
//       toast.success('Activity created');
//       navigate('/admin/activities');
//     } catch (error) {
//       console.error('Error creating activity:', error);
//       const message = error?.response?.data?.message || error?.message;
//       if (error?.response?.status === 400) toast.error(message || 'Invalid data');
//       else if (error?.response?.status === 401) toast.error('Unauthorized');
//       else toast.error(message || 'Failed to create activity');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const categories = [
//     'cultural',
//     'nature',
//     'art',
//     'spiritual',
//     'food',
//     'adventure',
//     'entertainment',
//     'shopping',
//     'historical',
//   ];

//   return (
//     <DashboardLayout role="admin" title="Create Activity" user={user}>
//       {/* Header */}
//       <div className="flex items-center gap-4 mb-6">
//         <Button
//           variant="outline"
//           onClick={() => navigate('/admin/activities')}
//           className="inline-flex items-center gap-2"
//         >
//           <ArrowLeft className="h-4 w-4" />
//           Back to Activities
//         </Button>
//         <div>
//           <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Create New Activity</h1>
//           <p className="text-gray-600 dark:text-gray-400">Add a new tour activity</p>
//         </div>
//       </div>

//       <form onSubmit={handleSubmit} className="space-y-6">
//         {/* Basic Information */}
//         <Card>
//           <CardContent className="p-6">
//             <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
//               Basic Information
//             </h2>

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               {/* Title */}
//               <div className="md:col-span-2">
//                 <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//                   Activity Title *
//                 </label>
//                 <input
//                   type="text"
//                   name="title"
//                   value={form.title}
//                   onChange={handleChange}
//                   required
//                   placeholder="e.g., Heritage Walk at Victoria Memorial"
//                   className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-800"
//                 />
//               </div>

//               {/* Category */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//                   Category *
//                 </label>
//                 <select
//                   name="category"
//                   value={form.category}
//                   onChange={handleChange}
//                   required
//                   className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-800"
//                 >
//                   <option value="">Select category</option>
//                   {categories.map((c) => (
//                     <option key={c} value={c} className="capitalize">
//                       {c}
//                     </option>
//                   ))}
//                 </select>
//               </div>

//               {/* Price */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//                   Price (₹) *
//                 </label>
//                 <div className="relative">
//                   <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
//                   <input
//                     type="number"
//                     name="price"
//                     value={form.price}
//                     onChange={handleChange}
//                     min="0"
//                     max="50000"
//                     step="1"
//                     required
//                     placeholder="e.g., 499"
//                     className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-800"
//                   />
//                 </div>
//               </div>

//               {/* Duration */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//                   Duration (minutes)
//                 </label>
//                 <div className="relative">
//                   <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
//                   <input
//                     type="number"
//                     name="durationMinutes"
//                     value={form.durationMinutes}
//                     onChange={handleChange}
//                     min="15"
//                     max="1440"
//                     step="15"
//                     className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-800"
//                   />
//                 </div>
//               </div>

//               {/* Capacity (optional) */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//                   Capacity (people)
//                 </label>
//                 <div className="relative">
//                   <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
//                   <input
//                     type="number"
//                     name="capacity"
//                     value={form.capacity}
//                     onChange={handleChange}
//                     min="1"
//                     max="100"
//                     step="1"
//                     placeholder="e.g., 20"
//                     className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-800"
//                   />
//                 </div>
//               </div>

//               {/* Place */}
//               <div className="md:col-span-2">
//                 <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//                   Place *
//                 </label>
//                 <div className="relative">
//                   <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
//                   <select
//                     name="placeId"
//                     value={form.placeId}
//                     onChange={handleChange}
//                     required
//                     disabled={placesLoading}
//                     className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-800"
//                   >
//                     <option value="">{placesLoading ? 'Loading places…' : 'Select a place'}</option>
//                     {places.map((p) => (
//                       <option key={p._id || p.id} value={p._id || p.id}>
//                         {p.name || p.title} • {(p.city || p.address?.city) ?? '—'}, {(p.country || p.address?.country) ?? '—'}
//                       </option>
//                     ))}
//                   </select>
//                 </div>
//               </div>

//               {/* Tags */}
//               <div className="md:col-span-2">
//                 <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//                   Tags
//                 </label>
//                 <input
//                   type="text"
//                   name="tags"
//                   value={form.tags}
//                   onChange={handleChange}
//                   placeholder="heritage, guided tour (comma separated)"
//                   className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-800"
//                 />
//               </div>

//               {/* Published / Featured */}
//               <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
//                 <label className="flex items-center gap-3 cursor-pointer">
//                   <input
//                     type="checkbox"
//                     name="featured"
//                     checked={form.featured}
//                     onChange={handleChange}
//                     className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
//                   />
//                   <div className="flex items-center gap-2">
//                     <Star className="h-4 w-4 text-yellow-500" />
//                     <span className="text-gray-700 dark:text-gray-300">Featured</span>
//                   </div>
//                   <span className="text-sm text-gray-500">(Highlight on homepage)</span>
//                 </label>

//                 <label className="flex items-center gap-3 cursor-pointer">
//                   <input
//                     type="checkbox"
//                     name="isPublished"
//                     checked={form.isPublished}
//                     onChange={handleChange}
//                     className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
//                   />
//                   <div className="flex items-center gap-2">
//                     <Eye className="h-4 w-4 text-green-500" />
//                     <span className="text-gray-700 dark:text-gray-300">Published</span>
//                   </div>
//                   <span className="text-sm text-gray-500">(Visible to public)</span>
//                 </label>
//               </div>
//             </div>
//           </CardContent>
//         </Card>

//         {/* Images */}
//         <Card>
//           <CardContent className="p-6">
//             <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Images *</h2>

//             <div
//               className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
//                 dragActive
//                   ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/10'
//                   : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
//               }`}
//               onDragEnter={handleDrag}
//               onDragLeave={handleDrag}
//               onDragOver={handleDrag}
//               onDrop={handleDrop}
//             >
//               <input
//                 type="file"
//                 accept="image/*"
//                 multiple
//                 onChange={(e) => handleImageUpload(e.target.files)}
//                 className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
//               />
//               <Upload className="h-10 w-10 text-gray-400 mx-auto mb-4" />
//               <p className="text-gray-600 dark:text-gray-400 mb-2">
//                 Drop images here or <span className="text-primary-600 font-medium">browse</span>
//               </p>
//               <p className="text-sm text-gray-500">
//                 JPG/PNG/WEBP up to 10MB each. At least one image required.
//               </p>
//             </div>

//             {!!images.length && (
//               <div className="mt-6">
//                 <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
//                   Uploaded Images ({images.length})
//                 </h3>
//                 <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//                   {images.map((img, idx) => (
//                     <div key={img + idx} className="relative group">
//                       <img
//                         src={img}
//                         alt={`Activity ${idx}`}
//                         className="w-full h-24 object-cover rounded-lg"
//                         onError={(e) => (e.currentTarget.src = '/assets/images/placeholder-image.jpg')}
//                       />
//                       {idx === 0 && (
//                         <div className="absolute bottom-1 left-1 bg-green-500 text-white text-xs px-2 py-1 rounded">
//                           Main
//                         </div>
//                       )}
//                       <button
//                         type="button"
//                         onClick={() => removeImage(idx)}
//                         className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
//                         aria-label="Remove image"
//                       >
//                         <X className="h-3 w-3" />
//                       </button>
//                     </div>
//                   ))}
//                 </div>
//                 <p className="text-xs text-gray-500 mt-2">First image is used as the cover.</p>
//               </div>
//             )}

//             {uploadingImages && (
//               <div className="flex items-center gap-2 text-sm text-gray-500 mt-3">
//                 <Loader2 className="h-4 w-4 animate-spin" />
//                 Uploading images…
//               </div>
//             )}
//           </CardContent>
//         </Card>

//         {/* Actions */}
//         <div className="flex items-center justify-end gap-4">
//           <Button type="button" variant="outline" onClick={() => navigate('/admin/activities')} disabled={loading}>
//             Cancel
//           </Button>
//           <Button type="submit" disabled={loading} className="inline-flex items-center gap-2">
//             {loading ? (
//               <>
//                 <Loader2 className="h-4 w-4 animate-spin" />
//                 Saving…
//               </>
//             ) : (
//               <>
//                 <Save className="h-4 w-4" />
//                 Create Activity
//               </>
//             )}
//           </Button>
//         </div>
//       </form>
//     </DashboardLayout>
//   );
// }

import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import DashboardLayout from '@/components/Layout/DashboardLayout';
import Button from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import {
  Upload,
  X,
  MapPin,
  Clock,
  DollarSign,
  Users,
  Star,
  Eye,
  Save,
  ArrowLeft,
  Loader2,
} from 'lucide-react';
import toast from 'react-hot-toast';

/* ================== Auth-aware axios (no UI changes) ================== */
import { useAuthStore } from "@/store/auth";

const API_BASE =
  import.meta.env.VITE_API_BASE_URL ||
  import.meta.env.VITE_BACKEND_URL ||
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000/api";

function getAuthToken() {
  try { const s = useAuthStore.getState?.(); if (s?.token) return s.token; } catch {}
  return localStorage.getItem("token") || sessionStorage.getItem("token") || null;
}
const api = axios.create({ baseURL: API_BASE, withCredentials: true });
api.interceptors.request.use((cfg) => {
  const t = getAuthToken();
  if (t) cfg.headers.Authorization = `Bearer ${t}`;
  return cfg;
});
/* ===================================================================== */

/* ------------------- helpers (do not change UI) ------------------- */

// 1) Try to find the first array of plain objects anywhere in the response.
function findFirstArrayOfObjects(obj) {
  if (!obj || typeof obj !== 'object') return [];
  if (Array.isArray(obj)) {
    return obj.every((x) => x && typeof x === 'object') ? obj : [];
  }
  for (const k of Object.keys(obj)) {
    const found = findFirstArrayOfObjects(obj[k]);
    if (found.length) return found;
  }
  return [];
}

// 2) Normalize "place-like" objects so the existing <select> can use them.
function normalizePlaces(arr) {
  return (arr || []).map((p) => ({
    _id: p._id || p.id || p.uuid || p.slug || '',
    id:  p._id || p.id || p.uuid || p.slug || '',
    name: p.name || p.title || p.placeName || 'Untitled',
    city:
      p.city ||
      p.location?.city ||
      p.address?.city ||
      p.meta?.city ||
      '',
    country:
      p.country ||
      p.location?.country ||
      p.address?.country ||
      p.meta?.country ||
      '',
  })).filter(x => x.id);
}

// Common small helper to pick arrays when API already uses common envelopes
const pickArray = (res, pref) => {
  const d = res?.data;
  if (pref && Array.isArray(d?.[pref])) return d[pref];
  return [d?.data, d?.items, d?.results, d?.docs, d?.activities, d?.places, d].find(Array.isArray) || [];
};

const categories = [
  'cultural','nature','art','spiritual','food',
  'adventure','entertainment','shopping','historical',
];
/* ------------------------------------------------------------------- */

export default function ActivityCreate() {
  const navigate = useNavigate();
  let user = null; try { user = JSON.parse(localStorage.getItem('user') || 'null'); } catch {}

  /* ------------------------- UI state (unchanged) ------------------------- */
  const [form, setForm] = useState({
    title: '',
    description: '',
    category: '',
    price: '',
    durationMinutes: 60,
    placeId: '',
    featured: false,
    isPublished: true,
    tags: '',
    capacity: '',
  });
  const [images, setImages] = useState([]); // string URLs
  const [dragActive, setDragActive] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [loading, setLoading] = useState(false);

  // places for the <select>
  const [places, setPlaces] = useState([]);
  const [placesLoading, setPlacesLoading] = useState(true);
  /* ----------------------------------------------------------------------- */

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  /* ======================== Fetch places (robust) =========================
     1) Call /api/places?limit=200
     2) Try common envelopes first (data, places, docs, etc.)
     3) If not found, deep-scan the payload to find the first array of objects
     4) Normalize id/name/city/country so the existing UI just works
  ========================================================================= */
  const fetchPlaces = useCallback(async () => {
    try {
      setPlacesLoading(true);

      const res = await api.get('/places', { params: { limit: 200 } });

      // Try common locations first
      let list =
        res?.data?.data ??
        res?.data?.places ??
        res?.data?.docs ??
        res?.data?.results ??
        res?.data?.items ??
        (Array.isArray(res?.data) ? res.data : null);

      // Deep-search if none matched
      if (!Array.isArray(list)) {
        list = findFirstArrayOfObjects(res?.data);
      }

      const normalized = normalizePlaces(list);
      setPlaces(normalized);
    } catch (e) {
      console.error('Error fetching places:', e);
      const msg = e?.response?.data?.message || `Failed to load places (${e?.response?.status || 'network'})`;
      toast.error(msg);
      setPlaces([]);
    } finally {
      setPlacesLoading(false);
    }
  }, []);
  useEffect(() => { fetchPlaces(); }, [fetchPlaces]);
  /* ====================================================================== */

  /* ================= Image upload (to /media/upload) ================= */
  const validateFiles = (fileList) => {
    const files = Array.from(fileList || []);
    if (!files.length) return { ok: false, files: [] };
    const ALLOWED = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
    const MAX = 10 * 1024 * 1024;
    for (const f of files) {
      if (!ALLOWED.includes(f.type)) { toast.error(`Unsupported type: ${f.type || f.name}`); return { ok: false, files: [] }; }
      if (f.size > MAX) { toast.error(`${f.name} is larger than 10MB`); return { ok: false, files: [] }; }
    }
    return { ok: true, files };
  };

  const uploadImages = async (files) => {
    const fd = new FormData();
    Array.from(files).forEach((f) => fd.append("images", f));
    const r = await api.post("/media/upload", fd, { headers: { "Content-Type": "multipart/form-data" } });
    const urls = r?.data?.urls || [];
    if (!urls.length) throw new Error("Upload returned no URLs");
    return urls;
  };

  const handleImageUpload = async (fileList) => {
    const { ok, files } = validateFiles(fileList);
    if (!ok) return;
    try {
      setUploadingImages(true);
      const urls = await uploadImages(files);
      setImages((prev) => [...prev, ...urls]);
      toast.success(`${urls.length} image${urls.length > 1 ? "s" : ""} uploaded`);
    } catch (err) {
      console.error("Upload error:", err);
      toast.error(err?.response?.data?.message || err?.message || "Upload failed");
    } finally {
      setUploadingImages(false);
    }
  };

  const removeImage = (idx) => setImages((prev) => prev.filter((_, i) => i !== idx));
  const handleDrag = (e) => { e.preventDefault(); e.stopPropagation(); if (e.type === "dragenter" || e.type === "dragover") setDragActive(true); if (e.type === "dragleave") setDragActive(false); };
  const handleDrop = (e) => { e.preventDefault(); e.stopPropagation(); setDragActive(false); if (e.dataTransfer.files?.length) handleImageUpload(e.dataTransfer.files); };
  /* ================================================================== */

  /* ================= Create activity (JSON) ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    // validations
    if (!form.title.trim()) return toast.error("Activity title is required");
    if (!form.placeId) return toast.error("Select a place");
    if (!form.category) return toast.error("Select a category");
    const priceNum = Number(form.price);
    if (!Number.isFinite(priceNum) || priceNum < 0 || priceNum > 50000) return toast.error("Price must be between 0 and 50000");
    const duration = Number(form.durationMinutes) || 60;
    if (duration < 15 || duration > 1440) return toast.error("Duration must be between 15 and 1440 minutes");
    if (form.capacity) {
      const cap = Number(form.capacity);
      if (!Number.isFinite(cap) || cap < 1 || cap > 100) return toast.error("Capacity must be between 1 and 100");
    }
    if (!images.length) return toast.error("Add at least one image");

    const payload = {
      title: form.title.trim(),
      description: (form.description || "").trim(),
      category: form.category.trim(),
      price: priceNum,
      basePrice: priceNum,
      durationMinutes: duration,
      place: form.placeId,               // backend expects "place" ObjectId
      featured: !!form.featured,
      isPublished: !!form.isPublished,
      capacity: form.capacity ? Number(form.capacity) : undefined,
      tags: (form.tags || "")
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean)
        .map((t) => t.slice(0, 50)),
      images,                            // URLs from /media/upload
    };

    try {
      setLoading(true);
      await api.post("/activities", payload);
      toast.success("Activity created");
      navigate("/admin/activities");
    } catch (error) {
      console.error("Create activity error:", error);
      const msg = error?.response?.data?.message || error?.message || "Failed to create activity";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };
  /* ======================================================== */

  /* ============================ UI (unchanged) ============================ */
  return (
    <DashboardLayout role="admin" title="Create Activity" user={user}>
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Button variant="outline" onClick={() => navigate('/admin/activities')} className="inline-flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" /> Back to Activities
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Create New Activity</h1>
          <p className="text-gray-600 dark:text-gray-400">Add a new tour activity</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <Card>
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Basic Information</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Title */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Activity Title *</label>
                <input type="text" name="title" value={form.title} onChange={handleChange} required placeholder="e.g., Heritage Walk at Victoria Memorial"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-800" />
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Category *</label>
                <select name="category" value={form.category} onChange={handleChange} required
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-800">
                  <option value="">Select category</option>
                  {categories.map((c) => (<option key={c} value={c} className="capitalize">{c}</option>))}
                </select>
              </div>

              {/* Price */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Price (₹) *</label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input type="number" name="price" value={form.price} onChange={handleChange} min="0" max="50000" step="1" required placeholder="e.g., 499"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-800" />
                </div>
              </div>

              {/* Duration */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Duration (minutes)</label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input type="number" name="durationMinutes" value={form.durationMinutes} onChange={handleChange} min="15" max="1440" step="15"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-800" />
                </div>
              </div>

              {/* Capacity */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Capacity (people)</label>
                <div className="relative">
                  <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input type="number" name="capacity" value={form.capacity} onChange={handleChange} min="1" max="100" step="1" placeholder="e.g., 20"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-800" />
                </div>
              </div>

              {/* Place */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Place *</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <select
                    name="placeId"
                    value={form.placeId}
                    onChange={handleChange}
                    required
                    disabled={placesLoading}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-800"
                  >
                    <option value="">{placesLoading ? 'Loading places…' : 'Select a place'}</option>
                    {places.map((p) => (
                      <option key={p._id || p.id} value={p._id || p.id}>
                        {(p.name) + ' • ' + (p.city || '—') + (p.country ? `, ${p.country}` : '')}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Tags */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Tags</label>
                <input type="text" name="tags" value={form.tags} onChange={handleChange} placeholder="heritage, guided tour (comma separated)"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-800" />
              </div>

              {/* Published / Featured */}
              <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" name="featured" checked={form.featured} onChange={handleChange}
                    className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500" />
                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4 text-yellow-500" />
                    <span className="text-gray-700 dark:text-gray-300">Featured</span>
                  </div>
                  <span className="text-sm text-gray-500">(Highlight on homepage)</span>
                </label>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" name="isPublished" checked={form.isPublished} onChange={handleChange}
                    className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500" />
                  <div className="flex items-center gap-2">
                    <Eye className="h-4 w-4 text-green-500" />
                    <span className="text-gray-700 dark:text-gray-300">Published</span>
                  </div>
                  <span className="text-sm text-gray-500">(Visible to public)</span>
                </label>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Images */}
        <Card>
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Images *</h2>

            <div
              className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                dragActive ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/10'
                            : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
              }`}
              onDragEnter={handleDrag} onDragLeave={handleDrag}
              onDragOver={handleDrag} onDrop={handleDrop}
            >
              <input type="file" accept="image/*" multiple
                     onChange={(e) => handleImageUpload(e.target.files)}
                     className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
              <Upload className="h-10 w-10 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400 mb-2">
                Drop images here or <span className="text-primary-600 font-medium">browse</span>
              </p>
              <p className="text-sm text-gray-500">JPG/PNG/WEBP up to 10MB each. At least one image required.</p>
            </div>

            {!!images.length && (
              <div className="mt-6">
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Uploaded Images ({images.length})
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {images.map((img, idx) => (
                    <div key={img + idx} className="relative group">
                      <img src={img} alt={`Activity ${idx}`} className="w-full h-24 object-cover rounded-lg"
                           onError={(e) => (e.currentTarget.src = '/assets/images/placeholder-image.jpg')} />
                      {idx === 0 && (<div className="absolute bottom-1 left-1 bg-green-500 text-white text-xs px-2 py-1 rounded">Main</div>)}
                      <button type="button" onClick={() => removeImage(idx)}
                        className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                        aria-label="Remove image">
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-gray-500 mt-2">First image is used as the cover.</p>
              </div>
            )}

            {uploadingImages && (
              <div className="flex items-center gap-2 text-sm text-gray-500 mt-3">
                <Loader2 className="h-4 w-4 animate-spin" />
                Uploading images…
              </div>
            )}
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex items-center justify-end gap-4">
          <Button type="button" variant="outline" onClick={() => navigate('/admin/activities')} disabled={loading}>Cancel</Button>
          <Button type="submit" disabled={loading} className="inline-flex items-center gap-2">
            {loading ? (<><Loader2 className="h-4 w-4 animate-spin" />Saving…</>) : (<><Save className="h-4 w-4" />Create Activity</>)}
          </Button>
        </div>
      </form>
    </DashboardLayout>
  );
}
