import { supabase } from '@/integrations/supabase/client';

export interface SubscriptionTier {
  tier: 'free' | 'pro' | 'premium';
  price: number;
  features: {
    max_listings: number; // -1 = unlimited
    advanced_analytics: boolean;
    downloadable_reports: boolean;
    priority_placement: boolean;
    external_integrations: number; // 0, 1, or unlimited (-1)
    custom_branding: boolean;
    dedicated_support: boolean;
    ai_insights: boolean;
  };
}

export const SUBSCRIPTION_TIERS: Record<string, SubscriptionTier> = {
  free: {
    tier: 'free',
    price: 0,
    features: {
      max_listings: 5,
      advanced_analytics: false,
      downloadable_reports: false,
      priority_placement: false,
      external_integrations: 0,
      custom_branding: false,
      dedicated_support: false,
      ai_insights: false
    }
  },
  pro: {
    tier: 'pro',
    price: 24,
    features: {
      max_listings: -1, // unlimited
      advanced_analytics: true,
      downloadable_reports: true,
      priority_placement: true,
      external_integrations: 1,
      custom_branding: true,
      dedicated_support: false,
      ai_insights: false
    }
  },
  premium: {
    tier: 'premium',
    price: 59,
    features: {
      max_listings: -1, // unlimited
      advanced_analytics: true,
      downloadable_reports: true,
      priority_placement: true,
      external_integrations: -1, // unlimited
      custom_branding: true,
      dedicated_support: true,
      ai_insights: true
    }
  }
};

/**
 * Get user's current subscription
 */
export async function getUserSubscription(userId: string): Promise<SubscriptionTier> {
  const { data, error } = await supabase
    .from('seller_subscriptions')
    .select('*')
    .eq('seller_id', userId)
    .eq('status', 'active')
    .maybeSingle();
  
  if (error || !data) {
    return SUBSCRIPTION_TIERS.free;
  }
  
  return SUBSCRIPTION_TIERS[data.tier as keyof typeof SUBSCRIPTION_TIERS] || SUBSCRIPTION_TIERS.free;
}

/**
 * Check if user can create listing based on subscription tier
 */
export async function canCreateListing(userId: string): Promise<{ allowed: boolean; reason?: string }> {
  const subscription = await getUserSubscription(userId);
  
  // Unlimited listings
  if (subscription.features.max_listings === -1) {
    return { allowed: true };
  }
  
  // Check current listing count
  const { count } = await supabase
    .from('products')
    .select('*', { count: 'exact', head: true })
    .eq('seller_id', userId)
    .eq('status', 'active');
  
  if ((count || 0) >= subscription.features.max_listings) {
    return {
      allowed: false,
      reason: `You've reached the listing limit for your ${subscription.tier} plan (${subscription.features.max_listings} listings). Upgrade to create more.`
    };
  }
  
  return { allowed: true };
}

/**
 * Create or upgrade subscription
 */
export async function createSubscription(
  userId: string,
  tier: 'free' | 'pro' | 'premium',
  paymentMethod?: string
): Promise<any> {
  const tierConfig = SUBSCRIPTION_TIERS[tier];
  const expiresAt = new Date();
  expiresAt.setMonth(expiresAt.getMonth() + 1); // Monthly subscription
  
  const { data, error } = await supabase
    .from('seller_subscriptions')
    .upsert({
      seller_id: userId,
      tier,
      status: 'active',
      payment_method: paymentMethod || 'card',
      starts_at: new Date().toISOString(),
      expires_at: expiresAt.toISOString(),
      next_billing_date: expiresAt.toISOString()
    }, {
      onConflict: 'seller_id'
    })
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

/**
 * Cancel subscription
 */
export async function cancelSubscription(userId: string): Promise<void> {
  const { error } = await supabase
    .from('seller_subscriptions')
    .update({
      status: 'cancelled',
      auto_renew: false
    })
    .eq('seller_id', userId);
  
  if (error) throw error;
}

/**
 * Check feature access
 */
export async function hasFeatureAccess(
  userId: string,
  feature: keyof SubscriptionTier['features']
): Promise<boolean> {
  const subscription = await getUserSubscription(userId);
  return !!subscription.features[feature];
}
