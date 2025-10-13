import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface ProviderStats {
  totalEarnings: number;
  totalBookings: number;
  completionRate: number;
  rating: number;
}

export const useProviderStats = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<ProviderStats>({
    totalEarnings: 0,
    totalBookings: 0,
    completionRate: 0,
    rating: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      if (!user?.id) {
        setIsLoading(false);
        return;
      }

      try {
        // Fetch bookings for this provider's services
        const { data: services } = await supabase
          .from('services')
          .select('id')
          .eq('provider_id', user.id);

        const serviceIds = services?.map(s => s.id) || [];

        if (serviceIds.length > 0) {
          // Fetch bookings
          const { data: bookings } = await supabase
            .from('bookings')
            .select('*')
            .in('service_id', serviceIds);

          const completedBookings = bookings?.filter(b => b.status === 'completed') || [];
          const totalBookings = bookings?.length || 0;
          const totalEarnings = completedBookings.reduce((sum, b) => sum + Number(b.booking_date ? 0 : 0), 0);
          const completionRate = totalBookings > 0 ? (completedBookings.length / totalBookings) * 100 : 0;

          // Fetch reviews
          const { data: reviews } = await supabase
            .from('reviews')
            .select('rating')
            .eq('provider_id', user.id);

          const avgRating = reviews && reviews.length > 0
            ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
            : 0;

          setStats({
            totalEarnings,
            totalBookings,
            completionRate: Math.round(completionRate),
            rating: Math.round(avgRating * 10) / 10,
          });
        }
      } catch (error) {
        console.error('Error fetching provider stats:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, [user?.id]);

  return { stats, isLoading };
};
