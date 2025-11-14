-- Add multiple images and video support to products table
ALTER TABLE public.products 
ADD COLUMN IF NOT EXISTS images text[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS video_url text;

-- Add seller shop profile fields to profiles table
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS seller_slug text UNIQUE,
ADD COLUMN IF NOT EXISTS shop_description text,
ADD COLUMN IF NOT EXISTS shop_logo_url text;

-- Create index on seller_slug for faster lookups
CREATE INDEX IF NOT EXISTS idx_profiles_seller_slug ON public.profiles(seller_slug);

-- Function to generate unique seller slug from business name or full name
CREATE OR REPLACE FUNCTION generate_seller_slug(user_id uuid)
RETURNS text
LANGUAGE plpgsql
AS $$
DECLARE
  base_slug text;
  final_slug text;
  counter integer := 0;
BEGIN
  -- Get business name or construct from first/last name
  SELECT 
    COALESCE(
      LOWER(REGEXP_REPLACE(business_name, '[^a-zA-Z0-9]+', '-', 'g')),
      LOWER(REGEXP_REPLACE(first_name || '-' || last_name, '[^a-zA-Z0-9]+', '-', 'g'))
    )
  INTO base_slug
  FROM public.profiles
  WHERE id = user_id;
  
  -- Remove leading/trailing hyphens
  base_slug := TRIM(BOTH '-' FROM base_slug);
  
  -- Start with base slug
  final_slug := base_slug;
  
  -- Check for uniqueness and append number if needed
  WHILE EXISTS (SELECT 1 FROM public.profiles WHERE seller_slug = final_slug AND id != user_id) LOOP
    counter := counter + 1;
    final_slug := base_slug || '-' || counter;
  END LOOP;
  
  RETURN final_slug;
END;
$$;

-- Update existing sellers to have slugs
UPDATE public.profiles
SET seller_slug = generate_seller_slug(id)
WHERE role IN ('seller', 'provider') AND seller_slug IS NULL;