import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

export interface Review {
  id: string;
  service_id?: string;
  client_id: string;
  provider_id?: string;
  booking_id?: string;
  rating: number;
  comment?: string;
  provider_response?: string;
  created_at: string;
  updated_at: string;
  client?: {
    first_name: string;
    last_name: string;
    avatar_url?: string;
  };
}

export const useRealtimeReviews = (serviceId?: string, providerId?: string) => {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchReviews = async () => {
    try {
      let query = supabase
        .from('reviews')
        .select(`
          *,
          client:profiles!reviews_client_id_fkey(first_name, last_name, avatar_url)
        `)
        .order('created_at', { ascending: false });

      if (serviceId) {
        query = query.eq('service_id', serviceId);
      } else if (providerId) {
        query = query.eq('provider_id', providerId);
      }

      const { data, error } = await query;

      if (error) throw error;
      setReviews(data || []);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const createReview = async (reviewData: {
    service_id: string;
    provider_id: string;
    booking_id: string;
    rating: number;
    comment: string;
  }) => {
    if (!user) {
      toast.error('Please sign in to leave a review');
      return;
    }

    try {
      const { error } = await supabase
        .from('reviews')
        .insert({
          ...reviewData,
          client_id: user.id
        });

      if (error) throw error;

      toast.success('Review submitted successfully');
      await fetchReviews();
    } catch (error: any) {
      console.error('Error creating review:', error);
      toast.error(error.message || 'Failed to submit review');
      throw error;
    }
  };

  const respondToReview = async (reviewId: string, response: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('reviews')
        .update({ provider_response: response })
        .eq('id', reviewId)
        .eq('provider_id', user.id);

      if (error) throw error;

      toast.success('Response added successfully');
      await fetchReviews();
    } catch (error) {
      console.error('Error responding to review:', error);
      toast.error('Failed to add response');
      throw error;
    }
  };

  useEffect(() => {
    fetchReviews();

    // Subscribe to real-time review updates
    const filter = serviceId 
      ? `service_id=eq.${serviceId}` 
      : providerId 
      ? `provider_id=eq.${providerId}` 
      : undefined;

    const channel = supabase
      .channel('reviews-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'reviews',
          ...(filter && { filter })
        },
        () => {
          fetchReviews();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [serviceId, providerId]);

  return {
    reviews,
    isLoading,
    createReview,
    respondToReview,
    refreshReviews: fetchReviews
  };
};
