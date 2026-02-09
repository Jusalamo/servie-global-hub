
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Loader2 } from "lucide-react";

const UserDashboard = () => {
  const { userRole, isLoading, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoading) return;

    if (!isAuthenticated) {
      navigate('/sign-in', { replace: true });
      return;
    }

    if (userRole) {
      const path =
        userRole === 'provider' ? '/dashboard/provider?tab=overview' :
        userRole === 'seller' ? '/dashboard/seller?tab=overview' :
        '/dashboard/client';
      navigate(path, { replace: true });
    }
  }, [userRole, isLoading, isAuthenticated, navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <Loader2 className="h-10 w-10 animate-spin text-servie" />
      <p className="mt-4 text-muted-foreground">Redirecting to your dashboard...</p>
    </div>
  );
};

export default UserDashboard;
