import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

/**
 * Service-specific CRUD operations
 */
export const serviceCRUD = {
  async getUserServices(userId: string) {
    try {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .eq('provider_id', userId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching user services:', error);
      return [];
    }
  },

  async createService(serviceData: any) {
    try {
      const { data, error } = await supabase
        .from('services')
        .insert(serviceData)
        .select()
        .single();
      
      if (error) throw error;
      toast.success('Service created successfully');
      return data;
    } catch (error) {
      console.error('Error creating service:', error);
      toast.error('Failed to create service');
      return null;
    }
  },

  async updateService(id: string, updates: any) {
    try {
      const { data, error } = await supabase
        .from('services')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      toast.success('Service updated successfully');
      return data;
    } catch (error) {
      console.error('Error updating service:', error);
      toast.error('Failed to update service');
      return null;
    }
  },

  async deleteService(id: string) {
    try {
      const { error } = await supabase
        .from('services')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      toast.success('Service deleted successfully');
      return true;
    } catch (error) {
      console.error('Error deleting service:', error);
      toast.error('Failed to delete service');
      return false;
    }
  }
};

/**
 * Booking-specific CRUD operations
 */
export const bookingCRUD = {
  async getUserBookings(userId: string, role: 'client' | 'provider') {
    try {
      if (role === 'client') {
        const { data, error } = await supabase
          .from('bookings')
          .select(`
            *,
            services (
              title,
              provider_id,
              profiles (
                first_name,
                last_name,
                business_name
              )
            )
          `)
          .eq('client_id', userId)
          .order('booking_date', { ascending: false });

        if (error) throw error;
        return data || [];
      } else {
        // For providers, first get their service IDs, then get bookings
        const { data: services } = await supabase
          .from('services')
          .select('id')
          .eq('provider_id', userId);

        if (!services || services.length === 0) return [];

        const serviceIds = services.map(service => service.id);

        const { data, error } = await supabase
          .from('bookings')
          .select(`
            *,
            services (
              title,
              provider_id
            )
          `)
          .in('service_id', serviceIds)
          .order('booking_date', { ascending: false });

        if (error) throw error;
        return data || [];
      }
    } catch (error) {
      console.error('Error fetching user bookings:', error);
      return [];
    }
  },

  async createBooking(bookingData: any) {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .insert(bookingData)
        .select()
        .single();
      
      if (error) throw error;
      toast.success('Booking created successfully');
      return data;
    } catch (error) {
      console.error('Error creating booking:', error);
      toast.error('Failed to create booking');
      return null;
    }
  },

  async updateBookingStatus(id: string, status: string) {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      toast.success('Booking status updated');
      return data;
    } catch (error) {
      console.error('Error updating booking status:', error);
      toast.error('Failed to update booking');
      return null;
    }
  }
};

/**
 * Product-specific CRUD operations
 */
export const productCRUD = {
  async getUserProducts(userId: string) {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('seller_id', userId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching user products:', error);
      return [];
    }
  },

  async createProduct(productData: any) {
    try {
      const { data, error } = await supabase
        .from('products')
        .insert(productData)
        .select()
        .single();
      
      if (error) throw error;
      toast.success('Product created successfully');
      return data;
    } catch (error) {
      console.error('Error creating product:', error);
      toast.error('Failed to create product');
      return null;
    }
  },

  async updateProduct(id: string, updates: any) {
    try {
      const { data, error } = await supabase
        .from('products')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      toast.success('Product updated successfully');
      return data;
    } catch (error) {
      console.error('Error updating product:', error);
      toast.error('Failed to update product');
      return null;
    }
  },

  async deleteProduct(id: string) {
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      toast.success('Product deleted successfully');
      return true;
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error('Failed to delete product');
      return false;
    }
  }
};

/**
 * Order-specific CRUD operations
 */
export const orderCRUD = {
  async getUserOrders(userId: string) {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (
            *,
            products (
              name,
              image_url
            )
          )
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching user orders:', error);
      return [];
    }
  },

  async createOrder(orderData: any) {
    try {
      const { data, error } = await supabase
        .from('orders')
        .insert(orderData)
        .select()
        .single();
      
      if (error) throw error;
      toast.success('Order created successfully');
      return data;
    } catch (error) {
      console.error('Error creating order:', error);
      toast.error('Failed to create order');
      return null;
    }
  },

  async updateOrderStatus(id: string, status: string) {
    try {
      const { data, error } = await supabase
        .from('orders')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      toast.success('Order status updated');
      return data;
    } catch (error) {
      console.error('Error updating order status:', error);
      toast.error('Failed to update order');
      return null;
    }
  }
};

/**
 * Quotation-specific CRUD operations
 */
export const quotationCRUD = {
  async getProviderQuotations(providerId: string) {
    try {
      const { data, error } = await supabase
        .from('quotations')
        .select(`
          *,
          quotation_items (*)
        `)
        .eq('provider_id', providerId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching quotations:', error);
      return [];
    }
  },

  async createQuotation(quotationData: any) {
    try {
      const { data, error } = await supabase
        .from('quotations')
        .insert(quotationData)
        .select()
        .single();
      
      if (error) throw error;
      toast.success('Quotation created successfully');
      return data;
    } catch (error) {
      console.error('Error creating quotation:', error);
      toast.error('Failed to create quotation');
      return null;
    }
  },

  async updateQuotation(id: string, updates: any) {
    try {
      const { data, error } = await supabase
        .from('quotations')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      toast.success('Quotation updated successfully');
      return data;
    } catch (error) {
      console.error('Error updating quotation:', error);
      toast.error('Failed to update quotation');
      return null;
    }
  }
};

/**
 * Dashboard analytics helper
 */
export const dashboardAnalytics = {
  async getProviderStats(providerId: string) {
    try {
      const [services, bookings, earnings] = await Promise.all([
        serviceCRUD.getUserServices(providerId),
        bookingCRUD.getUserBookings(providerId, 'provider'),
        supabase
          .from('financial_transactions')
          .select('amount')
          .eq('user_id', providerId)
          .eq('type', 'earning')
          .eq('status', 'completed')
      ]);

      const totalEarnings = earnings.data?.reduce((sum, transaction) => sum + Number(transaction.amount), 0) || 0;
      const completedBookings = bookings.filter(booking => booking.status === 'completed');

      return {
        totalServices: services.length,
        totalBookings: bookings.length,
        completedBookings: completedBookings.length,
        totalEarnings,
        recentBookings: bookings.slice(0, 5)
      };
    } catch (error) {
      console.error('Error fetching provider stats:', error);
      return null;
    }
  },

  async getSellerStats(sellerId: string) {
    try {
      const [products, orders] = await Promise.all([
        productCRUD.getUserProducts(sellerId),
        orderCRUD.getUserOrders(sellerId)
      ]);

      const activeProducts = products.filter(product => product.status === 'active');
      const totalRevenue = orders.reduce((sum, order) => sum + Number(order.total), 0);

      return {
        totalProducts: products.length,
        activeProducts: activeProducts.length,
        totalOrders: orders.length,
        totalRevenue,
        recentOrders: orders.slice(0, 5)
      };
    } catch (error) {
      console.error('Error fetching seller stats:', error);
      return null;
    }
  },

  async getClientStats(clientId: string) {
    try {
      const [bookings, orders, favorites] = await Promise.all([
        bookingCRUD.getUserBookings(clientId, 'client'),
        orderCRUD.getUserOrders(clientId),
        supabase
          .from('favorites')
          .select('*')
          .eq('client_id', clientId)
      ]);

      return {
        totalBookings: bookings.length,
        totalOrders: orders.length,
        totalFavorites: favorites.data?.length || 0,
        recentBookings: bookings.slice(0, 5),
        recentOrders: orders.slice(0, 5)
      };
    } catch (error) {
      console.error('Error fetching client stats:', error);
      return null;
    }
  }
};