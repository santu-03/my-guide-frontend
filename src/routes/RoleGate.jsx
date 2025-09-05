// import { Navigate } from 'react-router-dom';
// import { useAuthStore } from '@/store/auth';

// const RoleGate = ({ allowedRoles, children, fallback = '/dashboard' }) => {
//   const user = useAuthStore((state) => state.user);

//   if (!user) {
//     return <Navigate to="/auth/login" replace />;
//   }

//   if (!allowedRoles.includes(user.role)) {
//     return <Navigate to={fallback} replace />;
//   }

//   return children;
// };

// export default RoleGate;







import { Navigate } from 'react-router-dom';
import { useAuthStore } from '@/store/auth';

const RoleGate = ({ allowedRoles = [], children, fallback = '/dashboard' }) => {
  const { user, isLoading } = useAuthStore((state) => ({
    user: state.user,
    isLoading: state.isLoading, // same loading flag
  }));

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Checking access...</div>;
  }

  if (!user) {
    return <Navigate to="/auth/login" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to={fallback} replace />;
  }

  return children;
};

export default RoleGate;
