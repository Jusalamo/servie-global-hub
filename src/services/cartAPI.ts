
import { supabase } from "@/integrations/supabase/client";

export const cartAPI = {
  async getCartItems(userId: string) {
    try {
      // Get pending order
      const { data: order, error: orderError } = await supabase
        .from('orders' as any)
        .select('id')
        .eq('user_id', userId)
        .eq('status', 'pending')
        .maybeSingle();

      if (orderError) {
        console.error('Error fetching order:', orderError);
        return [];
      }

      if (!order) {
        return [];
      }

      // Get order items with product details
      const { data: items, error } = await supabase
        .from('order_items' as any)
        .select(`
          *,
          products!inner (
            id,
            name,
            image_url,
            seller_id
          )
        `)
        .eq('order_id', order.id);

      if (error) {
        console.error('Error fetching cart items:', error);
        return [];
      }

      return items || [];
    } catch (error) {
      console.error('Error in getCartItems:', error);
      return [];
    }
  },

  async addToCart(userId: string, productId: string, quantity: number = 1) {
    try {
      // Get or create pending order
      let { data: order, error: orderError } = await supabase
        .from('orders' as any)
        .select('*')
        .eq('user_id', userId)
        .eq('status', 'pending')
        .maybeSingle();

      if (orderError && orderError.code !== 'PGRST116') {
        throw orderError;
      }

      if (!order) {
        const { data: newOrder, error: createOrderError } = await supabase
          .from('orders' as any)
          .insert({
            user_id: userId,
            status: 'pending',
            total: 0
          })
          .select()
          .single();

        if (createOrderError) throw createOrderError;
        order = newOrder;
      }

      // Get product price
      const { data: product, error: productError } = await supabase
        .from('products' as any)
        .select('price')
        .eq('id', productId)
        .single();

      if (productError) throw productError;

      // Check if item already exists in cart
      const { data: existingItem, error: existingError } = await supabase
        .from('order_items' as any)
        .select('*')
        .eq('order_id', order.id)
        .eq('product_id', productId)
        .maybeSingle();

      if (existingError && existingError.code !== 'PGRST116') {
        throw existingError;
      }

      if (existingItem) {
        // Update quantity if item exists
        const newQuantity = (existingItem as any).quantity + quantity;
        const { error: updateError } = await supabase
          .from('order_items' as any)
          .update({ quantity: newQuantity })
          .eq('id', (existingItem as any).id);

        if (updateError) throw updateError;
      } else {
        // Add new item
        const { error: insertError } = await supabase
          .from('order_items' as any)
          .insert({
            order_id: order.id,
            product_id: productId,
            quantity,
            price: (product as any).price
          });

        if (insertError) throw insertError;
      }

      // Update order total
      await this.updateOrderTotal(order.id);
      return true;
    } catch (error) {
      console.error('Error adding to cart:', error);
      throw error;
    }
  },

  async removeFromCart(itemId: string) {
    try {
      const { data: item, error: getError } = await supabase
        .from('order_items' as any)
        .select('order_id')
        .eq('id', itemId)
        .single();

      if (getError) throw getError;

      const { error: deleteError } = await supabase
        .from('order_items' as any)
        .delete()
        .eq('id', itemId);

      if (deleteError) throw deleteError;

      if (item) {
        await this.updateOrderTotal((item as any).order_id);
      }
      
      return true;
    } catch (error) {
      console.error('Error removing from cart:', error);
      throw error;
    }
  },

  async updateQuantity(itemId: string, quantity: number) {
    try {
      const { data: item, error: updateError } = await supabase
        .from('order_items' as any)
        .update({ quantity })
        .eq('id', itemId)
        .select('order_id')
        .single();

      if (updateError) throw updateError;

      if (item) {
        await this.updateOrderTotal((item as any).order_id);
      }
      
      return true;
    } catch (error) {
      console.error('Error updating quantity:', error);
      throw error;
    }
  },

  async updateOrderTotal(orderId: string) {
    try {
      const { data: items, error: itemsError } = await supabase
        .from('order_items' as any)
        .select('quantity, price')
        .eq('order_id', orderId);

      if (itemsError) throw itemsError;

      const total = items?.reduce((sum: number, item: any) => sum + (item.quantity * item.price), 0) || 0;

      const { error: updateError } = await supabase
        .from('orders' as any)
        .update({ total })
        .eq('id', orderId);

      if (updateError) throw updateError;
    } catch (error) {
      console.error('Error updating order total:', error);
    }
  },

  async clearCart(userId: string) {
    try {
      const { data: order, error: orderError } = await supabase
        .from('orders' as any)
        .select('id')
        .eq('user_id', userId)
        .eq('status', 'pending')
        .maybeSingle();

      if (orderError && orderError.code !== 'PGRST116') {
        throw orderError;
      }

      if (order) {
        const { error: deleteItemsError } = await supabase
          .from('order_items' as any)
          .delete()
          .eq('order_id', (order as any).id);

        if (deleteItemsError) throw deleteItemsError;

        const { error: deleteOrderError } = await supabase
          .from('orders' as any)
          .delete()
          .eq('id', (order as any).id);

        if (deleteOrderError) throw deleteOrderError;
      }

      return true;
    } catch (error) {
      console.error('Error clearing cart:', error);
      throw error;
    }
  }
};
