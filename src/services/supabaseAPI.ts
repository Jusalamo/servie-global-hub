
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

// Product Management
export const productAPI = {
  async createProduct(productData: any) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('products')
      .insert({
        ...productData,
        seller_id: user.id
      })
      .select()
      .single();

    if (error) throw error;
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
    if (error) throw error;
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

    if (error) throw error;
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

// Availability Management
export const availabilityAPI = {
  async createAvailability(availabilityData: any) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('service_availability')
      .insert({
        ...availabilityData,
        provider_id: user.id
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getAvailability(serviceId: string, date: string) {
    const { data, error } = await supabase
      .from('service_availability')
      .select('*')
      .eq('service_id', serviceId)
      .eq('available_date', date)
      .eq('is_available', true)
      .order('start_time');

    if (error) throw error;
    return data || [];
  },

  async updateAvailability(id: string, updates: any) {
    const { data, error } = await supabase
      .from('service_availability')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deleteAvailability(id: string) {
    const { error } = await supabase
      .from('service_availability')
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
