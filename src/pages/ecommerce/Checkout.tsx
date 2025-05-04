
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { ShoppingCart, CreditCard, User, MapPin, ChevronLeft, Check } from "lucide-react";
import PaymentMethodSelector from "@/components/PaymentMethodSelector";
import { useAuth } from "@/context/AuthContext";

// Mock cart items
const cartItems = [
  {
    id: "item1",
    name: "Wireless Headphones",
    price: 249.99,
    quantity: 1,
    image: "/placeholder.svg"
  },
  {
    id: "item2",
    name: "Bluetooth Speaker",
    price: 89.99,
    quantity: 2,
    image: "/placeholder.svg"
  }
];

export default function Checkout() {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const [activeStep, setActiveStep] = useState("information");
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [orderProcessing, setOrderProcessing] = useState(false);
  const [formData, setFormData] = useState({
    email: user?.email || "",
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "United States",
    phone: "",
    saveInfo: true,
    shippingMethod: "standard"
  });

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = formData.shippingMethod === "express" ? 14.99 : 4.99;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value
    });
  };

  const handleNextStep = () => {
    if (activeStep === "information") {
      // Validate information
      if (!formData.email || !formData.firstName || !formData.lastName || !formData.address || !formData.city || !formData.state || !formData.zipCode) {
        toast.error("Please fill in all required fields");
        return;
      }
      setActiveStep("shipping");
    } else if (activeStep === "shipping") {
      setActiveStep("payment");
    }
  };

  const handlePrevStep = () => {
    if (activeStep === "shipping") {
      setActiveStep("information");
    } else if (activeStep === "payment") {
      setActiveStep("shipping");
    }
  };

  const handlePaymentSelect = (method: string) => {
    setPaymentMethod(method);
  };

  const handleCompleteOrder = async () => {
    setOrderProcessing(true);
    
    try {
      // In a real app, this would be an API call to process the payment
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast.success("Payment successful! Your order has been placed.");
      navigate("/order-confirmation");
    } catch (error) {
      toast.error("Payment failed. Please try again.");
      console.error("Payment error:", error);
    } finally {
      setOrderProcessing(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 py-8">
        <div className="container px-4">
          <div className="max-w-4xl mx-auto">
            {/* Checkout header */}
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-2xl font-bold">Checkout</h1>
              <button
                onClick={() => navigate("/cart")}
                className="flex items-center text-sm text-muted-foreground hover:text-foreground"
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Return to cart
              </button>
            </div>
            
            {/* Checkout progress */}
            <div className="mb-8">
              <div className="flex justify-between">
                <div className="flex items-center">
                  <div className={`rounded-full w-8 h-8 flex items-center justify-center ${
                    activeStep === "information" || activeStep === "shipping" || activeStep === "payment"
                      ? "bg-servie text-white"
                      : "bg-muted text-muted-foreground"
                  }`}>
                    {activeStep === "shipping" || activeStep === "payment" ? <Check className="h-5 w-5" /> : "1"}
                  </div>
                  <span className="ml-2 font-medium">Information</span>
                  <div className="mx-2 h-px w-12 bg-muted-foreground" />
                </div>
                <div className="flex items-center">
                  <div className={`rounded-full w-8 h-8 flex items-center justify-center ${
                    activeStep === "shipping" || activeStep === "payment"
                      ? "bg-servie text-white"
                      : "bg-muted text-muted-foreground"
                  }`}>
                    {activeStep === "payment" ? <Check className="h-5 w-5" /> : "2"}
                  </div>
                  <span className="ml-2 font-medium">Shipping</span>
                  <div className="mx-2 h-px w-12 bg-muted-foreground" />
                </div>
                <div className="flex items-center">
                  <div className={`rounded-full w-8 h-8 flex items-center justify-center ${
                    activeStep === "payment"
                      ? "bg-servie text-white"
                      : "bg-muted text-muted-foreground"
                  }`}>
                    3
                  </div>
                  <span className="ml-2 font-medium">Payment</span>
                </div>
              </div>
            </div>
            
            {/* Checkout content */}
            <div className="flex flex-col lg:flex-row gap-8">
              <div className="flex-1">
                {/* Information step */}
                {activeStep === "information" && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-lg font-semibold mb-4">Contact Information</h2>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="email">Email address</Label>
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h2 className="text-lg font-semibold mb-4">Shipping Address</h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="firstName">First name</Label>
                          <Input
                            id="firstName"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="lastName">Last name</Label>
                          <Input
                            id="lastName"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                        <div className="md:col-span-2">
                          <Label htmlFor="address">Address</Label>
                          <Input
                            id="address"
                            name="address"
                            value={formData.address}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="city">City</Label>
                          <Input
                            id="city"
                            name="city"
                            value={formData.city}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="state">State</Label>
                          <Input
                            id="state"
                            name="state"
                            value={formData.state}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="zipCode">ZIP code</Label>
                          <Input
                            id="zipCode"
                            name="zipCode"
                            value={formData.zipCode}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="country">Country</Label>
                          <Input
                            id="country"
                            name="country"
                            value={formData.country}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                        <div className="md:col-span-2">
                          <Label htmlFor="phone">Phone (optional)</Label>
                          <Input
                            id="phone"
                            name="phone"
                            type="tel"
                            value={formData.phone}
                            onChange={handleInputChange}
                          />
                        </div>
                      </div>
                      
                      <div className="mt-4">
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id="saveInfo"
                            name="saveInfo"
                            checked={formData.saveInfo}
                            onChange={handleInputChange}
                            className="rounded border-gray-300"
                          />
                          <Label htmlFor="saveInfo">Save this information for next time</Label>
                        </div>
                      </div>
                    </div>
                    
                    <Button onClick={handleNextStep} className="bg-servie hover:bg-servie-600">
                      Continue to Shipping
                    </Button>
                  </div>
                )}
                
                {/* Shipping step */}
                {activeStep === "shipping" && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-lg font-semibold mb-4">Shipping Method</h2>
                      <RadioGroup value={formData.shippingMethod} onValueChange={(value) => setFormData({...formData, shippingMethod: value})} className="space-y-4">
                        <div className="flex items-center justify-between border rounded-lg p-4">
                          <div className="flex items-center">
                            <RadioGroupItem value="standard" id="standard" />
                            <Label htmlFor="standard" className="ml-2 font-medium">Standard Shipping</Label>
                          </div>
                          <span className="font-semibold">$4.99</span>
                        </div>
                        <div className="flex items-center justify-between border rounded-lg p-4">
                          <div className="flex items-center">
                            <RadioGroupItem value="express" id="express" />
                            <Label htmlFor="express" className="ml-2 font-medium">Express Shipping</Label>
                          </div>
                          <span className="font-semibold">$14.99</span>
                        </div>
                      </RadioGroup>
                    </div>
                    
                    <div className="flex justify-between">
                      <Button variant="outline" onClick={handlePrevStep}>
                        Back to Information
                      </Button>
                      <Button onClick={handleNextStep} className="bg-servie hover:bg-servie-600">
                        Continue to Payment
                      </Button>
                    </div>
                  </div>
                )}
                
                {/* Payment step */}
                {activeStep === "payment" && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-lg font-semibold mb-4">Payment Method</h2>
                      <PaymentMethodSelector onSelect={handlePaymentSelect} selectedMethod={paymentMethod} />
                    </div>
                    
                    <div className="flex justify-between">
                      <Button variant="outline" onClick={handlePrevStep}>
                        Back to Shipping
                      </Button>
                      <Button 
                        onClick={handleCompleteOrder} 
                        className="bg-servie hover:bg-servie-600"
                        disabled={orderProcessing}
                      >
                        {orderProcessing ? "Processing..." : "Complete Order"}
                      </Button>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Order summary */}
              <div className="w-full lg:w-96">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <ShoppingCart className="mr-2 h-5 w-5" />
                      Order Summary
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {/* Cart items */}
                      <div className="space-y-3">
                        {cartItems.map(item => (
                          <div key={item.id} className="flex items-center">
                            <div className="h-16 w-16 rounded bg-muted flex-shrink-0 mr-4">
                              <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                            </div>
                            <div className="flex-1">
                              <p className="font-medium">{item.name}</p>
                              <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                            </div>
                            <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                          </div>
                        ))}
                      </div>
                      
                      <Separator />
                      
                      {/* Order calculations */}
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>Subtotal</span>
                          <span>${subtotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Shipping</span>
                          <span>${shipping.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Tax (8%)</span>
                          <span>${tax.toFixed(2)}</span>
                        </div>
                        <Separator />
                        <div className="flex justify-between font-semibold">
                          <span>Total</span>
                          <span>${total.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
