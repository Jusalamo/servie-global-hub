
import { useState, useEffect } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { availabilityAPI, serviceAPI } from "@/services/supabaseAPI";
import { Clock, Plus, Trash2 } from "lucide-react";

const AvailabilityManager = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [services, setServices] = useState([]);
  const [availability, setAvailability] = useState([]);
  const [selectedService, setSelectedService] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadServices();
    loadAvailability();
  }, []);

  const loadServices = async () => {
    try {
      const data = await serviceAPI.getMyServices();
      setServices(data.filter(s => s.status === 'active'));
    } catch (error) {
      console.error("Failed to load services:", error);
    }
  };

  const loadAvailability = async () => {
    try {
      const data = await availabilityAPI.getMyAvailability();
      setAvailability(data);
    } catch (error) {
      console.error("Failed to load availability:", error);
    }
  };

  const addTimeSlot = async () => {
    if (!selectedDate || !selectedService || !startTime || !endTime) {
      toast.error("Please fill all fields");
      return;
    }

    if (startTime >= endTime) {
      toast.error("End time must be after start time");
      return;
    }

    setLoading(true);
    try {
      await availabilityAPI.setAvailability({
        service_id: selectedService,
        available_date: selectedDate.toISOString().split('T')[0],
        start_time: startTime,
        end_time: endTime,
        is_available: true
      });
      
      toast.success("Availability added successfully");
      loadAvailability();
      setStartTime("");
      setEndTime("");
    } catch (error) {
      toast.error("Failed to add availability");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const removeTimeSlot = async (id: string) => {
    try {
      await availabilityAPI.setAvailability({
        id,
        is_available: false
      });
      toast.success("Availability removed");
      loadAvailability();
    } catch (error) {
      toast.error("Failed to remove availability");
      console.error(error);
    }
  };

  const getAvailabilityForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return availability.filter(a => a.available_date === dateStr && a.is_available);
  };

  const selectedDateAvailability = selectedDate ? getAvailabilityForDate(selectedDate) : [];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Manage Availability</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
              disabled={(date) => date < new Date()}
            />
          </CardContent>
        </Card>

        {/* Add Availability */}
        <Card>
          <CardHeader>
            <CardTitle>Add Time Slot</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="service">Service</Label>
              <Select value={selectedService} onValueChange={setSelectedService}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a service" />
                </SelectTrigger>
                <SelectContent>
                  {services.map((service: any) => (
                    <SelectItem key={service.id} value={service.id}>
                      {service.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="startTime">Start Time</Label>
                <Input
                  id="startTime"
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="endTime">End Time</Label>
                <Input
                  id="endTime"
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                />
              </div>
            </div>

            <Button 
              onClick={addTimeSlot} 
              disabled={loading}
              className="w-full bg-servie hover:bg-servie-600"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Time Slot
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Current Availability */}
      {selectedDate && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Availability for {selectedDate.toLocaleDateString()}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {selectedDateAvailability.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                No availability set for this date
              </p>
            ) : (
              <div className="space-y-2">
                {selectedDateAvailability.map((slot: any) => (
                  <div key={slot.id} className="flex items-center justify-between p-3 border rounded">
                    <div>
                      <span className="font-medium">{slot.services?.title}</span>
                      <span className="text-muted-foreground ml-2">
                        {slot.start_time} - {slot.end_time}
                      </span>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => removeTimeSlot(slot.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AvailabilityManager;
