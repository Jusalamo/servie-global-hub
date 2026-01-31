-- Remove KYC/2FA requirement triggers from products table
-- These triggers were blocking sellers from creating products without verification
DROP TRIGGER IF EXISTS check_kyc_before_product_insert ON public.products;
DROP TRIGGER IF EXISTS enforce_kyc_2fa_before_listing ON public.products;