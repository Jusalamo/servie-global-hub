
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
  const navigate = useNavigate();

  useEffect(() => {
    // Set up auth state listener first
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        console.log('Auth state changed:', event, !!currentSession?.user);
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        
        if (currentSession?.user) {
          // Use setTimeout to avoid recursive update issues
          setTimeout(() => {
            fetchUserRole(currentSession.user.id);
          }, 0);
        } else {
          setUserRole(null);
        }
      }
    );

    // Then check for existing session
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
        return;
      }

      console.log('User role data:', data);
      setUserRole(data?.role || null);
    } catch (error) {
      console.error('Error in fetchUserRole:', error);
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
      
      // Update local state immediately
      setUserRole(userData.role || null);
    } catch (error) {
      console.error('Error in createOrUpdateProfile:', error);
      throw error;
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      
      // For development, allow any email with a specific role format
      if (process.env.NODE_ENV === 'development' && 
          (email.includes('provider') || email.includes('seller') || email.includes('client'))) {
        
        // Mock sign in for development
        const role = email.includes('provider') 
          ? 'provider' 
          : email.includes('seller') 
            ? 'seller' 
            : 'client';
        
        setUserRole(role);
        
        // Create a mock user for development
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
        setIsLoading(false);
        
        toast.success("Development login successful!");
        return;
      }
      
      // Real authentication for production
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        uiToast({
          title: "Login failed",
          description: error.message,
          variant: "destructive",
        });
        throw new Error(error.message);
      }
      
      // User will be updated automatically via the onAuthStateChange listener
      return;
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
      
      // For development environment, mock signup
      if (process.env.NODE_ENV === 'development') {
        // Create mock user
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
        setIsLoading(false);
        
        toast.success("Development signup successful!");
        return;
      }
      
      // Real signup for production
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
        uiToast({
          title: "Registration failed",
          description: error.message,
          variant: "destructive",
        });
        throw new Error(error.message);
      }

      // Create profile record
      if (data.user) {
        await createOrUpdateProfile(data.user.id, userData);
        toast.success("Registration successful!");
        return;
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
      
      // For development, just clear the state
      if (process.env.NODE_ENV === 'development' && !session) {
        setUser(null);
        setUserRole(null);
        setIsLoading(false);
        toast.success("Signed out successfully");
        return;
      }
      
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        uiToast({
          title: "Sign out failed",
          description: error.message,
          variant: "destructive",
        });
        throw error;
      }
      
      // Clear local state
      setUser(null);
      setUserRole(null);
      toast.success("Signed out successfully");
      
      return;
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
