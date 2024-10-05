import React from 'react';
import { Navigate } from 'react-router-dom';
import { isTokenValid } from 'services/auth';

interface PublicRouteProps {
  children: React.ReactNode; // The component(s) that will be rendered if the route is public.
}

const PublicRoute: React.FC<PublicRouteProps> = ({ children }) => {
  // If a valid token exists, the user is authenticated and should be redirected to the home page ("/").
  if (isTokenValid()) {
    return <Navigate to="/" replace />;
  }

  // If no valid token exists (user is not authenticated), render the children components (public content).
  return <>{children}</>;
};

export default PublicRoute;