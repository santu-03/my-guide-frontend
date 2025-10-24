// import React, { useEffect, useState, useMemo } from "react";
// import { Link } from "react-router-dom";
// import DashboardLayout from "@/components/Layout/DashboardLayout";
// import {
//   Calendar,
//   Users,
//   MapPin,
//   Clock,
//   Star,
//   Filter,
//   Search,
//   Loader2,
//   AlertCircle,
//   CheckCircle2,
//   XCircle,
//   Download,
//   RefreshCw,
//   TrendingUp,
//   Package,
//   Eye,
//   Trash2,
//   ArrowRight,
//   Sparkles,
//   MapPinned,
// } from "lucide-react";
// import { Card, CardContent } from "@/components/ui/Card";
// import Button from "@/components/ui/Button";
// import Modal from "@/components/ui/Modal";
// import { api, useAuthStore } from "@/store/auth";
// import toast from "react-hot-toast";

// const formatINR = (price) =>
//   typeof price !== "number"
//     ? "₹—"
//     : new Intl.NumberFormat("en-IN", {
//         style: "currency",
//         currency: "INR",
//         maximumFractionDigits: 0,
//       }).format(price);

// const formatDate = (date) => {
//   if (!date) return "—";
//   return new Date(date).toLocaleDateString("en-IN", {
//     day: "numeric",
//     month: "short",
//     year: "numeric",
//   });
// };

// const formatDateTime = (date) => {
//   if (!date) return "—";
//   return new Date(date).toLocaleDateString("en-IN", {
//     weekday: "short",
//     day: "numeric",
//     month: "short",
//     year: "numeric",
//   });
// };

// const getStatusInfo = (status) => {
//   const statusMap = {
//     pending: {
//       label: "Pending Payment",
//       color: "bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-300 border border-amber-200 dark:border-amber-800",
//       icon: Clock,
//       badge: "bg-amber-500",
//     },
//     confirmed: {
//       label: "Confirmed",
//       color: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800",
//       icon: CheckCircle2,
//       badge: "bg-emerald-500",
//     },
//     completed: {
//       label: "Completed",
//       color: "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300 border border-blue-200 dark:border-blue-800",
//       icon: CheckCircle2,
//       badge: "bg-blue-500",
//     },
//     cancelled: {
//       label: "Cancelled",
//       color: "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300 border border-red-200 dark:border-red-800",
//       icon: XCircle,
//       badge: "bg-red-500",
//     },
//   };
//   return statusMap[status] || statusMap.pending;
// };

// export default function MyBookings() {
//   const { user } = useAuthStore();
  
//   const [bookings, setBookings] = useState([]);
//   const [filteredBookings, setFilteredBookings] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
  
//   const [statusFilter, setStatusFilter] = useState("all");
//   const [searchQuery, setSearchQuery] = useState("");
//   const [sortBy, setSortBy] = useState("date-desc");

//   const [showCancelModal, setShowCancelModal] = useState(false);
//   const [cancelingBooking, setCancelingBooking] = useState(null);
//   const [cancelReason, setCancelReason] = useState("");
//   const [canceling, setCanceling] = useState(false);

//   const fetchBookings = async () => {
//     try {
//       setLoading(true);
//       setError("");

//       const res = await api.get("/bookings/my-bookings", {
//         silenceToast: true,
//       });

//       const data = res?.data?.data || res?.data?.bookings || res?.data || [];
//       const bookingsArray = Array.isArray(data) ? data : [];

//       setBookings(bookingsArray);
//       setFilteredBookings(bookingsArray);
//     } catch (err) {
//       console.error(err);
//       setError(err?.response?.data?.message || "Failed to load bookings");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchBookings();
//   }, []);

//   useEffect(() => {
//     let result = [...bookings];

//     if (statusFilter !== "all") {
//       result = result.filter((b) => b.status === statusFilter);
//     }

//     if (searchQuery.trim()) {
//       const query = searchQuery.toLowerCase();
//       result = result.filter((b) => {
//         const title = b.activity?.title?.toLowerCase() || "";
//         const city = b.activity?.city?.toLowerCase() || "";
//         return title.includes(query) || city.includes(query);
//       });
//     }

//     result.sort((a, b) => {
//       if (sortBy === "date-desc") {
//         return new Date(b.date) - new Date(a.date);
//       } else if (sortBy === "date-asc") {
//         return new Date(a.date) - new Date(b.date);
//       } else if (sortBy === "created-desc") {
//         return new Date(b.createdAt) - new Date(a.createdAt);
//       }
//       return 0;
//     });

//     setFilteredBookings(result);
//   }, [bookings, statusFilter, searchQuery, sortBy]);

//   const handleCancelClick = (booking) => {
//     setCancelingBooking(booking);
//     setCancelReason("");
//     setShowCancelModal(true);
//   };

//   const handleCancelConfirm = async () => {
//     if (!cancelingBooking) return;

//     try {
//       setCanceling(true);

//       await api.patch(`/bookings/${cancelingBooking._id}/cancel`, {
//         reason: cancelReason.trim() || "Cancelled by user",
//       });

//       setBookings((prev) =>
//         prev.map((b) =>
//           b._id === cancelingBooking._id ? { ...b, status: "cancelled" } : b
//         )
//       );

//       toast.success("Booking cancelled successfully");
//       setShowCancelModal(false);
//       setCancelingBooking(null);
//       setCancelReason("");
//     } catch (err) {
//       console.error(err);
//       toast.error(err?.response?.data?.message || "Failed to cancel booking");
//     } finally {
//       setCanceling(false);
//     }
//   };

//   const stats = useMemo(() => ({
//     total: bookings.length,
//     upcoming: bookings.filter((b) => b.status === "confirmed" && new Date(b.date) >= new Date()).length,
//     completed: bookings.filter((b) => b.status === "completed").length,
//     cancelled: bookings.filter((b) => b.status === "cancelled").length,
//   }), [bookings]);

//   const totalSpent = useMemo(() => {
//     return bookings
//       .filter((b) => b.status === "confirmed" || b.status === "completed")
//       .reduce((sum, b) => sum + (b.totalAmount || b.pricing?.total || b.amount || 0), 0);
//   }, [bookings]);

//   return (
//     <DashboardLayout role="traveller" title="My Bookings" user={user}>
//       <div className="mb-8">
//         <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
//           <div>
//             <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
//               <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center">
//                 <Calendar className="h-6 w-6 text-white" />
//               </div>
//               My Bookings
//             </h1>
//             <p className="text-gray-600 dark:text-gray-400 mt-2">
//               Manage and track all your adventure bookings
//             </p>
//           </div>
//           <div className="flex gap-3">
//             <Button 
//               onClick={fetchBookings} 
//               variant="outline"
//               disabled={loading}
//               className="inline-flex items-center gap-2"
//             >
//               <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
//               Refresh
//             </Button>
//             <Button 
//               as={Link} 
//               to="/search"
//               className="inline-flex items-center gap-2"
//             >
//               <Sparkles className="h-4 w-4" />
//               Book New Activity
//             </Button>
//           </div>
//         </div>
//       </div>

//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
//         <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-shadow">
//           <div className="flex items-center justify-between mb-2">
//             <Calendar className="h-8 w-8 opacity-80" />
//             <div className="text-right">
//               <div className="text-3xl font-bold">{stats.total}</div>
//               <div className="text-sm opacity-90">Total Bookings</div>
//             </div>
//           </div>
//         </div>

//         <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-shadow">
//           <div className="flex items-center justify-between mb-2">
//             <CheckCircle2 className="h-8 w-8 opacity-80" />
//             <div className="text-right">
//               <div className="text-3xl font-bold">{stats.upcoming}</div>
//               <div className="text-sm opacity-90">Upcoming</div>
//             </div>
//           </div>
//         </div>

//         <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-shadow">
//           <div className="flex items-center justify-between mb-2">
//             <TrendingUp className="h-8 w-8 opacity-80" />
//             <div className="text-right">
//               <div className="text-3xl font-bold">{stats.completed}</div>
//               <div className="text-sm opacity-90">Completed</div>
//             </div>
//           </div>
//         </div>

//         <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-shadow">
//           <div className="flex items-center justify-between mb-2">
//             <Package className="h-8 w-8 opacity-80" />
//             <div className="text-right">
//               <div className="text-2xl font-bold">{formatINR(totalSpent)}</div>
//               <div className="text-sm opacity-90">Total Spent</div>
//             </div>
//           </div>
//         </div>
//       </div>

//       <Card className="mb-6 border-0 shadow-md">
//         <CardContent className="p-6">
//           <div className="flex flex-col lg:flex-row gap-4">
//             <div className="flex-1 relative">
//               <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
//               <input
//                 type="text"
//                 placeholder="Search by activity or city..."
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//                 className="w-full pl-12 pr-4 py-3 border border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-800 dark:text-white transition-all"
//               />
//             </div>

//             <div className="lg:w-48 relative">
//               <Filter className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
//               <select
//                 value={statusFilter}
//                 onChange={(e) => setStatusFilter(e.target.value)}
//                 className="w-full pl-12 pr-4 py-3 border border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent appearance-none dark:bg-gray-800 dark:text-white cursor-pointer transition-all"
//               >
//                 <option value="all">All Status</option>
//                 <option value="pending">Pending</option>
//                 <option value="confirmed">Confirmed</option>
//                 <option value="completed">Completed</option>
//                 <option value="cancelled">Cancelled</option>
//               </select>
//             </div>

//             <select
//               value={sortBy}
//               onChange={(e) => setSortBy(e.target.value)}
//               className="lg:w-48 px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-800 dark:text-white cursor-pointer transition-all"
//             >
//               <option value="date-desc">Newest First</option>
//               <option value="date-asc">Oldest First</option>
//               <option value="created-desc">Recently Created</option>
//             </select>
//           </div>
//         </CardContent>
//       </Card>

//       {error && (
//         <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
//           <div className="flex items-center gap-3 text-red-600 dark:text-red-400">
//             <AlertCircle className="h-5 w-5 flex-shrink-0" />
//             <p>{error}</p>
//           </div>
//         </div>
//       )}

//       {loading ? (
//         <div className="space-y-4">
//           {[...Array(3)].map((_, i) => (
//             <Card key={i} className="border-0 shadow-md">
//               <CardContent className="p-6">
//                 <div className="animate-pulse">
//                   <div className="flex gap-6">
//                     <div className="w-48 h-32 bg-gray-200 dark:bg-gray-700 rounded-xl" />
//                     <div className="flex-1 space-y-3">
//                       <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
//                       <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
//                       <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4" />
//                     </div>
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>
//           ))}
//         </div>
//       ) : filteredBookings.length === 0 ? (
//         <Card className="border-0 shadow-md">
//           <CardContent className="p-12 text-center">
//             <div className="w-20 h-20 bg-gradient-to-br from-primary-100 to-primary-200 dark:from-primary-900/20 dark:to-primary-800/20 rounded-full flex items-center justify-center mx-auto mb-6">
//               <Calendar className="h-10 w-10 text-primary-600 dark:text-primary-400" />
//             </div>
//             <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
//               {searchQuery || statusFilter !== "all" ? "No matching bookings" : "No bookings yet"}
//             </h3>
//             <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
//               {searchQuery || statusFilter !== "all"
//                 ? "Try adjusting your filters to find what you're looking for"
//                 : "Start your adventure today! Browse amazing activities and create unforgettable memories."}
//             </p>
//             <div className="flex flex-wrap gap-3 justify-center">
//               <Button as={Link} to="/search" size="lg" className="gap-2">
//                 <Sparkles className="h-5 w-5" />
//                 Browse Activities
//               </Button>
//               <Button as={Link} to="/places" variant="outline" size="lg" className="gap-2">
//                 <MapPinned className="h-5 w-5" />
//                 Explore Places
//               </Button>
//             </div>
//           </CardContent>
//         </Card>
//       ) : (
//         <div className="space-y-5">
//           {filteredBookings.map((booking) => {
//             const activity = booking.activity || {};
//             const statusInfo = getStatusInfo(booking.status);
//             const StatusIcon = statusInfo.icon;
//             const isPast = new Date(booking.date) < new Date();
//             const canCancel = 
//               booking.status === "confirmed" && 
//               !isPast &&
//               new Date(booking.date) - new Date() > 24 * 60 * 60 * 1000;

//             // ✅ Fixed: Use correct field names from Booking model
//             const participants = booking.participants || booking.peopleCount || 1;
//             const totalAmount = booking.totalAmount || booking.pricing?.total || booking.amount || 0;
            
//             // ✅ Fixed: Handle image URL properly (can be string or object)
//             const activityImage = typeof activity.images?.[0] === 'string' 
//               ? activity.images[0] 
//               : activity.images?.[0]?.url || '/assets/images/placeholder-image.jpg';

//             return (
//               <Card key={booking._id} className="border-0 shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group">
//                 <CardContent className="p-0">
//                   <div className="flex flex-col lg:flex-row">
                    
//                     <div className="relative lg:w-64 h-48 lg:h-auto overflow-hidden">
//                       <img
//                         src={activityImage}
//                         alt={activity.title}
//                         className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
//                         onError={(e) => {
//                           e.target.src = '/assets/images/placeholder-image.jpg';
//                         }}
//                       />
                      
//                       <div className="absolute top-4 left-4">
//                         <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-semibold ${statusInfo.color} backdrop-blur-sm`}>
//                           <StatusIcon className="h-4 w-4" />
//                           {statusInfo.label}
//                         </span>
//                       </div>

//                       <Link
//                         to={`/booking/confirm?id=${booking._id}`}
//                         className="absolute bottom-4 right-4 w-10 h-10 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110"
//                       >
//                         <Eye className="h-5 w-5 text-gray-900 dark:text-white" />
//                       </Link>
//                     </div>

//                     <div className="flex-1 p-6 lg:p-8">
//                       <div className="flex items-start justify-between gap-4 mb-4">
//                         <div className="flex-1 min-w-0">
//                           <Link
//                             to={`/booking/confirm?id=${booking._id}`}
//                             className="text-2xl font-bold text-gray-900 dark:text-white hover:text-primary-600 dark:hover:text-primary-400 line-clamp-1 transition-colors"
//                           >
//                             {activity.title || "Activity"}
//                           </Link>
//                           <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-gray-600 dark:text-gray-400">
//                             {activity.city && (
//                               <span className="inline-flex items-center gap-1.5 font-medium">
//                                 <MapPin className="h-4 w-4" />
//                                 {activity.city}
//                               </span>
//                             )}
//                             {activity.rating?.avg && (
//                               <span className="inline-flex items-center gap-1.5 font-medium">
//                                 <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
//                                 {Number(activity.rating.avg).toFixed(1)} Rating
//                               </span>
//                             )}
//                           </div>
//                         </div>
//                       </div>

//                       <div className="grid grid-cols-3 gap-6 mb-6 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
//                         <div>
//                           <div className="text-xs text-gray-500 dark:text-gray-400 mb-1 uppercase tracking-wide font-medium">
//                             Date
//                           </div>
//                           <div className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
//                             <Calendar className="h-4 w-4 text-primary-600 dark:text-primary-400" />
//                             {formatDateTime(booking.date)}
//                           </div>
//                         </div>

//                         <div>
//                           <div className="text-xs text-gray-500 dark:text-gray-400 mb-1 uppercase tracking-wide font-medium">
//                             Guests
//                           </div>
//                           <div className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
//                             <Users className="h-4 w-4 text-primary-600 dark:text-primary-400" />
//                             {participants} {participants > 1 ? "Guests" : "Guest"}
//                           </div>
//                         </div>

//                         <div>
//                           <div className="text-xs text-gray-500 dark:text-gray-400 mb-1 uppercase tracking-wide font-medium">
//                             Total Amount
//                           </div>
//                           <div className="font-bold text-xl text-primary-600 dark:text-primary-400">
//                             {formatINR(totalAmount)}
//                           </div>
//                         </div>
//                       </div>

//                       <div className="flex flex-wrap gap-3">
//                         <Button
//                           as={Link}
//                           to={`/booking/confirm?id=${booking._id}`}
//                           size="sm"
//                           className="gap-2"
//                         >
//                           <Eye className="h-4 w-4" />
//                           View Details
//                         </Button>

//                         {canCancel && (
//                           <Button
//                             onClick={() => handleCancelClick(booking)}
//                             size="sm"
//                             variant="outline"
//                             className="text-red-600 border-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 gap-2"
//                           >
//                             <Trash2 className="h-4 w-4" />
//                             Cancel
//                           </Button>
//                         )}

//                         {booking.status === "completed" && (
//                           <Button
//                             as={Link}
//                             to={`/activities/${activity._id || activity.id}`}
//                             size="sm"
//                             variant="outline"
//                             className="gap-2"
//                           >
//                             <Star className="h-4 w-4" />
//                             Review
//                           </Button>
//                         )}

//                         <Button
//                           size="sm"
//                           variant="ghost"
//                           className="gap-2"
//                         >
//                           <Download className="h-4 w-4" />
//                           Receipt
//                         </Button>

//                         <Button
//                           as={Link}
//                           to={`/activities/${activity._id || activity.id}`}
//                           size="sm"
//                           variant="ghost"
//                           className="gap-2 ml-auto"
//                         >
//                           View Activity
//                           <ArrowRight className="h-4 w-4" />
//                         </Button>
//                       </div>
//                     </div>
//                   </div>
//                 </CardContent>
//               </Card>
//             );
//           })}
//         </div>
//       )}

//       {!loading && (
//         <div className="mt-12 grid md:grid-cols-2 gap-6">
//           <Card className="border-0 shadow-lg bg-gradient-to-br from-emerald-500 to-teal-600 text-white overflow-hidden group hover:shadow-2xl transition-all duration-300">
//             <CardContent className="p-8 relative">
//               <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500" />
//               <div className="relative z-10">
//                 <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
//                   <MapPinned className="h-7 w-7" />
//                 </div>
//                 <h3 className="text-2xl font-bold mb-2">Explore Places</h3>
//                 <p className="text-white/90 mb-6">
//                   Discover amazing destinations and plan your next adventure
//                 </p>
//                 <Button 
//                   as={Link} 
//                   to="/search?type=place" 
//                   variant="transparent"
//                   className="gap-2 border-2 border-white/30 hover:bg-white/20"
//                 >
//                   Browse Places
//                   <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
//                 </Button>
//               </div>
//             </CardContent>
//           </Card>

//           <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-500 to-pink-600 text-white overflow-hidden group hover:shadow-2xl transition-all duration-300">
//             <CardContent className="p-8 relative">
//               <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500" />
//               <div className="relative z-10">
//                 <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
//                   <Sparkles className="h-7 w-7" />
//                 </div>
//                 <h3 className="text-2xl font-bold mb-2">New Activities</h3>
//                 <p className="text-white/90 mb-6">
//                   Find exciting activities and experiences waiting for you
//                 </p>
//                 <Button 
//                   as={Link} 
//                   to="/search?type=activity" 
//                   variant="transparent"
//                   className="gap-2 border-2 border-white/30 hover:bg-white/20"
//                 >
//                   Browse Activities
//                   <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
//                 </Button>
//               </div>
//             </CardContent>
//           </Card>
//         </div>
//       )}

//       <Modal
//         isOpen={showCancelModal}
//         onClose={() => !canceling && setShowCancelModal(false)}
//         title="Cancel Booking"
//         size="md"
//       >
//         <div className="space-y-5">
//           <div className="flex items-start gap-4 p-4 bg-red-50 dark:bg-red-900/20 rounded-xl">
//             <div className="w-10 h-10 bg-red-100 dark:bg-red-900/40 rounded-full flex items-center justify-center flex-shrink-0">
//               <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
//             </div>
//             <div>
//               <h4 className="font-semibold text-red-900 dark:text-red-100 mb-1">
//                 Are you sure?
//               </h4>
//               <p className="text-sm text-red-700 dark:text-red-300">
//                 This action cannot be undone. Your booking will be cancelled permanently.
//               </p>
//             </div>
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//               Reason for cancellation (optional)
//             </label>
//             <textarea
//               value={cancelReason}
//               onChange={(e) => setCancelReason(e.target.value)}
//               rows={3}
//               className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-primary-500 dark:bg-gray-800 dark:text-white resize-none"
//               placeholder="Help us improve by sharing why you're cancelling..."
//               disabled={canceling}
//             />
//           </div>

//           <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-xl border border-amber-200 dark:border-amber-800">
//             <p className="text-sm text-amber-900 dark:text-amber-100">
//               <strong>Cancellation Policy:</strong> Free cancellation up to 24 hours before 
//               the activity. Refunds process within 5-7 business days.
//             </p>
//           </div>

//           <div className="flex gap-3 pt-2">
//             <Button
//               onClick={() => setShowCancelModal(false)}
//               variant="outline"
//               className="flex-1"
//               disabled={canceling}
//             >
//               Keep Booking
//             </Button>
//             <Button
//               onClick={handleCancelConfirm}
//               variant="danger"
//               className="flex-1"
//               loading={canceling}
//               disabled={canceling}
//             >
//               {canceling ? "Cancelling..." : "Yes, Cancel Booking"}
//             </Button>
//           </div>
//         </div>
//       </Modal>
//     </DashboardLayout>
//   );
// }
import React, { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "@/components/Layout/DashboardLayout";
import {
  Calendar,
  Users,
  MapPin,
  Clock,
  Star,
  Filter,
  Search,
  Loader2,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Download,
  RefreshCw,
  TrendingUp,
  Package,
  Eye,
  Trash2,
  ArrowRight,
  Sparkles,
  MapPinned,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import { api, useAuthStore } from "@/store/auth";
import toast from "react-hot-toast";

const formatINR = (price) =>
  typeof price !== "number"
    ? "₹—"
    : new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0,
      }).format(price);

const formatDate = (date) => {
  if (!date) return "—";
  return new Date(date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const formatDateTime = (date) => {
  if (!date) return "—";
  return new Date(date).toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const getStatusInfo = (status) => {
  const statusMap = {
    pending: {
      label: "Pending Payment",
      color: "bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-300 border border-amber-200 dark:border-amber-800",
      icon: Clock,
      badge: "bg-amber-500",
    },
    confirmed: {
      label: "Confirmed",
      color: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800",
      icon: CheckCircle2,
      badge: "bg-emerald-500",
    },
    completed: {
      label: "Completed",
      color: "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300 border border-blue-200 dark:border-blue-800",
      icon: CheckCircle2,
      badge: "bg-blue-500",
    },
    cancelled: {
      label: "Cancelled",
      color: "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300 border border-red-200 dark:border-red-800",
      icon: XCircle,
      badge: "bg-red-500",
    },
  };
  return statusMap[status] || statusMap.pending;
};

export default function MyBookings() {
  const { user } = useAuthStore();
  
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("date-desc");

  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [activeBooking, setActiveBooking] = useState(null);
  const [cancelReason, setCancelReason] = useState("");
  const [canceling, setCanceling] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await api.get("/bookings/my-bookings", {
        silenceToast: true,
      });

      // Handle different response structures
      let bookingsArray = [];
      
      if (res.data?.data?.bookings) {
        bookingsArray = res.data.data.bookings;
      } else if (res.data?.bookings) {
        bookingsArray = res.data.bookings;
      } else if (Array.isArray(res.data?.data)) {
        bookingsArray = res.data.data;
      } else if (Array.isArray(res.data)) {
        bookingsArray = res.data;
      }

      // Ensure all bookings have proper IDs
      const normalizedBookings = bookingsArray.map(booking => ({
        ...booking,
        id: booking.id || booking._id,
        _id: booking._id || booking.id,
      }));

      setBookings(normalizedBookings);
      setFilteredBookings(normalizedBookings);
    } catch (err) {
      console.error(err);
      setError(err?.response?.data?.message || "Failed to load bookings");
      toast.error("Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  useEffect(() => {
    let result = [...bookings];

    if (statusFilter !== "all") {
      result = result.filter((b) => b.status === statusFilter);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter((b) => {
        const activity = b.activity || {};
        const place = b.place || {};
        const title = activity.title || activity.name || place.title || place.name || "";
        const city = activity.city || place.city || "";
        const bookingId = b.id || b._id || "";
        return (
          title.toLowerCase().includes(query) || 
          city.toLowerCase().includes(query) ||
          bookingId.toLowerCase().includes(query)
        );
      });
    }

    result.sort((a, b) => {
      if (sortBy === "date-desc") {
        return new Date(b.date) - new Date(a.date);
      } else if (sortBy === "date-asc") {
        return new Date(a.date) - new Date(b.date);
      } else if (sortBy === "created-desc") {
        return new Date(b.createdAt) - new Date(a.createdAt);
      }
      return 0;
    });

    setFilteredBookings(result);
  }, [bookings, statusFilter, searchQuery, sortBy]);

  const handleCancelClick = (booking) => {
    setActiveBooking(booking);
    setCancelReason("");
    setShowCancelModal(true);
  };

  const handleDeleteClick = (booking) => {
    setActiveBooking(booking);
    setShowDeleteModal(true);
  };

  const handleCancelConfirm = async () => {
    if (!activeBooking) return;

    try {
      setCanceling(true);
      const bookingId = activeBooking._id || activeBooking.id;

      await api.patch(`/bookings/${bookingId}/cancel`, {
        reason: cancelReason.trim() || "Cancelled by user",
      });

      // Update the booking status in real-time
      setBookings(prev => 
        prev.map(b => 
          (b._id === bookingId || b.id === bookingId) 
            ? { ...b, status: 'cancelled' }
            : b
        )
      );

      toast.success("Booking cancelled successfully");
      setShowCancelModal(false);
      setActiveBooking(null);
      setCancelReason("");
    } catch (err) {
      console.error("Cancel booking error:", err);
      toast.error(err?.response?.data?.message || "Failed to cancel booking");
    } finally {
      setCanceling(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!activeBooking) return;

    try {
      setDeleting(true);
      const bookingId = activeBooking._id || activeBooking.id;

      await api.delete(`/bookings/${bookingId}`);

      // Remove booking from list in real-time
      setBookings(prev => 
        prev.filter(b => (b._id !== bookingId && b.id !== bookingId))
      );

      toast.success("Booking deleted successfully");
      setShowDeleteModal(false);
      setActiveBooking(null);
    } catch (err) {
      console.error("Delete booking error:", err);
      toast.error(err?.response?.data?.message || "Failed to delete booking");
    } finally {
      setDeleting(false);
    }
  };

  const handleQuickStatusUpdate = async (bookingId, newStatus) => {
    try {
      await api.patch(`/bookings/${bookingId}/quick-status`, {
        status: newStatus,
      });

      // Update booking status in real-time
      setBookings(prev => 
        prev.map(b => 
          (b._id === bookingId || b.id === bookingId) 
            ? { ...b, status: newStatus }
            : b
        )
      );

      toast.success(`Booking ${newStatus} successfully`);
    } catch (err) {
      console.error("Update status error:", err);
      toast.error(err?.response?.data?.message || "Failed to update booking");
    }
  };

  const stats = useMemo(() => ({
    total: bookings.length,
    upcoming: bookings.filter((b) => b.status === "confirmed" && new Date(b.date) >= new Date()).length,
    completed: bookings.filter((b) => b.status === "completed").length,
    cancelled: bookings.filter((b) => b.status === "cancelled").length,
    pending: bookings.filter((b) => b.status === "pending").length,
  }), [bookings]);

  const totalSpent = useMemo(() => {
    return bookings
      .filter((b) => b.status === "confirmed" || b.status === "completed")
      .reduce((sum, b) => sum + (b.totalAmount || b.pricing?.total || b.amount || 0), 0);
  }, [bookings]);

  return (
    <DashboardLayout role="traveller" title="My Bookings" user={user}>
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center">
                <Calendar className="h-6 w-6 text-white" />
              </div>
              My Bookings
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Manage and track all your adventure bookings
            </p>
          </div>
          <div className="flex gap-3">
            <Button 
              onClick={fetchBookings} 
              variant="outline"
              disabled={loading}
              className="inline-flex items-center gap-2"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button 
              as={Link} 
              to="/search"
              className="inline-flex items-center gap-2"
            >
              <Sparkles className="h-4 w-4" />
              Book New Activity
            </Button>
          </div>
        </div>
      </div>

      {/* Enhanced Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <Calendar className="h-8 w-8 opacity-80" />
              <div className="text-right">
                <div className="text-2xl font-bold">{stats.total}</div>
                <div className="text-xs opacity-90">Total</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-emerald-500 to-emerald-600 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <CheckCircle2 className="h-8 w-8 opacity-80" />
              <div className="text-right">
                <div className="text-2xl font-bold">{stats.upcoming}</div>
                <div className="text-xs opacity-90">Upcoming</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-500 to-purple-600 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <TrendingUp className="h-8 w-8 opacity-80" />
              <div className="text-right">
                <div className="text-2xl font-bold">{stats.completed}</div>
                <div className="text-xs opacity-90">Completed</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-amber-500 to-amber-600 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <Clock className="h-8 w-8 opacity-80" />
              <div className="text-right">
                <div className="text-2xl font-bold">{stats.pending}</div>
                <div className="text-xs opacity-90">Pending</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-500 to-orange-600 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <Package className="h-8 w-8 opacity-80" />
              <div className="text-right">
                <div className="text-xl font-bold">{formatINR(totalSpent)}</div>
                <div className="text-xs opacity-90">Total Spent</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Enhanced Filters */}
      <Card className="mb-6 border-0 shadow-md">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by activity, place, city, or booking ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-800 dark:text-white transition-all"
              />
            </div>

            <div className="lg:w-48 relative">
              <Filter className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent appearance-none dark:bg-gray-800 dark:text-white cursor-pointer transition-all"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="lg:w-48 px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-800 dark:text-white cursor-pointer transition-all"
            >
              <option value="date-desc">Newest First</option>
              <option value="date-asc">Oldest First</option>
              <option value="created-desc">Recently Created</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {error && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 text-red-600 dark:text-red-400">
              <AlertCircle className="h-5 w-5 flex-shrink-0" />
              <p>{error}</p>
            </div>
            <Button onClick={fetchBookings} variant="outline" size="sm">
              Retry
            </Button>
          </div>
        </div>
      )}

      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="border-0 shadow-md">
              <CardContent className="p-6">
                <div className="animate-pulse">
                  <div className="flex gap-6">
                    <div className="w-48 h-32 bg-gray-200 dark:bg-gray-700 rounded-xl" />
                    <div className="flex-1 space-y-3">
                      <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filteredBookings.length === 0 ? (
        <Card className="border-0 shadow-md">
          <CardContent className="p-12 text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-primary-100 to-primary-200 dark:from-primary-900/20 dark:to-primary-800/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Calendar className="h-10 w-10 text-primary-600 dark:text-primary-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
              {searchQuery || statusFilter !== "all" ? "No matching bookings" : "No bookings yet"}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
              {searchQuery || statusFilter !== "all"
                ? "Try adjusting your filters to find what you're looking for"
                : "Start your adventure today! Browse amazing activities and create unforgettable memories."}
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Button as={Link} to="/search" size="lg" className="gap-2">
                <Sparkles className="h-5 w-5" />
                Browse Activities
              </Button>
              <Button as={Link} to="/places" variant="outline" size="lg" className="gap-2">
                <MapPinned className="h-5 w-5" />
                Explore Places
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-5">
          {filteredBookings.map((booking) => {
            const activity = booking.activity || {};
            const place = booking.place || {};
            const statusInfo = getStatusInfo(booking.status);
            const StatusIcon = statusInfo.icon;
            const isPast = new Date(booking.date) < new Date();
            const canCancel = booking.status === "confirmed" && !isPast;
            const canDelete = booking.status === "cancelled" || isPast;

            const item = activity.title ? activity : place;
            const participants = booking.participants || booking.peopleCount || 1;
            const totalAmount = booking.totalAmount || booking.pricing?.total || booking.amount || 0;
            const bookingId = booking._id || booking.id;

            const itemImage = typeof item.images?.[0] === 'string' 
              ? item.images[0] 
              : item.images?.[0]?.url || '/assets/images/placeholder-image.jpg';

            return (
              <Card key={bookingId} className="border-0 shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group">
                <CardContent className="p-0">
                  <div className="flex flex-col lg:flex-row">
                    
                    <div className="relative lg:w-64 h-48 lg:h-auto overflow-hidden">
                      <img
                        src={itemImage}
                        alt={item.title || item.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        onError={(e) => {
                          e.target.src = '/assets/images/placeholder-image.jpg';
                        }}
                      />
                      
                      <div className="absolute top-4 left-4">
                        <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-semibold ${statusInfo.color} backdrop-blur-sm`}>
                          <StatusIcon className="h-4 w-4" />
                          {statusInfo.label}
                        </span>
                      </div>

                      <Link
                        to={`/booking/confirm?id=${bookingId}`}
                        className="absolute bottom-4 right-4 w-10 h-10 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110"
                      >
                        <Eye className="h-5 w-5 text-gray-900 dark:text-white" />
                      </Link>
                    </div>

                    <div className="flex-1 p-6 lg:p-8">
                      <div className="flex items-start justify-between gap-4 mb-4">
                        <div className="flex-1 min-w-0">
                          <Link
                            to={`/booking/confirm?id=${bookingId}`}
                            className="text-2xl font-bold text-gray-900 dark:text-white hover:text-primary-600 dark:hover:text-primary-400 line-clamp-1 transition-colors"
                          >
                            {item.title || item.name || "Booking"}
                          </Link>
                          <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-gray-600 dark:text-gray-400">
                            {item.city && (
                              <span className="inline-flex items-center gap-1.5 font-medium">
                                <MapPin className="h-4 w-4" />
                                {item.city}
                              </span>
                            )}
                            {item.duration && (
                              <span className="inline-flex items-center gap-1.5 font-medium">
                                <Clock className="h-4 w-4" />
                                {item.duration}
                              </span>
                            )}
                            {item.rating?.avg && (
                              <span className="inline-flex items-center gap-1.5 font-medium">
                                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                {Number(item.rating.avg).toFixed(1)}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-6 mb-6 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                        <div>
                          <div className="text-xs text-gray-500 dark:text-gray-400 mb-1 uppercase tracking-wide font-medium">
                            Date
                          </div>
                          <div className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-primary-600 dark:text-primary-400" />
                            {formatDateTime(booking.date)}
                          </div>
                        </div>

                        <div>
                          <div className="text-xs text-gray-500 dark:text-gray-400 mb-1 uppercase tracking-wide font-medium">
                            Guests
                          </div>
                          <div className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                            <Users className="h-4 w-4 text-primary-600 dark:text-primary-400" />
                            {participants} {participants > 1 ? "Guests" : "Guest"}
                          </div>
                        </div>

                        <div>
                          <div className="text-xs text-gray-500 dark:text-gray-400 mb-1 uppercase tracking-wide font-medium">
                            Total Amount
                          </div>
                          <div className="font-bold text-xl text-primary-600 dark:text-primary-400">
                            {formatINR(totalAmount)}
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-3">
                        <Button
                          as={Link}
                          to={`/booking/confirm?id=${bookingId}`}
                          size="sm"
                          className="gap-2"
                        >
                          <Eye className="h-4 w-4" />
                          View Details
                        </Button>

                        {/* Quick Status Actions */}
                        {booking.status === 'pending' && (
                          <Button
                            onClick={() => handleQuickStatusUpdate(bookingId, 'confirmed')}
                            size="sm"
                            variant="outline"
                            className="gap-2 text-emerald-600 border-emerald-300 hover:bg-emerald-50"
                          >
                            <CheckCircle2 className="h-4 w-4" />
                            Confirm
                          </Button>
                        )}

                        {booking.status === 'confirmed' && isPast && (
                          <Button
                            onClick={() => handleQuickStatusUpdate(bookingId, 'completed')}
                            size="sm"
                            variant="outline"
                            className="gap-2 text-blue-600 border-blue-300 hover:bg-blue-50"
                          >
                            <CheckCircle2 className="h-4 w-4" />
                            Mark Complete
                          </Button>
                        )}

                        {canCancel && (
                          <Button
                            onClick={() => handleCancelClick(booking)}
                            size="sm"
                            variant="outline"
                            className="text-red-600 border-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 gap-2"
                          >
                            <XCircle className="h-4 w-4" />
                            Cancel
                          </Button>
                        )}

                        {canDelete && (
                          <Button
                            onClick={() => handleDeleteClick(booking)}
                            size="sm"
                            variant="outline"
                            className="text-red-600 border-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 gap-2"
                          >
                            <Trash2 className="h-4 w-4" />
                            Delete
                          </Button>
                        )}

                        {booking.status === "completed" && (
                          <Button
                            as={Link}
                            to={activity._id ? `/activities/${activity._id}` : `/places/${place._id}`}
                            size="sm"
                            variant="outline"
                            className="gap-2"
                          >
                            <Star className="h-4 w-4" />
                            Review
                          </Button>
                        )}

                        <Button
                          size="sm"
                          variant="ghost"
                          className="gap-2"
                        >
                          <Download className="h-4 w-4" />
                          Receipt
                        </Button>

                        <Button
                          as={Link}
                          to={activity._id ? `/activities/${activity._id}` : `/places/${place._id}`}
                          size="sm"
                          variant="ghost"
                          className="gap-2 ml-auto"
                        >
                          View {activity._id ? "Activity" : "Place"}
                          <ArrowRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {!loading && (
        <div className="mt-12 grid md:grid-cols-2 gap-6">
          <Card className="border-0 shadow-lg bg-gradient-to-br from-emerald-500 to-teal-600 text-white overflow-hidden group hover:shadow-2xl transition-all duration-300">
            <CardContent className="p-8 relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500" />
              <div className="relative z-10">
                <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <MapPinned className="h-7 w-7" />
                </div>
                <h3 className="text-2xl font-bold mb-2">Explore Places</h3>
                <p className="text-white/90 mb-6">
                  Discover amazing destinations and plan your next adventure
                </p>
                <Button 
                  as={Link} 
                  to="/search?type=place" 
                  variant="transparent"
                  className="gap-2 border-2 border-white/30 hover:bg-white/20"
                >
                  Browse Places
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-500 to-pink-600 text-white overflow-hidden group hover:shadow-2xl transition-all duration-300">
            <CardContent className="p-8 relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500" />
              <div className="relative z-10">
                <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Sparkles className="h-7 w-7" />
                </div>
                <h3 className="text-2xl font-bold mb-2">New Activities</h3>
                <p className="text-white/90 mb-6">
                  Find exciting activities and experiences waiting for you
                </p>
                <Button 
                  as={Link} 
                  to="/search?type=activity" 
                  variant="transparent"
                  className="gap-2 border-2 border-white/30 hover:bg-white/20"
                >
                  Browse Activities
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Cancel Modal */}
      <Modal
        isOpen={showCancelModal}
        onClose={() => !canceling && setShowCancelModal(false)}
        title="Cancel Booking"
        size="md"
      >
        <div className="space-y-5">
          <div className="flex items-start gap-4 p-4 bg-red-50 dark:bg-red-900/20 rounded-xl">
            <div className="w-10 h-10 bg-red-100 dark:bg-red-900/40 rounded-full flex items-center justify-center flex-shrink-0">
              <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <h4 className="font-semibold text-red-900 dark:text-red-100 mb-1">
                Are you sure?
              </h4>
              <p className="text-sm text-red-700 dark:text-red-300">
                This action cannot be undone. Your booking will be cancelled permanently.
              </p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Reason for cancellation (optional)
            </label>
            <textarea
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-primary-500 dark:bg-gray-800 dark:text-white resize-none"
              placeholder="Help us improve by sharing why you're cancelling..."
              disabled={canceling}
            />
          </div>

          <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-xl border border-amber-200 dark:border-amber-800">
            <p className="text-sm text-amber-900 dark:text-amber-100">
              <strong>Cancellation Policy:</strong> Free cancellation up to 24 hours before 
              the activity. Refunds process within 5-7 business days.
            </p>
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              onClick={() => setShowCancelModal(false)}
              variant="outline"
              className="flex-1"
              disabled={canceling}
            >
              Keep Booking
            </Button>
            <Button
              onClick={handleCancelConfirm}
              variant="danger"
              className="flex-1"
              loading={canceling}
              disabled={canceling}
            >
              {canceling ? "Cancelling..." : "Yes, Cancel Booking"}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Delete Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => !deleting && setShowDeleteModal(false)}
        title="Delete Booking"
        size="md"
      >
        <div className="space-y-5">
          <div className="flex items-start gap-4 p-4 bg-red-50 dark:bg-red-900/20 rounded-xl">
            <div className="w-10 h-10 bg-red-100 dark:bg-red-900/40 rounded-full flex items-center justify-center flex-shrink-0">
              <Trash2 className="h-5 w-5 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <h4 className="font-semibold text-red-900 dark:text-red-100 mb-1">
                Delete Booking Permanently?
              </h4>
              <p className="text-sm text-red-700 dark:text-red-300">
                This action cannot be undone. All booking data will be permanently removed from our systems.
              </p>
            </div>
          </div>

          <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-xl border border-amber-200 dark:border-amber-800">
            <p className="text-sm text-amber-900 dark:text-amber-100">
              <strong>Note:</strong> Only cancelled or past bookings can be deleted. 
              Active bookings must be cancelled first.
            </p>
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              onClick={() => setShowDeleteModal(false)}
              variant="outline"
              className="flex-1"
              disabled={deleting}
            >
              Keep Booking
            </Button>
            <Button
              onClick={handleDeleteConfirm}
              variant="danger"
              className="flex-1"
              loading={deleting}
              disabled={deleting}
            >
              {deleting ? "Deleting..." : "Yes, Delete Permanently"}
            </Button>
          </div>
        </div>
      </Modal>
    </DashboardLayout>
  );
}