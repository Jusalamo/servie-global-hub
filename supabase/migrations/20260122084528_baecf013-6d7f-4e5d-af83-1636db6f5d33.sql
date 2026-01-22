-- Fix seller signup failures caused by empty/non-unique seller_slug generation

CREATE OR REPLACE FUNCTION public.generate_seller_slug(user_id uuid)
RETURNS text
LANGUAGE plpgsql
SET search_path = public
AS $$
DECLARE
  base_slug text;
  final_slug text;
  counter integer := 0;
  fallback_slug text;
BEGIN
  -- Build base slug from business_name or first/last name
  SELECT
    COALESCE(
      NULLIF(LOWER(REGEXP_REPLACE(business_name, '[^a-zA-Z0-9]+', '-', 'g')), ''),
      NULLIF(LOWER(REGEXP_REPLACE(first_name || '-' || last_name, '[^a-zA-Z0-9]+', '-', 'g')), '')
    )
  INTO base_slug
  FROM public.profiles
  WHERE id = user_id;

  -- Normalize
  base_slug := TRIM(BOTH '-' FROM COALESCE(base_slug, ''));

  -- If still empty, use deterministic fallback
  IF base_slug = '' THEN
    fallback_slug := 'seller-' || LEFT(REPLACE(user_id::text, '-', ''), 10);
    base_slug := fallback_slug;
  END IF;

  final_slug := base_slug;

  -- Ensure uniqueness
  WHILE EXISTS (
    SELECT 1 FROM public.profiles
    WHERE seller_slug = final_slug AND id <> user_id
  ) LOOP
    counter := counter + 1;
    final_slug := base_slug || '-' || counter;
  END LOOP;

  RETURN final_slug;
END;
$$;

-- Backfill any missing/empty slugs safely
UPDATE public.profiles p
SET seller_slug = public.generate_seller_slug(p.id)
WHERE p.role = 'seller' AND (p.seller_slug IS NULL OR p.seller_slug = '');
