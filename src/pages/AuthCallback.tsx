import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { OnboardingFlow } from "@/components/onboarding/OnboardingFlow";
import { Loader2 } from "lucide-react";

export default function AuthCallback() {
  const navigate = useNavigate();
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [userRole, setUserRole] = useState<string>('client');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      try {
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

        // Check onboarding status - key in localStorage to track if user completed onboarding
        const onboardingKey = `servie_onboarding_${session.user.id}`;
        const hasCompletedOnboarding = localStorage.getItem(onboardingKey) === 'completed';

        if (hasCompletedOnboarding) {
          // User already completed onboarding, go to dashboard
          navigateToDashboard(role);
          return;
        }

        // Check if profile is complete (first_name is filled)
        const { data: profile } = await supabase
          .from("profiles")
          .select("first_name, created_at")
          .eq("id", session.user.id)
          .maybeSingle();

        if (cancelled) return;

        // Determine if user should see onboarding
        // Show onboarding if:
        // 1. User was created recently (within last 24 hours) OR
        // 2. User doesn't have first_name filled
        const createdAt = profile?.created_at ? new Date(profile.created_at) : new Date();
        const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
        const isRecentUser = createdAt > twentyFourHoursAgo;
        const hasIncompleteProfile = !profile?.first_name;

        // Always show onboarding for new users (per user requirement)
        if (isRecentUser || hasIncompleteProfile) {
          setShowOnboarding(true);
          setIsLoading(false);
        } else {
          navigateToDashboard(role);
        }
      } catch (error) {
        console.error('Auth callback error:', error);
        navigate("/sign-in", { replace: true });
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

  const handleOnboardingComplete = async () => {
    // Mark onboarding as completed
    const { data } = await supabase.auth.getSession();
    if (data.session?.user?.id) {
      const onboardingKey = `servie_onboarding_${data.session.user.id}`;
      localStorage.setItem(onboardingKey, 'completed');
    }
    
    setShowOnboarding(false);
    navigateToDashboard(userRole);
  };

  if (showOnboarding) {
    return <OnboardingFlow onComplete={handleOnboardingComplete} userRole={userRole} />;
  }

  return (
    <main className="min-h-[50vh] flex items-center justify-center">
      <div className="text-center space-y-3">
        <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
        <h1 className="text-xl font-semibold">Signing you in…</h1>
        <p className="text-sm text-muted-foreground">Please wait.</p>
      </div>
    </main>
  );
}
