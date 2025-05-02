
import { useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

const UserDashboard = () => {
  const { userRole, isLoading, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    // Show user which dashboard they're being directed to
    if (!isLoading && isAuthenticated && userRole) {
      toast.info(`Directing you to the ${userRole} dashboard`);
      
      // Route based on user role
      if (userRole === "provider") {
        navigate("/dashboard/provider?tab=overview", { replace: true });
      } else if (userRole === "seller") {
        navigate("/dashboard/seller?tab=overview", { replace: true });
      } else {
        navigate("/dashboard/client", { replace: true });
      }
    } else if (!isLoading && isAuthenticated && !userRole) {
      toast.info("Setting up your default dashboard");
      navigate("/dashboard/client", { replace: true });
    } else if (!isLoading && !isAuthenticated) {
      toast.error("Please sign in to access your dashboard");
      navigate("/signin", { replace: true });
    }
  }, [userRole, isLoading, isAuthenticated, navigate]);
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-servie" />
        <p className="mt-4 text-muted-foreground">Loading your dashboard...</p>
      </div>
    );
  }
  
  // This is just a fallback - the useEffect should handle the redirections
  return null;
};

export default UserDashboard;
