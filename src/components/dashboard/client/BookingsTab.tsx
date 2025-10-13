import { memo } from "react";
import { Link } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Calendar, Clock } from "lucide-react";
import { useBookings } from "@/hooks/useBookings";
import { Skeleton } from "@/components/ui/skeleton";

export const BookingsTab = memo(() => {
  const { bookings, isLoading } = useBookings('client');
  
  if (isLoading) {
    return <Skeleton className="h-96" />;
  }
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">My Bookings</h1>
        <div className="flex items-center gap-2">
          <div className="relative max-w-xs">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search bookings..." 
              className="pl-10"
            />
          </div>
        </div>
      </div>
      
      <Tabs defaultValue="upcoming">
        <TabsList className="w-full max-w-md">
          <TabsTrigger value="upcoming" className="flex-1">Upcoming</TabsTrigger>
          <TabsTrigger value="completed" className="flex-1">Completed</TabsTrigger>
          <TabsTrigger value="cancelled" className="flex-1">Cancelled</TabsTrigger>
        </TabsList>
        
        <TabsContent value="upcoming">
          <div className="space-y-4">
            {bookings?.filter(booking => booking.status === 'confirmed' || booking.status === 'pending').length === 0 ? (
              <div className="text-center py-12">
                <Calendar className="w-16 h-16 mx-auto mb-4 text-muted-foreground/50" />
                <h3 className="text-lg font-medium mb-2">No upcoming bookings</h3>
                <p className="text-muted-foreground mb-4">You don't have any upcoming service bookings</p>
                <Button asChild>
                  <Link to="/categories">Find Services</Link>
                </Button>
              </div>
            ) : (
              bookings?.filter(booking => booking.status === 'confirmed' || booking.status === 'pending')
                .map((booking) => {
                  const serviceTitle = booking.services?.title || 'Service';
                  const servicePrice = booking.services?.price || 0;
                  return (
                    <Card key={booking.id}>
                      <CardContent className="p-6">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                          <div className="flex items-center gap-4">
                            <div className="w-16 h-16 bg-muted rounded-md flex items-center justify-center">
                              <Calendar className="w-8 h-8" />
                            </div>
                            <div>
                              <h3 className="font-medium">{serviceTitle}</h3>
                              <p className="text-sm text-muted-foreground">Booking #{booking.id.slice(0, 8)}</p>
                              <div className="flex items-center mt-1 text-sm">
                                <Calendar className="w-3 h-3 mr-1" />
                                <span>{new Date(booking.booking_date).toLocaleDateString()}</span>
                                <Clock className="w-3 h-3 ml-3 mr-1" />
                                <span>{booking.booking_time}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-col items-end gap-2">
                            <Badge variant={booking.status === "confirmed" ? "default" : "secondary"}>
                              {booking.status}
                            </Badge>
                            <span className="font-bold">${servicePrice}</span>
                            <Button variant="outline" size="sm">View Details</Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="completed">
          <div className="space-y-4">
            {bookings?.filter(booking => booking.status === 'completed').length === 0 ? (
              <div className="text-center py-12">
                <h3 className="text-lg font-medium mb-2">No completed bookings</h3>
                <p className="text-muted-foreground">You haven't completed any services yet</p>
              </div>
            ) : (
              bookings?.filter(booking => booking.status === 'completed')
                .map((booking) => {
                  const serviceTitle = booking.services?.title || 'Service';
                  const servicePrice = booking.services?.price || 0;
                  return (
                    <Card key={booking.id}>
                      <CardContent className="p-6">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                          <div className="flex items-center gap-4">
                            <div className="w-16 h-16 bg-muted rounded-md flex items-center justify-center">
                              <Calendar className="w-8 h-8" />
                            </div>
                            <div>
                              <h3 className="font-medium">{serviceTitle}</h3>
                              <p className="text-sm text-muted-foreground">
                                Completed on {new Date(booking.booking_date).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <div className="flex flex-col items-end gap-2">
                            <Badge variant="outline">Completed</Badge>
                            <span className="font-bold">${servicePrice}</span>
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm">Leave Review</Button>
                              <Button variant="outline" size="sm">Book Again</Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="cancelled">
          <div className="text-center py-12">
            <h3 className="text-lg font-medium mb-2">No cancelled bookings</h3>
            <p className="text-muted-foreground">You have no cancelled bookings</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
});