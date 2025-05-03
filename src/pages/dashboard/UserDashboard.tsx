
import { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

const UserDashboard = () => {
  const { userRole, isLoading, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [redirecting, setRedirecting] = useState(false);
  
  useEffect(() => {
    console.log("UserDashboard useEffect - Auth state:", { userRole, isLoading, isAuthenticated });
    
    // Only proceed if authentication check is complete
    if (!isLoading) {
      setRedirecting(true);
      
      // Immediate redirect based on role - removed timeout to avoid delay
      if (isAuthenticated) {
        if (userRole === "provider") {
          navigate("/dashboard/provider?tab=overview", { replace: true });
        } else if (userRole === "seller") {
          navigate("/dashboard/seller?tab=overview", { replace: true });
        } else {
          navigate("/dashboard/client", { replace: true });
        }
      } else {
        // For demo purposes, let's redirect to a mock dashboard
        navigate("/dashboard/seller?tab=overview", { replace: true });
      }
    }
  }, [userRole, isLoading, isAuthenticated, navigate]);
  
  // Show a loading indicator while authentication state is being checked
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-servie" />
        <p className="mt-4 text-muted-foreground">Loading your dashboard...</p>
      </div>
    );
  }
  
  // Show a redirecting indicator after authentication is checked
  if (redirecting) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-servie" />
        <p className="mt-4 text-muted-foreground">Redirecting to your dashboard...</p>
      </div>
    );
  }
  
  // This is just a fallback - the useEffect should handle the redirections
  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <Loader2 className="h-10 w-10 animate-spin text-servie" />
      <p className="mt-4 text-muted-foreground">Setting up your dashboard...</p>
    </div>
  );
};

export default UserDashboard;
