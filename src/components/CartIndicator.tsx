
import { useEffect, useState } from "react";
import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { useCart } from "@/context/CartContext";

export function CartIndicator() {
  const { cartItems } = useCart();
  const [isAnimating, setIsAnimating] = useState(false);
  
  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);
  const [prevCartCount, setPrevCartCount] = useState(cartCount);
  
  // Enhanced animation effect when the cart updates with improved responsiveness
  useEffect(() => {
    // Trigger animation when cart count increases
    if (cartCount > prevCartCount) {
      setIsAnimating(true);
      const timeout = setTimeout(() => {
        setIsAnimating(false);
      }, 600);
      return () => clearTimeout(timeout);
    }
    // Update previous count for next comparison
    setPrevCartCount(cartCount);
  }, [cartCount, prevCartCount]);
  
  return (
    <Link to="/cart" aria-label="View shopping cart">
      <Button 
        variant="ghost" 
        className="relative group"
        title={`${cartCount} items in cart`}
      >
        <ShoppingCart className={`h-5 w-5 transition-transform group-hover:scale-110 ${isAnimating ? 'animate-bounce' : ''}`} />
        {cartCount > 0 && (
          <Badge 
            className="absolute -top-2 -right-2 px-1.5 py-0.5 min-w-[1.25rem] min-h-[1.25rem] flex items-center justify-center bg-servie text-servie-foreground"
          >
            {cartCount}
          </Badge>
        )}
      </Button>
    </Link>
  );
}

export default CartIndicator;
