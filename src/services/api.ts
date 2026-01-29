
// API Service Layer for consistent data access

import { supabase } from "@/integrations/supabase/client";
import * as DBTypes from "@/types/database";

// SECURITY: Explicit column selection to prevent exposing sensitive fields like mfa_secret
const SAFE_PROFILE_COLUMNS = 'id, first_name, last_name, role, phone, bio, business_name, avatar_url, city, state, country, address, whatsapp, postal_code, seller_slug, shop_description, shop_logo_url, created_at, updated_at';

// Error handling helper
const handleError = (error: any, message: string) => {
  console.error(`API Error - ${message}:`, error);
  throw new Error(`${message}: ${error.message || 'Unknown error'}`);
};

// Helper to map database profile to our User type
const mapProfileToUser = (profile: any): DBTypes.User => {
  return {
    id: profile.id,
    email: '', // Email comes from auth, not profiles table
    firstName: profile.first_name || '',
    lastName: profile.last_name || '',
    avatar: profile.avatar_url,
    role: profile.role as DBTypes.User['role'],
    createdAt: profile.created_at,
    lastLoginAt: profile.updated_at
  };
};

// Helper to map database service to our Service type
const mapDBServiceToService = (dbService: any): DBTypes.Service => {
  return {
    id: dbService.id,
    providerId: dbService.provider_id,
    name: dbService.title,
    description: dbService.description,
    price: dbService.price,
    duration: 60, // Default duration if not available in DB
    category: dbService.category_id,
    images: [],  // We'll need to fetch these separately
    rating: 0,   // Calculate this from reviews if needed
    reviewCount: 0,
    featured: dbService.featured || false,
    availableOnline: false
  };
};

// Helper to map our Service type to database service format
const mapServiceToDBService = (service: Partial<DBTypes.Service>): any => {
  return {
    provider_id: service.providerId,
    title: service.name,
    description: service.description,
    price: service.price,
    category_id: service.category,
    featured: service.featured,
  };
};

// Helper to map database booking to our Booking type
const mapDBBookingToBooking = (dbBooking: any): DBTypes.Booking => {
  return {
    id: dbBooking.id,
    clientId: dbBooking.client_id,
    providerId: '', // This may need to be fetched from the service
    serviceId: dbBooking.service_id,
    status: dbBooking.status as DBTypes.Booking['status'],
    dateTime: dbBooking.booking_date + 'T' + dbBooking.booking_time,
    duration: 60, // Default if not in DB
    price: 0, // This might need to come from the service
    address: '', // This might be available in additional data
    notes: dbBooking.notes || '',
    createdAt: dbBooking.created_at
  };
};

// User API
export const userApi = {
  getCurrent: async (): Promise<DBTypes.User | null> => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) return null;
      
      const { data, error } = await supabase
        .from('profiles')
        .select(SAFE_PROFILE_COLUMNS)
        .eq('id', user.id)
        .single();
      
      if (error) throw error;
      
      return mapProfileToUser(data);
    } catch (error) {
      handleError(error, 'Failed to fetch current user');
      return null;
    }
  },
  
  update: async (userData: Partial<DBTypes.User>): Promise<DBTypes.User> => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) throw new Error('Not authenticated');
      
      // Convert our User type to match Supabase profiles structure
      const profileData = {
        first_name: userData.firstName,
        last_name: userData.lastName,
        avatar_url: userData.avatar,
        role: userData.role
      };
      
      const { data, error } = await supabase
        .from('profiles')
        .update(profileData)
        .eq('id', user.id)
        .select()
        .single();
      
      if (error) throw error;
      
      return mapProfileToUser(data);
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
      
      return data.map(mapDBServiceToService);
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
      
      return mapDBServiceToService(data);
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
        .eq('provider_id', providerId);
      
      if (error) throw error;
      
      return data.map(mapDBServiceToService);
    } catch (error) {
      handleError(error, 'Failed to fetch provider services');
      return [];
    }
  },
  
  create: async (service: Omit<DBTypes.Service, 'id'>): Promise<DBTypes.Service> => {
    try {
      const dbService = mapServiceToDBService(service);
      
      const { data, error } = await supabase
        .from('services')
        .insert(dbService)
        .select()
        .single();
      
      if (error) throw error;
      
      return mapDBServiceToService(data);
    } catch (error) {
      handleError(error, 'Failed to create service');
      throw error;
    }
  },
  
  update: async (id: string, service: Partial<DBTypes.Service>): Promise<DBTypes.Service> => {
    try {
      const dbService = mapServiceToDBService(service);
      
      const { data, error } = await supabase
        .from('services')
        .update(dbService)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      
      return mapDBServiceToService(data);
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
  // We don't have products in the Supabase schema yet
  // This is a placeholder that returns mock data
  getAll: async (): Promise<DBTypes.Product[]> => {
    try {
      // Mock implementation - to be replaced when products table is available
      return [];
    } catch (error) {
      handleError(error, 'Failed to fetch products');
      return [];
    }
  },
  
  getById: async (id: string): Promise<DBTypes.Product | null> => {
    try {
      // Mock implementation - to be replaced when products table is available
      return null;
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
      // Convert our Booking type to match Supabase bookings structure
      const dbBooking = {
        client_id: booking.clientId,
        service_id: booking.serviceId,
        status: booking.status,
        booking_date: booking.dateTime.split('T')[0], // Extract date portion
        booking_time: booking.dateTime.split('T')[1], // Extract time portion
        notes: booking.notes,
        payment_status: 'pending'
      };
      
      const { data, error } = await supabase
        .from('bookings')
        .insert(dbBooking)
        .select()
        .single();
      
      if (error) throw error;
      
      return mapDBBookingToBooking(data);
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
        .eq('client_id', userId)
        .order('booking_date', { ascending: true });
      
      if (error) throw error;
      
      return data.map(mapDBBookingToBooking);
    } catch (error) {
      handleError(error, 'Failed to fetch user bookings');
      return [];
    }
  },
  
  getByProvider: async (providerId: string): Promise<DBTypes.Booking[]> => {
    try {
      // This is more complex because we need to join with services
      const { data, error } = await supabase
        .from('bookings')
        .select('*, services!inner(*)')
        .eq('services.provider_id', providerId)
        .order('booking_date', { ascending: true });
      
      if (error) throw error;
      
      return data.map((item: any) => mapDBBookingToBooking(item));
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
