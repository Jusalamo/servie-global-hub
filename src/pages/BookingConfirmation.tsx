
import { useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { CheckCircle, Calendar, MapPin, Clock } from "lucide-react";
import { format } from "date-fns";
import { useLocalization } from "@/components/LangCurrencySelector";

export default function BookingConfirmation() {
  const location = useLocation();
  const navigate = useNavigate();
  const { formatPrice } = useLocalization();

  // Check if we have booking data in the location state
  const { booking, service, selectedPackage } = location.state || {};

  useEffect(() => {
    // If no booking data, redirect to homepage
    if (!booking) {
      navigate("/");
    }
  }, [booking, navigate]);

  if (!booking) {
    return null; // Will redirect in the useEffect
  }

  return (
    <div className="container mx-auto py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold mb-2">Booking Confirmed!</h1>
            <p className="text-lg text-muted-foreground">
              Your booking has been successfully processed.
            </p>
          </div>

          <Card className="mb-8">
            <CardContent className="pt-6">
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold mb-4">Booking Details</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">Booking ID</p>
                      <p className="font-medium">{booking.id}</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">Booking Date</p>
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                        <p className="font-medium">
                          {format(new Date(booking.date), "MMMM d, yyyy")} at {booking.time}
                        </p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">Service</p>
                      <p className="font-medium">{booking.serviceName}</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">Package</p>
                      <p className="font-medium">{booking.packageName}</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">Status</p>
                      <div className="flex items-center">
                        <span className="inline-block w-2 h-2 rounded-full bg-green-500 mr-2"></span>
                        <p className="font-medium capitalize">{booking.status}</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">Payment Method</p>
                      <p className="font-medium">
                        {booking.paymentMethod === "credit_card" ? "Credit Card" : "Mobile Money"}
                      </p>
                    </div>
                  </div>
                </div>

                {service && (
                  <div>
                    <h2 className="text-xl font-semibold mb-4">Service Information</h2>
                    <div className="flex gap-4">
                      <img
                        src={service.imageUrl}
                        alt={service.title}
                        className="w-24 h-24 object-cover rounded-md"
                      />
                      <div>
                        <h3 className="font-medium text-lg">{service.title}</h3>
                        <p className="text-muted-foreground">{service.category}</p>
                        <div className="flex items-center mt-2 text-sm">
                          <MapPin className="h-4 w-4 mr-1 text-muted-foreground" />
                          <span>{service.location}</span>
                        </div>
                        <div className="flex items-center mt-1 text-sm">
                          <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
                          <span>Delivery: {selectedPackage?.delivery}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div>
                  <h2 className="text-xl font-semibold mb-2">Payment Summary</h2>
                  <div className="bg-muted/30 p-4 rounded-md">
                    <div className="flex justify-between mb-2">
                      <span>Service fee</span>
                      <span>{formatPrice(booking.price * 0.07)}</span>
                    </div>
                    <div className="flex justify-between mb-2">
                      <span>Package price</span>
                      <span>{formatPrice(booking.price)}</span>
                    </div>
                    <div className="flex justify-between font-semibold text-lg pt-2 border-t">
                      <span>Total</span>
                      <span>{formatPrice(booking.price * 1.07)}</span>
                    </div>
                  </div>
                </div>

                {booking.notes && (
                  <div>
                    <h2 className="text-xl font-semibold mb-2">Notes</h2>
                    <p className="bg-muted/30 p-4 rounded-md">{booking.notes}</p>
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex flex-col sm:flex-row gap-2 justify-center pt-2 pb-6">
              <Button asChild>
                <Link to="/dashboard">Go to Dashboard</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link to="/categories">Browse More Services</Link>
              </Button>
            </CardFooter>
          </Card>

          <div className="text-center">
            <p className="text-muted-foreground mb-2">
              A confirmation email has been sent to your registered email address.
            </p>
            <p className="text-muted-foreground">
              If you have any questions, contact our support team.
            </p>
        </div>
      </div>
    </div>
  );
}
