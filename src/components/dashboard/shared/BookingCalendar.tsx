
import React, { useState } from 'react';
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Clock, 
  MapPin, 
  User, 
  Calendar as CalendarIcon,
  ArrowRight, 
  Check,
  X,
  Star
} from "lucide-react";

interface Booking {
  id: string;
  title: string;
  date: Date;
  timeSlot: string;
  location: string;
  client?: {
    name: string;
    avatar?: string;
  };
  provider?: {
    name: string;
    avatar?: string;
  };
  status: 'upcoming' | 'completed' | 'cancelled';
}

interface BookingCalendarProps {
  bookings: Booking[];
  userRole: 'client' | 'provider' | 'seller'; 
  onBookingSelect?: (booking: Booking) => void;
  onDateSelect?: (date: Date) => void;
  onCancelBooking?: (bookingId: string) => void;
}

export default function BookingCalendar({ 
  bookings, 
  userRole, 
  onBookingSelect, 
  onDateSelect,
  onCancelBooking
}: BookingCalendarProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [view, setView] = useState<'calendar' | 'list'>('calendar');
  
  // Group bookings by date for calendar view
  const bookingsByDate = bookings.reduce((acc: Record<string, Booking[]>, booking) => {
    const dateStr = booking.date.toDateString();
    if (!acc[dateStr]) {
      acc[dateStr] = [];
    }
    acc[dateStr].push(booking);
    return acc;
  }, {});

  // Filter bookings for the selected date
  const selectedDateBookings = selectedDate 
    ? bookings.filter(booking => booking.date.toDateString() === selectedDate.toDateString()) 
    : [];

  // Filter bookings by status
  const upcomingBookings = bookings.filter(booking => booking.status === 'upcoming');
  const pastBookings = bookings.filter(booking => booking.status === 'completed' || booking.status === 'cancelled');
  
  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    if (date && onDateSelect) {
      onDateSelect(date);
    }
  };

  const renderBookingCard = (booking: Booking) => (
    <Card key={booking.id} className="mb-4 overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{booking.title}</CardTitle>
            <CardDescription className="flex items-center mt-1">
              <CalendarIcon className="h-4 w-4 mr-1 text-muted-foreground" />
              {booking.date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
              <Clock className="h-4 w-4 mx-1 ml-3 text-muted-foreground" />
              {booking.timeSlot}
            </CardDescription>
          </div>
          <Badge 
            variant={
              booking.status === 'upcoming' ? 'default' : 
              booking.status === 'completed' ? 'secondary' : 
              'destructive'
            }
            className="capitalize"
          >
            {booking.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center mb-3">
          <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
          <span className="text-sm">{booking.location}</span>
        </div>
        
        {/* Show client details for providers, show provider details for clients */}
        {userRole === 'provider' && booking.client && (
          <div className="flex items-center">
            <User className="h-4 w-4 mr-2 text-muted-foreground" />
            <span className="text-sm">Client: {booking.client.name}</span>
          </div>
        )}
        
        {userRole === 'client' && booking.provider && (
          <div className="flex items-center">
            <User className="h-4 w-4 mr-2 text-muted-foreground" />
            <span className="text-sm">Provider: {booking.provider.name}</span>
          </div>
        )}
        
        {booking.status === 'upcoming' && (
          <div className="flex justify-between mt-4">
            <Button variant="outline" size="sm" onClick={() => onBookingSelect && onBookingSelect(booking)}>
              Details <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button 
              variant="destructive" 
              size="sm" 
              onClick={() => onCancelBooking && onCancelBooking(booking.id)}
            >
              Cancel
            </Button>
          </div>
        )}
        
        {booking.status === 'completed' && (
          <div className="flex justify-between mt-4">
            <Button variant="outline" size="sm" onClick={() => onBookingSelect && onBookingSelect(booking)}>
              View Details
            </Button>
            <Button variant="secondary" size="sm">
              Leave Review <Star className="ml-2 h-4 w-4" />
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );

  // Function to highlight dates with bookings
  const isDayWithBooking = (date: Date) => {
    return !!bookingsByDate[date.toDateString()];
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="upcoming" className="w-full">
        <div className="flex justify-between items-center mb-4">
          <TabsList>
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="past">Past</TabsTrigger>
          </TabsList>
          
          <div className="flex space-x-2">
            <Button 
              variant={view === 'calendar' ? 'secondary' : 'outline'} 
              size="sm" 
              onClick={() => setView('calendar')}
            >
              <CalendarIcon className="h-4 w-4" />
            </Button>
            <Button 
              variant={view === 'list' ? 'secondary' : 'outline'} 
              size="sm" 
              onClick={() => setView('list')}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-list">
                <line x1="8" x2="21" y1="6" y2="6" />
                <line x1="8" x2="21" y1="12" y2="12" />
                <line x1="8" x2="21" y1="18" y2="18" />
                <line x1="3" x2="3" y1="6" y2="6" />
                <line x1="3" x2="3" y1="12" y2="12" />
                <line x1="3" x2="3" y1="18" y2="18" />
              </svg>
            </Button>
          </div>
        </div>
        
        {view === 'calendar' ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1">
              <Card>
                <CardContent className="pt-6">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={handleDateSelect}
                    className="rounded-md border"
                    modifiers={{
                      withBookings: (date) => isDayWithBooking(date),
                    }}
                    modifiersStyles={{
                      withBookings: { 
                        fontWeight: 'bold',
                        backgroundColor: 'rgba(234, 56, 76, 0.1)',
                        color: '#ea384c',
                      },
                    }}
                  />
                </CardContent>
              </Card>
            </div>
            
            <div className="md:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>
                    {selectedDate ? (
                      <span>{selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</span>
                    ) : (
                      <span>No date selected</span>
                    )}
                  </CardTitle>
                  <CardDescription>
                    {selectedDateBookings.length} booking{selectedDateBookings.length !== 1 ? 's' : ''}
                  </CardDescription>
                </CardHeader>
                <CardContent className="max-h-[400px] overflow-y-auto">
                  {selectedDateBookings.length > 0 ? (
                    selectedDateBookings.map(booking => renderBookingCard(booking))
                  ) : (
                    <div className="text-center py-12">
                      <p className="text-muted-foreground">No bookings for this date</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        ) : (
          <div>
            <TabsContent value="upcoming" className="m-0">
              {upcomingBookings.length > 0 ? (
                upcomingBookings.map(booking => renderBookingCard(booking))
              ) : (
                <div className="text-center py-12 bg-muted rounded-lg">
                  <p className="text-muted-foreground">No upcoming bookings</p>
                </div>
              )}
            </TabsContent>
            <TabsContent value="past" className="m-0">
              {pastBookings.length > 0 ? (
                pastBookings.map(booking => renderBookingCard(booking))
              ) : (
                <div className="text-center py-12 bg-muted rounded-lg">
                  <p className="text-muted-foreground">No past bookings</p>
                </div>
              )}
            </TabsContent>
          </div>
        )}
      </Tabs>
    </div>
  );
}
