import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useEnterpriseAuth } from '@/contexts/EnterpriseAuthContext';
import { UserRole } from '@/data/usersData';
import { Shield, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
  requireAuth?: boolean;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedRoles,
  requireAuth = true,
}) => {
  const { isAuthenticated, currentUser, hasAccess } = useEnterpriseAuth();
  const location = useLocation();

  // Check authentication
  if (requireAuth && !isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check role-based access
  if (allowedRoles && currentUser && !hasAccess(allowedRoles)) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center space-y-6">
          <div className="w-20 h-20 rounded-full bg-destructive/10 flex items-center justify-center mx-auto">
            <Shield className="w-10 h-10 text-destructive" />
          </div>
          
          <div className="space-y-2">
            <h1 className="text-2xl font-display font-bold">Access Denied</h1>
            <p className="text-muted-foreground">
              You don't have permission to access this page. This area requires{' '}
              <strong>{allowedRoles.join(' or ')}</strong> access.
            </p>
          </div>

          <div className="flex items-center justify-center gap-4 p-4 rounded-lg bg-muted">
            <AlertTriangle className="w-5 h-5 text-warning" />
            <span className="text-sm">
              Your current role: <strong>{currentUser.role}</strong>
            </span>
          </div>

          <div className="flex gap-3 justify-center">
            <Button variant="outline" onClick={() => window.history.back()}>
              Go Back
            </Button>
            <Button onClick={() => window.location.href = '/dashboard'}>
              Go to Dashboard
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
