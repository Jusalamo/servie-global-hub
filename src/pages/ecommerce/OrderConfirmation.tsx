
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CheckCircle, ShoppingBag, Truck, Calendar } from "lucide-react";

export default function OrderConfirmation() {
  const navigate = useNavigate();
  const [orderNumber, setOrderNumber] = useState("");
  const [orderDate, setOrderDate] = useState("");
  const [estimatedDelivery, setEstimatedDelivery] = useState("");

  useEffect(() => {
    // Generate a random order number
    const randomOrderId = Math.floor(10000000 + Math.random() * 90000000).toString();
    setOrderNumber(`ORD-${randomOrderId}`);
    
    // Get current date for order date
    const now = new Date();
    setOrderDate(now.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric"
    }));
    
    // Calculate estimated delivery date (5-7 days from now)
    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + 5 + Math.floor(Math.random() * 3));
    setEstimatedDelivery(deliveryDate.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric"
    }));
    
    // If user navigates directly to this page without checkout flow, redirect after a short delay
    const fromCheckout = sessionStorage.getItem("fromCheckout");
    if (!fromCheckout) {
      const timeoutId = setTimeout(() => {
        navigate("/shop");
      }, 5000);
      return () => clearTimeout(timeoutId);
    } else {
      sessionStorage.removeItem("fromCheckout");
    }
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 py-12">
        <div className="container px-4">
          <div className="max-w-3xl mx-auto text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 text-green-600 mb-4">
              <CheckCircle className="h-8 w-8" />
            </div>
            <h1 className="text-3xl font-bold mb-2">Order Confirmed!</h1>
            <p className="text-muted-foreground">
              Thank you for your purchase. We've received your order and are processing it now.
            </p>
          </div>
          
          <Card className="max-w-3xl mx-auto mb-8">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row justify-between mb-6">
                <div>
                  <p className="text-sm text-muted-foreground">Order Number</p>
                  <p className="font-medium">{orderNumber}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Order Date</p>
                  <p className="font-medium">{orderDate}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Estimated Delivery</p>
                  <p className="font-medium">{estimatedDelivery}</p>
                </div>
              </div>
              
              <Separator className="mb-6" />
              
              <div className="space-y-4 mb-6">
                <h3 className="font-semibold">Order Details</h3>
                
                <div className="space-y-3">
                  {/* Mock ordered items */}
                  {[
                    { id: "item1", name: "Wireless Headphones", price: 249.99, quantity: 1, image: "/placeholder.svg" },
                    { id: "item2", name: "Bluetooth Speaker", price: 89.99, quantity: 2, image: "/placeholder.svg" }
                  ].map(item => (
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
              </div>
              
              <Separator className="mb-6" />
              
              <div className="space-y-4">
                <h3 className="font-semibold">Order Summary</h3>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>$429.97</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>$4.99</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax</span>
                    <span>$34.40</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-semibold">
                    <span>Total</span>
                    <span>$469.36</span>
                  </div>
                </div>
              </div>
              
              <Separator className="my-6" />
              
              <div className="space-y-4">
                <h3 className="font-semibold">Shipping Information</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Shipping Address</p>
                    <p>John Doe</p>
                    <p>123 Main Street</p>
                    <p>Apt 4B</p>
                    <p>New York, NY 10001</p>
                    <p>United States</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Shipping Method</p>
                    <p>Standard Shipping (3-5 business days)</p>
                  </div>
                </div>
              </div>
              
              <Separator className="my-6" />
              
              <div className="space-y-4">
                <h3 className="font-semibold">Payment Information</h3>
                
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Payment Method</p>
                  <p>Credit Card (ending in 4242)</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 border rounded-lg text-center">
                <ShoppingBag className="h-8 w-8 mx-auto text-servie mb-2" />
                <h3 className="font-semibold mb-1">Order Processing</h3>
                <p className="text-sm text-muted-foreground">Your order is being prepared for shipment.</p>
              </div>
              
              <div className="p-4 border rounded-lg text-center">
                <Truck className="h-8 w-8 mx-auto text-servie mb-2" />
                <h3 className="font-semibold mb-1">Shipping Updates</h3>
                <p className="text-sm text-muted-foreground">You'll receive email updates about your shipment.</p>
              </div>
              
              <div className="p-4 border rounded-lg text-center">
                <Calendar className="h-8 w-8 mx-auto text-servie mb-2" />
                <h3 className="font-semibold mb-1">Estimated Delivery</h3>
                <p className="text-sm text-muted-foreground">Your order should arrive by {estimatedDelivery}.</p>
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row gap-4 justify-center">
              <Button asChild className="bg-servie hover:bg-servie-600">
                <Link to="/dashboard/client?tab=orders">View My Orders</Link>
              </Button>
              <Button asChild variant="outline">
                <Link to="/shop">Continue Shopping</Link>
              </Button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
