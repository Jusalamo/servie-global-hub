import { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

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
  // KYC and Security fields
  kyc_status?: string | null;
  kyc_document_url?: string | null;
  kyc_submitted_at?: string | null;
  kyc_verified_at?: string | null;
  two_fa_enabled?: boolean;
  two_fa_verified_at?: string | null;
  bank_account_verified?: boolean;
  bank_account_verified_at?: string | null;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  userRole: string | null;
  profile: UserProfile | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signUp: (email: string, password: string, userData: any) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  updateProfile: (updates: any) => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUserRole = async (userId: string) => {
    try {
      // CRITICAL SECURITY: Fetch role from separate user_roles table to prevent privilege escalation
      const { data: userRoleData, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId)
        .maybeSingle();
      
      if (error) {
        console.error('Error fetching user role:', error);
        return 'client'; // Default to client on error
      }
      
      return userRoleData?.role || 'client';
    } catch (error) {
      console.error('Error with role fetch:', error);
      return 'client';
    }
  };

  const fetchUserProfile = async (userId: string) => {
    try {
      const { data: profileData, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();
      
      if (error) {
        console.error('Error fetching profile:', error);
        return null;
      }
      
      return profileData;
    } catch (error) {
      console.error('Error with profile fetch:', error);
      return null;
    }
  };

  const refreshProfile = async () => {
    if (!user?.id) return;
    const profileData = await fetchUserProfile(user.id);
    if (profileData) {
      setProfile(profileData);
    }
  };

  useEffect(() => {
    let mounted = true;

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (!mounted) return;
        
        setSession(session);
        setUser(session?.user ?? null);

        if (!session?.user) {
          setUserRole(null);
          setProfile(null);
          setIsLoading(false);
          return;
        }

        // Defer Supabase calls to avoid deadlocks in auth callback
        setTimeout(() => {
          if (!mounted || !session?.user) return;
          
          fetchUserRole(session.user.id)
            .then((role) => {
              if (mounted) setUserRole(role);
            })
            .catch((err) => {
              console.error('Error fetching user role (deferred):', err);
            });

          fetchUserProfile(session.user.id)
            .then((profileData) => {
              if (mounted && profileData) setProfile(profileData);
            })
            .catch((err) => {
              console.error('Error fetching profile (deferred):', err);
            })
            .finally(() => {
              if (mounted) setIsLoading(false);
            });
        }, 0);
      }
    );

    // Check for existing session
    const initAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!mounted) return;
        
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          const role = await fetchUserRole(session.user.id);
          const profileData = await fetchUserProfile(session.user.id);
          if (mounted) {
            setUserRole(role);
            setProfile(profileData);
          }
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    initAuth();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signUp = async (email: string, password: string, userData: any) => {
    try {
      // Input validation
      if (!email || !email.includes('@')) {
        const error = new Error('Please provide a valid email address');
        return { error };
      }
      
      if (!password || password.length < 8) {
        const error = new Error('Password must be at least 8 characters long');
        return { error };
      }

      // Validate required fields for role
      if (!userData.firstName || !userData.lastName) {
        const error = new Error('First name and last name are required');
        return { error };
      }
      
      const redirectUrl = `${window.location.origin}/`;
      
      // ⭐️ FIX APPLIED HERE: Map the camelCase keys received from the form
      // to the snake_case keys your PostgreSQL trigger expects.
      const { error, data } = await supabase.auth.signUp({
        email: email.toLowerCase().trim(),
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            first_name: userData.firstName?.trim() || '', // Changed to userData.firstName
            last_name: userData.lastName?.trim() || '',   // Changed to userData.lastName
            role: userData.role || 'client',
            phone: userData.phone_number?.trim() || '',  // ⬅️ CRITICAL FIX: Changed to userData.phone_number
            business_description: userData.businessDescription?.trim() || '',
            business_name: userData.businessName?.trim() || ''
          }
        }
      });
      
      if (error) {
        console.error('Sign up error:', error);
        return { error };
      }
      
      return { error: null, data };
    } catch (err) {
      console.error('Unexpected sign up error:', err);
      const error = err instanceof Error ? err : new Error('An unexpected error occurred during sign up');
      return { error };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      // Input validation
      if (!email || !email.includes('@')) {
        const error = new Error('Please provide a valid email address');
        return { error };
      }
      
      if (!password) {
        const error = new Error('Please provide a password');
        return { error };
      }
      
      setIsLoading(true);
      
      const { error } = await supabase.auth.signInWithPassword({
        email: email.toLowerCase().trim(),
        password
      });
      
      return { error };
    } catch (error) {
      console.error('Sign in error:', error);
      return { error };
    }
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error('Error signing out');
    } else {
      // Clear state immediately
      setUser(null);
      setSession(null);
      setUserRole(null);
      setProfile(null);
      toast.success('Signed out successfully');
      // Redirect to home page
      window.location.href = '/';
    }
  };

  const updateProfile = async (updates: any) => {
    if (!user) throw new Error('No user found');
    
    // Sanitize and validate updates
    const sanitizedUpdates: any = {};
    const allowedFields = ['first_name', 'last_name', 'phone', 'bio', 'address', 'city', 'state', 'country', 'postal_code', 'whatsapp', 'business_name', 'avatar_url'];
    
    for (const [key, value] of Object.entries(updates)) {
      if (allowedFields.includes(key) && value !== undefined) {
        sanitizedUpdates[key] = typeof value === 'string' ? (value as string).trim() : value;
      }
    }
    
    const { error } = await supabase
      .from('profiles')
      .update(sanitizedUpdates)
      .eq('id', user.id);
    
    if (error) {
      toast.error('Failed to update profile');
      throw error;
    } else {
      // Refresh profile data after successful update
      await refreshProfile();
      toast.success('Profile updated successfully');
    }
  };

  const value = {
    user,
    session,
    userRole,
    profile,
    isLoading,
    isAuthenticated: !!user,
    signUp,
    signIn,
    signOut,
    updateProfile,
    refreshProfile
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
