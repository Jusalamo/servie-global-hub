import { useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

export const useAuthRedirect = () => {
  const { user, userRole, isLoading, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const hasRedirected = useRef(false);
  const retryTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

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

  useEffect(() => {
    if (isLoading || hasRedirected.current) return;

    const currentPath = location.pathname;
    const shouldRedirect = currentPath === '/sign-in' || currentPath === '/dashboard';

    if (!shouldRedirect) return;

    // If role is available, redirect immediately
    if (isAuthenticated && user && userRole) {
      hasRedirected.current = true;
      const dashboardPath = getDashboardPath(userRole);
      toast.success(`Welcome back! Redirecting to your ${userRole} dashboard.`);
      navigate(dashboardPath, { replace: true });
      return;
    }

    // If authenticated but role not yet loaded, poll for up to 3 seconds
    if (isAuthenticated && user && !userRole) {
      let elapsed = 0;
      retryTimerRef.current = setInterval(() => {
        elapsed += 300;
        if (elapsed >= 3000) {
          if (retryTimerRef.current) clearInterval(retryTimerRef.current);
          // Fallback: go to /dashboard and let ProtectedRoute/RequireAuth handle it
          if (!hasRedirected.current) {
            hasRedirected.current = true;
            navigate('/dashboard/client', { replace: true });
          }
        }
      }, 300);
    }

    return () => {
      if (retryTimerRef.current) clearInterval(retryTimerRef.current);
    };
  }, [isAuthenticated, user, userRole, isLoading, navigate, location.pathname]);

  // When userRole arrives (possibly after polling started), redirect
  useEffect(() => {
    if (hasRedirected.current || isLoading || !isAuthenticated || !user || !userRole) return;

    const currentPath = location.pathname;
    const shouldRedirect = currentPath === '/sign-in' || currentPath === '/dashboard';
    if (!shouldRedirect) return;

    hasRedirected.current = true;
    if (retryTimerRef.current) clearInterval(retryTimerRef.current);
    const dashboardPath = getDashboardPath(userRole);
    toast.success(`Welcome back! Redirecting to your ${userRole} dashboard.`);
    navigate(dashboardPath, { replace: true });
  }, [userRole]);

  return {
    isLoading: isLoading || (isAuthenticated && user && !userRole),
    isAuthenticated,
    userRole,
    getDashboardPath
  };
};