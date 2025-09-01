-- Create trigger function to handle new user profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (
    id, 
    first_name, 
    last_name, 
    role,
    phone,
    bio
  )
  VALUES (
    new.id,
    new.raw_user_meta_data ->> 'first_name',
    new.raw_user_meta_data ->> 'last_name',
    COALESCE(new.raw_user_meta_data ->> 'role', 'client'),
    new.raw_user_meta_data ->> 'phone',
    new.raw_user_meta_data ->> 'business_description'
  );
  return new;
END;
$$;

-- Create trigger to automatically create profile when user signs up
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Add INSERT policy for profiles table to allow the trigger to work
CREATE POLICY "Allow profile creation on signup" 
ON profiles FOR INSERT 
WITH CHECK (true);

-- Update the profiles table to allow business_name field
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS business_name text;