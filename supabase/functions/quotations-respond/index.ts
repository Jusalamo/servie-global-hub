import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const VALID_ACTIONS = new Set(["accepted", "declined"]);

const FUNCTION_NAME = "quotations-respond";
const RATE_LIMIT_WINDOW_SECONDS = 60;
const RATE_LIMIT_MAX_REQUESTS = 30;

function getClientIp(req: Request): string | null {
  const xff = req.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0]?.trim() || null;
  return req.headers.get("cf-connecting-ip") || req.headers.get("x-real-ip");
}

async function enforceRateLimit(
  supabaseClient: any,
  userId: string,
): Promise<{ allowed: true } | { allowed: false; retryAfterSeconds: number }> {
  const now = Date.now();
  const windowMs = RATE_LIMIT_WINDOW_SECONDS * 1000;
  const windowStartIso = new Date(Math.floor(now / windowMs) * windowMs).toISOString();

  const { data: existing, error: readError } = await supabaseClient
    .from("edge_rate_limits")
    .select("request_count")
    .eq("user_id", userId)
    .eq("function_name", FUNCTION_NAME)
    .eq("window_start", windowStartIso)
    .maybeSingle();

  if (readError) throw readError;

  if (!existing) {
    const { error: insertError } = await supabaseClient
      .from("edge_rate_limits")
      .insert({
        user_id: userId,
        function_name: FUNCTION_NAME,
        window_start: windowStartIso,
        request_count: 1,
        last_request_at: new Date().toISOString(),
      });
    if (insertError) throw insertError;
    return { allowed: true };
  }

  const currentCount = Number(existing.request_count || 0);
  if (currentCount >= RATE_LIMIT_MAX_REQUESTS) {
    const elapsedSeconds = Math.floor((now - Date.parse(windowStartIso)) / 1000);
    return { allowed: false, retryAfterSeconds: Math.max(1, RATE_LIMIT_WINDOW_SECONDS - elapsedSeconds) };
  }

  const { error: updateError } = await supabaseClient
    .from("edge_rate_limits")
    .update({
      request_count: currentCount + 1,
      last_request_at: new Date().toISOString(),
    })
    .eq("user_id", userId)
    .eq("function_name", FUNCTION_NAME)
    .eq("window_start", windowStartIso);

  if (updateError) throw updateError;
  return { allowed: true };
}

async function logRequest(
  supabaseClient: any,
  userId: string,
  req: Request,
  statusCode: number,
  durationMs: number,
  metadata: Record<string, unknown> = {},
) {
  try {
    await supabaseClient.from("edge_request_logs").insert({
      user_id: userId,
      function_name: FUNCTION_NAME,
      method: req.method,
      status_code: statusCode,
      ip: getClientIp(req),
      user_agent: req.headers.get("user-agent"),
      duration_ms: Math.max(0, Math.floor(durationMs)),
      metadata,
    });
  } catch {
    // never block main request
  }
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const startedAt = Date.now();

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      {
        global: {
          headers: { Authorization: req.headers.get("Authorization") ?? "" },
        },
      },
    );

    // verify_jwt=false in config; validate claims here
    const { data: claimsData, error: claimsError } = await supabase.auth.getClaims();
    const userId = claimsData?.claims?.sub as string | undefined;
    const email = (claimsData?.claims as any)?.email as string | undefined;

    if (claimsError || !userId || !email) {
      console.warn("quotations-respond unauthorized", { claimsError, hasUserId: !!userId, hasEmail: !!email });
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Rate limit
    try {
      const rl = await enforceRateLimit(supabase, userId);
      if (!rl.allowed) {
        await logRequest(supabase, userId, req, 429, Date.now() - startedAt, {
          reason: "rate_limited",
          retry_after_seconds: rl.retryAfterSeconds,
        });
        return new Response(JSON.stringify({ error: "Too many requests" }), {
          status: 429,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
            "Retry-After": String(rl.retryAfterSeconds),
          },
        });
      }
    } catch (e) {
      await logRequest(supabase, userId, req, 500, Date.now() - startedAt, { reason: "rate_limit_error" });
      return new Response(JSON.stringify({ error: "Internal error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    let body: any = {};
    try {
      body = await req.json();
    } catch {
      await logRequest(supabase, userId, req, 400, Date.now() - startedAt, { reason: "invalid_json" });
      return new Response(JSON.stringify({ error: "Invalid request" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const quotationId = String(body?.quotationId || "");
    const action = String(body?.action || "");

    if (!UUID_REGEX.test(quotationId) || !VALID_ACTIONS.has(action)) {
      await logRequest(supabase, userId, req, 400, Date.now() - startedAt, { reason: "invalid_input" });
      return new Response(JSON.stringify({ error: "Invalid request" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Only allow status update when the quotation is addressed to the caller's email.
    // This uses a restrictive WHERE clause so we don't need a broad UPDATE policy.
    const { data: updated, error: updateError } = await supabase
      .from("quotations")
      .update({ status: action, updated_at: new Date().toISOString() })
      .eq("id", quotationId)
      .eq("client_email", email)
      .select("id, status")
      .maybeSingle();

    if (updateError) {
      console.error("quotations-respond update error", updateError);
      await logRequest(supabase, userId, req, 400, Date.now() - startedAt, { reason: "update_error" });
      return new Response(JSON.stringify({ error: "Request failed" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (!updated) {
      // Not found OR not addressed to this user
      await logRequest(supabase, userId, req, 404, Date.now() - startedAt, { reason: "not_found" });
      return new Response(JSON.stringify({ error: "Not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    console.log("quotations-respond success", { quotationId, action, userId });
    await logRequest(supabase, userId, req, 200, Date.now() - startedAt, { quotation_id: quotationId, action });
    return new Response(JSON.stringify({ ok: true, quotation: updated }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("quotations-respond internal error", e);
    return new Response(JSON.stringify({ error: "Internal error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
