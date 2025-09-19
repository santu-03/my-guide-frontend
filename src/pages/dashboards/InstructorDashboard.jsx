<<<<<<< HEAD
import React, { useEffect, useState, useMemo } from "react";
=======
// import React, { useMemo } from "react";
// import DashboardLayout from "@/components/Layout/DashboardLayout";
// import StatCard from "@/components/Layout/StatCard";
// import { ClipboardList, Calendar, Users, ThumbsUp, BookOpen } from "lucide-react";

// const sessions = [
//   { id: "s1", title: "Beginner Photography Walk", date: "2025-09-18", enrolled: 5 },
//   { id: "s2", title: "City Cycling Basics", date: "2025-09-24", enrolled: 8 },
//   { id: "s3", title: "Weekend Kayaking 101", date: "2025-10-02", enrolled: 10 },
// ];

// export default function InstructorDashboard() {
//   const user = { name: "Instructor User", role: "instructor", avatar: "/default-avatar.png" };

//   const metrics = useMemo(
//     () => [
//       { icon: ClipboardList, label: "Total Activities", value: "32" },
//       { icon: Calendar,      label: "Upcoming Sessions", value: "7", subtle: true },
//       { icon: Users,         label: "Enrolled Users", value: "240", trend: { direction: "up", value: "+12%" } },
//       { icon: ThumbsUp,      label: "Avg Feedback", value: "4.6 / 5" },
//     ],
//     []
//   );

//   return (
//     <DashboardLayout role="instructor" title="Home" user={user}>
//       <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
//         {metrics.map((m, i) => <StatCard key={i} {...m} />)}
//       </div>

//       <section className="mt-6 bg-white dark:bg-gray-800 rounded-2xl shadow-sm ring-1 ring-gray-200/70 dark:ring-gray-800/70 p-5">
//         <h2 className="text-base font-semibold text-gray-900 dark:text-white mb-4 inline-flex items-center gap-2">
//           <BookOpen className="h-5 w-5" /> Upcoming Sessions
//         </h2>
//         {sessions.length ? (
//           <ul className="divide-y divide-gray-100 dark:divide-gray-700">
//             {sessions.map((s) => (
//               <li key={s.id} className="py-4 flex items-center justify-between">
//                 <div>
//                   <div className="font-medium text-gray-900 dark:text-white">{s.title}</div>
//                   <div className="text-xs text-gray-500">{new Date(s.date).toLocaleDateString()}</div>
//                 </div>
//                 <div className="text-sm text-gray-600 dark:text-gray-300">{s.enrolled} enrolled</div>
//               </li>
//             ))}
//           </ul>
//         ) : (
//           <div className="text-sm text-gray-500">No sessions scheduled.</div>
//         )}
//       </section>
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
  BookOpen,
=======
import { 
  Users, 
  BookOpen, 
>>>>>>> 4aaf08ad57bfe341382432d957ec3746b55e0cd0
  Calendar,
  DollarSign,
  Star,
  Clock,
  Award,
<<<<<<< HEAD
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

=======
  Play,
  FileText,
  MessageSquare,
  TrendingUp,
  Video
} from "lucide-react";
import { useSampleDataStore } from "@/store/sampleData";
import { useAuthStore } from "@/store/auth";

export default function InstructorDashboard() {
  const { user } = useAuthStore();
  const { activities } = useSampleDataStore();
  
  // Mock instructor-specific data
  const instructorData = useMemo(() => {
    return {
      courses: [
        { id: 1, title: "Photography Basics in Kolkata", students: 24, status: 'active', progress: 75 },
        { id: 2, title: "Street Food Culture Workshop", students: 18, status: 'active', progress: 60 },
        { id: 3, title: "Heritage Architecture Tour Guide", students: 15, status: 'completed', progress: 100 },
        { id: 4, title: "Bengali Language for Tourists", students: 12, status: 'draft', progress: 30 }
      ],
      upcomingSessions: [
        { id: 1, courseTitle: "Photography Basics in Kolkata", date: new Date(Date.now() + 24 * 60 * 60 * 1000), duration: 120, students: 12 },
        { id: 2, courseTitle: "Street Food Culture Workshop", date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), duration: 90, students: 8 },
        { id: 3, courseTitle: "Heritage Architecture Tour Guide", date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), duration: 180, students: 15 }
      ],
      recentReviews: [
        { studentName: "Priya S.", rating: 5, comment: "Excellent photography course! Learned so much about capturing Kolkata's essence.", courseTitle: "Photography Basics" },
        { studentName: "Raj M.", rating: 5, comment: "Amazing insights into street food culture. Very engaging instructor!", courseTitle: "Street Food Culture" },
        { studentName: "Maria L.", rating: 4, comment: "Great content but could use more hands-on practice sessions.", courseTitle: "Heritage Architecture" }
      ]
    };
  }, []);

  // Calculate stats
  const stats = useMemo(() => {
    const activeCourses = instructorData.courses.filter(c => c.status === 'active');
    const totalStudents = instructorData.courses.reduce((sum, c) => sum + c.students, 0);
    const completedCourses = instructorData.courses.filter(c => c.status === 'completed').length;
    const avgRating = 4.7; // Mock average rating
    
>>>>>>> 4aaf08ad57bfe341382432d957ec3746b55e0cd0
    return {
      activeCourses: activeCourses.length,
      totalStudents,
      completedCourses,
      avgRating,
<<<<<<< HEAD
      upcomingSessions: upcomingSessions.length,
      monthlyEarnings: 45000 // 🔧 Replace with API field if needed
    };
  }, [courses, upcomingSessions, reviews]);

  const metrics = [
    {
      icon: BookOpen,
      label: "Active Courses",
=======
      upcomingSessions: instructorData.upcomingSessions.length,
      monthlyEarnings: 45000 // Mock earnings
    };
  }, [instructorData]);

  const metrics = [
    { 
      icon: BookOpen, 
      label: "Active Courses", 
>>>>>>> 4aaf08ad57bfe341382432d957ec3746b55e0cd0
      value: stats.activeCourses.toString(),
      trend: { direction: "up", value: "+1 this month" },
      color: "primary"
    },
<<<<<<< HEAD
    {
      icon: Users,
      label: "Total Students",
=======
    { 
      icon: Users, 
      label: "Total Students", 
>>>>>>> 4aaf08ad57bfe341382432d957ec3746b55e0cd0
      value: stats.totalStudents.toString(),
      trend: { direction: "up", value: "+15%" },
      color: "success"
    },
<<<<<<< HEAD
    {
      icon: DollarSign,
      label: "Monthly Earnings",
=======
    { 
      icon: DollarSign, 
      label: "Monthly Earnings", 
>>>>>>> 4aaf08ad57bfe341382432d957ec3746b55e0cd0
      value: `₹${stats.monthlyEarnings.toLocaleString()}`,
      trend: { direction: "up", value: "+22%" },
      color: "warning"
    },
<<<<<<< HEAD
    {
      icon: Star,
      label: "Average Rating",
=======
    { 
      icon: Star, 
      label: "Average Rating", 
>>>>>>> 4aaf08ad57bfe341382432d957ec3746b55e0cd0
      value: stats.avgRating.toString(),
      color: "neutral"
    },
  ];

  return (
    <DashboardLayout role="instructor" title="Instructor Dashboard" user={user}>
      
<<<<<<< HEAD
      {/* 🔷 Welcome */}
=======
      {/* Welcome Section */}
>>>>>>> 4aaf08ad57bfe341382432d957ec3746b55e0cd0
      <div className="mb-8 p-6 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl text-white">
        <h1 className="text-2xl font-bold mb-2">Welcome back, {user?.name}!</h1>
        <p className="opacity-90">Ready to inspire and educate travelers about Kolkata's rich culture?</p>
      </div>

<<<<<<< HEAD
      {/* 🔢 Stats Grid */}
=======
      {/* Stats Grid */}
>>>>>>> 4aaf08ad57bfe341382432d957ec3746b55e0cd0
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
        {metrics.map((metric, i) => (
          <StatCard key={i} {...metric} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
<<<<<<< HEAD
        {/* 🔵 Left Panel: Main Content */}
        <div className="lg:col-span-2 space-y-8">

          {/* ⏱ Upcoming Sessions */}
=======
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Upcoming Sessions */}
>>>>>>> 4aaf08ad57bfe341382432d957ec3746b55e0cd0
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white inline-flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Upcoming Sessions
                </h2>
<<<<<<< HEAD
                <Link
                  to="/instructor/schedule"
=======
                <Link 
                  to="/instructor/schedule" 
>>>>>>> 4aaf08ad57bfe341382432d957ec3746b55e0cd0
                  className="text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 font-medium"
                >
                  View Full Schedule
                </Link>
              </div>
<<<<<<< HEAD

              {upcomingSessions.length === 0 ? (
=======
              
              {instructorData.upcomingSessions.length === 0 ? (
>>>>>>> 4aaf08ad57bfe341382432d957ec3746b55e0cd0
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
<<<<<<< HEAD
                  {upcomingSessions.map((session) => (
=======
                  {instructorData.upcomingSessions.map((session) => (
>>>>>>> 4aaf08ad57bfe341382432d957ec3746b55e0cd0
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
<<<<<<< HEAD
                            {new Date(session.date).toLocaleDateString()}
=======
                            {session.date.toLocaleDateString()}
>>>>>>> 4aaf08ad57bfe341382432d957ec3746b55e0cd0
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

<<<<<<< HEAD
          {/* 📚 My Courses */}
=======
          {/* My Courses */}
>>>>>>> 4aaf08ad57bfe341382432d957ec3746b55e0cd0
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white inline-flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  My Courses
                </h2>
<<<<<<< HEAD
                <Link
                  to="/instructor/courses"
=======
                <Link 
                  to="/instructor/courses" 
>>>>>>> 4aaf08ad57bfe341382432d957ec3746b55e0cd0
                  className="text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 font-medium"
                >
                  Manage All
                </Link>
              </div>
<<<<<<< HEAD

              <div className="space-y-4">
                {courses.map((course) => (
=======
              
              <div className="space-y-4">
                {instructorData.courses.map((course) => (
>>>>>>> 4aaf08ad57bfe341382432d957ec3746b55e0cd0
                  <div key={course.id} className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-medium text-gray-900 dark:text-white">
                        {course.title}
                      </h3>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
<<<<<<< HEAD
                        course.status === 'active'
=======
                        course.status === 'active' 
>>>>>>> 4aaf08ad57bfe341382432d957ec3746b55e0cd0
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300'
                          : course.status === 'completed'
                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300'
                          : 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300'
                      }`}>
                        {course.status}
                      </span>
                    </div>
<<<<<<< HEAD

=======
                    
>>>>>>> 4aaf08ad57bfe341382432d957ec3746b55e0cd0
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
<<<<<<< HEAD
                        <Link
=======
                        <Link 
>>>>>>> 4aaf08ad57bfe341382432d957ec3746b55e0cd0
                          to={`/instructor/courses/${course.id}`}
                          className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400"
                        >
                          View Details
                        </Link>
                      </div>
                    </div>
<<<<<<< HEAD

                    {/* 📈 Progress Bar */}
                    <div className="mt-3">
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div
=======
                    
                    {/* Progress Bar */}
                    <div className="mt-3">
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div 
>>>>>>> 4aaf08ad57bfe341382432d957ec3746b55e0cd0
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

<<<<<<< HEAD
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
=======
        {/* Sidebar */}
        <div className="space-y-6">
          
          {/* Quick Actions */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h2>
              
              <div className="space-y-3">
                <Link 
                  to="/instructor/courses/new"
                  className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                >
                  <div className="w-10 h-10 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
                    <BookOpen className="h-5 w-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">Create Course</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Add new course content</div>
                  </div>
                </Link>
                
                <Link 
                  to="/instructor/students"
                  className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                >
                  <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                    <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">View Students</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Manage enrollments</div>
                  </div>
                </Link>
                
                <Link 
                  to="/instructor/materials"
                  className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                >
                  <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
                    <FileText className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">Course Materials</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Upload resources</div>
                  </div>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Recent Reviews */}
>>>>>>> 4aaf08ad57bfe341382432d957ec3746b55e0cd0
          <Card>
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 inline-flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Recent Reviews
              </h2>
<<<<<<< HEAD

              <div className="space-y-4">
                {reviews.map((review, index) => (
=======
              
              <div className="space-y-4">
                {instructorData.recentReviews.map((review, index) => (
>>>>>>> 4aaf08ad57bfe341382432d957ec3746b55e0cd0
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
<<<<<<< HEAD

              <Link
                to="/instructor/reviews"
=======
              
              <Link 
                to="/instructor/reviews" 
>>>>>>> 4aaf08ad57bfe341382432d957ec3746b55e0cd0
                className="block text-center text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 font-medium mt-4"
              >
                View All Reviews
              </Link>
            </CardContent>
          </Card>

<<<<<<< HEAD
          {/* 📈 Monthly Performance + Badge */}
          {/* ...same UI... */}
=======
          {/* This Month Performance */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">This Month</h2>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">Sessions Completed</span>
                  <span className="font-semibold text-gray-900 dark:text-white">18</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">New Enrollments</span>
                  <span className="font-semibold text-gray-900 dark:text-white">32</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">Course Completion Rate</span>
                  <span className="font-semibold text-gray-900 dark:text-white">87%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">Student Satisfaction</span>
                  <span className="font-semibold text-gray-900 dark:text-white">4.7/5</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Achievement Badge */}
          <Card className="border-l-4 border-green-500 bg-green-50 dark:bg-green-900/10">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Award className="h-8 w-8 text-green-600" />
                <div>
                  <h3 className="font-semibold text-green-800 dark:text-green-200">Expert Instructor</h3>
                  <p className="text-sm text-green-700 dark:text-green-300">
                    50+ students completed your courses this quarter!
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
>>>>>>> 4aaf08ad57bfe341382432d957ec3746b55e0cd0
        </div>
      </div>
    </DashboardLayout>
  );
<<<<<<< HEAD
}
=======
}
>>>>>>> 4aaf08ad57bfe341382432d957ec3746b55e0cd0
