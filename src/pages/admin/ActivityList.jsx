// import { useEffect, useState } from "react";
// import { Link } from "react-router-dom";
// import DashboardLayout from "@/components/Layout/DashboardLayout";
// import api from "@/lib/api";
// import Button from "@/components/ui/Button";
// import { Card, CardContent } from "@/components/ui/Card";
// import toast from "react-hot-toast";

// export default function ActivityList() {
//   const [rows, setRows] = useState([]);
//   const [page, setPage] = useState(1);
//   const [loading, setLoading] = useState(true);

//   async function load(p = 1) {
//     setLoading(true);
//     try {
//       const { data } = await api.get(`/activities?limit=20&page=${p}`);
//       const items = Array.isArray(data?.data) ? data.data : data?.items || [];
//       setRows(items);
//       setPage(p);
//     } catch {
//       toast.error("Failed to load activities");
//     } finally {
//       setLoading(false);
//     }
//   }

//   useEffect(() => { load(1); }, []);

//   const remove = async (id) => {
//     if (!confirm("Delete this activity?")) return;
//     try {
//       await api.delete(`/activities/${id}`);
//       toast.success("Deleted");
//       load(page);
//     } catch {
//       toast.error("Delete failed");
//     }
//   };

//   const toggleFeatured = async (r) => {
//     try {
//       const next = !r.featured;
//       await api.patch(`/activities/${r._id}`, { featured: next });
//       toast.success(next ? "Marked as featured" : "Removed from featured");
//       setRows((prev) => prev.map((x) => (x._id === r._id ? { ...x, featured: next } : x)));
//     } catch {
//       toast.error("Update failed");
//     }
//   };

//   const togglePublished = async (r) => {
//     try {
//       const next = !r.isPublished;
//       await api.patch(`/activities/${r._id}`, { isPublished: next });
//       toast.success(next ? "Published" : "Unpublished");
//       setRows((prev) => prev.map((x) => (x._id === r._id ? { ...x, isPublished: next } : x)));
//     } catch {
//       toast.error("Update failed");
//     }
//   };

//   return (
//     <DashboardLayout role="admin" title="Activities">
//       <div className="flex items-center justify-between mb-4">
//         <h1 className="text-2xl font-semibold">Activities</h1>
//         <Link to="/dashboard/admin/activities/new"><Button>Add Activity</Button></Link>
//       </div>

//       <Card>
//         <CardContent className="p-0 overflow-x-auto">
//           <table className="min-w-full text-sm">
//             <thead className="bg-gray-50 dark:bg-gray-800">
//               <tr>
//                 <th className="text-left p-3">Title</th>
//                 <th className="text-left p-3">Category</th>
//                 <th className="text-left p-3">Price</th>
//                 <th className="text-left p-3">Images</th>
//                 <th className="text-left p-3">Featured</th>
//                 <th className="text-left p-3">Published</th>
//                 <th className="text-right p-3">Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {loading ? (
//                 <tr><td className="p-4" colSpan={7}>Loading…</td></tr>
//               ) : rows.length === 0 ? (
//                 <tr><td className="p-4" colSpan={7}>No activities yet.</td></tr>
//               ) : rows.map((r) => (
//                 <tr key={r._id} className="border-t dark:border-gray-700">
//                   <td className="p-3">{r.title}</td>
//                   <td className="p-3">{r.category || "—"}</td>
//                   <td className="p-3">₹{r.price}</td>
//                   <td className="p-3">{Array.isArray(r.images) ? r.images.length : 0}</td>
//                   <td className="p-3">
//                     <label className="inline-flex items-center gap-2 cursor-pointer">
//                       <input type="checkbox" checked={!!r.featured} onChange={() => toggleFeatured(r)} />
//                       <span>{r.featured ? "Yes" : "No"}</span>
//                     </label>
//                   </td>
//                   <td className="p-3">
//                     <label className="inline-flex items-center gap-2 cursor-pointer">
//                       <input type="checkbox" checked={!!r.isPublished} onChange={() => togglePublished(r)} />
//                       <span>{r.isPublished ? "Yes" : "No"}</span>
//                     </label>
//                   </td>
//                   <td className="p-3 text-right space-x-3">
//                     <Link to={`/activities/${r._id}`} className="underline">View</Link>
//                     <Link to={`/dashboard/admin/activities/${r._id}/edit`} className="underline">Edit</Link>
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
  Clock,
  Users,
  DollarSign
} from "lucide-react";
import { useSampleDataStore } from "@/store/sampleData";
import { useAuthStore } from "@/store/auth";
import toast from "react-hot-toast";

export default function ActivityList() {
  const { user } = useAuthStore();
  const { activities, places, updateActivity, deleteActivity } = useSampleDataStore();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [sortBy, setSortBy] = useState("title");

  // Get unique categories
  const categories = useMemo(() => {
    const cats = [...new Set(activities.map(a => a.category))];
    return cats.filter(Boolean);
  }, [activities]);

  // Filter and search activities
  const filteredActivities = useMemo(() => {
    let filtered = activities;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(activity =>
        activity.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        activity.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Category filter
    if (filterCategory !== "all") {
      filtered = filtered.filter(activity => activity.category === filterCategory);
    }

    // Status filter
    if (filterStatus !== "all") {
      if (filterStatus === "published") {
        filtered = filtered.filter(activity => activity.isPublished);
      } else if (filterStatus === "draft") {
        filtered = filtered.filter(activity => !activity.isPublished);
      } else if (filterStatus === "featured") {
        filtered = filtered.filter(activity => activity.featured);
      }
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "title":
          return a.title.localeCompare(b.title);
        case "price":
          return b.price - a.price;
        case "category":
          return a.category.localeCompare(b.category);
        case "duration":
          return b.durationMinutes - a.durationMinutes;
        default:
          return 0;
      }
    });

    return filtered;
  }, [activities, searchTerm, filterCategory, filterStatus, sortBy]);

  // Get place name for activity
  const getPlaceName = (placeId) => {
    const place = places.find(p => p.id === placeId);
    return place?.name || "Unknown Place";
  };

  // Handle delete
  const handleDelete = (activity) => {
    if (confirm(`Are you sure you want to delete "${activity.title}"?`)) {
      deleteActivity(activity.id);
      toast.success("Activity deleted successfully");
    }
  };

  // Toggle featured status
  const toggleFeatured = (activity) => {
    updateActivity(activity.id, { featured: !activity.featured });
    toast.success(
      !activity.featured ? "Activity marked as featured" : "Activity removed from featured"
    );
  };

  // Toggle published status
  const togglePublished = (activity) => {
    updateActivity(activity.id, { isPublished: !activity.isPublished });
    toast.success(
      !activity.isPublished ? "Activity published" : "Activity unpublished"
    );
  };

  return (
    <DashboardLayout role="admin" title="Activities Management" user={user}>
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Activities</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage and organize your tour activities
          </p>
        </div>
        <Link to="/admin/activities/new">
          <Button className="inline-flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add Activity
          </Button>
        </Link>
      </div>

      {/* Filters and Search */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search activities..."
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
              <option value="published">Published</option>
              <option value="draft">Draft</option>
              <option value="featured">Featured</option>
            </select>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-800"
            >
              <option value="title">Sort by Title</option>
              <option value="price">Sort by Price</option>
              <option value="category">Sort by Category</option>
              <option value="duration">Sort by Duration</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Results Summary */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Showing {filteredActivities.length} of {activities.length} activities
        </p>
      </div>

      {/* Activities Grid */}
      {filteredActivities.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <div className="text-gray-400 mb-4">
              <Search className="h-12 w-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No activities found
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {searchTerm || filterCategory !== "all" || filterStatus !== "all"
                ? "Try adjusting your search or filters"
                : "Get started by creating your first activity"}
            </p>
            <Link to="/admin/activities/new">
              <Button>Create Activity</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredActivities.map((activity) => (
            <Card key={activity.id} className="group hover:shadow-lg transition-shadow">
              <CardContent className="p-0">
                
                {/* Image */}
                <div className="relative h-48 overflow-hidden rounded-t-lg">
                  <img
                    src={activity.images[0]}
                    alt={activity.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 left-3 flex gap-2">
                    {activity.featured && (
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-200 text-xs font-medium rounded-full">
                        <Star className="h-3 w-3" />
                        Featured
                      </span>
                    )}
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      activity.isPublished 
                        ? "bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-200"
                        : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400"
                    }`}>
                      {activity.isPublished ? "Published" : "Draft"}
                    </span>
                  </div>
                  <div className="absolute top-3 right-3">
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-black/60 text-white text-xs font-medium rounded-full capitalize">
                      {activity.category}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
                    {activity.title}
                  </h3>
                  
                  <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400 mb-4">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      <span>{getPlaceName(activity.placeId)}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>{activity.durationMinutes}min</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <DollarSign className="h-4 w-4" />
                        <span>₹{activity.price}</span>
                      </div>
                    </div>
                  </div>

                  {activity.description && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                      {activity.description}
                    </p>
                  )}

                  {/* Actions */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => toggleFeatured(activity)}
                        className={`p-1.5 rounded-lg transition-colors ${
                          activity.featured
                            ? "text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20"
                            : "text-gray-400 hover:text-yellow-600 hover:bg-yellow-100 dark:hover:bg-yellow-900/20"
                        }`}
                        title="Toggle featured"
                      >
                        <Star className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => togglePublished(activity)}
                        className={`p-1.5 rounded-lg transition-colors ${
                          activity.isPublished
                            ? "text-green-600 bg-green-100 dark:bg-green-900/20"
                            : "text-gray-400 hover:text-green-600 hover:bg-green-100 dark:hover:bg-green-900/20"
                        }`}
                        title="Toggle published"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="flex items-center gap-1">
                      <Link
                        to={`/activities/${activity.id}`}
                        className="p-1.5 text-gray-400 hover:text-primary-600 hover:bg-primary-100 dark:hover:bg-primary-900/20 rounded-lg transition-colors"
                        title="View activity"
                      >
                        <Eye className="h-4 w-4" />
                      </Link>
                      <Link
                        to={`/admin/activities/${activity.id}/edit`}
                        className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                        title="Edit activity"
                      >
                        <Edit className="h-4 w-4" />
                      </Link>
                      <button
                        onClick={() => handleDelete(activity)}
                        className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-100 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                        title="Delete activity"
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
      )}
    </DashboardLayout>
  );
}