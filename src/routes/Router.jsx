// // // import { useEffect } from 'react';
// // // import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom';
// // // import { Toaster } from 'react-hot-toast';

// // // import { useAuthStore } from '@/store/auth';
// // // import Layout from '@/components/layout/Layout';
// // // import ProtectedRoute from './ProtectedRoute';
// // // import RoleGate from './RoleGate';

// // // // Pages
// // // import Home from '@/pages/Home';
// // // import Search from '@/pages/Search';
// // // import PlaceDetail from '@/pages/PlaceDetail';
// // // import ActivityDetail from '@/pages/ActivityDetail';
// // // import Login from '@/pages/auth/Login';
// // // import Signup from '@/pages/auth/Signup';

// // // // Dashboards
// // // import TravellerDashboard from '@/pages/dashboards/TravellerDashboard';
// // // import GuideDashboard from '@/pages/dashboards/GuideDashboard';
// // // import InstructorDashboard from '@/pages/dashboards/InstructorDashboard';
// // // import AdvisorDashboard from '@/pages/dashboards/AdvisorDashboard';
// // // import AdminDashboard from '@/pages/dashboards/AdminDashboard';

// // // // Booking
// // // import BookingFlow from '@/pages/BookingFlow';

// // // const Router = () => {
// // //   const initialize = useAuthStore((s) => s.initialize);

// // //   useEffect(() => { initialize(); }, [initialize]);

// // //   return (
// // //     <BrowserRouter>
// // //       <Routes>
// // //         {/* Public */}
// // //         <Route path="/" element={<Layout />}>
// // //           <Route index element={<Home />} />
// // //           <Route path="search" element={<Search />} />
// // //           <Route path="places/:id" element={<PlaceDetail />} />
// // //           <Route path="activities/:id" element={<ActivityDetail />} />
// // //         </Route>

// // //         {/* Auth */}
// // //         <Route path="/auth/login" element={<Login />} />
// // //         <Route path="/auth/signup" element={<Signup />} />

// // //         {/* Dashboards (protected) */}
// // //         <Route path="/dashboard" element={<ProtectedRoute />}>
// // //           <Route index element={<DashboardRedirect />} />
// // //           <Route path="traveller"  element={<RoleGate allowedRoles={['traveller','user']}><TravellerDashboard /></RoleGate>} />
// // //           <Route path="guide"      element={<RoleGate allowedRoles={['guide']}><GuideDashboard /></RoleGate>} />
// // //           <Route path="instructor" element={<RoleGate allowedRoles={['instructor']}><InstructorDashboard /></RoleGate>} />
// // //           <Route path="advisor"    element={<RoleGate allowedRoles={['advisor']}><AdvisorDashboard /></RoleGate>} />
// // //           <Route path="admin"      element={<RoleGate allowedRoles={['admin']}><AdminDashboard /></RoleGate>} />
// // //         </Route>

// // //         {/* Booking (protected) */}
// // //         <Route path="/book" element={<ProtectedRoute />}>
// // //           <Route index element={<BookingFlow />} />
// // //         </Route>

// // //         {/* 404 */}
// // //         <Route path="*" element={<NotFound />} />
// // //       </Routes>

// // //       {/* Toasts */}
// // //       <Toaster
// // //         position="top-right"
// // //         toastOptions={{
// // //           duration: 4000,
// // //           style: { background: '#363636', color: '#fff' },
// // //           success: { duration: 3000, theme: { primary: '#4aed88' } },
// // //         }}
// // //       />
// // //     </BrowserRouter>
// // //   );
// // // };

// // // // Map backend roles -> dashboard route (treat plain "user" as traveller)
// // // const roleToPath = (role) => {
// // //   if (role === 'admin') return 'admin';
// // //   if (['traveller','guide','instructor','advisor'].includes(role)) return role;
// // //   return 'traveller';
// // // };

// // // const DashboardRedirect = () => {
// // //   const user = useAuthStore((s) => s.user);
// // //   if (!user) return <Navigate to="/auth/login" replace />;
// // //   return <Navigate to={`/dashboard/${roleToPath(user.role)}`} replace />;
// // // };

// // // // 404
// // // const NotFound = () => (
// // //   <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
// // //     <div className="max-w-md w-full space-y-8 text-center">
// // //       <h1 className="text-9xl font-bold text-gray-200">404</h1>
// // //       <h2 className="text-3xl font-bold text-gray-900">Page not found</h2>
// // //       <p className="text-gray-600">The page you're looking for doesn't exist.</p>
// // //       <Link
// // //         to="/"
// // //         className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
// // //       >
// // //         Go back home
// // //       </Link>
// // //     </div>
// // //   </div>
// // // );

// // // export default Router;



// Router.jsx
import { Suspense, lazy, useMemo } from "react";
import { BrowserRouter, Routes, Route, Link, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Layout from "@/components/layout/Layout";

/* ---------------- Public pages ---------------- */
const Home = lazy(() => import("@/pages/public/Home"));
const Search = lazy(() => import("@/pages/public/Search"));
const PlaceDetail = lazy(() => import("@/pages/public/PlaceDetail"));
const ActivityDetail = lazy(() => import("@/pages/public/ActivityDetail"));

/* ---------------- Auth ---------------- */
const Login = lazy(() => import("@/pages/auth/Login"));
const Signup = lazy(() => import("@/pages/auth/Signup"));

/* ---------------- Booking ---------------- */
const BookingFlow = lazy(() => import("@/pages/booking/BookingFlow"));

/* ---------------- Dashboards ---------------- */
const TravellerDashboard = lazy(() => import("@/pages/dashboards/TravellerDashboard"));
const GuideDashboard = lazy(() => import("@/pages/dashboards/GuideDashboard"));
const InstructorDashboard = lazy(() => import("@/pages/dashboards/InstructorDashboard"));
const AdvisorDashboard = lazy(() => import("@/pages/dashboards/AdvisorDashboard"));
const AdminDashboard = lazy(() => import("@/pages/admin/AdminDashboard"));

/* ---------------- Admin: Places & Activities ---------------- */
const PlaceList = lazy(() => import("@/pages/admin/PlaceList"));
const PlaceCreate = lazy(() => import("@/pages/admin/PlaceCreate"));
const ActivityList = lazy(() => import("@/pages/admin/ActivityList"));
const ActivityCreate = lazy(() => import("@/pages/admin/ActivityCreate"));

/* ---------------- Helpers ---------------- */
const getRole = () => {
  try {
    return JSON.parse(localStorage.getItem("tg_user"))?.role ?? localStorage.getItem("role");
  } catch {
    return localStorage.getItem("role");
  }
};

const roleToPath = (role) => {
  if (role === "admin") return "/dashboard/admin";
  if (["guide", "instructor", "advisor", "traveller", "user"].includes(role))
    return `/dashboard/${role === "user" ? "traveller" : role}`;
  return "/dashboard/traveller";
};

const DashboardRedirect = () => <Navigate to={roleToPath(getRole())} replace />;

/* Minimal admin guard (swap in your ProtectedRoute/RoleGate later) */
const AdminRoute = ({ children }) => (getRole() === "admin" ? children : <Navigate to="/" replace />);

/* Loading fallbacks */
const Fallback = () => (
  <div className="min-h-[40vh] flex items-center justify-center text-gray-600">Loading…</div>
);

export default function Router() {
  return (
    <BrowserRouter>
      <Suspense fallback={<Fallback />}>
        <Routes>
          {/* Public shell */}
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="search" element={<Search />} />
            {/* Keep these public — your detail pages call these routes & related APIs */}
            <Route path="places/:id" element={<PlaceDetail />} />     {/* :contentReference[oaicite:3]{index=3} */}
            <Route path="activities/:id" element={<ActivityDetail />} /> {/* :contentReference[oaicite:4]{index=4} */}
          </Route>

          {/* Auth */}
          <Route path="/auth/login" element={<Login />} />
          <Route path="/auth/signup" element={<Signup />} />

          {/* Auto role-redirect */}
          <Route path="/dashboard" element={<DashboardRedirect />} />

          {/* Dashboards (you can protect these later if needed) */}
          <Route path="/dashboard/traveller" element={<TravellerDashboard />} />
          <Route path="/dashboard/guide" element={<GuideDashboard />} />
          <Route path="/dashboard/instructor" element={<InstructorDashboard />} />
          <Route path="/dashboard/advisor" element={<AdvisorDashboard />} />
          <Route path="/dashboard/admin" element={<AdminDashboard />} />

          {/* Admin CRUD (guarded) */}
          <Route
            path="/admin/places"
            element={
              <AdminRoute>
                <PlaceList />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/places/new"
            element={
              <AdminRoute>
                <PlaceCreate />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/activities"
            element={
              <AdminRoute>
                <ActivityList />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/activities/new"
            element={
              <AdminRoute>
                <ActivityCreate />
              </AdminRoute>
            }
          />

          {/* Booking */}
          <Route path="/book" element={<BookingFlow />} />

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>

      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: { background: "#363636", color: "#fff" },
          success: { duration: 3000, theme: { primary: "#4aed88" } },
        }}
      />
    </BrowserRouter>
  );
}

function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 text-center">
        <h1 className="text-9xl font-bold text-gray-200">404</h1>
        <h2 className="text-3xl font-bold text-gray-900">Page not found</h2>
        <p className="text-gray-600">The page you're looking for doesn't exist.</p>
        <Link
          to="/"
          className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
        >
          Go back home
        </Link>
      </div>
    </div>
  );
}
