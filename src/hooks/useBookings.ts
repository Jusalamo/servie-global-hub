import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';

export interface Booking {
  id: string;
  service_id: string;
  client_id: string;
  booking_date: string;
  booking_time: string;
  status: string;
  payment_method: string | null;
  payment_status: string;
  notes: string | null;
  created_at: string;
  services?: {
    title: string;
    price: number;
    provider_id: string;
    profiles?: {
      first_name: string;
      last_name: string;
      business_name: string | null;
    };
  };
}

export const useBookings = (role: 'client' | 'provider' = 'client') => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user?.id) {
      setIsLoading(false);
      return;
    }

    const fetchBookings = async () => {
      try {
        setIsLoading(true);
        
        let query = supabase
          .from('bookings')
          .select(`
            *,
            services (
              title,
              price,
              provider_id,
              profiles (
                first_name,
                last_name,
                business_name
              )
            )
          `)
          .order('created_at', { ascending: false });

        if (role === 'client') {
          query = query.eq('client_id', user.id);
        } else {
          // For providers, get bookings for their services
          const { data: userServices } = await supabase
            .from('services')
            .select('id')
            .eq('provider_id', user.id);
          
          const serviceIds = userServices?.map(s => s.id) || [];
          if (serviceIds.length > 0) {
            query = query.in('service_id', serviceIds);
          } else {
            // No services, return empty
            setBookings([]);
            setIsLoading(false);
            return;
          }
        }

        const { data, error: fetchError } = await query;

        if (fetchError) throw fetchError;
        setBookings(data || []);
        setError(null);
      } catch (err) {
        console.error('Error fetching bookings:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch bookings');
        setBookings([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookings();

    // Subscribe to real-time updates
    const channel = supabase
      .channel('bookings-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'bookings',
          filter: role === 'client' ? `client_id=eq.${user.id}` : undefined,
        },
        () => {
          fetchBookings();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id, role]);

  return { bookings, isLoading, error };
};
