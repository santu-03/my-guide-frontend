import { useState, useMemo, useEffect } from "react";
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
  Grid,
  List as ListIcon,
  RefreshCw,
  Loader2,
} from "lucide-react";
import { useAuthStore } from "@/store/auth";
import toast from "react-hot-toast";

// ✅ API methods (Mongo-connected)
import { getPlaces, updatePlace, deletePlace } from "@/lib/places";
import { getActivities } from "@/lib/activities";

export default function PlaceList() {
  const { user } = useAuthStore();

  const [places, setPlaces] = useState([]);
  const [activitiesByPlace, setActivitiesByPlace] = useState({}); // {placeId: count}
  const [loading, setLoading] = useState(true);
  const [loadingCounts, setLoadingCounts] = useState(false);
  const [error, setError] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [sortBy, setSortBy] = useState("name");
  const [viewMode, setViewMode] = useState("grid"); // 'grid' or 'table'

  // Fetch places
  const loadPlaces = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = { limit: 500 }; // adjust if you paginate
      const res = await getPlaces(params);
      const data = res.data || res.places || res;
      setPlaces(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Load places error:", err);
      setError(err?.response?.data?.message || err?.message || "Failed to load places");
      setPlaces([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch activity counts (by place)
  const loadActivityCounts = async (placeIds) => {
    try {
      setLoadingCounts(true);
      const counts = {};

      // Prefer a backend endpoint that returns counts grouped by placeId.
      // If not available, fetch activities with a placeId filter in a loop.
      // To reduce calls, batch if your API supports it. Here we loop safely:
      for (const pid of placeIds) {
        try {
          const resp = await getActivities({ placeId: pid, limit: 1_000, select: "_id" });
          const arr = resp.data || resp.activities || resp || [];
          counts[pid] = Array.isArray(arr) ? arr.length : 0;
        } catch {
          counts[pid] = 0;
        }
      }

      setActivitiesByPlace(counts);
    } catch (e) {
      console.error("Load activity counts error:", e);
    } finally {
      setLoadingCounts(false);
    }
  };

  useEffect(() => {
    (async () => {
      await loadPlaces();
    })();
  }, []);

  // When places change, load counts
  useEffect(() => {
    if (!places.length) return;
    const ids = places.map((p) => p._id || p.id);
    loadActivityCounts(ids);
  }, [places]);

  // Get unique categories
  const categories = useMemo(() => {
    const cats = [...new Set(places.map((p) => p.category).filter(Boolean))];
    return cats;
  }, [places]);

  // Search, filter, sort
  const filteredPlaces = useMemo(() => {
    let filtered = [...places];

    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (place) =>
          place.name?.toLowerCase().includes(q) ||
          place.category?.toLowerCase().includes(q) ||
          place.city?.toLowerCase().includes(q)
      );
    }

    if (filterCategory !== "all") {
      filtered = filtered.filter((p) => (p.category || "") === filterCategory);
    }

    if (filterStatus !== "all") {
      if (filterStatus === "featured") {
        filtered = filtered.filter((p) => !!p.featured);
      } else if (filterStatus === "has-activities") {
        filtered = filtered.filter((p) => (activitiesByPlace[p._id || p.id] || 0) > 0);
      } else if (filterStatus === "no-activities") {
        filtered = filtered.filter((p) => (activitiesByPlace[p._id || p.id] || 0) === 0);
      }
    }

    filtered.sort((a, b) => {
      switch (sortBy) {
        case "name":
          return (a.name || "").localeCompare(b.name || "");
        case "category":
          return (a.category || "").localeCompare(b.category || "");
        case "city":
          return (a.city || "").localeCompare(b.city || "");
        case "activities": {
          const aCount = activitiesByPlace[a._id || a.id] || 0;
          const bCount = activitiesByPlace[b._id || b.id] || 0;
          return bCount - aCount;
        }
        default:
          return 0;
      }
    });

    return filtered;
  }, [places, activitiesByPlace, searchTerm, filterCategory, filterStatus, sortBy]);

  const getActivityCount = (place) => activitiesByPlace[place._id || place.id] || 0;

  const handleDelete = async (place) => {
    const pid = place._id || place.id;
    const activityCount = getActivityCount(place);
    if (activityCount > 0) {
      return toast.error(`Cannot delete place with ${activityCount} associated activities`);
    }

    if (!window.confirm(`Delete "${place.name}"?`)) return;

    try {
      await deletePlace(pid);
      setPlaces((prev) => prev.filter((p) => (p._id || p.id) !== pid));
      toast.success("Place deleted");
    } catch (err) {
      console.error("Delete place error:", err);
      toast.error(err?.response?.data?.message || "Failed to delete place");
    }
  };

  const toggleFeatured = async (place) => {
    const pid = place._id || place.id;
    try {
      const next = !place.featured;
      await updatePlace(pid, { featured: next });
      setPlaces((prev) =>
        prev.map((p) => ((p._id || p.id) === pid ? { ...p, featured: next } : p))
      );
      toast.success(next ? "Marked as featured" : "Removed from featured");
    } catch (err) {
      console.error("Toggle featured error:", err);
      toast.error(err?.response?.data?.message || "Failed to update featured");
    }
  };

  const handleRefresh = async () => {
    await loadPlaces();
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
        <div className="flex items-center gap-3">
          <Button
            onClick={handleRefresh}
            variant="outline"
            disabled={loading}
            className="inline-flex items-center gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          <Link to="/admin/places/new">
            <Button className="inline-flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add Place
            </Button>
          </Link>
        </div>
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
                {categories.map((cat) => (
                  <option key={cat} value={cat} className="capitalize">
                    {cat}
                  </option>
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
              {loading ? "Loading places…" : `Showing ${filteredPlaces.length} of ${places.length} places`}
              {loadingCounts && !loading ? " • counting activities…" : ""}
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === "grid"
                    ? "bg-primary-100 text-primary-600 dark:bg-primary-900/20 dark:text-primary-400"
                    : "text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800"
                }`}
                title="Grid view"
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
                title="Table view"
              >
                <ListIcon className="h-4 w-4" />
              </button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Loading / Error */}
      {error ? (
        <Card>
          <CardContent className="p-8 text-center">
            <div className="text-red-600 mb-4">{error}</div>
            <Button onClick={handleRefresh} className="inline-flex items-center gap-2">
              <RefreshCw className="h-4 w-4" />
              Retry
            </Button>
          </CardContent>
        </Card>
      ) : loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
        </div>
      ) : filteredPlaces.length === 0 ? (
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
          {filteredPlaces.map((place) => {
            const pid = place._id || place.id;
            const firstImage =
              place.images?.[0]?.url || place.images?.[0] || "/placeholder-image.jpg";
            const count = getActivityCount(place);

            return (
              <Card key={pid} className="group hover:shadow-lg transition-shadow">
                <CardContent className="p-0">
                  {/* Image */}
                  <div className="relative h-48 overflow-hidden rounded-t-lg">
                    <img
                      src={firstImage}
                      alt={place.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => (e.currentTarget.src = "/placeholder-image.jpg")}
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
                        {count}
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
                      <span>
                        {place.city}, {place.country}
                      </span>
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
                          to={`/places/${pid}`}
                          className="p-1.5 text-gray-400 hover:text-primary-600 hover:bg-primary-100 dark:hover:bg-primary-900/20 rounded-lg transition-colors"
                          title="View place"
                        >
                          <Eye className="h-4 w-4" />
                        </Link>
                        <Link
                          to={`/admin/places/${pid}/edit`}
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
            );
          })}
        </div>
      ) : (
        /* Table View */
        <Card>
          <CardContent className="p-0 overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th className="text-left p-4 font-medium text-gray-900 dark:text-white">
                    Place
                  </th>
                  <th className="text-left p-4 font-medium text-gray-900 dark:text-white">
                    Category
                  </th>
                  <th className="text-left p-4 font-medium text-gray-900 dark:text-white">
                    Location
                  </th>
                  <th className="text-left p-4 font-medium text-gray-900 dark:text-white">
                    Activities
                  </th>
                  <th className="text-left p-4 font-medium text-gray-900 dark:text-white">
                    Status
                  </th>
                  <th className="text-right p-4 font-medium text-gray-900 dark:text-white">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredPlaces.map((place) => {
                  const pid = place._id || place.id;
                  const firstImage =
                    place.images?.[0]?.url || place.images?.[0] || "/placeholder-image.jpg";
                  const count = getActivityCount(place);

                  return (
                    <tr key={pid} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={firstImage}
                            alt={place.name}
                            className="w-12 h-12 rounded-lg object-cover"
                            onError={(e) => (e.currentTarget.src = "/placeholder-image.jpg")}
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
                          {place.category || '—'}
                        </span>
                      </td>
                      <td className="p-4 text-gray-600 dark:text-gray-400">
                        {place.city}, {place.country}
                      </td>
                      <td className="p-4">
                        <span className="inline-flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
                          <Users className="h-4 w-4" />
                          {count} activities
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
                            to={`/places/${pid}`}
                            className="p-1.5 text-gray-400 hover:text-primary-600 hover:bg-primary-100 dark:hover:bg-primary-900/20 rounded-lg transition-colors"
                            title="View place"
                          >
                            <Eye className="h-4 w-4" />
                          </Link>
                          <Link
                            to={`/admin/places/${pid}/edit`}
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
                  );
                })}
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}
    </DashboardLayout>
  );
}
