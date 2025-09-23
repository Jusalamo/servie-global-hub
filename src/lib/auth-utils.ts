import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

/**
 * Utility functions for authentication and profile management
 */

export const profileUtils = {
  /**
   * Fetch user profile with error handling
   */
  async getProfile(userId: string) {
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();
      
      if (error) {
        console.error('Error fetching profile:', error);
        throw error;
      }
      
      return profile;
    } catch (error) {
      console.error('Profile fetch error:', error);
      return null;
    }
  },

  /**
   * Create or update user profile
   */
  async upsertProfile(profileData: any) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .upsert(profileData, { 
          onConflict: 'id',
          ignoreDuplicates: false 
        })
        .select()
        .single();
      
      if (error) {
        console.error('Error upserting profile:', error);
        throw error;
      }
      
      return data;
    } catch (error) {
      console.error('Profile upsert error:', error);
      throw error;
    }
  },

  /**
   * Update specific profile fields
   */
  async updateProfile(userId: string, updates: any) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', userId)
        .select()
        .single();
      
      if (error) {
        console.error('Error updating profile:', error);
        throw error;
      }
      
      toast.success('Profile updated successfully');
      return data;
    } catch (error) {
      console.error('Profile update error:', error);
      toast.error('Failed to update profile');
      throw error;
    }
  }
};

/**
 * Role-based utilities
 */
export const roleUtils = {
  getDashboardPath(role: string): string {
    switch (role) {
      case 'provider':
        return '/dashboard/provider?tab=overview';
      case 'seller':
        return '/dashboard/seller?tab=overview';
      case 'client':
      default:
        return '/dashboard/client';
    }
  },

  getRoleDisplayName(role: string): string {
    switch (role) {
      case 'provider':
        return 'Service Provider';
      case 'seller':
        return 'Product Seller';
      case 'client':
        return 'Client';
      case 'admin':
        return 'Administrator';
      default:
        return 'User';
    }
  },

  isValidRole(role: string): boolean {
    return ['client', 'provider', 'seller', 'admin'].includes(role);
  }
};

/**
 * Authentication state utilities
 */
export const authStateUtils = {
  /**
   * Check if user session is valid
   */
  async validateSession() {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) {
        console.error('Session validation error:', error);
        return false;
      }
      return !!session;
    } catch (error) {
      console.error('Session check error:', error);
      return false;
    }
  },

  /**
   * Refresh current session
   */
  async refreshSession() {
    try {
      const { data, error } = await supabase.auth.refreshSession();
      if (error) {
        console.error('Session refresh error:', error);
        return false;
      }
      return !!data.session;
    } catch (error) {
      console.error('Session refresh error:', error);
      return false;
    }
  }
};