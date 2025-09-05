// import { Navigate, Outlet, useLocation } from 'react-router-dom';
// import { useAuthStore } from '@/store/auth';

// const ProtectedRoute = ({ children }) => {
//   const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
//   const location = useLocation();

//   if (!isAuthenticated) {
//     return <Navigate to="/auth/login" state={{ from: location }} replace />;
//   }

//   return children || <Outlet />;
// };

// export default ProtectedRoute;





import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/store/auth';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuthStore((state) => ({
    isAuthenticated: state.isAuthenticated,
    isLoading: state.isLoading, // add this to your auth store
  }));
  const location = useLocation();

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  return children || <Outlet />;
};

export default ProtectedRoute;
