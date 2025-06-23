
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './AuthContext';
import { toast } from 'sonner';

interface CartItem {
  id: string;
  product_id: string;
  quantity: number;
  price: number;
  products: {
    id: string;
    name: string;
    image_url?: string;
    seller_id: string;
  };
}

interface CartContextType {
  cartItems: CartItem[];
  cartCount: number;
  cartTotal: number;
  addToCart: (productId: string, quantity?: number) => Promise<void>;
  removeFromCart: (itemId: string) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const { user } = useAuth();

  const refreshCart = async () => {
    if (!user) {
      setCartItems([]);
      return;
    }

    try {
      // Get pending order first
      const { data: order } = await supabase
        .from('orders')
        .select('id')
        .eq('user_id', user.id)
        .eq('status', 'pending')
        .single();

      if (!order) {
        setCartItems([]);
        return;
      }

      // Get order items with product details
      const { data: items, error } = await supabase
        .from('order_items')
        .select(`
          *,
          products(*)
        `)
        .eq('order_id', order.id);

      if (error) {
        console.error('Error loading cart:', error);
        setCartItems([]);
        return;
      }

      setCartItems(items || []);
    } catch (error) {
      console.error('Error loading cart:', error);
      setCartItems([]);
    }
  };

  useEffect(() => {
    if (user) {
      refreshCart();
    } else {
      setCartItems([]);
    }
  }, [user]);

  const addToCart = async (productId: string, quantity: number = 1) => {
    if (!user) {
      toast.error('Please sign in to add items to cart');
      return;
    }

    try {
      // Get or create pending order
      let { data: order } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'pending')
        .single();

      if (!order) {
        const { data: newOrder, error: orderError } = await supabase
          .from('orders')
          .insert({
            user_id: user.id,
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
        .from('products')
        .select('price')
        .eq('id', productId)
        .single();

      if (productError) throw productError;

      // Check if item already exists in cart
      const { data: existingItem } = await supabase
        .from('order_items')
        .select('*')
        .eq('order_id', order.id)
        .eq('product_id', productId)
        .single();

      if (existingItem) {
        // Update quantity
        await supabase
          .from('order_items')
          .update({ quantity: existingItem.quantity + quantity })
          .eq('id', existingItem.id);
      } else {
        // Add new item
        await supabase
          .from('order_items')
          .insert({
            order_id: order.id,
            product_id: productId,
            quantity,
            price: product.price
          });
      }

      // Update order total
      await updateOrderTotal(order.id);
      await refreshCart();
      toast.success('Product added to cart');
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Failed to add product to cart');
    }
  };

  const removeFromCart = async (itemId: string) => {
    try {
      const { data: item } = await supabase
        .from('order_items')
        .select('order_id')
        .eq('id', itemId)
        .single();

      await supabase
        .from('order_items')
        .delete()
        .eq('id', itemId);

      if (item) {
        await updateOrderTotal(item.order_id);
      }
      
      await refreshCart();
      toast.success('Product removed from cart');
    } catch (error) {
      console.error('Error removing from cart:', error);
      toast.error('Failed to remove product from cart');
    }
  };

  const updateQuantity = async (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      return removeFromCart(itemId);
    }

    try {
      const { data: item } = await supabase
        .from('order_items')
        .update({ quantity })
        .eq('id', itemId)
        .select('order_id')
        .single();

      if (item) {
        await updateOrderTotal(item.order_id);
      }
      
      await refreshCart();
    } catch (error) {
      console.error('Error updating quantity:', error);
      toast.error('Failed to update quantity');
    }
  };

  const updateOrderTotal = async (orderId: string) => {
    const { data: items } = await supabase
      .from('order_items')
      .select('quantity, price')
      .eq('order_id', orderId);

    const total = items?.reduce((sum, item) => sum + (item.quantity * item.price), 0) || 0;

    await supabase
      .from('orders')
      .update({ total })
      .eq('id', orderId);
  };

  const clearCart = async () => {
    if (!user) return;

    try {
      const { data: order } = await supabase
        .from('orders')
        .select('id')
        .eq('user_id', user.id)
        .eq('status', 'pending')
        .single();

      if (order) {
        await supabase
          .from('order_items')
          .delete()
          .eq('order_id', order.id);

        await supabase
          .from('orders')
          .delete()
          .eq('id', order.id);
      }

      setCartItems([]);
      toast.success('Cart cleared');
    } catch (error) {
      console.error('Error clearing cart:', error);
      toast.error('Failed to clear cart');
    }
  };

  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);
  const cartTotal = cartItems.reduce((total, item) => total + (item.quantity * item.price), 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartCount,
        cartTotal,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        refreshCart
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
