import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { bookingAPI, availabilityAPI } from "@/services/supabaseAPI";
import { useAuth } from "@/context/AuthContext";
import { CalendarDays, MapPin } from "lucide-react";
import { PopoverDateTimePicker } from "@/components/booking/PopoverDateTimePicker";

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
  const [availableSlots, setAvailableSlots] = useState<Array<{ id: string; start_time: string; end_time: string }>>([]);
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
      // Transform slots to expected format
      const formattedSlots = (slots || []).map((slot: any, index: number) => ({
        id: slot.id || String(index),
        start_time: slot.start_time || slot.time || '',
        end_time: slot.end_time || '',
      })).filter((slot: any) => slot.start_time);
      setAvailableSlots(formattedSlots);
    } catch (error) {
      console.error("Failed to load available slots:", error);
      setAvailableSlots([]);
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
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CalendarDays className="w-5 h-5" />
            Book {service?.title}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-5 py-2">
          {/* Service Info */}
          <div className="bg-muted/50 p-4 rounded-lg">
            <h3 className="font-semibold">{service?.title}</h3>
            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{service?.description}</p>
            <div className="flex flex-wrap items-center gap-4 mt-2 text-sm">
              <span className="font-medium">Price: ${service?.price}</span>
              <span className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                {service?.location || 'Remote'}
              </span>
            </div>
          </div>

          {/* Date & Time Selection with Popover Pickers */}
          <div className="space-y-3">
            <Label className="text-base font-medium">Select Date & Time</Label>
            <PopoverDateTimePicker
              selectedDate={selectedDate}
              selectedTime={selectedTime}
              onDateChange={setSelectedDate}
              onTimeChange={setSelectedTime}
              availableSlots={availableSlots}
              minDate={new Date()}
            />
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes" className="text-base font-medium">
              Additional Notes (Optional)
            </Label>
            <Textarea
              id="notes"
              placeholder="Any special requirements..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
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
                <div className="font-semibold">Price: ${service?.price}</div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <Button 
              variant="outline" 
              onClick={onClose} 
              className="flex-1 min-h-[48px]"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleBooking} 
              disabled={!selectedDate || !selectedTime || loading}
              className="flex-1 bg-servie hover:bg-servie-600 min-h-[48px]"
            >
              {loading ? "Creating..." : "Confirm Booking"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BookingModal;
