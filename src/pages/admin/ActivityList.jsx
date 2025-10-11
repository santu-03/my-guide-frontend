import { useEffect, useMemo, useState } from "react";
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
  DollarSign,
  Loader2,
  RefreshCw,
} from "lucide-react";
import toast from "react-hot-toast";
import { api, useAuthStore } from '@/store/auth'; // ✅ Centralized import

/* =============== API helpers =============== */
async function getActivities(params = {}) {
  const { data } = await api.get("/activities", { params });
  return (
    data?.activities ||
    data?.data?.activities ||
    data?.docs ||
    data?.results ||
    data ||
    []
  );
}

async function deleteActivity(id) {
  return api.delete(`/activities/${id}`);
}

async function updateActivity(id, patch) {
  return api.patch(`/activities/${id}`, patch);
}

async function getPlaces({ limit = 200 } = {}) {
  const { data } = await api.get("/places", { params: { limit } });
  return data?.places || data?.data?.places || data?.docs || data || [];
}

/* -------------------------------------------------------------------------------- */

export default function ActivityList() {
  const { user } = useAuthStore();

  // data
  const [activities, setActivities] = useState([]);
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [placesLoading, setPlacesLoading] = useState(true);
  const [error, setError] = useState(null);

  // filters
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [sortBy, setSortBy] = useState("createdAt"); // createdAt | title | price | category

  // fetch places once
  useEffect(() => {
    (async () => {
      try {
        setPlacesLoading(true);
        const list = await getPlaces({ limit: 200 });
        setPlaces(Array.isArray(list) ? list : []);
      } catch (e) {
        console.error("Places error:", e);
        setPlaces([]);
      } finally {
        setPlacesLoading(false);
      }
    })();
  }, []);

  // fetch activities on filters change
  const fetchActivities = async () => {
    try {
      setLoading(true);
      setError(null);

      // Map UI filters to backend-friendly params (send both common names where unsure)
      const params = {
        limit: 60,
        page: 1,
        // search
        search: searchTerm || undefined,
        q: searchTerm || undefined,
        // category
        category: filterCategory !== "all" ? filterCategory : undefined,
        // status
        published:
          filterStatus === "published"
            ? true
            : filterStatus === "draft"
            ? false
            : undefined,
        isPublished:
          filterStatus === "published"
            ? true
            : filterStatus === "draft"
            ? false
            : undefined,
        featured: filterStatus === "featured" ? true : undefined,
        // sort
        sortBy,
        sort: sortBy,
      };

      const rows = await getActivities(params);
      setActivities(Array.isArray(rows) ? rows : []);
    } catch (e) {
      console.error("Activities error:", e);
      setActivities([]);
      setError(e?.response?.data?.message || e?.message || "Failed to load activities");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm, filterCategory, filterStatus, sortBy]);

  // derived
  const categories = useMemo(
    () => [...new Set(activities.map((a) => a.category))].filter(Boolean),
    [activities]
  );

  // place label: supports activity.place (id or populated) or activity.placeId
  const placeNameOf = (activity) => {
    if (placesLoading) return "Loading…";
    const placeIdOrObj = activity.place ?? activity.placeId;
    const id =
      typeof placeIdOrObj === "object"
        ? placeIdOrObj?._id || placeIdOrObj?.id
        : placeIdOrObj;
    const p = places.find((x) => (x._id || x.id) === id);
    return p?.name || "Unknown Place";
  };

  const getId = (row) => row._id || row.id;

  // actions
  const handleDelete = async (row) => {
    if (!confirm(`Delete "${row.title}"?`)) return;
    try {
      await deleteActivity(getId(row));
      setActivities((prev) => prev.filter((r) => getId(r) !== getId(row)));
      toast.success("Activity deleted");
    } catch (e) {
      console.error("Delete error:", e);
      toast.error(e?.response?.data?.message || "Failed to delete activity");
    }
  };

  const handleToggleFeatured = async (row) => {
    const id = getId(row);
    const next = !row.featured;
    try {
      await updateActivity(id, { featured: next });
      setActivities((prev) =>
        prev.map((r) => (getId(r) === id ? { ...r, featured: next } : r))
      );
      toast.success(next ? "Marked as featured" : "Removed from featured");
    } catch (e) {
      console.error("Featured error:", e);
      toast.error("Failed to update featured");
    }
  };

  const handleTogglePublished = async (row) => {
    const id = getId(row);
    const next = !row.isPublished;
    try {
      await updateActivity(id, { isPublished: next });
      setActivities((prev) =>
        prev.map((r) => (getId(r) === id ? { ...r, isPublished: next } : r))
      );
      toast.success(next ? "Published" : "Unpublished");
    } catch (e) {
      console.error("Publish error:", e);
      toast.error("Failed to update publish status");
    }
  };

  const handleRefresh = () => {
    fetchActivities();
  };

  return (
    <DashboardLayout role="admin" title="Activities Management" user={user}>
      {/* Header */}
      <div className="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Activities</h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Manage and organize your tour activities
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
          <Link to="/admin/activities/new">
            <Button className="inline-flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add Activity
            </Button>
          </Link>
        </div>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
            {/* Search */}
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search activities..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-lg border bg-white px-10 py-2 focus:border-transparent focus:ring-2 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-800"
              />
            </div>

            {/* Category */}
            <div className="relative">
              <Filter className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="w-full appearance-none rounded-lg border bg-white px-10 py-2 focus:border-transparent focus:ring-2 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-800"
              >
                <option value="all">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat} className="capitalize">
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Status */}
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="rounded-lg border bg-white px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-800"
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
              className="rounded-lg border bg-white px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-800"
            >
              <option value="createdAt">Sort by Date</option>
              <option value="title">Sort by Title</option>
              <option value="price">Sort by Price</option>
              <option value="category">Sort by Category</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Summary */}
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {loading ? (
            <span className="inline-flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              Loading activities…
            </span>
          ) : (
            `Showing ${activities.length} activities`
          )}
        </p>
      </div>

      {/* Error */}
      {error && (
        <Card className="mb-6">
          <CardContent className="p-6 text-center text-red-600">{error}</CardContent>
        </Card>
      )}

      {/* Loading / Empty / Grid */}
      {loading ? (
        <Card>
          <CardContent className="p-8 text-center">
            <Loader2 className="mx-auto mb-4 h-8 w-8 animate-spin text-primary-600" />
            <p className="text-gray-600 dark:text-gray-400">Loading activities…</p>
          </CardContent>
        </Card>
      ) : activities.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <div className="mb-4 text-gray-400">
              <Search className="mx-auto h-12 w-12" />
            </div>
            <h3 className="mb-2 text-lg font-medium text-gray-900 dark:text-white">
              No activities found
            </h3>
            <p className="mb-4 text-gray-600 dark:text-gray-400">
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
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {activities.map((a) => {
            const id = a._id || a.id;
            const img =
              typeof a.images?.[0] === "string"
                ? a.images[0]
                : a.images?.[0]?.url || "/assets/images/placeholder-image.jpg";

            return (
              <Card key={id} className="group transition-shadow hover:shadow-lg">
                <CardContent className="p-0">
                  {/* Image */}
                  <div className="relative h-48 overflow-hidden rounded-t-lg">
                    <img
                      src={img}
                      alt={a.title}
                      className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                      onError={(e) => {
                        e.currentTarget.src = "/assets/images/placeholder-image.jpg";
                      }}
                    />
                    <div className="absolute left-3 top-3 flex gap-2">
                      {a.featured && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-yellow-100 px-2 py-1 text-xs font-medium text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-200">
                          <Star className="h-3 w-3" />
                          Featured
                        </span>
                      )}
                      <span
                        className={`rounded-full px-2 py-1 text-xs font-medium ${
                          a.isPublished
                            ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-200"
                            : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"
                        }`}
                      >
                        {a.isPublished ? "Published" : "Draft"}
                      </span>
                    </div>
                    <div className="absolute right-3 top-3">
                      <span className="inline-flex items-center gap-1 rounded-full bg-black/60 px-2 py-1 text-xs font-medium capitalize text-white">
                        {a.category}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <h3 className="mb-2 line-clamp-2 font-semibold text-gray-900 dark:text-white">
                      {a.title}
                    </h3>

                    <div className="mb-4 space-y-2 text-sm text-gray-600 dark:text-gray-400">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        <span>{placeNameOf(a)}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          <span>{a.durationMinutes}min</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <DollarSign className="h-4 w-4" />
                          <span>₹{a.price}</span>
                        </div>
                      </div>
                    </div>

                    {a.description && (
                      <p className="mb-4 line-clamp-2 text-sm text-gray-600 dark:text-gray-400">
                        {a.description}
                      </p>
                    )}

                    {/* Actions */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleToggleFeatured(a)}
                          className={`rounded-lg p-1.5 transition-colors ${
                            a.featured
                              ? "bg-yellow-100 text-yellow-600 dark:bg-yellow-900/20"
                              : "text-gray-400 hover:bg-yellow-100 hover:text-yellow-600 dark:hover:bg-yellow-900/20"
                          }`}
                          title="Toggle featured"
                        >
                          <Star className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleTogglePublished(a)}
                          className={`rounded-lg p-1.5 transition-colors ${
                            a.isPublished
                              ? "bg-green-100 text-green-600 dark:bg-green-900/20"
                              : "text-gray-400 hover:bg-green-100 hover:text-green-600 dark:hover:bg-green-900/20"
                          }`}
                          title="Toggle published"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                      </div>

                      <div className="flex items-center gap-1">
                        <Link
                          to={`/activities/${id}`}
                          className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-primary-100 hover:text-primary-600 dark:hover:bg-primary-900/20"
                          title="View activity"
                        >
                          <Eye className="h-4 w-4" />
                        </Link>
                        <Link
                          to={`/admin/activities/${id}/edit`}
                          className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-blue-100 hover:text-blue-600 dark:hover:bg-blue-900/20"
                          title="Edit activity"
                        >
                          <Edit className="h-4 w-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(a)}
                          className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900/20"
                          title="Delete activity"
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
      )}
    </DashboardLayout>
  );
}
