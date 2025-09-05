import { supabase } from '@/integrations/supabase/client';

export interface Service {
  id: string;
  provider_id: string;
  category_id?: string;
  title: string;
  description: string;
  price: number;
  location?: string;
  response_time?: string;
  featured: boolean;
  created_at: string;
  updated_at: string;
  status?: string;
}

export interface CreateServiceData {
  title: string;
  description: string;
  price: number;
  location?: string;
  response_time?: string;
  category_id?: string;
  status?: string;
}

export interface ServiceFilters {
  category_id?: string;
  provider_id?: string;
  featured?: boolean;
}

export class ServiceAPI {
  async createService(serviceData: CreateServiceData): Promise<Service> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data: service, error } = await supabase
      .from('services')
      .insert({
        ...serviceData,
        provider_id: user.id,
      })
      .select('*')
      .single();

    if (error) throw error;
    return service;
  }

  async getServices(filters: ServiceFilters = {}): Promise<Service[]> {
    let query = supabase.from('services').select('*');

    if (filters.category_id) {
      query = query.eq('category_id', filters.category_id);
    }

    if (filters.provider_id) {
      query = query.eq('provider_id', filters.provider_id);
    }

    if (filters.featured !== undefined) {
      query = query.eq('featured', filters.featured);
    }

    const { data: services, error } = await query.order('created_at', { ascending: false });

    if (error) throw error;
    return services || [];
  }

  async getMyServices(): Promise<Service[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    return this.getServices({ provider_id: user.id });
  }

  async getServiceById(id: string): Promise<Service | null> {
    const { data: service, error } = await supabase
      .from('services')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return service;
  }

  async updateService(id: string, updates: Partial<CreateServiceData>): Promise<Service> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data: service, error } = await supabase
      .from('services')
      .update(updates)
      .eq('id', id)
      .eq('provider_id', user.id)
      .select('*')
      .single();

    if (error) throw error;
    return service;
  }

  async deleteService(id: string): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { error } = await supabase
      .from('services')
      .delete()
      .eq('id', id)
      .eq('provider_id', user.id);

    if (error) throw error;
  }

  async toggleServiceStatus(id: string, status: string): Promise<Service> {
    const newStatus = status === 'active' ? 'inactive' : 'active';
    return this.updateService(id, { status: newStatus } as any);
  }
}

export const serviceAPI = new ServiceAPI();