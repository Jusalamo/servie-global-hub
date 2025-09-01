import { Link } from "react-router-dom";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bell, Calendar, Clock, ChevronRight, Star } from "lucide-react";

interface OverviewTabProps {
  user: any;
  bookings: any[];
  favoriteServices: any[];
  isLoading?: boolean;
}

export const OverviewTab = ({ user, bookings, favoriteServices, isLoading = false }: OverviewTabProps) => {
  if (isLoading) {
    return <div>Loading...</div>;
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
            <div className="text-2xl font-bold">{favoriteServices?.length || 0}</div>
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
              {bookings?.slice(0, 3).map((booking: any) => {
                const service = { title: "Service #" + booking.id }; // Fallback since we don't have services here
                return (
                  <div key={booking.id} className="p-6 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-muted rounded-md flex items-center justify-center">
                        <Calendar className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-medium">{service?.title}</p>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <span>{booking.date}</span>
                          <Clock className="w-3 h-3" />
                          <span>{booking.time}</span>
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
            {favoriteServices?.slice(0, 3).map((service: any) => (
              <div key={service.id} className="p-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={service.imageUrl}
                    alt={service.title}
                    className="w-10 h-10 rounded-md object-cover"
                  />
                  <div>
                    <p className="font-medium">{service.title}</p>
                    <div className="flex items-center gap-1 text-sm">
                      <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                      <span>{service.rating?.toFixed(1)}</span>
                      <span className="text-muted-foreground">({service.reviewCount})</span>
                    </div>
                  </div>
                </div>
                <Button variant="outline" size="sm" asChild>
                  <Link to={`/service/${service.id}`}>
                    View
                  </Link>
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};