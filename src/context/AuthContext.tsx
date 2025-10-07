
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
      async (event, session) => {
        if (!mounted) return;
        
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          const role = await fetchUserRole(session.user.id);
          const profileData = await fetchUserProfile(session.user.id);
          if (mounted) {
            setUserRole(role);
            setProfile(profileData);
            setIsLoading(false);
          }
        } else {
          if (mounted) {
            setUserRole(null);
            setProfile(null);
            setIsLoading(false);
          }
        }
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
    // Input validation
    if (!email || !email.includes('@')) {
      const error = new Error('Please provide a valid email address');
      toast.error(error.message);
      return { error };
    }
    
    if (!password || password.length < 6) {
      const error = new Error('Password must be at least 6 characters long');
      toast.error(error.message);
      return { error };
    }
    
    const redirectUrl = `${window.location.origin}/`;
    
    const { error } = await supabase.auth.signUp({
      email: email.toLowerCase().trim(),
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: {
          first_name: userData.firstName?.trim() || '',
          last_name: userData.lastName?.trim() || '',
          role: userData.role || 'client',
          phone: userData.phone?.trim() || '',
          business_description: userData.businessDescription?.trim() || '',
          business_name: userData.businessName?.trim() || ''
        }
      }
    });
    
    if (error) {
      toast.error(error.message);
    } else {
      toast.success('Account created successfully! Please check your email to verify your account.');
    }
    
    return { error };
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
      toast.success('Signed out successfully');
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
