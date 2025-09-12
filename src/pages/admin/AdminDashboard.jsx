// import React, { useMemo } from "react";
// import DashboardLayout from "@/components/Layout/DashboardLayout";
// import StatCard from "@/components/Layout/StatCard";
// import { Users, ClipboardList, MapPin, DollarSign, Activity, Link as LinkIcon } from "lucide-react";

// export default function AdminDashboard() {
//   const user = { name: "Admin User", role: "admin", avatar: "/default-avatar.png" };

//   const metrics = useMemo(
//     () => [
//       { icon: Users,         label: "Total Users",       value: "3,284",    trend: { direction: "up", value: "+8.3%" } },
//       { icon: ClipboardList, label: "Active Activities", value: "142",      trend: { direction: "up", value: "+2.1%" }, subtle: true },
//       { icon: MapPin,        label: "Listed Places",     value: "67",       trend: { direction: "down", value: "-0.6%" } },
//       { icon: DollarSign,    label: "Revenue (30d)",     value: "$120,540", trend: { direction: "up", value: "+4.7%" } },
//     ],
//     []
//   );

//   return (
//     <DashboardLayout role="admin" title="Admin Home" user={user}>
//       <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
//         {metrics.map((m, i) => <StatCard key={i} {...m} />)}
//       </div>

//       <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
//         <section className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm ring-1 ring-gray-200/70 dark:ring-gray-800/70 p-5">
//           <h2 className="text-base font-semibold text-gray-900 dark:text-white mb-4 inline-flex items-center gap-2">
//             <Activity className="h-5 w-5" /> System Health
//           </h2>
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//             <Stat label="API Uptime" value="99.97%" />
//             <Stat label="Error Rate (24h)" value="0.12%" />
//             <Stat label="Queue Latency" value="181ms" />
//           </div>
//         </section>

//         <section className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm ring-1 ring-gray-200/70 dark:ring-gray-800/70 p-5">
//           <h2 className="text-base font-semibold text-gray-900 dark:text-white mb-4 inline-flex items-center gap-2">
//             <LinkIcon className="h-5 w-5" /> Quick Admin Links
//           </h2>
//           <div className="grid sm:grid-cols-2 gap-3">
//             {[
//               { label: "Manage Activities", to: "/dashboard/admin/activities" },
//               { label: "Add Activity",      to: "/dashboard/admin/activities/new" },
//               { label: "Manage Places",     to: "/dashboard/admin/places" },
//               { label: "Add Place",         to: "/dashboard/admin/places/new" },
//             ].map((l) => (
//               <a
//                 key={l.label}
//                 href={l.to}
//                 className="rounded-lg border border-gray-200 dark:border-gray-700 px-4 py-3 text-sm hover:bg-gray-50 dark:hover:bg-gray-700/40"
//               >
//                 {l.label}
//               </a>
//             ))}
//           </div>
//         </section>
//       </div>
//     </DashboardLayout>
//   );
// }

// function Stat({ label, value }) {
//   return (
//     <div className="p-4 rounded-lg border border-gray-200 dark:border-gray-700">
//       <div className="text-sm text-gray-500">{label}</div>
//       <div className="text-2xl font-bold text-gray-900 dark:text-white">{value}</div>
//     </div>
//   );
// }




import React, { useMemo } from "react";
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
  Eye,
  Plus
} from "lucide-react";
import { useSampleDataStore } from "@/store/sampleData";
import { useAuthStore } from "@/store/auth";

export default function AdminDashboard() {
  const { user } = useAuthStore();
  const { getStats, activities, places, users, bookings } = useSampleDataStore();
  
  const stats = useMemo(() => getStats(), [getStats]);

  // Calculate trends (mock data for demonstration)
  const metrics = useMemo(
    () => [
      { 
        icon: Users, 
        label: "Total Users", 
        value: stats.totalUsers.toString(),
        trend: { direction: "up", value: "+12.5%", period: "vs last month" },
        color: "primary",
        to: "/admin/users"
      },
      { 
        icon: ClipboardList, 
        label: "Active Activities", 
        value: stats.publishedActivities.toString(),
        trend: { direction: "up", value: "+3.2%", period: "vs last month" },
        color: "success",
        to: "/admin/activities"
      },
      { 
        icon: MapPin, 
        label: "Featured Places", 
        value: stats.featuredPlaces.toString(),
        trend: { direction: "down", value: "-1.2%", period: "vs last month" },
        color: "warning",
        to: "/admin/places"
      },
      { 
        icon: DollarSign, 
        label: "Total Revenue", 
        value: `₹${stats.totalRevenue.toLocaleString()}`,
        trend: { direction: "up", value: "+18.7%", period: "vs last month" },
        color: "success"
      },
    ],
    [stats]
  );

  // Recent activities
  const recentActivities = useMemo(() => {
    return activities.slice(0, 5).map(activity => {
      const place = places.find(p => p.id === activity.placeId);
      return {
        ...activity,
        placeName: place?.name || 'Unknown Place'
      };
    });
  }, [activities, places]);

  // Top places by activity count
  const topPlaces = useMemo(() => {
    const placeCounts = places.map(place => {
      const activityCount = activities.filter(a => a.placeId === place.id).length;
      return { ...place, activityCount };
    }).sort((a, b) => b.activityCount - a.activityCount).slice(0, 5);
    
    return placeCounts;
  }, [places, activities]);

  return (
    <DashboardLayout role="admin" title="Admin Dashboard" user={user}>
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
          
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                  <img 
                    src={activity.images[0]} 
                    alt={activity.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-gray-900 dark:text-white truncate">
                    {activity.title}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {activity.placeName} • ₹{activity.price}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {activity.featured && (
                    <Star className="h-4 w-4 text-yellow-500" />
                  )}
                  {activity.isPublished ? (
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  ) : (
                    <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                  )}
                </div>
              </div>
            ))}
          </div>

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
          
          <div className="space-y-4">
            {topPlaces.map((place, index) => (
              <div key={place.id} className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                <div className="w-8 h-8 bg-primary-100 dark:bg-primary-900/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-semibold text-primary-600 dark:text-primary-400">
                    {index + 1}
                  </span>
                </div>
                <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0">
                  <img 
                    src={place.images[0]} 
                    alt={place.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-gray-900 dark:text-white truncate">
                    {place.name}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {place.activityCount} activities • {place.category}
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
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">Confirmed Bookings</span>
              <span className="font-semibold text-gray-900 dark:text-white">
                {stats.confirmedBookings}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">Avg Booking Value</span>
              <span className="font-semibold text-gray-900 dark:text-white">
                ₹{Math.round(stats.avgBookingValue)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">Featured Places</span>
              <span className="font-semibold text-gray-900 dark:text-white">
                {stats.featuredPlaces}/{stats.totalPlaces}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">Published Activities</span>
              <span className="font-semibold text-gray-900 dark:text-white">
                {stats.publishedActivities}/{stats.totalActivities}
              </span>
            </div>
          </div>
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
          <div className="space-y-3">
            {users.slice(0, 4).map((user) => (
              <div key={user.id} className="flex items-center gap-3">
                <img 
                  src={user.avatar} 
                  alt={user.name}
                  className="w-8 h-8 rounded-full object-cover"
                />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 dark:text-white text-sm truncate">
                    {user.name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                    {user.role}
                  </p>
                </div>
                <span className="text-xs text-gray-400">
                  {new Date(user.createdAt).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
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