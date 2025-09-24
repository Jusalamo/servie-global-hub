
import { useState } from "react";
import { useParams, useSearchParams, Link, useNavigate } from "react-router-dom";
import { Calendar as CalendarIcon, Clock, ChevronDown, CreditCard, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { format } from "date-fns";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { services } from "@/data/mockData";
import { toast } from "sonner";
import { useLocalization } from "@/components/LangCurrencySelector";

const timeSlots = [
  "09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", 
  "01:00 PM", "02:00 PM", "03:00 PM", "04:00 PM", "05:00 PM"
];

const BookingPage = () => {
  const { serviceId } = useParams<{ serviceId: string }>();
  const [searchParams] = useSearchParams();
  const packageId = searchParams.get("package") || "";
  const navigate = useNavigate();
  const { formatPrice } = useLocalization();
  
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [time, setTime] = useState<string | undefined>(undefined);
  const [notes, setNotes] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("credit_card");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Find the service and package based on URL parameters
  const service = services.find(s => s.id === serviceId);
  const selectedPackage = service?.packages.find(p => p.id === packageId) || service?.packages[0];
  
  if (!service || !selectedPackage) {
    return (
      <div className="container mx-auto py-16 px-4 text-center">
        <h1 className="text-3xl font-bold mb-4">Service Not Found</h1>
        <p className="mb-8">The service or package you are looking for doesn't exist.</p>
        <Button asChild>
          <Link to="/categories">Browse Services</Link>
        </Button>
      </div>
    );
  }
  
  const handleBooking = () => {
    if (!date || !time) {
      toast.error("Please select a date and time for your booking");
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      // Store booking in local storage for demo purposes
      const bookings = JSON.parse(localStorage.getItem('bookings') || '[]');
      const newBooking = {
        id: `booking-${Date.now()}`,
        serviceId: service.id,
        serviceName: service.title,
        packageName: selectedPackage.name,
        price: selectedPackage.price,
        date: format(date, "yyyy-MM-dd"),
        time,
        notes,
        paymentMethod,
        status: 'confirmed',
        createdAt: new Date().toISOString()
      };
      
      bookings.push(newBooking);
      localStorage.setItem('bookings', JSON.stringify(bookings));
      
      toast.success("Booking Successful!", {
        description: "Your service has been booked successfully. You'll receive a confirmation email shortly.",
      });
      
      setIsSubmitting(false);
      
      // Redirect to confirmation page
      navigate("/booking-confirmation", { 
        state: { 
          booking: newBooking,
          service,
          selectedPackage
        } 
      });
    }, 1500);
  };

  // Calculate service fee and total
  const serviceFee = selectedPackage.price * 0.07;
  const total = selectedPackage.price + serviceFee;

  return (
    <div className="container mx-auto py-8 px-4">
        <h1 className="text-2xl md:text-3xl font-bold mb-6">Book Your Service</h1>
        
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Booking Form */}
          <div className="flex-1">
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Select Date & Time</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <label className="font-medium">Date</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? format(date, "PPP") : "Select a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        initialFocus
                        disabled={(date) => date < new Date()}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                
                <div className="space-y-2">
                  <label className="font-medium">Time</label>
                  <Select onValueChange={setTime}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a time slot" />
                    </SelectTrigger>
                    <SelectContent>
                      {timeSlots.map((slot) => (
                        <SelectItem key={slot} value={slot}>
                          {slot}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
            
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Additional Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <label className="font-medium">Notes for Service Provider</label>
                  <Textarea
                    placeholder="Add any specific requirements or questions here..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="min-h-[120px]"
                  />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Payment Method</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div
                    className={`flex items-center p-4 border rounded-lg cursor-pointer ${
                      paymentMethod === "credit_card" ? "border-servie bg-muted/30" : ""
                    }`}
                    onClick={() => setPaymentMethod("credit_card")}
                  >
                    <div className="flex-1">
                      <h4 className="font-medium">Credit Card</h4>
                      <p className="text-sm text-muted-foreground">Pay securely with your credit card</p>
                    </div>
                    <CreditCard className="h-5 w-5 text-muted-foreground" />
                    {paymentMethod === "credit_card" && (
                      <Check className="h-5 w-5 text-servie ml-2" />
                    )}
                  </div>
                  
                  <div
                    className={`flex items-center p-4 border rounded-lg cursor-pointer ${
                      paymentMethod === "mobile_money" ? "border-servie bg-muted/30" : ""
                    }`}
                    onClick={() => setPaymentMethod("mobile_money")}
                  >
                    <div className="flex-1">
                      <h4 className="font-medium">Mobile Money</h4>
                      <p className="text-sm text-muted-foreground">Pay with M-Pesa or other mobile money services</p>
                    </div>
                    <svg className="h-5 w-5 text-muted-foreground" viewBox="0 0 24 24">
                      <path fill="currentColor" d="M17 15.5a1.5 1.5 0 0 1 0 3h-2.5a1.5 1.5 0 0 1 0-3zm0 1h-2.5a.5.5 0 1 0 0 1h2.5a.5.5 0 1 0 0-1z" />
                      <path fill="currentColor" d="M7 16.25c0-.14.11-.25.25-.25h1.5c.14 0 .25.11.25.25v1.5c0 .14-.11.25-.25.25h-1.5C7.11 18 7 17.89 7 17.75zm3 0c0-.14.11-.25.25-.25h1.5c.14 0 .25.11.25.25v1.5c0 .14-.11.25-.25.25h-1.5c-.14 0-.25-.11-.25-.25z" />
                      <path fill="currentColor" fillRule="evenodd" d="M7 2a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2zm0 1h10a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z" clipRule="evenodd" />
                      <path fill="currentColor" d="M12 4.5a1.5 1.5 0 1 1 0 3a1.5 1.5 0 0 1 0-3M12 9a3 3 0 1 0 0-6a3 3 0 0 0 0 6" />
                    </svg>
                    {paymentMethod === "mobile_money" && (
                      <Check className="h-5 w-5 text-servie ml-2" />
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Booking Summary */}
          <div className="w-full lg:w-80">
            <div className="sticky top-24">
              <Card>
                <CardHeader>
                  <CardTitle>Booking Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-4">
                    <img
                      src={service.imageUrl}
                      alt={service.title}
                      className="w-20 h-20 object-cover rounded-md"
                    />
                    <div>
                      <h4 className="font-medium">{service.title}</h4>
                      <p className="text-sm text-muted-foreground">{service.category}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Package:</span>
                      <span className="font-medium">{selectedPackage.name}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        <span>Delivery time:</span>
                      </div>
                      <span>{selectedPackage.delivery}</span>
                    </div>
                    {date && time && (
                      <div className="flex justify-between">
                        <span>Appointment:</span>
                        <span>{format(date, "MMM d, yyyy")} at {time}</span>
                      </div>
                    )}
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Package price</span>
                      <span>{formatPrice(selectedPackage.price)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Service fee</span>
                      <span>{formatPrice(serviceFee)}</span>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex justify-between font-bold">
                    <span>Total</span>
                    <span>{formatPrice(total)}</span>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    className="w-full bg-servie hover:bg-servie-600" 
                    onClick={handleBooking}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <span className="mr-2">Processing...</span>
                        <span className="animate-spin">⏳</span>
                      </>
                    ) : (
                      "Confirm & Pay"
                    )}
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </div>
    </div>
  );
};

export default BookingPage;
