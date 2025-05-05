
import { supabase } from "@/integrations/supabase/client";

// Initialize realtime functionality for Supabase
export const initializeRealtime = () => {
  return {
    setupProductsRealtime: (callback: (payload: any) => void) => {
      const channel = supabase.channel('public:products')
        .on('postgres_changes', {
          event: '*',
          schema: 'public',
          table: 'products'
        }, (payload) => {
          callback(payload);
        })
        .subscribe();
      
      return () => {
        channel.unsubscribe();
      };
    },
    
    setupServicesRealtime: (callback: (payload: any) => void) => {
      const channel = supabase.channel('public:services')
        .on('postgres_changes', {
          event: '*',
          schema: 'public',
          table: 'services'
        }, (payload) => {
          callback(payload);
        })
        .subscribe();
      
      return () => {
        channel.unsubscribe();
      };
    },
    
    setupNotificationsRealtime: (userId: string, callback: (payload: any) => void) => {
      const channel = supabase.channel(`public:notifications:${userId}`)
        .on('postgres_changes', {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${userId}`
        }, (payload) => {
          callback(payload);
        })
        .subscribe();
      
      return () => {
        channel.unsubscribe();
      };
    },
    
    setupBookingsRealtime: (userId: string, callback: (payload: any) => void) => {
      const channel = supabase.channel(`public:bookings:${userId}`)
        .on('postgres_changes', {
          event: '*',
          schema: 'public',
          table: 'bookings',
          filter: `provider_id=eq.${userId}`
        }, (payload) => {
          callback(payload);
        })
        .subscribe();
      
      return () => {
        channel.unsubscribe();
      };
    },
    
    setupOrdersRealtime: (userId: string, callback: (payload: any) => void) => {
      const channel = supabase.channel(`public:orders:${userId}`)
        .on('postgres_changes', {
          event: '*',
          schema: 'public', 
          table: 'orders',
          filter: `provider_id=eq.${userId}`
        }, (payload) => {
          callback(payload);
        })
        .subscribe();
      
      return () => {
        channel.unsubscribe();
      };
    },
    
    setupMessagesRealtime: (userId: string, callback: (payload: any) => void) => {
      const channel = supabase.channel(`public:messages:${userId}`)
        .on('postgres_changes', {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `recipient_id=eq.${userId}`
        }, (payload) => {
          callback(payload);
        })
        .subscribe();
      
      return () => {
        channel.unsubscribe();
      };
    }
  };
};
