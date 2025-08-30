// // ProtectedRoute.tsx
// import { Navigate, useLocation } from "react-router-dom";
// import { ReactNode } from "react";
// import { useAuth } from "@/contexts/AuthContext"; // assumes you have AuthContext

// interface ProtectedRouteProps {
//   children: ReactNode;
//   allowedRoles: string[];
// }

// const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
//   const { user } = useAuth();
//   const location = useLocation();

//   if (!user) {
//     // Not logged in → send to login
//     return <Navigate to="/login" state={{ from: location }} replace />;
//   }

//   if (!allowedRoles.includes(user.role)) {
//     // Logged in but not authorized → send to unauthorized page
//     return <Navigate to="/unauthorized" replace />;
//   }

//   // Authorized → render child
//   return <>{children}</>;
// };

// export default ProtectedRoute;

// ProtectedRoute.tsx
import { Navigate, useLocation } from "react-router-dom";
import { ReactNode } from "react";
import { useAuth } from "@/contexts/AuthContext";

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles: string[];
}

const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  // Wait until AuthContext finishes restoring session
  if (loading) {
    return <div>Loading...</div>; // spinner/loader here
  }

  if (!user) {
    // Not logged in → send to login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    // Logged in but not authorized → send to unauthorized page
    return <Navigate to="/unauthorized" replace />;
  }

  // Authorized → render child
  return <>{children}</>;
};

export default ProtectedRoute;
