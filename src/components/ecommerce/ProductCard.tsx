
import { useState } from "react";
import { Link } from "react-router-dom";
import { Star, ShoppingCart, Heart } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  compareAtPrice?: number;
  currency?: string;
  images: string[];
  category: string;
  providerId: string;
  providerName: string;
  providerAvatar: string;
  rating: number;
  reviewCount: number;
  featured: boolean;
  inStock: boolean;
  createdAt: string;
}

interface ProductCardProps {
  product: Product;
  layout?: "grid" | "list";
}

export const ProductCard = ({ product, layout = "grid" }: ProductCardProps) => {
  const { isAuthenticated } = useAuth();
  const [isFavorite, setIsFavorite] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  
  const discount = product.compareAtPrice 
    ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100) 
    : 0;
    
  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isAuthenticated) {
      toast.error("Please sign in to save favorites");
      return;
    }
    
    setIsFavorite(!isFavorite);
    if (isFavorite) {
      toast.info("Removed from wishlist");
    } else {
      toast.success("Added to wishlist");
    }
  };
  
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    setIsAddingToCart(true);
    
    setTimeout(() => {
      setIsAddingToCart(false);
      toast.success(`${product.name} added to cart`);
    }, 600);
  };
  
  if (layout === "list") {
    return (
      <Card className="overflow-hidden hover:shadow-md transition-all duration-300">
        <Link to={`/product/${product.id}`} className="flex flex-col md:flex-row">
          <div className="relative h-48 md:h-auto md:w-1/3">
            <img 
              src={product.images[0]} 
              alt={product.name} 
              className="w-full h-full object-cover"
            />
            {product.featured && (
              <Badge className="absolute top-3 right-3 bg-servie hover:bg-servie-600">Featured</Badge>
            )}
            {discount > 0 && (
              <Badge className="absolute top-3 left-3 bg-red-500 hover:bg-red-600">
                {discount}% OFF
              </Badge>
            )}
            {!product.inStock && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <Badge variant="outline" className="text-white border-white text-lg">Out of Stock</Badge>
              </div>
            )}
          </div>
          <div className="flex flex-col flex-1">
            <CardContent className="p-4 space-y-3">
              <div className="flex justify-between">
                <h3 className="font-semibold text-lg">{product.name}</h3>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8"
                  onClick={handleFavoriteClick}
                >
                  <Heart className={`h-5 w-5 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-muted-foreground'}`} />
                </Button>
              </div>
              <p className="text-muted-foreground line-clamp-2">{product.description}</p>
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span className="text-sm font-medium">{product.rating.toFixed(1)}</span>
                <span className="text-sm text-muted-foreground">({product.reviewCount} reviews)</span>
              </div>
              <div className="flex items-center gap-2">
                <img
                  src={product.providerAvatar}
                  alt={product.providerName}
                  className="w-6 h-6 rounded-full"
                />
                <span className="text-sm">{product.providerName}</span>
              </div>
            </CardContent>
            <CardFooter className="mt-auto px-4 py-3 bg-muted/30 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-lg">
                  {product.currency || "$"}{product.price.toFixed(2)}
                </span>
                {product.compareAtPrice && (
                  <span className="text-muted-foreground line-through text-sm">
                    {product.currency || "$"}{product.compareAtPrice.toFixed(2)}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Button 
                  size="sm" 
                  onClick={handleAddToCart}
                  disabled={!product.inStock || isAddingToCart}
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  {isAddingToCart ? "Adding..." : "Add to Cart"}
                </Button>
              </div>
            </CardFooter>
          </div>
        </Link>
      </Card>
    );
  }
  
  // Grid view (default)
  return (
    <Card className="overflow-hidden hover:shadow-md transition-all duration-300 hover:scale-[1.02]">
      <Link to={`/product/${product.id}`} className="block">
        <div className="relative h-52 overflow-hidden">
          <img 
            src={product.images[0]} 
            alt={product.name} 
            className="w-full h-full object-cover transition-transform hover:scale-105 duration-500"
          />
          {product.featured && (
            <Badge className="absolute top-3 right-3 bg-servie hover:bg-servie-600">Featured</Badge>
          )}
          {discount > 0 && (
            <Badge className="absolute top-3 left-3 bg-red-500 hover:bg-red-600">
              {discount}% OFF
            </Badge>
          )}
          {!product.inStock && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <Badge variant="outline" className="text-white border-white">Out of Stock</Badge>
            </div>
          )}
          <Button 
            variant="ghost" 
            size="icon" 
            className="absolute bottom-3 right-3 bg-background/80 hover:bg-background rounded-full p-1.5"
            onClick={handleFavoriteClick}
          >
            <Heart 
              className={`h-5 w-5 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-muted-foreground'}`} 
            />
          </Button>
        </div>
        <CardContent className="p-4 space-y-2">
          <h3 className="font-semibold text-lg line-clamp-1">{product.name}</h3>
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-medium">{product.rating.toFixed(1)}</span>
            <span className="text-sm text-muted-foreground">({product.reviewCount} reviews)</span>
          </div>
          <div className="flex items-center gap-2">
            <img
              src={product.providerAvatar}
              alt={product.providerName}
              className="w-5 h-5 rounded-full"
            />
            <span className="text-xs text-muted-foreground">{product.providerName}</span>
          </div>
          <p className="text-sm text-muted-foreground line-clamp-2">{product.description}</p>
        </CardContent>
        <CardFooter className="px-4 py-3 bg-muted/30 flex justify-between items-center">
          <div className="flex flex-col">
            <span className="font-semibold text-lg">
              {product.currency || "$"}{product.price.toFixed(2)}
            </span>
            {product.compareAtPrice && (
              <span className="text-muted-foreground line-through text-xs">
                {product.currency || "$"}{product.compareAtPrice.toFixed(2)}
              </span>
            )}
          </div>
          <Button 
            size="sm" 
            onClick={handleAddToCart}
            disabled={!product.inStock || isAddingToCart}
          >
            {isAddingToCart ? "Adding..." : "Add to Cart"}
          </Button>
        </CardFooter>
      </Link>
    </Card>
  );
};
