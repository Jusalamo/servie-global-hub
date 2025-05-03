
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import BookingCalendar from "@/components/dashboard/shared/BookingCalendar";
import { Calendar, Clock, MapPin, Phone, Mail, User } from "lucide-react";

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

  const handleBookingSelect = (booking: typeof mockProviderBookings[0]) => {
    setSelectedBooking(booking);
    setIsDialogOpen(true);
  };

  const handleCancelBooking = (bookingId: string) => {
    // In a real app, this would call an API to cancel the booking
    toast.success(`Booking ${bookingId} was cancelled`);
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
      </div>

      <BookingCalendar 
        bookings={mockProviderBookings}
        userRole="provider"
        onBookingSelect={handleBookingSelect}
        onCancelBooking={handleCancelBooking}
      />

      {/* Booking Details Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          {selectedBooking && (
            <>
              <DialogHeader>
                <DialogTitle>Booking Details</DialogTitle>
                <DialogDescription>
                  {selectedBooking.title}
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
                    <p className="text-sm text-muted-foreground">{selectedBooking.client.email}</p>
                  </div>
                </div>

                {selectedBooking.notes && (
                  <div className="border-t pt-4 mt-4">
                    <p className="font-medium">Notes</p>
                    <p className="text-sm text-muted-foreground mt-1">{selectedBooking.notes}</p>
                  </div>
                )}
              </div>

              <DialogFooter>
                {selectedBooking.status === 'upcoming' && (
                  <Button variant="destructive" onClick={() => {
                    handleCancelBooking(selectedBooking.id);
                    setIsDialogOpen(false);
                  }}>
                    Cancel Booking
                  </Button>
                )}
                <Button onClick={() => setIsDialogOpen(false)}>Close</Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
