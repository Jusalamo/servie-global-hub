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

// Product Management using type assertions to work around missing types
export const productAPI = {
  async createProduct(productData: any) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('products' as any)
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
      .from('products' as any)
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
      .from('products' as any)
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
      .from('products' as any)
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deleteProduct(id: string) {
    const { error } = await supabase
      .from('products' as any)
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
};

// Quotation Management
export const quotationAPI = {
  async createQuotation(quotationData: any) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('quotations')
      .insert({
        ...quotationData,
        provider_id: user.id
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getMyQuotations() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('quotations')
      .select('*')
      .eq('provider_id', user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async getQuotationById(id: string) {
    const { data, error } = await supabase
      .from('quotations')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  async getQuotationItems(quotationId: string) {
    const { data, error } = await supabase
      .from('quotation_items')
      .select('*')
      .eq('quotation_id', quotationId)
      .order('sort_order');

    if (error) throw error;
    return data || [];
  },

  async updateQuotationStatus(id: string, status: string) {
    const updateData: any = { status };
    
    if (status === 'sent') {
      updateData.sent_at = new Date().toISOString();
    } else if (status === 'accepted') {
      updateData.accepted_at = new Date().toISOString();
    } else if (status === 'declined') {
      updateData.declined_at = new Date().toISOString();
    }

    const { data, error } = await supabase
      .from('quotations')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deleteQuotation(id: string) {
    const { error } = await supabase
      .from('quotations')
      .delete()
      .eq('id', id);

    if (error) throw error;
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
