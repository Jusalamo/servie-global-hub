import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';

export interface DashboardStats {
  totalEarnings: number;
  totalBookings: number;
  activeBookings: number;
  completionRate: number;
  rating: number;
  reviewCount: number;
  totalOrders: number;
  totalProducts: number;
  totalServices: number;
  monthlyEarnings: number;
  monthlyOrders: number;
}

export const useDashboardStats = (role: 'provider' | 'seller' | 'client') => {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    totalEarnings: 0,
    totalBookings: 0,
    activeBookings: 0,
    completionRate: 0,
    rating: 0,
    reviewCount: 0,
    totalOrders: 0,
    totalProducts: 0,
    totalServices: 0,
    monthlyEarnings: 0,
    monthlyOrders: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) {
      setIsLoading(false);
      return;
    }

    const fetchStats = async () => {
      try {
        setIsLoading(true);

        if (role === 'provider') {
          // Fetch provider stats
          const [bookingsData, servicesData, reviewsData, earningsData] = await Promise.all([
            supabase
              .from('bookings')
              .select('*, services!inner(provider_id)')
              .eq('services.provider_id', user.id),
            supabase
              .from('services')
              .select('id')
              .eq('provider_id', user.id),
            supabase
              .from('reviews')
              .select('rating')
              .eq('provider_id', user.id),
            supabase
              .from('financial_transactions')
              .select('amount, created_at')
              .eq('user_id', user.id)
              .eq('type', 'earning')
              .eq('status', 'completed'),
          ]);

          const bookings = bookingsData.data || [];
          const completedBookings = bookings.filter(b => b.status === 'completed');
          const activeBookings = bookings.filter(b => b.status === 'confirmed' || b.status === 'pending');
          const reviews = reviewsData.data || [];
          const avgRating = reviews.length > 0 
            ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length 
            : 0;
          const earnings = earningsData.data || [];
          const totalEarnings = earnings.reduce((sum, e) => sum + Number(e.amount), 0);

          // Calculate monthly earnings
          const now = new Date();
          const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
          const monthlyEarnings = earnings
            .filter(e => new Date(e.created_at) >= monthStart)
            .reduce((sum, e) => sum + Number(e.amount), 0);

          setStats({
            totalEarnings,
            totalBookings: bookings.length,
            activeBookings: activeBookings.length,
            completionRate: bookings.length > 0 
              ? (completedBookings.length / bookings.length) * 100 
              : 0,
            rating: avgRating,
            reviewCount: reviews.length,
            totalServices: servicesData.data?.length || 0,
            totalOrders: 0,
            totalProducts: 0,
            monthlyEarnings,
            monthlyOrders: 0,
          });
        } else if (role === 'seller') {
          // Fetch seller stats
          const [ordersData, productsData, earningsData] = await Promise.all([
            supabase
              .from('orders')
              .select('*, order_items(*, products!inner(seller_id))')
              .eq('order_items.products.seller_id', user.id),
            supabase
              .from('products')
              .select('id')
              .eq('seller_id', user.id),
            supabase
              .from('financial_transactions')
              .select('amount, created_at')
              .eq('user_id', user.id)
              .eq('type', 'earning')
              .eq('status', 'completed'),
          ]);

          const orders = ordersData.data || [];
          const earnings = earningsData.data || [];
          const totalEarnings = earnings.reduce((sum, e) => sum + Number(e.amount), 0);

          // Calculate monthly stats
          const now = new Date();
          const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
          const monthlyData = earnings.filter(e => new Date(e.created_at) >= monthStart);
          const monthlyEarnings = monthlyData.reduce((sum, e) => sum + Number(e.amount), 0);

          setStats({
            totalEarnings,
            totalOrders: orders.length,
            totalProducts: productsData.data?.length || 0,
            monthlyEarnings,
            monthlyOrders: orders.filter(o => new Date(o.created_at) >= monthStart).length,
            totalBookings: 0,
            activeBookings: 0,
            completionRate: 0,
            rating: 0,
            reviewCount: 0,
            totalServices: 0,
          });
        } else {
          // Fetch client stats
          const [bookingsData, ordersData, favoritesData] = await Promise.all([
            supabase
              .from('bookings')
              .select('*')
              .eq('client_id', user.id),
            supabase
              .from('orders')
              .select('*')
              .eq('user_id', user.id),
            supabase
              .from('favorites')
              .select('id')
              .eq('client_id', user.id),
          ]);

          const bookings = bookingsData.data || [];
          const activeBookings = bookings.filter(b => 
            b.status === 'confirmed' || b.status === 'pending'
          );

          setStats({
            totalBookings: bookings.length,
            activeBookings: activeBookings.length,
            totalOrders: ordersData.data?.length || 0,
            totalEarnings: 0,
            completionRate: 0,
            rating: 0,
            reviewCount: 0,
            totalProducts: 0,
            totalServices: favoritesData.data?.length || 0,
            monthlyEarnings: 0,
            monthlyOrders: 0,
          });
        }
      } catch (err) {
        console.error('Error fetching stats:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, [user?.id, role]);

  return { stats, isLoading };
};
