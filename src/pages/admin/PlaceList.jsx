// import { useEffect, useState } from "react";
// import { Link } from "react-router-dom";
// import DashboardLayout from "@/components/Layout/DashboardLayout";
// import api from "@/lib/api";
// import Button from "@/components/ui/Button";
// import { Card, CardContent } from "@/components/ui/Card";
// import toast from "react-hot-toast";

// export default function PlaceList() {
//   const [rows, setRows] = useState([]);
//   const [page, setPage] = useState(1);
//   const [loading, setLoading] = useState(true);

//   async function load(p = 1) {
//     setLoading(true);
//     try {
//       const { data } = await api.get(`/places?limit=20&page=${p}`);
//       const items = Array.isArray(data?.data) ? data.data : data?.items || [];
//       setRows(items);
//       setPage(p);
//     } catch {
//       toast.error("Failed to load places");
//     } finally {
//       setLoading(false);
//     }
//   }

//   useEffect(() => { load(1); }, []);

//   const remove = async (id) => {
//     if (!confirm("Delete this place?")) return;
//     try {
//       await api.delete(`/places/${id}`);
//       toast.success("Deleted");
//       load(page);
//     } catch {
//       toast.error("Delete failed");
//     }
//   };

//   const toggleFeatured = async (r) => {
//     try {
//       const next = !r.featured;
//       await api.patch(`/places/${r._id}`, { featured: next });
//       toast.success(next ? "Marked as featured" : "Removed from featured");
//       setRows((prev) => prev.map((x) => (x._id === r._id ? { ...x, featured: next } : x)));
//     } catch {
//       toast.error("Update failed");
//     }
//   };

//   return (
//     <DashboardLayout role="admin" title="Places">
//       <div className="flex items-center justify-between mb-4">
//         <h1 className="text-2xl font-semibold">Places</h1>
//         <Link to="/dashboard/admin/places/new"><Button>Add Place</Button></Link>
//       </div>

//       <Card>
//         <CardContent className="p-0 overflow-x-auto">
//           <table className="min-w-full text-sm">
//             <thead className="bg-gray-50 dark:bg-gray-800">
//               <tr>
//                 <th className="text-left p-3">Name</th>
//                 <th className="text-left p-3">City</th>
//                 <th className="text-left p-3">Images</th>
//                 <th className="text-left p-3">Featured</th>
//                 <th className="text-right p-3">Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {loading ? (
//                 <tr><td className="p-4" colSpan={5}>Loading…</td></tr>
//               ) : rows.length === 0 ? (
//                 <tr><td className="p-4" colSpan={5}>No places yet.</td></tr>
//               ) : rows.map((r) => (
//                 <tr key={r._id} className="border-t dark:border-gray-700">
//                   <td className="p-3">{r.name || r.title}</td>
//                   <td className="p-3">{r?.location?.city || "—"}</td>
//                   <td className="p-3">{Array.isArray(r.images) ? r.images.length : 0}</td>
//                   <td className="p-3">
//                     <label className="inline-flex items-center gap-2 cursor-pointer">
//                       <input type="checkbox" checked={!!r.featured} onChange={() => toggleFeatured(r)} />
//                       <span>{r.featured ? "Yes" : "No"}</span>
//                     </label>
//                   </td>
//                   <td className="p-3 text-right space-x-3">
//                     <Link to={`/places/${r._id}`} className="underline">View</Link>
//                     <Link to={`/dashboard/admin/places/${r._id}/edit`} className="underline">Edit</Link>
//                     <button onClick={() => remove(r._id)} className="text-red-600 underline">Delete</button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </CardContent>
//       </Card>

//       <div className="mt-4 flex items-center justify-end gap-2">
//         <Button variant="outline" onClick={() => load(Math.max(1, page - 1))} disabled={page <= 1}>Prev</Button>
//         <span className="text-sm">Page {page}</span>
//         <Button variant="outline" onClick={() => load(page + 1)} disabled={rows.length < 20}>Next</Button>
//       </div>
//     </DashboardLayout>
//   );
// }



import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "@/components/Layout/DashboardLayout";
import Button from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { 
  Plus, 
  Search, 
  Filter, 
  Eye, 
  Edit, 
  Trash2, 
  Star,
  MapPin,
  Users,
  Image as ImageIcon,
  Grid,
  List as ListIcon
} from "lucide-react";
import { useSampleDataStore } from "@/store/sampleData";
import { useAuthStore } from "@/store/auth";
import toast from "react-hot-toast";

export default function PlaceList() {
  const { user } = useAuthStore();
  const { places, activities, updatePlace, deletePlace } = useSampleDataStore();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [sortBy, setSortBy] = useState("name");
  const [viewMode, setViewMode] = useState("grid"); // 'grid' or 'table'

  // Get unique categories
  const categories = useMemo(() => {
    const cats = [...new Set(places.map(p => p.category))];
    return cats.filter(Boolean);
  }, [places]);

  // Filter and search places
  const filteredPlaces = useMemo(() => {
    let filtered = places;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(place =>
        place.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        place.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        place.city?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Category filter
    if (filterCategory !== "all") {
      filtered = filtered.filter(place => place.category === filterCategory);
    }

    // Status filter
    if (filterStatus !== "all") {
      if (filterStatus === "featured") {
        filtered = filtered.filter(place => place.featured);
      } else if (filterStatus === "has-activities") {
        const placesWithActivities = activities.map(a => a.placeId);
        filtered = filtered.filter(place => placesWithActivities.includes(place.id));
      } else if (filterStatus === "no-activities") {
        const placesWithActivities = activities.map(a => a.placeId);
        filtered = filtered.filter(place => !placesWithActivities.includes(place.id));
      }
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name);
        case "category":
          return (a.category || "").localeCompare(b.category || "");
        case "city":
          return (a.city || "").localeCompare(b.city || "");
        case "activities":
          const aCount = activities.filter(act => act.placeId === a.id).length;
          const bCount = activities.filter(act => act.placeId === b.id).length;
          return bCount - aCount;
        default:
          return 0;
      }
    });

    return filtered;
  }, [places, activities, searchTerm, filterCategory, filterStatus, sortBy]);

  // Get activity count for a place
  const getActivityCount = (placeId) => {
    return activities.filter(activity => activity.placeId === placeId).length;
  };

  // Handle delete
  const handleDelete = (place) => {
    const activityCount = getActivityCount(place.id);
    if (activityCount > 0) {
      toast.error(`Cannot delete place with ${activityCount} associated activities`);
      return;
    }
    
    if (confirm(`Are you sure you want to delete "${place.name}"?`)) {
      deletePlace(place.id);
      toast.success("Place deleted successfully");
    }
  };

  // Toggle featured status
  const toggleFeatured = (place) => {
    updatePlace(place.id, { featured: !place.featured });
    toast.success(
      !place.featured ? "Place marked as featured" : "Place removed from featured"
    );
  };

  return (
    <DashboardLayout role="admin" title="Places Management" user={user}>
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Places</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage destinations and points of interest
          </p>
        </div>
        <Link to="/admin/places/new">
          <Button className="inline-flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add Place
          </Button>
        </Link>
      </div>

      {/* Filters and Search */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search places..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-800"
              />
            </div>

            {/* Category Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-800 appearance-none"
              >
                <option value="all">All Categories</option>
                {categories.map(cat => (
                  <option key={cat} value={cat} className="capitalize">{cat}</option>
                ))}
              </select>
            </div>

            {/* Status Filter */}
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-800"
            >
              <option value="all">All Status</option>
              <option value="featured">Featured</option>
              <option value="has-activities">With Activities</option>
              <option value="no-activities">Without Activities</option>
            </select>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-800"
            >
              <option value="name">Sort by Name</option>
              <option value="category">Sort by Category</option>
              <option value="city">Sort by City</option>
              <option value="activities">Sort by Activity Count</option>
            </select>
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Showing {filteredPlaces.length} of {places.length} places
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === "grid"
                    ? "bg-primary-100 text-primary-600 dark:bg-primary-900/20 dark:text-primary-400"
                    : "text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800"
                }`}
              >
                <Grid className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode("table")}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === "table"
                    ? "bg-primary-100 text-primary-600 dark:bg-primary-900/20 dark:text-primary-400"
                    : "text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800"
                }`}
              >
                <ListIcon className="h-4 w-4" />
              </button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* No Results */}
      {filteredPlaces.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <div className="text-gray-400 mb-4">
              <MapPin className="h-12 w-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No places found
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {searchTerm || filterCategory !== "all" || filterStatus !== "all"
                ? "Try adjusting your search or filters"
                : "Get started by adding your first place"}
            </p>
            <Link to="/admin/places/new">
              <Button>Add Place</Button>
            </Link>
          </CardContent>
        </Card>
      ) : viewMode === "grid" ? (
        /* Grid View */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPlaces.map((place) => (
            <Card key={place.id} className="group hover:shadow-lg transition-shadow">
              <CardContent className="p-0">
                
                {/* Image */}
                <div className="relative h-48 overflow-hidden rounded-t-lg">
                  <img
                    src={place.images[0]}
                    alt={place.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 left-3 flex gap-2">
                    {place.featured && (
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-200 text-xs font-medium rounded-full">
                        <Star className="h-3 w-3" />
                        Featured
                      </span>
                    )}
                    {place.category && (
                      <span className="px-2 py-1 bg-black/60 text-white text-xs font-medium rounded-full capitalize">
                        {place.category}
                      </span>
                    )}
                  </div>
                  <div className="absolute top-3 right-3">
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-white/90 dark:bg-gray-800/90 text-gray-700 dark:text-gray-300 text-xs font-medium rounded-full">
                      <Users className="h-3 w-3" />
                      {getActivityCount(place.id)}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                    {place.name}
                  </h3>
                  
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-3">
                    <MapPin className="h-4 w-4" />
                    <span>{place.city}, {place.country}</span>
                  </div>

                  {place.description && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                      {place.description}
                    </p>
                  )}

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => toggleFeatured(place)}
                        className={`p-1.5 rounded-lg transition-colors ${
                          place.featured
                            ? "text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20"
                            : "text-gray-400 hover:text-yellow-600 hover:bg-yellow-100 dark:hover:bg-yellow-900/20"
                        }`}
                        title="Toggle featured"
                      >
                        <Star className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="flex items-center gap-1">
                      <Link
                        to={`/places/${place.id}`}
                        className="p-1.5 text-gray-400 hover:text-primary-600 hover:bg-primary-100 dark:hover:bg-primary-900/20 rounded-lg transition-colors"
                        title="View place"
                      >
                        <Eye className="h-4 w-4" />
                      </Link>
                      <Link
                        to={`/admin/places/${place.id}/edit`}
                        className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                        title="Edit place"
                      >
                        <Edit className="h-4 w-4" />
                      </Link>
                      <button
                        onClick={() => handleDelete(place)}
                        className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-100 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                        title="Delete place"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        /* Table View */
        <Card>
          <CardContent className="p-0 overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th className="text-left p-4 font-medium text-gray-900 dark:text-white">Place</th>
                  <th className="text-left p-4 font-medium text-gray-900 dark:text-white">Category</th>
                  <th className="text-left p-4 font-medium text-gray-900 dark:text-white">Location</th>
                  <th className="text-left p-4 font-medium text-gray-900 dark:text-white">Activities</th>
                  <th className="text-left p-4 font-medium text-gray-900 dark:text-white">Status</th>
                  <th className="text-right p-4 font-medium text-gray-900 dark:text-white">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredPlaces.map((place) => (
                  <tr key={place.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={place.images[0]}
                          alt={place.name}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                        <div>
                          <h4 className="font-medium text-gray-900 dark:text-white">
                            {place.name}
                          </h4>
                          {place.description && (
                            <p className="text-sm text-gray-500 dark:text-gray-400 truncate max-w-xs">
                              {place.description}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="inline-flex items-center px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-xs font-medium rounded-full capitalize">
                        {place.category || "—"}
                      </span>
                    </td>
                    <td className="p-4 text-gray-600 dark:text-gray-400">
                      {place.city}, {place.country}
                    </td>
                    <td className="p-4">
                      <span className="inline-flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
                        <Users className="h-4 w-4" />
                        {getActivityCount(place.id)} activities
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        {place.featured && (
                          <span className="inline-flex items-center gap-1 px-2 py-1 bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300 text-xs font-medium rounded-full">
                            <Star className="h-3 w-3" />
                            Featured
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => toggleFeatured(place)}
                          className={`p-1.5 rounded-lg transition-colors ${
                            place.featured
                              ? "text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20"
                              : "text-gray-400 hover:text-yellow-600 hover:bg-yellow-100 dark:hover:bg-yellow-900/20"
                          }`}
                          title="Toggle featured"
                        >
                          <Star className="h-4 w-4" />
                        </button>
                        <Link
                          to={`/places/${place.id}`}
                          className="p-1.5 text-gray-400 hover:text-primary-600 hover:bg-primary-100 dark:hover:bg-primary-900/20 rounded-lg transition-colors"
                          title="View place"
                        >
                          <Eye className="h-4 w-4" />
                        </Link>
                        <Link
                          to={`/admin/places/${place.id}/edit`}
                          className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                          title="Edit place"
                        >
                          <Edit className="h-4 w-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(place)}
                          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-100 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                          title="Delete place"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}
    </DashboardLayout>
  );
}