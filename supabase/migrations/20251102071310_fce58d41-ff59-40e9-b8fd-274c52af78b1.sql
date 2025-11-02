-- ============================================
-- Priority 1: Critical Infrastructure Fixes
-- ============================================

-- Fix cart persistence with unique constraint
DROP INDEX IF EXISTS cart_items_user_product_unique;
CREATE UNIQUE INDEX cart_items_user_product_unique ON cart_items(user_id, product_id);

-- Add shipping and logistics fields to products table
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS shipping_type TEXT DEFAULT 'fixed' CHECK (shipping_type IN ('free', 'fixed')),
ADD COLUMN IF NOT EXISTS shipping_cost NUMERIC DEFAULT 0,
ADD COLUMN IF NOT EXISTS shipping_policy TEXT,
ADD COLUMN IF NOT EXISTS return_policy TEXT,
ADD COLUMN IF NOT EXISTS delivery_time TEXT,
ADD COLUMN IF NOT EXISTS weight NUMERIC,
ADD COLUMN IF NOT EXISTS dimensions JSONB;

-- Add tracking info to orders table
ALTER TABLE orders
ADD COLUMN IF NOT EXISTS tracking_number TEXT,
ADD COLUMN IF NOT EXISTS carrier TEXT,
ADD COLUMN IF NOT EXISTS shipping_status TEXT DEFAULT 'pending' CHECK (shipping_status IN ('pending', 'processing', 'shipped', 'delivered', 'cancelled'));

-- Update subscription tiers in monetization_config
INSERT INTO monetization_config (config_key, description, config_value, is_active)
VALUES (
  'subscription_tiers',
  'Seller subscription pricing and features',
  '{
    "free": {
      "tier": "free",
      "price": 0,
      "features": {
        "max_listings": 5,
        "advanced_analytics": false,
        "downloadable_reports": false,
        "priority_placement": false,
        "external_integrations": 0,
        "custom_branding": false,
        "dedicated_support": false,
        "ai_insights": false
      }
    },
    "pro": {
      "tier": "pro",
      "price": 24,
      "features": {
        "max_listings": -1,
        "advanced_analytics": true,
        "downloadable_reports": true,
        "priority_placement": true,
        "external_integrations": 1,
        "custom_branding": true,
        "dedicated_support": false,
        "ai_insights": false
      }
    },
    "premium": {
      "tier": "premium",
      "price": 59,
      "features": {
        "max_listings": -1,
        "advanced_analytics": true,
        "downloadable_reports": true,
        "priority_placement": true,
        "external_integrations": -1,
        "custom_branding": true,
        "dedicated_support": true,
        "ai_insights": true
      }
    }
  }'::jsonb,
  true
)
ON CONFLICT (config_key) DO UPDATE 
SET config_value = EXCLUDED.config_value,
    updated_at = now();

-- Add AI listing fields to products (for Premium tier)
ALTER TABLE products
ADD COLUMN IF NOT EXISTS ai_generated_title TEXT,
ADD COLUMN IF NOT EXISTS ai_generated_description TEXT,
ADD COLUMN IF NOT EXISTS ai_suggested_category TEXT,
ADD COLUMN IF NOT EXISTS ai_optimization_score NUMERIC;

-- Create table for tracking AI listing assistance usage
CREATE TABLE IF NOT EXISTS ai_listing_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  usage_type TEXT NOT NULL CHECK (usage_type IN ('title', 'description', 'category', 'optimization')),
  tokens_used INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on ai_listing_usage
ALTER TABLE ai_listing_usage ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own AI usage"
  ON ai_listing_usage FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "System can manage AI usage"
  ON ai_listing_usage FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_products_shipping_type ON products(shipping_type);
CREATE INDEX IF NOT EXISTS idx_orders_tracking ON orders(tracking_number);
CREATE INDEX IF NOT EXISTS idx_orders_shipping_status ON orders(shipping_status);
CREATE INDEX IF NOT EXISTS idx_ai_listing_usage_user ON ai_listing_usage(user_id);

-- Update payment split rates to exact values (9% platform, 3.9% + $0.30 PSP)
COMMENT ON COLUMN payment_splits.platform_commission_rate IS 'Platform commission rate: 9.0% (0.09)';
COMMENT ON COLUMN payment_splits.psp_fee_rate IS 'PSP variable fee rate: 3.9% (0.039)';
COMMENT ON COLUMN payment_splits.psp_fixed_fee IS 'PSP fixed fee: $0.30';

-- ============================================
-- Priority 2: Enhanced Security & Validation
-- ============================================

-- Ensure strong KYC enforcement trigger exists and is correct
DROP TRIGGER IF EXISTS enforce_kyc_2fa_before_listing ON products;
CREATE TRIGGER enforce_kyc_2fa_before_listing
  BEFORE INSERT OR UPDATE ON products
  FOR EACH ROW
  EXECUTE FUNCTION check_kyc_requirement();