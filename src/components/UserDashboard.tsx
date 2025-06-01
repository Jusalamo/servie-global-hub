
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

const UserDashboard = () => {
  const { userRole, isLoading, user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    console.log("UserDashboard state:", { isLoading, isAuthenticated, userRole, user: !!user });
    
    if (!isLoading) {
      if (!isAuthenticated || !user) {
        // Not authenticated
        toast.error("Please sign in to access your dashboard");
        navigate("/sign-in", { replace: true, state: { from: "/dashboard" } });
        return;
      }

      if (userRole) {
        console.log("UserDashboard: redirecting based on role:", userRole);
        
        // Navigate based on role
        switch (userRole) {
          case "provider":
            navigate("/dashboard/provider?tab=overview", { replace: true });
            break;
          case "seller":
            navigate("/dashboard/seller?tab=overview", { replace: true });
            break;
          case "client":
          default:
            navigate("/dashboard/client", { replace: true });
            break;
        }
      } else {
        // User exists but no role - set default to client
        console.log("No role found, defaulting to client");
        navigate("/dashboard/client", { replace: true });
      }
    }
  }, [userRole, isLoading, navigate, user, isAuthenticated]);
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <Loader2 className="h-10 w-10 animate-spin text-servie" />
      <p className="mt-4 text-muted-foreground">
        {isLoading ? "Loading your dashboard..." : "Redirecting to your dashboard..."}
      </p>
    </div>
  );
};

export default UserDashboard;
