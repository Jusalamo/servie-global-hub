import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { getUserSubscription, canCreateListing, SubscriptionTier } from '@/services/subscriptionAPI';
import { SUBSCRIPTION_TIERS } from '@/services/subscriptionAPI';

export const useSubscription = () => {
  const { user } = useAuth();
  const [subscription, setSubscription] = useState<SubscriptionTier>(SUBSCRIPTION_TIERS.free);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadSubscription();
    } else {
      setSubscription(SUBSCRIPTION_TIERS.free);
      setLoading(false);
    }
  }, [user]);

  const loadSubscription = async () => {
    if (!user) return;
    
    try {
      const sub = await getUserSubscription(user.id);
      setSubscription(sub);
    } catch (error) {
      console.error('Error loading subscription:', error);
      setSubscription(SUBSCRIPTION_TIERS.free);
    } finally {
      setLoading(false);
    }
  };

  const checkListingAccess = async () => {
    if (!user) return { allowed: false, reason: 'Please sign in' };
    return await canCreateListing(user.id);
  };

  const hasFeature = (feature: keyof SubscriptionTier['features']): boolean => {
    return !!subscription.features[feature];
  };

  return {
    subscription,
    loading,
    checkListingAccess,
    hasFeature,
    refreshSubscription: loadSubscription
  };
};
