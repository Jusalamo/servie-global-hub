
import { useEffect } from "react";
import { useAuthRedirect } from "@/hooks/useAuthRedirect";
import { Loader2 } from "lucide-react";

const UserDashboard = () => {
  const { isLoading } = useAuthRedirect();
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-servie" />
        <p className="mt-4 text-muted-foreground">Setting up your dashboard...</p>
      </div>
    );
  }
  
  // This component should not be rendered if auth redirect is working properly
  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <Loader2 className="h-10 w-10 animate-spin text-servie" />
      <p className="mt-4 text-muted-foreground">Redirecting to your dashboard...</p>
    </div>
  );
};

export default UserDashboard;
