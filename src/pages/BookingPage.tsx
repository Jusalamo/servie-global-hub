import { useState, useEffect } from "react";
import { useParams, useSearchParams, Link, useNavigate } from "react-router-dom";
import { Calendar as CalendarIcon, Clock, CreditCard, Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { format } from "date-fns";
import { PopoverDateTimePicker } from "@/components/booking/PopoverDateTimePicker";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useLocalization } from "@/components/LangCurrencySelector";
import { useAuth } from "@/context/AuthContext";

interface Service {
  id: string;
  title: string;
  description: string | null;
  price: number;
  category: string | null;
  location: string | null;
  response_time: string | null;
  provider_id: string;
  service_images?: { url: string; is_primary: boolean }[];
}

const BookingPage = () => {
  const { serviceId } = useParams<{ serviceId: string }>();
  const [searchParams] = useSearchParams();
  const packageId = searchParams.get("package") || "";
  const navigate = useNavigate();
  const { formatPrice } = useLocalization();
  const { user, isAuthenticated } = useAuth();
  
  const [service, setService] = useState<Service | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [time, setTime] = useState<string | undefined>(undefined);
  const [notes, setNotes] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("credit_card");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Fetch service from Supabase
  useEffect(() => {
    const fetchService = async () => {
      if (!serviceId) return;
      
      try {
        const { data, error } = await supabase
          .from('services')
          .select(`
            id,
            title,
            description,
            price,
            category,
            location,
            response_time,
            provider_id,
            service_images (url, is_primary)
          `)
          .eq('id', serviceId)
          .single();

        if (error) throw error;
        setService(data);
      } catch (error) {
        console.error('Error fetching service:', error);
        toast.error('Failed to load service details');
      } finally {
        setIsLoading(false);
      }
    };

    fetchService();
  }, [serviceId]);
  
  if (isLoading) {
    return (
      <div className="container max-w-[1200px] mx-auto py-16 px-4 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  if (!service) {
    return (
      <div className="container max-w-[1200px] mx-auto py-16 px-4 text-center">
        <h1 className="text-2xl md:text-3xl font-bold mb-4">Service Not Found</h1>
        <p className="mb-8 text-muted-foreground">The service you are looking for doesn't exist.</p>
        <Button asChild>
          <Link to="/categories">Browse Services</Link>
        </Button>
      </div>
    );
  }
  
  const handleBooking = async () => {
    if (!isAuthenticated || !user) {
      toast.error("Please sign in to book a service");
      navigate("/sign-in");
      return;
    }
    
    if (!date || !time) {
      toast.error("Please select a date and time for your booking");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Create booking in Supabase
      const { data: booking, error } = await supabase
        .from('bookings')
        .insert({
          service_id: service.id,
          client_id: user.id,
          booking_date: format(date, "yyyy-MM-dd"),
          booking_time: time,
          notes: notes || null,
          payment_method: paymentMethod,
          payment_status: 'pending',
          status: 'pending'
        })
        .select()
        .single();

      if (error) throw error;
      
      toast.success("Booking Successful!", {
        description: "Your service has been booked. You'll receive a confirmation shortly.",
      });
      
      // Redirect to confirmation page
      navigate("/booking-confirmation", { 
        state: { 
          booking: {
            ...booking,
            serviceName: service.title,
            price: service.price,
          },
          service
        } 
      });
    } catch (error) {
      console.error('Booking error:', error);
      toast.error("Failed to create booking. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Calculate service fee and total
  const serviceFee = service.price * 0.07;
  const total = service.price + serviceFee;
  
  // Get primary image
  const primaryImage = service.service_images?.find(img => img.is_primary)?.url 
    || service.service_images?.[0]?.url 
    || '/placeholder.svg';

  return (
    <div className="container max-w-[1200px] mx-auto py-6 md:py-8 px-4">
      <h1 className="text-xl md:text-2xl font-bold mb-6">Book Your Service</h1>
      
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Main Booking Form */}
        <div className="flex-1 space-y-4 md:space-y-6">
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-lg">Select Date & Time</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Choose your preferred date and time *</Label>
                <PopoverDateTimePicker
                  selectedDate={date}
                  selectedTime={time || ''}
                  onDateChange={setDate}
                  onTimeChange={setTime}
                  minDate={new Date()}
                />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-lg">Additional Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label>Notes for Service Provider</Label>
                <Textarea
                  placeholder="Add any specific requirements or questions here..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="min-h-[100px] resize-none"
                />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-lg">Payment Method</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div
                className={`flex items-center p-3 md:p-4 border rounded-lg cursor-pointer transition-colors ${
                  paymentMethod === "credit_card" ? "border-primary bg-primary/5" : "hover:bg-muted/50"
                }`}
                onClick={() => setPaymentMethod("credit_card")}
              >
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-sm md:text-base">Credit Card</h4>
                  <p className="text-xs md:text-sm text-muted-foreground truncate">Pay securely with your credit card</p>
                </div>
                <CreditCard className="h-5 w-5 text-muted-foreground flex-shrink-0 ml-2" />
                {paymentMethod === "credit_card" && (
                  <Check className="h-5 w-5 text-primary ml-2 flex-shrink-0" />
                )}
              </div>
              
              <div
                className={`flex items-center p-3 md:p-4 border rounded-lg cursor-pointer transition-colors ${
                  paymentMethod === "mobile_money" ? "border-primary bg-primary/5" : "hover:bg-muted/50"
                }`}
                onClick={() => setPaymentMethod("mobile_money")}
              >
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-sm md:text-base">Mobile Money</h4>
                  <p className="text-xs md:text-sm text-muted-foreground truncate">Pay with M-Pesa or other mobile money</p>
                </div>
                <svg className="h-5 w-5 text-muted-foreground flex-shrink-0 ml-2" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M17 15.5a1.5 1.5 0 0 1 0 3h-2.5a1.5 1.5 0 0 1 0-3zm0 1h-2.5a.5.5 0 1 0 0 1h2.5a.5.5 0 1 0 0-1z" />
                  <path fill="currentColor" d="M7 16.25c0-.14.11-.25.25-.25h1.5c.14 0 .25.11.25.25v1.5c0 .14-.11.25-.25.25h-1.5C7.11 18 7 17.89 7 17.75zm3 0c0-.14.11-.25.25-.25h1.5c.14 0 .25.11.25.25v1.5c0 .14-.11.25-.25.25h-1.5c-.14 0-.25-.11-.25-.25z" />
                  <path fill="currentColor" fillRule="evenodd" d="M7 2a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2zm0 1h10a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z" clipRule="evenodd" />
                </svg>
                {paymentMethod === "mobile_money" && (
                  <Check className="h-5 w-5 text-primary ml-2 flex-shrink-0" />
                )}
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Booking Summary - Sticky on desktop */}
        <div className="w-full lg:w-80">
          <div className="lg:sticky lg:top-24">
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="text-lg">Booking Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-3">
                  <img
                    src={primaryImage}
                    alt={service.title}
                    className="w-16 h-16 object-cover rounded-md flex-shrink-0"
                  />
                  <div className="min-w-0">
                    <h4 className="font-medium text-sm line-clamp-2">{service.title}</h4>
                    <p className="text-xs text-muted-foreground">{service.category}</p>
                  </div>
                </div>
                
                <div className="space-y-2 text-sm">
                  {date && time && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Appointment:</span>
                      <span className="font-medium text-right">{format(date, "MMM d, yyyy")} at {time}</span>
                    </div>
                  )}
                  {service.location && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Location:</span>
                      <span>{service.location}</span>
                    </div>
                  )}
                </div>
                
                <Separator />
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Service price</span>
                    <span>{formatPrice(service.price)}</span>
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
              <CardFooter className="pt-0">
                <Button 
                  className="w-full h-11" 
                  onClick={handleBooking}
                  disabled={isSubmitting || !date || !time}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
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
