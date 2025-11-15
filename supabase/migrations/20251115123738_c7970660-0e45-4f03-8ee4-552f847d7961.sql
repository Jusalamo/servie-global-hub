-- Fix the handle_new_user trigger to properly handle seller signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  user_role TEXT;
BEGIN
  -- Get role from metadata, default to 'client'
  user_role := COALESCE(NEW.raw_user_meta_data->>'role', 'client');
  
  -- Validate role is one of the allowed values
  IF user_role NOT IN ('client', 'provider', 'seller', 'admin') THEN
    user_role := 'client';
  END IF;

  -- Insert or update profile
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
  )
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'first_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'last_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'phone', ''),
    COALESCE(NEW.raw_user_meta_data->>'business_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'business_description', ''),
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

  -- Insert into user_roles table with proper type casting
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, user_role::app_role)
  ON CONFLICT (user_id, role) DO NOTHING;
  
  -- Generate seller slug if role is seller
  IF user_role = 'seller' THEN
    UPDATE public.profiles
    SET seller_slug = generate_seller_slug(NEW.id)
    WHERE id = NEW.id AND seller_slug IS NULL;
  END IF;

  RETURN NEW;
END;
$$;

-- Recreate trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();