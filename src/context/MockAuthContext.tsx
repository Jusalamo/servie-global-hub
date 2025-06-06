
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'client' | 'provider' | 'seller';
  avatar?: string;
}

interface MockAuthContextType {
  user: User | null;
  signIn: (email: string, password: string, role?: 'client' | 'provider' | 'seller') => Promise<void>;
  signUp: (email: string, password: string, name: string, role: 'client' | 'provider' | 'seller') => Promise<void>;
  signOut: () => void;
  isLoading: boolean;
  mockMode: boolean;
  toggleMockMode: () => void;
}

const MockAuthContext = createContext<MockAuthContextType | undefined>(undefined);

export function MockAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    // Check if we have a mock user in localStorage
    const savedUser = localStorage.getItem('mockUser');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [mockMode, setMockMode] = useState(() => {
    return localStorage.getItem('mockMode') === 'true';
  });

  const toggleMockMode = () => {
    const newMockMode = !mockMode;
    setMockMode(newMockMode);
    localStorage.setItem('mockMode', newMockMode.toString());
    
    if (!newMockMode) {
      // Clear mock user when disabling mock mode
      setUser(null);
      localStorage.removeItem('mockUser');
    }
  };

  const signIn = async (email: string, password: string, role: 'client' | 'provider' | 'seller' = 'client') => {
    setIsLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (mockMode) {
      const mockUser: User = {
        id: `mock-${Date.now()}`,
        email,
        name: email.split('@')[0],
        role,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`
      };
      
      setUser(mockUser);
      localStorage.setItem('mockUser', JSON.stringify(mockUser));
    }
    
    setIsLoading(false);
  };

  const signUp = async (email: string, password: string, name: string, role: 'client' | 'provider' | 'seller') => {
    setIsLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (mockMode) {
      const mockUser: User = {
        id: `mock-${Date.now()}`,
        email,
        name,
        role,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`
      };
      
      setUser(mockUser);
      localStorage.setItem('mockUser', JSON.stringify(mockUser));
    }
    
    setIsLoading(false);
  };

  const signOut = () => {
    setUser(null);
    localStorage.removeItem('mockUser');
  };

  return (
    <MockAuthContext.Provider value={{
      user,
      signIn,
      signUp,
      signOut,
      isLoading,
      mockMode,
      toggleMockMode
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
