
import { Star, Clock, MapPin, Heart } from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";

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
}: ServiceCardProps) => {
  const [isFavorite, setIsFavorite] = useState(false);
  
  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFavorite(!isFavorite);
    toast.success(isFavorite ? "Removed from favorites" : "Added to favorites");
  };

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
          >
            <Heart 
              className={`h-5 w-5 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-muted-foreground'}`} 
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
          <Button size="sm" variant="secondary">View Details</Button>
        </CardFooter>
      </Link>
    </Card>
  );
};

export default ServiceCard;
