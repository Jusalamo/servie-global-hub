
import { useState, useEffect } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Clock, Trash2 } from "lucide-react";
import { availabilityAPI, serviceAPI } from "@/services/supabaseAPI";
import { useToast } from "@/hooks/use-toast";

interface TimeSlot {
  id: string;
  start_time: string;
  end_time: string;
  is_available: boolean;
}

interface AvailabilityData {
  service_id?: string;
  date?: string;
  start_time?: string;
  end_time?: string;
  is_available?: boolean;
}

export default function AvailabilityManager() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [newStartTime, setNewStartTime] = useState("");
  const [newEndTime, setNewEndTime] = useState("");
  const [services, setServices] = useState<any[]>([]);
  const [selectedService, setSelectedService] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadServices();
  }, []);

  useEffect(() => {
    if (selectedDate && selectedService) {
      loadAvailability();
    }
  }, [selectedDate, selectedService]);

  const loadServices = async () => {
    try {
      const data = await serviceAPI.getMyServices();
      setServices(data);
      if (data.length > 0) {
        setSelectedService(data[0].id);
      }
    } catch (error) {
      console.error('Error loading services:', error);
      toast({
        title: "Error",
        description: "Failed to load services",
        variant: "destructive",
      });
    }
  };

  const loadAvailability = async () => {
    if (!selectedDate || !selectedService) return;

    try {
      const dateString = selectedDate.toISOString().split('T')[0];
      const data = await availabilityAPI.getAvailability(selectedService, dateString);
      
      // Transform notifications data to time slots with proper type checking
      const slots = data
        .filter(item => {
          if (!item.data || typeof item.data !== 'object') return false;
          const availData = item.data as AvailabilityData;
          return availData.service_id === selectedService && availData.date === dateString;
        })
        .map(item => {
          const availData = item.data as AvailabilityData;
          return {
            id: item.id,
            start_time: availData.start_time || "09:00",
            end_time: availData.end_time || "10:00",
            is_available: true
          };
        });
      
      setTimeSlots(slots);
    } catch (error) {
      console.error('Error loading availability:', error);
      toast({
        title: "Error",
        description: "Failed to load availability",
        variant: "destructive",
      });
    }
  };

  const addTimeSlot = async () => {
    if (!newStartTime || !newEndTime || !selectedDate || !selectedService) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const dateString = selectedDate.toISOString().split('T')[0];
      await availabilityAPI.createAvailability({
        service_id: selectedService,
        date: dateString,
        start_time: newStartTime,
        end_time: newEndTime,
        is_available: true
      });

      toast({
        title: "Success",
        description: "Time slot added successfully",
      });

      setNewStartTime("");
      setNewEndTime("");
      loadAvailability();
    } catch (error) {
      console.error('Error adding time slot:', error);
      toast({
        title: "Error",
        description: "Failed to add time slot",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const deleteTimeSlot = async (slotId: string) => {
    try {
      await availabilityAPI.deleteAvailability(slotId);
      toast({
        title: "Success",
        description: "Time slot deleted successfully",
      });
      loadAvailability();
    } catch (error) {
      console.error('Error deleting time slot:', error);
      toast({
        title: "Error",
        description: "Failed to delete time slot",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Availability Management</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Calendar */}
        <Card>
          <CardHeader>
            <CardTitle>Select Date</CardTitle>
            <CardDescription>Choose a date to manage availability</CardDescription>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="rounded-md border"
            />
          </CardContent>
        </Card>

        {/* Time Slots */}
        <Card>
          <CardHeader>
            <CardTitle>Time Slots</CardTitle>
            <CardDescription>
              {selectedDate ? `Availability for ${selectedDate.toDateString()}` : "Select a date to view slots"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Service Selection */}
            {services.length > 0 && (
              <div>
                <Label htmlFor="service-select">Service</Label>
                <select
                  id="service-select"
                  value={selectedService}
                  onChange={(e) => setSelectedService(e.target.value)}
                  className="w-full p-2 border rounded-md"
                >
                  {services.map((service) => (
                    <option key={service.id} value={service.id}>
                      {service.title}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Add New Time Slot */}
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="start-time">Start Time</Label>
                  <Input
                    id="start-time"
                    type="time"
                    value={newStartTime}
                    onChange={(e) => setNewStartTime(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="end-time">End Time</Label>
                  <Input
                    id="end-time"
                    type="time"
                    value={newEndTime}
                    onChange={(e) => setNewEndTime(e.target.value)}
                  />
                </div>
              </div>
              <Button onClick={addTimeSlot} disabled={loading} className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Add Time Slot
              </Button>
            </div>

            {/* Existing Time Slots */}
            <div className="space-y-2">
              <Label>Available Time Slots</Label>
              {timeSlots.length === 0 ? (
                <p className="text-sm text-muted-foreground">No time slots available for this date</p>
              ) : (
                <div className="space-y-2">
                  {timeSlots.map((slot) => (
                    <div key={slot.id} className="flex items-center justify-between p-3 border rounded-md">
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4" />
                        <span>{slot.start_time} - {slot.end_time}</span>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => deleteTimeSlot(slot.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
