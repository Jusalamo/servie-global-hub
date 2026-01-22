import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

export default function AuthCallback() {
  const navigate = useNavigate();

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
      const dashboardPath =
        role === "provider"
          ? "/dashboard/provider?tab=overview"
          : role === "seller"
            ? "/dashboard/seller?tab=overview"
            : "/dashboard/client";

      navigate(dashboardPath, { replace: true });
    };

    run();

    return () => {
      cancelled = true;
    };
  }, [navigate]);

  return (
    <main className="min-h-[50vh] flex items-center justify-center">
      <div className="text-center space-y-2">
        <h1 className="text-xl font-semibold">Signing you in…</h1>
        <p className="text-sm text-muted-foreground">Please wait.</p>
      </div>
    </main>
  );
}
