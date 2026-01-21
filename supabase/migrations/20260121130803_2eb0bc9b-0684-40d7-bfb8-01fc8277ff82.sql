-- Fix remaining security issues

-- 1. Fix RLS "always true" issue for profiles INSERT
DROP POLICY IF EXISTS "Allow profile creation on signup" ON public.profiles;
DROP POLICY IF EXISTS "Users can create their own profile on signup" ON public.profiles;
CREATE POLICY "Users can create their own profile on signup"
ON public.profiles
FOR INSERT
WITH CHECK (auth.uid() = id);

-- 2. Fix product_views table INSERT policy which uses (true)
DROP POLICY IF EXISTS "Anyone can create product views" ON public.product_views;
DROP POLICY IF EXISTS "Users can create product views" ON public.product_views;
CREATE POLICY "Users can create product views"
ON public.product_views
FOR INSERT
WITH CHECK (
  -- Allow authenticated users to track their own views
  (auth.uid() IS NOT NULL AND (viewer_id = auth.uid() OR viewer_id IS NULL))
  OR
  -- Allow anonymous views (for non-logged-in users tracking)
  (auth.uid() IS NULL AND viewer_id IS NULL)
);