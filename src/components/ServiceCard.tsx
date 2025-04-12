
import { Star } from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

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
}: ServiceCardProps) => {
  return (
    <Link to={`/service/${id}`}>
      <Card className={`overflow-hidden hover:shadow-md transition-shadow ${featured ? 'border-servie' : ''}`}>
        <div className="relative h-48 overflow-hidden">
          <img 
            src={imageUrl} 
            alt={title} 
            className="w-full h-full object-cover transition-transform hover:scale-105 duration-300"
          />
          {featured && (
            <Badge className="absolute top-3 right-3 bg-servie">Featured</Badge>
          )}
          <Badge className="absolute top-3 left-3 bg-background/80 text-foreground">
            {category}
          </Badge>
        </div>
        <CardContent className="p-4">
          <h3 className="font-semibold text-lg line-clamp-2 mb-2">{title}</h3>
          <div className="flex items-center gap-2 mb-2">
            <img
              src={providerAvatar}
              alt={providerName}
              className="w-6 h-6 rounded-full"
            />
            <span className="text-sm text-muted-foreground">{providerName}</span>
          </div>
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-medium">{rating.toFixed(1)}</span>
            <span className="text-sm text-muted-foreground">({reviewCount})</span>
          </div>
        </CardContent>
        <CardFooter className="px-4 py-3 bg-muted/30 flex justify-between items-center">
          <span className="font-semibold">
            {currency}{price}
          </span>
        </CardFooter>
      </Card>
    </Link>
  );
};

export default ServiceCard;
