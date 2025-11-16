-- Ensure signup trigger and seller slug generation are correctly configured
-- 1) Create or replace handle_new_user with role + profile + user_roles + seller_slug logic
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  user_role TEXT;
BEGIN
  -- Extract role safely, default to client
  user_role := COALESCE(NEW.raw_user_meta_data->>'role', 'client');
  IF user_role NOT IN ('client','provider','seller','admin') THEN
    user_role := 'client';
  END IF;

  -- Insert or update profile from metadata
  INSERT INTO public.profiles (
    id,
    first_name,
    last_name,
    phone,
    business_name,
    bio,
    role,
    created_at,
    updated_at
  ) VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'first_name',''),
    COALESCE(NEW.raw_user_meta_data->>'last_name',''),
    COALESCE(NEW.raw_user_meta_data->>'phone',''),
    COALESCE(NEW.raw_user_meta_data->>'business_name',''),
    COALESCE(NEW.raw_user_meta_data->>'business_description',''),
    user_role,
    NOW(),
    NOW()
  )
  ON CONFLICT (id) DO UPDATE SET
    first_name = COALESCE(NEW.raw_user_meta_data->>'first_name', profiles.first_name),
    last_name = COALESCE(NEW.raw_user_meta_data->>'last_name', profiles.last_name),
    phone = COALESCE(NEW.raw_user_meta_data->>'phone', profiles.phone),
    business_name = COALESCE(NEW.raw_user_meta_data->>'business_name', profiles.business_name),
    bio = COALESCE(NEW.raw_user_meta_data->>'business_description', profiles.bio),
    role = user_role,
    updated_at = NOW();

  -- Ensure user_roles entry exists (separate roles table)
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, user_role::public.app_role)
  ON CONFLICT (user_id, role) DO NOTHING;

  -- For sellers, generate a seller_slug if missing
  IF user_role = 'seller' THEN
    UPDATE public.profiles
    SET seller_slug = public.generate_seller_slug(NEW.id)
    WHERE id = NEW.id AND seller_slug IS NULL;
  END IF;

  RETURN NEW;
END;
$$;

-- 2) Ensure trigger exists on auth.users
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'on_auth_user_created'
  ) THEN
    CREATE TRIGGER on_auth_user_created
      AFTER INSERT ON auth.users
      FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
  ELSE
    -- Recreate to point to latest function definition
    DROP TRIGGER on_auth_user_created ON auth.users;
    CREATE TRIGGER on_auth_user_created
      AFTER INSERT ON auth.users
      FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
  END IF;
END$$;

-- 3) Backfill missing seller slugs for existing sellers
UPDATE public.profiles p
SET seller_slug = public.generate_seller_slug(p.id)
WHERE p.role = 'seller' AND (p.seller_slug IS NULL OR p.seller_slug = '');
