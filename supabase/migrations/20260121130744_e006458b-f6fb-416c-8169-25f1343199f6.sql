-- Security Fixes Migration (Final)
-- Focus on fixes that don't require dropping has_role function

-- 1. Fix the app_users view - recreate with security_invoker to fix SECURITY DEFINER issue
DROP VIEW IF EXISTS public.app_users;
CREATE VIEW public.app_users WITH (security_invoker = true) AS
SELECT 
  ru.id,
  ru.email,
  ru.created_at,
  ru.updated_at,
  ur.role,
  ru.seller_id
FROM public.real_users ru
LEFT JOIN public.user_roles ur ON ur.user_id = ru.id;

GRANT SELECT ON public.app_users TO authenticated;