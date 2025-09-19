import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "@/components/Layout/DashboardLayout";
import StatCard from "@/components/Layout/StatCard";
import { 
  Users, 
  ClipboardList, 
  MapPin, 
  DollarSign, 
  Activity, 
  Calendar,
  TrendingUp,
  Star,
  Plus,
  RefreshCw,
  Loader2
} from "lucide-react";
import { useAuthStore } from "@/store/auth";
import toast from "react-hot-toast";
import Button from "../../components/ui/Button";

export default function AdminDashboard() {
  const { user } = useAuthStore();
  
  // State for dashboard data
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalPlaces: 0,
    totalActivities: 0,
    publishedActivities: 0,
    featuredPlaces: 0,
    confirmedBookings: 0,
    totalRevenue: 0,
    avgBookingValue: 0
  });
  const [recentActivities, setRecentActivities] = useState([]);
  const [topPlaces, setTopPlaces] = useState([]);
  const [recentUsers, setRecentUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch dashboard statistics
  const fetchStats = async () => {
    try {
      const response = await getDashboardStats();
      const statsData = response.data || response;
      setStats(statsData);
    } catch (err) {
      console.error('Error fetching stats:', err);
      // Use fallback stats if API fails
    }
  };

  // Fetch recent activities
  const fetchRecentActivities = async () => {
    try {
      const response = await getActivities({ limit: 5, sortBy: 'createdAt' });
      const activitiesData = response.data || response.activities || response;
      if (Array.isArray(activitiesData)) {
        setRecentActivities(activitiesData.slice(0, 5));
      }
    } catch (err) {
      console.error('Error fetching recent activities:', err);
    }
  };

  // Fetch top places (with activity counts)
  const fetchTopPlaces = async () => {
    try {
      const [placesResponse, activitiesResponse] = await Promise.all([
        getPlaces({ limit: 20 }),
        getActivities({ limit: 100 })
      ]);

      const placesData = placesResponse.data || placesResponse.places || placesResponse;
      const activitiesData = activitiesResponse.data || activitiesResponse.activities || activitiesResponse;

      if (Array.isArray(placesData) && Array.isArray(activitiesData)) {
        // Calculate activity count for each place
        const placesWithCounts = placesData.map(place => {
          const placeId = place._id || place.id;
          const activityCount = activitiesData.filter(activity => activity.placeId === placeId).length;
          return { ...place, activityCount };
        });

        // Sort by activity count and take top 5
        const sortedPlaces = placesWithCounts
          .sort((a, b) => b.activityCount - a.activityCount)
          .slice(0, 5);
        
        setTopPlaces(sortedPlaces);
      }
    } catch (err) {
      console.error('Error fetching top places:', err);
    }
  };

  // Fetch recent users
  const fetchRecentUsers = async () => {
    try {
      const response = await getUsers({ limit: 4, sortBy: 'createdAt' });
      const usersData = response.data || response.users || response;
      if (Array.isArray(usersData)) {
        setRecentUsers(usersData.slice(0, 4));
      }
    } catch (err) {
      console.error('Error fetching recent users:', err);
    }
  };

  // Load all dashboard data
  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      await Promise.all([
        fetchStats(),
        fetchRecentActivities(),
        fetchTopPlaces(),
        fetchRecentUsers()
      ]);
      
    } catch (err) {
      console.error('Dashboard loading error:', err);
      setError('Failed to load dashboard data');
      toast.error('Failed to load some dashboard data');
    } finally {
      setLoading(false);
    }
  };

  // Load data on mount
  useEffect(() => {
    loadDashboardData();
  }, []);

  // Calculate metrics with trends (mock trends for now)
  const metrics = useMemo(() => [
    { 
      icon: Users, 
      label: "Total Users", 
      value: stats.totalUsers?.toString() || "0",
      trend: { direction: "up", value: "+12.5%", period: "vs last month" },
      color: "primary",
      to: "/admin/users"
    },
    { 
      icon: ClipboardList, 
      label: "Active Activities", 
      value: stats.publishedActivities?.toString() || "0",
      trend: { direction: "up", value: "+3.2%", period: "vs last month" },
      color: "success",
      to: "/admin/activities"
    },
    { 
      icon: MapPin, 
      label: "Featured Places", 
      value: stats.featuredPlaces?.toString() || "0",
      trend: { direction: "down", value: "-1.2%", period: "vs last month" },
      color: "warning",
      to: "/admin/places"
    },
    { 
      icon: DollarSign, 
      label: "Total Revenue", 
      value: `₹${stats.totalRevenue?.toLocaleString() || '0'}`,
      trend: { direction: "up", value: "+18.7%", period: "vs last month" },
      color: "success"
    },
  ], [stats]);

  const handleRefresh = () => {
    loadDashboardData();
  };

  if (error && loading) {
    return (
      <DashboardLayout role="admin" title="Admin Dashboard" user={user}>
        <div className="flex flex-col items-center justify-center h-64">
          <p className="text-red-600 mb-4">Error loading dashboard: {error}</p>
          <Button onClick={handleRefresh} className="inline-flex items-center gap-2">
            <RefreshCw className="h-4 w-4" />
            Retry
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="admin" title="Admin Dashboard" user={user}>
      
      {/* Header with refresh */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400"> tour management system</p>
        </div>
        <Button 
          onClick={handleRefresh} 
          variant="outline"
          disabled={loading}
          className="inline-flex items-center gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
        {metrics.map((metric, i) => (
          <StatCard key={i} {...metric} />
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        
        {/* Recent Activities */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm ring-1 ring-gray-200/70 dark:ring-gray-800/70 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white inline-flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Recent Activities
            </h2>
            <Link 
              to="/admin/activities" 
              className="text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 font-medium"
            >
              View All
            </Link>
          </div>
          
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-primary-600" />
            </div>
          ) : (
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity._id || activity.id} className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                  <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                    <img 
                      src={activity.images?.[0]?.url || '/placeholder-image.jpg'} 
                      alt={activity.title}
                      className="w-full h-full object-cover"
                      onError={(e) => e.target.src = '/placeholder-image.jpg'}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-900 dark:text-white truncate">
                      {activity.title}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {activity.category} • ₹{activity.price}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {activity.featured && (
                      <Star className="h-4 w-4 text-yellow-500" />
                    )}
                    <div className={`w-2 h-2 rounded-full ${activity.isPublished ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <Link 
            to="/admin/activities/new" 
            className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 rounded-lg hover:bg-primary-100 dark:hover:bg-primary-900/30 transition-colors font-medium"
          >
            <Plus className="h-4 w-4" />
            Add New Activity
          </Link>
        </div>

        {/* Top Places */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm ring-1 ring-gray-200/70 dark:ring-gray-800/70 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white inline-flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Popular Places
            </h2>
            <Link 
              to="/admin/places" 
              className="text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 font-medium"
            >
              View All
            </Link>
          </div>
          
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-primary-600" />
            </div>
          ) : (
            <div className="space-y-4">
              {topPlaces.map((place, index) => (
                <div key={place._id || place.id} className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                  <div className="w-8 h-8 bg-primary-100 dark:bg-primary-900/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-semibold text-primary-600 dark:text-primary-400">
                      {index + 1}
                    </span>
                  </div>
                  <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0">
                    <img 
                      src={place.images?.[0]?.url || '/placeholder-image.jpg'} 
                      alt={place.name}
                      className="w-full h-full object-cover"
                      onError={(e) => e.target.src = '/placeholder-image.jpg'}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-900 dark:text-white truncate">
                      {place.name}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {place.activityCount || 0} activities • {place.category || 'Uncategorized'}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {place.featured && (
                      <Star className="h-4 w-4 text-yellow-500" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          <Link 
            to="/admin/places/new" 
            className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 rounded-lg hover:bg-emerald-100 dark:hover:bg-emerald-900/30 transition-colors font-medium"
          >
            <Plus className="h-4 w-4" />
            Add New Place
          </Link>
        </div>
      </div>

      {/* System Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Quick Stats */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm ring-1 ring-gray-200/70 dark:ring-gray-800/70 p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 inline-flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Quick Stats
          </h2>
          {loading ? (
            <div className="flex items-center justify-center py-4">
              <Loader2 className="h-5 w-5 animate-spin text-primary-600" />
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400">Confirmed Bookings</span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {stats.confirmedBookings || 0}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400">Avg Booking Value</span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  ₹{Math.round(stats.avgBookingValue || 0)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400">Featured Places</span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {stats.featuredPlaces || 0}/{stats.totalPlaces || 0}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400">Published Activities</span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {stats.publishedActivities || 0}/{stats.totalActivities || 0}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm ring-1 ring-gray-200/70 dark:ring-gray-800/70 p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 inline-flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Quick Actions
          </h2>
          <div className="grid grid-cols-2 gap-3">
            <Link 
              to="/admin/activities"
              className="p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/40 transition-colors text-center"
            >
              <ClipboardList className="h-5 w-5 mx-auto mb-1 text-gray-600 dark:text-gray-400" />
              <span className="text-xs text-gray-600 dark:text-gray-400">Activities</span>
            </Link>
            <Link 
              to="/admin/places"
              className="p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/40 transition-colors text-center"
            >
              <MapPin className="h-5 w-5 mx-auto mb-1 text-gray-600 dark:text-gray-400" />
              <span className="text-xs text-gray-600 dark:text-gray-400">Places</span>
            </Link>
            <Link 
              to="/admin/users"
              className="p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/40 transition-colors text-center"
            >
              <Users className="h-5 w-5 mx-auto mb-1 text-gray-600 dark:text-gray-400" />
              <span className="text-xs text-gray-600 dark:text-gray-400">Users</span>
            </Link>
            <Link 
              to="/admin/bookings"
              className="p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/40 transition-colors text-center"
            >
              <Calendar className="h-5 w-5 mx-auto mb-1 text-gray-600 dark:text-gray-400" />
              <span className="text-xs text-gray-600 dark:text-gray-400">Bookings</span>
            </Link>
          </div>
        </div>

        {/* Recent Users */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm ring-1 ring-gray-200/70 dark:ring-gray-800/70 p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 inline-flex items-center gap-2">
            <Users className="h-5 w-5" />
            Recent Users
          </h2>
          {loading ? (
            <div className="flex items-center justify-center py-4">
              <Loader2 className="h-5 w-5 animate-spin text-primary-600" />
            </div>
          ) : (
            <div className="space-y-3">
              {recentUsers.map((userItem) => (
                <div key={userItem._id || userItem.id} className="flex items-center gap-3">
                  <img 
                    src={userItem.avatar || '/default-avatar.png'} 
                    alt={userItem.name}
                    className="w-8 h-8 rounded-full object-cover"
                    onError={(e) => e.target.src = '/default-avatar.png'}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 dark:text-white text-sm truncate">
                      {userItem.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                      {userItem.role}
                    </p>
                  </div>
                  <span className="text-xs text-gray-400">
                    {userItem.createdAt ? new Date(userItem.createdAt).toLocaleDateString() : 'Recent'}
                  </span>
                </div>
              ))}
            </div>
          )}
          <Link 
            to="/admin/users" 
            className="mt-4 block text-center text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 font-medium"
          >
            View All Users
          </Link>
        </div>
      </div>
    </DashboardLayout>
  );
}