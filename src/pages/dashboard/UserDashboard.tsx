
import { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

const UserDashboard = () => {
  const { userRole, isLoading, isAuthenticated } = useAuth();
  
  useEffect(() => {
    // Show user which dashboard they're being directed to
    if (!isLoading && isAuthenticated && userRole) {
      toast.info(`Directing you to the ${userRole} dashboard`);
    } else if (!isLoading && isAuthenticated && !userRole) {
      toast.info("Setting up your default dashboard");
    }
  }, [userRole, isLoading, isAuthenticated]);
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-servie" />
        <p className="mt-4 text-muted-foreground">Loading your dashboard...</p>
      </div>
    );
  }
  
  if (!isAuthenticated) {
    toast.error("Please sign in to access your dashboard");
    return <Navigate to="/signin" replace />;
  }
  
  // Direct to specific dashboard based on user role
  if (userRole === "provider") {
    return <Navigate to="/dashboard/provider?tab=overview" replace />;
  }

  if (userRole === "seller") {
    return <Navigate to="/dashboard/seller?tab=overview" replace />;
  }
  
  // Default to client dashboard for any other role (client or undefined)
  return <Navigate to="/dashboard/client" replace />;
};

export default UserDashboard;
