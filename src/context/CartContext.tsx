
import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "sonner";
import type { Product } from "@/components/ecommerce/ProductCard";

// Cart item type
export interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  providerId: string;
  providerName: string;
}

// Cart context interface
interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  isInCart: (productId: string) => boolean;
  getCartItemQuantity: (productId: string) => number;
  cartTotal: number;
  cartCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [cartTotal, setCartTotal] = useState(0);
  const [cartCount, setCartCount] = useState(0);

  // Load cart from localStorage on mount
  useEffect(() => {
    try {
      const savedCartItems = localStorage.getItem("cartItems");
      if (savedCartItems) {
        setCartItems(JSON.parse(savedCartItems));
      }
    } catch (error) {
      console.error("Failed to load cart from localStorage", error);
      localStorage.removeItem("cartItems");
    }
  }, []);

  // Update localStorage and totals when cart changes
  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
    
    // Calculate totals
    const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    setCartTotal(total);
    
    const count = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    setCartCount(count);
    
    // Notify other components about cart updates
    window.dispatchEvent(new CustomEvent('cart-updated'));
  }, [cartItems]);

  // Add product to cart
  const addToCart = (product: Product, quantity = 1) => {
    if (quantity <= 0) return;
    
    setCartItems(prevItems => {
      // Check if product already exists in cart
      const existingItemIndex = prevItems.findIndex(item => item.id === product.id);
      
      if (existingItemIndex >= 0) {
        // Update existing item
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex].quantity += quantity;
        toast.success(`Updated ${product.name} quantity in cart`);
        return updatedItems;
      } else {
        // Add new item
        toast.success(`Added ${product.name} to cart`);
        return [...prevItems, {
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.images[0] || '/placeholder.svg',
          quantity,
          providerId: product.providerId,
          providerName: product.providerName
        }];
      }
    });
  };

  // Remove product from cart
  const removeFromCart = (productId: string) => {
    setCartItems(prevItems => {
      const item = prevItems.find(item => item.id === productId);
      if (item) {
        toast.success(`Removed ${item.name} from cart`);
      }
      return prevItems.filter(item => item.id !== productId);
    });
  };

  // Update quantity of a product in cart
  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    
    setCartItems(prevItems => 
      prevItems.map(item => 
        item.id === productId 
          ? { ...item, quantity } 
          : item
      )
    );
  };

  // Clear entire cart
  const clearCart = () => {
    setCartItems([]);
    toast.success("Cart cleared");
  };

  // Check if a product is in the cart
  const isInCart = (productId: string) => {
    return cartItems.some(item => item.id === productId);
  };

  // Get quantity of a product in cart
  const getCartItemQuantity = (productId: string) => {
    const item = cartItems.find(item => item.id === productId);
    return item ? item.quantity : 0;
  };

  return (
    <CartContext.Provider 
      value={{ 
        cartItems, 
        addToCart, 
        removeFromCart, 
        updateQuantity, 
        clearCart, 
        isInCart, 
        getCartItemQuantity,
        cartTotal,
        cartCount
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

// Custom hook to use cart context
export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
