import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

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

/* ---------------- local API (aligned with your backend) ---------------- */
const API_BASE =
  import.meta.env.VITE_BACKEND_URL ||
  import.meta.env.VITE_API_URL ||
  'http://localhost:5000/api';

const api = axios.create({ baseURL: API_BASE });


// Activities
async function createActivity(payload) {
  // payload: {title, description, category, price, durationMinutes, place, featured, isPublished, capacity?, tags[], images[] (string urls) }
  return api.post('/activities', payload);
}

// Places (list for select)
async function getPlaces({ limit = 200 } = {}) {
  return api.get('/places', { params: { limit } });
}

// Uploads: prefer bulk, then fallback to single
async function uploadMediaMany(files) {
  const list = Array.from(files || []);
  if (!list.length) return [];

  const toUrl = (x) =>
    typeof x === 'string'
      ? x
      : x?.url || x?.secure_url || x?.Location || x?.location || '';

  // 1) Try /upload/many
  try {
    const fd = new FormData();
    list.forEach((f) => fd.append('images', f));
    const r = await api.post('/upload/many', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
    const out = r?.data?.urls || r?.data?.files || r?.data?.data || r?.data || [];
    const urls = (Array.isArray(out) ? out : [out]).map(toUrl).filter(Boolean);
    if (urls.length) return urls;
  } catch {
    // ignore and try alternative
  }

  // 2) Try /media/upload-many
  try {
    const fd = new FormData();
    list.forEach((f) => fd.append('images', f));
    const r = await api.post('/media/upload-many', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
    const out = r?.data?.urls || r?.data?.files || r?.data?.data || r?.data || [];
    const urls = (Array.isArray(out) ? out : [out]).map(toUrl).filter(Boolean);
    if (urls.length) return urls;
  } catch {
    // ignore and fallback to singles
  }

  // 3) Fallback: single /upload per file
  const urls = [];
  for (const f of list) {
    const fd = new FormData();
    fd.append('file', f);
    const r = await api.post('/upload', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
    const item = r?.data?.data || r?.data;
    const url = toUrl(item);
    if (url) urls.push(url);
  }
  return urls;
}

// Minimal shim for user (no global store)
function useAuthStore() {
  try {
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    const isAuthenticated = !!localStorage.getItem('token');
    return { user, isAuthenticated };
  } catch {
    return { user: null, isAuthenticated: false };
  }
}
/* ---------------------------------------------------------------------- */

export default function ActivityCreate() {
  const navigate = useNavigate();
  const { user } = useAuthStore();

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

  // images => string[] (URLs) per your model
  const [images, setImages] = useState([]);
  const [places, setPlaces] = useState([]);
  const [dragActive, setDragActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [placesLoading, setPlacesLoading] = useState(true);

  // Load places
  useEffect(() => {
    (async () => {
      try {
        setPlacesLoading(true);
        const response = await getPlaces({ limit: 200 });
        const placesData =
          response?.data?.places ||
          response?.data?.docs ||
          response?.data ||
          response?.places ||
          response?.docs ||
          response ||
          [];
        setPlaces(Array.isArray(placesData) ? placesData : []);
      } catch (error) {
        console.error('Error fetching places:', error);
        toast.error('Failed to load places');
        setPlaces([]);
      } finally {
        setPlacesLoading(false);
      }
    })();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  // Upload images -> urls[]
  const handleImageUpload = async (fileList) => {
    const files = Array.from(fileList || []);
    if (!files.length) return;
    try {
      setUploadingImages(true);
      const urls = await uploadMediaMany(files); // string[]
      if (urls?.length) {
        setImages((prev) => [...prev, ...urls]);
        toast.success(`${urls.length} image${urls.length > 1 ? 's' : ''} uploaded`);
      }
    } catch (err) {
      console.error('Image upload error:', err);
      toast.error('Image upload failed');
    } finally {
      setUploadingImages(false);
    }
  };

  const removeImage = (idx) => setImages((prev) => prev.filter((_, i) => i !== idx));

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
    if (e.dataTransfer.files?.length) {
      handleImageUpload(e.dataTransfer.files);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    // Validations aligned to your schema
    if (!form.title.trim()) return toast.error('Activity title is required');
    if (!form.placeId) return toast.error('Select a place');
    if (!form.category) return toast.error('Select a category');

    const priceNum = Number(form.price);
    if (!Number.isFinite(priceNum) || priceNum < 0 || priceNum > 50000)
      return toast.error('Price must be between 0 and 50000');

    const duration = Number(form.durationMinutes) || 60;
    if (duration < 15 || duration > 1440)
      return toast.error('Duration must be between 15 and 1440 minutes');

    if (form.capacity) {
      const cap = Number(form.capacity);
      if (!Number.isFinite(cap) || cap < 1 || cap > 100)
        return toast.error('Capacity must be between 1 and 100');
    }

    if (!images.length) return toast.error('Add at least one image');

    try {
      setLoading(true);

      const payload = {
        title: form.title.trim(),
        description: (form.description || '').trim(),
        category: form.category.trim(),
        price: priceNum,
        durationMinutes: duration,
        place: form.placeId, // ObjectId string field name = "place"
        featured: !!form.featured,
        isPublished: !!form.isPublished,
        capacity: form.capacity ? Number(form.capacity) : undefined,
        tags: form.tags
          ? form.tags
              .split(',')
              .map((t) => t.trim())
              .filter(Boolean)
              .map((t) => t.slice(0, 50))
          : [],
        images, // string[] (URLs)
      };

      await createActivity(payload);
      toast.success('Activity created');
      navigate('/admin/activities');
    } catch (error) {
      console.error('Error creating activity:', error);
      const message = error?.response?.data?.message || error?.message;
      if (error?.response?.status === 400) toast.error(message || 'Invalid data');
      else if (error?.response?.status === 401) toast.error('Unauthorized');
      else toast.error(message || 'Failed to create activity');
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    'cultural',
    'nature',
    'art',
    'spiritual',
    'food',
    'adventure',
    'entertainment',
    'shopping',
    'historical',
  ];

  return (
    <DashboardLayout role="admin" title="Create Activity" user={user}>
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Button
          variant="outline"
          onClick={() => navigate('/admin/activities')}
          className="inline-flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Activities
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
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Basic Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Title */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Activity Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  required
                  placeholder="e.g., Heritage Walk at Victoria Memorial"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-800"
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Category *
                </label>
                <select
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-800"
                >
                  <option value="">Select category</option>
                  {categories.map((c) => (
                    <option key={c} value={c} className="capitalize">
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              {/* Price */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Price (₹) *
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="number"
                    name="price"
                    value={form.price}
                    onChange={handleChange}
                    min="0"
                    max="50000"
                    step="1"
                    required
                    placeholder="e.g., 499"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-800"
                  />
                </div>
              </div>

              {/* Duration */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Duration (minutes)
                </label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="number"
                    name="durationMinutes"
                    value={form.durationMinutes}
                    onChange={handleChange}
                    min="15"
                    max="1440"
                    step="15"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-800"
                  />
                </div>
              </div>

              {/* Capacity (optional) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Capacity (people)
                </label>
                <div className="relative">
                  <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="number"
                    name="capacity"
                    value={form.capacity}
                    onChange={handleChange}
                    min="1"
                    max="100"
                    step="1"
                    placeholder="e.g., 20"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-800"
                  />
                </div>
              </div>

              {/* Place */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Place *
                </label>
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
                        {p.name} • {(p.city || p.address?.city) ?? '—'}, {(p.country || p.address?.country) ?? '—'}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Tags */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Tags
                </label>
                <input
                  type="text"
                  name="tags"
                  value={form.tags}
                  onChange={handleChange}
                  placeholder="heritage, guided tour (comma separated)"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-800"
                />
              </div>

              {/* Published / Featured */}
              <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                    <span className="text-gray-700 dark:text-gray-300">Featured</span>
                  </div>
                  <span className="text-sm text-gray-500">(Highlight on homepage)</span>
                </label>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="isPublished"
                    checked={form.isPublished}
                    onChange={handleChange}
                    className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                  />
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
                accept="image/*"
                multiple
                onChange={(e) => handleImageUpload(e.target.files)}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <Upload className="h-10 w-10 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400 mb-2">
                Drop images here or <span className="text-primary-600 font-medium">browse</span>
              </p>
              <p className="text-sm text-gray-500">
                JPG/PNG/WEBP up to 10MB each. At least one image required.
              </p>
            </div>

            {!!images.length && (
              <div className="mt-6">
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Uploaded Images ({images.length})
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {images.map((img, idx) => (
                    <div key={img + idx} className="relative group">
                      <img
                        src={img}
                        alt={`Activity ${idx}`}
                        className="w-full h-24 object-cover rounded-lg"
                        onError={(e) => (e.currentTarget.src = '/assets/images/placeholder-image.jpg')}
                      />
                      {idx === 0 && (
                        <div className="absolute bottom-1 left-1 bg-green-500 text-white text-xs px-2 py-1 rounded">
                          Main
                        </div>
                      )}
                      <button
                        type="button"
                        onClick={() => removeImage(idx)}
                        className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                        aria-label="Remove image"
                      >
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
          <Button type="button" variant="outline" onClick={() => navigate('/admin/activities')} disabled={loading}>
            Cancel
          </Button>
          <Button type="submit" disabled={loading} className="inline-flex items-center gap-2">
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Saving…
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Create Activity
              </>
            )}
          </Button>
        </div>
      </form>
    </DashboardLayout>
  );
}
