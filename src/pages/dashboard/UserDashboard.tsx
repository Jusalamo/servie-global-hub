
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
    if (!isLoading) {
      if (isAuthenticated) {
        setRedirecting(true);
        
        if (userRole) {
          toast.info(`Directing you to the ${userRole} dashboard`);
          
          // Route based on user role
          setTimeout(() => {
            if (userRole === "provider") {
              navigate("/dashboard/provider?tab=overview", { replace: true });
            } else if (userRole === "seller") {
              navigate("/dashboard/seller?tab=overview", { replace: true });
            } else {
              navigate("/dashboard/client", { replace: true });
            }
          }, 100);
        } else {
          toast.info("Setting up your default dashboard");
          setTimeout(() => {
            navigate("/dashboard/client", { replace: true });
          }, 100);
        }
      } else {
        toast.error("Please sign in to access your dashboard");
        setTimeout(() => {
          navigate("/signin", { replace: true });
        }, 100);
      }
    }
  }, [userRole, isLoading, isAuthenticated, navigate]);
  
  if (isLoading || redirecting) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-servie" />
        <p className="mt-4 text-muted-foreground">
          {redirecting ? "Redirecting to your dashboard..." : "Loading your dashboard..."}
        </p>
      </div>
    );
  }
  
  // This is just a fallback - the useEffect should handle the redirections
  return null;
};

export default UserDashboard;
