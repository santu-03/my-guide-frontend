// import { Navigate } from "react-router-dom";
// import { useAuthStore } from '@/store/auth';

// const RoleGate = ({ 
//   allowedRoles = [], 
//   children, 
//   fallback = null // Let it auto-redirect based on user's actual role
// }) => {

//   // 🔧 Development bypass - set to false to enable role checking
//   //const DEV_BYPASS = process.env.NODE_ENV === 'development';
//   const DEV_BYPASS = false;
  
//   const { user, isAuthenticated, isLoading } = useAuthStore();

//   // In development, bypass role checking
//   if (DEV_BYPASS) {
//     return children;
//   }

//   // Show loading state
//   if (isLoading) {
//     return (
//       <div className="flex items-center justify-center min-h-screen">
//         <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
//         <span className="ml-2 text-gray-600">Checking access...</span>
//       </div>
//     );
//   }

//   // Redirect to login if not authenticated
//   if (!isAuthenticated || !user) {
//     return <Navigate to="/auth/login" replace />;
//   }

//   // Check if user has required role
//   if (!allowedRoles.includes(user.role)) {
//     // If fallback provided, use it; otherwise redirect to user's appropriate dashboard
//     if (fallback) {
//       return <Navigate to={fallback} replace />;
//     }

//     // Auto-redirect based on user's actual role
//     const roleDashboards = {
//       admin: "/dashboard/admin",
//       advisor: "/dashboard/advisor",
//       guide: "/dashboard/guide", 
//       instructor: "/dashboard/instructor",
//       traveller: "/dashboard/traveller"
//     };
    
//     const redirectPath = roleDashboards[user.role] || "/dashboard/traveller";
//     return <Navigate to={redirectPath} replace />;
//   }

//   return children;
// };

// export default RoleGate;

import { Navigate } from 'react-router-dom';
import { useAuthStore } from '@/store/auth';

const RoleGate = ({ allowedRoles = [], children, fallback = null }) => {
  const DEV_BYPASS = false; // enforce in dev too
  const { user, isAuthenticated, isLoading } = useAuthStore();

  if (DEV_BYPASS) return children;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600" />
        <span className="ml-2 text-gray-600">Checking access...</span>
      </div>
    );
  }

  if (!isAuthenticated || !user) return <Navigate to="/auth/login" replace />;

  if (!allowedRoles.includes(user.role)) {
    const roleDashboards = {
      admin: "/dashboard/admin",
      advisor: "/dashboard/advisor",
      guide: "/dashboard/guide",
      instructor: "/dashboard/instructor",
      traveller: "/dashboard/traveller",
    };
    const redirectPath = fallback || roleDashboards[user.role] || "/dashboard/traveller";
    return <Navigate to={redirectPath} replace />;
  }

  return children;
};

export default RoleGate;