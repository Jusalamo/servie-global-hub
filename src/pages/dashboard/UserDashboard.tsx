
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Loader2 } from "lucide-react";

const UserDashboard = () => {
  const { userRole, isLoading } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!isLoading && userRole) {
      // Immediate navigation based on role without timeout
      if (userRole === "provider") {
        navigate("/dashboard/provider?tab=overview", { replace: true });
      } else if (userRole === "seller") {
        navigate("/dashboard/seller?tab=overview", { replace: true });
      } else {
        navigate("/dashboard/client", { replace: true });
      }
    }
  }, [userRole, isLoading, navigate]);
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <Loader2 className="h-10 w-10 animate-spin text-servie" />
      <p className="mt-4 text-muted-foreground">Redirecting to your dashboard...</p>
    </div>
  );
};

export default UserDashboard;
