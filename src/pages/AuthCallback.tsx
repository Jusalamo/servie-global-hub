import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { OnboardingFlow } from "@/components/onboarding/OnboardingFlow";
import { Loader2 } from "lucide-react";

export default function AuthCallback() {
  const navigate = useNavigate();
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [userRole, setUserRole] = useState<string>('client');
  const [isNewUser, setIsNewUser] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      // Supabase JS will parse tokens from the URL automatically on initial load.
      const { data } = await supabase.auth.getSession();
      const session = data.session;

      if (cancelled) return;

      // If no session, send user to sign-in.
      if (!session?.user?.id) {
        navigate("/sign-in", { replace: true });
        return;
      }

      // Fetch role from user_roles (source of truth).
      const { data: roleRow } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", session.user.id)
        .maybeSingle();

      if (cancelled) return;

      const role = roleRow?.role || "client";
      setUserRole(role);

      // Check if profile is complete (first_name is filled)
      const { data: profile } = await supabase
        .from("profiles")
        .select("first_name, created_at")
        .eq("id", session.user.id)
        .maybeSingle();

      if (cancelled) return;

      // Check if user was created recently (within last 5 minutes) and doesn't have first_name
      const createdAt = profile?.created_at ? new Date(profile.created_at) : new Date();
      const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
      const isNew = createdAt > fiveMinutesAgo && !profile?.first_name;

      if (isNew) {
        setIsNewUser(true);
        setShowOnboarding(true);
      } else {
        navigateToDashboard(role);
      }
    };

    run();

    return () => {
      cancelled = true;
    };
  }, [navigate]);

  const navigateToDashboard = (role: string) => {
    const dashboardPath =
      role === "provider"
        ? "/dashboard/provider?tab=overview"
        : role === "seller"
          ? "/dashboard/seller?tab=overview"
          : "/dashboard/client";

    navigate(dashboardPath, { replace: true });
  };

  const handleOnboardingComplete = () => {
    setShowOnboarding(false);
    navigateToDashboard(userRole);
  };

  if (showOnboarding) {
    return <OnboardingFlow onComplete={handleOnboardingComplete} userRole={userRole} />;
  }

  return (
    <main className="min-h-[50vh] flex items-center justify-center">
      <div className="text-center space-y-3">
        <Loader2 className="h-8 w-8 animate-spin mx-auto text-servie" />
        <h1 className="text-xl font-semibold">Signing you in…</h1>
        <p className="text-sm text-muted-foreground">Please wait.</p>
      </div>
    </main>
  );
}
