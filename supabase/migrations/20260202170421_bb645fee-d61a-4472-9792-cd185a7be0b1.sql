-- Fix seller_wallet trigger for reliable signup
-- The unique constraint is on (seller_id, currency), so we need to specify currency explicitly
CREATE OR REPLACE FUNCTION public.create_seller_wallet()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.role = 'seller' THEN
    INSERT INTO public.seller_wallets (seller_id, currency, balance, commission_deposit)
    VALUES (NEW.id, 'USD', 0, 0)
    ON CONFLICT (seller_id, currency) DO NOTHING;
  END IF;
  RETURN NEW;
END;
$$;