import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';

// SECURITY: Explicit column selection to prevent exposing sensitive fields like mfa_secret
const SAFE_PROFILE_COLUMNS = 'id, first_name, last_name, role, phone, bio, business_name, avatar_url, city, state, country, address, whatsapp, postal_code, seller_slug, shop_description, shop_logo_url, created_at, updated_at';

interface UserProfile {
  id: string;
  first_name: string | null;
  last_name: string | null;
  role: string;
  phone: string | null;
  bio: string | null;
  business_name: string | null;
  avatar_url: string | null;
  city: string | null;
  state: string | null;
  country: string | null;
  address: string | null;
  whatsapp: string | null;
  postal_code: string | null;
  created_at: string;
  updated_at: string;
}

export const useUserProfile = () => {
  const { user, isAuthenticated } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!isAuthenticated || !user?.id) {
        setIsLoading(false);
        return;
      }

      try {
        const { data, error: fetchError } = await supabase
          .from('profiles')
          .select(SAFE_PROFILE_COLUMNS)
          .eq('id', user.id)
          .single();

        if (fetchError) {
          throw fetchError;
        }

        setProfile(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching profile:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch profile');
        setProfile(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [user?.id, isAuthenticated]);

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user?.id) return;

    try {
      const { error: updateError } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id);

      if (updateError) {
        throw updateError;
      }

      // Update local state
      setProfile(prev => prev ? { ...prev, ...updates } : null);
      return { success: true };
    } catch (err) {
      console.error('Error updating profile:', err);
      return { 
        success: false, 
        error: err instanceof Error ? err.message : 'Failed to update profile' 
      };
    }
  };

  return {
    profile,
    isLoading,
    error,
    updateProfile,
    displayName: profile ? `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || 'User' : 'User'
  };
};