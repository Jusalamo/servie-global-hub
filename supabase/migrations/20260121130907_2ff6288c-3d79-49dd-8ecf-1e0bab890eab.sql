-- Final security fixes

-- 1. Add RLS policy for public_profiles view to allow public read of non-sensitive data
-- The profiles table still needs a policy for public access to provider/seller info
-- but only for non-sensitive fields - we'll use the view instead

-- 2. Enable RLS on app_users view (it's a view, so we need to ensure base tables have RLS)
-- The real_users table already has RLS enabled with self_select policy

-- Create a limited policy for profiles that only allows viewing basic info for providers/sellers
CREATE POLICY "Public can view basic provider info"
ON public.profiles
FOR SELECT
USING (
  role IN ('provider', 'seller')
  -- Note: This allows SELECT but the application should use public_profiles view
  -- which only exposes non-sensitive columns
);