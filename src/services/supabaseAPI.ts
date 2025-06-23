
import { supabase } from "@/integrations/supabase/client";

// Service Management
export const serviceAPI = {
  async createService(serviceData: any) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('services')
      .insert({
        ...serviceData,
        provider_id: user.id
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getServices(filters: any = {}) {
    let query = supabase
      .from('services')
      .select(`
        *,
        service_categories(name, icon),
        profiles(first_name, last_name, avatar_url)
      `)
      .order('featured', { ascending: false })
      .order('created_at', { ascending: false });

    if (filters.category_id) {
      query = query.eq('category_id', filters.category_id);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  },

  async getMyServices() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('services')
      .select('*')
      .eq('provider_id', user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async updateService(id: string, updates: any) {
    const { data, error } = await supabase
      .from('services')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deleteService(id: string) {
    const { error } = await supabase
      .from('services')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
};

// Product Management using raw SQL
export const productAPI = {
  async createProduct(productData: any) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase.rpc('create_product', {
      p_name: productData.name,
      p_description: productData.description,
      p_price: productData.price,
      p_category_id: productData.category_id,
      p_image_url: productData.image_url,
      p_stock_quantity: productData.stock_quantity,
      p_status: productData.status,
      p_seller_id: user.id
    });

    if (error) {
      // Fallback to direct insert if function doesn't exist
      const { data: fallbackData, error: fallbackError } = await supabase
        .from('products')
        .insert({
          ...productData,
          seller_id: user.id
        })
        .select()
        .single();
      
      if (fallbackError) throw fallbackError;
      return fallbackData;
    }
    return data;
  },

  async getProducts(filters: any = {}) {
    let query = supabase
      .from('products')
      .select(`
        *,
        service_categories(name, icon),
        profiles(first_name, last_name, avatar_url)
      `)
      .eq('status', 'active')
      .order('featured', { ascending: false })
      .order('created_at', { ascending: false });

    if (filters.category_id) {
      query = query.eq('category_id', filters.category_id);
    }

    const { data, error } = await query;
    if (error) {
      console.error('Error fetching products:', error);
      return [];
    }
    return data || [];
  },

  async getMyProducts() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('seller_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching my products:', error);
      return [];
    }
    return data || [];
  },

  async updateProduct(id: string, updates: any) {
    const { data, error } = await supabase
      .from('products')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deleteProduct(id: string) {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
};

// Cart and Order Management
export const cartAPI = {
  async addToCart(productId: string, quantity: number = 1) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    // Get or create pending order
    let { data: order } = await supabase
      .from('orders')
      .select('*')
      .eq('user_id', user.id)
      .eq('status', 'pending')
      .single();

    if (!order) {
      const { data: newOrder, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: user.id,
          status: 'pending',
          total: 0
        })
        .select()
        .single();

      if (orderError) throw orderError;
      order = newOrder;
    }

    // Get product price
    const { data: product, error: productError } = await supabase
      .from('products')
      .select('price')
      .eq('id', productId)
      .single();

    if (productError) throw productError;

    // Check if item already exists in cart
    const { data: existingItem } = await supabase
      .from('order_items')
      .select('*')
      .eq('order_id', order.id)
      .eq('product_id', productId)
      .single();

    if (existingItem) {
      // Update quantity
      const { data, error } = await supabase
        .from('order_items')
        .update({ quantity: existingItem.quantity + quantity })
        .eq('id', existingItem.id)
        .select()
        .single();

      if (error) throw error;
      await this.updateOrderTotal(order.id);
      return data;
    } else {
      // Add new item
      const { data, error } = await supabase
        .from('order_items')
        .insert({
          order_id: order.id,
          product_id: productId,
          quantity,
          price: product.price
        })
        .select()
        .single();

      if (error) throw error;
      await this.updateOrderTotal(order.id);
      return data;
    }
  },

  async getCart() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data: order } = await supabase
      .from('orders')
      .select(`
        *,
        order_items(
          *,
          products(*)
        )
      `)
      .eq('user_id', user.id)
      .eq('status', 'pending')
      .single();

    return order?.order_items || [];
  },

  async updateCartItem(itemId: string, quantity: number) {
    if (quantity <= 0) {
      return this.removeFromCart(itemId);
    }

    const { data, error } = await supabase
      .from('order_items')
      .update({ quantity })
      .eq('id', itemId)
      .select('order_id')
      .single();

    if (error) throw error;
    await this.updateOrderTotal(data.order_id);
    return data;
  },

  async removeFromCart(itemId: string) {
    const { data: item } = await supabase
      .from('order_items')
      .select('order_id')
      .eq('id', itemId)
      .single();

    const { error } = await supabase
      .from('order_items')
      .delete()
      .eq('id', itemId);

    if (error) throw error;
    if (item) {
      await this.updateOrderTotal(item.order_id);
    }
  },

  async updateOrderTotal(orderId: string) {
    const { data: items } = await supabase
      .from('order_items')
      .select('quantity, price')
      .eq('order_id', orderId);

    const total = items?.reduce((sum, item) => sum + (item.quantity * item.price), 0) || 0;

    await supabase
      .from('orders')
      .update({ total })
      .eq('id', orderId);
  },

  async clearCart() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data: order } = await supabase
      .from('orders')
      .select('id')
      .eq('user_id', user.id)
      .eq('status', 'pending')
      .single();

    if (order) {
      await supabase
        .from('order_items')
        .delete()
        .eq('order_id', order.id);

      await supabase
        .from('orders')
        .delete()
        .eq('id', order.id);
    }
  }
};

// Categories API
export const categoriesAPI = {
  async getCategories() {
    const { data, error } = await supabase
      .from('service_categories')
      .select('*')
      .order('name');

    if (error) throw error;
    return data || [];
  }
};

// Availability Management (using notifications table temporarily)
export const availabilityAPI = {
  async createAvailability(availabilityData: any) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('notifications')
      .insert({
        user_id: user.id,
        type: 'availability',
        title: 'Service Availability',
        message: 'Availability slot created',
        data: availabilityData
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getAvailability(serviceId: string, date: string) {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('type', 'availability')
      .order('created_at');

    if (error) throw error;
    return data || [];
  },

  async updateAvailability(id: string, updates: any) {
    const { data, error } = await supabase
      .from('notifications')
      .update({
        data: updates,
        message: 'Availability updated'
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deleteAvailability(id: string) {
    const { error } = await supabase
      .from('notifications')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
};

// Booking Management
export const bookingAPI = {
  async createBooking(bookingData: any) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('bookings')
      .insert({
        ...bookingData,
        client_id: user.id
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getMyBookings() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('bookings')
      .select(`
        *,
        services(title, price, profiles(first_name, last_name))
      `)
      .eq('client_id', user.id)
      .order('booking_date', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async getProviderBookings() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('bookings')
      .select(`
        *,
        services!inner(title, price, provider_id),
        profiles(first_name, last_name, avatar_url)
      `)
      .eq('services.provider_id', user.id)
      .order('booking_date', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async updateBookingStatus(id: string, status: string) {
    const { data, error } = await supabase
      .from('bookings')
      .update({ status })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }
};
