
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

const UserDashboard = () => {
  const { userRole, isLoading, user } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!isLoading && userRole) {
      console.log("UserDashboard: redirecting based on role:", userRole);
      
      // Immediate navigation based on role
      if (userRole === "provider") {
        navigate("/dashboard/provider?tab=overview", { replace: true });
      } else if (userRole === "seller") {
        navigate("/dashboard/seller?tab=overview", { replace: true });
      } else if (userRole === "admin") {
        navigate("/dashboard/admin", { replace: true });
      } else {
        navigate("/dashboard/client", { replace: true });
      }
    } else if (!isLoading && !userRole && user) {
      // Handle case where user exists but role is not set
      console.error("User role not set properly");
      toast.error("Could not determine user role. Please update your profile.");
      navigate("/dashboard/client", { replace: true });
    } else if (!isLoading && !user) {
      // Not authenticated
      toast.error("Please sign in to access your dashboard");
      navigate("/sign-in", { replace: true, state: { from: "/dashboard" } });
    }
  }, [userRole, isLoading, navigate, user]);
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <Loader2 className="h-10 w-10 animate-spin text-servie" />
      <p className="mt-4 text-muted-foreground">Redirecting to your dashboard...</p>
    </div>
  );
};

export default UserDashboard;
