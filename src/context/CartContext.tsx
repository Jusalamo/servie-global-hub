
import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { toast } from "sonner";

interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  providerId: string;
  providerName: string;
}

interface CartContextType {
  cartItems: CartItem[];
  cartCount: number;
  cartTotal: number;
  addToCart: (item: CartItem) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType>({
  cartItems: [],
  cartCount: 0,
  cartTotal: 0,
  addToCart: () => {},
  removeFromCart: () => {},
  updateQuantity: () => {},
  clearCart: () => {},
});

export const useCart = () => useContext(CartContext);

interface CartProviderProps {
  children: React.ReactNode;
}

export const CartProvider = ({ children }: CartProviderProps) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [cartCount, setCartCount] = useState(0);
  const [cartTotal, setCartTotal] = useState(0);
  
  // Load cart from localStorage on initial load
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem("cart");
      if (savedCart) {
        const parsedCart = JSON.parse(savedCart);
        setCartItems(parsedCart);
        updateCartMetrics(parsedCart);
      }
    } catch (error) {
      console.error("Failed to load cart from localStorage:", error);
    }
  }, []);
  
  // Update cart metrics (count and total)
  const updateCartMetrics = useCallback((items: CartItem[]) => {
    const count = items.reduce((sum, item) => sum + item.quantity, 0);
    const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    setCartCount(count);
    setCartTotal(total);
    
    // Save cart to localStorage
    try {
      localStorage.setItem("cart", JSON.stringify(items));
    } catch (error) {
      console.error("Failed to save cart to localStorage:", error);
    }
  }, []);
  
  // Update cart count and total whenever cart items change
  useEffect(() => {
    updateCartMetrics(cartItems);
  }, [cartItems, updateCartMetrics]);
  
  const addToCart = (item: CartItem) => {
    setCartItems(prevItems => {
      const existingItemIndex = prevItems.findIndex(i => i.id === item.id);
      let updatedItems;
      
      if (existingItemIndex > -1) {
        // Item already exists, update quantity
        updatedItems = [...prevItems];
        updatedItems[existingItemIndex].quantity += item.quantity;
      } else {
        // Item doesn't exist, add it
        updatedItems = [...prevItems, item];
      }
      
      // Immediately display feedback
      toast.success(`${item.name} added to cart!`);
      
      // Update metrics immediately
      setTimeout(() => updateCartMetrics(updatedItems), 0);
      
      return updatedItems;
    });
  };
  
  const removeFromCart = (itemId: string) => {
    setCartItems(prevItems => {
      const updatedItems = prevItems.filter(item => item.id !== itemId);
      toast.info("Item removed from cart");
      return updatedItems;
    });
  };
  
  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity < 1) {
      removeFromCart(itemId);
      return;
    }
    
    setCartItems(prevItems => {
      const updatedItems = prevItems.map(item => 
        item.id === itemId 
          ? { ...item, quantity } 
          : item
      );
      return updatedItems;
    });
  };
  
  const clearCart = () => {
    setCartItems([]);
    toast.info("Cart cleared");
  };
  
  return (
    <CartContext.Provider value={{
      cartItems,
      cartCount,
      cartTotal,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
    }}>
      {children}
    </CartContext.Provider>
  );
};
