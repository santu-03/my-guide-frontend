// import React, { useMemo } from "react";
// import DashboardLayout from "@/components/Layout/DashboardLayout";
// import StatCard from "@/components/Layout/StatCard";
// import { MapPin, Calendar, DollarSign, Star, Users } from "lucide-react";

// const upcoming = [
//   { id: "u1", title: "Old Kolkata Heritage Walk", date: "2025-09-14", guests: 6 },
//   { id: "u2", title: "Sundarbans Day Tour", date: "2025-09-16", guests: 12 },
//   { id: "u3", title: "North Kolkata Food Trail", date: "2025-09-20", guests: 8 },
// ];

// export default function GuideDashboard() {
//   const user = { name: "Guide User", role: "guide", avatar: "/default-avatar.png" };

//   const metrics = useMemo(
//     () => [
//       { icon: MapPin,    label: "Active Tours",      value: "9",      trend: { direction: "up", value: "+1" } },
//       { icon: Calendar,  label: "Upcoming Bookings", value: "23",     trend: { direction: "up", value: "+3" }, subtle: true },
//       { icon: DollarSign,label: "Earnings (30d)",    value: "₹84,200",trend: { direction: "up", value: "+6.2%" } },
//       { icon: Star,      label: "Average Rating",    value: "4.7 / 5" },
//     ],
//     []
//   );

//   return (
//     <DashboardLayout role="guide" title="Home" user={user}>
//       <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
//         {metrics.map((m, i) => <StatCard key={i} {...m} />)}
//       </div>

//       <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
//         <section className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm ring-1 ring-gray-200/70 dark:ring-gray-800/70 p-5">
//           <h2 className="text-base font-semibold text-gray-900 dark:text-white mb-4">Upcoming Bookings</h2>
//           <ul className="divide-y divide-gray-100 dark:divide-gray-700">
//             {upcoming.map((b) => (
//               <li key={b.id} className="py-4 flex items-center justify-between">
//                 <div>
//                   <div className="font-medium text-gray-900 dark:text-white">{b.title}</div>
//                   <div className="text-xs text-gray-500">{new Date(b.date).toLocaleDateString()}</div>
//                 </div>
//                 <div className="inline-flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
//                   <Users className="h-4 w-4" /> {b.guests}
//                 </div>
//               </li>
//             ))}
//           </ul>
//         </section>

//         <section className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm ring-1 ring-gray-200/70 dark:ring-gray-800/70 p-5">
//           <h2 className="text-base font-semibold text-gray-900 dark:text-white mb-4">Announcements</h2>
//           <ol className="list-disc pl-5 space-y-2 text-sm text-gray-700 dark:text-gray-300">
//             <li>Confirm meeting points a day before.</li>
//             <li>Carry spare ponchos and water.</li>
//             <li>Share a WhatsApp live-location on tour day.</li>
//           </ol>
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
  Users, 
  Calendar, 
  DollarSign,
  Star,
  MapPin,
  Clock,
  TrendingUp,
  MessageSquare,
  Camera,
  Award
} from "lucide-react";
import { useSampleDataStore } from "@/store/sampleData";
import { useAuthStore } from "@/store/auth";

export default function GuideDashboard() {
  const { user } = useAuthStore();
  const { activities, places, bookings } = useSampleDataStore();
  
  // Mock guide-specific data (in real app, this would be filtered by guide ID)
  const guideActivities = useMemo(() => {
    return activities.filter(a => a.isPublished).slice(0, 3); // Mock guide's activities
  }, [activities]);

  const guideBookings = useMemo(() => {
    return bookings.filter(b => b.status === 'confirmed').slice(0, 5); // Mock guide's bookings
  }, [bookings]);

  // Calculate stats
  const stats = useMemo(() => {
    const thisMonth = new Date();
    thisMonth.setDate(1);
    
    const monthlyBookings = guideBookings.filter(b => new Date(b.createdAt) >= thisMonth);
    const totalEarnings = guideBookings.reduce((sum, b) => sum + (b.totalAmount * 0.7), 0); // 70% commission
    const upcomingTours = guideBookings.filter(b => new Date(b.bookingDate) > new Date());
    
    return {
      totalTours: guideActivities.length,
      upcomingTours: upcomingTours.length,
      monthlyBookings: monthlyBookings.length,
      totalEarnings: Math.round(totalEarnings)
    };
  }, [guideActivities, guideBookings]);

  const metrics = [
    { 
      icon: Users, 
      label: "Upcoming Tours", 
      value: stats.upcomingTours.toString(),
      trend: { direction: "up", value: "+3 this week" },
      color: "primary"
    },
    { 
      icon: Calendar, 
      label: "Tours This Month", 
      value: stats.monthlyBookings.toString(),
      trend: { direction: "up", value: "+12%" },
      color: "success"
    },
    { 
      icon: DollarSign, 
      label: "Total Earnings", 
      value: `₹${stats.totalEarnings.toLocaleString()}`,
      trend: { direction: "up", value: "+8%" },
      color: "warning"
    },
    { 
      icon: Star, 
      label: "Average Rating", 
      value: "4.8",
      color: "neutral"
    },
  ];

  // Upcoming tours
  const upcomingTours = useMemo(() => {
    return guideBookings
      .filter(booking => new Date(booking.bookingDate) > new Date())
      .sort((a, b) => new Date(a.bookingDate) - new Date(b.bookingDate))
      .slice(0, 4)
      .map(booking => {
        const activity = activities.find(a => a.id === booking.activityId);
        const place = activity ? places.find(p => p.id === activity.placeId) : null;
        return { ...booking, activity, place };
      });
  }, [guideBookings, activities, places]);

  return (
    <DashboardLayout role="guide" title="Guide Dashboard" user={user}>
      
      {/* Welcome Section */}
      <div className="mb-8 p-6 bg-gradient-to-r from-green-600 to-teal-600 rounded-2xl text-white">
        <h1 className="text-2xl font-bold mb-2">Welcome, {user?.name}!</h1>
        <p className="opacity-90">Ready to share amazing experiences with travelers today?</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
        {metrics.map((metric, i) => (
          <StatCard key={i} {...metric} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Upcoming Tours */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white inline-flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Upcoming Tours
                </h2>
                <Link 
                  to="/guide/tours" 
                  className="text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 font-medium"
                >
                  View All
                </Link>
              </div>
              
              {upcomingTours.length === 0 ? (
                <div className="text-center py-8">
                  <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    No upcoming tours
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Your schedule is clear for now
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {upcomingTours.map((tour) => (
                    <div key={tour.id} className="flex items-center gap-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                      {tour.activity?.images?.[0] && (
                        <img
                          src={tour.activity.images[0]}
                          alt={tour.activity.title}
                          className="w-16 h-16 rounded-lg object-cover"
                        />
                      )}
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900 dark:text-white">
                          {tour.activity?.title || 'Tour Activity'}
                        </h3>
                        <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mt-1">
                          <div className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            {tour.place?.name || 'Location'}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {tour.activity?.durationMinutes || 60}min
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            1 guest
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-semibold text-gray-900 dark:text-white">
                          {new Date(tour.bookingDate).toLocaleDateString()}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          Earnings: ₹{Math.round(tour.totalAmount * 0.7)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* My Activities Performance */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white inline-flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  My Activities Performance
                </h2>
                <Link 
                  to="/guide/activities" 
                  className="text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 font-medium"
                >
                  Manage Activities
                </Link>
              </div>
              
              <div className="space-y-4">
                {guideActivities.map((activity) => {
                  const place = places.find(p => p.id === activity.placeId);
                  const activityBookings = guideBookings.filter(b => b.activityId === activity.id);
                  const avgRating = 4.2 + Math.random() * 0.8; // Mock rating
                  
                  return (
                    <div key={activity.id} className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                      <img
                        src={activity.images[0]}
                        alt={activity.title}
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900 dark:text-white">
                          {activity.title}
                        </h3>
                        <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mt-1">
                          <div className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            {place?.name}
                          </div>
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 text-yellow-500" />
                            {avgRating.toFixed(1)}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-semibold text-gray-900 dark:text-white">
                          {activityBookings.length}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          Total Bookings
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          
          {/* Quick Actions */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h2>
              
              <div className="space-y-3">
                <Link 
                  to="/guide/tours/new"
                  className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                >
                  <div className="w-10 h-10 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
                    <MapPin className="h-5 w-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">Create New Tour</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Add a new activity</div>
                  </div>
                </Link>
                
                <Link 
                  to="/guide/bookings"
                  className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                >
                  <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                    <Calendar className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">View Schedule</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Manage bookings</div>
                  </div>
                </Link>
                
                <Link 
                  to="/guide/earnings"
                  className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                >
                  <div className="w-10 h-10 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg flex items-center justify-center">
                    <DollarSign className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">Earnings Report</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Track income</div>
                  </div>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* This Month Stats */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">This Month</h2>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">Tours Completed</span>
                  <span className="font-semibold text-gray-900 dark:text-white">12</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">New Reviews</span>
                  <span className="font-semibold text-gray-900 dark:text-white">8</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">Response Rate</span>
                  <span className="font-semibold text-gray-900 dark:text-white">98%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">Cancellation Rate</span>
                  <span className="font-semibold text-gray-900 dark:text-white">2%</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Reviews */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 inline-flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Recent Reviews
              </h2>
              
              <div className="space-y-4">
                <div className="border-l-4 border-green-500 pl-3">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-current" />
                      ))}
                    </div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">Sarah M.</span>
                  </div>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    "Amazing tour of Victoria Memorial! Very knowledgeable guide."
                  </p>
                </div>
                
                <div className="border-l-4 border-blue-500 pl-3">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-current" />
                      ))}
                    </div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">John D.</span>
                  </div>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    "Perfect food tour experience! Highly recommended."
                  </p>
                </div>
                
                <div className="border-l-4 border-purple-500 pl-3">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="flex text-yellow-400">
                      {[...Array(4)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-current" />
                      ))}
                      <Star className="h-4 w-4 text-gray-300" />
                    </div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">Lisa K.</span>
                  </div>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    "Great insights into local culture. Very engaging!"
                  </p>
                </div>
              </div>
              
              <Link 
                to="/guide/reviews" 
                className="block text-center text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 font-medium mt-4"
              >
                View All Reviews
              </Link>
            </CardContent>
          </Card>

          {/* Achievement Badge */}
          <Card className="border-l-4 border-yellow-500 bg-yellow-50 dark:bg-yellow-900/10">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Award className="h-8 w-8 text-yellow-600" />
                <div>
                  <h3 className="font-semibold text-yellow-800 dark:text-yellow-200">Top Rated Guide</h3>
                  <p className="text-sm text-yellow-700 dark:text-yellow-300">
                    You've maintained a 4.8+ rating this month!
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}