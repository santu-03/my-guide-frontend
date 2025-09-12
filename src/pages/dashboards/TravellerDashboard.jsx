// import React, { useMemo, useState } from "react";
// import DashboardLayout from "@/components/Layout/DashboardLayout";
// import StatCard from "@/components/Layout/StatCard";
// import { Wallet, Users, Plane, Package, CheckCircle2, XCircle, EllipsisVertical } from "lucide-react";

// const initialTasks = [
//   { id: "t1", type: "Pending Approval", amount: 1200, from: "Emiliaia Tavares", to: "George Tavares", status: "pending" },
//   { id: "t2", type: "Unreported Advances", amount: 2132, from: "Sophie M.", to: "Playstation Corp.", status: "pending" },
// ];

// const initialBookings = [
//   { id: "b1", pkg: "New Delhi → Dhaka", type: "Oneway", price: 50, status: "Pending", user: "Cathy" },
//   { id: "b2", pkg: "New Delhi → Dhaka", type: "Oneway", price: 50, status: "Pending", user: "Mark" },
//   { id: "b3", pkg: "New Delhi → Dhaka", type: "Oneway", price: 50, status: "Pending", user: "Amit" },
//   { id: "b4", pkg: "New Delhi → Dhaka", type: "Oneway", price: 50, status: "Pending", user: "Sara" },
//   { id: "b5", pkg: "New Delhi → Dhaka", type: "Oneway", price: 50, status: "Pending", user: "Lina" },
// ];

// export default function TravellerDashboard() {
//   const user = { name: "Jayson", role: "traveller", avatar: "/default-avatar.png" };
//   const [tasks, setTasks] = useState(initialTasks);
//   const [bookings] = useState(initialBookings);

//   const metrics = useMemo(
//     () => [
//       { icon: Wallet,  label: "Total Booked",    value: "$24,590", trend: { direction: "up",   value: "+12.08%" } },
//       { icon: Package, label: "30 Days Revenue", value: "$18,680", trend: { direction: "down", value: "-12.08%" }, subtle: true },
//       { icon: Users,   label: "Total Customers", value: "$50,680", trend: { direction: "up",   value: "+12.08%" } },
//       { icon: Plane,   label: "Tour Packages",   value: "$16,590", trend: { direction: "up",   value: "+12.08%" } },
//     ],
//     []
//   );

//   const approveTask = (id) => setTasks((t) => t.map((x) => (x.id === id ? { ...x, status: "approved" } : x)));
//   const rejectTask  = (id) => setTasks((t) => t.map((x) => (x.id === id ? { ...x, status: "rejected" } : x)));

//   return (
//     <DashboardLayout role="traveller" title="Home" user={user}>
//       <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
//         {metrics.map((m, i) => (
//           <StatCard key={i} icon={m.icon} label={m.label} value={m.value} trend={m.trend} subtle={m.subtle} />
//         ))}
//       </div>

//       <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
//         <section className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm ring-1 ring-gray-200/70 dark:ring-gray-800/70">
//           <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
//             <h2 className="text-base font-semibold text-gray-900 dark:text-white">Pending Task</h2>
//             <button className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700"><EllipsisVertical className="h-5 w-5 text-gray-400" /></button>
//           </div>
//           <div className="p-5 space-y-4">
//             {tasks.map((t) => (
//               <div key={t.id} className="rounded-xl border border-gray-200 dark:border-gray-700 p-4">
//                 <div className="text-sm text-gray-600 dark:text-gray-300">{t.type}</div>
//                 <div className="mt-1 text-2xl font-bold text-primary-600">${t.amount.toLocaleString()}</div>
//                 <div className="mt-2 text-xs text-gray-500">
//                   From <span className="font-medium text-gray-700 dark:text-gray-200">{t.from}</span> to{" "}
//                   <span className="font-medium text-gray-700 dark:text-gray-200">{t.to}</span>
//                 </div>
//                 <div className="mt-4 flex items-center gap-2">
//                   <button onClick={() => rejectTask(t.id)} className="px-3 py-2 rounded-lg text-sm border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700" disabled={t.status !== "pending"}>
//                     Reject
//                   </button>
//                   <button onClick={() => approveTask(t.id)} className="px-3 py-2 rounded-lg text-sm text-white bg-primary-600 hover:bg-primary-700" disabled={t.status !== "pending"}>
//                     Approve
//                   </button>
//                   {t.status !== "pending" && (
//                     <span className={`inline-flex items-center gap-1 text-xs ml-2 ${t.status === "approved" ? "text-emerald-600" : "text-rose-600"}`}>
//                       {t.status === "approved" ? <CheckCircle2 className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
//                       {t.status[0].toUpperCase() + t.status.slice(1)}
//                     </span>
//                   )}
//                 </div>
//               </div>
//             ))}
//           </div>
//         </section>

//         <section className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm ring-1 ring-gray-200/70 dark:ring-gray-800/70">
//           <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
//             <h2 className="text-base font-semibold text-gray-900 dark:text-white">Recent Booking</h2>
//             <button className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700"><EllipsisVertical className="h-5 w-5 text-gray-400" /></button>
//           </div>
//           <div className="overflow-x-auto">
//             <table className="min-w-full text-sm">
//               <thead className="text-left text-gray-500">
//                 <tr className="border-b border-gray-100 dark:border-gray-700">
//                   <th className="px-5 py-3 font-medium">Package Name</th>
//                   <th className="px-5 py-3 font-medium">Type</th>
//                   <th className="px-5 py-3 font-medium">Price</th>
//                   <th className="px-5 py-3 font-medium">Status</th>
//                   <th className="px-5 py-3 font-medium text-right">Actions</th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
//                 {initialBookings.map((b) => (
//                   <tr key={b.id} className="hover:bg-gray-50/60 dark:hover:bg-gray-700/30">
//                     <td className="px-5 py-3">
//                       <div className="flex items-center gap-3">
//                         <img src={`https://i.pravatar.cc/32?u=${b.user}`} alt={b.user} className="h-8 w-8 rounded-full" />
//                         <div className="text-gray-900 dark:text-gray-100">{b.pkg}</div>
//                       </div>
//                     </td>
//                     <td className="px-5 py-3"><span className="text-emerald-600">{b.type}</span></td>
//                     <td className="px-5 py-3">$ {b.price}</td>
//                     <td className="px-5 py-3">
//                       <span className="inline-flex px-2 py-1 rounded-full text-xs bg-amber-50 text-amber-700 ring-1 ring-amber-200">{b.status}</span>
//                     </td>
//                     <td className="px-5 py-3 text-right">
//                       <button className="px-2 py-1 text-xs rounded border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700">View</button>
//                     </td>
//                   </tr>
//                 ))}
//                 {!initialBookings.length && (
//                   <tr><td colSpan={5} className="px-5 py-6 text-center text-gray-500">No bookings to show</td></tr>
//                 )}
//               </tbody>
//             </table>
//           </div>
//         </section>
//       </div>
//     </DashboardLayout>
//   );
// }

import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "@/components/Layout/DashboardLayout";
import StatCard from "@/components/Layout/StatCard";
import { Card, CardContent } from "@/components/ui/Card";
import { 
  MapPin, 
  Calendar, 
  Heart,
  Star,
  Clock,
  DollarSign,
  Camera,
  Compass,
  TrendingUp,
  BookOpen
} from "lucide-react";
import { useSampleDataStore } from "@/store/sampleData";
import { useAuthStore } from "@/store/auth";

export default function TravellerDashboard() {
  const { user } = useAuthStore();
  const { activities, places, bookings } = useSampleDataStore();
  
  // Get user's bookings (mock - filter by current user)
  const userBookings = useMemo(() => {
    return bookings.filter(booking => booking.userId === user?.id);
  }, [bookings, user?.id]);

  // Calculate stats
  const stats = useMemo(() => {
    const confirmedBookings = userBookings.filter(b => b.status === 'confirmed');
    const totalSpent = confirmedBookings.reduce((sum, b) => sum + b.totalAmount, 0);
    const upcomingBookings = confirmedBookings.filter(b => new Date(b.bookingDate) > new Date());
    
    return {
      totalBookings: userBookings.length,
      upcomingTrips: upcomingBookings.length,
      totalSpent,
      placesVisited: new Set(confirmedBookings.map(b => {
        const activity = activities.find(a => a.id === b.activityId);
        return activity?.placeId;
      }).filter(Boolean)).size
    };
  }, [userBookings, activities]);

  const metrics = [
    { 
      icon: MapPin, 
      label: "Upcoming Trips", 
      value: stats.upcomingTrips.toString(),
      trend: { direction: "up", value: "+2 this month" },
      color: "primary",
      to: "/traveller/trips"
    },
    { 
      icon: Calendar, 
      label: "Total Bookings", 
      value: stats.totalBookings.toString(),
      color: "success"
    },
    { 
      icon: DollarSign, 
      label: "Total Spent", 
      value: `₹${stats.totalSpent.toLocaleString()}`,
      color: "warning"
    },
    { 
      icon: Star, 
      label: "Places Visited", 
      value: stats.placesVisited.toString(),
      color: "neutral"
    },
  ];

  // Featured activities for discovery
  const featuredActivities = useMemo(() => {
    return activities.filter(a => a.featured && a.isPublished).slice(0, 4);
  }, [activities]);

  // Recent bookings
  const recentBookings = useMemo(() => {
    return userBookings
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 3)
      .map(booking => {
        const activity = activities.find(a => a.id === booking.activityId);
        const place = activity ? places.find(p => p.id === activity.placeId) : null;
        return { ...booking, activity, place };
      });
  }, [userBookings, activities, places]);

  return (
    <DashboardLayout role="traveller" title="My Travel Dashboard" user={user}>
      
      {/* Welcome Section */}
      <div className="mb-8 p-6 bg-gradient-to-r from-primary-600 to-blue-600 rounded-2xl text-white">
        <h1 className="text-2xl font-bold mb-2">Welcome back, {user?.name}! 🌟</h1>
        <p className="opacity-90">Ready for your next adventure? Discover amazing experiences waiting for you.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
        {metrics.map((metric, i) => (
          <StatCard key={i} {...metric} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Content - 2 columns */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Recent Bookings */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white inline-flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Recent Bookings
                </h2>
                <Link 
                  to="/traveller/bookings" 
                  className="text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 font-medium"
                >
                  View All
                </Link>
              </div>
              
              {recentBookings.length === 0 ? (
                <div className="text-center py-8">
                  <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    No bookings yet
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    Start exploring and book your first adventure!
                  </p>
                  <Link to="/search">
                    <button className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
                      Explore Activities
                    </button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {recentBookings.map((booking) => (
                    <div key={booking.id} className="flex items-center gap-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                      {booking.activity?.images?.[0] && (
                        <img
                          src={booking.activity.images[0]}
                          alt={booking.activity.title}
                          className="w-16 h-16 rounded-lg object-cover"
                        />
                      )}
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900 dark:text-white">
                          {booking.activity?.title || 'Unknown Activity'}
                        </h3>
                        <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mt-1">
                          <div className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            {booking.place?.name || 'Unknown Place'}
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {new Date(booking.bookingDate).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-gray-900 dark:text-white">
                          ₹{booking.totalAmount}
                        </div>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          booking.status === 'confirmed' 
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300'
                            : booking.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300'
                            : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300'
                        }`}>
                          {booking.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Discover New Activities */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white inline-flex items-center gap-2">
                  <Compass className="h-5 w-5" />
                  Discover New Adventures
                </h2>
                <Link 
                  to="/search" 
                  className="text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 font-medium"
                >
                  Explore All
                </Link>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {featuredActivities.map((activity) => {
                  const place = places.find(p => p.id === activity.placeId);
                  return (
                    <Link 
                      key={activity.id} 
                      to={`/activities/${activity.id}`}
                      className="group block"
                    >
                      <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                        <div className="relative h-32 overflow-hidden">
                          <img
                            src={activity.images[0]}
                            alt={activity.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <div className="absolute top-2 left-2">
                            <span className="inline-flex items-center gap-1 px-2 py-1 bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-200 text-xs font-medium rounded-full">
                              <Star className="h-3 w-3" />
                              Featured
                            </span>
                          </div>
                          <div className="absolute top-2 right-2">
                            <span className="px-2 py-1 bg-black/60 text-white text-xs rounded-full">
                              ₹{activity.price}
                            </span>
                          </div>
                        </div>
                        <div className="p-3">
                          <h3 className="font-medium text-gray-900 dark:text-white mb-1">
                            {activity.title}
                          </h3>
                          <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                            <div className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {place?.name || 'Unknown Place'}
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {activity.durationMinutes}min
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar - 1 column */}
        <div className="space-y-6">
          
          {/* Quick Actions */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h2>
              
              <div className="space-y-3">
                <Link 
                  to="/search"
                  className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                >
                  <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/20 rounded-lg flex items-center justify-center">
                    <Compass className="h-5 w-5 text-primary-600 dark:text-primary-400" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">Explore Activities</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Find new adventures</div>
                  </div>
                </Link>
                
                <Link 
                  to="/traveller/bookings"
                  className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                >
                  <div className="w-10 h-10 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
                    <Calendar className="h-5 w-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">My Bookings</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">View your trips</div>
                  </div>
                </Link>
                
                <Link 
                  to="/traveller/wishlist"
                  className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                >
                  <div className="w-10 h-10 bg-red-100 dark:bg-red-900/20 rounded-lg flex items-center justify-center">
                    <Heart className="h-5 w-5 text-red-600 dark:text-red-400" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">Wishlist</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Saved favorites</div>
                  </div>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Travel Tips */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 inline-flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Travel Tips
              </h2>
              
              <div className="space-y-4">
                <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <h3 className="font-medium text-blue-900 dark:text-blue-200 mb-1">Best Time to Visit Kolkata</h3>
                  <p className="text-sm text-blue-800 dark:text-blue-300">
                    October to March offers pleasant weather for outdoor activities.
                  </p>
                </div>
                
                <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <h3 className="font-medium text-green-900 dark:text-green-200 mb-1">Local Transport</h3>
                  <p className="text-sm text-green-800 dark:text-green-300">
                    Metro and trams are convenient for reaching major attractions.
                  </p>
                </div>
                
                <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <h3 className="font-medium text-purple-900 dark:text-purple-200 mb-1">Food Safety</h3>
                  <p className="text-sm text-purple-800 dark:text-purple-300">
                    Try street food from busy stalls for authentic experiences.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Weather Widget */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Today's Weather</h2>
              
              <div className="text-center">
                <div className="text-4xl mb-2">☀️</div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">28°C</div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  Sunny • Perfect for sightseeing
                </div>
                <div className="flex justify-between text-sm">
                  <div>
                    <div className="text-gray-500">High</div>
                    <div className="font-medium">32°C</div>
                  </div>
                  <div>
                    <div className="text-gray-500">Low</div>
                    <div className="font-medium">24°C</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
