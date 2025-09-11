import { Navigate } from "react-router-dom";

const RoleGate = ({ allowedRoles = [], children, fallback = "/dashboard/traveller" }) => {
  // 🔧 Development bypass - set to true to disable role checking
  const DEV_BYPASS = true;
  
  if (DEV_BYPASS) {
    return children;
  }

  const isLoading = false;
  const user = { role: "traveller" };

  if (isLoading) return <div className="flex items-center justify-center min-h-screen">Checking access…</div>;
  if (!user) return <Navigate to="/auth/login" replace />;
  if (!allowedRoles.includes(user.role)) return <Navigate to={fallback} replace />;
  return children;
};

export default RoleGate;