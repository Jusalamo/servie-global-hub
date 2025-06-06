
import { supabase } from "@/integrations/supabase/client";

export interface Service {
  id: string;
  title: string;
  description: string;
  category: string;
  price: number;
  currency: string;
  provider_id: string;
  provider_name: string;
  rating: number;
  reviews_count: number;
  image_url?: string;
  location: string;
  available: boolean;
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  currency: string;
  seller_id: string;
  seller_name: string;
  rating: number;
  reviews_count: number;
  image_url?: string;
  stock_quantity: number;
  created_at: string;
  updated_at: string;
}

export interface CreateServiceData {
  title: string;
  description: string;
  category: string;
  price: number;
  currency: string;
  location: string;
  image_url?: string;
}

export interface CreateProductData {
  name: string;
  description: string;
  category: string;
  price: number;
  currency: string;
  stock_quantity: number;
  image_url?: string;
}

export interface UpdateServiceData extends Partial<CreateServiceData> {
  available?: boolean;
}

export interface UpdateProductData extends Partial<CreateProductData> {}

// Helper function to safely extract data from Json type
function safeGetData(data: any): any {
  return data && typeof data === 'object' ? data : {};
}

class CRUDAPIService {
  // Services CRUD Operations
  async createService(serviceData: CreateServiceData): Promise<Service> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // For now, store in notifications table as a workaround
      const { data, error } = await supabase
        .from('notifications')
        .insert({
          user_id: user.id,
          title: 'New Service Created',
          message: `Service: ${serviceData.title}`,
          type: 'service',
          data: {
            ...serviceData,
            provider_id: user.id,
            provider_name: user.email?.split('@')[0] || 'Provider',
            rating: 0,
            reviews_count: 0,
            available: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
        })
        .select()
        .single();

      if (error) throw error;

      return {
        id: data.id,
        ...serviceData,
        provider_id: user.id,
        provider_name: user.email?.split('@')[0] || 'Provider',
        rating: 0,
        reviews_count: 0,
        available: true,
        created_at: data.created_at || new Date().toISOString(),
        updated_at: data.created_at || new Date().toISOString()
      };
    } catch (error) {
      console.error('Error creating service:', error);
      throw error;
    }
  }

  async getServices(filters?: { category?: string; location?: string; provider_id?: string }): Promise<Service[]> {
    try {
      let query = supabase
        .from('notifications')
        .select('*')
        .eq('type', 'service')
        .order('created_at', { ascending: false });

      if (filters?.provider_id) {
        query = query.eq('user_id', filters.provider_id);
      }

      const { data, error } = await query;
      if (error) throw error;

      return (data || [])
        .filter(notification => {
          const notificationData = safeGetData(notification.data);
          return notificationData?.title;
        })
        .map(notification => {
          const notificationData = safeGetData(notification.data);
          return {
            id: notification.id,
            title: notificationData.title || '',
            description: notificationData.description || '',
            category: notificationData.category || '',
            price: notificationData.price || 0,
            currency: notificationData.currency || 'USD',
            provider_id: notificationData.provider_id || '',
            provider_name: notificationData.provider_name || '',
            rating: notificationData.rating || 0,
            reviews_count: notificationData.reviews_count || 0,
            image_url: notificationData.image_url,
            location: notificationData.location || '',
            available: notificationData.available !== false,
            created_at: notification.created_at || new Date().toISOString(),
            updated_at: notificationData.updated_at || notification.created_at || new Date().toISOString()
          };
        })
        .filter(service => {
          if (filters?.category && service.category !== filters.category) return false;
          if (filters?.location && !service.location.toLowerCase().includes(filters.location.toLowerCase())) return false;
          return true;
        });
    } catch (error) {
      console.error('Error fetching services:', error);
      return [];
    }
  }

  async getServiceById(serviceId: string): Promise<Service | null> {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('id', serviceId)
        .eq('type', 'service')
        .single();

      if (error) {
        if (error.code === 'PGRST116') return null;
        throw error;
      }

      const notificationData = safeGetData(data.data);
      if (!notificationData?.title) return null;

      return {
        id: data.id,
        title: notificationData.title || '',
        description: notificationData.description || '',
        category: notificationData.category || '',
        price: notificationData.price || 0,
        currency: notificationData.currency || 'USD',
        provider_id: notificationData.provider_id || '',
        provider_name: notificationData.provider_name || '',
        rating: notificationData.rating || 0,
        reviews_count: notificationData.reviews_count || 0,
        image_url: notificationData.image_url,
        location: notificationData.location || '',
        available: notificationData.available !== false,
        created_at: data.created_at || new Date().toISOString(),
        updated_at: notificationData.updated_at || data.created_at || new Date().toISOString()
      };
    } catch (error) {
      console.error('Error fetching service:', error);
      return null;
    }
  }

  async updateService(serviceId: string, updateData: UpdateServiceData): Promise<Service> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const currentService = await this.getServiceById(serviceId);
      if (!currentService) throw new Error('Service not found');

      const updatedServiceData = {
        ...currentService,
        ...updateData,
        updated_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('notifications')
        .update({
          data: updatedServiceData,
          updated_at: new Date().toISOString()
        })
        .eq('id', serviceId)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;

      return updatedServiceData;
    } catch (error) {
      console.error('Error updating service:', error);
      throw error;
    }
  }

  async deleteService(serviceId: string): Promise<void> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', serviceId)
        .eq('user_id', user.id)
        .eq('type', 'service');

      if (error) throw error;
    } catch (error) {
      console.error('Error deleting service:', error);
      throw error;
    }
  }

  // Products CRUD Operations
  async createProduct(productData: CreateProductData): Promise<Product> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // For now, store in notifications table as a workaround
      const { data, error } = await supabase
        .from('notifications')
        .insert({
          user_id: user.id,
          title: 'New Product Created',
          message: `Product: ${productData.name}`,
          type: 'product',
          data: {
            ...productData,
            seller_id: user.id,
            seller_name: user.email?.split('@')[0] || 'Seller',
            rating: 0,
            reviews_count: 0,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
        })
        .select()
        .single();

      if (error) throw error;

      return {
        id: data.id,
        ...productData,
        seller_id: user.id,
        seller_name: user.email?.split('@')[0] || 'Seller',
        rating: 0,
        reviews_count: 0,
        created_at: data.created_at || new Date().toISOString(),
        updated_at: data.created_at || new Date().toISOString()
      };
    } catch (error) {
      console.error('Error creating product:', error);
      throw error;
    }
  }

  async getProducts(filters?: { category?: string; seller_id?: string }): Promise<Product[]> {
    try {
      let query = supabase
        .from('notifications')
        .select('*')
        .eq('type', 'product')
        .order('created_at', { ascending: false });

      if (filters?.seller_id) {
        query = query.eq('user_id', filters.seller_id);
      }

      const { data, error } = await query;
      if (error) throw error;

      return (data || [])
        .filter(notification => {
          const notificationData = safeGetData(notification.data);
          return notificationData?.name;
        })
        .map(notification => {
          const notificationData = safeGetData(notification.data);
          return {
            id: notification.id,
            name: notificationData.name || '',
            description: notificationData.description || '',
            category: notificationData.category || '',
            price: notificationData.price || 0,
            currency: notificationData.currency || 'USD',
            seller_id: notificationData.seller_id || notification.user_id || '',
            seller_name: notificationData.seller_name || '',
            rating: notificationData.rating || 0,
            reviews_count: notificationData.reviews_count || 0,
            image_url: notificationData.image_url,
            stock_quantity: notificationData.stock_quantity || 0,
            created_at: notification.created_at || new Date().toISOString(),
            updated_at: notificationData.updated_at || notification.created_at || new Date().toISOString()
          };
        })
        .filter(product => {
          if (filters?.category && product.category !== filters.category) return false;
          return true;
        });
    } catch (error) {
      console.error('Error fetching products:', error);
      return [];
    }
  }

  async getProductById(productId: string): Promise<Product | null> {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('id', productId)
        .eq('type', 'product')
        .single();

      if (error) {
        if (error.code === 'PGRST116') return null;
        throw error;
      }

      const notificationData = safeGetData(data.data);
      if (!notificationData?.name) return null;

      return {
        id: data.id,
        name: notificationData.name || '',
        description: notificationData.description || '',
        category: notificationData.category || '',
        price: notificationData.price || 0,
        currency: notificationData.currency || 'USD',
        seller_id: notificationData.seller_id || data.user_id || '',
        seller_name: notificationData.seller_name || '',
        rating: notificationData.rating || 0,
        reviews_count: notificationData.reviews_count || 0,
        image_url: notificationData.image_url,
        stock_quantity: notificationData.stock_quantity || 0,
        created_at: data.created_at || new Date().toISOString(),
        updated_at: notificationData.updated_at || data.created_at || new Date().toISOString()
      };
    } catch (error) {
      console.error('Error fetching product:', error);
      return null;
    }
  }

  async updateProduct(productId: string, updateData: UpdateProductData): Promise<Product> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const currentProduct = await this.getProductById(productId);
      if (!currentProduct) throw new Error('Product not found');

      const updatedProductData = {
        ...currentProduct,
        ...updateData,
        updated_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('notifications')
        .update({
          data: updatedProductData,
          updated_at: new Date().toISOString()
        })
        .eq('id', productId)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;

      return updatedProductData;
    } catch (error) {
      console.error('Error updating product:', error);
      throw error;
    }
  }

  async deleteProduct(productId: string): Promise<void> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', productId)
        .eq('user_id', user.id)
        .eq('type', 'product');

      if (error) throw error;
    } catch (error) {
      console.error('Error deleting product:', error);
      throw error;
    }
  }

  // Search functionality
  async searchServices(query: string, filters?: { category?: string; location?: string }): Promise<Service[]> {
    const services = await this.getServices(filters);
    return services.filter(service => 
      service.title.toLowerCase().includes(query.toLowerCase()) ||
      service.description.toLowerCase().includes(query.toLowerCase()) ||
      service.category.toLowerCase().includes(query.toLowerCase())
    );
  }

  async searchProducts(query: string, filters?: { category?: string }): Promise<Product[]> {
    const products = await this.getProducts(filters);
    return products.filter(product => 
      product.name.toLowerCase().includes(query.toLowerCase()) ||
      product.description.toLowerCase().includes(query.toLowerCase()) ||
      product.category.toLowerCase().includes(query.toLowerCase())
    );
  }
}

export const crudAPI = new CRUDAPIService();
