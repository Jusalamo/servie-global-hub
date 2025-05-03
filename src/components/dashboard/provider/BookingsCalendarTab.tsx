
import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Clock, MapPin, MailIcon, Phone } from "lucide-react";

// Define the booking type
interface Booking {
  id: string;
  clientName: string;
  clientAvatar: string;
  service: string;
  date: string;
  status: string;
  address: string;
  amount: number;
}

interface BookingsCalendarTabProps {
  bookings: Booking[];
}

const BookingsCalendarTab = ({ bookings }: BookingsCalendarTabProps) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  
  // Filter bookings for the selected date
  const filteredBookings = selectedDate 
    ? bookings.filter(booking => {
        const bookingDate = new Date(booking.date);
        return (
          bookingDate.getDate() === selectedDate.getDate() &&
          bookingDate.getMonth() === selectedDate.getMonth() &&
          bookingDate.getFullYear() === selectedDate.getFullYear()
        );
      })
    : [];
  
  // Find dates with bookings for calendar highlighting
  const datesWithBookings = bookings.map(booking => {
    const date = new Date(booking.date);
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
  });
  
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold tracking-tight">Booking Schedule</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-[350px_1fr] gap-6">
        {/* Calendar */}
        <Card>
          <CardHeader>
            <CardTitle>Select Date</CardTitle>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="rounded-md border"
              modifiers={{
                booked: datesWithBookings,
              }}
              modifiersStyles={{
                booked: { 
                  backgroundColor: "rgba(155, 135, 245, 0.1)",
                  fontWeight: "bold" 
                }
              }}
            />
            <div className="mt-4 flex items-center text-sm text-muted-foreground">
              <div className="flex items-center mr-4">
                <div className="w-4 h-4 bg-purple-100 rounded-full mr-2"></div>
                <span>Date with bookings</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-servie/10 rounded-full mr-2"></div>
                <span>Selected date</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Bookings for selected date */}
        <Card>
          <CardHeader>
            <CardTitle>
              {selectedDate ? (
                <>Bookings for {selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</>
              ) : (
                <>Please select a date</>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {filteredBookings.length > 0 ? (
              <ScrollArea className="h-[500px] pr-4">
                <div className="space-y-4">
                  {filteredBookings.map((booking) => (
                    <div key={booking.id} className="p-4 border rounded-lg">
                      <div className="flex flex-col md:flex-row justify-between gap-4">
                        <div className="flex items-start gap-4">
                          <Avatar>
                            <AvatarImage src={booking.clientAvatar} alt={booking.clientName} />
                            <AvatarFallback>{booking.clientName.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="font-semibold">{booking.clientName}</h3>
                            <p className="text-sm text-muted-foreground">{booking.service}</p>
                            <div className="mt-2 flex items-center text-sm">
                              <Clock className="h-4 w-4 mr-1 text-purple-500" />
                              <span>
                                {new Date(booking.date).toLocaleTimeString('en-US', {
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex flex-col gap-2">
                          <Badge 
                            className={`
                              self-start
                              ${booking.status === 'confirmed' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : ''}
                              ${booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' : ''}
                              ${booking.status === 'completed' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' : ''}
                            `}
                          >
                            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                          </Badge>
                          <div className="text-sm font-medium">Amount: ${booking.amount}</div>
                          <div className="flex items-start text-sm text-muted-foreground">
                            <MapPin className="h-4 w-4 mr-1 mt-1 flex-shrink-0" />
                            <span>{booking.address}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-4 flex flex-wrap gap-2">
                        <Button variant="outline" size="sm" className="flex items-center gap-1">
                          <MailIcon className="h-4 w-4" />
                          Message
                        </Button>
                        <Button variant="outline" size="sm" className="flex items-center gap-1">
                          <Phone className="h-4 w-4" />
                          Call
                        </Button>
                        <Button size="sm" className="bg-red-500 hover:bg-red-600 text-white">Manage Booking</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            ) : (
              <div className="text-center py-12">
                {selectedDate ? (
                  <>
                    <p className="text-muted-foreground mb-2">No bookings for this date</p>
                    <Button variant="outline" onClick={() => setSelectedDate(new Date())}>
                      Return to Today
                    </Button>
                  </>
                ) : (
                  <p className="text-muted-foreground">Select a date to view bookings</p>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BookingsCalendarTab;
