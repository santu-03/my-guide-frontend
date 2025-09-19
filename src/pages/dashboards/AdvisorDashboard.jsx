import React, { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "@/components/Layout/DashboardLayout";
import StatCard from "@/components/Layout/StatCard";
import { Card, CardContent } from "@/components/ui/Card";
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
        {metrics.map((metric, i) => (
          <StatCard key={i} {...metric} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Area */}
        <div className="lg:col-span-2 space-y-8">
          {/* Upcoming Travel Plans */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white inline-flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Upcoming Travel Plans
                </h2>
                <Link
                  to="/advisor/plans"
                  className="text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 font-medium"
                >
                  View All
                </Link>
              </div>

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
              </div>
            </CardContent>
          </Card>

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
                  </div>
                </Link>
              </div>
            </CardContent>
          </Card>

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
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
