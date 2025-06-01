
import React, { createContext, useState, useContext, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { toast } from 'sonner';

type UserData = {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  role: 'client' | 'provider' | 'seller';
};

type AuthContextType = {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (userData: UserData) => Promise<void>;
  signOut: () => Promise<void>;
  isAuthenticated: boolean;
  userRole: string | null;
  bypassAuth: (role: 'client' | 'provider' | 'seller') => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userRole, setUserRole] = useState<string | null>(null);
  const { toast: uiToast } = useToast();

  // Check for bypassed auth on load
  useEffect(() => {
    const bypassedAuth = localStorage.getItem('bypassed_auth');
    if (bypassedAuth) {
      const authData = JSON.parse(bypassedAuth);
      setUser(authData.user);
      setUserRole(authData.role);
      setIsLoading(false);
      return;
    }

    // Set up auth state listener for real auth
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        console.log('Auth state changed:', event, !!currentSession?.user);
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        
        if (currentSession?.user) {
          await fetchUserRole(currentSession.user);
        } else {
          setUserRole(null);
        }
        setIsLoading(false);
      }
    );

    // Check for existing session
    const initializeAuth = async () => {
      try {
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        console.log('Initial session check:', !!currentSession?.user);
        
        if (currentSession?.user) {
          setSession(currentSession);
          setUser(currentSession.user);
          await fetchUserRole(currentSession.user);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchUserRole = async (currentUser: User) => {
    try {
      console.log('Fetching user role for:', currentUser.id, currentUser.email);
      
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('role, first_name, last_name')
        .eq('id', currentUser.id)
        .maybeSingle();

      if (error) {
        console.error('Error fetching user profile:', error);
        // Set default role if profile fetch fails
        setUserRole('client');
        return;
      }

      if (profile) {
        console.log('Found existing profile:', profile);
        setUserRole(profile.role);
      } else {
        // Create profile with default role
        const role = determineRoleFromEmail(currentUser.email || '');
        
        const { error: insertError } = await supabase
          .from('profiles')
          .insert({
            id: currentUser.id,
            email: currentUser.email,
            first_name: currentUser.user_metadata?.first_name || 'User',
            last_name: currentUser.user_metadata?.last_name || '',
            role: role,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          });

        if (insertError) {
          console.error('Error creating profile:', insertError);
          setUserRole('client'); // Fallback to client role
        } else {
          console.log('Created new profile with role:', role);
          setUserRole(role);
        }
      }
    } catch (error) {
      console.error('Error in fetchUserRole:', error);
      setUserRole('client'); // Fallback to client role
    }
  };

  const determineRoleFromEmail = (email: string): 'client' | 'provider' | 'seller' => {
    if (email.includes('provider')) return 'provider';
    if (email.includes('seller')) return 'seller';
    return 'client';
  };

  // Bypass authentication for testing
  const bypassAuth = (role: 'client' | 'provider' | 'seller') => {
    const mockUser = {
      id: 'test-user-' + Date.now(),
      email: `test.${role}@example.com`,
      user_metadata: {
        first_name: 'Test',
        last_name: 'User',
        role: role
      }
    };
    
    setUser(mockUser as unknown as User);
    setUserRole(role);
    setIsLoading(false);
    
    // Store in localStorage for persistence
    localStorage.setItem('bypassed_auth', JSON.stringify({
      user: mockUser,
      role: role
    }));
    
    toast.success(`Signed in as test ${role}`);
  };

  const signIn = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Sign in error:', error);
        throw new Error(error.message);
      }
      
      if (data.user) {
        toast.success("Successfully signed in!");
      }
    } catch (error) {
      console.error('Error signing in:', error);
      toast.error(error instanceof Error ? error.message : "Failed to sign in");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (userData: UserData) => {
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
        options: {
          data: {
            first_name: userData.first_name,
            last_name: userData.last_name,
            role: userData.role,
          },
        },
      });

      if (error) {
        console.error('Sign up error:', error);
        throw new Error(error.message);
      }

      if (data.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: data.user.id,
            email: userData.email,
            first_name: userData.first_name,
            last_name: userData.last_name,
            role: userData.role,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          });

        if (profileError) {
          console.error('Error creating profile:', profileError);
        }

        setUserRole(userData.role);
        toast.success("Account created successfully!");
      }
    } catch (error) {
      console.error('Error signing up:', error);
      toast.error(error instanceof Error ? error.message : "Failed to create account");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setIsLoading(true);
      
      // Clear bypassed auth
      localStorage.removeItem('bypassed_auth');
      
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        throw error;
      }
      
      setUser(null);
      setUserRole(null);
      toast.success("Signed out successfully");
    } catch (error) {
      console.error('Error signing out:', error);
      toast.error("Failed to sign out");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        isLoading,
        signIn,
        signUp,
        signOut,
        isAuthenticated: !!user,
        userRole,
        bypassAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
