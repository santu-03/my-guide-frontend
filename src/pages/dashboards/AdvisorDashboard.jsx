<<<<<<< HEAD
import React, { useEffect, useState, useMemo } from "react";
=======
// import React, { useMemo } from "react";
// import DashboardLayout from "@/components/Layout/DashboardLayout";
// import StatCard from "@/components/Layout/StatCard";
// import { ClipboardList, Star, Users, FileBarChart, TrendingUp, Award } from "lucide-react";

// const recent = [
//   { id: "c1", name: "Monsoon Trek Drive", status: "Live",   progress: 72 },
//   { id: "c2", name: "Calcutta Heritage Walk", status: "Draft", progress: 35 },
//   { id: "c3", name: "Goa Cycling Tour", status: "Review", progress: 58 },
// ];

// export default function AdvisorDashboard() {
//   const user = { name: "Advisor User", role: "advisor", avatar: "/default-avatar.png" };

//   const metrics = useMemo(
//     () => [
//       { icon: ClipboardList, label: "Active Campaigns", value: "18", trend: { direction: "up", value: "+4.1%" } },
//       { icon: Users,         label: "Total Clients",     value: "76", trend: { direction: "up", value: "+1.3%" }, subtle: true },
//       { icon: FileBarChart,  label: "Reports (30d)",     value: "42" },
//       { icon: Star,          label: "Avg Client Rating", value: "4.8 / 5" },
//     ],
//     []
//   );

//   return (
//     <DashboardLayout role="advisor" title="Home" user={user}>
//       <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
//         {metrics.map((m, i) => <StatCard key={i} {...m} />)}
//       </div>

//       <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
//         <section className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm ring-1 ring-gray-200/70 dark:ring-gray-800/70 p-5">
//           <h2 className="text-base font-semibold text-gray-900 dark:text-white mb-4 inline-flex items-center gap-2">
//             <TrendingUp className="h-5 w-5" /> Recent Campaigns
//           </h2>
//           <ul className="divide-y divide-gray-100 dark:divide-gray-700">
//             {recent.map((r) => (
//               <li key={r.id} className="py-4 flex items-center justify-between">
//                 <div>
//                   <div className="font-medium text-gray-900 dark:text-white">{r.name}</div>
//                   <div className="text-xs text-gray-500">Status: {r.status}</div>
//                 </div>
//                 <div className="w-40">
//                   <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
//                     <div className="h-full bg-primary-500" style={{ width: `${r.progress}%` }} />
//                   </div>
//                   <div className="text-right text-xs mt-1 text-gray-500">{r.progress}%</div>
//                 </div>
//               </li>
//             ))}
//           </ul>
//         </section>

//         <section className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm ring-1 ring-gray-200/70 dark:ring-gray-800/70 p-5">
//           <h2 className="text-base font-semibold text-gray-900 dark:text-white mb-4 inline-flex items-center gap-2">
//             <Award className="h-5 w-5" /> Highlights
//           </h2>
//           <div className="grid sm:grid-cols-2 gap-3 text-sm">
//             <div className="p-3 rounded-lg border border-gray-200 dark:border-gray-700">Top Rated: Goa Cycling Tour</div>
//             <div className="p-3 rounded-lg border border-gray-200 dark:border-gray-700">Rising: Monsoon Trek Drive</div>
//             <div className="p-3 rounded-lg border border-gray-200 dark:border-gray-700">New Client: River Rafting Co.</div>
//             <div className="p-3 rounded-lg border border-gray-200 dark:border-gray-700">3 briefs due this week</div>
//           </div>
//         </section>
//       </div>
//     </DashboardLayout>
//   );
// }


import React, { useMemo } from "react";
>>>>>>> 4aaf08ad57bfe341382432d957ec3746b55e0cd0
import { Link } from "react-router-dom";
import DashboardLayout from "@/components/Layout/DashboardLayout";
import StatCard from "@/components/Layout/StatCard";
import { Card, CardContent } from "@/components/ui/Card";
<<<<<<< HEAD
import {
  Users,
  Calendar,
  FileText,
  MessageSquare,
  Star,
  Award,
  HeartHandshake,
} from "lucide-react";
import { useAuthStore } from "@/store/auth";
import axios from "axios";

export default function AdvisorDashboard() {
  const { user } = useAuthStore();

  // 🔧 State variables to hold fetched data
  const [travellers, setTravellers] = useState([]);
  const [upcomingPlans, setUpcomingPlans] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🌐 Inline axios setup with auth
  const API = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL || "http://localhost:5000/api",
  });

  API.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  });

  // 📡 Fetch advisor-specific dashboard data
  const loadAdvisorDashboard = async () => {
    setLoading(true);
    try {
      const [travellerRes, plansRes, testimonialsRes] = await Promise.all([
        API.get("/advisor/travellers"),
        API.get("/advisor/plans/upcoming"),
        API.get("/advisor/testimonials"),
      ]);

      setTravellers(travellerRes.data?.travellers || []);
      setUpcomingPlans(plansRes.data?.plans || []);
      setTestimonials(testimonialsRes.data?.testimonials || []);
    } catch (err) {
      console.error("Error fetching advisor dashboard data", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAdvisorDashboard();
  }, []);

  // 📊 Metrics calculation
  const stats = useMemo(() => {
    const totalTravellers = travellers.length;
    const upcomingTrips = upcomingPlans.length;
    const avgRating = testimonials.length
      ? (
          testimonials.reduce((sum, t) => sum + (t.rating || 0), 0) /
          testimonials.length
        ).toFixed(1)
      : "4.6"; // default if no rating

    return {
      totalTravellers,
      upcomingTrips,
      avgRating,
    };
  }, [travellers, upcomingPlans, testimonials]);

  const metrics = [
    {
      icon: Users,
      label: "Total Travellers",
      value: stats.totalTravellers.toString(),
      trend: { direction: "up", value: "+12%" },
      color: "success",
    },
    {
      icon: Calendar,
      label: "Upcoming Trips",
      value: stats.upcomingTrips.toString(),
      trend: { direction: "up", value: "+3 this month" },
      color: "primary",
    },
    {
      icon: Star,
      label: "Avg. Rating",
      value: stats.avgRating.toString(),
      trend: { direction: "up", value: "+0.2" },
      color: "neutral",
    },
  ];

  return (
    <DashboardLayout role="advisor" title="Advisor Dashboard" user={user}>
      {/* Welcome Section */}
      <div className="mb-8 p-6 bg-gradient-to-r from-green-600 to-teal-600 rounded-2xl text-white">
        <h1 className="text-2xl font-bold mb-2">Welcome back, {user?.name}!</h1>
        <p className="opacity-90">Let’s guide more travellers toward unforgettable journeys!</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
=======
import { 
  Users, 
  MapPin, 
  Calendar,
  DollarSign,
  Star,
  TrendingUp,
  FileText,
  MessageSquare,
  Clock,
  CheckCircle,
  AlertCircle,
  Phone
} from "lucide-react";
import { useSampleDataStore } from "@/store/sampleData";
import { useAuthStore } from "@/store/auth";

export default function AdvisorDashboard() {
  const { user } = useAuthStore();
  const { activities, places, users } = useSampleDataStore();
  
  // Mock advisor-specific data
  const advisorData = useMemo(() => {
    return {
      clients: [
        { id: 1, name: "Sarah Johnson", email: "sarah@email.com", status: 'active', budget: 50000, destination: 'Kolkata', travelDate: new Date(2024, 3, 15) },
        { id: 2, name: "Mike Chen", email: "mike@email.com", status: 'planning', budget: 75000, destination: 'West Bengal', travelDate: new Date(2024, 4, 20) },
        { id: 3, name: "Emma Davis", email: "emma@email.com", status: 'booked', budget: 30000, destination: 'Kolkata', travelDate: new Date(2024, 3, 10) },
        { id: 4, name: "James Wilson", email: "james@email.com", status: 'completed', budget: 45000, destination: 'Darjeeling', travelDate: new Date(2024, 2, 5) }
      ],
      itineraries: [
        { id: 1, clientName: "Sarah Johnson", title: "5-Day Cultural Kolkata Experience", status: 'draft', lastModified: new Date(2024, 2, 20) },
        { id: 2, clientName: "Mike Chen", title: "West Bengal Heritage Trail", status: 'submitted', lastModified: new Date(2024, 2, 18) },
        { id: 3, clientName: "Emma Davis", title: "Kolkata Food & Art Tour", status: 'approved', lastModified: new Date(2024, 2, 15) }
      ],
      pendingTasks: [
        { id: 1, task: "Review Sarah's itinerary feedback", priority: 'high', dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000) },
        { id: 2, task: "Book accommodation for Mike Chen", priority: 'medium', dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000) },
        { id: 3, task: "Follow up with Emma's transport", priority: 'low', dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000) }
      ],
      upcomingCalls: [
        { id: 1, clientName: "Sarah Johnson", type: "consultation", date: new Date(Date.now() + 2 * 60 * 60 * 1000), duration: 30 },
        { id: 2, clientName: "Mike Chen", type: "itinerary_review", date: new Date(Date.now() + 24 * 60 * 60 * 1000), duration: 45 }
      ]
    };
  }, []);

  // Calculate stats
  const stats = useMemo(() => {
    const activeClients = advisorData.clients.filter(c => c.status === 'active').length;
    const totalRevenue = advisorData.clients
      .filter(c => c.status === 'completed')
      .reduce((sum, c) => sum + (c.budget * 0.15), 0); // 15% commission
    const pendingItineraries = advisorData.itineraries.filter(i => i.status === 'draft' || i.status === 'submitted').length;
    const completedClients = advisorData.clients.filter(c => c.status === 'completed').length;
    
    return {
      activeClients,
      totalRevenue: Math.round(totalRevenue),
      pendingItineraries,
      completedClients,
      upcomingCalls: advisorData.upcomingCalls.length
    };
  }, [advisorData]);

  const metrics = [
    { 
      icon: Users, 
      label: "Active Clients", 
      value: stats.activeClients.toString(),
      trend: { direction: "up", value: "+3 this month" },
      color: "primary"
    },
    { 
      icon: FileText, 
      label: "Pending Itineraries", 
      value: stats.pendingItineraries.toString(),
      trend: { direction: "up", value: "+2 this week" },
      color: "warning"
    },
    { 
      icon: DollarSign, 
      label: "Commission Earned", 
      value: `₹${stats.totalRevenue.toLocaleString()}`,
      trend: { direction: "up", value: "+18%" },
      color: "success"
    },
    { 
      icon: CheckCircle, 
      label: "Completed Trips", 
      value: stats.completedClients.toString(),
      color: "neutral"
    },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300';
      case 'planning': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300';
      case 'booked': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
      case 'completed': return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300';
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300';
      case 'low': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <DashboardLayout role="advisor" title="Travel Advisor Dashboard" user={user}>
      
      {/* Welcome Section */}
      <div className="mb-8 p-6 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl text-white">
        <h1 className="text-2xl font-bold mb-2">Welcome back, {user?.name}!</h1>
        <p className="opacity-90">Help travelers create unforgettable experiences in Kolkata and beyond.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
>>>>>>> 4aaf08ad57bfe341382432d957ec3746b55e0cd0
        {metrics.map((metric, i) => (
          <StatCard key={i} {...metric} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
<<<<<<< HEAD
        {/* Main Area */}
        <div className="lg:col-span-2 space-y-8">
          {/* Upcoming Travel Plans */}
=======
        
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Active Clients */}
>>>>>>> 4aaf08ad57bfe341382432d957ec3746b55e0cd0
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white inline-flex items-center gap-2">
<<<<<<< HEAD
                  <Calendar className="h-5 w-5" />
                  Upcoming Travel Plans
                </h2>
                <Link
                  to="/advisor/plans"
=======
                  <Users className="h-5 w-5" />
                  Active Clients
                </h2>
                <Link 
                  to="/advisor/clients" 
>>>>>>> 4aaf08ad57bfe341382432d957ec3746b55e0cd0
                  className="text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 font-medium"
                >
                  View All
                </Link>
              </div>
<<<<<<< HEAD

              <div className="space-y-4">
                {upcomingPlans.length === 0 ? (
                  <p className="text-gray-600 dark:text-gray-400">No upcoming trips found.</p>
                ) : (
                  upcomingPlans.map((plan) => (
                    <div
                      key={plan.id}
                      className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg shadow-sm"
                    >
                      <h3 className="font-medium text-gray-900 dark:text-white">
                        {plan.destination}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Departure: {new Date(plan.departureDate).toLocaleDateString()}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Duration: {plan.duration} days
                      </p>
                    </div>
                  ))
                )}
=======
              
              <div className="space-y-4">
                {advisorData.clients.filter(c => c.status !== 'completed').map((client) => (
                  <div key={client.id} className="flex items-center gap-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-semibold">
                      {client.name.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900 dark:text-white">
                        {client.name}
                      </h3>
                      <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mt-1">
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {client.destination}
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {client.travelDate.toLocaleDateString()}
                        </div>
                        <div className="flex items-center gap-1">
                          <DollarSign className="h-4 w-4" />
                          ₹{client.budget.toLocaleString()}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(client.status)}`}>
                        {client.status}
                      </span>
                      <div className="mt-2">
                        <Link 
                          to={`/advisor/clients/${client.id}`}
                          className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400"
                        >
                          View Details
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
>>>>>>> 4aaf08ad57bfe341382432d957ec3746b55e0cd0
              </div>
            </CardContent>
          </Card>

<<<<<<< HEAD
          {/* Testimonials */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 inline-flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Traveller Testimonials
              </h2>

              <div className="space-y-4">
                {testimonials.length === 0 ? (
                  <p className="text-gray-600 dark:text-gray-400">No testimonials yet.</p>
                ) : (
                  testimonials.map((t, index) => (
                    <div key={index} className="border-l-4 border-teal-500 pl-3">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="flex text-yellow-400">
                          {[...Array(t.rating || 0)].map((_, i) => (
                            <Star key={i} className="h-4 w-4 fill-current" />
                          ))}
                          {[...Array(5 - (t.rating || 0))].map((_, i) => (
                            <Star key={i + 5} className="h-4 w-4 text-gray-300" />
                          ))}
                        </div>
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {t.travellerName}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700 dark:text-gray-300 mb-1">{t.comment}</p>
                      <p className="text-xs text-gray-500">Trip: {t.tripName}</p>
                    </div>
                  ))
                )}
=======
          {/* Recent Itineraries */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white inline-flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Recent Itineraries
                </h2>
                <Link 
                  to="/advisor/itineraries" 
                  className="text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 font-medium"
                >
                  View All
                </Link>
              </div>
              
              <div className="space-y-4">
                {advisorData.itineraries.map((itinerary) => (
                  <div key={itinerary.id} className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium text-gray-900 dark:text-white">
                        {itinerary.title}
                      </h3>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        itinerary.status === 'approved' 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300'
                          : itinerary.status === 'submitted'
                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300'
                          : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300'
                      }`}>
                        {itinerary.status}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                      <span>Client: {itinerary.clientName}</span>
                      <span>Modified: {itinerary.lastModified.toLocaleDateString()}</span>
                    </div>
                  </div>
                ))}
>>>>>>> 4aaf08ad57bfe341382432d957ec3746b55e0cd0
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
<<<<<<< HEAD
=======
          
          {/* Upcoming Calls */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 inline-flex items-center gap-2">
                <Phone className="h-5 w-5" />
                Upcoming Calls
              </h2>
              
              {advisorData.upcomingCalls.length === 0 ? (
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  No upcoming calls scheduled
                </p>
              ) : (
                <div className="space-y-3">
                  {advisorData.upcomingCalls.map((call) => (
                    <div key={call.id} className="p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                      <div className="font-medium text-gray-900 dark:text-white mb-1">
                        {call.clientName}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        {call.type.replace('_', ' ')} • {call.duration}min
                      </div>
                      <div className="text-sm font-medium text-blue-600 dark:text-blue-400">
                        {call.date.toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              <Link 
                to="/advisor/schedule" 
                className="block text-center text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 font-medium mt-4"
              >
                View Full Schedule
              </Link>
            </CardContent>
          </Card>

          {/* Pending Tasks */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 inline-flex items-center gap-2">
                <AlertCircle className="h-5 w-5" />
                Pending Tasks
              </h2>
              
              <div className="space-y-3">
                {advisorData.pendingTasks.map((task) => (
                  <div key={task.id} className="p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <div className="font-medium text-gray-900 dark:text-white text-sm">
                        {task.task}
                      </div>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(task.priority)}`}>
                        {task.priority}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-gray-600 dark:text-gray-400">
                      <Clock className="h-3 w-3" />
                      Due: {task.dueDate.toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
              
              <Link 
                to="/advisor/tasks" 
                className="block text-center text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 font-medium mt-4"
              >
                View All Tasks
              </Link>
            </CardContent>
          </Card>

>>>>>>> 4aaf08ad57bfe341382432d957ec3746b55e0cd0
          {/* Quick Actions */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h2>
<<<<<<< HEAD

              <div className="space-y-3">
                <Link
                  to="/advisor/plans/new"
                  className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                >
                  <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/20 rounded-lg flex items-center justify-center">
                    <FileText className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">Create Plan</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Propose new itinerary</div>
                  </div>
                </Link>

                <Link
                  to="/advisor/messages"
                  className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                >
                  <div className="w-10 h-10 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
                    <HeartHandshake className="h-5 w-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">Connect with Travellers</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Answer questions</div>
=======
              
              <div className="space-y-3">
                <Link 
                  to="/advisor/clients/new"
                  className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                >
                  <div className="w-10 h-10 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
                    <Users className="h-5 w-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">Add Client</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">New consultation</div>
                  </div>
                </Link>
                
                <Link 
                  to="/advisor/itineraries/new"
                  className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                >
                  <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                    <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">Create Itinerary</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Plan new trip</div>
                  </div>
                </Link>
                
                <Link 
                  to="/advisor/resources"
                  className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                >
                  <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
                    <MapPin className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">Browse Resources</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Find activities</div>
>>>>>>> 4aaf08ad57bfe341382432d957ec3746b55e0cd0
                  </div>
                </Link>
              </div>
            </CardContent>
          </Card>

<<<<<<< HEAD
          {/* Badge */}
          <Card className="border-l-4 border-yellow-500 bg-yellow-50 dark:bg-yellow-900/10">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Award className="h-8 w-8 text-yellow-600" />
                <div>
                  <h3 className="font-semibold text-yellow-800 dark:text-yellow-200">
                    Top Advisor
                  </h3>
                  <p className="text-sm text-yellow-700 dark:text-yellow-300">
                    You’ve helped 40+ travellers this month!
                  </p>
=======
          {/* Performance Metrics */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">This Month</h2>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">New Clients</span>
                  <span className="font-semibold text-gray-900 dark:text-white">5</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">Itineraries Created</span>
                  <span className="font-semibold text-gray-900 dark:text-white">8</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">Client Satisfaction</span>
                  <span className="font-semibold text-gray-900 dark:text-white">4.9/5</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">Response Time</span>
                  {/* <span className="font-semibold text-gray-900 dark:text-white"> < 2h</span> */}
                  <span className="font-semibold text-gray-900 dark:text-white">&lt; 2h</span>
>>>>>>> 4aaf08ad57bfe341382432d957ec3746b55e0cd0
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
<<<<<<< HEAD
}
=======
}
>>>>>>> 4aaf08ad57bfe341382432d957ec3746b55e0cd0
