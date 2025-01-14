import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { useEffect } from 'react';

const ProtectedRoute = ({ children, roles = [] }) => {
  const { user, isAuthenticated } = useAuth();
  const location = useLocation();
useEffect(() => {
    if (!isAuthenticated) {
      toast.error('You need to login to access this page', {
        position: 'top-right',
        autoClose: 3000
      });
    }
  }, [isAuthenticated]);
  // Check authentication
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check role authorization
  if (roles.length > 0) {
    const hasRequiredRole = roles.includes(user.user?.role?.toLowerCase());
    console.log(user.user?.role?.toLowerCase());
    if (!hasRequiredRole) {
      toast.error('You are not authorized to access this page', {
        position: 'top-right',
        autoClose: 3000
      });
      return <Navigate to="/dashboard" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;
