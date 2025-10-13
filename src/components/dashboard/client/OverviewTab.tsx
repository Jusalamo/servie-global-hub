import { memo } from "react";
import { Link } from "react-router-dom";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bell, Calendar, Clock, ChevronRight, Star } from "lucide-react";
import { useBookings } from "@/hooks/useBookings";
import { useFavorites } from "@/hooks/useFavorites";
import { Skeleton } from "@/components/ui/skeleton";

export const OverviewTab = memo(() => {
  const { bookings, isLoading: bookingsLoading } = useBookings('client');
  const { favorites, isLoading: favoritesLoading } = useFavorites();
  
  const isLoading = bookingsLoading || favoritesLoading;
  
  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map(i => <Skeleton key={i} className="h-24" />)}
        </div>
        <Skeleton className="h-64" />
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <Button variant="outline" size="sm">
          <Bell className="w-4 h-4 mr-2" />
          Notifications
        </Button>
      </div>
      
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
            <CardDescription>{bookings?.length || 0} services booked</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{bookings?.length || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Active Bookings</CardTitle>
            <CardDescription>Currently ongoing</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {bookings?.filter(b => b.status === "confirmed" || b.status === "pending").length || 0}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Favorite Services</CardTitle>
            <CardDescription>Services you love</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{favorites?.length || 0}</div>
          </CardContent>
        </Card>
      </div>
      
      {/* Recent Bookings */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Recent Bookings</CardTitle>
            <CardDescription>Your latest service bookings</CardDescription>
          </div>
          <Link to="/dashboard/client?tab=bookings">
            <Button variant="outline" size="sm">
              View All
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </Link>
        </CardHeader>
        <CardContent className="p-0">
          {bookings?.length === 0 ? (
            <div className="p-6 text-center text-muted-foreground">
              <Calendar className="w-12 h-12 mx-auto mb-4 text-muted-foreground/50" />
              <p>No bookings yet</p>
              <p className="text-sm">Start booking services to see them here</p>
            </div>
          ) : (
            <div className="divide-y">
              {bookings?.slice(0, 3).map((booking) => {
                const serviceTitle = booking.services?.title || 'Service';
                return (
                  <div key={booking.id} className="p-6 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-muted rounded-md flex items-center justify-center">
                        <Calendar className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-medium">{serviceTitle}</p>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <span>{new Date(booking.booking_date).toLocaleDateString()}</span>
                          <Clock className="w-3 h-3" />
                          <span>{booking.booking_time}</span>
                        </div>
                      </div>
                    </div>
                    <Badge variant={booking.status === "confirmed" ? "default" : "secondary"}>
                      {booking.status}
                    </Badge>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Favorite Services */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Favorite Services</CardTitle>
            <CardDescription>Services you bookmarked</CardDescription>
          </div>
          <Link to="/dashboard/client?tab=favorites">
            <Button variant="outline" size="sm">
              View All
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </Link>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y">
            {favorites?.slice(0, 3).map((favorite) => {
              const service = favorite.services;
              const imageUrl = service?.service_images?.find(img => img.is_primary)?.url 
                || service?.service_images?.[0]?.url;
              
              return (
                <div key={favorite.id} className="p-6 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {imageUrl && (
                      <img
                        src={imageUrl}
                        alt={service?.title}
                        className="w-10 h-10 rounded-md object-cover"
                      />
                    )}
                    <div>
                      <p className="font-medium">{service?.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {service?.profiles?.business_name || 
                         `${service?.profiles?.first_name} ${service?.profiles?.last_name}`}
                      </p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" asChild>
                    <Link to={`/service/${service?.id}`}>
                      View
                    </Link>
                  </Button>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
});