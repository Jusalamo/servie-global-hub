import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { CalendarIcon, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface PopoverDateTimePickerProps {
  selectedDate: Date | undefined;
  selectedTime: string;
  onDateChange: (date: Date | undefined) => void;
  onTimeChange: (time: string) => void;
  availableSlots?: Array<{ id: string; start_time: string; end_time: string }>;
  disabled?: boolean;
  minDate?: Date;
}

export const PopoverDateTimePicker = ({
  selectedDate,
  selectedTime,
  onDateChange,
  onTimeChange,
  availableSlots = [],
  disabled = false,
  minDate = new Date(),
}: PopoverDateTimePickerProps) => {
  const [dateOpen, setDateOpen] = useState(false);
  const [timeOpen, setTimeOpen] = useState(false);

  // Generate default time slots if none provided
  const defaultTimeSlots = [
    { id: '1', start_time: '09:00', end_time: '10:00' },
    { id: '2', start_time: '10:00', end_time: '11:00' },
    { id: '3', start_time: '11:00', end_time: '12:00' },
    { id: '4', start_time: '12:00', end_time: '13:00' },
    { id: '5', start_time: '14:00', end_time: '15:00' },
    { id: '6', start_time: '15:00', end_time: '16:00' },
    { id: '7', start_time: '16:00', end_time: '17:00' },
    { id: '8', start_time: '17:00', end_time: '18:00' },
  ];

  const slots = availableSlots.length > 0 ? availableSlots : defaultTimeSlots;

  return (
    <div className="flex flex-col sm:flex-row gap-3">
      {/* Date Picker */}
      <Popover open={dateOpen} onOpenChange={setDateOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            disabled={disabled}
            className={cn(
              'w-full sm:w-[200px] justify-start text-left font-normal',
              !selectedDate && 'text-muted-foreground'
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {selectedDate ? format(selectedDate, 'PPP') : <span>Pick a date</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={(date) => {
              onDateChange(date);
              setDateOpen(false);
            }}
            disabled={(date) => date < minDate}
            initialFocus
            className="p-3 pointer-events-auto"
          />
        </PopoverContent>
      </Popover>

      {/* Time Picker */}
      <Popover open={timeOpen} onOpenChange={setTimeOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            disabled={disabled || !selectedDate}
            className={cn(
              'w-full sm:w-[180px] justify-start text-left font-normal',
              !selectedTime && 'text-muted-foreground'
            )}
          >
            <Clock className="mr-2 h-4 w-4" />
            {selectedTime ? selectedTime : <span>Pick a time</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-2" align="start">
          <div className="grid gap-1 max-h-[300px] overflow-y-auto">
            {slots.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                No available slots
              </p>
            ) : (
              slots.map((slot) => (
                <Button
                  key={slot.id}
                  variant={selectedTime === slot.start_time ? 'default' : 'ghost'}
                  className={cn(
                    'w-full justify-start text-left',
                    selectedTime === slot.start_time && 'bg-servie hover:bg-servie-600'
                  )}
                  onClick={() => {
                    onTimeChange(slot.start_time);
                    setTimeOpen(false);
                  }}
                >
                  {slot.start_time} - {slot.end_time}
                </Button>
              ))
            )}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default PopoverDateTimePicker;
