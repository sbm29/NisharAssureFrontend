
// import React from 'react';
// import { Navigate, useLocation } from 'react-router-dom';
// import { useAuth } from '@/contexts/AuthContext';
// import { UserRole } from '@/types/user';

// interface ProtectedRouteProps {
//   children: React.ReactNode;
//   allowedRoles?: UserRole[];
// }

// const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
//   children, 
//   allowedRoles = ['admin', 'test_manager', 'test_engineer'] 
// }) => {
//   const { isAuthenticated, user } = useAuth();
//   const location = useLocation();
  
//   if (!isAuthenticated) {
//     // Redirect to login if not authenticated
//     return <Navigate to="/login" state={{ from: location }} replace />;
//   }
  
//   if (user && !allowedRoles.includes(user.role)) {
//     // Redirect to unauthorized page if user doesn't have permissions
//     return <Navigate to="/unauthorized" replace />;
//   }
  
//   return <>{children}</>;
// };

// export default ProtectedRoute;


import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/types/user';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  allowedRoles = ['admin', 'test_manager', 'test_engineer'] 
}) => {
  const { isAuthenticated, user, loading } = useAuth();
  const location = useLocation();
  
  if (loading) {
    return <div className="p-4">Loading...</div>; // You can use a spinner here
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  if (user && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }
  
  return <>{children}</>;
};

export default ProtectedRoute;

