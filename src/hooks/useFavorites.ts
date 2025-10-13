import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';

export interface Favorite {
  id: string;
  client_id: string;
  service_id: string;
  created_at: string;
  services?: {
    id: string;
    title: string;
    description: string;
    price: number;
    category_id: string | null;
    location: string | null;
    provider_id: string;
    profiles?: {
      first_name: string;
      last_name: string;
      business_name: string | null;
      avatar_url: string | null;
    };
    service_images?: Array<{
      url: string;
      is_primary: boolean;
    }>;
  };
}

export const useFavorites = () => {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user?.id) {
      setIsLoading(false);
      return;
    }

    const fetchFavorites = async () => {
      try {
        setIsLoading(true);
        
        const { data, error: fetchError } = await supabase
          .from('favorites')
          .select(`
            *,
            services (
              id,
              title,
              description,
              price,
              category_id,
              location,
              provider_id,
              profiles (
                first_name,
                last_name,
                business_name,
                avatar_url
              ),
              service_images (
                url,
                is_primary
              )
            )
          `)
          .eq('client_id', user.id)
          .order('created_at', { ascending: false });

        if (fetchError) throw fetchError;
        setFavorites(data || []);
        setError(null);
      } catch (err) {
        console.error('Error fetching favorites:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch favorites');
        setFavorites([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFavorites();

    // Subscribe to real-time updates
    const channel = supabase
      .channel('favorites-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'favorites',
          filter: `client_id=eq.${user.id}`,
        },
        () => {
          fetchFavorites();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id]);

  const toggleFavorite = async (serviceId: string) => {
    if (!user?.id) return;

    try {
      const existing = favorites.find(f => f.service_id === serviceId);
      
      if (existing) {
        await supabase
          .from('favorites')
          .delete()
          .eq('id', existing.id);
      } else {
        await supabase
          .from('favorites')
          .insert({
            client_id: user.id,
            service_id: serviceId,
          });
      }
    } catch (err) {
      console.error('Error toggling favorite:', err);
    }
  };

  return { favorites, isLoading, error, toggleFavorite };
};
