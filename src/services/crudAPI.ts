
import { supabase } from "@/integrations/supabase/client";

export interface ServiceItem {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  type: 'service' | 'product';
  images: string[];
  provider_id: string;
  provider_name: string;
  provider_avatar?: string;
  status: 'active' | 'inactive';
  created_at: string;
  updated_at: string;
  location?: string;
  rating?: number;
  reviews_count?: number;
  tags?: string[];
}

export interface CreateItemData {
  title: string;
  description: string;
  price: number;
  category: string;
  type: 'service' | 'product';
  images?: string[];
  location?: string;
  tags?: string[];
}

class CrudAPI {
  async createItem(itemData: CreateItemData): Promise<ServiceItem> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      // For mock mode, create without user authentication
      const mockUser = localStorage.getItem('mockUser');
      const currentUser = user || (mockUser ? JSON.parse(mockUser) : null);
      
      if (!currentUser) {
        throw new Error('User not authenticated');
      }

      const newItem = {
        user_id: currentUser.id,
        title: `${itemData.type}: ${itemData.title}`,
        message: itemData.description,
        type: 'listing' as const,
        data: {
          ...itemData,
          provider_id: currentUser.id,
          provider_name: currentUser.name || currentUser.email?.split('@')[0] || 'Anonymous',
          provider_avatar: currentUser.avatar,
          status: 'active',
          images: itemData.images || [],
          rating: 0,
          reviews_count: 0,
          tags: itemData.tags || []
        }
      };

      const { data, error } = await supabase
        .from('notifications')
        .insert(newItem)
        .select()
        .single();

      if (error) throw error;

      return this.transformNotificationToItem(data);
    } catch (error) {
      console.error('Error creating item:', error);
      throw error;
    }
  }

  async getItems(filters: {
    type?: 'service' | 'product';
    category?: string;
    search?: string;
    provider_id?: string;
  } = {}): Promise<ServiceItem[]> {
    try {
      let query = supabase
        .from('notifications')
        .select('*')
        .eq('type', 'listing')
        .order('created_at', { ascending: false });

      const { data, error } = await query;

      if (error) throw error;

      let items = (data || [])
        .map(notification => this.transformNotificationToItem(notification))
        .filter(item => item !== null) as ServiceItem[];

      // Apply filters
      if (filters.type) {
        items = items.filter(item => item.type === filters.type);
      }

      if (filters.category) {
        items = items.filter(item => 
          item.category.toLowerCase().includes(filters.category!.toLowerCase())
        );
      }

      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        items = items.filter(item =>
          item.title.toLowerCase().includes(searchLower) ||
          item.description.toLowerCase().includes(searchLower) ||
          item.category.toLowerCase().includes(searchLower) ||
          (item.tags && item.tags.some(tag => tag.toLowerCase().includes(searchLower)))
        );
      }

      if (filters.provider_id) {
        items = items.filter(item => item.provider_id === filters.provider_id);
      }

      return items;
    } catch (error) {
      console.error('Error fetching items:', error);
      return [];
    }
  }

  async getItemById(id: string): Promise<ServiceItem | null> {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('id', id)
        .eq('type', 'listing')
        .single();

      if (error) {
        if (error.code === 'PGRST116') return null;
        throw error;
      }

      return this.transformNotificationToItem(data);
    } catch (error) {
      console.error('Error fetching item:', error);
      return null;
    }
  }

  async updateItem(id: string, updates: Partial<CreateItemData>): Promise<ServiceItem> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const mockUser = localStorage.getItem('mockUser');
      const currentUser = user || (mockUser ? JSON.parse(mockUser) : null);
      
      if (!currentUser) {
        throw new Error('User not authenticated');
      }

      const { data, error } = await supabase
        .from('notifications')
        .update({
          title: updates.title ? `${updates.type || 'item'}: ${updates.title}` : undefined,
          message: updates.description,
          data: updates
        })
        .eq('id', id)
        .eq('user_id', currentUser.id)
        .select()
        .single();

      if (error) throw error;

      return this.transformNotificationToItem(data);
    } catch (error) {
      console.error('Error updating item:', error);
      throw error;
    }
  }

  async deleteItem(id: string): Promise<void> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const mockUser = localStorage.getItem('mockUser');
      const currentUser = user || (mockUser ? JSON.parse(mockUser) : null);
      
      if (!currentUser) {
        throw new Error('User not authenticated');
      }

      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', id)
        .eq('user_id', currentUser.id);

      if (error) throw error;
    } catch (error) {
      console.error('Error deleting item:', error);
      throw error;
    }
  }

  private transformNotificationToItem(notification: any): ServiceItem | null {
    try {
      const itemData = notification.data;
      if (!itemData) return null;

      return {
        id: notification.id,
        title: itemData.title || notification.title?.replace(/^(service|product):\s*/i, '') || '',
        description: itemData.description || notification.message || '',
        price: itemData.price || 0,
        category: itemData.category || '',
        type: itemData.type || 'service',
        images: itemData.images || [],
        provider_id: itemData.provider_id || notification.user_id || '',
        provider_name: itemData.provider_name || 'Anonymous',
        provider_avatar: itemData.provider_avatar,
        status: itemData.status || 'active',
        created_at: notification.created_at || new Date().toISOString(),
        updated_at: notification.updated_at || notification.created_at || new Date().toISOString(),
        location: itemData.location,
        rating: itemData.rating || 0,
        reviews_count: itemData.reviews_count || 0,
        tags: itemData.tags || []
      };
    } catch (error) {
      console.error('Error transforming notification to item:', error);
      return null;
    }
  }
}

export const crudAPI = new CrudAPI();
