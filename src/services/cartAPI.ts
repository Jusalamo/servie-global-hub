
import { supabase } from "@/integrations/supabase/client";

export const cartAPI = {
  async getCartItems(userId: string) {
    try {
      // Get pending order
      const { data: order } = await supabase
        .from('orders' as any)
        .select('id')
        .eq('user_id', userId)
        .eq('status', 'pending')
        .single();

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
      let { data: order } = await supabase
        .from('orders' as any)
        .select('*')
        .eq('user_id', userId)
        .eq('status', 'pending')
        .single();

      if (!order) {
        const { data: newOrder, error: orderError } = await supabase
          .from('orders' as any)
          .insert({
            user_id: userId,
            status: 'pending',
            total: 0
          })
          .select()
          .single();

        if (orderError) throw orderError;
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
      const { data: existingItem } = await supabase
        .from('order_items' as any)
        .select('*')
        .eq('order_id', order.id)
        .eq('product_id', productId)
        .single();

      if (existingItem) {
        // Update quantity
        await supabase
          .from('order_items' as any)
          .update({ quantity: existingItem.quantity + quantity })
          .eq('id', existingItem.id);
      } else {
        // Add new item
        await supabase
          .from('order_items' as any)
          .insert({
            order_id: order.id,
            product_id: productId,
            quantity,
            price: product.price
          });
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
      const { data: item } = await supabase
        .from('order_items' as any)
        .select('order_id')
        .eq('id', itemId)
        .single();

      await supabase
        .from('order_items' as any)
        .delete()
        .eq('id', itemId);

      if (item) {
        await this.updateOrderTotal(item.order_id);
      }
      
      return true;
    } catch (error) {
      console.error('Error removing from cart:', error);
      throw error;
    }
  },

  async updateQuantity(itemId: string, quantity: number) {
    try {
      const { data: item } = await supabase
        .from('order_items' as any)
        .update({ quantity })
        .eq('id', itemId)
        .select('order_id')
        .single();

      if (item) {
        await this.updateOrderTotal(item.order_id);
      }
      
      return true;
    } catch (error) {
      console.error('Error updating quantity:', error);
      throw error;
    }
  },

  async updateOrderTotal(orderId: string) {
    try {
      const { data: items } = await supabase
        .from('order_items' as any)
        .select('quantity, price')
        .eq('order_id', orderId);

      const total = items?.reduce((sum: number, item: any) => sum + (item.quantity * item.price), 0) || 0;

      await supabase
        .from('orders' as any)
        .update({ total })
        .eq('id', orderId);
    } catch (error) {
      console.error('Error updating order total:', error);
    }
  },

  async clearCart(userId: string) {
    try {
      const { data: order } = await supabase
        .from('orders' as any)
        .select('id')
        .eq('user_id', userId)
        .eq('status', 'pending')
        .single();

      if (order) {
        await supabase
          .from('order_items' as any)
          .delete()
          .eq('order_id', order.id);

        await supabase
          .from('orders' as any)
          .delete()
          .eq('id', order.id);
      }

      return true;
    } catch (error) {
      console.error('Error clearing cart:', error);
      throw error;
    }
  }
};
