// // // import { useState } from 'react';
// // // import { useNavigate } from 'react-router-dom';
// // // import axios from 'axios';
// // // import DashboardLayout from '@/components/Layout/DashboardLayout';
// // // import Button from '@/components/ui/Button';
// // // import { Card, CardContent } from '@/components/ui/Card';
// // // import {
// // //   Upload,
// // //   X,
// // //   MapPin,
// // //   Star,
// // //   Save,
// // //   ArrowLeft,
// // //   Globe,
// // //   Loader2,
// // // } from 'lucide-react';
// // // import toast from 'react-hot-toast';

// // // /* ---------------- Local API (same pattern as ActivityCreate) ---------------- */
// // // const API_BASE =
// // //   import.meta.env.VITE_BACKEND_URL ||
// // //   import.meta.env.VITE_API_URL ||
// // //   'http://localhost:5000/api';

// // // const api = axios.create({ baseURL: API_BASE });

// // // // If your backend sets httpOnly cookies for auth, uncomment the next line:
// // // // api.defaults.withCredentials = true;

// // // const TOKEN_KEYS = [
// // //   'token',
// // //   'adminToken',
// // //   'superadminToken',
// // //   'vendorToken',
// // //   'managerToken',
// // //   'userToken',
// // // ];

// // // // Attach Authorization header
// // // api.interceptors.request.use((config) => {
// // //   let token = null;
// // //   for (const k of TOKEN_KEYS) {
// // //     const v = localStorage.getItem(k);
// // //     if (v) { token = v; break; }
// // //   }
// // //   if (token) {
// // //     config.headers.Authorization = `Bearer ${token}`;
// // //     config.headers['x-auth-token'] = token;
// // //   }
// // //   return config;
// // // });




// // // // POST /places with multipart images and fields
// // // async function createPlace(formData) {
// // //   return api.post('/places', formData, {
// // //     headers: { 'Content-Type': 'multipart/form-data' },
// // //   });
// // // }

// // // // Minimal shim for user (no global store)
// // // function useAuthStore() {
// // //   try {
// // //     const user = JSON.parse(localStorage.getItem('user') || 'null');
// // //     const isAuthenticated = TOKEN_KEYS.some((k) => !!localStorage.getItem(k));
// // //     return { user, isAuthenticated };
// // //   } catch {
// // //     return { user: null, isAuthenticated: false };
// // //   }
// // // }
// // import { useState } from 'react';
// // import { useNavigate } from 'react-router-dom';

// // import DashboardLayout from '@/components/Layout/DashboardLayout';
// // import Button from '@/components/ui/Button';
// // import { Card, CardContent } from '@/components/ui/Card';
// // import {
// //   Upload,
// //   X,
// //   MapPin,
// //   Star,
// //   Save,
// //   ArrowLeft,
// //   Globe,
// //   Loader2,
// // } from 'lucide-react';
// // import toast from 'react-hot-toast';
// // import { api, useAuthStore } from '@/store/auth'; // ✅ Centralized import

// // /* =============== API helpers =============== */
// // async function createPlace(formData) {
// //   return api.post('/places', formData, {
// //     headers: { 'Content-Type': 'multipart/form-data' },
// //   });
// // }

// // const categories = [
// //   'cultural',
// //   'nature',
// //   'art',
// //   'spiritual',
// //   'food',
// //   'entertainment',
// //   'shopping',
// //   'historical',
// //   'architectural',
// // ];

// // const commonCities = [
// //   'Kolkata',
// //   'Mumbai',
// //   'Delhi',
// //   'Bangalore',
// //   'Chennai',
// //   'Hyderabad',
// //   'Pune',
// //   'Ahmedabad',
// //   'Jaipur',
// //   'Goa',
// // ];
// // /* -------------------------------------------------------------------------- */

// // export default function PlaceCreate() {
// //   const navigate = useNavigate();
// //   const { user } = useAuthStore();

// //   const [form, setForm] = useState({
// //     name: '',
// //     description: '',
// //     category: '',
// //     city: 'Kolkata',
// //     country: 'India',
// //     featured: false,
// //     tags: '',
// //   });

// //   // Files + previews
// //   const [files, setFiles] = useState([]);       // File[]
// //   const [previews, setPreviews] = useState([]); // [{id, url, name}]
// //   const [dragActive, setDragActive] = useState(false);
// //   const [submitting, setSubmitting] = useState(false);

// //   const categories = [
// //     'cultural',
// //     'nature',
// //     'art',
// //     'spiritual',
// //     'food',
// //     'entertainment',
// //     'shopping',
// //     'historical',
// //     'architectural',
// //   ];

// //   const commonCities = [
// //     'Kolkata',
// //     'Mumbai',
// //     'Delhi',
// //     'Bangalore',
// //     'Chennai',
// //     'Hyderabad',
// //     'Pune',
// //     'Ahmedabad',
// //     'Jaipur',
// //     'Goa',
// //   ];

// //   const handleChange = (e) => {
// //     const { name, value, type, checked } = e.target;
// //     setForm((prev) => ({
// //       ...prev,
// //       [name]: type === 'checkbox' ? checked : value,
// //     }));
// //   };

// //   const appendFiles = (fileList) => {
// //     const arr = Array.from(fileList || []);
// //     if (!arr.length) return;

// //     // Optional guard: max 10MB each
// //     const tooBig = arr.find((f) => f.size > 10 * 1024 * 1024);
// //     if (tooBig) return toast.error('Each image must be ≤ 10MB');

// //     const nextFiles = [...files, ...arr];
// //     const nextPreviews = [
// //       ...previews,
// //       ...arr.map((file, i) => ({
// //         id: `${Date.now()}-${i}-${file.name}`,
// //         url: URL.createObjectURL(file),
// //         name: file.name,
// //       })),
// //     ];

// //     setFiles(nextFiles);
// //     setPreviews(nextPreviews);
// //   };

// //   const handleInputFiles = (e) => {
// //     if (e.target.files) appendFiles(e.target.files);
// //   };

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
// //     if (e.dataTransfer.files?.length) appendFiles(e.dataTransfer.files);
// //   };

// //   const removePreviewAt = (idx) => {
// //     setPreviews((prev) => prev.filter((_, i) => i !== idx));
// //     setFiles((prev) => prev.filter((_, i) => i !== idx));
// //   };

// //   const handleSubmit = async (e) => {
// //     e.preventDefault();
// //     if (submitting) return;

// //     // Basic validations
// //     if (!form.name.trim()) return toast.error('Place name is required');
// //     if (!form.city.trim() || !form.country.trim())
// //       return toast.error('City and country are required');
// //     if (!files.length) return toast.error('Please add at least one image');

// //     try {
// //       setSubmitting(true);

// //       // Build FormData for backend (supports file uploads)
// //       const fd = new FormData();
// //       fd.append('name', form.name.trim());
// //       fd.append('description', (form.description || '').trim());
// //       fd.append('category', (form.category || '').trim());
// //       fd.append('city', form.city.trim());
// //       fd.append('country', form.country.trim());
// //       fd.append('featured', String(!!form.featured));

// //       (form.tags || '')
// //         .split(',')
// //         .map((t) => t.trim())
// //         .filter(Boolean)
// //         .slice(0, 30)
// //         .forEach((tag) => fd.append('tags[]', tag.slice(0, 50)));

// //       files.forEach((f) => fd.append('images', f)); // backend should parse as array

// //       await createPlace(fd);

// //       toast.success('Place created successfully!');
// //       navigate('/admin/places'); // ✅ go back to listing
// //     } catch (err) {
// //       console.error('Create place error:', err);
// //       const msg =
// //         err?.response?.data?.message ||
// //         err?.message ||
// //         'Failed to create place';
// //       toast.error(msg);
// //     } finally {
// //       setSubmitting(false);
// //     }
// //   };

// //   return (
// //     <DashboardLayout role="admin" title="Create Place" user={user}>
// //       {/* Header */}
// //       <div className="flex items-center gap-4 mb-6">
// //         <Button
// //           variant="outline"
// //           onClick={() => navigate('/admin/places')}
// //           className="inline-flex items-center gap-2"
// //         >
// //           <ArrowLeft className="h-4 w-4" />
// //           Back to Places
// //         </Button>
// //         <div>
// //           <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
// //             Add New Place
// //           </h1>
// //           <p className="text-gray-600 dark:text-gray-400">
// //             Create a new destination or point of interest
// //           </p>
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
// //               {/* Name */}
// //               <div className="md:col-span-2">
// //                 <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
// //                   Place Name *
// //                 </label>
// //                 <input
// //                   type="text"
// //                   name="name"
// //                   value={form.name}
// //                   onChange={handleChange}
// //                   placeholder="e.g., Victoria Memorial"
// //                   required
// //                   className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-800"
// //                 />
// //               </div>

// //               {/* Category */}
// //               <div>
// //                 <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
// //                   Category
// //                 </label>
// //                 <select
// //                   name="category"
// //                   value={form.category}
// //                   onChange={handleChange}
// //                   className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-800"
// //                 >
// //                   <option value="">Select category</option>
// //                   {categories.map((cat) => (
// //                     <option key={cat} value={cat} className="capitalize">
// //                       {cat}
// //                     </option>
// //                   ))}
// //                 </select>
// //               </div>

// //               {/* Featured */}
// //               <div className="flex items-center pt-8">
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
// //                     <span className="text-gray-700 dark:text-gray-300">
// //                       Featured Place
// //                     </span>
// //                   </div>
// //                 </label>
// //               </div>

// //               {/* City */}
// //               <div>
// //                 <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
// //                   City *
// //                 </label>
// //                 <div className="relative">
// //                   <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
// //                   <input
// //                     type="text"
// //                     name="city"
// //                     value={form.city}
// //                     onChange={handleChange}
// //                     placeholder="Enter city"
// //                     required
// //                     list="cities"
// //                     className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-800"
// //                   />
// //                   <datalist id="cities">
// //                     {commonCities.map((city) => (
// //                       <option key={city} value={city} />
// //                     ))}
// //                   </datalist>
// //                 </div>
// //               </div>

// //               {/* Country */}
// //               <div>
// //                 <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
// //                   Country *
// //                 </label>
// //                 <div className="relative">
// //                   <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
// //                   <input
// //                     type="text"
// //                     name="country"
// //                     value={form.country}
// //                     onChange={handleChange}
// //                     placeholder="Enter country"
// //                     required
// //                     className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-800"
// //                   />
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
// //                   placeholder="heritage, monument, british era (comma separated)"
// //                   className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-800"
// //                 />
// //                 <p className="text-xs text-gray-500 mt-1">
// //                   Separate tags with commas
// //                 </p>
// //               </div>

// //               {/* Description */}
// //               <div className="md:col-span-2">
// //                 <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
// //                   Description
// //                 </label>
// //                 <textarea
// //                   name="description"
// //                   value={form.description}
// //                   onChange={handleChange}
// //                   rows={4}
// //                   placeholder="Describe this place, its history, and what makes it special..."
// //                   className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-800 resize-none"
// //                 />
// //               </div>
// //             </div>
// //           </CardContent>
// //         </Card>

// //         {/* Images */}
// //         <Card>
// //           <CardContent className="p-6">
// //             <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
// //               Images *
// //             </h2>

// //             {/* Upload Area */}
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
// //                 multiple
// //                 accept="image/*"
// //                 onChange={handleInputFiles}
// //                 className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
// //               />
// //               <Upload className="h-10 w-10 text-gray-400 mx-auto mb-4" />
// //               <p className="text-gray-600 dark:text-gray-400 mb-2">
// //                 Drop images here or{' '}
// //                 <span className="text-primary-600 font-medium">browse</span>
// //               </p>
// //               <p className="text-sm text-gray-500">
// //                 Support: JPG, PNG, WEBP up to 10MB each. At least one image
// //                 required.
// //               </p>
// //             </div>

// //             {/* Image Previews */}
// //             {previews.length > 0 && (
// //               <div className="mt-6">
// //                 <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
// //                   Selected Images ({previews.length})
// //                 </h3>
// //                 <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
// //                   {previews.map((image, index) => (
// //                     <div key={image.id} className="relative group">
// //                       <img
// //                         src={image.url}
// //                         alt={image.name}
// //                         className="w-full h-24 object-cover rounded-lg"
// //                       />
// //                       {index === 0 && (
// //                         <div className="absolute bottom-1 left-1 bg-green-500 text-white text-xs px-2 py-1 rounded">
// //                           Main
// //                         </div>
// //                       )}
// //                       <button
// //                         type="button"
// //                         onClick={() => removePreviewAt(index)}
// //                         className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
// //                       >
// //                         <X className="h-3 w-3" />
// //                       </button>
// //                     </div>
// //                   ))}
// //                 </div>
// //                 <p className="text-xs text-gray-500 mt-2">
// //                   The first image will be used as the main image
// //                 </p>
// //               </div>
// //             )}
// //           </CardContent>
// //         </Card>

// //         {/* Actions */}
// //         <div className="flex items-center justify-end gap-4">
// //           <Button
// //             type="button"
// //             variant="outline"
// //             onClick={() => navigate('/admin/places')}
// //             disabled={submitting}
// //           >
// //             Cancel
// //           </Button>
// //           <Button type="submit" disabled={submitting} className="inline-flex items-center gap-2">
// //             {submitting ? (
// //               <>
// //                 <Loader2 className="h-4 w-4 animate-spin" />
// //                 Saving...
// //               </>
// //             ) : (
// //               <>
// //                 <Save className="h-4 w-4" />
// //                 Create Place
// //               </>
// //             )}
// //           </Button>
// //         </div>
// //       </form>
// //     </DashboardLayout>
// //   );
// // }
// import { useState } from 'react';
// import { useNavigate } from 'react-router-dom';

// import DashboardLayout from '@/components/Layout/DashboardLayout';
// import Button from '@/components/ui/Button';
// import { Card, CardContent } from '@/components/ui/Card';
// import {
//   Upload,
//   X,
//   MapPin,
//   Star,
//   Save,
//   ArrowLeft,
//   Globe,
//   Loader2,
//   Navigation,
// } from 'lucide-react';
// import toast from 'react-hot-toast';
// import { api, useAuthStore } from '@/store/auth';

// /* =============== API helpers =============== */
// async function createPlace(formData) {
//   return api.post('/places', formData, {
//     headers: { 'Content-Type': 'multipart/form-data' },
//   });
// }

// const categories = [
//   'cultural',
//   'nature',
//   'art',
//   'spiritual',
//   'food',
//   'entertainment',
//   'shopping',
//   'historical',
//   'architectural',
// ];

// const commonCities = [
//   'Kolkata',
//   'Mumbai',
//   'Delhi',
//   'Bangalore',
//   'Chennai',
//   'Hyderabad',
//   'Pune',
//   'Ahmedabad',
//   'Jaipur',
//   'Goa',
// ];

// // Popular Indian cities with their coordinates
// const cityCoordinates = {
//   'Kolkata': { lat: 22.5726, lng: 88.3639 },
//   'Mumbai': { lat: 19.0760, lng: 72.8777 },
//   'Delhi': { lat: 28.7041, lng: 77.1025 },
//   'Bangalore': { lat: 12.9716, lng: 77.5946 },
//   'Chennai': { lat: 13.0827, lng: 80.2707 },
//   'Hyderabad': { lat: 17.3850, lng: 78.4867 },
//   'Pune': { lat: 18.5204, lng: 73.8567 },
//   'Ahmedabad': { lat: 23.0225, lng: 72.5714 },
//   'Jaipur': { lat: 26.9124, lng: 75.7873 },
//   'Goa': { lat: 15.2993, lng: 74.1240 },
// };

// export default function PlaceCreate() {
//   const navigate = useNavigate();
//   const { user } = useAuthStore();

//   const [form, setForm] = useState({
//     name: '',
//     description: '',
//     category: '',
//     city: 'Kolkata',
//     country: 'India',
//     latitude: '22.5726',  // ✅ Default Kolkata coordinates
//     longitude: '88.3639',
//     featured: false,
//     tags: '',
//   });

//   const [files, setFiles] = useState([]);
//   const [previews, setPreviews] = useState([]);
//   const [dragActive, setDragActive] = useState(false);
//   const [submitting, setSubmitting] = useState(false);

//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;
    
//     // ✅ Auto-fill coordinates when city changes
//     if (name === 'city' && cityCoordinates[value]) {
//       setForm((prev) => ({
//         ...prev,
//         city: value,
//         latitude: String(cityCoordinates[value].lat),
//         longitude: String(cityCoordinates[value].lng),
//       }));
//       return;
//     }
    
//     setForm((prev) => ({
//       ...prev,
//       [name]: type === 'checkbox' ? checked : value,
//     }));
//   };

//   const appendFiles = (fileList) => {
//     const arr = Array.from(fileList || []);
//     if (!arr.length) return;

//     const tooBig = arr.find((f) => f.size > 10 * 1024 * 1024);
//     if (tooBig) return toast.error('Each image must be ≤ 10MB');

//     const nextFiles = [...files, ...arr];
//     const nextPreviews = [
//       ...previews,
//       ...arr.map((file, i) => ({
//         id: `${Date.now()}-${i}-${file.name}`,
//         url: URL.createObjectURL(file),
//         name: file.name,
//       })),
//     ];

//     setFiles(nextFiles);
//     setPreviews(nextPreviews);
//   };

//   const handleInputFiles = (e) => {
//     if (e.target.files) appendFiles(e.target.files);
//   };

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
//     if (e.dataTransfer.files?.length) appendFiles(e.dataTransfer.files);
//   };

//   const removePreviewAt = (idx) => {
//     setPreviews((prev) => prev.filter((_, i) => i !== idx));
//     setFiles((prev) => prev.filter((_, i) => i !== idx));
//   };

//   // ✅ Get user's location
//   const handleGetCurrentLocation = () => {
//     if (!navigator.geolocation) {
//       return toast.error('Geolocation is not supported by your browser');
//     }

//     toast.loading('Getting your location...');
    
//     navigator.geolocation.getCurrentPosition(
//       (position) => {
//         toast.dismiss();
//         setForm((prev) => ({
//           ...prev,
//           latitude: String(position.coords.latitude.toFixed(6)),
//           longitude: String(position.coords.longitude.toFixed(6)),
//         }));
//         toast.success('Location detected!');
//       },
//       (error) => {
//         toast.dismiss();
//         console.error('Geolocation error:', error);
//         toast.error('Could not get your location. Please enter manually.');
//       }
//     );
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (submitting) return;

//     // Validations
//     if (!form.name.trim()) return toast.error('Place name is required');
//     if (!form.city.trim() || !form.country.trim()) {
//       return toast.error('City and country are required');
//     }

//     // ✅ Validate coordinates
//     const lat = parseFloat(form.latitude);
//     const lng = parseFloat(form.longitude);
    
//     if (!Number.isFinite(lat) || lat < -90 || lat > 90) {
//       return toast.error('Latitude must be between -90 and 90');
//     }
//     if (!Number.isFinite(lng) || lng < -180 || lng > 180) {
//       return toast.error('Longitude must be between -180 and 180');
//     }

//     if (!files.length) return toast.error('Please add at least one image');

//     try {
//       setSubmitting(true);

//       const fd = new FormData();
//       fd.append('name', form.name.trim());
//       fd.append('description', (form.description || '').trim());
//       fd.append('category', (form.category || '').trim());
//       fd.append('city', form.city.trim());
//       fd.append('country', form.country.trim());
//       fd.append('latitude', String(lat));   // ✅ Send coordinates
//       fd.append('longitude', String(lng));
//       fd.append('featured', String(!!form.featured));

//       (form.tags || '')
//         .split(',')
//         .map((t) => t.trim())
//         .filter(Boolean)
//         .slice(0, 30)
//         .forEach((tag) => fd.append('tags[]', tag.slice(0, 50)));

//       files.forEach((f) => fd.append('images', f));

//       await createPlace(fd);

//       toast.success('Place created successfully!');
//       navigate('/admin/places');
//     } catch (err) {
//       console.error('Create place error:', err);
//       const msg =
//         err?.response?.data?.message ||
//         err?.message ||
//         'Failed to create place';
//       toast.error(msg);
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   return (
//     <DashboardLayout role="admin" title="Create Place" user={user}>
//       <div className="flex items-center gap-4 mb-6">
//         <Button
//           variant="outline"
//           onClick={() => navigate('/admin/places')}
//           className="inline-flex items-center gap-2"
//         >
//           <ArrowLeft className="h-4 w-4" />
//           Back to Places
//         </Button>
//         <div>
//           <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
//             Add New Place
//           </h1>
//           <p className="text-gray-600 dark:text-gray-400">
//             Create a new destination or point of interest
//           </p>
//         </div>
//       </div>

//       <form onSubmit={handleSubmit} className="space-y-6">
//         <Card>
//           <CardContent className="p-6">
//             <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
//               Basic Information
//             </h2>

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               {/* Name */}
//               <div className="md:col-span-2">
//                 <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//                   Place Name *
//                 </label>
//                 <input
//                   type="text"
//                   name="name"
//                   value={form.name}
//                   onChange={handleChange}
//                   placeholder="e.g., Victoria Memorial"
//                   required
//                   className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-800"
//                 />
//               </div>

//               {/* Category */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//                   Category
//                 </label>
//                 <select
//                   name="category"
//                   value={form.category}
//                   onChange={handleChange}
//                   className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-800"
//                 >
//                   <option value="">Select category</option>
//                   {categories.map((cat) => (
//                     <option key={cat} value={cat} className="capitalize">
//                       {cat}
//                     </option>
//                   ))}
//                 </select>
//               </div>

//               {/* Featured */}
//               <div className="flex items-center pt-8">
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
//                     <span className="text-gray-700 dark:text-gray-300">
//                       Featured Place
//                     </span>
//                   </div>
//                 </label>
//               </div>

//               {/* City */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//                   City *
//                 </label>
//                 <div className="relative">
//                   <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
//                   <input
//                     type="text"
//                     name="city"
//                     value={form.city}
//                     onChange={handleChange}
//                     placeholder="Enter city"
//                     required
//                     list="cities"
//                     className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-800"
//                   />
//                   <datalist id="cities">
//                     {commonCities.map((city) => (
//                       <option key={city} value={city} />
//                     ))}
//                   </datalist>
//                 </div>
//                 <p className="text-xs text-gray-500 mt-1">
//                   Selecting a major city will auto-fill coordinates
//                 </p>
//               </div>

//               {/* Country */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//                   Country *
//                 </label>
//                 <div className="relative">
//                   <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
//                   <input
//                     type="text"
//                     name="country"
//                     value={form.country}
//                     onChange={handleChange}
//                     placeholder="Enter country"
//                     required
//                     className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-800"
//                   />
//                 </div>
//               </div>

//               {/* ✅ Latitude */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//                   Latitude * <span className="text-xs text-gray-500">(-90 to 90)</span>
//                 </label>
//                 <div className="relative">
//                   <Navigation className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
//                   <input
//                     type="number"
//                     name="latitude"
//                     value={form.latitude}
//                     onChange={handleChange}
//                     step="0.000001"
//                     min="-90"
//                     max="90"
//                     required
//                     placeholder="22.5726"
//                     className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-800"
//                   />
//                 </div>
//               </div>

//               {/* ✅ Longitude */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//                   Longitude * <span className="text-xs text-gray-500">(-180 to 180)</span>
//                 </label>
//                 <div className="relative">
//                   <Navigation className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
//                   <input
//                     type="number"
//                     name="longitude"
//                     value={form.longitude}
//                     onChange={handleChange}
//                     step="0.000001"
//                     min="-180"
//                     max="180"
//                     required
//                     placeholder="88.3639"
//                     className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-800"
//                   />
//                 </div>
//               </div>

//               {/* ✅ Get Current Location Button */}
//               <div className="md:col-span-2">
//                 <Button
//                   type="button"
//                   variant="outline"
//                   onClick={handleGetCurrentLocation}
//                   className="inline-flex items-center gap-2"
//                 >
//                   <Navigation className="h-4 w-4" />
//                   Use My Current Location
//                 </Button>
//                 <p className="text-xs text-gray-500 mt-2">
//                   Or use{' '}
//                   <a
//                     href="https://www.google.com/maps"
//                     target="_blank"
//                     rel="noopener noreferrer"
//                     className="text-primary-600 hover:underline"
//                   >
//                     Google Maps
//                   </a>
//                   {' '}to find coordinates
//                 </p>
//               </div>

//               {/* Tags */}
//               <div className="md:col-span-2">
//                 <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//                   Tags <span className="text-xs text-gray-500">(Max 30 tags, 50 chars each)</span>
//                 </label>
//                 <input
//                   type="text"
//                   name="tags"
//                   value={form.tags}
//                   onChange={handleChange}
//                   placeholder="heritage, monument, british era (comma separated)"
//                   className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-800"
//                 />
//               </div>

//               {/* Description */}
//               <div className="md:col-span-2">
//                 <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//                   Description
//                 </label>
//                 <textarea
//                   name="description"
//                   value={form.description}
//                   onChange={handleChange}
//                   rows={4}
//                   placeholder="Describe this place, its history, and what makes it special..."
//                   className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-800 resize-none"
//                 />
//               </div>
//             </div>
//           </CardContent>
//         </Card>

//         {/* Images */}
//         <Card>
//           <CardContent className="p-6">
//             <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
//               Images *
//             </h2>

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
//                 multiple
//                 accept="image/*"
//                 onChange={handleInputFiles}
//                 className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
//               />
//               <Upload className="h-10 w-10 text-gray-400 mx-auto mb-4" />
//               <p className="text-gray-600 dark:text-gray-400 mb-2">
//                 Drop images here or{' '}
//                 <span className="text-primary-600 font-medium">browse</span>
//               </p>
//               <p className="text-sm text-gray-500">
//                 Support: JPG, PNG, WEBP up to 10MB each. At least one image
//                 required.
//               </p>
//             </div>

//             {previews.length > 0 && (
//               <div className="mt-6">
//                 <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
//                   Selected Images ({previews.length})
//                 </h3>
//                 <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//                   {previews.map((image, index) => (
//                     <div key={image.id} className="relative group">
//                       <img
//                         src={image.url}
//                         alt={image.name}
//                         className="w-full h-24 object-cover rounded-lg"
//                       />
//                       {index === 0 && (
//                         <div className="absolute bottom-1 left-1 bg-green-500 text-white text-xs px-2 py-1 rounded">
//                           Main
//                         </div>
//                       )}
//                       <button
//                         type="button"
//                         onClick={() => removePreviewAt(index)}
//                         className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
//                       >
//                         <X className="h-3 w-3" />
//                       </button>
//                     </div>
//                   ))}
//                 </div>
//                 <p className="text-xs text-gray-500 mt-2">
//                   The first image will be used as the main image
//                 </p>
//               </div>
//             )}
//           </CardContent>
//         </Card>

//         {/* Actions */}
//         <div className="flex items-center justify-end gap-4">
//           <Button
//             type="button"
//             variant="outline"
//             onClick={() => navigate('/admin/places')}
//             disabled={submitting}
//           >
//             Cancel
//           </Button>
//           <Button type="submit" disabled={submitting} className="inline-flex items-center gap-2">
//             {submitting ? (
//               <>
//                 <Loader2 className="h-4 w-4 animate-spin" />
//                 Saving...
//               </>
//             ) : (
//               <>
//                 <Save className="h-4 w-4" />
//                 Create Place
//               </>
//             )}
//           </Button>
//         </div>
//       </form>
//     </DashboardLayout>
//   );
// }



import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import DashboardLayout from '@/components/Layout/DashboardLayout';
import Button from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import {
  Upload,
  X,
  MapPin,
  Star,
  Save,
  ArrowLeft,
  Globe,
  Loader2,
  Navigation,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { api, useAuthStore } from '@/store/auth';

/* =============== API helpers =============== */
async function createPlace(formData) {
  return api.post('/places', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
}

const categories = [
  'cultural',
  'nature',
  'art',
  'spiritual',
  'food',
  'entertainment',
  'shopping',
  'historical',
  'architectural',
];

const commonCities = [
  'Kolkata', 'Mumbai', 'Delhi', 'Bangalore', 'Chennai',
  'Hyderabad', 'Pune', 'Ahmedabad', 'Jaipur', 'Goa',
];

const cityCoordinates = {
  'Kolkata': { lat: 22.5726, lng: 88.3639 },
  'Mumbai': { lat: 19.0760, lng: 72.8777 },
  'Delhi': { lat: 28.7041, lng: 77.1025 },
  'Bangalore': { lat: 12.9716, lng: 77.5946 },
  'Chennai': { lat: 13.0827, lng: 80.2707 },
  'Hyderabad': { lat: 17.3850, lng: 78.4867 },
  'Pune': { lat: 18.5204, lng: 73.8567 },
  'Ahmedabad': { lat: 23.0225, lng: 72.5714 },
  'Jaipur': { lat: 26.9124, lng: 75.7873 },
  'Goa': { lat: 15.2993, lng: 74.1240 },
};

export default function PlaceCreate() {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const [form, setForm] = useState({
    name: '',
    description: '',
    category: '',
    city: 'Kolkata',
    country: 'India',
    latitude: '22.5726',
    longitude: '88.3639',
    featured: false,
    tags: '',
  });

  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [dragActive, setDragActive] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    // Auto-fill coordinates when city changes
    if (name === 'city' && cityCoordinates[value]) {
      setForm((prev) => ({
        ...prev,
        city: value,
        latitude: String(cityCoordinates[value].lat),
        longitude: String(cityCoordinates[value].lng),
      }));
      return;
    }
    
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const appendFiles = (fileList) => {
    const arr = Array.from(fileList || []);
    if (!arr.length) return;

    const tooBig = arr.find((f) => f.size > 10 * 1024 * 1024);
    if (tooBig) return toast.error('Each image must be ≤ 10MB');

    const nextFiles = [...files, ...arr];
    const nextPreviews = [
      ...previews,
      ...arr.map((file, i) => ({
        id: `${Date.now()}-${i}-${file.name}`,
        url: URL.createObjectURL(file),
        name: file.name,
      })),
    ];

    setFiles(nextFiles);
    setPreviews(nextPreviews);
  };

  const handleInputFiles = (e) => {
    if (e.target.files) appendFiles(e.target.files);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') setDragActive(true);
    if (e.type === 'dragleave') setDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files?.length) appendFiles(e.dataTransfer.files);
  };

  const removePreviewAt = (idx) => {
    setPreviews((prev) => prev.filter((_, i) => i !== idx));
    setFiles((prev) => prev.filter((_, i) => i !== idx));
  };

  // Get user's location
  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) {
      return toast.error('Geolocation is not supported by your browser');
    }

    toast.loading('Getting your location...');
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        toast.dismiss();
        setForm((prev) => ({
          ...prev,
          latitude: String(position.coords.latitude.toFixed(6)),
          longitude: String(position.coords.longitude.toFixed(6)),
        }));
        toast.success('Location detected!');
      },
      (error) => {
        toast.dismiss();
        console.error('Geolocation error:', error);
        toast.error('Could not get your location. Please enter manually.');
      }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;

    // Validations
    if (!form.name.trim()) return toast.error('Place name is required');
    if (!form.city.trim() || !form.country.trim()) {
      return toast.error('City and country are required');
    }

    // Validate coordinates
    const lat = parseFloat(form.latitude);
    const lng = parseFloat(form.longitude);
    
    if (!Number.isFinite(lat) || lat < -90 || lat > 90) {
      return toast.error('Latitude must be between -90 and 90');
    }
    if (!Number.isFinite(lng) || lng < -180 || lng > 180) {
      return toast.error('Longitude must be between -180 and 180');
    }

    if (!files.length) return toast.error('Please add at least one image');

    try {
      setSubmitting(true);

      const fd = new FormData();
      fd.append('name', form.name.trim());
      fd.append('description', (form.description || '').trim());
      fd.append('category', (form.category || '').trim());
      fd.append('city', form.city.trim());
      fd.append('country', form.country.trim());
      fd.append('latitude', String(lat));
      fd.append('longitude', String(lng));
      fd.append('featured', String(!!form.featured));

      (form.tags || '')
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean)
        .slice(0, 30)
        .forEach((tag) => fd.append('tags[]', tag.slice(0, 50)));

      files.forEach((f) => fd.append('images', f));

      await createPlace(fd);

      toast.success('Place created successfully!');
      navigate('/admin/places');
    } catch (err) {
      console.error('Create place error:', err);
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        'Failed to create place';
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <DashboardLayout role="admin" title="Create Place" user={user}>
      <div className="flex items-center gap-4 mb-6">
        <Button
          variant="outline"
          onClick={() => navigate('/admin/places')}
          className="inline-flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Places
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Add New Place
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Create a new destination or point of interest
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Basic Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Name */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Place Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="e.g., Victoria Memorial"
                  required
                  maxLength={100}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-800"
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Category
                </label>
                <select
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-800"
                >
                  <option value="">Select category</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat} className="capitalize">
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* Featured */}
              <div className="flex items-center pt-8">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="featured"
                    checked={form.featured}
                    onChange={handleChange}
                    className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                  />
                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4 text-yellow-500" />
                    <span className="text-gray-700 dark:text-gray-300">
                      Featured Place
                    </span>
                  </div>
                </label>
              </div>

              {/* City */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  City *
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    name="city"
                    value={form.city}
                    onChange={handleChange}
                    placeholder="Enter city"
                    required
                    list="cities"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-800"
                  />
                  <datalist id="cities">
                    {commonCities.map((city) => (
                      <option key={city} value={city} />
                    ))}
                  </datalist>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Selecting a major city will auto-fill coordinates
                </p>
              </div>

              {/* Country */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Country *
                </label>
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    name="country"
                    value={form.country}
                    onChange={handleChange}
                    placeholder="Enter country"
                    required
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-800"
                  />
                </div>
              </div>

              {/* Latitude */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Latitude * <span className="text-xs text-gray-500">(-90 to 90)</span>
                </label>
                <div className="relative">
                  <Navigation className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="number"
                    name="latitude"
                    value={form.latitude}
                    onChange={handleChange}
                    step="0.000001"
                    min="-90"
                    max="90"
                    required
                    placeholder="22.5726"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-800"
                  />
                </div>
              </div>

              {/* Longitude */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Longitude * <span className="text-xs text-gray-500">(-180 to 180)</span>
                </label>
                <div className="relative">
                  <Navigation className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="number"
                    name="longitude"
                    value={form.longitude}
                    onChange={handleChange}
                    step="0.000001"
                    min="-180"
                    max="180"
                    required
                    placeholder="88.3639"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-800"
                  />
                </div>
              </div>

              {/* Get Current Location Button */}
              <div className="md:col-span-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleGetCurrentLocation}
                  className="inline-flex items-center gap-2"
                >
                  <Navigation className="h-4 w-4" />
                  Use My Current Location
                </Button>
                <p className="text-xs text-gray-500 mt-2">
                  Or use{' '}
                  <a
                    href="https://www.google.com/maps"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary-600 hover:underline"
                  >
                    Google Maps
                  </a>
                  {' '}to find coordinates
                </p>
              </div>

              {/* Tags */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Tags <span className="text-xs text-gray-500">(Max 30 tags, 50 chars each)</span>
                </label>
                <input
                  type="text"
                  name="tags"
                  value={form.tags}
                  onChange={handleChange}
                  placeholder="heritage, monument, british era (comma separated)"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-800"
                />
              </div>

              {/* Description */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows={4}
                  maxLength={2000}
                  placeholder="Describe this place, its history, and what makes it special..."
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-800 resize-none"
                />
                <p className="text-xs text-gray-500 mt-1">{form.description.length}/2000 characters</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Images */}
        <Card>
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Images *
            </h2>

            <div
              className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                dragActive
                  ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/10'
                  : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleInputFiles}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <Upload className="h-10 w-10 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400 mb-2">
                Drop images here or{' '}
                <span className="text-primary-600 font-medium">browse</span>
              </p>
              <p className="text-sm text-gray-500">
                Support: JPG, PNG, WEBP up to 10MB each. At least one image
                required.
              </p>
            </div>

            {previews.length > 0 && (
              <div className="mt-6">
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Selected Images ({previews.length})
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {previews.map((image, index) => (
                    <div key={image.id} className="relative group">
                      <img
                        src={image.url}
                        alt={image.name}
                        className="w-full h-24 object-cover rounded-lg"
                      />
                      {index === 0 && (
                        <div className="absolute bottom-1 left-1 bg-green-500 text-white text-xs px-2 py-1 rounded">
                          Main
                        </div>
                      )}
                      <button
                        type="button"
                        onClick={() => removePreviewAt(index)}
                        className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  The first image will be used as the main image
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex items-center justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/admin/places')}
            disabled={submitting}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={submitting} className="inline-flex items-center gap-2">
            {submitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Create Place
              </>
            )}
          </Button>
        </div>
      </form>
    </DashboardLayout>
  );
}