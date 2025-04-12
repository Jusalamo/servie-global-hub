
import { Link } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Calendar, Clock, Star } from "lucide-react";

interface BookingsTabProps {
  clientBookings: any[];
  services: any[];
}

export const BookingsTab = ({ clientBookings, services }: BookingsTabProps) => {
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
          {clientBookings.filter(b => b.status === "scheduled" || b.status === "in-progress").length > 0 ? (
            clientBookings
              .filter(b => b.status === "scheduled" || b.status === "in-progress")
              .map((booking) => {
                const service = services.find(s => s.id === booking.serviceId);
                const packageInfo = service?.packages.find(p => p.id === booking.packageId);
                
                return (
                  <Card key={booking.id}>
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div className="flex items-center gap-4">
                          <img
                            src={service?.imageUrl}
                            alt={service?.title}
                            className="w-16 h-16 rounded-md object-cover"
                          />
                          <div>
                            <h3 className="font-medium">{service?.title}</h3>
                            <p className="text-sm text-muted-foreground">{packageInfo?.name} Package</p>
                            <div className="flex items-center mt-1 text-sm">
                              <Calendar className="w-3 h-3 mr-1" />
                              <span>{booking.date}</span>
                              <Clock className="w-3 h-3 ml-3 mr-1" />
                              <span>{booking.time}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <Badge variant={booking.status === "in-progress" ? "default" : "outline"}>
                            {booking.status === "scheduled" ? "Upcoming" : "In Progress"}
                          </Badge>
                          <span className="font-bold">{booking.currency}{booking.price}</span>
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
          {clientBookings.filter(b => b.status === "completed").length > 0 ? (
            clientBookings
              .filter(b => b.status === "completed")
              .map((booking) => {
                const service = services.find(s => s.id === booking.serviceId);
                const packageInfo = service?.packages.find(p => p.id === booking.packageId);
                
                return (
                  <Card key={booking.id}>
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div className="flex items-center gap-4">
                          <img
                            src={service?.imageUrl}
                            alt={service?.title}
                            className="w-16 h-16 rounded-md object-cover"
                          />
                          <div>
                            <h3 className="font-medium">{service?.title}</h3>
                            <p className="text-sm text-muted-foreground">{packageInfo?.name} Package</p>
                            <div className="flex items-center mt-1 text-sm">
                              <Calendar className="w-3 h-3 mr-1" />
                              <span>{booking.date}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <Badge variant="outline">Completed</Badge>
                          <span className="font-bold">{booking.currency}{booking.price}</span>
                          <div className="flex gap-2">
                            {booking.clientReview ? (
                              <Button variant="ghost" size="sm" className="flex items-center gap-1">
                                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                Reviewed
                              </Button>
                            ) : (
                              <Button variant="outline" size="sm">Leave Review</Button>
                            )}
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
