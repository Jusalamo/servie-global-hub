
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const UserDashboard = () => {
  const { userRole, isLoading, user } = useAuth();
  const navigate = useNavigate();
  const [isCheckingRole, setIsCheckingRole] = useState(false);
  
  useEffect(() => {
    const checkUserRoleAndRedirect = async () => {
      console.log("UserDashboard: checking user role", { user, userRole, isLoading });
      
      if (isLoading) return;
      
      if (!user) {
        console.log("UserDashboard: no user, redirecting to sign-in");
        toast.error("Please sign in to access your dashboard");
        navigate("/sign-in", { replace: true, state: { from: "/dashboard" } });
        return;
      }

      if (!userRole && !isCheckingRole) {
        console.log("UserDashboard: no role found, checking database");
        setIsCheckingRole(true);
        
        try {
          // Check if user profile exists and get role
          const { data: profile, error } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .single();

          if (error) {
            console.error("Error fetching user profile:", error);
            // If profile doesn't exist, create one with default client role
            const { error: insertError } = await supabase
              .from('profiles')
              .insert({
                id: user.id,
                first_name: user.user_metadata?.first_name || 'User',
                last_name: user.user_metadata?.last_name || '',
                role: 'client'
              });

            if (insertError) {
              console.error("Error creating profile:", insertError);
              toast.error("Error setting up user profile");
              navigate("/sign-in", { replace: true });
              return;
            }
            
            // Default to client if profile creation succeeds
            navigate("/dashboard/client", { replace: true });
            return;
          }

          const role = profile.role;
          console.log("UserDashboard: found role in database:", role);
          
          // Navigate based on the role from database
          if (role === "provider") {
            navigate("/dashboard/provider?tab=overview", { replace: true });
          } else if (role === "seller") {
            navigate("/dashboard/seller?tab=overview", { replace: true });
          } else {
            navigate("/dashboard/client", { replace: true });
          }
        } catch (error) {
          console.error("Error checking user role:", error);
          toast.error("Error accessing dashboard");
          navigate("/sign-in", { replace: true });
        } finally {
          setIsCheckingRole(false);
        }
      } else if (userRole) {
        console.log("UserDashboard: redirecting based on role:", userRole);
        
        // Navigate based on role from context
        if (userRole === "provider") {
          navigate("/dashboard/provider?tab=overview", { replace: true });
        } else if (userRole === "seller") {
          navigate("/dashboard/seller?tab=overview", { replace: true });
        } else {
          navigate("/dashboard/client", { replace: true });
        }
      }
    };

    checkUserRoleAndRedirect();
  }, [userRole, isLoading, navigate, user, isCheckingRole]);
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <Loader2 className="h-10 w-10 animate-spin text-servie" />
      <p className="mt-4 text-muted-foreground">
        {isCheckingRole ? "Setting up your profile..." : "Redirecting to your dashboard..."}
      </p>
    </div>
  );
};

export default UserDashboard;
