
import { useEffect, useState } from "react";
import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { useCart } from "@/context/CartContext";

export function CartIndicator() {
  const { cartCount } = useCart();
  const [isAnimating, setIsAnimating] = useState(false);
  
  // Animation effect when the cart updates
  useEffect(() => {
    if (cartCount > 0) {
      setIsAnimating(true);
      const timeout = setTimeout(() => {
        setIsAnimating(false);
      }, 300);
      return () => clearTimeout(timeout);
    }
  }, [cartCount]);
  
  return (
    <Link to="/cart">
      <Button variant="ghost" className="relative">
        <ShoppingCart className={`h-5 w-5 ${isAnimating ? 'animate-bounce' : ''}`} />
        {cartCount > 0 && (
          <Badge 
            className="absolute -top-2 -right-2 px-1.5 py-0.5 min-w-[1.25rem] min-h-[1.25rem] flex items-center justify-center bg-servie text-white"
          >
            {cartCount}
          </Badge>
        )}
      </Button>
    </Link>
  );
}

export default CartIndicator;
