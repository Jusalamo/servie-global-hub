import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Calendar, Clock, MapPin, Phone, Mail, User, Plus, Loader2 } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useBookings, Booking } from "@/hooks/useBookings";
import { supabase } from "@/integrations/supabase/client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

export default function BookingsTab() {
  const { bookings, isLoading, error } = useBookings('provider');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [view, setView] = useState('list');
  const [clientProfiles, setClientProfiles] = useState<Record<string, any>>({});

  // Fetch client profiles for bookings
  useEffect(() => {
    const fetchClientProfiles = async () => {
      const clientIds = [...new Set(bookings.map(b => b.client_id).filter(Boolean))];
      if (clientIds.length === 0) return;

      const { data } = await supabase
        .from('profiles')
        .select('id, first_name, last_name, phone, avatar_url')
        .in('id', clientIds);

      if (data) {
        const profiles: Record<string, any> = {};
        data.forEach(p => { profiles[p.id] = p; });
        setClientProfiles(profiles);
      }
    };

    if (bookings.length > 0) {
      fetchClientProfiles();
    }
  }, [bookings]);

  const handleBookingSelect = (booking: Booking) => {
    setSelectedBooking(booking);
    setIsDialogOpen(true);
  };

  const handleCancelBooking = async (bookingId: string) => {
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ status: 'cancelled' })
        .eq('id', bookingId);

      if (error) throw error;
      toast.success('Booking cancelled successfully');
      setIsDialogOpen(false);
    } catch (err) {
      toast.error('Failed to cancel booking');
    }
  };

  const handleReschedule = async (bookingId: string) => {
    toast.info('Reschedule feature coming soon');
  };

  // Filter bookings by status
  const upcomingBookings = bookings.filter(b => b.status === 'pending' || b.status === 'confirmed');
  const completedBookings = bookings.filter(b => b.status === 'completed');
  const cancelledBookings = bookings.filter(b => b.status === 'cancelled');
  const todayBookings = bookings.filter(b => {
    const today = new Date().toISOString().split('T')[0];
    return b.booking_date === today;
  });

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-blue-100 text-blue-800',
      completed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
    };
    return variants[status] || 'bg-gray-100 text-gray-800';
  };

  const renderBookingItem = (booking: Booking) => {
    const client = clientProfiles[booking.client_id];
    
    return (
      <div 
        key={booking.id} 
        className="border rounded-lg p-4 hover:border-servie cursor-pointer transition-all"
        onClick={() => handleBookingSelect(booking)}
      >
        <div className="flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-lg truncate">
                {booking.services?.title || 'Service Booking'}
              </h3>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Calendar className="h-4 w-4 text-servie flex-shrink-0" />
                  {formatDate(booking.booking_date)}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-4 w-4 text-servie flex-shrink-0" />
                  {booking.booking_time}
                </span>
              </div>
            </div>
            
            <Badge className={getStatusBadge(booking.status)}>
              {booking.status}
            </Badge>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-2 border-t">
            <div className="flex items-center gap-3">
              <Avatar className="h-8 w-8">
                <AvatarImage src={client?.avatar_url} />
                <AvatarFallback>
                  {client?.first_name?.[0] || 'C'}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium">
                  {client?.first_name} {client?.last_name || 'Client'}
                </p>
                {client?.phone && (
                  <p className="text-xs text-muted-foreground">{client.phone}</p>
                )}
              </div>
            </div>

            <div className="flex gap-2">
              <Button size="sm" variant="outline">Details</Button>
              {booking.status === 'pending' && (
                <Button 
                  size="sm" 
                  variant="destructive"
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
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-servie" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500">Failed to load bookings. Please try again.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Manage Your Bookings</h2>
          <p className="text-muted-foreground">
            View and manage all your client appointments
          </p>
        </div>
        <div className="flex gap-2">
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
      
      <Tabs defaultValue="upcoming" className="w-full">
        <TabsList className="grid grid-cols-4 w-full sm:w-auto sm:inline-grid">
          <TabsTrigger value="upcoming" className="text-xs sm:text-sm">
            Upcoming ({upcomingBookings.length})
          </TabsTrigger>
          <TabsTrigger value="today" className="text-xs sm:text-sm">
            Today ({todayBookings.length})
          </TabsTrigger>
          <TabsTrigger value="completed" className="text-xs sm:text-sm">
            Done ({completedBookings.length})
          </TabsTrigger>
          <TabsTrigger value="cancelled" className="text-xs sm:text-sm">
            Cancelled ({cancelledBookings.length})
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="upcoming" className="mt-6 space-y-4">
          {upcomingBookings.length > 0 ? (
            upcomingBookings.map(booking => renderBookingItem(booking))
          ) : (
            <Card className="p-8 text-center">
              <p className="text-muted-foreground mb-4">No upcoming bookings</p>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="today" className="mt-6 space-y-4">
          {todayBookings.length > 0 ? (
            todayBookings.map(booking => renderBookingItem(booking))
          ) : (
            <Card className="p-8 text-center">
              <p className="text-muted-foreground">No bookings scheduled for today</p>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="completed" className="mt-6 space-y-4">
          {completedBookings.length > 0 ? (
            completedBookings.map(booking => renderBookingItem(booking))
          ) : (
            <Card className="p-8 text-center">
              <p className="text-muted-foreground">No completed bookings</p>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="cancelled" className="mt-6 space-y-4">
          {cancelledBookings.length > 0 ? (
            cancelledBookings.map(booking => renderBookingItem(booking))
          ) : (
            <Card className="p-8 text-center">
              <p className="text-muted-foreground">No cancelled bookings</p>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* Booking Details Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          {selectedBooking && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedBooking.services?.title || 'Booking Details'}</DialogTitle>
                <DialogDescription>
                  Booking ID: {selectedBooking.id.slice(0, 8)}...
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-4">
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-servie" />
                  <div>
                    <p className="font-medium">Date & Time</p>
                    <p className="text-sm text-muted-foreground">
                      {formatDate(selectedBooking.booking_date)}, {selectedBooking.booking_time}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <User className="h-5 w-5 text-servie" />
                  <div>
                    <p className="font-medium">Client</p>
                    <p className="text-sm text-muted-foreground">
                      {clientProfiles[selectedBooking.client_id]?.first_name || 'Client'}{' '}
                      {clientProfiles[selectedBooking.client_id]?.last_name || ''}
                    </p>
                  </div>
                </div>

                {clientProfiles[selectedBooking.client_id]?.phone && (
                  <div className="flex items-center gap-3">
                    <Phone className="h-5 w-5 text-servie" />
                    <div>
                      <p className="font-medium">Contact</p>
                      <p className="text-sm text-muted-foreground">
                        {clientProfiles[selectedBooking.client_id].phone}
                      </p>
                    </div>
                  </div>
                )}

                {selectedBooking.notes && (
                  <div className="border-t pt-4">
                    <p className="font-medium">Notes</p>
                    <p className="text-sm text-muted-foreground mt-1">{selectedBooking.notes}</p>
                  </div>
                )}
              </div>

              <DialogFooter className="flex flex-row justify-end gap-2">
                {selectedBooking.status === 'pending' && (
                  <>
                    <Button 
                      variant="destructive" 
                      onClick={() => handleCancelBooking(selectedBooking.id)}
                    >
                      Cancel Booking
                    </Button>
                    <Button onClick={() => handleReschedule(selectedBooking.id)}>
                      Reschedule
                    </Button>
                  </>
                )}
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Close
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
