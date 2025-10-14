-- ====================================================================
-- CRITICAL SECURITY & MONETIZATION FOUNDATION MIGRATION
-- ====================================================================
-- This migration implements:
-- 1. Monetization configuration table with RLS
-- 2. Subscription management tables
-- 3. Geo-location fields for services/products
-- 4. Escrow and payment tracking
-- 5. Enhanced RLS policies
-- ====================================================================

-- ============================================================
-- 1. MONETIZATION CONFIGURATION TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS public.monetization_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  config_key TEXT NOT NULL UNIQUE,
  config_value JSONB NOT NULL,
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- RLS for monetization config (admin only)
ALTER TABLE public.monetization_config ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Only admins can view monetization config"
  ON public.monetization_config FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Only admins can manage monetization config"
  ON public.monetization_config FOR ALL
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Insert default monetization configuration
INSERT INTO public.monetization_config (config_key, config_value, description) VALUES
  ('platform_commission', '{"percentage": 5.0, "type": "per_sale"}', 'Platform commission on each sale'),
  ('subscription_tiers', '{
    "free": {"price": 0, "listing_limit": 5, "features": ["basic_dashboard"]},
    "basic": {"price": 10, "listing_limit": -1, "features": ["basic_dashboard", "analytics", "unlimited_listings"]},
    "premium": {"price": 30, "listing_limit": -1, "features": ["basic_dashboard", "analytics", "unlimited_listings", "priority_support", "advanced_analytics"]}
  }', 'Subscription tier configuration'),
  ('client_fee', '{"percentage": 3.5, "fixed_amount": 0.50, "currency": "USD"}', 'Dynamic client processing fee'),
  ('payment_gateway', '{"provider": "paystack", "api_mode": "test"}', 'Payment gateway configuration')
ON CONFLICT (config_key) DO NOTHING;

-- ============================================================
-- 2. SUBSCRIPTION MANAGEMENT
-- ============================================================
CREATE TABLE IF NOT EXISTS public.seller_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  seller_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  tier TEXT NOT NULL CHECK (tier IN ('free', 'basic', 'premium')),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'cancelled', 'expired', 'suspended')),
  starts_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  expires_at TIMESTAMPTZ,
  auto_renew BOOLEAN DEFAULT true,
  payment_method TEXT,
  last_payment_date TIMESTAMPTZ,
  next_billing_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(seller_id)
);

-- RLS for seller subscriptions
ALTER TABLE public.seller_subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Sellers can view their own subscription"
  ON public.seller_subscriptions FOR SELECT
  USING (auth.uid() = seller_id);

CREATE POLICY "Sellers can update their own subscription"
  ON public.seller_subscriptions FOR UPDATE
  USING (auth.uid() = seller_id)
  WITH CHECK (auth.uid() = seller_id);

CREATE POLICY "System can manage all subscriptions"
  ON public.seller_subscriptions FOR ALL
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Index for subscription lookups
CREATE INDEX idx_seller_subscriptions_seller_id ON public.seller_subscriptions(seller_id);
CREATE INDEX idx_seller_subscriptions_status ON public.seller_subscriptions(status);

-- ============================================================
-- 3. GEO-LOCATION FIELDS FOR SERVICES
-- ============================================================
-- Add geo-location columns to services table
ALTER TABLE public.services 
  ADD COLUMN IF NOT EXISTS service_city TEXT,
  ADD COLUMN IF NOT EXISTS service_country TEXT,
  ADD COLUMN IF NOT EXISTS latitude NUMERIC(10, 8),
  ADD COLUMN IF NOT EXISTS longitude NUMERIC(11, 8);

-- Create spatial index for proximity searches
CREATE INDEX IF NOT EXISTS idx_services_location ON public.services(latitude, longitude);

-- ============================================================
-- 4. GEO-LOCATION FIELDS FOR PRODUCTS
-- ============================================================
-- Add geo-location columns to products table
ALTER TABLE public.products 
  ADD COLUMN IF NOT EXISTS product_city TEXT,
  ADD COLUMN IF NOT EXISTS product_country TEXT,
  ADD COLUMN IF NOT EXISTS latitude NUMERIC(10, 8),
  ADD COLUMN IF NOT EXISTS longitude NUMERIC(11, 8);

-- Create spatial index for proximity searches
CREATE INDEX IF NOT EXISTS idx_products_location ON public.products(latitude, longitude);

-- ============================================================
-- 5. ESCROW & PAYMENT TRACKING
-- ============================================================
CREATE TABLE IF NOT EXISTS public.payment_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  seller_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  amount NUMERIC(10, 2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'USD',
  payment_gateway TEXT NOT NULL,
  gateway_transaction_id TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'payment_secured_in_escrow', 'disbursed', 'failed', 'refunded')),
  payment_method TEXT,
  platform_commission NUMERIC(10, 2) DEFAULT 0,
  client_fee NUMERIC(10, 2) DEFAULT 0,
  seller_payout NUMERIC(10, 2),
  disbursement_date TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- RLS for payment transactions
ALTER TABLE public.payment_transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own payment transactions"
  ON public.payment_transactions FOR SELECT
  USING (auth.uid() = user_id OR auth.uid() = seller_id);

CREATE POLICY "Admins can view all payment transactions"
  ON public.payment_transactions FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "System can manage payment transactions"
  ON public.payment_transactions FOR ALL
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Indexes for payment transaction lookups
CREATE INDEX idx_payment_transactions_order_id ON public.payment_transactions(order_id);
CREATE INDEX idx_payment_transactions_user_id ON public.payment_transactions(user_id);
CREATE INDEX idx_payment_transactions_seller_id ON public.payment_transactions(seller_id);
CREATE INDEX idx_payment_transactions_status ON public.payment_transactions(status);

-- ============================================================
-- 6. PRODUCT VIEW TRACKING (for analytics)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.product_views (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  viewer_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  viewer_ip TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- RLS for product views
ALTER TABLE public.product_views ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can create product views"
  ON public.product_views FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Sellers can view analytics for their products"
  ON public.product_views FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.products
      WHERE products.id = product_views.product_id
      AND products.seller_id = auth.uid()
    )
  );

CREATE POLICY "Admins can view all product views"
  ON public.product_views FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

-- Index for product view analytics
CREATE INDEX idx_product_views_product_id ON public.product_views(product_id);
CREATE INDEX idx_product_views_created_at ON public.product_views(created_at);

-- ============================================================
-- 7. ENHANCED ORDER STATUS
-- ============================================================
-- Add escrow-related fields to orders table
ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS order_status TEXT DEFAULT 'pending' CHECK (order_status IN ('pending', 'payment_secured', 'processing', 'shipped', 'delivered', 'completed_by_buyer', 'cancelled', 'refunded')),
  ADD COLUMN IF NOT EXISTS completed_by_buyer_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS disbursement_eligible_at TIMESTAMPTZ;

-- ============================================================
-- 8. TRIGGER FUNCTIONS FOR AUTOMATIC UPDATES
-- ============================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Apply update triggers
DROP TRIGGER IF EXISTS update_monetization_config_updated_at ON public.monetization_config;
CREATE TRIGGER update_monetization_config_updated_at
  BEFORE UPDATE ON public.monetization_config
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_seller_subscriptions_updated_at ON public.seller_subscriptions;
CREATE TRIGGER update_seller_subscriptions_updated_at
  BEFORE UPDATE ON public.seller_subscriptions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_payment_transactions_updated_at ON public.payment_transactions;
CREATE TRIGGER update_payment_transactions_updated_at
  BEFORE UPDATE ON public.payment_transactions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================================
-- 9. DEFAULT SUBSCRIPTION FOR EXISTING SELLERS
-- ============================================================
-- Give all existing sellers a free tier subscription
INSERT INTO public.seller_subscriptions (seller_id, tier, status)
SELECT DISTINCT p.id, 'free', 'active'
FROM public.profiles p
INNER JOIN public.user_roles ur ON ur.user_id = p.id
WHERE ur.role = 'seller'
  AND NOT EXISTS (
    SELECT 1 FROM public.seller_subscriptions ss
    WHERE ss.seller_id = p.id
  )
ON CONFLICT (seller_id) DO NOTHING;

-- ============================================================
-- 10. FUNCTION TO CHECK LISTING LIMIT
-- ============================================================
CREATE OR REPLACE FUNCTION public.check_seller_listing_limit()
RETURNS TRIGGER AS $$
DECLARE
  subscription_tier TEXT;
  listing_limit INTEGER;
  current_listings INTEGER;
BEGIN
  -- Get seller's subscription tier
  SELECT tier INTO subscription_tier
  FROM public.seller_subscriptions
  WHERE seller_id = NEW.seller_id AND status = 'active'
  LIMIT 1;
  
  -- Default to free tier if no subscription found
  IF subscription_tier IS NULL THEN
    subscription_tier := 'free';
  END IF;
  
  -- Get listing limit for tier (-1 means unlimited)
  SELECT (config_value->'subscription_tiers'->subscription_tier->>'listing_limit')::INTEGER
  INTO listing_limit
  FROM public.monetization_config
  WHERE config_key = 'subscription_tiers';
  
  -- If unlimited, allow
  IF listing_limit = -1 THEN
    RETURN NEW;
  END IF;
  
  -- Count current active listings
  SELECT COUNT(*) INTO current_listings
  FROM public.products
  WHERE seller_id = NEW.seller_id AND status = 'active';
  
  -- Check limit
  IF current_listings >= listing_limit THEN
    RAISE EXCEPTION 'Listing limit reached for % tier. Upgrade your subscription to add more products.', subscription_tier;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Apply listing limit trigger
DROP TRIGGER IF EXISTS check_listing_limit_on_insert ON public.products;
CREATE TRIGGER check_listing_limit_on_insert
  BEFORE INSERT ON public.products
  FOR EACH ROW EXECUTE FUNCTION public.check_seller_listing_limit();