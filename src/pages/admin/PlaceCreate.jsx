// // import { useState } from "react";
// // import { useNavigate } from "react-router-dom";
// // import DashboardLayout from "@/components/Layout/DashboardLayout";
// // import Button from "@/components/ui/Button";
// // import { Card, CardContent } from "@/components/ui/Card";
// // import api from "@/lib/api";
// // import { uploadMediaMany } from "@/lib/media";
// // import toast from "react-hot-toast";

// // export default function PlaceCreate() {
// //   const nav = useNavigate();
// //   const [form, setForm] = useState({
// //     title: "",        // use "title" to align with PlaceDetail usage
// //     description: "",
// //     city: "",
// //     country: "",
// //     tags: "",
// //     featured: false,
// //   });
// //   const [images, setImages] = useState([]);
// //   const [busy, setBusy] = useState(false);

// //   const onUpload = async (files) => {
// //     if (!files?.length) return;
// //     setBusy(true);
// //     try {
// //       const docs = await uploadMediaMany(files);
// //       setImages((prev) => [...prev, ...docs.map((d) => d.url)]);
// //       toast.success(`Uploaded ${docs.length} file(s)`);
// //     } catch {
// //       toast.error("Upload failed");
// //     } finally {
// //       setBusy(false);
// //     }
// //   };

// //   const removeImage = (idx) => {
// //     setImages((prev) => prev.filter((_, i) => i !== idx));
// //   };

// //   const submit = async (e) => {
// //     e.preventDefault();
// //     setBusy(true);
// //     try {
// //       const payload = {
// //         title: form.title.trim(),
// //         description: form.description.trim(),
// //         tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
// //         location: { city: form.city.trim(), country: form.country.trim() },
// //         images,
// //         featured: !!form.featured,
// //       };
// //       const { data } = await api.post("/places", payload);
// //       toast.success("Place created");
// //       nav(`/places/${data?.data?._id || data?._id}`);
// //     } catch (err) {
// //       toast.error(err?.response?.data?.error || "Failed to create place");
// //     } finally {
// //       setBusy(false);
// //     }
// //   };

// //   return (
// //     <DashboardLayout role="admin" title="Add Place">
// //       <form onSubmit={submit} className="space-y-6">
// //         <Card>
// //           <CardContent className="p-4 grid gap-4 md:grid-cols-2">
// //             <input
// //               className="border p-2 rounded"
// //               placeholder="Title *"
// //               value={form.title}
// //               onChange={(e) => setForm((s) => ({ ...s, title: e.target.value }))}
// //               required
// //             />
// //             <input
// //               className="border p-2 rounded"
// //               placeholder="City"
// //               value={form.city}
// //               onChange={(e) => setForm((s) => ({ ...s, city: e.target.value }))}
// //             />
// //             <input
// //               className="border p-2 rounded"
// //               placeholder="Country"
// //               value={form.country}
// //               onChange={(e) => setForm((s) => ({ ...s, country: e.target.value }))}
// //             />
// //             <input
// //               className="border p-2 rounded"
// //               placeholder="Tags (comma separated)"
// //               value={form.tags}
// //               onChange={(e) => setForm((s) => ({ ...s, tags: e.target.value }))}
// //             />
// //             <div className="md:col-span-2">
// //               <textarea
// //                 className="border p-2 rounded w-full min-h-[120px]"
// //                 placeholder="Description"
// //                 value={form.description}
// //                 onChange={(e) => setForm((s) => ({ ...s, description: e.target.value }))}
// //               />
// //             </div>
// //             <label className="flex items-center gap-2 md:col-span-2">
// //               <input
// //                 type="checkbox"
// //                 checked={form.featured}
// //                 onChange={(e) => setForm((s) => ({ ...s, featured: e.target.checked }))}
// //               />
// //               <span>Featured (show on Home)</span>
// //             </label>
// //           </CardContent>
// //         </Card>

// //         <Card>
// //           <CardContent className="p-4 space-y-3">
// //             <input type="file" multiple accept="image/*,video/*" onChange={(e) => onUpload(e.target.files)} />
// //             {!!images.length && (
// //               <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
// //                 {images.map((u, i) => (
// //                   <div key={i} className="relative">
// //                     <img
// //                       src={u.includes("/upload/") ? u.replace("/upload/", "/upload/c_fill,w_400,h_250,f_auto,q_auto/") : u}
// //                       alt=""
// //                       className="h-28 w-full object-cover rounded"
// //                     />
// //                     <button
// //                       type="button"
// //                       onClick={() => removeImage(i)}
// //                       className="absolute top-1 right-1 text-xs bg-black/60 text-white px-2 py-0.5 rounded"
// //                     >
// //                       Remove
// //                     </button>
// //                   </div>
// //                 ))}
// //               </div>
// //             )}
// //           </CardContent>
// //         </Card>

// //         <div className="flex gap-3">
// //           <Button type="submit" disabled={busy}>{busy ? "Saving…" : "Create Place"}</Button>
// //           <Button variant="outline" onClick={() => nav(-1)} disabled={busy}>Cancel</Button>
// //         </div>
// //       </form>
// //     </DashboardLayout>
// //   );
// // }










// import { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import api from '@/lib/api';
// import Button from '@/components/ui/Button';
// import { Card, CardContent } from '@/components/ui/Card';
// import toast from 'react-hot-toast';

// export default function PlaceCreate(){
//   const nav = useNavigate();
//   const [form,setForm]=useState({ title:'', description:'', category:'', city:'Kolkata', country:'India', featured:true, tags:'' });
//   const [files,setFiles]=useState([]);
//   const [uploading,setUploading]=useState(false);

//   const uploadImages = async ()=>{
//     if (!files.length) return [];
//     const fd = new FormData();
//     files.forEach(f => fd.append('files', f));
//     const { data } = await api.post('/media/upload', fd, { headers:{ 'Content-Type':'multipart/form-data' } });
//     return data?.data?.urls || [];
//   };

//   const onSubmit = async (e)=>{
//     e.preventDefault();
//     try{
//       setUploading(true);
//       const urls = await uploadImages();
//       await api.post('/places', {
//         title: form.title,
//         description: form.description,
//         category: form.category,
//         tags: form.tags ? form.tags.split(',').map(t=>t.trim()).filter(Boolean) : [],
//         location: { city: form.city, country: form.country },
//         images: urls,
//         featured: !!form.featured,
//         approved: true,
//       });
//       toast.success('Place created');
//       nav('/admin/places');
//     }catch(err){ /* toast by interceptor */ }finally{ setUploading(false); }
//   };

//   return (
//     <div className="max-w-3xl mx-auto px-4 py-8">
//       <h1 className="text-2xl font-bold mb-4">Add Place</h1>
//       <Card>
//         <CardContent className="p-4 space-y-4">
//           <form onSubmit={onSubmit} className="space-y-4">
//             <input className="w-full border p-3 rounded" placeholder="Title *" value={form.title} onChange={e=>setForm(s=>({...s, title:e.target.value}))} required />
//             <textarea className="w-full border p-3 rounded" rows={4} placeholder="Description" value={form.description} onChange={e=>setForm(s=>({...s, description:e.target.value}))}/>
//             <div className="grid grid-cols-2 gap-3">
//               <input className="border p-3 rounded" placeholder="Category" value={form.category} onChange={e=>setForm(s=>({...s, category:e.target.value}))}/>
//               <input className="border p-3 rounded" placeholder="Tags (comma separated)" value={form.tags} onChange={e=>setForm(s=>({...s, tags:e.target.value}))}/>
//               <input className="border p-3 rounded" placeholder="City" value={form.city} onChange={e=>setForm(s=>({...s, city:e.target.value}))}/>
//               <input className="border p-3 rounded" placeholder="Country" value={form.country} onChange={e=>setForm(s=>({...s, country:e.target.value}))}/>
//             </div>

//             <div>
//               <label className="block text-sm mb-1">Images (Cloudinary)</label>
//               <input type="file" multiple accept="image/*" onChange={e=>setFiles(Array.from(e.target.files||[]))}/>
//               <div className="mt-2 flex gap-2 flex-wrap">{files.map((f,i)=><span key={i} className="text-xs bg-gray-100 px-2 py-1 rounded">{f.name}</span>)}</div>
//             </div>

//             <label className="inline-flex items-center gap-2">
//               <input type="checkbox" checked={form.featured} onChange={e=>setForm(s=>({...s, featured:e.target.checked}))}/>
//               <span>Featured</span>
//             </label>

//             <div className="flex justify-end gap-2">
//               <Button variant="outline" onClick={()=>history.back()}>Cancel</Button>
//               <Button type="submit" loading={uploading}>Create</Button>
//             </div>
//           </form>
//         </CardContent>
//       </Card>
//     </div>
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
  Globe
} from 'lucide-react';
import { useSampleDataStore } from '@/store/sampleData';
import { useAuthStore } from '@/store/auth';
import toast from 'react-hot-toast';

export default function PlaceCreate() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { addPlace } = useSampleDataStore();
  
  const [form, setForm] = useState({
    name: '',
    description: '',
    category: '',
    city: 'Kolkata',
    country: 'India',
    featured: false,
    tags: ''
  });
  
  const [images, setImages] = useState([]);
  const [dragActive, setDragActive] = useState(false);
  const [loading, setLoading] = useState(false);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Mock image upload (in real app, this would upload to Cloudinary/S3)
  const handleImageUpload = (files) => {
    const newImages = Array.from(files).map((file, index) => ({
      id: Date.now() + index,
      url: URL.createObjectURL(file),
      name: file.name
    }));
    setImages(prev => [...prev, ...newImages]);
  };

  // Handle drag and drop
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleImageUpload(e.dataTransfer.files);
    }
  };

  // Remove image
  const removeImage = (id) => {
    setImages(prev => prev.filter(img => img.id !== id));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate required fields
      if (!form.name.trim()) {
        toast.error('Place name is required');
        return;
      }

      if (!form.city.trim() || !form.country.trim()) {
        toast.error('City and country are required');
        return;
      }

      if (images.length === 0) {
        toast.error('At least one image is required');
        return;
      }

      // Create place data
      const placeData = {
        name: form.name.trim(),
        description: form.description.trim(),
        category: form.category.trim(),
        city: form.city.trim(),
        country: form.country.trim(),
        featured: form.featured,
        images: images.map(img => img.url),
        tags: form.tags ? form.tags.split(',').map(t => t.trim()).filter(Boolean) : []
      };

      // Add to store
      addPlace(placeData);
      
      toast.success('Place created successfully!');
      navigate('/admin/places');
      
    } catch (error) {
      console.error('Error creating place:', error);
      toast.error('Failed to create place');
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    'cultural', 'nature', 'art', 'spiritual', 'food', 
    'entertainment', 'shopping', 'historical', 'architectural'
  ];

  const commonCities = [
    'Kolkata', 'Mumbai', 'Delhi', 'Bangalore', 'Chennai',
    'Hyderabad', 'Pune', 'Ahmedabad', 'Jaipur', 'Goa'
  ];

  return (
    <DashboardLayout role="admin" title="Create Place" user={user}>
      
      {/* Header */}
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
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Add New Place</h1>
          <p className="text-gray-600 dark:text-gray-400">Create a new destination or point of interest</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Basic Information */}
        <Card>
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Basic Information</h2>
            
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
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-800"
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
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-800"
                >
                  <option value="">Select category</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat} className="capitalize">{cat}</option>
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
                    <span className="text-gray-700 dark:text-gray-300">Featured Place</span>
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
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-800"
                  />
                  <datalist id="cities">
                    {commonCities.map(city => (
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
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-800"
                  />
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
                  placeholder="heritage, monument, british era (comma separated)"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-800"
                />
                <p className="text-xs text-gray-500 mt-1">Separate tags with commas</p>
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
                  placeholder="Describe this place, its history, and what makes it special..."
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-800 resize-none"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Images */}
        <Card>
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Images *</h2>
            
            {/* Upload Area */}
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
                onChange={(e) => e.target.files && handleImageUpload(e.target.files)}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <Upload className="h-10 w-10 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400 mb-2">
                Drop images here or <span className="text-primary-600 font-medium">browse</span>
              </p>
              <p className="text-sm text-gray-500">
                Support: JPG, PNG, WEBP up to 10MB each. At least one image required.
              </p>
            </div>

            {/* Image Preview */}
            {images.length > 0 && (
              <div className="mt-6">
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Uploaded Images ({images.length})
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {images.map((image, index) => (
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
                        onClick={() => removeImage(image.id)}
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

        {/* Quick Tips */}
        <Card className="border-l-4 border-blue-500 bg-blue-50 dark:bg-blue-900/10">
          <CardContent className="p-4">
            <h3 className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-2">💡 Tips for adding places</h3>
            <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
              <li>• Add high-quality images that showcase the place's beauty</li>
              <li>• Write detailed descriptions to help visitors understand what to expect</li>
              <li>• Use relevant tags to improve searchability</li>
              <li>• Mark places as featured if they're must-visit destinations</li>
            </ul>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex items-center justify-end gap-4">
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => navigate('/admin/places')}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            loading={loading}
            className="inline-flex items-center gap-2"
          >
            <Save className="h-4 w-4" />
            Create Place
          </Button>
        </div>
      </form>
    </DashboardLayout>
  );
}