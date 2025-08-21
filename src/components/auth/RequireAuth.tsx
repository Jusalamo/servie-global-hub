
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Loader2 } from 'lucide-react';

const RequireAuth = () => {
  const { isAuthenticated, isLoading, userRole } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-servie" />
        <p className="mt-4 text-muted-foreground">Checking authentication...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redirect to signin page but save the location they were trying to access
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }

  // Redirect users to their appropriate dashboards if they're trying to access generic dashboard
  if (location.pathname === "/dashboard" && userRole) {
    const dashboardPath = 
      userRole === "provider" ? "/dashboard/provider?tab=overview" :
      userRole === "seller" ? "/dashboard/seller?tab=overview" : 
      "/dashboard/client";
    
    return <Navigate to={dashboardPath} replace />;
  }

  // If authenticated, render the child routes
  return <Outlet />;
};

export default RequireAuth;
