
import React, { createContext, useState, useContext, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
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
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userRole, setUserRole] = useState<string | null>(null);
  const { toast: uiToast } = useToast();

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        console.log('Auth state changed:', event, !!currentSession?.user);
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        
        if (currentSession?.user) {
          await fetchUserRole(currentSession.user.id);
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
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        
        if (currentSession?.user) {
          await fetchUserRole(currentSession.user.id);
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

  const fetchUserRole = async (userId: string) => {
    try {
      console.log('Fetching user role for:', userId);
      const { data, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', userId)
        .maybeSingle();

      if (error) {
        console.error('Error fetching user role:', error);
        // Set default role if profile doesn't exist
        await createDefaultProfile(userId, 'client');
        return;
      }

      if (data?.role) {
        console.log('User role found:', data.role);
        setUserRole(data.role);
      } else {
        // If no role found, create default profile
        console.log('No role found, creating default profile');
        await createDefaultProfile(userId, 'client');
      }
    } catch (error) {
      console.error('Error in fetchUserRole:', error);
      // Fallback to client role
      setUserRole('client');
    }
  };

  const createDefaultProfile = async (userId: string, defaultRole: string = 'client') => {
    try {
      const { data: userData } = await supabase.auth.getUser();
      const user = userData.user;
      
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: userId,
          first_name: user?.user_metadata?.first_name || 'User',
          last_name: user?.user_metadata?.last_name || '',
          role: defaultRole,
          updated_at: new Date().toISOString()
        });

      if (error) {
        console.error('Error creating default profile:', error);
      } else {
        setUserRole(defaultRole);
        console.log('Default profile created with role:', defaultRole);
      }
    } catch (error) {
      console.error('Error in createDefaultProfile:', error);
      setUserRole(defaultRole);
    }
  };

  const createOrUpdateProfile = async (userId: string, userData: Partial<UserData>) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: userId,
          first_name: userData.first_name,
          last_name: userData.last_name,
          role: userData.role,
          updated_at: new Date().toISOString()
        });

      if (error) {
        console.error('Error updating profile:', error);
        throw error;
      }
      
      setUserRole(userData.role || null);
    } catch (error) {
      console.error('Error in createOrUpdateProfile:', error);
      throw error;
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      
      // Development bypass for testing
      if (process.env.NODE_ENV === 'development' && 
          (email.includes('provider') || email.includes('seller') || email.includes('client'))) {
        
        const role = email.includes('provider') 
          ? 'provider' 
          : email.includes('seller') 
            ? 'seller' 
            : 'client';
        
        setUserRole(role);
        
        const mockUser = {
          id: 'dev-user-123',
          email: email,
          user_metadata: {
            first_name: 'Test',
            last_name: 'User',
            role: role
          }
        };
        
        setUser(mockUser as unknown as User);
        toast.success("Development login successful!");
        return;
      }
      
      // Real authentication
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw new Error(error.message);
      }
      
      // User role will be fetched automatically via onAuthStateChange
      toast.success("Signed in successfully!");
      
    } catch (error) {
      console.error('Error signing in:', error);
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error("An error occurred while signing in");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (userData: UserData) => {
    try {
      setIsLoading(true);
      
      // Development bypass
      if (process.env.NODE_ENV === 'development') {
        const role = userData.role || 'client';
        setUserRole(role);
        
        const mockUser = {
          id: 'dev-user-' + Math.random().toString(36).substring(2, 9),
          email: userData.email,
          user_metadata: {
            first_name: userData.first_name,
            last_name: userData.last_name,
            role: role
          }
        };
        
        setUser(mockUser as unknown as User);
        toast.success("Development signup successful!");
        return;
      }
      
      // Real signup
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
        throw new Error(error.message);
      }

      if (data.user) {
        await createOrUpdateProfile(data.user.id, userData);
        toast.success("Registration successful!");
      } else {
        toast.info("Please check your email for verification.");
      }
    } catch (error) {
      console.error('Error signing up:', error);
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error("An unexpected error occurred during signup");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setIsLoading(true);
      
      // Development bypass
      if (process.env.NODE_ENV === 'development' && !session) {
        setUser(null);
        setUserRole(null);
        toast.success("Signed out successfully");
        return;
      }
      
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        throw error;
      }
      
      setUser(null);
      setUserRole(null);
      toast.success("Signed out successfully");
      
    } catch (error) {
      console.error('Error signing out:', error);
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error("An error occurred while signing out");
      }
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
