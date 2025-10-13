import { memo } from "react";
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Heart } from "lucide-react";
import { useFavorites } from "@/hooks/useFavorites";
import { Skeleton } from "@/components/ui/skeleton";

export const FavoritesTab = memo(() => {
  const { favorites, isLoading, toggleFavorite } = useFavorites();
  
  if (isLoading) {
    return <Skeleton className="h-96" />;
  }
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
        {favorites?.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <Heart className="w-16 h-16 mx-auto mb-4 text-muted-foreground/50" />
            <h3 className="text-lg font-medium mb-2">No favorites yet</h3>
            <p className="text-muted-foreground mb-4">Start adding services to your favorites</p>
            <Button asChild>
              <Link to="/categories">Browse Services</Link>
            </Button>
          </div>
        ) : (
          favorites?.map((favorite) => {
            const service = favorite.services;
            if (!service) return null;
            
            const imageUrl = service.service_images?.find(img => img.is_primary)?.url 
              || service.service_images?.[0]?.url;
            const providerName = service.profiles?.business_name ||
              `${service.profiles?.first_name || ''} ${service.profiles?.last_name || ''}`.trim();
            
            return (
              <Card key={favorite.id} className="overflow-hidden">
                <div className="relative h-48">
                  {imageUrl && (
                    <img 
                      src={imageUrl} 
                      alt={service.title} 
                      className="w-full h-full object-cover"
                    />
                  )}
                  <Button 
                    size="icon" 
                    variant="ghost" 
                    className="absolute top-3 right-3 bg-background/80 hover:bg-background/90 rounded-full"
                    onClick={() => toggleFavorite(service.id)}
                  >
                    <Heart className="h-4 w-4 fill-servie text-servie" />
                  </Button>
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-lg mb-2">{service.title}</h3>
                  <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                    {service.description}
                  </p>
                  <div className="flex items-center gap-2 mb-2">
                    {service.profiles?.avatar_url && (
                      <img
                        src={service.profiles.avatar_url}
                        alt={providerName}
                        className="w-6 h-6 rounded-full"
                      />
                    )}
                    <span className="text-sm text-muted-foreground">{providerName}</span>
                  </div>
                </CardContent>
                <CardFooter className="px-4 py-3 bg-muted/30 flex justify-between items-center">
                  <span className="font-semibold">${service.price}</span>
                  <Button size="sm" asChild>
                    <Link to={`/service/${service.id}`}>View Details</Link>
                  </Button>
                </CardFooter>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
});
