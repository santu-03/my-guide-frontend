import React, { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "@/components/Layout/DashboardLayout";
import StatCard from "@/components/Layout/StatCard";
import { Card, CardContent } from "@/components/ui/Card";
import {
  Users,
  BookOpen,
  Calendar,
  DollarSign,
  Star,
  Clock,
  Award,
  TrendingUp,
  FileText,
  MessageSquare,
  Video
} from "lucide-react";
import { useAuthStore } from "@/store/auth";
import axios from "axios";

export default function InstructorDashboard() {
  const { user } = useAuthStore();

  // 📦 Dashboard data state
  const [courses, setCourses] = useState([]);
  const [upcomingSessions, setUpcomingSessions] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  // ⚙️ Axios instance setup
  const API = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL || "http://localhost:5000/api",
  });

  API.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  });

  // 🔁 Load dashboard data on mount
  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [courseRes, sessionRes, reviewRes] = await Promise.all([
        API.get("/instructor/courses"),
        API.get("/instructor/sessions/upcoming"),
        API.get("/instructor/reviews")
      ]);

      setCourses(courseRes.data?.courses || []);
      setUpcomingSessions(sessionRes.data?.sessions || []);
      setReviews(reviewRes.data?.reviews || []);
    } catch (err) {
      console.error("Failed to load instructor dashboard:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  // 📊 Compute statistics
  const stats = useMemo(() => {
    const activeCourses = courses.filter(c => c.status === 'active');
    const totalStudents = courses.reduce((sum, c) => sum + c.students, 0);
    const completedCourses = courses.filter(c => c.status === 'completed').length;
    const avgRating = reviews.length
      ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
      : '0.0';

    return {
      activeCourses: activeCourses.length,
      totalStudents,
      completedCourses,
      avgRating,
      upcomingSessions: upcomingSessions.length,
      monthlyEarnings: 45000 // 🔧 Replace with API field if needed
    };
  }, [courses, upcomingSessions, reviews]);

  const metrics = [
    {
      icon: BookOpen,
      label: "Active Courses",
      value: stats.activeCourses.toString(),
      trend: { direction: "up", value: "+1 this month" },
      color: "primary"
    },
    {
      icon: Users,
      label: "Total Students",
      value: stats.totalStudents.toString(),
      trend: { direction: "up", value: "+15%" },
      color: "success"
    },
    {
      icon: DollarSign,
      label: "Monthly Earnings",
      value: `₹${stats.monthlyEarnings.toLocaleString()}`,
      trend: { direction: "up", value: "+22%" },
      color: "warning"
    },
    {
      icon: Star,
      label: "Average Rating",
      value: stats.avgRating.toString(),
      color: "neutral"
    },
  ];

  return (
    <DashboardLayout role="instructor" title="Instructor Dashboard" user={user}>
      
      {/* 🔷 Welcome */}
      <div className="mb-8 p-6 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl text-white">
        <h1 className="text-2xl font-bold mb-2">Welcome back, {user?.name}!</h1>
        <p className="opacity-90">Ready to inspire and educate travelers about Kolkata's rich culture?</p>
      </div>

      {/* 🔢 Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
        {metrics.map((metric, i) => (
          <StatCard key={i} {...metric} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* 🔵 Left Panel: Main Content */}
        <div className="lg:col-span-2 space-y-8">

          {/* ⏱ Upcoming Sessions */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white inline-flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Upcoming Sessions
                </h2>
                <Link
                  to="/instructor/schedule"
                  className="text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 font-medium"
                >
                  View Full Schedule
                </Link>
              </div>

              {upcomingSessions.length === 0 ? (
                <div className="text-center py-8">
                  <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    No upcoming sessions
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Schedule your next teaching session
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {upcomingSessions.map((session) => (
                    <div key={session.id} className="flex items-center gap-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                      <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                        <Video className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900 dark:text-white">
                          {session.courseTitle}
                        </h3>
                        <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mt-1">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {new Date(session.date).toLocaleDateString()}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {session.duration}min
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            {session.students} students
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">
                          Start Session
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* 📚 My Courses */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white inline-flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  My Courses
                </h2>
                <Link
                  to="/instructor/courses"
                  className="text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 font-medium"
                >
                  Manage All
                </Link>
              </div>

              <div className="space-y-4">
                {courses.map((course) => (
                  <div key={course.id} className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-medium text-gray-900 dark:text-white">
                        {course.title}
                      </h3>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        course.status === 'active'
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300'
                          : course.status === 'completed'
                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300'
                          : 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300'
                      }`}>
                        {course.status}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          {course.students} students
                        </div>
                        <div className="flex items-center gap-1">
                          <TrendingUp className="h-4 w-4" />
                          {course.progress}% complete
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Link
                          to={`/instructor/courses/${course.id}`}
                          className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400"
                        >
                          View Details
                        </Link>
                      </div>
                    </div>

                    {/* 📈 Progress Bar */}
                    <div className="mt-3">
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${course.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 🟢 Sidebar */}
        <div className="space-y-6">

          {/* ⚡ Quick Actions */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h2>
              {/* Same UI Links */}
              {/* ... */}
            </CardContent>
          </Card>

          {/* 💬 Recent Reviews */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 inline-flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Recent Reviews
              </h2>

              <div className="space-y-4">
                {reviews.map((review, index) => (
                  <div key={index} className="border-l-4 border-blue-500 pl-3">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="flex text-yellow-400">
                        {[...Array(review.rating)].map((_, i) => (
                          <Star key={i} className="h-4 w-4 fill-current" />
                        ))}
                        {[...Array(5 - review.rating)].map((_, i) => (
                          <Star key={i + review.rating} className="h-4 w-4 text-gray-300" />
                        ))}
                      </div>
                      <span className="text-sm text-gray-600 dark:text-gray-400">{review.studentName}</span>
                    </div>
                    <p className="text-sm text-gray-700 dark:text-gray-300 mb-1">
                      {review.comment}
                    </p>
                    <p className="text-xs text-gray-500">
                      Course: {review.courseTitle}
                    </p>
                  </div>
                ))}
              </div>

              <Link
                to="/instructor/reviews"
                className="block text-center text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 font-medium mt-4"
              >
                View All Reviews
              </Link>
            </CardContent>
          </Card>

          {/* 📈 Monthly Performance + Badge */}
          {/* ...same UI... */}
        </div>
      </div>
    </DashboardLayout>
  );
}
