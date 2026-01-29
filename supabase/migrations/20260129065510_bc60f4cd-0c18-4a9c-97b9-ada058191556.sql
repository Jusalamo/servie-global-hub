-- Fix mutable search_path in database functions for security
-- This prevents search path injection attacks

-- 1. Fix update_updated_at_column
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$;

-- 2. Fix check_kyc_requirement
CREATE OR REPLACE FUNCTION public.check_kyc_requirement()
RETURNS trigger
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public
AS $function$
DECLARE
  user_kyc_status text;
  user_two_fa boolean;
BEGIN
  -- Get KYC status and 2FA for seller
  SELECT kyc_status, two_fa_enabled INTO user_kyc_status, user_two_fa
  FROM public.profiles
  WHERE id = NEW.seller_id;
  
  -- Require verified KYC and 2FA for all sellers
  IF user_kyc_status != 'verified' THEN
    RAISE EXCEPTION 'KYC verification required before listing products. Please complete your verification in Profile Settings.';
  END IF;
  
  IF user_two_fa != true THEN
    RAISE EXCEPTION '2FA is required before listing products. Please enable 2FA in Security Settings.';
  END IF;
  
  RETURN NEW;
END;
$function$;

-- 3. Fix set_document_number
CREATE OR REPLACE FUNCTION public.set_document_number()
RETURNS trigger
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public
AS $function$
BEGIN
  IF NEW.document_number IS NULL OR NEW.document_number = '' THEN
    NEW.document_number := public.generate_document_number(NEW.document_type);
  END IF;
  RETURN NEW;
END;
$function$;

-- 4. Fix create_seller_wallet
CREATE OR REPLACE FUNCTION public.create_seller_wallet()
RETURNS trigger
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public
AS $function$
BEGIN
  IF NEW.role = 'seller' THEN
    INSERT INTO public.seller_wallets (seller_id, balance, commission_deposit)
    VALUES (NEW.id, 0, 0)
    ON CONFLICT (seller_id) DO NOTHING;
  END IF;
  RETURN NEW;
END;
$function$;

-- 5. Fix generate_seller_slug (already has search_path but normalize format)
CREATE OR REPLACE FUNCTION public.generate_seller_slug(user_id uuid)
RETURNS text
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public
AS $function$
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
$function$;

-- 6. Fix generate_document_number
CREATE OR REPLACE FUNCTION public.generate_document_number(doc_type text)
RETURNS text
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public
AS $function$
DECLARE
  prefix TEXT;
  next_num INTEGER;
  doc_number TEXT;
BEGIN
  -- Set prefix based on document type
  prefix := CASE doc_type
    WHEN 'quotation' THEN 'QUO'
    WHEN 'invoice' THEN 'INV'
    WHEN 'receipt' THEN 'RCP'
    WHEN 'deposit_slip' THEN 'DEP'
    WHEN 'payment_voucher' THEN 'PV'
    WHEN 'credit_note' THEN 'CN'
    WHEN 'delivery_note' THEN 'DN'
    ELSE 'DOC'
  END;
  
  -- Get next number for this document type
  SELECT COALESCE(MAX(
    NULLIF(
      regexp_replace(document_number, '[^0-9]', '', 'g'), 
      ''
    )::INTEGER
  ), 0) + 1
  INTO next_num
  FROM public.financial_documents
  WHERE document_type = doc_type;
  
  -- Format: PREFIX-YYYY-NNNNN
  doc_number := prefix || '-' || TO_CHAR(NOW(), 'YYYY') || '-' || LPAD(next_num::TEXT, 5, '0');
  
  RETURN doc_number;
END;
$function$;

-- 7. Fix calculate_payment_split
CREATE OR REPLACE FUNCTION public.calculate_payment_split(
  p_gross_amount numeric, 
  p_platform_rate numeric DEFAULT 0.09, 
  p_psp_rate numeric DEFAULT 0.039, 
  p_psp_fixed numeric DEFAULT 0.30
)
RETURNS TABLE(platform_commission numeric, psp_fee numeric, seller_payout numeric)
LANGUAGE plpgsql
STABLE
SECURITY INVOKER
SET search_path = public
AS $function$
BEGIN
  RETURN QUERY SELECT
    ROUND(p_gross_amount * p_platform_rate, 2) as platform_commission,
    ROUND((p_gross_amount * p_psp_rate) + p_psp_fixed, 2) as psp_fee,
    ROUND(p_gross_amount - (p_gross_amount * p_platform_rate) - ((p_gross_amount * p_psp_rate) + p_psp_fixed), 2) as seller_payout;
END;
$function$;