
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Calendar, Clock, MapPin, Phone, Mail, User, Filter, Plus } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

// Mock data for provider bookings
const mockProviderBookings = [
  {
    id: "book_1",
    title: "Home Cleaning Service",
    date: new Date(Date.now() + 86400000), // tomorrow
    timeSlot: "10:00 AM - 12:00 PM",
    location: "123 Main St, Cityville",
    client: {
      name: "Sarah Johnson",
      avatar: "https://randomuser.me/api/portraits/women/32.jpg",
      phone: "+1 (555) 123-4567",
      email: "sarah.j@example.com"
    },
    status: 'upcoming' as const,
    notes: "Please focus on kitchen and bathrooms. Client has a pet cat."
  },
  {
    id: "book_2",
    title: "Carpet Cleaning",
    date: new Date(Date.now() + 172800000), // day after tomorrow
    timeSlot: "2:00 PM - 4:00 PM",
    location: "456 Oak Ave, Townsburg",
    client: {
      name: "Michael Chen",
      avatar: "https://randomuser.me/api/portraits/men/45.jpg",
      phone: "+1 (555) 987-6543",
      email: "m.chen@example.com"
    },
    status: 'upcoming' as const,
    notes: "Three bedrooms, living room, and hallway carpet. Stain treatment needed in living room."
  },
  {
    id: "book_3",
    title: "Office Deep Clean",
    date: new Date(Date.now() - 86400000), // yesterday
    timeSlot: "5:00 PM - 7:00 PM",
    location: "789 Business Pkwy, Cityville",
    client: {
      name: "Alex Rivera",
      avatar: "https://randomuser.me/api/portraits/men/22.jpg",
      phone: "+1 (555) 333-4444",
      email: "alex.r@company.com"
    },
    status: 'completed' as const,
    notes: "Full office cleaning after hours. Security will provide access."
  },
  {
    id: "book_4",
    title: "Move-Out Cleaning",
    date: new Date(Date.now() - 172800000), // 2 days ago
    timeSlot: "9:00 AM - 2:00 PM",
    location: "101 Apartment Lane, Unit 3B, Townsburg",
    client: {
      name: "Emily Wilson",
      avatar: "https://randomuser.me/api/portraits/women/63.jpg",
      phone: "+1 (555) 222-8888",
      email: "emily.w@example.com"
    },
    status: 'completed' as const,
    notes: "Complete move-out cleaning including oven, refrigerator, and cabinets. Need to pass landlord inspection."
  },
  {
    id: "book_5",
    title: "Weekly Home Cleaning",
    date: new Date(Date.now() - 345600000), // 4 days ago
    timeSlot: "11:00 AM - 1:00 PM",
    location: "222 Pleasant Dr, Cityville",
    client: {
      name: "Jennifer Lopez",
      avatar: "https://randomuser.me/api/portraits/women/51.jpg",
      phone: "+1 (555) 999-1111",
      email: "j.lopez@example.com"
    },
    status: 'cancelled' as const,
    notes: "Client cancelled due to scheduling conflict."
  }
];

export default function BookingsTab() {
  const [selectedBooking, setSelectedBooking] = useState<typeof mockProviderBookings[0] | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [view, setView] = useState('list'); // 'list' or 'calendar'
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const handleBookingSelect = (booking: typeof mockProviderBookings[0]) => {
    setSelectedBooking(booking);
    setIsDialogOpen(true);
  };

  const handleCancelBooking = (bookingId: string) => {
    // In a real app, this would call an API to cancel the booking
    toast.success(`Booking ${bookingId} was cancelled`);
  };

  // Filter bookings for today
  const todayBookings = mockProviderBookings.filter(booking => {
    const today = new Date();
    return booking.date.getDate() === today.getDate() && 
           booking.date.getMonth() === today.getMonth() && 
           booking.date.getFullYear() === today.getFullYear();
  });
  
  // Group bookings by status
  const upcomingBookings = mockProviderBookings.filter(booking => booking.status === 'upcoming');
  const completedBookings = mockProviderBookings.filter(booking => booking.status === 'completed');
  const cancelledBookings = mockProviderBookings.filter(booking => booking.status === 'cancelled');
  
  // Function to render booking items
  const renderBookingItem = (booking: typeof mockProviderBookings[0]) => (
    <div 
      key={booking.id} 
      className="border rounded-lg p-4 hover:border-servie cursor-pointer transition-all"
      onClick={() => handleBookingSelect(booking)}
    >
      <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
        <div>
          <h3 className="font-medium text-lg">{booking.title}</h3>
          <div className="flex items-center mt-1">
            <Calendar className="h-4 w-4 mr-1 text-servie" />
            <span className="text-sm">{booking.date.toLocaleDateString()}</span>
            <Clock className="h-4 w-4 mx-1 ml-3 text-servie" />
            <span className="text-sm">{booking.timeSlot}</span>
          </div>
          <div className="flex items-center mt-1">
            <MapPin className="h-4 w-4 mr-1 text-servie" />
            <span className="text-sm">{booking.location}</span>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <div className="flex items-center">
            <div className="h-8 w-8 rounded-full overflow-hidden mr-2">
              <img 
                src={booking.client.avatar} 
                alt={booking.client.name} 
                className="h-full w-full object-cover"
              />
            </div>
            <div>
              <p className="text-sm font-medium">{booking.client.name}</p>
              <p className="text-xs text-muted-foreground">{booking.client.phone}</p>
            </div>
          </div>
          
          <div className="flex space-x-2">
            <Button size="sm" variant="outline" className="h-8">
              Details
            </Button>
            {booking.status === 'upcoming' && (
              <Button size="sm" variant="destructive" className="h-8" 
                onClick={(e) => {
                  e.stopPropagation();
                  handleCancelBooking(booking.id);
                }}
              >
                Cancel
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
  
  // Function to render calendar view
  const renderCalendarView = () => {
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const monthsOfYear = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    
    // Get bookings for the current month
    const monthBookings = mockProviderBookings.filter(booking => {
      return booking.date.getMonth() === currentMonth && booking.date.getFullYear() === currentYear;
    });
    
    // Group bookings by date
    const bookingsByDate: Record<number, typeof mockProviderBookings> = {};
    monthBookings.forEach(booking => {
      const day = booking.date.getDate();
      if (!bookingsByDate[day]) bookingsByDate[day] = [];
      bookingsByDate[day].push(booking);
    });
    
    // Create calendar grid
    const calendarDays = [];
    let dayCounter = 1;
    
    // Push empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      calendarDays.push(<div key={`empty-${i}`} className="border p-2 min-h-[100px]"></div>);
    }
    
    // Push cells for each day of the month
    for (let i = 1; i <= daysInMonth; i++) {
      const isToday = i === currentDate.getDate() && currentMonth === currentDate.getMonth() && currentYear === currentDate.getFullYear();
      const dayBookings = bookingsByDate[i] || [];
      
      calendarDays.push(
        <div 
          key={`day-${i}`} 
          className={`border p-2 min-h-[100px] ${isToday ? 'bg-servie/10' : ''}`}
        >
          <div className={`text-right mb-1 ${isToday ? 'font-bold' : ''}`}>{i}</div>
          {dayBookings.length > 0 ? (
            <div className="space-y-1">
              {dayBookings.map(booking => (
                <div 
                  key={booking.id} 
                  className="text-xs p-1 bg-servie/20 rounded truncate cursor-pointer"
                  onClick={() => handleBookingSelect(booking)}
                >
                  {booking.timeSlot}: {booking.title}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-xs text-muted-foreground text-center mt-4">No bookings</div>
          )}
        </div>
      );
    }
    
    return (
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold">{monthsOfYear[currentMonth]} {currentYear}</h2>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm">Previous</Button>
            <Button variant="outline" size="sm">Today</Button>
            <Button variant="outline" size="sm">Next</Button>
          </div>
        </div>
        
        <div className="grid grid-cols-7 gap-1">
          {daysOfWeek.map(day => (
            <div key={day} className="text-center font-medium p-2 bg-muted">{day.slice(0, 3)}</div>
          ))}
          {calendarDays}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight mb-1">Manage Your Bookings</h2>
          <p className="text-muted-foreground">
            View and manage all your client appointments
          </p>
        </div>
        <div className="flex space-x-2">
          <Button 
            variant={view === 'list' ? 'default' : 'outline'} 
            size="sm" 
            onClick={() => setView('list')}
          >
            List View
          </Button>
          <Button 
            variant={view === 'calendar' ? 'default' : 'outline'} 
            size="sm" 
            onClick={() => setView('calendar')}
          >
            Calendar
          </Button>
        </div>
      </div>
      
      {view === 'list' ? (
        <Tabs defaultValue="upcoming">
          <TabsList>
            <TabsTrigger value="upcoming">Upcoming ({upcomingBookings.length})</TabsTrigger>
            <TabsTrigger value="today">Today ({todayBookings.length})</TabsTrigger>
            <TabsTrigger value="completed">Completed ({completedBookings.length})</TabsTrigger>
            <TabsTrigger value="cancelled">Cancelled ({cancelledBookings.length})</TabsTrigger>
          </TabsList>
          
          <TabsContent value="upcoming" className="mt-6 space-y-4">
            {upcomingBookings.length > 0 ? (
              upcomingBookings.map(booking => renderBookingItem(booking))
            ) : (
              <div className="text-center py-12 border rounded-lg">
                <p className="text-muted-foreground mb-2">No upcoming bookings</p>
                <Button>
                  <Plus className="mr-2 h-4 w-4" /> Add Booking
                </Button>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="today" className="mt-6 space-y-4">
            {todayBookings.length > 0 ? (
              todayBookings.map(booking => renderBookingItem(booking))
            ) : (
              <div className="text-center py-12 border rounded-lg">
                <p className="text-muted-foreground">No bookings scheduled for today</p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="completed" className="mt-6 space-y-4">
            {completedBookings.length > 0 ? (
              completedBookings.map(booking => renderBookingItem(booking))
            ) : (
              <div className="text-center py-12 border rounded-lg">
                <p className="text-muted-foreground">No completed bookings</p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="cancelled" className="mt-6 space-y-4">
            {cancelledBookings.length > 0 ? (
              cancelledBookings.map(booking => renderBookingItem(booking))
            ) : (
              <div className="text-center py-12 border rounded-lg">
                <p className="text-muted-foreground">No cancelled bookings</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      ) : (
        <Card>
          {renderCalendarView()}
        </Card>
      )}

      {/* Booking Details Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          {selectedBooking && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedBooking.title}</DialogTitle>
                <DialogDescription>
                  Booking ID: {selectedBooking.id}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-4">
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 mr-3 text-servie" />
                  <div>
                    <p className="font-medium">Date & Time</p>
                    <p className="text-sm text-muted-foreground">
                      {selectedBooking.date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })},
                      {' '}{selectedBooking.timeSlot}
                    </p>
                  </div>
                </div>

                <div className="flex items-center">
                  <MapPin className="h-5 w-5 mr-3 text-servie" />
                  <div>
                    <p className="font-medium">Location</p>
                    <p className="text-sm text-muted-foreground">{selectedBooking.location}</p>
                  </div>
                </div>

                <div className="flex items-center">
                  <User className="h-5 w-5 mr-3 text-servie" />
                  <div>
                    <p className="font-medium">Client</p>
                    <p className="text-sm text-muted-foreground">{selectedBooking.client.name}</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <Phone className="h-5 w-5 mr-3 text-servie" />
                  <div>
                    <p className="font-medium">Contact</p>
                    <p className="text-sm text-muted-foreground">{selectedBooking.client.phone}</p>
                    <p className="text-sm text-muted-foreground mt-1">{selectedBooking.client.email}</p>
                  </div>
                </div>

                {selectedBooking.notes && (
                  <div className="border-t pt-4 mt-4">
                    <p className="font-medium">Notes</p>
                    <p className="text-sm text-muted-foreground mt-1">{selectedBooking.notes}</p>
                  </div>
                )}
              </div>

              <DialogFooter className="flex flex-row justify-end space-x-2">
                {selectedBooking.status === 'upcoming' && (
                  <>
                    <Button variant="destructive" onClick={() => {
                      handleCancelBooking(selectedBooking.id);
                      setIsDialogOpen(false);
                    }}>
                      Cancel Booking
                    </Button>
                    <Button>Reschedule</Button>
                  </>
                )}
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Close</Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
