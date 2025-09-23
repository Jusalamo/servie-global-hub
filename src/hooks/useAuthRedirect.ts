import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

export const useAuthRedirect = () => {
  const { user, userRole, isLoading, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Don't redirect while still loading
    if (isLoading) return;

    // If user is authenticated and has a role, redirect to appropriate dashboard
    if (isAuthenticated && user && userRole) {
      const currentPath = location.pathname;
      
      // Only redirect if they're on sign-in page or generic dashboard
      if (currentPath === '/sign-in' || currentPath === '/dashboard') {
        const dashboardPath = getDashboardPath(userRole);
        toast.success(`Welcome back! Redirecting to your ${userRole} dashboard.`);
        navigate(dashboardPath, { replace: true });
      }
    }
    
    // If user exists but role is not yet determined, wait a bit more
    if (isAuthenticated && user && !userRole && !isLoading) {
      console.warn('User authenticated but role not determined yet');
    }
  }, [isAuthenticated, user, userRole, isLoading, navigate, location.pathname]);

  const getDashboardPath = (role: string): string => {
    switch (role) {
      case 'provider':
        return '/dashboard/provider?tab=overview';
      case 'seller':
        return '/dashboard/seller?tab=overview';
      case 'client':
      default:
        return '/dashboard/client';
    }
  };

  return {
    isLoading: isLoading || (isAuthenticated && user && !userRole),
    isAuthenticated,
    userRole,
    getDashboardPath
  };
};