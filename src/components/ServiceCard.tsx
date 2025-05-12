
import { Star, Clock, MapPin, Heart } from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";

interface ServiceCardProps {
  id: string;
  title: string;
  category: string;
  imageUrl: string;
  providerName: string;
  providerAvatar: string;
  rating: number;
  reviewCount: number;
  price: number;
  currency?: string;
  featured?: boolean;
  location?: string;
  responseTime?: string;
  layout?: "grid" | "list";
}

const ServiceCard = ({
  id,
  title,
  category,
  imageUrl,
  providerName,
  providerAvatar,
  rating,
  reviewCount,
  price,
  currency = "$",
  featured = false,
  location = "Remote",
  responseTime = "Usually responds in 1 hour",
  layout = "grid"
}: ServiceCardProps) => {
  const { isAuthenticated, user } = useAuth();
  const [isFavorite, setIsFavorite] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Check if service is in user's favorites on component mount
  useState(() => {
    if (!isAuthenticated || !user) return;
    
    const checkFavoriteStatus = async () => {
      const { data, error } = await supabase
        .from('favorites')
        .select('id')
        .eq('client_id', user.id)
        .eq('service_id', id)
        .single();
        
      if (data && !error) {
        setIsFavorite(true);
      }
    };
    
    checkFavoriteStatus();
  });
  
  const handleFavoriteClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isAuthenticated) {
      toast.error("Please sign in to save favorites");
      return;
    }
    
    setIsLoading(true);
    
    try {
      if (isFavorite) {
        // Remove from favorites
        const { error } = await supabase
          .from('favorites')
          .delete()
          .eq('client_id', user!.id)
          .eq('service_id', id);
        
        if (error) throw error;
        setIsFavorite(false);
        toast.success("Removed from favorites");
      } else {
        // Add to favorites
        const { error } = await supabase
          .from('favorites')
          .insert({ client_id: user!.id, service_id: id });
        
        if (error) throw error;
        setIsFavorite(true);
        toast.success("Added to favorites");
      }
    } catch (error) {
      console.error("Error updating favorite status:", error);
      toast.error("Failed to update favorites");
    } finally {
      setIsLoading(false);
    }
  };

  if (layout === "list") {
    return (
      <Card className={`overflow-hidden hover:shadow-lg transition-all duration-300 ${featured ? 'border-servie border-2' : ''}`}>
        <Link to={`/service/${id}`} className="flex flex-col md:flex-row">
          <div className="relative h-48 md:h-auto md:w-1/3">
            <img 
              src={imageUrl} 
              alt={title} 
              className="w-full h-full object-cover"
            />
            {featured && (
              <Badge className="absolute top-3 right-3 bg-servie hover:bg-servie-600">Featured</Badge>
            )}
            <Badge className="absolute top-3 left-3 bg-background/80 text-foreground hover:bg-background/90">
              {category}
            </Badge>
          </div>
          <div className="flex flex-col flex-1">
            <CardContent className="p-4 space-y-3">
              <h3 className="font-semibold text-lg">{title}</h3>
              <div className="flex items-center gap-2">
                <img
                  src={providerAvatar}
                  alt={providerName}
                  className="w-6 h-6 rounded-full"
                />
                <span className="text-sm">{providerName}</span>
              </div>
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span className="text-sm font-medium">{rating.toFixed(1)}</span>
                <span className="text-sm text-muted-foreground">({reviewCount} reviews)</span>
              </div>
              <div className="flex flex-wrap gap-y-2">
                <div className="w-full sm:w-1/2 flex items-center text-sm text-muted-foreground">
                  <MapPin className="w-4 h-4 mr-1" />
                  <span className="truncate">{location}</span>
                </div>
                <div className="w-full sm:w-1/2 flex items-center text-sm text-muted-foreground">
                  <Clock className="w-4 h-4 mr-1" />
                  <span className="truncate">{responseTime}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="mt-auto px-4 py-3 bg-muted/30 flex justify-between items-center">
              <span className="font-semibold text-lg">
                {currency}{price}
              </span>
              <div className="flex items-center gap-2">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="rounded-full"
                  onClick={handleFavoriteClick}
                  disabled={isLoading}
                >
                  <Heart 
                    className={`h-5 w-5 ${isFavorite ? 'fill-purple-500 text-purple-500' : 'text-muted-foreground'}`} 
                  />
                </Button>
                <Button size="sm" variant="secondary" className="bg-servie text-white hover:bg-servie-600">View Details</Button>
              </div>
            </CardFooter>
          </div>
        </Link>
      </Card>
    );
  }

  // Default grid view
  return (
    <Card className={`overflow-hidden hover:shadow-lg transition-all duration-300 ${featured ? 'border-servie border-2' : 'hover:scale-[1.02]'}`}>
      <Link to={`/service/${id}`} className="block">
        <div className="relative h-52 overflow-hidden">
          <img 
            src={imageUrl} 
            alt={title} 
            className="w-full h-full object-cover transition-transform hover:scale-105 duration-500"
          />
          {featured && (
            <Badge className="absolute top-3 right-3 bg-servie hover:bg-servie-600">Featured</Badge>
          )}
          <Badge className="absolute top-3 left-3 bg-background/80 text-foreground hover:bg-background/90">
            {category}
          </Badge>
          <Button 
            variant="ghost" 
            size="icon" 
            className="absolute bottom-3 right-3 bg-background/80 hover:bg-background rounded-full p-1.5"
            onClick={handleFavoriteClick}
            disabled={isLoading}
          >
            <Heart 
              className={`h-5 w-5 ${isFavorite ? 'fill-purple-500 text-purple-500' : 'text-muted-foreground'}`} 
            />
          </Button>
        </div>
        <CardContent className="p-4 space-y-3">
          <h3 className="font-semibold text-lg line-clamp-2">{title}</h3>
          <div className="flex items-center gap-2">
            <img
              src={providerAvatar}
              alt={providerName}
              className="w-6 h-6 rounded-full"
            />
            <span className="text-sm">{providerName}</span>
          </div>
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-medium">{rating.toFixed(1)}</span>
            <span className="text-sm text-muted-foreground">({reviewCount} reviews)</span>
          </div>
          <div className="flex flex-wrap gap-y-2">
            <div className="w-full sm:w-1/2 flex items-center text-sm text-muted-foreground">
              <MapPin className="w-4 h-4 mr-1" />
              <span className="truncate">{location}</span>
            </div>
            <div className="w-full sm:w-1/2 flex items-center text-sm text-muted-foreground">
              <Clock className="w-4 h-4 mr-1" />
              <span className="truncate">Fast Response</span>
            </div>
          </div>
        </CardContent>
        <CardFooter className="px-4 py-3 bg-muted/30 flex justify-between items-center">
          <span className="font-semibold text-lg">
            {currency}{price}
          </span>
          <Button size="sm" className="bg-servie text-white hover:bg-servie-600">View Details</Button>
        </CardFooter>
      </Link>
    </Card>
  );
};

export default ServiceCard;
