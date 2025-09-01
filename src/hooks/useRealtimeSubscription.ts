import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';

export interface RealtimeSubscriptionConfig {
  table: string;
  event?: 'INSERT' | 'UPDATE' | 'DELETE' | '*';
  filter?: string;
  onReceive: (payload: any) => void;
}

export const useRealtimeSubscription = (configs: RealtimeSubscriptionConfig[]) => {
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    const channels = configs.map((config, index) => {
      const channel = supabase
        .channel(`realtime-${config.table}-${index}`)
        .on(
          'postgres_changes' as any,
          {
            event: config.event || '*',
            schema: 'public',
            table: config.table,
            filter: config.filter
          },
          (payload) => {
            config.onReceive(payload);
          }
        )
        .subscribe();

      return channel;
    });

    return () => {
      channels.forEach(channel => {
        supabase.removeChannel(channel);
      });
    };
  }, [user, configs]);
};