
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Star, Heart } from "lucide-react";

interface FavoritesTabProps {
  services: any[];
}

export const FavoritesTab = ({ services }: FavoritesTabProps) => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">My Favorites</h1>
        <div className="flex items-center gap-2">
          <div className="relative max-w-xs">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search favorites..." 
              className="pl-10"
            />
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services?.map((service) => (
          <Card key={service.id} className="overflow-hidden">
            <div className="relative h-48">
              <img 
                src={service.imageUrl} 
                alt={service.title} 
                className="w-full h-full object-cover"
              />
              <Badge className="absolute top-3 left-3 bg-background/80 text-foreground">
                {service.category}
              </Badge>
              <Button 
                size="icon" 
                variant="ghost" 
                className="absolute top-3 right-3 bg-background/80 hover:bg-background/90 rounded-full"
                onClick={() => {}}
              >
                <Heart className="h-4 w-4 fill-servie text-servie" />
              </Button>
            </div>
            <CardContent className="p-4">
              <h3 className="font-semibold text-lg mb-2">{service.title}</h3>
              <div className="flex items-center gap-2 mb-2">
                <img
                  src={service.providerAvatar}
                  alt={service.providerName}
                  className="w-6 h-6 rounded-full"
                />
                <span className="text-sm text-muted-foreground">{service.providerName}</span>
              </div>
              <div className="flex items-center gap-1 mb-2">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span className="text-sm font-medium">{service.rating.toFixed(1)}</span>
                <span className="text-sm text-muted-foreground">({service.reviewCount})</span>
              </div>
            </CardContent>
            <CardFooter className="px-4 py-3 bg-muted/30 flex justify-between items-center">
              <span className="font-semibold">{service.currency}{service.price}</span>
              <Button size="sm" asChild>
                <Link to={`/service/${service.id}`}>View Details</Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};
