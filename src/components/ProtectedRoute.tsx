/**
 * ProtectedRoute Component
 * 
 * SECURITY NOTE: This component provides client-side route protection for UX purposes only.
 * It is NOT a security boundary. The actual security is enforced by:
 * 1. Supabase RLS (Row Level Security) policies on database tables
 * 2. Server-side authentication checks in Edge Functions
 * 
 * Client-side checks can be bypassed by users modifying local state or directly
 * navigating to URLs. Always ensure sensitive operations are protected server-side.
 */
import { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Loader2 } from "lucide-react";

interface ProtectedRouteProps {
  children: ReactNode;
  /** 
   * Optional role requirement for UX routing.
   * NOTE: This is a UX convenience only - actual authorization is enforced via RLS policies.
   */
  role?: "client" | "provider" | "seller";
}

const ProtectedRoute = ({ children, role }: ProtectedRouteProps) => {
  const { isAuthenticated, isLoading, userRole } = useAuth();
  const location = useLocation();
  
  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-servie" />
        <p className="mt-4 text-muted-foreground">Checking authentication...</p>
      </div>
    );
  }
  
  // If not authenticated, redirect to sign in
  // NOTE: Actual data protection is via RLS - this is UX only
  if (!isAuthenticated) {
    return <Navigate to="/sign-in" state={{ from: location }} replace />;
  }
  
  // Role-based routing for UX - RLS policies enforce actual data access
  // Users cannot access data they're not authorized for regardless of route
  if (role && userRole !== role) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return <>{children}</>;
};

export default ProtectedRoute;
