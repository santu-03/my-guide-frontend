// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import DashboardLayout from "@/components/Layout/DashboardLayout";
// import Button from "@/components/ui/Button";
// import { Card, CardContent } from "@/components/ui/Card";
// import api from "@/lib/api";
// import { uploadMediaMany } from "@/lib/media";
// import toast from "react-hot-toast";

// export default function ActivityCreate() {
//   const nav = useNavigate();
//   const [form, setForm] = useState({
//     title: "",
//     description: "",
//     category: "",
//     price: "",
//     capacity: "",
//     city: "",
//     country: "",
//     placeId: "", // optional link to a Place
//     featured: false,
//     isPublished: true,
//   });
//   const [images, setImages] = useState([]);
//   const [busy, setBusy] = useState(false);

//   const onUpload = async (files) => {
//     if (!files?.length) return;
//     setBusy(true);
//     try {
//       const docs = await uploadMediaMany(files);
//       setImages((prev) => [...prev, ...docs.map((d) => d.url)]);
//       toast.success(`Uploaded ${docs.length} file(s)`);
//     } catch {
//       toast.error("Upload failed");
//     } finally {
//       setBusy(false);
//     }
//   };

//   const removeImage = (idx) => {
//     setImages((prev) => prev.filter((_, i) => i !== idx));
//   };

//   const submit = async (e) => {
//     e.preventDefault();
//     setBusy(true);
//     try {
//       const payload = {
//         title: form.title.trim(),
//         description: form.description.trim(),
//         category: form.category.trim(),
//         price: Number(form.price) || 0,
//         capacity: Number(form.capacity) || 1,
//         location: { city: form.city.trim(), country: form.country.trim() },
//         images,
//         isPublished: !!form.isPublished,
//         featured: !!form.featured,
//       };
//       if (form.placeId) payload.placeId = form.placeId; // or `place` based on your API

//       const { data } = await api.post("/activities", payload);
//       toast.success("Activity created");
//       nav(`/activities/${data?.data?._id || data?._id}`);
//     } catch (err) {
//       toast.error(err?.response?.data?.error || "Failed to create activity");
//     } finally {
//       setBusy(false);
//     }
//   };

//   return (
//     <DashboardLayout role="admin" title="Add Activity">
//       <form onSubmit={submit} className="space-y-6">
//         <Card>
//           <CardContent className="p-4 grid gap-4 md:grid-cols-2">
//             <input
//               className="border p-2 rounded"
//               placeholder="Title *"
//               value={form.title}
//               onChange={(e) => setForm((s) => ({ ...s, title: e.target.value }))}
//               required
//             />
//             <input
//               className="border p-2 rounded"
//               placeholder="Category (e.g. cultural, food)"
//               value={form.category}
//               onChange={(e) => setForm((s) => ({ ...s, category: e.target.value }))}
//             />
//             <input
//               className="border p-2 rounded"
//               placeholder="Price (₹) *"
//               value={form.price}
//               type="number"
//               min="0"
//               onChange={(e) => setForm((s) => ({ ...s, price: e.target.value }))}
//               required
//             />
//             <input
//               className="border p-2 rounded"
//               placeholder="Capacity (max guests) *"
//               value={form.capacity}
//               type="number"
//               min="1"
//               onChange={(e) => setForm((s) => ({ ...s, capacity: e.target.value }))}
//               required
//             />
//             <input
//               className="border p-2 rounded"
//               placeholder="City"
//               value={form.city}
//               onChange={(e) => setForm((s) => ({ ...s, city: e.target.value }))}
//             />
//             <input
//               className="border p-2 rounded"
//               placeholder="Country"
//               value={form.country}
//               onChange={(e) => setForm((s) => ({ ...s, country: e.target.value }))}
//             />
//             <input
//               className="border p-2 rounded md:col-span-2"
//               placeholder="Linked Place ID (optional)"
//               value={form.placeId}
//               onChange={(e) => setForm((s) => ({ ...s, placeId: e.target.value }))}
//             />
//             <div className="md:col-span-2">
//               <textarea
//                 className="border p-2 rounded w-full min-h-[120px]"
//                 placeholder="Description"
//                 value={form.description}
//                 onChange={(e) => setForm((s) => ({ ...s, description: e.target.value }))}
//               />
//             </div>
//             <div className="flex items-center gap-6 md:col-span-2">
//               <label className="flex items-center gap-2">
//                 <input
//                   type="checkbox"
//                   checked={form.featured}
//                   onChange={(e) => setForm((s) => ({ ...s, featured: e.target.checked }))}
//                 />
//                 <span>Featured (show on Home)</span>
//               </label>
//               <label className="flex items-center gap-2">
//                 <input
//                   type="checkbox"
//                   checked={form.isPublished}
//                   onChange={(e) => setForm((s) => ({ ...s, isPublished: e.target.checked }))}
//                 />
//                 <span>Published</span>
//               </label>
//             </div>
//           </CardContent>
//         </Card>

//         <Card>
//           <CardContent className="p-4 space-y-3">
//             <input type="file" multiple accept="image/*,video/*" onChange={(e) => onUpload(e.target.files)} />
//             {!!images.length && (
//               <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
//                 {images.map((u, i) => (
//                   <div key={i} className="relative">
//                     <img
//                       src={u.includes("/upload/") ? u.replace("/upload/", "/upload/c_fill,w_400,h_250,f_auto,q_auto/") : u}
//                       alt=""
//                       className="h-28 w-full object-cover rounded"
//                     />
//                     <button
//                       type="button"
//                       onClick={() => removeImage(i)}
//                       className="absolute top-1 right-1 text-xs bg-black/60 text-white px-2 py-0.5 rounded"
//                     >
//                       Remove
//                     </button>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </CardContent>
//         </Card>

//         <div className="flex gap-3">
//           <Button type="submit" disabled={busy}>{busy ? "Saving…" : "Create Activity"}</Button>
//           <Button variant="outline" onClick={() => nav(-1)} disabled={busy}>Cancel</Button>
//         </div>
//       </form>
//     </DashboardLayout>
//   );
// }
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '@/lib/api';
import Button from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import toast from 'react-hot-toast';

export default function ActivityCreate(){
  const nav = useNavigate();
  const [form,setForm]=useState({ title:'', description:'', category:'', price:0, durationMinutes:60, city:'Kolkata', country:'India', featured:true, isPublished:true, tags:'' });
  const [files,setFiles]=useState([]);
  const [uploading,setUploading]=useState(false);

  const uploadImages = async ()=>{
    if (!files.length) return [];
    const fd = new FormData();
    files.forEach(f => fd.append('files', f));
    const { data } = await api.post('/media/upload', fd, { headers:{ 'Content-Type':'multipart/form-data' } });
    return data?.data?.urls || [];
  };

  const onSubmit = async (e)=>{
    e.preventDefault();
    try{
      setUploading(true);
      const urls = await uploadImages();
      await api.post('/activities', {
        title: form.title,
        description: form.description,
        category: form.category,
        tags: form.tags ? form.tags.split(',').map(t=>t.trim()).filter(Boolean) : [],
        price: Number(form.price)||0,
        durationMinutes: Number(form.durationMinutes)||60,
        location: { city: form.city, country: form.country },
        images: urls,
        featured: !!form.featured,
        isPublished: !!form.isPublished,
      });
      toast.success('Activity created');
      nav('/admin/activities');
    }catch(err){ /* interceptor toasts */ }finally{ setUploading(false); }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Add Activity</h1>
      <Card>
        <CardContent className="p-4 space-y-4">
          <form onSubmit={onSubmit} className="space-y-4">
            <input className="w-full border p-3 rounded" placeholder="Title *" value={form.title} onChange={e=>setForm(s=>({...s, title:e.target.value}))} required />
            <textarea className="w-full border p-3 rounded" rows={4} placeholder="Description" value={form.description} onChange={e=>setForm(s=>({...s, description:e.target.value}))}/>
            <div className="grid grid-cols-2 gap-3">
              <input className="border p-3 rounded" placeholder="Category" value={form.category} onChange={e=>setForm(s=>({...s, category:e.target.value}))}/>
              <input className="border p-3 rounded" placeholder="Tags (comma separated)" value={form.tags} onChange={e=>setForm(s=>({...s, tags:e.target.value}))}/>
              <input type="number" className="border p-3 rounded" placeholder="Price (INR)" value={form.price} onChange={e=>setForm(s=>({...s, price:e.target.value}))}/>
              <input type="number" className="border p-3 rounded" placeholder="Duration (minutes)" value={form.durationMinutes} onChange={e=>setForm(s=>({...s, durationMinutes:e.target.value}))}/>
            </div>

            <div>
              <label className="block text-sm mb-1">Images (Cloudinary)</label>
              <input type="file" multiple accept="image/*" onChange={e=>setFiles(Array.from(e.target.files||[]))}/>
              <div className="mt-2 flex gap-2 flex-wrap">{files.map((f,i)=><span key={i} className="text-xs bg-gray-100 px-2 py-1 rounded">{f.name}</span>)}</div>
            </div>

            <div className="flex gap-6">
              <label className="inline-flex items-center gap-2">
                <input type="checkbox" checked={form.featured} onChange={e=>setForm(s=>({...s, featured:e.target.checked}))}/>
                <span>Featured</span>
              </label>
              <label className="inline-flex items-center gap-2">
                <input type="checkbox" checked={form.isPublished} onChange={e=>setForm(s=>({...s, isPublished:e.target.checked}))}/>
                <span>Published</span>
              </label>
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={()=>history.back()}>Cancel</Button>
              <Button type="submit" loading={uploading}>Create</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
