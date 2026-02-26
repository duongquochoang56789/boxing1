import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { BrandedLoader } from '@/components/ui/branded-loader';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

const ProtectedRoute = React.forwardRef<HTMLDivElement, ProtectedRouteProps>(
  ({ children, requireAdmin = false }, ref) => {
    const { user, loading, isAdmin } = useAuth();
    const location = useLocation();

    if (loading) {
      return <BrandedLoader variant="page" />;
    }

    if (!user) {
      return <Navigate to="/auth" state={{ from: location }} replace />;
    }

    if (requireAdmin && !isAdmin) {
      return <Navigate to="/dashboard" replace />;
    }

    return <div ref={ref}>{children}</div>;
  }
);

ProtectedRoute.displayName = 'ProtectedRoute';

export default ProtectedRoute;
