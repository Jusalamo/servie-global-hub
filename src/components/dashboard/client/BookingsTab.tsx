
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Calendar, Clock, Star } from "lucide-react";
import { bookingAPI } from "@/services/supabaseAPI";
import { toast } from "sonner";

interface BookingsTabProps {
  clientBookings?: any[];
  services?: any[];
}

export const BookingsTab = ({ clientBookings = [], services = [] }: BookingsTabProps) => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    try {
      const data = await bookingAPI.getMyBookings();
      setBookings(data);
    } catch (error) {
      console.error("Failed to load bookings:", error);
      toast.error("Failed to load bookings");
      // Fallback to props if API fails
      setBookings(clientBookings);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading bookings...</div>;
  }
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">My Bookings</h1>
        <div className="flex items-center gap-2">
          <Input 
            placeholder="Search bookings..." 
            className="max-w-xs"
            leftIcon={<Search className="h-4 w-4" />}
          />
        </div>
      </div>
      
      <Tabs defaultValue="upcoming">
        <TabsList className="w-full max-w-md">
          <TabsTrigger value="upcoming" className="flex-1">Upcoming</TabsTrigger>
          <TabsTrigger value="completed" className="flex-1">Completed</TabsTrigger>
          <TabsTrigger value="cancelled" className="flex-1">Cancelled</TabsTrigger>
        </TabsList>
        
        <TabsContent value="upcoming" className="mt-6 space-y-4">
          {bookings.filter(b => b.status === "pending" || b.status === "confirmed").length > 0 ? (
            bookings
              .filter(b => b.status === "pending" || b.status === "confirmed")
              .map((booking) => {
                return (
                  <Card key={booking.id}>
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div className="flex items-center gap-4">
                          <div className="w-16 h-16 bg-servie/10 rounded-md flex items-center justify-center">
                            <Calendar className="w-8 h-8 text-servie" />
                          </div>
                          <div>
                            <h3 className="font-medium">{booking.services?.title || 'Service'}</h3>
                            <p className="text-sm text-muted-foreground">
                              Provider: {booking.services?.profiles?.first_name} {booking.services?.profiles?.last_name}
                            </p>
                            <div className="flex items-center mt-1 text-sm">
                              <Calendar className="w-3 h-3 mr-1" />
                              <span>{new Date(booking.booking_date).toLocaleDateString()}</span>
                              <Clock className="w-3 h-3 ml-3 mr-1" />
                              <span>{booking.booking_time}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <Badge variant={booking.status === "confirmed" ? "default" : "outline"}>
                            {booking.status === "pending" ? "Pending" : "Confirmed"}
                          </Badge>
                          <span className="font-bold">${booking.services?.price}</span>
                          <Button variant="outline" size="sm">View Details</Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })
          ) : (
            <div className="text-center py-12">
              <h3 className="text-xl font-medium mb-2">No upcoming bookings</h3>
              <p className="text-muted-foreground mb-6">You have no scheduled or in-progress services</p>
              <Button className="mt-4" asChild>
                <Link to="/categories">Find Services</Link>
              </Button>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="completed" className="mt-6 space-y-4">
          {bookings.filter(b => b.status === "completed").length > 0 ? (
            bookings
              .filter(b => b.status === "completed")
              .map((booking) => {
                return (
                  <Card key={booking.id}>
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div className="flex items-center gap-4">
                          <div className="w-16 h-16 bg-green-100 rounded-md flex items-center justify-center">
                            <Star className="w-8 h-8 text-green-600" />
                          </div>
                          <div>
                            <h3 className="font-medium">{booking.services?.title || 'Service'}</h3>
                            <p className="text-sm text-muted-foreground">
                              Provider: {booking.services?.profiles?.first_name} {booking.services?.profiles?.last_name}
                            </p>
                            <div className="flex items-center mt-1 text-sm">
                              <Calendar className="w-3 h-3 mr-1" />
                              <span>{new Date(booking.booking_date).toLocaleDateString()}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <Badge variant="outline" className="bg-green-50 text-green-700">Completed</Badge>
                          <span className="font-bold">${booking.services?.price}</span>
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
          ) : (
            <div className="text-center py-12">
              <h3 className="text-xl font-medium mb-2">No completed services</h3>
              <p className="text-muted-foreground">You have no completed services yet</p>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="cancelled" className="mt-6 space-y-4">
          <div className="text-center py-12">
            <h3 className="text-xl font-medium mb-2">No cancelled bookings</h3>
            <p className="text-muted-foreground">You have no cancelled bookings</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
