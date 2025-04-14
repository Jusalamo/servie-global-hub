
import { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

const UserDashboard = () => {
  const { userRole, isLoading, isAuthenticated } = useAuth();
  
  useEffect(() => {
    // Show user which dashboard they're being directed to
    if (!isLoading && isAuthenticated) {
      toast.info(`Directing you to the ${userRole || 'default'} dashboard`);
    }
  }, [userRole, isLoading, isAuthenticated]);
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }
  
  if (!isAuthenticated) {
    toast.error("Please sign in to access your dashboard");
    return <Navigate to="/signin" replace />;
  }
  
  if (userRole === "provider") {
    return <Navigate to="/dashboard/provider" replace />;
  }
  
  // Default to client dashboard for any other role (client or undefined)
  return <Navigate to="/dashboard/client" replace />;
};

export default UserDashboard;
