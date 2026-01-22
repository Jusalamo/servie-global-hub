-- Per-user edge function rate limiting counters
CREATE TABLE IF NOT EXISTS public.edge_rate_limits (
  user_id uuid NOT NULL,
  function_name text NOT NULL,
  window_start timestamptz NOT NULL,
  request_count integer NOT NULL DEFAULT 0,
  last_request_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, function_name, window_start)
);

ALTER TABLE public.edge_rate_limits ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'edge_rate_limits' AND policyname = 'Users can read own edge rate limits'
  ) THEN
    EXECUTE 'CREATE POLICY "Users can read own edge rate limits" ON public.edge_rate_limits FOR SELECT USING (auth.uid() = user_id)';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'edge_rate_limits' AND policyname = 'Users can create own edge rate limits'
  ) THEN
    EXECUTE 'CREATE POLICY "Users can create own edge rate limits" ON public.edge_rate_limits FOR INSERT WITH CHECK (auth.uid() = user_id)';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'edge_rate_limits' AND policyname = 'Users can update own edge rate limits'
  ) THEN
    EXECUTE 'CREATE POLICY "Users can update own edge rate limits" ON public.edge_rate_limits FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id)';
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_edge_rate_limits_window
ON public.edge_rate_limits (function_name, window_start);

-- Edge function request logs (per-user, append-only)
CREATE TABLE IF NOT EXISTS public.edge_request_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  function_name text NOT NULL,
  method text NOT NULL,
  status_code integer NOT NULL,
  ip text NULL,
  user_agent text NULL,
  duration_ms integer NULL,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.edge_request_logs ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'edge_request_logs' AND policyname = 'Users can insert own edge request logs'
  ) THEN
    EXECUTE 'CREATE POLICY "Users can insert own edge request logs" ON public.edge_request_logs FOR INSERT WITH CHECK (auth.uid() = user_id)';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'edge_request_logs' AND policyname = 'Users can read own edge request logs'
  ) THEN
    EXECUTE 'CREATE POLICY "Users can read own edge request logs" ON public.edge_request_logs FOR SELECT USING (auth.uid() = user_id)';
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_edge_request_logs_user_time
ON public.edge_request_logs (user_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_edge_request_logs_fn_time
ON public.edge_request_logs (function_name, created_at DESC);