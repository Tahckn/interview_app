import React from 'react';
import { Navigate } from 'react-router-dom';
import { isTokenValid } from 'services/auth';

interface PublicRouteProps {
  children: React.ReactNode;
}

const PublicRoute: React.FC<PublicRouteProps> = ({ children }) => {
  if (isTokenValid()) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default PublicRoute;