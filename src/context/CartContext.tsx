import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./AuthContext";
import { toast } from "sonner";

export interface CartItem {
  id: string;
  product_id: string;
  quantity: number;
  product?: {
    id: string;
    name: string;
    price: number;
    image_url?: string;
    stock: number;
  };
}

interface CartContextType {
  cartItems: CartItem[];
  cartCount: number;
  cartTotal: number;
  isLoading: boolean;
  addToCart: (productId: string, productName: string, quantity?: number) => Promise<void>;
  removeFromCart: (cartItemId: string) => Promise<void>;
  updateQuantity: (cartItemId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType>({
  cartItems: [],
  cartCount: 0,
  cartTotal: 0,
  isLoading: false,
  addToCart: async () => {},
  removeFromCart: async () => {},
  updateQuantity: async () => {},
  clearCart: async () => {},
  refreshCart: async () => {},
});

export const useCart = () => useContext(CartContext);

interface CartProviderProps {
  children: React.ReactNode;
}

export const CartProvider = ({ children }: CartProviderProps) => {
  const { user, isAuthenticated } = useAuth();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [cartCount, setCartCount] = useState(0);
  const [cartTotal, setCartTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch cart items from Supabase
  const fetchCartItems = async () => {
    if (!user) {
      setCartItems([]);
      setCartCount(0);
      setCartTotal(0); // Added: Ensure total is zeroed out on sign-out
      setIsLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('cart_items')
        .select(`
          id,
          product_id,
          quantity,
          product:products(id, name, price, image_url, stock)
        `)
        .eq('user_id', user.id);

      if (error) throw error;

      const loadedItems = data as CartItem[] || [];
      setCartItems(loadedItems);
      
      const count = loadedItems.reduce((sum, item) => sum + item.quantity, 0);
      const total = loadedItems.reduce((sum, item) => sum + ((item.product?.price || 0) * item.quantity), 0);
      
      setCartCount(count);
      setCartTotal(total);
    } catch (error) {
      console.error('Error fetching cart:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // ⭐️ CORRECTED addToCart FUNCTION ⭐️
  const addToCart = async (productId: string, productName: string, quantity: number = 1) => {
    if (!isAuthenticated || !user) {
      toast.error('Please sign in to add items to cart');
      return;
    }

    try {
      // 1. Check if the item already exists in the cart
      const existingCartItem = cartItems.find(item => item.product_id === productId);

      if (existingCartItem) {
        // 2. If it exists, UPDATE the quantity by INCREMENTING it
        const newQuantity = existingCartItem.quantity + quantity;

        const { error: updateError } = await supabase
          .from('cart_items')
          .update({ 
            quantity: newQuantity, 
            updated_at: new Date().toISOString() // Good practice for tracking changes
          })
          .eq('id', existingCartItem.id)
          .eq('user_id', user.id);

        if (updateError) throw updateError;
        
      } else {
        // 3. If it does NOT exist, INSERT a new item
        const { error: insertError } = await supabase
          .from('cart_items')
          .insert({
            user_id: user.id,
            product_id: productId,
            quantity: quantity,
          });

        if (insertError) throw insertError;
      }

      toast.success(`${productName} added to cart`);
      await fetchCartItems();
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Failed to add to cart');
    }
  };

  // Update cart item quantity
  const updateQuantity = async (cartItemId: string, quantity: number) => {
    if (quantity < 1) {
      await removeFromCart(cartItemId);
      return;
    }

    try {
      const { error } = await supabase
        .from('cart_items')
        .update({ quantity, updated_at: new Date().toISOString() })
        .eq('id', cartItemId)
        .eq('user_id', user!.id);

      if (error) throw error;

      await fetchCartItems();
    } catch (error) {
      console.error('Error updating quantity:', error);
      toast.error('Failed to update quantity');
    }
  };

  // Remove item from cart
  const removeFromCart = async (cartItemId: string) => {
    try {
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('id', cartItemId)
        .eq('user_id', user!.id);

      if (error) throw error;

      toast.success('Removed from cart');
      await fetchCartItems();
    } catch (error) {
      console.error('Error removing from cart:', error);
      toast.error('Failed to remove from cart');
    }
  };

  // Clear entire cart
  const clearCart = async () => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('user_id', user.id);

      if (error) throw error;

      setCartItems([]);
      setCartCount(0);
      setCartTotal(0); // Added: Clear total on clearCart
      toast.success('Cart cleared');
    } catch (error) {
      console.error('Error clearing cart:', error);
      toast.error('Failed to clear cart');
    }
  };

  // Real-time subscription for cart updates
  useEffect(() => {
    if (!user) {
      setCartItems([]);
      setCartCount(0);
      setCartTotal(0);
      setIsLoading(false);
      return;
    }

    // Initial fetch
    fetchCartItems();

    // Subscribe to real-time cart changes
    const channel = supabase
      .channel('cart-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'cart_items',
          // Note: The filter user_id=eq.${user.id} only works if you have RLS enabled
          // and a policy that allows users to see their own cart items.
          filter: `user_id=eq.${user.id}` 
        },
        // We re-fetch the entire cart upon any change to update all calculated values (count/total)
        () => {
          fetchCartItems(); 
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id]); // Depend on user ID

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartCount,
        cartTotal,
        isLoading,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        refreshCart: fetchCartItems
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
