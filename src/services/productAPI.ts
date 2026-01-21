import { supabase } from "@/integrations/supabase/client";

export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  image_url?: string;
  images?: string[];
  video_url?: string;
  seller_id: string;
  category_id?: string;
  category?: string;
  status: string;
  stock_quantity?: number;
  stock?: number;
  featured: boolean;
  created_at: string;
  updated_at: string;
  shipping_type?: string;
  shipping_cost?: number;
  shipping_policy?: string;
  return_policy?: string;
  delivery_time?: string;
}

export interface CreateProductData {
  name: string;
  description?: string;
  price: number;
  category_id?: string;
  category?: string;
  stock_quantity?: number;
  stock?: number;
  featured?: boolean;
  status?: string;
  shipping_type?: string;
  shipping_cost?: number;
  shipping_policy?: string;
  return_policy?: string;
  delivery_time?: string;
}

export interface ProductFilters {
  category_id?: string;
  status?: string;
  seller_id?: string;
}

export class ProductAPI {
  /**
   * Upload image to Supabase storage
   * Uses service-images bucket with user folder structure for RLS
   */
  private async uploadImage(file: File, userId: string): Promise<string> {
    const fileExt = file.name.split('.').pop()?.toLowerCase() || 'jpg';
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
    // Use user ID as folder for RLS compliance
    const filePath = `${userId}/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('service-images')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) {
      console.error('Upload error:', uploadError);
      throw new Error(`Failed to upload image: ${uploadError.message}`);
    }

    const { data: urlData } = supabase.storage
      .from('service-images')
      .getPublicUrl(filePath);

    return urlData.publicUrl;
  }

  async createProduct(productData: CreateProductData, imageFile?: File): Promise<Product> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    let image_url: string | null = null;

    // Upload image if provided
    if (imageFile) {
      try {
        image_url = await this.uploadImage(imageFile, user.id);
      } catch (error) {
        console.error('Image upload failed:', error);
        // Continue without image rather than failing entire product creation
      }
    }

    const { data, error } = await supabase
      .from('products')
      .insert({
        name: productData.name,
        description: productData.description || null,
        price: productData.price,
        stock: productData.stock || productData.stock_quantity || 0,
        category: productData.category || productData.category_id || null,
        featured: productData.featured || false,
        status: productData.status || 'active',
        shipping_type: productData.shipping_type || 'fixed',
        shipping_cost: productData.shipping_cost || 0,
        shipping_policy: productData.shipping_policy || null,
        return_policy: productData.return_policy || null,
        delivery_time: productData.delivery_time || null,
        seller_id: user.id,
        image_url,
        images: image_url ? [image_url] : []
      })
      .select()
      .single();

    if (error) {
      console.error('Product creation error:', error);
      throw new Error(`Failed to create product: ${error.message}`);
    }
    
    return data as Product;
  }

  async getProducts(filters: ProductFilters = {}): Promise<Product[]> {
    const { data: { user } } = await supabase.auth.getUser();
    
    let query = supabase
      .from('products')
      .select('id, name, description, price, image_url, images, seller_id, category, status, stock, featured, created_at')
      .order('featured', { ascending: false })
      .order('created_at', { ascending: false });

    // If seller_id is provided, filter by it
    if (filters.seller_id) {
      query = query.eq('seller_id', filters.seller_id);
    } else if (user) {
      // If no seller_id filter and user is authenticated, show user's products
      query = query.eq('seller_id', user.id);
    } else {
      // Show active products for public view
      query = query.eq('status', 'active');
    }

    if (filters.category_id) {
      query = query.eq('category', filters.category_id);
    }

    if (filters.status) {
      query = query.eq('status', filters.status);
    }

    const { data, error } = await query;
    if (error) throw error;
    return (data || []) as Product[];
  }

  async getProductById(id: string): Promise<Product | null> {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw error;
    }
    return data as Product;
  }

  async updateProduct(id: string, updates: Partial<CreateProductData>, imageFile?: File): Promise<Product> {
    const updateData: Record<string, unknown> = {};
    
    // Only include fields that are actually being updated
    if (updates.name !== undefined) updateData.name = updates.name;
    if (updates.description !== undefined) updateData.description = updates.description;
    if (updates.price !== undefined) updateData.price = updates.price;
    if (updates.stock !== undefined) updateData.stock = updates.stock;
    if (updates.stock_quantity !== undefined) updateData.stock = updates.stock_quantity;
    if (updates.category !== undefined) updateData.category = updates.category;
    if (updates.category_id !== undefined) updateData.category = updates.category_id;
    if (updates.featured !== undefined) updateData.featured = updates.featured;
    if (updates.status !== undefined) updateData.status = updates.status;
    if (updates.shipping_type !== undefined) updateData.shipping_type = updates.shipping_type;
    if (updates.shipping_cost !== undefined) updateData.shipping_cost = updates.shipping_cost;
    if (updates.shipping_policy !== undefined) updateData.shipping_policy = updates.shipping_policy;
    if (updates.return_policy !== undefined) updateData.return_policy = updates.return_policy;
    if (updates.delivery_time !== undefined) updateData.delivery_time = updates.delivery_time;

    // Upload new image if provided
    if (imageFile) {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      try {
        const imageUrl = await this.uploadImage(imageFile, user.id);
        updateData.image_url = imageUrl;
        
        // Get existing images and add new one
        const { data: existingProduct } = await supabase
          .from('products')
          .select('images')
          .eq('id', id)
          .single();
        
        const existingImages = existingProduct?.images || [];
        updateData.images = [...existingImages, imageUrl];
      } catch (error) {
        console.error('Image upload failed during update:', error);
      }
    }

    updateData.updated_at = new Date().toISOString();

    const { data, error } = await supabase
      .from('products')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data as Product;
  }

  async deleteProduct(id: string): Promise<void> {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  async updateStock(id: string, newStock: number): Promise<Product> {
    const { data, error } = await supabase
      .from('products')
      .update({ 
        stock: newStock,
        stock_status: newStock > 10 ? 'in-stock' : newStock > 0 ? 'low-stock' : 'out-of-stock',
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data as Product;
  }
}

export const productAPI = new ProductAPI();
