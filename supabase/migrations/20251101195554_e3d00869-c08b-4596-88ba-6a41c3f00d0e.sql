-- Priority 1: Critical Database Fixes and Infrastructure

-- 1. Ensure cart_items has proper unique constraint
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'cart_items_user_id_product_id_key'
  ) THEN
    ALTER TABLE public.cart_items 
    ADD CONSTRAINT cart_items_user_id_product_id_key UNIQUE (user_id, product_id);
  END IF;
END $$;

-- 2. Add KYC/2FA fields to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS kyc_status text DEFAULT 'pending' CHECK (kyc_status IN ('pending', 'submitted', 'verified', 'rejected')),
ADD COLUMN IF NOT EXISTS kyc_document_url text,
ADD COLUMN IF NOT EXISTS kyc_submitted_at timestamp with time zone,
ADD COLUMN IF NOT EXISTS kyc_verified_at timestamp with time zone,
ADD COLUMN IF NOT EXISTS two_fa_enabled boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS two_fa_verified_at timestamp with time zone,
ADD COLUMN IF NOT EXISTS bank_account_verified boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS bank_account_verified_at timestamp with time zone;

-- 3. Create seller_wallets table for commission deposits
CREATE TABLE IF NOT EXISTS public.seller_wallets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  seller_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  balance numeric NOT NULL DEFAULT 0 CHECK (balance >= 0),
  currency text NOT NULL DEFAULT 'USD',
  commission_deposit numeric NOT NULL DEFAULT 0 CHECK (commission_deposit >= 0),
  last_deposit_at timestamp with time zone,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(seller_id, currency)
);

-- Enable RLS on seller_wallets
ALTER TABLE public.seller_wallets ENABLE ROW LEVEL SECURITY;

-- Sellers can view their own wallet
CREATE POLICY "Sellers can view their own wallet" 
ON public.seller_wallets 
FOR SELECT 
USING (auth.uid() = seller_id);

-- Sellers can update their own wallet (for deposits)
CREATE POLICY "Sellers can update their own wallet" 
ON public.seller_wallets 
FOR UPDATE 
USING (auth.uid() = seller_id);

-- System can manage all wallets
CREATE POLICY "System can manage all wallets" 
ON public.seller_wallets 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role));

-- 4. Create payment_splits table for tracking commission splits
CREATE TABLE IF NOT EXISTS public.payment_splits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  transaction_id uuid NOT NULL,
  order_id uuid REFERENCES public.orders(id),
  seller_id uuid NOT NULL REFERENCES auth.users(id),
  gross_amount numeric NOT NULL CHECK (gross_amount >= 0),
  platform_commission numeric NOT NULL CHECK (platform_commission >= 0),
  platform_commission_rate numeric NOT NULL DEFAULT 0.09 CHECK (platform_commission_rate >= 0 AND platform_commission_rate <= 1),
  psp_fee numeric NOT NULL CHECK (psp_fee >= 0),
  psp_fee_rate numeric NOT NULL DEFAULT 0.039 CHECK (psp_fee_rate >= 0 AND psp_fee_rate <= 1),
  psp_fixed_fee numeric NOT NULL DEFAULT 0.30 CHECK (psp_fixed_fee >= 0),
  seller_payout numeric NOT NULL CHECK (seller_payout >= 0),
  currency text NOT NULL DEFAULT 'USD',
  split_status text NOT NULL DEFAULT 'pending' CHECK (split_status IN ('pending', 'processing', 'completed', 'failed', 'refunded')),
  platform_paid_at timestamp with time zone,
  seller_paid_at timestamp with time zone,
  metadata jsonb,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS on payment_splits
ALTER TABLE public.payment_splits ENABLE ROW LEVEL SECURITY;

-- Sellers can view their own splits
CREATE POLICY "Sellers can view their own payment splits" 
ON public.payment_splits 
FOR SELECT 
USING (auth.uid() = seller_id);

-- Admins can view all splits
CREATE POLICY "Admins can view all payment splits" 
ON public.payment_splits 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'::app_role));

-- System can manage all splits
CREATE POLICY "System can manage payment splits" 
ON public.payment_splits 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role));

-- 5. Create escrow_transactions table for high-value transactions
CREATE TABLE IF NOT EXISTS public.escrow_transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  buyer_id uuid NOT NULL REFERENCES auth.users(id),
  seller_id uuid NOT NULL REFERENCES auth.users(id),
  amount numeric NOT NULL CHECK (amount >= 0),
  currency text NOT NULL DEFAULT 'USD',
  escrow_status text NOT NULL DEFAULT 'pending' CHECK (escrow_status IN ('pending', 'funded', 'released', 'refunded', 'disputed')),
  release_date timestamp with time zone,
  dispute_reason text,
  funded_at timestamp with time zone,
  released_at timestamp with time zone,
  refunded_at timestamp with time zone,
  metadata jsonb,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS on escrow_transactions
ALTER TABLE public.escrow_transactions ENABLE ROW LEVEL SECURITY;

-- Users can view their own escrow transactions
CREATE POLICY "Users can view their own escrow transactions" 
ON public.escrow_transactions 
FOR SELECT 
USING (auth.uid() = buyer_id OR auth.uid() = seller_id);

-- Buyers can create escrow transactions
CREATE POLICY "Buyers can create escrow transactions" 
ON public.escrow_transactions 
FOR INSERT 
WITH CHECK (auth.uid() = buyer_id);

-- System can manage all escrow
CREATE POLICY "System can manage all escrow transactions" 
ON public.escrow_transactions 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role));

-- 6. Create idempotency_keys table for payment deduplication
CREATE TABLE IF NOT EXISTS public.idempotency_keys (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  idempotency_key text NOT NULL UNIQUE,
  user_id uuid NOT NULL REFERENCES auth.users(id),
  request_type text NOT NULL,
  request_payload jsonb NOT NULL,
  response_payload jsonb,
  status text NOT NULL DEFAULT 'processing' CHECK (status IN ('processing', 'completed', 'failed')),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  expires_at timestamp with time zone NOT NULL DEFAULT (now() + interval '24 hours')
);

CREATE INDEX IF NOT EXISTS idx_idempotency_keys_key ON public.idempotency_keys(idempotency_key);
CREATE INDEX IF NOT EXISTS idx_idempotency_keys_expires ON public.idempotency_keys(expires_at);

-- Enable RLS on idempotency_keys
ALTER TABLE public.idempotency_keys ENABLE ROW LEVEL SECURITY;

-- Users can view their own idempotency keys
CREATE POLICY "Users can view their own idempotency keys" 
ON public.idempotency_keys 
FOR SELECT 
USING (auth.uid() = user_id);

-- System can manage all idempotency keys
CREATE POLICY "System can manage idempotency keys" 
ON public.idempotency_keys 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role));

-- 7. Create off_platform_violations table for monitoring
CREATE TABLE IF NOT EXISTS public.off_platform_violations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id),
  violation_type text NOT NULL CHECK (violation_type IN ('suspected_external_payment', 'contact_sharing', 'payment_avoidance', 'other')),
  evidence jsonb,
  severity text NOT NULL DEFAULT 'medium' CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'reviewing', 'confirmed', 'dismissed', 'actioned')),
  action_taken text,
  reported_by uuid REFERENCES auth.users(id),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS on off_platform_violations
ALTER TABLE public.off_platform_violations ENABLE ROW LEVEL SECURITY;

-- Users can view violations against them
CREATE POLICY "Users can view their own violations" 
ON public.off_platform_violations 
FOR SELECT 
USING (auth.uid() = user_id);

-- Admins can manage all violations
CREATE POLICY "Admins can manage violations" 
ON public.off_platform_violations 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role));

-- 8. Add triggers for automatic timestamp updates
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply triggers to new tables
DROP TRIGGER IF EXISTS update_seller_wallets_updated_at ON public.seller_wallets;
CREATE TRIGGER update_seller_wallets_updated_at
BEFORE UPDATE ON public.seller_wallets
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_payment_splits_updated_at ON public.payment_splits;
CREATE TRIGGER update_payment_splits_updated_at
BEFORE UPDATE ON public.payment_splits
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_escrow_transactions_updated_at ON public.escrow_transactions;
CREATE TRIGGER update_escrow_transactions_updated_at
BEFORE UPDATE ON public.escrow_transactions
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_off_platform_violations_updated_at ON public.off_platform_violations;
CREATE TRIGGER update_off_platform_violations_updated_at
BEFORE UPDATE ON public.off_platform_violations
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- 9. Function to calculate payment splits
CREATE OR REPLACE FUNCTION calculate_payment_split(
  p_gross_amount numeric,
  p_platform_rate numeric DEFAULT 0.09,
  p_psp_rate numeric DEFAULT 0.039,
  p_psp_fixed numeric DEFAULT 0.30
)
RETURNS TABLE (
  platform_commission numeric,
  psp_fee numeric,
  seller_payout numeric
) AS $$
BEGIN
  RETURN QUERY SELECT
    ROUND(p_gross_amount * p_platform_rate, 2) as platform_commission,
    ROUND((p_gross_amount * p_psp_rate) + p_psp_fixed, 2) as psp_fee,
    ROUND(p_gross_amount - (p_gross_amount * p_platform_rate) - ((p_gross_amount * p_psp_rate) + p_psp_fixed), 2) as seller_payout;
END;
$$ LANGUAGE plpgsql STABLE;

-- 10. Function to check if KYC is required for listing
CREATE OR REPLACE FUNCTION check_kyc_requirement()
RETURNS TRIGGER AS $$
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
$$ LANGUAGE plpgsql;

-- Apply KYC check trigger to products table
DROP TRIGGER IF EXISTS check_kyc_before_product_insert ON public.products;
CREATE TRIGGER check_kyc_before_product_insert
BEFORE INSERT ON public.products
FOR EACH ROW
EXECUTE FUNCTION check_kyc_requirement();