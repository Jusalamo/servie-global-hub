
import { Link } from "react-router-dom";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bell, Calendar, Clock, ChevronRight, Star } from "lucide-react";

interface OverviewTabProps {
  clientUser: any;
  clientBookings: any[];
  services: any[];
  favoriteServices: any[];
  setActiveTab: (tab: string) => void;
}

export const OverviewTab = ({ clientUser, clientBookings, services, favoriteServices, setActiveTab }: OverviewTabProps) => {
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
            <CardDescription>Upcoming Bookings</CardDescription>
            <CardTitle className="text-2xl">
              {clientBookings.filter(b => b.status === "scheduled").length}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>In Progress</CardDescription>
            <CardTitle className="text-2xl">
              {clientBookings.filter(b => b.status === "in-progress").length}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Completed Services</CardDescription>
            <CardTitle className="text-2xl">
              {clientBookings.filter(b => b.status === "completed").length}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>
      
      {/* Upcoming Bookings */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <CardTitle>Upcoming Bookings</CardTitle>
            <Button variant="link" size="sm" asChild>
              <Link to="#" onClick={() => setActiveTab("bookings")}>
                View All
                <ChevronRight className="ml-1 w-4 h-4" />
              </Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {clientBookings.filter(b => b.status === "scheduled" || b.status === "in-progress").length > 0 ? (
            <div className="space-y-4">
              {clientBookings
                .filter(b => b.status === "scheduled" || b.status === "in-progress")
                .map((booking) => {
                  const service = services.find(s => s.id === booking.serviceId);
                  return (
                    <div key={booking.id} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                      <div className="flex items-center gap-3">
                        <img
                          src={service?.imageUrl}
                          alt={service?.title}
                          className="w-12 h-12 rounded-md object-cover"
                        />
                        <div>
                          <h4 className="font-medium">{service?.title}</h4>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Calendar className="w-3 h-3" />
                            {booking.date}
                            <Clock className="w-3 h-3 ml-2" />
                            {booking.time}
                          </div>
                        </div>
                      </div>
                      <Badge variant={booking.status === "in-progress" ? "default" : "outline"}>
                        {booking.status === "scheduled" ? "Upcoming" : "In Progress"}
                      </Badge>
                    </div>
                  );
                })}
            </div>
          ) : (
            <div className="text-center py-6">
              <p className="text-muted-foreground">No upcoming bookings</p>
              <Button className="mt-4" asChild>
                <Link to="/categories">Find Services</Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Favorite Services */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <CardTitle>Favorite Services</CardTitle>
            <Button variant="link" size="sm" asChild>
              <Link to="#" onClick={() => setActiveTab("favorites")}>
                View All
                <ChevronRight className="ml-1 w-4 h-4" />
              </Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {favoriteServices.map((service) => (
              <div key={service.id} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                <div className="flex items-center gap-3">
                  <img
                    src={service.imageUrl}
                    alt={service.title}
                    className="w-12 h-12 rounded-md object-cover"
                  />
                  <div>
                    <h4 className="font-medium">{service.title}</h4>
                    <div className="flex items-center gap-1 text-sm">
                      <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                      <span>{service.rating.toFixed(1)}</span>
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
