
import { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

const UserDashboard = () => {
  const { userRole, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }
  
  if (userRole === "provider") {
    return <Navigate to="/dashboard/provider" replace />;
  }
  
  // Default to client dashboard for any other role (client or undefined)
  return <Navigate to="/dashboard/client" replace />;
};

export default UserDashboard;
