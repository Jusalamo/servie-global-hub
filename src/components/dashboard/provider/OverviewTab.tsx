
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { BarChart, Calendar, MessageSquare, Star, Clock, DollarSign } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

// Dummy data for charts and stats
const bookingData = [
  { month: "Jan", bookings: 12 },
  { month: "Feb", bookings: 19 },
  { month: "Mar", bookings: 25 },
  { month: "Apr", bookings: 18 },
  { month: "May", bookings: 22 },
  { month: "Jun", bookings: 28 },
];

const recentBookings = [
  {
    id: "book_1",
    client: {
      name: "Alice Johnson",
      avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    },
    service: "Home Cleaning",
    date: "2023-05-25T10:00:00",
    status: "completed",
    amount: 75,
  },
  {
    id: "book_2",
    client: {
      name: "Robert Chen",
      avatar: "https://randomuser.me/api/portraits/men/46.jpg",
    },
    service: "Plumbing Repair",
    date: "2023-05-26T14:30:00",
    status: "upcoming",
    amount: 120,
  },
  {
    id: "book_3",
    client: {
      name: "Maria Garcia",
      avatar: "https://randomuser.me/api/portraits/women/74.jpg",
    },
    service: "Home Cleaning",
    date: "2023-05-27T09:00:00",
    status: "upcoming",
    amount: 75,
  },
  {
    id: "book_4",
    client: {
      name: "David Kim",
      avatar: "https://randomuser.me/api/portraits/men/35.jpg",
    },
    service: "Electrical Repair",
    date: "2023-05-24T11:00:00",
    status: "completed",
    amount: 95,
  },
  {
    id: "book_5",
    client: {
      name: "Sarah Williams",
      avatar: "https://randomuser.me/api/portraits/women/63.jpg",
    },
    service: "Home Cleaning",
    date: "2023-05-23T13:00:00",
    status: "completed",
    amount: 75,
  },
];

const recentMessages = [
  {
    id: "msg_1",
    client: {
      name: "James Wilson",
      avatar: "https://randomuser.me/api/portraits/men/22.jpg",
    },
    message: "Hi, I was wondering if you're available next Tuesday for a deep clean?",
    timestamp: "2023-05-25T10:23:00",
    read: false,
  },
  {
    id: "msg_2",
    client: {
      name: "Emma Lopez",
      avatar: "https://randomuser.me/api/portraits/women/32.jpg",
    },
    message: "Thank you for the great service yesterday!",
    timestamp: "2023-05-24T15:45:00",
    read: true,
  },
  {
    id: "msg_3",
    client: {
      name: "Alice Johnson",
      avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    },
    message: "Could you send me a receipt for the cleaning service?",
    timestamp: "2023-05-24T09:12:00",
    read: true,
  },
];

export function ProviderOverviewTab() {
  const [view, setView] = useState<"day" | "week" | "month">("week");
  
  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Earnings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <DollarSign className="h-4 w-4 text-muted-foreground mr-1" />
              <div className="text-2xl font-bold">$1,254.50</div>
            </div>
            <p className="text-xs text-muted-foreground mt-1">+12% from last month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Bookings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Calendar className="h-4 w-4 text-muted-foreground mr-1" />
              <div className="text-2xl font-bold">24</div>
            </div>
            <p className="text-xs text-muted-foreground mt-1">+3 from last month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Completion Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Clock className="h-4 w-4 text-muted-foreground mr-1" />
              <div className="text-2xl font-bold">98%</div>
            </div>
            <p className="text-xs text-muted-foreground mt-1">+2% from last month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Rating</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Star className="h-4 w-4 text-yellow-500 mr-1 fill-yellow-500" />
              <div className="text-2xl font-bold">4.9</div>
            </div>
            <p className="text-xs text-muted-foreground mt-1">Out of 5 stars</p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Booking Overview</CardTitle>
            <CardDescription>Your booking trends over time</CardDescription>
            <div className="flex items-center gap-2 mt-2">
              <Button 
                variant={view === "day" ? "default" : "outline"} 
                size="sm"
                onClick={() => setView("day")}
              >
                Day
              </Button>
              <Button 
                variant={view === "week" ? "default" : "outline"} 
                size="sm"
                onClick={() => setView("week")}
              >
                Week
              </Button>
              <Button 
                variant={view === "month" ? "default" : "outline"} 
                size="sm"
                onClick={() => setView("month")}
              >
                Month
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[200px] flex items-end justify-between gap-2 pt-4">
              {bookingData.map((data) => (
                <div key={data.month} className="relative flex flex-col items-center">
                  <div 
                    className="bg-servie rounded-t w-10" 
                    style={{ height: `${data.bookings * 4}px` }}
                  ></div>
                  <span className="text-xs mt-2">{data.month}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Bookings</CardTitle>
            <CardDescription>Your scheduled services</CardDescription>
          </CardHeader>
          <CardContent className="px-2">
            <ScrollArea className="h-[260px]">
              <div className="space-y-4 pr-4">
                {recentBookings.filter(b => b.status === "upcoming").map((booking) => (
                  <div key={booking.id} className="flex items-center justify-between p-3 bg-muted/40 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={booking.client.avatar} alt={booking.client.name} />
                        <AvatarFallback>{booking.client.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{booking.client.name}</p>
                        <p className="text-sm text-muted-foreground">{booking.service}</p>
                        <p className="text-xs">{formatDate(booking.date)}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">${booking.amount}</p>
                      <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                        Upcoming
                      </Badge>
                    </div>
                  </div>
                ))}
                
                {recentBookings.filter(b => b.status === "upcoming").length === 0 && (
                  <div className="py-8 text-center">
                    <p className="text-muted-foreground">No upcoming bookings</p>
                    <Button variant="outline" className="mt-4">Add Availability</Button>
                  </div>
                )}
              </div>
            </ScrollArea>
          </CardContent>
          <CardFooter>
            <Button className="w-full" variant="outline">View All Bookings</Button>
          </CardFooter>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Messages</CardTitle>
            <CardDescription>Client communications</CardDescription>
          </CardHeader>
          <CardContent className="px-2">
            <ScrollArea className="h-[240px] pr-4">
              <div className="space-y-4">
                {recentMessages.map((msg) => (
                  <div key={msg.id} className="flex gap-4 p-3 bg-muted/40 rounded-lg">
                    <Avatar>
                      <AvatarImage src={msg.client.avatar} alt={msg.client.name} />
                      <AvatarFallback>{msg.client.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <h4 className="font-medium">{msg.client.name}</h4>
                        <div className="flex items-center">
                          <p className="text-xs text-muted-foreground">{formatDate(msg.timestamp)}</p>
                          {!msg.read && (
                            <div className="ml-2 h-2 w-2 rounded-full bg-servie"></div>
                          )}
                        </div>
                      </div>
                      <p className="text-sm mt-1 line-clamp-2">{msg.message}</p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
          <CardFooter>
            <Button className="w-full" variant="outline">View All Messages</Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Recent Reviews</CardTitle>
            <CardDescription>What clients are saying</CardDescription>
          </CardHeader>
          <CardContent className="px-2">
            <ScrollArea className="h-[240px] pr-4">
              <div className="space-y-4">
                <div className="p-3 bg-muted/40 rounded-lg">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src="https://randomuser.me/api/portraits/women/44.jpg" alt="Alice Johnson" />
                        <AvatarFallback>AJ</AvatarFallback>
                      </Avatar>
                      <span className="font-medium">Alice Johnson</span>
                    </div>
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star key={star} className="h-3 w-3 fill-yellow-500 text-yellow-500" />
                      ))}
                    </div>
                  </div>
                  <p className="text-sm mt-2">
                    "The cleaning service was exceptional! My home hasn't been this clean in ages. 
                    Very professional and thorough."
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">Home Cleaning • 3 days ago</p>
                </div>
                
                <div className="p-3 bg-muted/40 rounded-lg">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src="https://randomuser.me/api/portraits/men/46.jpg" alt="Robert Chen" />
                        <AvatarFallback>RC</AvatarFallback>
                      </Avatar>
                      <span className="font-medium">Robert Chen</span>
                    </div>
                    <div className="flex">
                      {[1, 2, 3, 4].map((star) => (
                        <Star key={star} className="h-3 w-3 fill-yellow-500 text-yellow-500" />
                      ))}
                      <Star className="h-3 w-3 text-yellow-500" />
                    </div>
                  </div>
                  <p className="text-sm mt-2">
                    "Quick response and fixed my plumbing issue efficiently. 
                    Would have given 5 stars but arrived a bit late."
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">Plumbing Repair • 5 days ago</p>
                </div>
                
                <div className="p-3 bg-muted/40 rounded-lg">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src="https://randomuser.me/api/portraits/women/32.jpg" alt="Emma Lopez" />
                        <AvatarFallback>EL</AvatarFallback>
                      </Avatar>
                      <span className="font-medium">Emma Lopez</span>
                    </div>
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star key={star} className="h-3 w-3 fill-yellow-500 text-yellow-500" />
                      ))}
                    </div>
                  </div>
                  <p className="text-sm mt-2">
                    "Absolutely fantastic service! The attention to detail was impressive.
                    I've already booked another cleaning for next month."
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">Home Cleaning • 1 week ago</p>
                </div>
              </div>
            </ScrollArea>
          </CardContent>
          <CardFooter>
            <Button className="w-full" variant="outline">View All Reviews</Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}

// Add a default export to fix the import issue in ProviderDashboard.tsx
export default ProviderOverviewTab;
