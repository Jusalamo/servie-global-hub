import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar, Star, Clock, DollarSign } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { useProviderStats } from "@/hooks/useProviderStats";
import { useBookings } from "@/hooks/useBookings";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { CompactStatsGrid } from "@/components/dashboard/CompactStatsGrid";

export function ProviderOverviewTab() {
  const [view, setView] = useState<"day" | "week" | "month">("week");
  const { stats, isLoading: statsLoading } = useProviderStats();
  const { bookings, isLoading: bookingsLoading } = useBookings('provider');
  const { profile } = useAuth();
  const [recentMessages, setRecentMessages] = useState<any[]>([]);

  useEffect(() => {
    const fetchMessages = async () => {
      if (!profile?.id) return;
      
      const { data } = await supabase
        .from('messages')
        .select('*, sender:profiles!messages_sender_id_fkey(*)')
        .eq('receiver_id', profile.id)
        .order('created_at', { ascending: false })
        .limit(3);

      setRecentMessages(data || []);
    };

    fetchMessages();
  }, [profile?.id]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  if (statsLoading || bookingsLoading) {
    return <Skeleton className="h-96" />;
  }

  const upcomingBookings = bookings.filter(b => b.status === 'pending' || b.status === 'confirmed');

  // Stats for compact grid
  const statsData = [
    {
      title: 'Total Earnings',
      value: `$${stats.totalEarnings.toFixed(2)}`,
      description: 'Total earnings',
      icon: <DollarSign className="h-4 w-4" />,
    },
    {
      title: 'Total Bookings',
      value: stats.totalBookings,
      description: 'Lifetime bookings',
      icon: <Calendar className="h-4 w-4" />,
    },
    {
      title: 'Completion Rate',
      value: `${stats.completionRate}%`,
      description: 'Success rate',
      icon: <Clock className="h-4 w-4" />,
    },
    {
      title: 'Rating',
      value: stats.rating || 'N/A',
      description: 'Out of 5 stars',
      icon: <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Compact Stats Grid */}
      <CompactStatsGrid stats={statsData} />
      
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
            {stats.totalBookings === 0 ? (
              <div className="h-[200px] flex items-center justify-center text-muted-foreground">
                <p>No booking data yet. Start accepting bookings to see trends!</p>
              </div>
            ) : (
              <div className="h-[200px] flex items-center justify-center text-muted-foreground">
                <p>Booking analytics coming soon</p>
              </div>
            )}
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
                {upcomingBookings.map((booking) => (
                  <div key={booking.id} className="flex items-center justify-between p-3 bg-muted/40 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarFallback>CL</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">Client</p>
                        <p className="text-sm text-muted-foreground">Service booking</p>
                        <p className="text-xs">{formatDate(booking.created_at)}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                        {booking.status}
                      </Badge>
                    </div>
                  </div>
                ))}
                
                {upcomingBookings.length === 0 && (
                  <div className="py-8 text-center">
                    <p className="text-muted-foreground">No upcoming bookings</p>
                    <Button variant="outline" className="mt-4">View Services</Button>
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
                      <AvatarFallback>
                        {msg.sender?.first_name?.charAt(0) || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <h4 className="font-medium">
                          {msg.sender?.first_name} {msg.sender?.last_name}
                        </h4>
                        <p className="text-xs text-muted-foreground">{formatDate(msg.created_at)}</p>
                      </div>
                      <p className="text-sm mt-1 line-clamp-2">{msg.content}</p>
                    </div>
                  </div>
                ))}
                {recentMessages.length === 0 && (
                  <div className="py-8 text-center text-muted-foreground">
                    <p>No messages yet</p>
                  </div>
                )}
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
                <div className="py-8 text-center text-muted-foreground">
                  <p>No reviews yet. Complete bookings to receive reviews!</p>
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

export default ProviderOverviewTab;
