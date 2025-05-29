
import React from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate, useLocation } from 'react-router-dom';

interface MainLayoutProps {
  children: React.ReactNode;
  requiredRoles?: Array<'admin' | 'test_manager' | 'test_engineer'>;
}

const MainLayout: React.FC<MainLayoutProps> = ({ 
  children, 
  requiredRoles = ['admin', 'test_manager', 'test_engineer']
}) => {
  const { isAuthenticated, hasPermission } = useAuth();
  const location = useLocation();
  
  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  // Check if user has required permissions
  if (!hasPermission(requiredRoles)) {
    return <Navigate to="/unauthorized" replace />;
  }
  
  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
