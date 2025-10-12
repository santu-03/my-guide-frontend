// import { Navigate, Outlet, useLocation } from 'react-router-dom';
// import { useAuthStore } from '@/store/auth';

// const ProtectedRoute = ({ children }) => {

//   // 🔧 Development bypass - set to false to enable protection
//   //const DEV_BYPASS = process.env.NODE_ENV === 'development';
//   const DEV_BYPASS = false
  
//   const { isAuthenticated, user, isLoading } = useAuthStore();
//   const location = useLocation();

//   // In development, bypass protection
//   if (DEV_BYPASS) {
//     return children || <Outlet />;
//   }

//   // Show loading state while auth is being determined
//   if (isLoading) {
//     return (
//       <div className="flex items-center justify-center min-h-screen">
//         <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
//         <span className="ml-2 text-gray-600">Loading...</span>
//       </div>
//     );
//   }

//   // Redirect to login if not authenticated
//   if (!isAuthenticated || !user) {
//     return <Navigate to="/auth/login" state={{ from: location }} replace />;
//   }

//   return children || <Outlet />;
// };

// export default ProtectedRoute;

import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/store/auth';

const ProtectedRoute = ({ children }) => {
  const DEV_BYPASS = false; // enforce in dev too
  const { isAuthenticated, user, isLoading } = useAuthStore();
  const location = useLocation();

  if (DEV_BYPASS) return children || <Outlet />;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600" />
        <span className="ml-2 text-gray-600">Loading...</span>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  return children || <Outlet />;
};

export default ProtectedRoute;