
// import React, { useState, useEffect, useMemo } from "react";
// import { Link } from "react-router-dom";
// import DashboardLayout from "@/components/Layout/DashboardLayout";
// import StatCard from "@/components/Layout/StatCard";
// import { 
//   Users, 
//   ClipboardList, 
//   MapPin, 
//   DollarSign, 
//   Activity, 
//   Calendar,
//   TrendingUp,
//   Star,
//   Plus,
//   RefreshCw,
//   Loader2
// } from "lucide-react";
// import toast from "react-hot-toast";
// import Button from "../../components/ui/Button";
// import { api, useAuthStore } from "@/store/auth"; // ✅ Centralized import

// /* =============== API helpers =============== */
// async function getDashboardStats() {
//   const { data } = await api.get('/dashboard/stats');
//   return data;
// }

// async function getActivities(params = {}) {
//   const { data } = await api.get('/activities', { params });
//   return data?.activities || data?.data?.activities || data || [];
// }

// async function getPlaces(params = {}) {
//   const { data } = await api.get('/places', { params });
//   return data?.places || data?.data?.places || data || [];
// }

// async function getUsers(params = {}) {
//   const { data } = await api.get('/users', { params });
//   return data?.users || data?.data?.users || data || [];
// }

// export default function AdminDashboard() {
//   const { user } = useAuthStore();
  
//   // State for dashboard data
//   const [stats, setStats] = useState({
//     totalUsers: 0,
//     totalPlaces: 0,
//     totalActivities: 0,
//     publishedActivities: 0,
//     featuredPlaces: 0,
//     confirmedBookings: 0,
//     totalRevenue: 0,
//     avgBookingValue: 0
//   });
//   const [recentActivities, setRecentActivities] = useState([]);
//   const [topPlaces, setTopPlaces] = useState([]);
//   const [recentUsers, setRecentUsers] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   // Fetch dashboard statistics
//   const fetchStats = async () => {
//     try {
//       const response = await getDashboardStats();
//       const statsData = response.data || response;
//       setStats(statsData);
//     } catch (err) {
//       console.error('Error fetching stats:', err);
//       // Use fallback stats if API fails
//     }
//   };

//   // Fetch recent activities
//   const fetchRecentActivities = async () => {
//     try {
//       const response = await getActivities({ limit: 5, sortBy: 'createdAt' });
//       const activitiesData = response.data || response.activities || response;
//       if (Array.isArray(activitiesData)) {
//         setRecentActivities(activitiesData.slice(0, 5));
//       }
//     } catch (err) {
//       console.error('Error fetching recent activities:', err);
//     }
//   };

//   // Fetch top places (with activity counts)
//   const fetchTopPlaces = async () => {
//     try {
//       const [placesResponse, activitiesResponse] = await Promise.all([
//         getPlaces({ limit: 20 }),
//         getActivities({ limit: 100 })
//       ]);

//       const placesData = placesResponse.data || placesResponse.places || placesResponse;
//       const activitiesData = activitiesResponse.data || activitiesResponse.activities || activitiesResponse;

//       if (Array.isArray(placesData) && Array.isArray(activitiesData)) {
//         // Calculate activity count for each place
//         const placesWithCounts = placesData.map(place => {
//           const placeId = place._id || place.id;
//           const activityCount = activitiesData.filter(activity => activity.placeId === placeId).length;
//           return { ...place, activityCount };
//         });

//         // Sort by activity count and take top 5
//         const sortedPlaces = placesWithCounts
//           .sort((a, b) => b.activityCount - a.activityCount)
//           .slice(0, 5);
        
//         setTopPlaces(sortedPlaces);
//       }
//     } catch (err) {
//       console.error('Error fetching top places:', err);
//     }
//   };

//   // Fetch recent users
//   const fetchRecentUsers = async () => {
//     try {
//       const response = await getUsers({ limit: 4, sortBy: 'createdAt' });
//       const usersData = response.data || response.users || response;
//       if (Array.isArray(usersData)) {
//         setRecentUsers(usersData.slice(0, 4));
//       }
//     } catch (err) {
//       console.error('Error fetching recent users:', err);
//     }
//   };

//   // Load all dashboard data
//   const loadDashboardData = async () => {
//     try {
//       setLoading(true);
//       setError(null);
      
//       await Promise.all([
//         fetchStats(),
//         fetchRecentActivities(),
//         fetchTopPlaces(),
//         fetchRecentUsers()
//       ]);
      
//     } catch (err) {
//       console.error('Dashboard loading error:', err);
//       setError('Failed to load dashboard data');
//       toast.error('Failed to load some dashboard data');
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Load data on mount
//   useEffect(() => {
//     loadDashboardData();
//   }, []);

//   // Calculate metrics with trends (mock trends for now)
//   const metrics = useMemo(() => [
//     { 
//       icon: Users, 
//       label: "Total Users", 
//       value: stats.totalUsers?.toString() || "0",
//       trend: { direction: "up", value: "+12.5%", period: "vs last month" },
//       color: "primary",
//       to: "/admin/users"
//     },
//     { 
//       icon: ClipboardList, 
//       label: "Active Activities", 
//       value: stats.publishedActivities?.toString() || "0",
//       trend: { direction: "up", value: "+3.2%", period: "vs last month" },
//       color: "success",
//       to: "/admin/activities"
//     },
//     { 
//       icon: MapPin, 
//       label: "Featured Places", 
//       value: stats.featuredPlaces?.toString() || "0",
//       trend: { direction: "down", value: "-1.2%", period: "vs last month" },
//       color: "warning",
//       to: "/admin/places"
//     },
//     { 
//       icon: DollarSign, 
//       label: "Total Revenue", 
//       value: `₹${stats.totalRevenue?.toLocaleString() || '0'}`,
//       trend: { direction: "up", value: "+18.7%", period: "vs last month" },
//       color: "success"
//     },
//   ], [stats]);

//   const handleRefresh = () => {
//     loadDashboardData();
//   };

//   if (error && loading) {
//     return (
//       <DashboardLayout role="admin" title="Admin Dashboard" user={user}>
//         <div className="flex flex-col items-center justify-center h-64">
//           <p className="text-red-600 mb-4">Error loading dashboard: {error}</p>
//           <Button onClick={handleRefresh} className="inline-flex items-center gap-2">
//             <RefreshCw className="h-4 w-4" />
//             Retry
//           </Button>
//         </div>
//       </DashboardLayout>
//     );
//   }

//   return (
//     <DashboardLayout role="admin" title="Admin Dashboard" user={user}>
      
//       {/* Header with refresh */}
//       <div className="flex justify-between items-center mb-6">
//         <div>
//           <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
//           <p className="text-gray-600 dark:text-gray-400"> tour management system</p>
//         </div>
//         <Button 
//           onClick={handleRefresh} 
//           variant="outline"
//           disabled={loading}
//           className="inline-flex items-center gap-2"
//         >
//           <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
//           Refresh
//         </Button>
//       </div>

//       {/* Stats Grid */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
//         {metrics.map((metric, i) => (
//           <StatCard key={i} {...metric} />
//         ))}
//       </div>

//       {/* Main Content Grid */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        
//         {/* Recent Activities */}
//         <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm ring-1 ring-gray-200/70 dark:ring-gray-800/70 p-6">
//           <div className="flex items-center justify-between mb-6">
//             <h2 className="text-lg font-semibold text-gray-900 dark:text-white inline-flex items-center gap-2">
//               <Activity className="h-5 w-5" />
//               Recent Activities
//             </h2>
//             <Link 
//               to="/admin/activities" 
//               className="text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 font-medium"
//             >
//               View All
//             </Link>
//           </div>
          
//           {loading ? (
//             <div className="flex items-center justify-center py-8">
//               <Loader2 className="h-6 w-6 animate-spin text-primary-600" />
//             </div>
//           ) : (
//             <div className="space-y-4">
//               {recentActivities.map((activity) => (
//                 <div key={activity._id || activity.id} className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
//                   <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
//                     <img 
//                       src={activity.images?.[0]?.url || '/placeholder-image.jpg'} 
//                       alt={activity.title}
//                       className="w-full h-full object-cover"
//                       onError={(e) => e.target.src = '/placeholder-image.jpg'}
//                     />
//                   </div>
//                   <div className="flex-1 min-w-0">
//                     <h3 className="font-medium text-gray-900 dark:text-white truncate">
//                       {activity.title}
//                     </h3>
//                     <p className="text-sm text-gray-500 dark:text-gray-400">
//                       {activity.category} • ₹{activity.price}
//                     </p>
//                   </div>
//                   <div className="flex items-center gap-2">
//                     {activity.featured && (
//                       <Star className="h-4 w-4 text-yellow-500" />
//                     )}
//                     <div className={`w-2 h-2 rounded-full ${activity.isPublished ? 'bg-green-500' : 'bg-gray-400'}`}></div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}

//           <Link 
//             to="/admin/activities/new" 
//             className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 rounded-lg hover:bg-primary-100 dark:hover:bg-primary-900/30 transition-colors font-medium"
//           >
//             <Plus className="h-4 w-4" />
//             Add New Activity
//           </Link>
//         </div>

//         {/* Top Places */}
//         <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm ring-1 ring-gray-200/70 dark:ring-gray-800/70 p-6">
//           <div className="flex items-center justify-between mb-6">
//             <h2 className="text-lg font-semibold text-gray-900 dark:text-white inline-flex items-center gap-2">
//               <MapPin className="h-5 w-5" />
//               Popular Places
//             </h2>
//             <Link 
//               to="/admin/places" 
//               className="text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 font-medium"
//             >
//               View All
//             </Link>
//           </div>
          
//           {loading ? (
//             <div className="flex items-center justify-center py-8">
//               <Loader2 className="h-6 w-6 animate-spin text-primary-600" />
//             </div>
//           ) : (
//             <div className="space-y-4">
//               {topPlaces.map((place, index) => (
//                 <div key={place._id || place.id} className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
//                   <div className="w-8 h-8 bg-primary-100 dark:bg-primary-900/20 rounded-full flex items-center justify-center flex-shrink-0">
//                     <span className="text-sm font-semibold text-primary-600 dark:text-primary-400">
//                       {index + 1}
//                     </span>
//                   </div>
//                   <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0">
//                     <img 
//                       src={place.images?.[0]?.url || '/placeholder-image.jpg'} 
//                       alt={place.name}
//                       className="w-full h-full object-cover"
//                       onError={(e) => e.target.src = '/placeholder-image.jpg'}
//                     />
//                   </div>
//                   <div className="flex-1 min-w-0">
//                     <h3 className="font-medium text-gray-900 dark:text-white truncate">
//                       {place.name}
//                     </h3>
//                     <p className="text-sm text-gray-500 dark:text-gray-400">
//                       {place.activityCount || 0} activities • {place.category || 'Uncategorized'}
//                     </p>
//                   </div>
//                   <div className="flex items-center gap-2">
//                     {place.featured && (
//                       <Star className="h-4 w-4 text-yellow-500" />
//                     )}
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}

//           <Link 
//             to="/admin/places/new" 
//             className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 rounded-lg hover:bg-emerald-100 dark:hover:bg-emerald-900/30 transition-colors font-medium"
//           >
//             <Plus className="h-4 w-4" />
//             Add New Place
//           </Link>
//         </div>
//       </div>

//       {/* System Overview */}
//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
//         {/* Quick Stats */}
//         <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm ring-1 ring-gray-200/70 dark:ring-gray-800/70 p-6">
//           <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 inline-flex items-center gap-2">
//             <TrendingUp className="h-5 w-5" />
//             Quick Stats
//           </h2>
//           {loading ? (
//             <div className="flex items-center justify-center py-4">
//               <Loader2 className="h-5 w-5 animate-spin text-primary-600" />
//             </div>
//           ) : (
//             <div className="space-y-4">
//               <div className="flex justify-between items-center">
//                 <span className="text-gray-600 dark:text-gray-400">Confirmed Bookings</span>
//                 <span className="font-semibold text-gray-900 dark:text-white">
//                   {stats.confirmedBookings || 0}
//                 </span>
//               </div>
//               <div className="flex justify-between items-center">
//                 <span className="text-gray-600 dark:text-gray-400">Avg Booking Value</span>
//                 <span className="font-semibold text-gray-900 dark:text-white">
//                   ₹{Math.round(stats.avgBookingValue || 0)}
//                 </span>
//               </div>
//               <div className="flex justify-between items-center">
//                 <span className="text-gray-600 dark:text-gray-400">Featured Places</span>
//                 <span className="font-semibold text-gray-900 dark:text-white">
//                   {stats.featuredPlaces || 0}/{stats.totalPlaces || 0}
//                 </span>
//               </div>
//               <div className="flex justify-between items-center">
//                 <span className="text-gray-600 dark:text-gray-400">Published Activities</span>
//                 <span className="font-semibold text-gray-900 dark:text-white">
//                   {stats.publishedActivities || 0}/{stats.totalActivities || 0}
//                 </span>
//               </div>
//             </div>
//           )}
//         </div>

//         {/* Quick Actions */}
//         <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm ring-1 ring-gray-200/70 dark:ring-gray-800/70 p-6">
//           <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 inline-flex items-center gap-2">
//             <Activity className="h-5 w-5" />
//             Quick Actions
//           </h2>
//           <div className="grid grid-cols-2 gap-3">
//             <Link 
//               to="/admin/activities"
//               className="p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/40 transition-colors text-center"
//             >
//               <ClipboardList className="h-5 w-5 mx-auto mb-1 text-gray-600 dark:text-gray-400" />
//               <span className="text-xs text-gray-600 dark:text-gray-400">Activities</span>
//             </Link>
//             <Link 
//               to="/admin/places"
//               className="p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/40 transition-colors text-center"
//             >
//               <MapPin className="h-5 w-5 mx-auto mb-1 text-gray-600 dark:text-gray-400" />
//               <span className="text-xs text-gray-600 dark:text-gray-400">Places</span>
//             </Link>
//             <Link 
//               to="/admin/users"
//               className="p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/40 transition-colors text-center"
//             >
//               <Users className="h-5 w-5 mx-auto mb-1 text-gray-600 dark:text-gray-400" />
//               <span className="text-xs text-gray-600 dark:text-gray-400">Users</span>
//             </Link>
//             <Link 
//               to="/admin/bookings"
//               className="p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/40 transition-colors text-center"
//             >
//               <Calendar className="h-5 w-5 mx-auto mb-1 text-gray-600 dark:text-gray-400" />
//               <span className="text-xs text-gray-600 dark:text-gray-400">Bookings</span>
//             </Link>
//           </div>
//         </div>

//         {/* Recent Users */}
//         <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm ring-1 ring-gray-200/70 dark:ring-gray-800/70 p-6">
//           <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 inline-flex items-center gap-2">
//             <Users className="h-5 w-5" />
//             Recent Users
//           </h2>
//           {loading ? (
//             <div className="flex items-center justify-center py-4">
//               <Loader2 className="h-5 w-5 animate-spin text-primary-600" />
//             </div>
//           ) : (
//             <div className="space-y-3">
//               {recentUsers.map((userItem) => (
//                 <div key={userItem._id || userItem.id} className="flex items-center gap-3">
//                   <img 
//                     src={userItem.avatar || '/default-avatar.png'} 
//                     alt={userItem.name}
//                     className="w-8 h-8 rounded-full object-cover"
//                     onError={(e) => e.target.src = '/default-avatar.png'}
//                   />
//                   <div className="flex-1 min-w-0">
//                     <p className="font-medium text-gray-900 dark:text-white text-sm truncate">
//                       {userItem.name}
//                     </p>
//                     <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">
//                       {userItem.role}
//                     </p>
//                   </div>
//                   <span className="text-xs text-gray-400">
//                     {userItem.createdAt ? new Date(userItem.createdAt).toLocaleDateString() : 'Recent'}
//                   </span>
//                 </div>
//               ))}
//             </div>
//           )}
//           <Link 
//             to="/admin/users" 
//             className="mt-4 block text-center text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 font-medium"
//           >
//             View All Users
//           </Link>
//         </div>
//       </div>
//     </DashboardLayout>
//   );
// }
// src/pages/admin/AdminDashboard.jsx
import React, { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "@/components/Layout/DashboardLayout";
import StatCard from "@/components/Layout/StatCard";
import { Card, CardContent } from "@/components/ui/Card";
import {
  Users,
  MapPin,
  Package,
  Calendar,
  DollarSign,
  TrendingUp,
  Activity,
  AlertCircle,
  CheckCircle,
  Clock,
  BarChart3,
  Shield
} from "lucide-react";
import { useAuthStore } from "@/store/auth";

export default function AdminDashboard() {
  const { user } = useAuthStore();

  const metrics = [
    {
      icon: Users,
      label: "Total Users",
      value: "1,234",
      trend: { direction: "up", value: "+18%", period: "this month" },
      color: "primary",
      variant: "gradient",
    },
    {
      icon: MapPin,
      label: "Active Places",
      value: "45",
      trend: { direction: "up", value: "+5", period: "this week" },
      color: "success",
      variant: "gradient",
    },
    {
      icon: Package,
      label: "Total Activities",
      value: "128",
      trend: { direction: "up", value: "+12", period: "this month" },
      color: "info",
      variant: "gradient",
    },
    {
      icon: DollarSign,
      label: "Revenue",
      value: "₹2.4M",
      trend: { direction: "up", value: "+24%", period: "this quarter" },
      color: "warning",
      variant: "gradient",
    },
  ];

  return (
    <DashboardLayout role="admin" title="Admin Dashboard" user={user}>
      
      {/* Welcome Banner */}
      <div className="mb-8 p-6 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl text-white shadow-xl">
        <div className="flex items-center gap-3 mb-2">
          <Shield className="h-8 w-8" />
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        </div>
        <p className="opacity-90">Monitor and manage your entire platform</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
        {metrics.map((metric, i) => (
          <StatCard key={i} {...metric} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Recent Activity */}
          <Card className="border-0 shadow-md">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Recent Activity
                </h2>
                <Link to="/admin/activity" className="text-sm text-primary-600 hover:text-primary-700 font-medium">
                  View All
                </Link>
              </div>

              <div className="space-y-4">
                {[
                  { type: "user", action: "New user registered", time: "2 min ago", status: "success" },
                  { type: "booking", action: "New booking created", time: "15 min ago", status: "info" },
                  { type: "place", action: "Place updated", time: "1 hour ago", status: "warning" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      item.status === "success" ? "bg-green-100 dark:bg-green-900/20" :
                      item.status === "info" ? "bg-blue-100 dark:bg-blue-900/20" :
                      "bg-amber-100 dark:bg-amber-900/20"
                    }`}>
                      {item.status === "success" ? <CheckCircle className="h-5 w-5 text-green-600" /> :
                       item.status === "info" ? <Calendar className="h-5 w-5 text-blue-600" /> :
                       <AlertCircle className="h-5 w-5 text-amber-600" />}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-gray-900 dark:text-white">{item.action}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">{item.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* System Health */}
          <Card className="border-0 shadow-md">
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                System Health
              </h2>

              <div className="space-y-4">
                {[
                  { label: "API Response Time", value: "145ms", percent: 95, color: "bg-green-500" },
                  { label: "Database Performance", value: "Excellent", percent: 98, color: "bg-blue-500" },
                  { label: "Server Load", value: "42%", percent: 58, color: "bg-amber-500" },
                ].map((metric, i) => (
                  <div key={i}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{metric.label}</span>
                      <span className="text-sm font-semibold text-gray-900 dark:text-white">{metric.value}</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div className={`${metric.color} h-2 rounded-full transition-all duration-500`} style={{ width: `${metric.percent}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          
          {/* Quick Actions */}
          <Card className="border-0 shadow-md">
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h2>
              
              <div className="space-y-3">
                <Link to="/admin/users" className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                  <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                    <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">Manage Users</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">View all users</div>
                  </div>
                </Link>

                <Link to="/admin/places" className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                  <div className="w-10 h-10 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
                    <MapPin className="h-5 w-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">Manage Places</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Add or edit places</div>
                  </div>
                </Link>

                <Link to="/admin/activities" className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                  <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
                    <Package className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">Manage Activities</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Add or edit activities</div>
                  </div>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Pending Tasks */}
          <Card className="border-0 shadow-md border-l-4 border-amber-500">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <Clock className="h-6 w-6 text-amber-600" />
                <h3 className="font-semibold text-gray-900 dark:text-white">Pending Tasks</h3>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between p-2 bg-amber-50 dark:bg-amber-900/10 rounded">
                  <span>Pending Verifications</span>
                  <span className="font-semibold">3</span>
                </div>
                <div className="flex items-center justify-between p-2 bg-amber-50 dark:bg-amber-900/10 rounded">
                  <span>Support Tickets</span>
                  <span className="font-semibold">7</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}