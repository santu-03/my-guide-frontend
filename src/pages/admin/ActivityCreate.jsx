

import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";

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
  Navigation,
  Globe,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { api, useAuthStore } from '@/store/auth';

/* =============== API helpers =============== */
async function createActivity(payload) {
  return api.post('/activities', payload);
}

const categories = [
  'cultural','nature','art','spiritual','food',
  'adventure','entertainment','shopping','historical',
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

// Upload images to /media/upload
async function uploadImages(files) {
  const fd = new FormData();
  Array.from(files).forEach((f) => fd.append("images", f));
  const r = await api.post("/media/upload", fd, { 
    headers: { "Content-Type": "multipart/form-data" } 
  });
  const urls = r?.data?.urls || [];
  if (!urls.length) throw new Error("Upload returned no URLs");
  return urls;
}

export default function ActivityCreate() {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const [form, setForm] = useState({
    title: '',
    description: '',
    category: '',
    city: 'Kolkata',
    country: 'India',
    latitude: '22.5726',
    longitude: '88.3639',
    price: '',
    durationMinutes: 60,
    featured: false,
    isPublished: true,
    tags: '',
    capacity: '',
  });

  const [images, setImages] = useState([]);
  const [dragActive, setDragActive] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [loading, setLoading] = useState(false);

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
      [name]: type === "checkbox" ? checked : value 
    }));
  };

  // Get user's current location
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

  // Validate files
  const validateFiles = (fileList) => {
    const files = Array.from(fileList || []);
    if (!files.length) return { ok: false, files: [] };
    const ALLOWED = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
    const MAX = 10 * 1024 * 1024;
    for (const f of files) {
      if (!ALLOWED.includes(f.type)) {
        toast.error(`Unsupported type: ${f.type || f.name}`);
        return { ok: false, files: [] };
      }
      if (f.size > MAX) {
        toast.error(`${f.name} is larger than 10MB`);
        return { ok: false, files: [] };
      }
    }
    return { ok: true, files };
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
  
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
    if (e.type === "dragleave") setDragActive(false);
  };
  
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files?.length) handleImageUpload(e.dataTransfer.files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    // Validations
    if (!form.title.trim()) return toast.error("Activity title is required");
    if (!form.category) return toast.error("Select a category");
    if (!form.city.trim() || !form.country.trim()) {
      return toast.error("City and country are required");
    }
    
    // Validate coordinates
    const lat = parseFloat(form.latitude);
    const lng = parseFloat(form.longitude);
    
    if (!Number.isFinite(lat) || lat < -90 || lat > 90) {
      return toast.error("Latitude must be between -90 and 90");
    }
    if (!Number.isFinite(lng) || lng < -180 || lng > 180) {
      return toast.error("Longitude must be between -180 and 180");
    }

    const priceNum = Number(form.price);
    if (!Number.isFinite(priceNum) || priceNum < 0 || priceNum > 50000) {
      return toast.error("Price must be between 0 and 50000");
    }
    
    const duration = Number(form.durationMinutes) || 60;
    if (duration < 15 || duration > 1440) {
      return toast.error("Duration must be between 15 and 1440 minutes");
    }
    
    if (form.capacity) {
      const cap = Number(form.capacity);
      if (!Number.isFinite(cap) || cap < 1 || cap > 100) {
        return toast.error("Capacity must be between 1 and 100");
      }
    }
    
    if (!images.length) return toast.error("Add at least one image");

    const payload = {
      title: form.title.trim(),
      description: (form.description || "").trim(),
      category: form.category.trim(),
      city: form.city.trim(),
      country: form.country.trim(),
      latitude: lat,
      longitude: lng,
      price: priceNum,
      basePrice: priceNum,
      durationMinutes: duration,
      featured: !!form.featured,
      isPublished: !!form.isPublished,
      capacity: form.capacity ? Number(form.capacity) : undefined,
      tags: (form.tags || "")
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean)
        .slice(0, 30) // Max 30 tags
        .map((t) => t.slice(0, 50)), // Max 50 chars each
      images,
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

  return (
    <DashboardLayout role="admin" title="Create Activity" user={user}>
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
        <Card>
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Basic Information</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Activity Title */}
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
                  maxLength={100}
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
                    <option key={c} value={c} className="capitalize">{c}</option>
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

              {/* Capacity */}
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
                  placeholder="Describe the activity..."
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-800 resize-none" 
                />
                <p className="text-xs text-gray-500 mt-1">{form.description.length}/2000 characters</p>
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
              onDragOver={handleDrag} onDrop={handleDrop}>
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
                        className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600">
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