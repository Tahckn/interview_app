import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAppSelector } from 'hooks/reduxHooks';

interface ProtectedRouteProps {
  children: React.ReactNode; // The component(s) that will be rendered inside the protected route.
  requiredRole?: string; // Optional prop for role-based access control.
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiredRole }) => {
  // Get authentication state and roles from the Redux store using a custom hook.
  const { isAuthenticated, roles } = useAppSelector(state => state.auth);

  // If the user is not authenticated, redirect them to the login page.
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // If the route requires a specific role and the user doesn't have it, redirect them to an unauthorized page.
  if (requiredRole && !roles.includes(requiredRole)) {
    return <Navigate to="/unauthorized" replace />;
  }

  // If the user is authenticated and has the required role (if any), render the child components.
  return <>{children}</>;
};

export default ProtectedRoute;