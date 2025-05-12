
// API Service Layer for consistent data access

import { supabase } from "@/integrations/supabase/client";
import * as DBTypes from "@/types/database";

// Error handling helper
const handleError = (error: any, message: string) => {
  console.error(`API Error - ${message}:`, error);
  throw new Error(`${message}: ${error.message || 'Unknown error'}`);
};

// User API
export const userApi = {
  getCurrent: async (): Promise<DBTypes.User | null> => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) return null;
      
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();
      
      if (error) throw error;
      
      return data as DBTypes.User;
    } catch (error) {
      handleError(error, 'Failed to fetch current user');
      return null;
    }
  },
  
  update: async (userData: Partial<DBTypes.User>): Promise<DBTypes.User> => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) throw new Error('Not authenticated');
      
      const { data, error } = await supabase
        .from('users')
        .update(userData)
        .eq('id', user.id)
        .select()
        .single();
      
      if (error) throw error;
      
      return data as DBTypes.User;
    } catch (error) {
      handleError(error, 'Failed to update user');
      throw error;
    }
  }
};

// Service API
export const serviceApi = {
  getAll: async (): Promise<DBTypes.Service[]> => {
    try {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .order('featured', { ascending: false });
      
      if (error) throw error;
      
      return data as DBTypes.Service[];
    } catch (error) {
      handleError(error, 'Failed to fetch services');
      return [];
    }
  },
  
  getById: async (id: string): Promise<DBTypes.Service | null> => {
    try {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      
      return data as DBTypes.Service;
    } catch (error) {
      handleError(error, 'Failed to fetch service');
      return null;
    }
  },
  
  getByProvider: async (providerId: string): Promise<DBTypes.Service[]> => {
    try {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .eq('providerId', providerId);
      
      if (error) throw error;
      
      return data as DBTypes.Service[];
    } catch (error) {
      handleError(error, 'Failed to fetch provider services');
      return [];
    }
  },
  
  create: async (service: Omit<DBTypes.Service, 'id'>): Promise<DBTypes.Service> => {
    try {
      const { data, error } = await supabase
        .from('services')
        .insert(service)
        .select()
        .single();
      
      if (error) throw error;
      
      return data as DBTypes.Service;
    } catch (error) {
      handleError(error, 'Failed to create service');
      throw error;
    }
  },
  
  update: async (id: string, service: Partial<DBTypes.Service>): Promise<DBTypes.Service> => {
    try {
      const { data, error } = await supabase
        .from('services')
        .update(service)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      
      return data as DBTypes.Service;
    } catch (error) {
      handleError(error, 'Failed to update service');
      throw error;
    }
  },
  
  delete: async (id: string): Promise<void> => {
    try {
      const { error } = await supabase
        .from('services')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    } catch (error) {
      handleError(error, 'Failed to delete service');
      throw error;
    }
  }
};

// Product API
export const productApi = {
  getAll: async (): Promise<DBTypes.Product[]> => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('featured', { ascending: false });
      
      if (error) throw error;
      
      return data as DBTypes.Product[];
    } catch (error) {
      handleError(error, 'Failed to fetch products');
      return [];
    }
  },
  
  getById: async (id: string): Promise<DBTypes.Product | null> => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      
      return data as DBTypes.Product;
    } catch (error) {
      handleError(error, 'Failed to fetch product');
      return null;
    }
  }
};

// Booking API
export const bookingApi = {
  create: async (booking: Omit<DBTypes.Booking, 'id' | 'createdAt'>): Promise<DBTypes.Booking> => {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .insert({
          ...booking,
          createdAt: new Date().toISOString()
        })
        .select()
        .single();
      
      if (error) throw error;
      
      return data as DBTypes.Booking;
    } catch (error) {
      handleError(error, 'Failed to create booking');
      throw error;
    }
  },
  
  getByUser: async (userId: string): Promise<DBTypes.Booking[]> => {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .eq('clientId', userId)
        .order('dateTime', { ascending: true });
      
      if (error) throw error;
      
      return data as DBTypes.Booking[];
    } catch (error) {
      handleError(error, 'Failed to fetch user bookings');
      return [];
    }
  },
  
  getByProvider: async (providerId: string): Promise<DBTypes.Booking[]> => {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .eq('providerId', providerId)
        .order('dateTime', { ascending: true });
      
      if (error) throw error;
      
      return data as DBTypes.Booking[];
    } catch (error) {
      handleError(error, 'Failed to fetch provider bookings');
      return [];
    }
  }
};

// Message API for future implementation
export const messageApi = {
  // To be implemented when Supabase tables are ready
};

// Export a default API object with all services
const api = {
  user: userApi,
  service: serviceApi,
  product: productApi,
  booking: bookingApi,
  message: messageApi
};

export default api;
