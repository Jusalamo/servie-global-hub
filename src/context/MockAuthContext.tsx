
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { toast } from 'sonner';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'client' | 'provider' | 'seller' | 'admin';
  avatar?: string;
}

interface MockAuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  userRole: string | null;
  signIn: (email: string, password: string, role?: string) => Promise<void>;
  signUp: (email: string, password: string, name: string, role?: string) => Promise<void>;
  signOut: () => void;
  updateUserRole: (role: string) => void;
  // Mock auth toggle
  isMockMode: boolean;
  toggleMockMode: () => void;
  mockSignIn: (role?: string) => void;
}

const MockAuthContext = createContext<MockAuthContextType | undefined>(undefined);

// Mock users for different roles
const mockUsers: { [key: string]: User } = {
  client: {
    id: 'mock-client-1',
    email: 'client@example.com',
    name: 'John Client',
    role: 'client'
  },
  provider: {
    id: 'mock-provider-1',
    email: 'provider@example.com',
    name: 'Jane Provider',
    role: 'provider'
  },
  seller: {
    id: 'mock-seller-1',
    email: 'seller@example.com',
    name: 'Mike Seller',
    role: 'seller'
  },
  admin: {
    id: 'mock-admin-1',
    email: 'admin@example.com',
    name: 'Admin User',
    role: 'admin'
  }
};

export function MockAuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [isMockMode, setIsMockMode] = useState<boolean>(true); // Default to mock mode for development

  // Initialize from localStorage
  useEffect(() => {
    const savedAuth = localStorage.getItem('mockAuth');
    const savedMockMode = localStorage.getItem('mockMode');
    
    if (savedMockMode) {
      setIsMockMode(JSON.parse(savedMockMode));
    }
    
    if (savedAuth && isMockMode) {
      const authData = JSON.parse(savedAuth);
      setIsAuthenticated(authData.isAuthenticated);
      setUser(authData.user);
    }
  }, [isMockMode]);

  // Save to localStorage whenever auth state changes
  useEffect(() => {
    if (isMockMode) {
      localStorage.setItem('mockAuth', JSON.stringify({ isAuthenticated, user }));
    }
  }, [isAuthenticated, user, isMockMode]);

  const signIn = async (email: string, password: string, role?: string): Promise<void> => {
    if (isMockMode) {
      // Mock sign in - always succeeds
      const userRole = role || 'client';
      const mockUser = mockUsers[userRole] || mockUsers.client;
      
      setUser({ ...mockUser, email });
      setIsAuthenticated(true);
      toast.success(`Mock sign in successful as ${userRole}!`);
      return;
    }
    
    // Real authentication would go here
    throw new Error('Real authentication not implemented yet');
  };

  const signUp = async (email: string, password: string, name: string, role?: string): Promise<void> => {
    if (isMockMode) {
      // Mock sign up - always succeeds
      const userRole = role || 'client';
      const newUser: User = {
        id: `mock-${userRole}-${Date.now()}`,
        email,
        name,
        role: userRole as User['role']
      };
      
      setUser(newUser);
      setIsAuthenticated(true);
      toast.success(`Mock account created successfully as ${userRole}!`);
      return;
    }
    
    // Real authentication would go here
    throw new Error('Real authentication not implemented yet');
  };

  const signOut = () => {
    setIsAuthenticated(false);
    setUser(null);
    if (isMockMode) {
      localStorage.removeItem('mockAuth');
    }
    toast.success('Signed out successfully!');
  };

  const updateUserRole = (role: string) => {
    if (user && isMockMode) {
      const updatedUser = { ...user, role: role as User['role'] };
      setUser(updatedUser);
      toast.success(`Role updated to ${role}!`);
    }
  };

  const toggleMockMode = () => {
    const newMockMode = !isMockMode;
    setIsMockMode(newMockMode);
    localStorage.setItem('mockMode', JSON.stringify(newMockMode));
    
    if (!newMockMode) {
      // When disabling mock mode, sign out
      signOut();
    }
    
    toast.success(`Mock mode ${newMockMode ? 'enabled' : 'disabled'}!`);
  };

  const mockSignIn = (role?: string) => {
    if (!isMockMode) return;
    
    const userRole = role || 'client';
    const mockUser = mockUsers[userRole] || mockUsers.client;
    
    setUser(mockUser);
    setIsAuthenticated(true);
    toast.success(`Mock signed in as ${userRole}!`);
  };

  return (
    <MockAuthContext.Provider value={{
      isAuthenticated,
      user,
      userRole: user?.role || null,
      signIn,
      signUp,
      signOut,
      updateUserRole,
      isMockMode,
      toggleMockMode,
      mockSignIn
    }}>
      {children}
    </MockAuthContext.Provider>
  );
}

export function useMockAuth() {
  const context = useContext(MockAuthContext);
  if (context === undefined) {
    throw new Error('useMockAuth must be used within a MockAuthProvider');
  }
  return context;
}
