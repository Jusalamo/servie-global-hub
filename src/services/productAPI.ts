import { supabase } from "@/integrations/supabase/client";

export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  image_url?: string;
  seller_id: string;
  category_id?: string;
  category?: string;
  status: string; // Changed from 'active' | 'inactive' to string to match DB
  stock_quantity?: number;
  stock?: number; // Added to match DB schema
  featured: boolean;
  created_at: string;
  updated_at: string;
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
  status?: string; // Changed from 'active' | 'inactive' to string
}

export interface ProductFilters {
  category_id?: string;
  status?: string;
  seller_id?: string;
}

export class ProductAPI {
  async createProduct(productData: CreateProductData, imageFile?: File): Promise<Product> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    let image_url = null;

    // Upload image if provided
    if (imageFile) {
      const fileExt = imageFile.name.split('.').pop();
      const filePath = `products/${user.id}-${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, imageFile);

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      image_url = urlData.publicUrl;
    }

    const { data, error } = await supabase
      .from('products')
      .insert({
        ...productData,
        seller_id: user.id,
        image_url,
        status: productData.status || 'active'
      })
      .select()
      .single();

    if (error) throw error;
    return data as Product; // Added type assertion
  }

  async getProducts(filters: ProductFilters = {}): Promise<Product[]> {
    const { data: { user } } = await supabase.auth.getUser();
    
    let query = supabase
      .from('products')
      .select('*')
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
      query = query.eq('category_id', filters.category_id);
    }

    if (filters.status) {
      query = query.eq('status', filters.status);
    }

    const { data, error } = await query;
    if (error) throw error;
    return (data || []) as Product[]; // Added type assertion
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
    return data as Product; // Added type assertion
  }

  async updateProduct(id: string, updates: Partial<CreateProductData>, imageFile?: File): Promise<Product> {
    const updateData: any = { ...updates };

    // Upload new image if provided
    if (imageFile) {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const fileExt = imageFile.name.split('.').pop();
      const filePath = `products/${user.id}-${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, imageFile);

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      updateData.image_url = urlData.publicUrl;
    }

    const { data, error } = await supabase
      .from('products')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data as Product; // Added type assertion
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
      .update({ stock: newStock }) // Changed from stock_quantity to stock
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data as Product; // Added type assertion
  }
}

export const productAPI = new ProductAPI();