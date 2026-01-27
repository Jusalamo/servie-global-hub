-- Add foreign key from products to public_profiles for public seller info
-- This allows fetching seller info without RLS restrictions

-- First, ensure public_profiles has all sellers synced
INSERT INTO public.public_profiles (id, role, first_name, last_name, avatar_url, business_name, seller_slug, shop_description, shop_logo_url, brand_color_primary, brand_color_accent, city, state, country, created_at, updated_at)
SELECT 
  id, role, first_name, last_name, avatar_url, business_name, seller_slug, shop_description, shop_logo_url, brand_color_primary, brand_color_accent, city, state, country, 
  COALESCE(created_at, now()), 
  COALESCE(updated_at, now())
FROM public.profiles 
WHERE role IN ('seller', 'provider')
ON CONFLICT (id) DO UPDATE SET
  role = EXCLUDED.role,
  first_name = EXCLUDED.first_name,
  last_name = EXCLUDED.last_name,
  avatar_url = EXCLUDED.avatar_url,
  business_name = EXCLUDED.business_name,
  seller_slug = EXCLUDED.seller_slug,
  shop_description = EXCLUDED.shop_description,
  shop_logo_url = EXCLUDED.shop_logo_url,
  brand_color_primary = EXCLUDED.brand_color_primary,
  brand_color_accent = EXCLUDED.brand_color_accent,
  city = EXCLUDED.city,
  state = EXCLUDED.state,
  country = EXCLUDED.country,
  updated_at = EXCLUDED.updated_at;

-- Add the foreign key constraint if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'products_seller_id_public_profiles_fkey'
    AND table_name = 'products'
  ) THEN
    ALTER TABLE public.products
    ADD CONSTRAINT products_seller_id_public_profiles_fkey 
    FOREIGN KEY (seller_id) REFERENCES public.public_profiles(id);
  END IF;
END $$;