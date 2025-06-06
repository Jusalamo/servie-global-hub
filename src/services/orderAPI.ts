
import { supabase } from "@/integrations/supabase/client";

export interface Order {
  id: string;
  user_id: string;
  total_amount: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  shipping_address: string;
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded';
  created_at: string;
  updated_at: string;
  order_items: OrderItem[];
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  price: number;
  product?: {
    name: string;
    image_url: string;
  };
}

export interface CreateOrderData {
  items: {
    product_id: string;
    quantity: number;
    price: number;
  }[];
  total_amount: number;
  shipping_address: string;
}

class OrderAPI {
  async createOrder(orderData: CreateOrderData): Promise<Order> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // For now, create a notification as a placeholder for order
      const { data: notification, error } = await supabase
        .from('notifications')
        .insert({
          user_id: user.id,
          title: 'New Order Created',
          message: `Order total: $${orderData.total_amount}`,
          type: 'system',
          data: {
            order_type: 'purchase',
            total_amount: orderData.total_amount,
            shipping_address: orderData.shipping_address,
            items: orderData.items,
            status: 'pending',
            payment_status: 'pending'
          }
        })
        .select()
        .single();

      if (error) throw error;

      // Transform notification to order format
      const order: Order = {
        id: notification.id,
        user_id: user.id,
        total_amount: orderData.total_amount,
        status: 'pending',
        shipping_address: orderData.shipping_address,
        payment_status: 'pending',
        created_at: notification.created_at || new Date().toISOString(),
        updated_at: notification.created_at || new Date().toISOString(),
        order_items: orderData.items.map((item, index) => ({
          id: `${notification.id}-item-${index}`,
          order_id: notification.id,
          product_id: item.product_id,
          quantity: item.quantity,
          price: item.price
        }))
      };

      return order;
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  }

  async getOrders(userId?: string): Promise<Order[]> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user && !userId) throw new Error('User not authenticated');

      const targetUserId = userId || user.id;

      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', targetUserId)
        .eq('type', 'system')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Transform notifications to orders
      const orders: Order[] = (data || [])
        .filter(notification => notification.data?.order_type === 'purchase')
        .map(notification => ({
          id: notification.id,
          user_id: notification.user_id || '',
          total_amount: notification.data?.total_amount || 0,
          status: notification.data?.status || 'pending',
          shipping_address: notification.data?.shipping_address || '',
          payment_status: notification.data?.payment_status || 'pending',
          created_at: notification.created_at || new Date().toISOString(),
          updated_at: notification.created_at || new Date().toISOString(),
          order_items: notification.data?.items || []
        }));

      return orders;
    } catch (error) {
      console.error('Error fetching orders:', error);
      return [];
    }
  }

  async updateOrderStatus(orderId: string, status: Order['status']): Promise<Order> {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .update({ 
          data: { status },
          updated_at: new Date().toISOString()
        })
        .eq('id', orderId)
        .select()
        .single();

      if (error) throw error;

      // Transform back to order format
      const order: Order = {
        id: data.id,
        user_id: data.user_id || '',
        total_amount: data.data?.total_amount || 0,
        status: status,
        shipping_address: data.data?.shipping_address || '',
        payment_status: data.data?.payment_status || 'pending',
        created_at: data.created_at || new Date().toISOString(),
        updated_at: new Date().toISOString(),
        order_items: data.data?.items || []
      };

      return order;
    } catch (error) {
      console.error('Error updating order status:', error);
      throw error;
    }
  }

  async updatePaymentStatus(orderId: string, paymentStatus: Order['payment_status']): Promise<Order> {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .update({ 
          data: { payment_status: paymentStatus }
        })
        .eq('id', orderId)
        .select()
        .single();

      if (error) throw error;

      // Transform back to order format
      const order: Order = {
        id: data.id,
        user_id: data.user_id || '',
        total_amount: data.data?.total_amount || 0,
        status: data.data?.status || 'pending',
        shipping_address: data.data?.shipping_address || '',
        payment_status: paymentStatus,
        created_at: data.created_at || new Date().toISOString(),
        updated_at: new Date().toISOString(),
        order_items: data.data?.items || []
      };

      return order;
    } catch (error) {
      console.error('Error updating payment status:', error);
      throw error;
    }
  }

  async getOrderById(orderId: string): Promise<Order | null> {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('id', orderId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') return null;
        throw error;
      }

      if (!data.data?.order_type) return null;

      // Transform to order format
      const order: Order = {
        id: data.id,
        user_id: data.user_id || '',
        total_amount: data.data?.total_amount || 0,
        status: data.data?.status || 'pending',
        shipping_address: data.data?.shipping_address || '',
        payment_status: data.data?.payment_status || 'pending',
        created_at: data.created_at || new Date().toISOString(),
        updated_at: data.created_at || new Date().toISOString(),
        order_items: data.data?.items || []
      };
      
      return order;
    } catch (error) {
      console.error('Error fetching order:', error);
      return null;
    }
  }

  async cancelOrder(orderId: string): Promise<Order> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      return this.updateOrderStatus(orderId, 'cancelled');
    } catch (error) {
      console.error('Error cancelling order:', error);
      throw error;
    }
  }
}

export const orderAPI = new OrderAPI();
