// import { useEffect } from 'react';
// import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom';
// import { Toaster } from 'react-hot-toast';

// import { useAuthStore } from '@/store/auth';
// import Layout from '@/components/layout/Layout';
// import ProtectedRoute from './ProtectedRoute';
// import RoleGate from './RoleGate';

// // Pages
// import Home from '@/pages/Home';
// import Search from '@/pages/Search';
// import PlaceDetail from '@/pages/PlaceDetail';
// import ActivityDetail from '@/pages/ActivityDetail';
// import Login from '@/pages/auth/Login';
// import Signup from '@/pages/auth/Signup';

// // Dashboards
// import TravellerDashboard from '@/pages/dashboards/TravellerDashboard';
// import GuideDashboard from '@/pages/dashboards/GuideDashboard';
// import InstructorDashboard from '@/pages/dashboards/InstructorDashboard';
// import AdvisorDashboard from '@/pages/dashboards/AdvisorDashboard';
// import AdminDashboard from '@/pages/dashboards/AdminDashboard';

// // Booking
// import BookingFlow from '@/pages/BookingFlow';

// const Router = () => {
//   const initialize = useAuthStore((s) => s.initialize);

//   useEffect(() => { initialize(); }, [initialize]);

//   return (
//     <BrowserRouter>
//       <Routes>
//         {/* Public */}
//         <Route path="/" element={<Layout />}>
//           <Route index element={<Home />} />
//           <Route path="search" element={<Search />} />
//           <Route path="places/:id" element={<PlaceDetail />} />
//           <Route path="activities/:id" element={<ActivityDetail />} />
//         </Route>

//         {/* Auth */}
//         <Route path="/auth/login" element={<Login />} />
//         <Route path="/auth/signup" element={<Signup />} />

//         {/* Dashboards (protected) */}
//         <Route path="/dashboard" element={<ProtectedRoute />}>
//           <Route index element={<DashboardRedirect />} />
//           <Route path="traveller"  element={<RoleGate allowedRoles={['traveller','user']}><TravellerDashboard /></RoleGate>} />
//           <Route path="guide"      element={<RoleGate allowedRoles={['guide']}><GuideDashboard /></RoleGate>} />
//           <Route path="instructor" element={<RoleGate allowedRoles={['instructor']}><InstructorDashboard /></RoleGate>} />
//           <Route path="advisor"    element={<RoleGate allowedRoles={['advisor']}><AdvisorDashboard /></RoleGate>} />
//           <Route path="admin"      element={<RoleGate allowedRoles={['admin']}><AdminDashboard /></RoleGate>} />
//         </Route>

//         {/* Booking (protected) */}
//         <Route path="/book" element={<ProtectedRoute />}>
//           <Route index element={<BookingFlow />} />
//         </Route>

//         {/* 404 */}
//         <Route path="*" element={<NotFound />} />
//       </Routes>

//       {/* Toasts */}
//       <Toaster
//         position="top-right"
//         toastOptions={{
//           duration: 4000,
//           style: { background: '#363636', color: '#fff' },
//           success: { duration: 3000, theme: { primary: '#4aed88' } },
//         }}
//       />
//     </BrowserRouter>
//   );
// };

// // Map backend roles -> dashboard route (treat plain "user" as traveller)
// const roleToPath = (role) => {
//   if (role === 'admin') return 'admin';
//   if (['traveller','guide','instructor','advisor'].includes(role)) return role;
//   return 'traveller';
// };

// const DashboardRedirect = () => {
//   const user = useAuthStore((s) => s.user);
//   if (!user) return <Navigate to="/auth/login" replace />;
//   return <Navigate to={`/dashboard/${roleToPath(user.role)}`} replace />;
// };

// // 404
// const NotFound = () => (
//   <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
//     <div className="max-w-md w-full space-y-8 text-center">
//       <h1 className="text-9xl font-bold text-gray-200">404</h1>
//       <h2 className="text-3xl font-bold text-gray-900">Page not found</h2>
//       <p className="text-gray-600">The page you're looking for doesn't exist.</p>
//       <Link
//         to="/"
//         className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
//       >
//         Go back home
//       </Link>
//     </div>
//   </div>
// );

// export default Router;

























// import { useEffect } from 'react';
// import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
// import { Toaster } from 'react-hot-toast';

// import { useAuthStore } from '@/store/auth';
// import Layout from '@/components/layout/Layout';

// // Pages
// import Home from '@/pages/Home';
// import Search from '@/pages/Search';
// import PlaceDetail from '@/pages/PlaceDetail';
// import ActivityDetail from '@/pages/ActivityDetail';
// import Login from '@/pages/auth/Login';
// import Signup from '@/pages/auth/Signup';

// // Dashboards
// import TravellerDashboard from '@/pages/dashboards/TravellerDashboard';
// import GuideDashboard from '@/pages/dashboards/GuideDashboard';
// import InstructorDashboard from '@/pages/dashboards/InstructorDashboard';
// import AdvisorDashboard from '@/pages/dashboards/AdvisorDashboard';
// import AdminDashboard from '@/pages/dashboards/AdminDashboard';

// // Booking
// import BookingFlow from '@/pages/BookingFlow';

// const Router = () => {
//   const initialize = useAuthStore((s) => s.initialize);

//   useEffect(() => { initialize(); }, [initialize]);

//   return (
//     <BrowserRouter>
//       <Routes>
//         {/* Public */}
//         <Route path="/" element={<Layout />}>
//           <Route index element={<Home />} />
//           {/* <Route path="search" element={<Search />} /> */}
//           <Route path="places/:id" element={<PlaceDetail />} />
//           <Route path="activities/:id" element={<ActivityDetail />} />
//         </Route>

//         {/* Auth */}
//         <Route path="/auth/login" element={<Login />} />
//         <Route path="/auth/signup" element={<Signup />} />

//         {/* Dashboards (now public) */}
//         <Route path="/dashboard/traveller" element={<TravellerDashboard />} />
//         <Route path="/dashboard/guide" element={<GuideDashboard />} />
//         <Route path="/dashboard/instructor" element={<InstructorDashboard />} />
//         <Route path="/dashboard/advisor" element={<AdvisorDashboard />} />
//         <Route path="/dashboard/admin" element={<AdminDashboard />} />

//         {/* Booking (now public) */}
//         <Route path="/book" element={<BookingFlow />} />

//         {/* 404 */}
//         <Route path="*" element={<NotFound />} />
//       </Routes>

//       {/* Toasts */}
//       <Toaster
//         position="top-right"
//         toastOptions={{
//           duration: 4000,
//           style: { background: '#363636', color: '#fff' },
//           success: { duration: 3000, theme: { primary: '#4aed88' } },
//         }}
//       />
//     </BrowserRouter>
//   );
// };

// // 404
// const NotFound = () => (
//   <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
//     <div className="max-w-md w-full space-y-8 text-center">
//       <h1 className="text-9xl font-bold text-gray-200">404</h1>
//       <h2 className="text-3xl font-bold text-gray-900">Page not found</h2>
//       <p className="text-gray-600">The page you're looking for doesn't exist.</p>
//       <Link
//         to="/"
//         className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
//       >
//         Go back home
//       </Link>
//     </div>
//   </div>
// );

// export default Router;






//update------
import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import { useAuthStore } from '@/store/auth';
import Layout from '@/components/layout/Layout';

// Pages
import Home from '@/pages/Home';
import Search from '@/pages/Search';
import PlaceDetail from '@/pages/PlaceDetail';
import ActivityDetail from '@/pages/ActivityDetail';
import Login from '@/pages/auth/Login';
import Signup from '@/pages/auth/Signup';

// Dashboards
import TravellerDashboard from '@/pages/dashboards/TravellerDashboard';
import GuideDashboard from '@/pages/dashboards/GuideDashboard';
import InstructorDashboard from '@/pages/dashboards/InstructorDashboard';
import AdvisorDashboard from '@/pages/dashboards/AdvisorDashboard';
import AdminDashboard from '@/pages/dashboards/AdminDashboard';

// Booking
import BookingFlow from '@/pages/BookingFlow';

const Router = () => {
  const initialize = useAuthStore((s) => s.initialize);
  const user = useAuthStore((s) => s.user);

  useEffect(() => { initialize(); }, [initialize]);

  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          {/* <Route path="search" element={<Search />} /> */}
          <Route path="places/:id" element={<PlaceDetail />} />
          <Route path="activities/:id" element={<ActivityDetail />} />
        </Route>

        {/* Auth */}
        <Route path="/auth/login" element={<Login />} />
        <Route path="/auth/signup" element={<Signup />} />

        {/* Dashboards (protected) */}
        <Route
          path="/dashboard/traveller"
          element={
            user?.role === "traveller" ? (
              <TravellerDashboard />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
        <Route
          path="/dashboard/guide"
          element={
            user?.role === "guide" ? (
              <GuideDashboard />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
        <Route
          path="/dashboard/instructor"
          element={
            user?.role === "instructor" ? (
              <InstructorDashboard />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
        <Route
          path="/dashboard/advisor"
          element={
            user?.role === "advisor" ? (
              <AdvisorDashboard />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
        <Route
          path="/dashboard/admin"
          element={
            user?.role === "admin" ? (
              <AdminDashboard />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />

        {/* Booking (public) */}
        <Route path="/book" element={<BookingFlow />} />

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>

      {/* Toasts */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: { background: '#363636', color: '#fff' },
          success: { duration: 3000, theme: { primary: '#4aed88' } },
        }}
      />
    </BrowserRouter>
  );
};

// 404 Page
const NotFound = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div className="max-w-md w-full space-y-8 text-center">
      <h1 className="text-9xl font-bold text-gray-200">404</h1>
      <h2 className="text-3xl font-bold text-gray-900">Page not found</h2>
      <p className="text-gray-600">The page you're looking for doesn't exist.</p>
      <Link
        to="/"
        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
      >
        Go back home
      </Link>
    </div>
  </div>
);

export default Router;
