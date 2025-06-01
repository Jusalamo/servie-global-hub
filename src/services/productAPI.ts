
import { supabase } from "@/integrations/supabase/client";

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image_url?: string;
  stock: number;
  status: 'active' | 'inactive';
  seller_id: string;
  created_at: string;
  updated_at: string;
}

export interface CreateProductData {
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  status: 'active' | 'inactive';
  image_url?: string;
}

export interface ProductFilters {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  sellerId?: string;
  status?: 'active' | 'inactive';
}

class ProductAPI {
  async createProduct(productData: CreateProductData, imageFile?: File): Promise<Product> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      let imageUrl = productData.image_url || null;
      
      // Handle image upload if provided (simplified)
      if (imageFile) {
        // For now, we'll skip the actual file upload and use a placeholder
        imageUrl = 'https://via.placeholder.com/300x200';
      }

      // Store product as a notification with product data
      const { data, error } = await supabase
        .from('notifications')
        .insert({
          user_id: user.id,
          title: 'Product Created',
          message: `Product: ${productData.name}`,
          type: 'system',
          data: {
            product_type: 'listing',
            ...productData,
            image_url: imageUrl,
            seller_id: user.id
          }
        })
        .select()
        .single();

      if (error) throw error;

      // Transform to product format
      const product: Product = {
        id: data.id,
        name: productData.name,
        description: productData.description,
        price: productData.price,
        category: productData.category,
        image_url: imageUrl || undefined,
        stock: productData.stock,
        status: productData.status,
        seller_id: user.id,
        created_at: data.created_at || new Date().toISOString(),
        updated_at: data.created_at || new Date().toISOString()
      };

      return product;
    } catch (error) {
      console.error('Error creating product:', error);
      throw error;
    }
  }

  async getProducts(filters: ProductFilters = {}): Promise<Product[]> {
    try {
      let query = supabase
        .from('notifications')
        .select('*')
        .eq('type', 'system')
        .order('created_at', { ascending: false });

      const { data, error } = await query;

      if (error) throw error;

      // Filter and transform notifications to products with proper type assertions
      let products: Product[] = (data || [])
        .filter(notification => {
          const notificationData = notification.data as any;
          return notificationData?.product_type === 'listing';
        })
        .map(notification => {
          const notificationData = notification.data as any;
          return {
            id: notification.id,
            name: notificationData?.name || '',
            description: notificationData?.description || '',
            price: notificationData?.price || 0,
            category: notificationData?.category || '',
            image_url: notificationData?.image_url || undefined,
            stock: notificationData?.stock || 0,
            status: notificationData?.status || 'active',
            seller_id: notificationData?.seller_id || notification.user_id || '',
            created_at: notification.created_at || new Date().toISOString(),
            updated_at: notification.created_at || new Date().toISOString()
          };
        });

      // Apply filters
      if (filters.category) {
        products = products.filter(p => p.category === filters.category);
      }
      
      if (filters.sellerId) {
        products = products.filter(p => p.seller_id === filters.sellerId);
      }
      
      if (filters.status) {
        products = products.filter(p => p.status === filters.status);
      }
      
      if (filters.minPrice !== undefined) {
        products = products.filter(p => p.price >= filters.minPrice!);
      }
      
      if (filters.maxPrice !== undefined) {
        products = products.filter(p => p.price <= filters.maxPrice!);
      }
      
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        products = products.filter(p => 
          p.name.toLowerCase().includes(searchLower) || 
          p.description.toLowerCase().includes(searchLower)
        );
      }

      return products;
    } catch (error) {
      console.error('Error fetching products:', error);
      return [];
    }
  }

  async getProductById(id: string): Promise<Product | null> {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') return null;
        throw error;
      }

      const notificationData = data.data as any;
      if (!notificationData?.product_type) return null;
      
      const product: Product = {
        id: data.id,
        name: notificationData?.name || '',
        description: notificationData?.description || '',
        price: notificationData?.price || 0,
        category: notificationData?.category || '',
        image_url: notificationData?.image_url || undefined,
        stock: notificationData?.stock || 0,
        status: notificationData?.status || 'active',
        seller_id: notificationData?.seller_id || data.user_id || '',
        created_at: data.created_at || new Date().toISOString(),
        updated_at: data.created_at || new Date().toISOString()
      };
      
      return product;
    } catch (error) {
      console.error('Error fetching product:', error);
      return null;
    }
  }

  async updateProduct(id: string, updates: Partial<CreateProductData>, imageFile?: File): Promise<Product> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      let updateData: any = { ...updates };

      // Handle image upload if provided (simplified)
      if (imageFile) {
        updateData.image_url = 'https://via.placeholder.com/300x200';
      }

      const { data, error } = await supabase
        .from('notifications')
        .update({
          data: { ...updateData, product_type: 'listing' }
        })
        .eq('id', id)
        .eq('user_id', user.id) // Ensure user can only update their own products
        .select()
        .single();

      if (error) throw error;

      const notificationData = data.data as any;
      const product: Product = {
        id: data.id,
        name: notificationData?.name || '',
        description: notificationData?.description || '',
        price: notificationData?.price || 0,
        category: notificationData?.category || '',
        image_url: notificationData?.image_url || undefined,
        stock: notificationData?.stock || 0,
        status: notificationData?.status || 'active',
        seller_id: notificationData?.seller_id || data.user_id || '',
        created_at: data.created_at || new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      return product;
    } catch (error) {
      console.error('Error updating product:', error);
      throw error;
    }
  }

  async deleteProduct(id: string): Promise<void> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id); // Ensure user can only delete their own products

      if (error) throw error;
    } catch (error) {
      console.error('Error deleting product:', error);
      throw error;
    }
  }

  async updateStock(id: string, newStock: number): Promise<Product> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('notifications')
        .update({
          data: { stock: newStock, product_type: 'listing' }
        })
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;

      const notificationData = data.data as any;
      const product: Product = {
        id: data.id,
        name: notificationData?.name || '',
        description: notificationData?.description || '',
        price: notificationData?.price || 0,
        category: notificationData?.category || '',
        image_url: notificationData?.image_url || undefined,
        stock: newStock,
        status: notificationData?.status || 'active',
        seller_id: notificationData?.seller_id || data.user_id || '',
        created_at: data.created_at || new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      return product;
    } catch (error) {
      console.error('Error updating stock:', error);
      throw error;
    }
  }
}

export const productAPI = new ProductAPI();
