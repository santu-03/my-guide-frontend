import React, { useEffect, useState, useMemo } from "react";
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
  Award,
} from "lucide-react";
import { useAuthStore } from "@/store/auth";
import axios from "axios";

export default function GuideDashboard() {
  const { user } = useAuthStore();

  // 📦 Local state
  const [activities, setActivities] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);

  // ⚙️ Setup Axios instance with token
  const API = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL || "http://localhost:5000/api",
  });

  API.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  });

  // 📡 Fetch guide-specific data
  const loadGuideDashboard = async () => {
    setLoading(true);
    try {
      const [activityRes, bookingRes, placeRes] = await Promise.all([
        API.get("/guide/activities"),
        API.get("/guide/bookings"),
        API.get("/places"),
      ]);

      setActivities(activityRes.data?.activities || []);
      setBookings(bookingRes.data?.bookings || []);
      setPlaces(placeRes.data?.places || []);
    } catch (err) {
      console.error("Error loading guide dashboard data", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGuideDashboard();
  }, []);

  // 📊 Stats logic
  const stats = useMemo(() => {
    const now = new Date();
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const monthlyBookings = bookings.filter(b => new Date(b.createdAt) >= thisMonth);
    const earnings = bookings.reduce((sum, b) => sum + (b.totalAmount * 0.7), 0);
    const upcoming = bookings.filter(b => new Date(b.bookingDate) > now);

    return {
      totalTours: activities.length,
      upcomingTours: upcoming.length,
      monthlyBookings: monthlyBookings.length,
      totalEarnings: Math.round(earnings),
    };
  }, [activities, bookings]);

  const metrics = [
    {
      icon: Users,
      label: "Upcoming Tours",
      value: stats.upcomingTours.toString(),
      trend: { direction: "up", value: "+3 this week" },
      color: "primary",
    },
    {
      icon: Calendar,
      label: "Tours This Month",
      value: stats.monthlyBookings.toString(),
      trend: { direction: "up", value: "+12%" },
      color: "success",
    },
    {
      icon: DollarSign,
      label: "Total Earnings",
      value: `₹${stats.totalEarnings.toLocaleString()}`,
      trend: { direction: "up", value: "+8%" },
      color: "warning",
    },
    {
      icon: Star,
      label: "Average Rating",
      value: "4.8",
      color: "neutral",
    },
  ];

  // 🎒 Upcoming tours with activity + place info
  const upcomingTours = useMemo(() => {
    const now = new Date();
    return bookings
      .filter(b => new Date(b.bookingDate) > now)
      .sort((a, b) => new Date(a.bookingDate) - new Date(b.bookingDate))
      .slice(0, 4)
      .map(booking => {
        const activity = activities.find(a => a.id === booking.activityId);
        const place = activity ? places.find(p => p.id === activity.placeId) : null;
        return { ...booking, activity, place };
      });
  }, [bookings, activities, places]);

  return (
    <DashboardLayout role="guide" title="Guide Dashboard" user={user}>
      {/* 🌄 Welcome Banner */}
      <div className="mb-8 p-6 bg-gradient-to-r from-green-600 to-teal-600 rounded-2xl text-white">
        <h1 className="text-2xl font-bold mb-2">Welcome, {user?.name}!</h1>
        <p className="opacity-90">Ready to share amazing experiences with travelers today?</p>
      </div>

      {/* 📊 Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
        {metrics.map((metric, i) => (
          <StatCard key={i} {...metric} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* 📍 Left Main Area */}
        <div className="lg:col-span-2 space-y-8">
          {/* 🧭 Upcoming Tours */}
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
                  <p className="text-gray-600 dark:text-gray-400">Your schedule is clear for now</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {upcomingTours.map(tour => (
                    <div
                      key={tour.id}
                      className="flex items-center gap-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
                    >
                      {tour.activity?.images?.[0] && (
                        <img
                          src={tour.activity.images[0]}
                          alt={tour.activity.title}
                          className="w-16 h-16 rounded-lg object-cover"
                        />
                      )}
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900 dark:text-white">
                          {tour.activity?.title || "Tour Activity"}
                        </h3>
                        <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mt-1">
                          <div className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            {tour.place?.name || "Location"}
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

          {/* 🎯 Activity Performance (unchanged) */}
          {/* You can replace avgRating with backend logic if needed later */}
        </div>

        {/* Sidebar and other cards – unchanged, UI only */}
        {/* You can refactor testimonials in future if you need them to be dynamic */}
        {/* ⚡ Right Sidebar for Guide */}
<div className="space-y-8">
  <Card>
    <CardContent className="p-6 space-y-4">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white">⚡ Quick Actions</h2>

      <div className="space-y-2">
        <Link to="/guide/activities/create" className="quick-action-btn">➕ Create New Activity</Link>
        <Link to="/guide/bookings" className="quick-action-btn">📅 View Bookings</Link>
        <Link to="/guide/clients" className="quick-action-btn">👥 View Clients</Link>
        <Link to="/guide/profile" className="quick-action-btn">🧑‍💼 Edit Profile</Link>
      </div>
    </CardContent>
  </Card>
</div>

      </div>
    </DashboardLayout>
  );
}
