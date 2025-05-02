
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { BadgeCheck, TrendingUp, Users, Calendar, DollarSign, Star, ArrowRight } from "lucide-react";

export function ProviderOverviewTab() {
  // Mock data for provider dashboard
  const stats = {
    earnings: {
      current: 1250,
      previous: 980,
      percentChange: 27.6
    },
    clients: {
      current: 17,
      previous: 12,
      percentChange: 41.7
    },
    bookings: {
      current: 24,
      previous: 18,
      percentChange: 33.3
    },
    rating: 4.8,
    reviews: 32,
    completedJobs: 56
  };
  
  const upcomingBookings = [
    {
      id: "book-1",
      client: "Emma Wilson",
      service: "Website Development",
      date: "Apr 15, 2025",
      time: "10:00 AM",
      status: "confirmed"
    },
    {
      id: "book-2",
      client: "James Brown",
      service: "Logo Design",
      date: "Apr 17, 2025",
      time: "2:30 PM",
      status: "confirmed"
    },
    {
      id: "book-3",
      client: "Sophia Martinez",
      service: "Mobile App Development",
      date: "Apr 20, 2025",
      time: "9:00 AM",
      status: "pending"
    }
  ];
  
  const recentReviews = [
    {
      id: "rev-1",
      client: "Thomas Anderson",
      rating: 5,
      comment: "Excellent work! Delivered the project ahead of schedule and exceeded my expectations.",
      date: "Apr 10, 2025"
    },
    {
      id: "rev-2",
      client: "Lisa Johnson",
      rating: 4,
      comment: "Very professional and responsive. Would hire again.",
      date: "Apr 5, 2025"
    }
  ];
  
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">Provider Dashboard</h2>
        <div className="flex items-center space-x-2">
          <BadgeCheck className="text-servie" />
          <span className="text-lg font-medium">Premium Provider</span>
        </div>
      </div>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Monthly Earnings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline justify-between">
              <div className="text-2xl font-bold">${stats.earnings.current}</div>
              <div className="text-sm text-green-500 flex items-center">
                <TrendingUp className="h-4 w-4 mr-1" />
                {stats.earnings.percentChange}%
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Active Clients
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline justify-between">
              <div className="text-2xl font-bold">{stats.clients.current}</div>
              <div className="text-sm text-green-500 flex items-center">
                <TrendingUp className="h-4 w-4 mr-1" />
                {stats.clients.percentChange}%
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              This Month's Bookings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline justify-between">
              <div className="text-2xl font-bold">{stats.bookings.current}</div>
              <div className="text-sm text-green-500 flex items-center">
                <TrendingUp className="h-4 w-4 mr-1" />
                {stats.bookings.percentChange}%
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Average Rating
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <div className="text-2xl font-bold">{stats.rating}</div>
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`h-4 w-4 ${i < Math.floor(stats.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-muted-foreground'}`} />
                ))}
              </div>
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              From {stats.reviews} reviews
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Upcoming Bookings */}
      <Card>
        <CardHeader>
          <CardTitle>Upcoming Bookings</CardTitle>
          <CardDescription>
            Your scheduled appointments for the next 7 days
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {upcomingBookings.map((booking) => (
              <div key={booking.id} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                <div className="flex items-start space-x-4">
                  <div className="bg-muted rounded-full p-2">
                    <Calendar className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-medium">{booking.service}</h4>
                    <p className="text-sm text-muted-foreground">
                      Client: {booking.client}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-medium">{booking.date}</div>
                  <div className="text-sm text-muted-foreground">{booking.time}</div>
                  <div className={`text-xs ${booking.status === 'confirmed' ? 'text-green-500' : 'text-amber-500'} mt-1`}>
                    {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
        <CardFooter>
          <Button variant="outline" className="w-full">
            View All Bookings <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>
      
      {/* Recent Reviews */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Reviews</CardTitle>
          <CardDescription>
            What your clients are saying about your services
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentReviews.map((review) => (
              <div key={review.id} className="border-b pb-4 last:border-0 last:pb-0">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <div className="font-medium">{review.client}</div>
                    <div className="text-xs text-muted-foreground">{review.date}</div>
                  </div>
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`h-4 w-4 ${i < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-muted-foreground'}`} />
                    ))}
                  </div>
                </div>
                <p className="text-sm">{review.comment}</p>
              </div>
            ))}
          </div>
        </CardContent>
        <CardFooter>
          <Button variant="outline" className="w-full">
            View All Reviews <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

// Add a default export to fix the import issue in ProviderDashboard.tsx
export default ProviderOverviewTab;
