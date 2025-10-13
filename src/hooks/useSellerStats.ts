import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface SellerStats {
  totalRevenue: number;
  totalOrders: number;
  averageOrderValue: number;
  totalCustomers: number;
}

export const useSellerStats = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<SellerStats>({
    totalRevenue: 0,
    totalOrders: 0,
    averageOrderValue: 0,
    totalCustomers: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      if (!user?.id) {
        setIsLoading(false);
        return;
      }

      try {
        // Fetch products for this seller
        const { data: products } = await supabase
          .from('products')
          .select('id')
          .eq('seller_id', user.id);

        const productIds = products?.map(p => p.id) || [];

        if (productIds.length > 0) {
          // Fetch orders containing these products
          const { data: orderItems } = await supabase
            .from('order_items')
            .select('order_id, price, quantity')
            .in('product_id', productIds);

          const uniqueOrderIds = [...new Set(orderItems?.map(item => item.order_id) || [])];
          
          const { data: orders } = await supabase
            .from('orders')
            .select('user_id, total')
            .in('id', uniqueOrderIds);

          const totalRevenue = orders?.reduce((sum, o) => sum + Number(o.total), 0) || 0;
          const totalOrders = orders?.length || 0;
          const averageOrderValue = totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0;
          const uniqueCustomers = new Set(orders?.map(o => o.user_id) || []).size;

          setStats({
            totalRevenue: Math.round(totalRevenue),
            totalOrders,
            averageOrderValue,
            totalCustomers: uniqueCustomers,
          });
        }
      } catch (error) {
        console.error('Error fetching seller stats:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, [user?.id]);

  return { stats, isLoading };
};
