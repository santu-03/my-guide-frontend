// // // import { useState, useEffect } from 'react';
// // // import { 
// // //   Calendar, 
// // //   DollarSign, 
// // //   Star, 
// // //   Users, 
// // //   MessageCircle,
// // //   TrendingUp,
// // //   Clock,
// // //   CheckCircle
// // // } from 'lucide-react';
// // // import { useAuthStore } from '@/store/auth';
// // // import { Card, CardContent, CardHeader } from '@/components/ui/Card';
// // // import Button from '@/components/ui/Button';
// // // import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// // // const GuideDashboard = () => {
// // //   const user = useAuthStore((state) => state.user);
// // //   const [activeTab, setActiveTab] = useState('overview');
// // //   const [bookings, setBookings] = useState([]);
// // //   const [earnings, setEarnings] = useState([]);

// // //   // Mock data - would come from API
// // //   const stats = {
// // //     thisMonthEarnings: 25000,
// // //     totalBookings: 45,
// // //     averageRating: 4.9,
// // //     responseRate: 98,
// // //     upcomingTours: 8,
// // //     completedTours: 37
// // //   };

// // //   const upcomingBookings = [
// // //     {
// // //       id: 1,
// // //       travelerName: 'John Doe',
// // //       date: '2024-12-25',
// // //       time: '10:00 AM',
// // //       service: 'Heritage Walking Tour',
// // //       status: 'confirmed',
// // //       price: 800
// // //     },
// // //     {
// // //       id: 2,
// // //       travelerName: 'Sarah Wilson',
// // //       date: '2024-12-26',
// // //       time: '2:00 PM',
// // //       service: 'Food Tour',
// // //       status: 'pending',
// // //       price: 1200
// // //     }
// // //   ];

// // //   const earningsData = [
// // //     { month: 'Jan', amount: 18000 },
// // //     { month: 'Feb', amount: 22000 },
// // //     { month: 'Mar', amount: 25000 },
// // //     { month: 'Apr', amount: 28000 },
// // //     { month: 'May', amount: 24000 },
// // //     { month: 'Jun', amount: 30000 }
// // //   ];

// // //   return (
// // //     <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
// // //       <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
// // //         {/* Header */}
// // //         <div className="mb-8">
// // //           <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
// // //             Guide Dashboard
// // //           </h1>
// // //           <p className="text-gray-600 dark:text-gray-300">
// // //             Manage your tours and grow your business
// // //           </p>
// // //         </div>

// // //         {/* Stats Cards */}
// // //         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
// // //           <Card className="p-6">
// // //             <div className="flex items-center justify-between">
// // //               <div>
// // //                 <p className="text-sm font-medium text-gray-600 dark:text-gray-400">This Month</p>
// // //                 <p className="text-3xl font-bold text-gray-900 dark:text-white">₹{stats.thisMonthEarnings.toLocaleString()}</p>
// // //                 <div className="flex items-center mt-2">
// // //                   <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
// // //                   <span className="text-sm text-green-600">+15% from last month</span>
// // //                 </div>
// // //               </div>
// // //               <DollarSign className="h-12 w-12 text-green-600" />
// // //             </div>
// // //           </Card>

// // //           <Card className="p-6">
// // //             <div className="flex items-center justify-between">
// // //               <div>
// // //                 <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Bookings</p>
// // //                 <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.totalBookings}</p>
// // //                 <div className="flex items-center mt-2">
// // //                   <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
// // //                   <span className="text-sm text-green-600">+8% this month</span>
// // //                 </div>
// // //               </div>
// // //               <Calendar className="h-12 w-12 text-blue-600" />
// // //             </div>
// // //           </Card>

// // //           <Card className="p-6">
// // //             <div className="flex items-center justify-between">
// // //               <div>
// // //                 <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Average Rating</p>
// // //                 <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.averageRating}</p>
// // //                 <div className="flex items-center mt-2">
// // //                   <Star className="h-4 w-4 text-yellow-500 mr-1 fill-current" />
// // //                   <span className="text-sm text-gray-500">From 127 reviews</span>
// // //                 </div>
// // //               </div>
// // //               <Star className="h-12 w-12 text-yellow-500" />
// // //             </div>
// // //           </Card>

// // //           <Card className="p-6">
// // //             <div className="flex items-center justify-between">
// // //               <div>
// // //                 <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Response Rate</p>
// // //                 <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.responseRate}%</p>
// // //                 <div className="flex items-center mt-2">
// // //                   <CheckCircle className="h-4 w-4 text-green-600 mr-1" />
// // //                   <span className="text-sm text-green-600">Excellent</span>
// // //                 </div>
// // //               </div>
// // //               <MessageCircle className="h-12 w-12 text-purple-600" />
// // //             </div>
// // //           </Card>
// // //         </div>

// // //         {/* Tabs */}
// // //         <div className="border-b border-gray-200 mb-8 dark:border-gray-700">
// // //           <nav className="flex space-x-8">
// // //             {[
// // //               { id: 'overview', label: 'Overview' },
// // //               { id: 'bookings', label: 'Bookings' },
// // //               { id: 'availability', label: 'Availability' },
// // //               { id: 'earnings', label: 'Earnings' },
// // //               { id: 'reviews', label: 'Reviews' },
// // //             ].map((tab) => (
// // //               <button
// // //                 key={tab.id}
// // //                 onClick={() => setActiveTab(tab.id)}
// // //                 className={`py-2 px-1 border-b-2 font-medium text-sm ${
// // //                   activeTab === tab.id
// // //                     ? 'border-primary-500 text-primary-600'
// // //                     : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
// // //                 }`}
// // //               >
// // //                 {tab.label}
// // //               </button>
// // //             ))}
// // //           </nav>
// // //         </div>

// // //         {/* Tab Content */}
// // //         {activeTab === 'overview' && (
// // //           <div className="grid lg:grid-cols-3 gap-8">
// // //             {/* Upcoming Tours */}
// // //             <div className="lg:col-span-2 space-y-6">
// // //               <Card>
// // //                 <CardHeader>
// // //                   <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
// // //                     Upcoming Tours
// // //                   </h3>
// // //                 </CardHeader>
// // //                 <CardContent>
// // //                   <div className="space-y-4">
// // //                     {upcomingBookings.map((booking) => (
// // //                       <div key={booking.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg dark:border-gray-700">
// // //                         <div className="flex items-center space-x-4">
// // //                           <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
// // //                             <Users className="h-6 w-6 text-primary-600" />
// // //                           </div>
// // //                           <div>
// // //                             <h4 className="font-semibold text-gray-900 dark:text-white">
// // //                               {booking.service}
// // //                             </h4>
// // //                             <p className="text-sm text-gray-500">
// // //                               with {booking.travelerName} • {booking.date} at {booking.time}
// // //                             </p>
// // //                           </div>
// // //                         </div>
// // //                         <div className="text-right">
// // //                           <p className="font-semibold text-gray-900 dark:text-white">
// // //                             ₹{booking.price}
// // //                           </p>
// // //                           <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
// // //                             booking.status === 'confirmed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
// // //                           }`}>
// // //                             {booking.status}
// // //                           </span>
// // //                         </div>
// // //                       </div>
// // //                     ))}
// // //                   </div>
// // //                 </CardContent>
// // //               </Card>

// // //               {/* Earnings Chart */}
// // //               <Card>
// // //                 <CardHeader>
// // //                   <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
// // //                     Earnings Trend
// // //                   </h3>
// // //                 </CardHeader>
// // //                 <CardContent>
// // //                   <div className="h-64">
// // //                     <ResponsiveContainer width="100%" height="100%">
// // //                       <LineChart data={earningsData}>
// // //                         <CartesianGrid strokeDasharray="3 3" />
// // //                         <XAxis dataKey="month" />
// // //                         <YAxis />
// // //                         <Tooltip formatter={(value) => [`₹${value.toLocaleString()}`, 'Earnings']} />
// // //                         <Line 
// // //                           type="monotone" 
// // //                           dataKey="amount" 
// // //                           stroke="#3B82F6" 
// // //                           strokeWidth={2}
// // //                           dot={{ fill: '#3B82F6' }}
// // //                         />
// // //                       </LineChart>
// // //                     </ResponsiveContainer>
// // //                   </div>
// // //                 </CardContent>
// // //               </Card>
// // //             </div>

// // //             {/* Quick Actions & Summary */}
// // //             <div className="space-y-6">
// // //               <Card className="p-6">
// // //                 <h3 className="text-lg font-semibold text-gray-900 mb-4 dark:text-white">
// // //                   Quick Actions
// // //                 </h3>
// // //                 <div className="space-y-3">
// // //                   <Button className="w-full justify-start" variant="outline">
// // //                     <Calendar className="mr-2 h-4 w-4" />
// // //                     Manage Availability
// // //                   </Button>
// // //                   <Button className="w-full justify-start" variant="outline">
// // //                     <MessageCircle className="mr-2 h-4 w-4" />
// // //                     View Messages
// // //                   </Button>
// // //                   <Button className="w-full justify-start" variant="outline">
// // //                     <DollarSign className="mr-2 h-4 w-4" />
// // //                     Request Payout
// // //                   </Button>
// // //                 </div>
// // //               </Card>

// // //               <Card className="p-6">
// // //                 <h3 className="text-lg font-semibold text-gray-900 mb-4 dark:text-white">
// // //                   Performance Summary
// // //                 </h3>
// // //                 <div className="space-y-4">
// // //                   <div>
// // //                     <div className="flex justify-between text-sm">
// // //                       <span className="text-gray-600 dark:text-gray-400">Booking completion rate</span>
// // //                       <span className="font-medium">96%</span>
// // //                     </div>
// // //                     <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
// // //                       <div className="bg-green-600 h-2 rounded-full" style={{width: '96%'}}></div>
// // //                     </div>
// // //                   </div>
// // //                   <div>
// // //                     <div className="flex justify-between text-sm">
// // //                       <span className="text-gray-600 dark:text-gray-400">Customer satisfaction</span>
// // //                       <span className="font-medium">4.9/5</span>
// // //                     </div>
// // //                     <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
// // //                       <div className="bg-yellow-500 h-2 rounded-full" style={{width: '98%'}}></div>
// // //                     </div>
// // //                   </div>
// // //                   <div>
// // //                     <div className="flex justify-between text-sm">
// // //                       <span className="text-gray-600 dark:text-gray-400">Response time</span>
// // //                       <span className="font-medium">{"< 2 hours"}</span>
// // //                     </div>
// // //                     <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
// // //                       <div className="bg-blue-600 h-2 rounded-full" style={{width: '90%'}}></div>
// // //                     </div>
// // //                   </div>
// // //                 </div>
// // //               </Card>
// // //             </div>
// // //           </div>
// // //         )}

// // //         {/* Other tabs would be implemented similarly */}
// // //       </div>
// // //     </div>
// // //   );
// // // };
// // // export default GuideDashboard;
// // // FILE: GuideDashboard.jsx
// // import React, { useState } from "react";
// // import {
// //   Calendar,
// //   DollarSign,
// //   Star,
// //   Users,
// //   MessageCircle,
// //   TrendingUp,
// //   CheckCircle,
// // } from "lucide-react";
// // import {
// //   LineChart,
// //   Line,
// //   XAxis,
// //   YAxis,
// //   CartesianGrid,
// //   Tooltip,
// //   ResponsiveContainer,
// // } from "recharts";
// // import { Link } from "react-router-dom";

// // export default function GuideDashboard() {
// //   const [activeTab, setActiveTab] = useState("overview");

// //   // Mock stats (replace with API)
// //   const stats = {
// //     thisMonthEarnings: 25000,
// //     totalBookings: 45,
// //     averageRating: 4.9,
// //     responseRate: 98,
// //   };

// //   const upcomingBookings = [
// //     { id: 1, travelerName: "John Doe", date: "2025-09-25", time: "10:00 AM", service: "Heritage Walking Tour", status: "confirmed", price: 800 },
// //     { id: 2, travelerName: "Sarah Wilson", date: "2025-09-26", time: "2:00 PM", service: "Food Tour", status: "pending", price: 1200 },
// //   ];

// //   const earningsData = [
// //     { month: "Jan", amount: 18000 },
// //     { month: "Feb", amount: 22000 },
// //     { month: "Mar", amount: 25000 },
// //     { month: "Apr", amount: 28000 },
// //     { month: "May", amount: 24000 },
// //     { month: "Jun", amount: 30000 },
// //   ];

// //   return (
// //     <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
// //       <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
// //         {/* Header */}
// //         <div className="mb-8 flex items-center justify-between">
// //           <div>
// //             <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
// //               Guide Dashboard
// //             </h1>
// //             <p className="text-gray-600 dark:text-gray-300">
// //               Manage your tours and grow your business
// //             </p>
// //           </div>
// //           <div className="flex gap-3">
// //             <button
// //               onClick={() => setActiveTab("overview")}
// //               className={`rounded-xl px-4 py-2 border ${activeTab === "overview" ? "bg-gray-900 text-white dark:bg-white dark:text-gray-900" : "border-gray-200 dark:border-gray-700"}`}
// //             >
// //               Overview
// //             </button>
// //             <button
// //               onClick={() => setActiveTab("bookings")}
// //               className={`rounded-xl px-4 py-2 border ${activeTab === "bookings" ? "bg-gray-900 text-white dark:bg-white dark:text-gray-900" : "border-gray-200 dark:border-gray-700"}`}
// //             >
// //               Bookings
// //             </button>
// //           </div>
// //         </div>

// //         {/* KPI Cards */}
// //         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
// //           <KPICard
// //             icon={<DollarSign className="h-12 w-12 text-green-600" />}
// //             label="This Month"
// //             value={`₹${stats.thisMonthEarnings.toLocaleString()}`}
// //             sub={<span className="inline-flex items-center text-sm text-green-600"><TrendingUp className="h-4 w-4 mr-1" /> +15% from last month</span>}
// //           />
// //           <KPICard
// //             icon={<Calendar className="h-12 w-12 text-blue-600" />}
// //             label="Total Bookings"
// //             value={stats.totalBookings}
// //           />
// //           <KPICard
// //             icon={<Star className="h-12 w-12 text-yellow-500" />}
// //             label="Average Rating"
// //             value={stats.averageRating}
// //             sub={<span className="inline-flex items-center text-sm text-gray-500"><Star className="h-4 w-4 mr-1 fill-current text-yellow-500" /> From 127 reviews</span>}
// //           />
// //           <KPICard
// //             icon={<MessageCircle className="h-12 w-12 text-purple-600" />}
// //             label="Response Rate"
// //             value={`${stats.responseRate}%`}
// //             sub={<span className="inline-flex items-center text-sm text-green-600"><CheckCircle className="h-4 w-4 mr-1" /> Excellent</span>}
// //           />
// //         </div>

// //         {/* Content */}
// //         <div className="grid lg:grid-cols-3 gap-8">
// //           <div className="lg:col-span-2 space-y-6">
// //             {/* Upcoming Tours */}
// //             <Section title="Upcoming Tours">
// //               <div className="space-y-4">
// //                 {upcomingBookings.map((b) => (
// //                   <div
// //                     key={b.id}
// //                     className="flex items-center justify-between p-4 border border-gray-200 rounded-lg dark:border-gray-700"
// //                   >
// //                     <div className="flex items-center space-x-4">
// //                       <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
// //                         <Users className="h-6 w-6 text-gray-700 dark:text-gray-300" />
// //                       </div>
// //                       <div>
// //                         <h4 className="font-semibold text-gray-900 dark:text-white">
// //                           {b.service}
// //                         </h4>
// //                         <p className="text-sm text-gray-500">
// //                           with {b.travelerName} • {b.date} at {b.time}
// //                         </p>
// //                       </div>
// //                     </div>
// //                     <div className="text-right">
// //                       <p className="font-semibold text-gray-900 dark:text-white">
// //                         ₹{b.price}
// //                       </p>
// //                       <span
// //                         className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
// //                           b.status === "confirmed"
// //                             ? "bg-green-100 text-green-800"
// //                             : "bg-yellow-100 text-yellow-800"
// //                         }`}
// //                       >
// //                         {b.status}
// //                       </span>
// //                     </div>
// //                   </div>
// //                 ))}
// //               </div>
// //             </Section>

// //             {/* Earnings Trend */}
// //             <Section title="Earnings Trend">
// //               <div className="h-64">
// //                 <ResponsiveContainer width="100%" height="100%">
// //                   <LineChart data={earningsData}>
// //                     <CartesianGrid strokeDasharray="3 3" />
// //                     <XAxis dataKey="month" />
// //                     <YAxis />
// //                     <Tooltip
// //                       formatter={(value) => [`₹${Number(value).toLocaleString()}`, "Earnings"]}
// //                     />
// //                     <Line
// //                       type="monotone"
// //                       dataKey="amount"
// //                       stroke="#3B82F6"
// //                       strokeWidth={2}
// //                       dot={{ fill: "#3B82F6" }}
// //                     />
// //                   </LineChart>
// //                 </ResponsiveContainer>
// //               </div>
// //             </Section>
// //           </div>

// //           {/* Sidebar */}
// //           <div className="space-y-6">
// //             <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6">
// //               <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
// //               <div className="space-y-3">
// //                 <Link
// //                   to="/guides/availability"
// //                   className="block w-full rounded-xl px-3 py-2 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
// //                 >
// //                   Manage Availability
// //                 </Link>
// //                 <Link
// //                   to="/guides/tours/new"
// //                   className="block w-full rounded-xl px-3 py-2 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
// //                 >
// //                   Create New Tour
// //                 </Link>
// //               </div>
// //             </div>
// //           </div>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }

// // function KPICard({ icon, label, value, sub }) {
// //   return (
// //     <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6">
// //       <div className="flex items-center justify-between">
// //         <div>
// //           <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
// //             {label}
// //           </p>
// //           <p className="text-3xl font-bold text-gray-900 dark:text-white">
// //             {value}
// //           </p>
// //           {sub && <div className="mt-2">{sub}</div>}
// //         </div>
// //         {icon}
// //       </div>
// //     </div>
// //   );
// // }

// // function Section({ title, children }) {
// //   return (
// //     <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
// //       <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-800 font-semibold">
// //         {title}
// //       </div>
// //       <div className="p-5">{children}</div>
// //     </div>
// //   );
// // }
// import React from "react";
// import { Map, Calendar, CheckCircle, Star } from "lucide-react";
// import Sidebar from "@/components/Layout/Sidebar";
// import StatCard from "@/components/Layout/StatCard";

// export default function GuideDashboard() {
//   const links = [
//     { to: "/guide/tours", label: "Tours", icon: Map },
//     { to: "/guide/calendar", label: "Calendar", icon: Calendar },
//   ];

//   const kpis = [
//     { icon: Map, label: "Total Tours", value: "84", color: "primary" },
//     { icon: Calendar, label: "Upcoming Tours", value: "12", color: "blue" },
//     { icon: CheckCircle, label: "Completed Tours", value: "72", color: "green" },
//     { icon: Star, label: "Avg Rating", value: "4.7/5", color: "orange" },
//   ];

//   return (
//     <div className="flex">
//       <Sidebar links={links} />
//       <main className="flex-1 p-6 md:p-8 bg-gray-50 dark:bg-gray-900">
//         <h1 className="text-2xl font-bold mb-6">Guide Dashboard</h1>
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
//           {kpis.map((k) => <StatCard key={k.label} {...k} />)}
//         </div>
//       </main>
//     </div>
//   );
// }







// GuideDashboard.jsx
import { useState, useEffect } from 'react';
import { 
  Calendar, 
  DollarSign, 
  Star, 
  Users, 
  MessageCircle,
  TrendingUp,
  Clock,
  CheckCircle
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const GuideDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const stats = {
    thisMonthEarnings: 25000,
    totalBookings: 45,
    averageRating: 4.9,
    responseRate: 98,
    upcomingTours: 8,
    completedTours: 37
  };

  const upcomingBookings = [
    {
      id: 1,
      travelerName: 'John Doe',
      date: '2024-12-25',
      time: '10:00 AM',
      service: 'Heritage Walking Tour',
      status: 'confirmed',
      price: 800
    },
    {
      id: 2,
      travelerName: 'Sarah Wilson',
      date: '2024-12-26',
      time: '2:00 PM',
      service: 'Food Tour',
      status: 'pending',
      price: 1200
    }
  ];

  const earningsData = [
    { month: 'Jan', amount: 18000 },
    { month: 'Feb', amount: 22000 },
    { month: 'Mar', amount: 25000 },
    { month: 'Apr', amount: 28000 },
    { month: 'May', amount: 24000 },
    { month: 'Jun', amount: 30000 }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Guide Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Manage your tours and grow your business
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <KPICard icon={<DollarSign className="h-12 w-12 text-green-600" />} label="This Month" value={`₹${stats.thisMonthEarnings.toLocaleString()}`} sub={<div className="flex items-center mt-2"><TrendingUp className="h-4 w-4 text-green-600 mr-1" /><span className="text-sm text-green-600">+15% from last month</span></div>} />
          <KPICard icon={<Calendar className="h-12 w-12 text-blue-600" />} label="Total Bookings" value={stats.totalBookings} sub={<div className="flex items-center mt-2"><TrendingUp className="h-4 w-4 text-green-600 mr-1" /><span className="text-sm text-green-600">+8% this month</span></div>} />
          <KPICard icon={<Star className="h-12 w-12 text-yellow-500" />} label="Average Rating" value={stats.averageRating} sub={<div className="flex items-center mt-2"><Star className="h-4 w-4 text-yellow-500 mr-1 fill-current" /><span className="text-sm text-gray-500">From 127 reviews</span></div>} />
          <KPICard icon={<MessageCircle className="h-12 w-12 text-purple-600" />} label="Response Rate" value={`${stats.responseRate}%`} sub={<div className="flex items-center mt-2"><CheckCircle className="h-4 w-4 text-green-600 mr-1" /><span className="text-sm text-green-600">Excellent</span></div>} />
        </div>
        <div className="border-b border-gray-200 mb-8 dark:border-gray-700">
          <nav className="flex space-x-8">
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'bookings', label: 'Bookings' },
              { id: 'calendar', label: 'Calendar' },
              { id: 'messages', label: 'Messages' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === tab.id ? 'border-primary-500 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'}`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <Section title="Upcoming Bookings">
              <div className="space-y-4">
                {upcomingBookings.map((b) => (
                  <div key={b.id} className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 flex items-center justify-between">
                    <div>
                      <p className="font-semibold">{b.service}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{b.date} at {b.time}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{b.travelerName}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900 dark:text-white">
                        ₹{b.price}
                      </p>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${b.status === "confirmed" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}
                      >
                        {b.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </Section>
            <Section title="Earnings Trend">
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={earningsData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`₹${Number(value).toLocaleString()}`, "Earnings"]} />
                    <Line type="monotone" dataKey="amount" stroke="#3B82F6" strokeWidth={2} dot={{ fill: "#3B82F6" }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </Section>
          </div>
          <div className="space-y-6">
            <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6">
              <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <a href="/guides/availability" className="block w-full rounded-xl px-3 py-2 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800">
                  Manage Availability
                </a>
                <a href="/guides/tours/new" className="block w-full rounded-xl px-3 py-2 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800">
                  Create New Tour
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

function KPICard({ icon, label, value, sub }) {
  return (
    <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
            {label}
          </p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">
            {value}
          </p>
          {sub && <div className="mt-2">{sub}</div>}
        </div>
        {icon}
      </div>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
      <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-800 font-semibold">
        {title}
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}