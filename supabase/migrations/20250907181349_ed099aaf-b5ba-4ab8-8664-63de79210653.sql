-- Fix search path security issue for handle_new_user function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (
    id,
    first_name,
    last_name,
    role,
    phone,
    business_name,
    bio,
    created_at,
    updated_at
  )
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'first_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'last_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'role', 'client'),
    COALESCE(NEW.raw_user_meta_data->>'phone', ''),
    COALESCE(NEW.raw_user_meta_data->>'business_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'business_description', ''),
    NOW(),
    NOW()
  )
  ON CONFLICT (id) DO UPDATE SET
    first_name = COALESCE(NEW.raw_user_meta_data->>'first_name', profiles.first_name),
    last_name = COALESCE(NEW.raw_user_meta_data->>'last_name', profiles.last_name),
    role = COALESCE(NEW.raw_user_meta_data->>'role', profiles.role),
    phone = COALESCE(NEW.raw_user_meta_data->>'phone', profiles.phone),
    business_name = COALESCE(NEW.raw_user_meta_data->>'business_name', profiles.business_name),
    bio = COALESCE(NEW.raw_user_meta_data->>'business_description', profiles.bio),
    updated_at = NOW();
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;