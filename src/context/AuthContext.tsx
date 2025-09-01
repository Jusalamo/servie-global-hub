
import { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  userRole: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signUp: (email: string, password: string, userData: any) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  updateProfile: (updates: any) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          // Fetch user profile to get role
          setTimeout(async () => {
            try {
              const { data: profile } = await supabase
                .from('profiles')
                .select('role')
                .eq('id', session.user.id)
                .single();
              
              setUserRole(profile?.role || 'client');
            } catch (error) {
              console.error('Error fetching user role:', error);
              setUserRole('client');
            }
          }, 0);
        } else {
          setUserRole(null);
        }
        
        setIsLoading(false);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (!session) {
        setIsLoading(false);
      }
    });

    return () => subscription.unsubscribe();
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
    // Input validation
    if (!email || !email.includes('@')) {
      const error = new Error('Please provide a valid email address');
      toast.error(error.message);
      return { error };
    }
    
    if (!password) {
      const error = new Error('Please provide a password');
      toast.error(error.message);
      return { error };
    }
    
    const { error } = await supabase.auth.signInWithPassword({
      email: email.toLowerCase().trim(),
      password
    });
    
    if (error) {
      toast.error(error.message);
    } else {
      toast.success('Signed in successfully!');
    }
    
    return { error };
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
    const allowedFields = ['first_name', 'last_name', 'phone', 'bio', 'address', 'city', 'state', 'country', 'postal_code'];
    
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
      toast.success('Profile updated successfully');
    }
  };

  const value = {
    user,
    session,
    userRole,
    isLoading,
    isAuthenticated: !!user,
    signUp,
    signIn,
    signOut,
    updateProfile
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
