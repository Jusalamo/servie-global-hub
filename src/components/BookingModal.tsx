
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { bookingAPI, availabilityAPI } from "@/services/supabaseAPI";
import { useAuth } from "@/context/AuthContext";
import { CalendarDays, Clock, MapPin } from "lucide-react";

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  service: any;
}

const BookingModal = ({ isOpen, onClose, service }: BookingModalProps) => {
  const { isAuthenticated } = useAuth();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [selectedTime, setSelectedTime] = useState("");
  const [notes, setNotes] = useState("");
  const [availableSlots, setAvailableSlots] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (selectedDate && service?.id) {
      loadAvailableSlots();
    }
  }, [selectedDate, service?.id]);

  const loadAvailableSlots = async () => {
    if (!selectedDate || !service?.id) return;
    
    try {
      const dateStr = selectedDate.toISOString().split('T')[0];
      const slots = await availabilityAPI.getAvailability(service.id, dateStr);
      setAvailableSlots(slots);
    } catch (error) {
      console.error("Failed to load available slots:", error);
    }
  };

  const handleBooking = async () => {
    if (!isAuthenticated) {
      toast.error("Please sign in to book a service");
      return;
    }

    if (!selectedDate || !selectedTime) {
      toast.error("Please select date and time");
      return;
    }

    setLoading(true);
    try {
      await bookingAPI.createBooking({
        service_id: service.id,
        booking_date: selectedDate.toISOString().split('T')[0],
        booking_time: selectedTime,
        notes: notes,
        status: 'pending',
        payment_status: 'unpaid'
      });

      toast.success("Booking created successfully!");
      onClose();
      setSelectedDate(undefined);
      setSelectedTime("");
      setNotes("");
    } catch (error) {
      toast.error("Failed to create booking");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CalendarDays className="w-5 h-5" />
            Book {service?.title}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Service Info */}
          <div className="bg-muted/50 p-4 rounded-lg">
            <h3 className="font-semibold">{service?.title}</h3>
            <p className="text-sm text-muted-foreground mt-1">{service?.description}</p>
            <div className="flex items-center gap-4 mt-2 text-sm">
              <span className="font-medium">Price: ${service?.price}</span>
              <span className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                {service?.location || 'Remote'}
              </span>
            </div>
          </div>

          {/* Date Selection */}
          <div>
            <Label className="text-base font-medium">Select Date</Label>
            <div className="mt-2">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                disabled={(date) => date < new Date()}
                className="rounded-md border"
              />
            </div>
          </div>

          {/* Time Selection */}
          {selectedDate && (
            <div>
              <Label className="text-base font-medium flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Select Time
              </Label>
              <div className="mt-2">
                {availableSlots.length === 0 ? (
                  <p className="text-muted-foreground text-sm">
                    No available slots for this date. Please choose another date.
                  </p>
                ) : (
                  <Select value={selectedTime} onValueChange={setSelectedTime}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a time slot" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableSlots.map((slot: any) => (
                        <SelectItem key={slot.id} value={slot.start_time}>
                          {slot.start_time} - {slot.end_time}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>
            </div>
          )}

          {/* Notes */}
          <div>
            <Label htmlFor="notes" className="text-base font-medium">
              Additional Notes (Optional)
            </Label>
            <Textarea
              id="notes"
              placeholder="Any special requirements or notes for the service provider..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="mt-2"
            />
          </div>

          {/* Booking Summary */}
          {selectedDate && selectedTime && (
            <div className="bg-servie/10 p-4 rounded-lg border border-servie/20">
              <h4 className="font-medium mb-2">Booking Summary</h4>
              <div className="space-y-1 text-sm">
                <div>Service: {service?.title}</div>
                <div>Date: {selectedDate.toLocaleDateString()}</div>
                <div>Time: {selectedTime}</div>
                <div>Price: ${service?.price}</div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button 
              onClick={handleBooking} 
              disabled={!selectedDate || !selectedTime || loading}
              className="flex-1 bg-servie hover:bg-servie-600"
            >
              {loading ? "Creating Booking..." : "Confirm Booking"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BookingModal;
