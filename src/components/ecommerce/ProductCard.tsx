
import { useState } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, ShoppingCart, Heart, Check, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

// Product type definition
export interface Product {
  id: string;
  name: string;
  price: number;
  rating: number;
  reviewCount: number;
  category: string;
  images: string[];
  providerName: string;
  providerAvatar: string;
  providerId: string;
  description: string;
  featured?: boolean;
  inStock?: boolean;
  createdAt?: string;
  compareAtPrice?: number;
  currency?: string;
}

// Cart context interface for future implementation
export interface CartContextType {
  addToCart: (product: Product, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  isInCart: (productId: string) => boolean;
  getCartItemQuantity: (productId: string) => number;
  cartItems: { product: Product; quantity: number }[];
}

interface ProductCardProps {
  product: Product;
  showAddToCart?: boolean;
}

export function ProductCard({ product, showAddToCart = true }: ProductCardProps) {
  const { isAuthenticated } = useAuth();
  const [isFavorite, setIsFavorite] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isInCart, setIsInCart] = useState(false);
  
  const handleAddToCart = () => {
    setIsAddingToCart(true);
    
    // Simulate adding to cart
    setTimeout(() => {
      // Store in local storage as temporary solution
      const cartItems = JSON.parse(localStorage.getItem('cartItems') || '[]');
      
      // Check if product is already in cart
      const existingItemIndex = cartItems.findIndex((item: any) => item.id === product.id);
      
      if (existingItemIndex >= 0) {
        // Increment quantity
        cartItems[existingItemIndex].quantity += 1;
        toast.success(`Increased quantity of ${product.name} in cart`);
      } else {
        // Add new item
        cartItems.push({
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.images[0] || '/placeholder.svg',
          quantity: 1,
          providerId: product.providerId,
          providerName: product.providerName
        });
        toast.success(`Added ${product.name} to cart`);
      }
      
      localStorage.setItem('cartItems', JSON.stringify(cartItems));
      setIsInCart(true);
      setIsAddingToCart(false);
      
      // Update cart count in UI - dispatch custom event
      window.dispatchEvent(new CustomEvent('cart-updated'));
    }, 600);
  };
  
  const toggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isAuthenticated) {
      toast.error("Please sign in to save favorites");
      return;
    }
    
    setIsFavorite(!isFavorite);
    toast.success(isFavorite ? "Removed from favorites" : "Added to favorites");
  };

  // Check if product is in cart on mount
  useState(() => {
    const cartItems = JSON.parse(localStorage.getItem('cartItems') || '[]');
    setIsInCart(cartItems.some((item: any) => item.id === product.id));
  });
  
  return (
    <Card className={`overflow-hidden hover:shadow-md transition-all duration-300 ${
      product.featured ? 'border-servie border-2' : ''
    }`}>
      <Link to={`/product/${product.id}`} className="block">
        <div className="relative h-48 overflow-hidden">
          <img 
            src={product.images[0] || '/placeholder.svg'} 
            alt={product.name} 
            className="w-full h-full object-cover transition-transform hover:scale-105 duration-500"
          />
          {product.featured && (
            <Badge className="absolute top-2 right-2 bg-servie hover:bg-servie-600">
              Featured
            </Badge>
          )}
          <Badge 
            className="absolute top-2 left-2 bg-background/80 text-foreground hover:bg-background/90"
          >
            {product.category}
          </Badge>
          
          <Button
            variant="ghost"
            size="icon"
            className="absolute bottom-2 right-2 bg-background/80 hover:bg-background rounded-full"
            onClick={toggleFavorite}
          >
            <Heart className={`h-5 w-5 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
          </Button>
        </div>
      </Link>
      
      <CardContent className="p-4">
        <Link to={`/product/${product.id}`}>
          <h3 className="font-semibold text-lg line-clamp-1">{product.name}</h3>
        </Link>
        
        <div className="flex items-center mt-1 gap-1">
          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
          <span className="text-sm font-medium">{product.rating.toFixed(1)}</span>
          <span className="text-sm text-muted-foreground">
            ({product.reviewCount} reviews)
          </span>
        </div>
        
        <div className="mt-2">
          <div className="flex items-center gap-2">
            <img
              src={product.providerAvatar || '/placeholder.svg'}
              alt={product.providerName}
              className="w-5 h-5 rounded-full"
            />
            <span className="text-xs text-muted-foreground">{product.providerName}</span>
          </div>
        </div>
        
        <p className="mt-2 text-sm line-clamp-2 text-muted-foreground">
          {product.description}
        </p>
      </CardContent>
      
      <CardFooter className="px-4 py-3 border-t flex justify-between items-center">
        <span className="font-semibold text-lg">
          ${product.price.toFixed(2)}
        </span>
        
        {showAddToCart && (
          isInCart ? (
            <Button size="sm" variant="secondary" className="bg-green-50 text-green-700 hover:bg-green-100">
              <Check className="h-4 w-4 mr-1" />
              In Cart
            </Button>
          ) : (
            <Button
              size="sm" 
              onClick={handleAddToCart}
              disabled={isAddingToCart || !product.inStock}
            >
              {isAddingToCart ? (
                <>
                  <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                  Adding...
                </>
              ) : (
                <>
                  <ShoppingCart className="h-4 w-4 mr-1" />
                  Add to Cart
                </>
              )}
            </Button>
          )
        )}
      </CardFooter>
    </Card>
  );
}
