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

    const result: any = await supabase
      .from('services')
      .insert({
        ...serviceData,
        provider_id: user.id,
      })
      .select('*')
      .single();

    if (result.error) throw result.error;
    return result.data;
  }

  async getServices(filters: ServiceFilters = {}): Promise<Service[]> {
    let query: any = supabase.from('services').select('*');

    // For public view, show only active services
    if (!filters.provider_id) {
      query = query.eq('status', 'active');
    }

    if (filters.category_id) {
      query = query.eq('category_id', filters.category_id);
    }

    if (filters.provider_id) {
      query = query.eq('provider_id', filters.provider_id);
    }

    if (filters.featured !== undefined) {
      query = query.eq('featured', filters.featured);
    }

    const result = await query.order('created_at', { ascending: false });

    if (result.error) throw result.error;
    return result.data || [];
  }

  async getMyServices(): Promise<Service[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    return this.getServices({ provider_id: user.id });
  }

  async getServiceById(id: string): Promise<Service | null> {
    const result: any = await supabase
      .from('services')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (result.error) throw result.error;
    return result.data;
  }

  async updateService(id: string, updates: Partial<CreateServiceData>): Promise<Service> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const result: any = await supabase
      .from('services')
      .update(updates)
      .eq('id', id)
      .eq('provider_id', user.id)
      .select('*')
      .single();

    if (result.error) throw result.error;
    return result.data;
  }

  async deleteService(id: string): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const result: any = await supabase
      .from('services')
      .delete()
      .eq('id', id)
      .eq('provider_id', user.id);

    if (result.error) throw result.error;
  }

  async toggleServiceStatus(id: string, status: string): Promise<Service> {
    const newStatus = status === 'active' ? 'inactive' : 'active';
    return this.updateService(id, { status: newStatus } as any);
  }
}

export const serviceAPI = new ServiceAPI();