
import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Check, ShoppingBag, Calendar, ArrowRight } from "lucide-react";
import { useCart } from "@/context/CartContext";

const OrderConfirmation = () => {
  const navigate = useNavigate();
  const { cartItems, clearCart, cartTotal } = useCart();
  const [orderNumber, setOrderNumber] = useState("");
  const [orderDate, setOrderDate] = useState("");
  const [orderItems, setOrderItems] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Check if user came from checkout
  useEffect(() => {
    const fromCheckout = sessionStorage.getItem("fromCheckout");
    
    if (!fromCheckout) {
      // If user didn't come from checkout, redirect to home
      navigate("/");
      return;
    }
    
    // Clear the flag
    sessionStorage.removeItem("fromCheckout");
    
    // Save order items before clearing cart
    setOrderItems(cartItems);
    
    // Generate random order number
    const randomOrderNumber = "ORD-" + Math.floor(100000 + Math.random() * 900000);
    setOrderNumber(randomOrderNumber);
    
    // Set order date to current date
    setOrderDate(new Date().toLocaleDateString('en-US', {
      year: 'numeric', 
      month: 'long', 
      day: 'numeric'
    }));
    
    // Simulate processing time
    setTimeout(() => {
      // Clear cart after order is processed
      clearCart();
      setIsLoading(false);
      
      // Store order in local storage for history (in a real app this would be in a database)
      const orders = JSON.parse(localStorage.getItem("orders") || "[]");
      orders.push({
        id: randomOrderNumber,
        date: new Date().toISOString(),
        items: cartItems,
        total: cartTotal,
        status: "confirmed"
      });
      localStorage.setItem("orders", JSON.stringify(orders));
      
      // Send notifications (simulated)
      console.log("Order notifications would be sent to providers:", 
        cartItems.map(item => item.providerId)
      );
    }, 1500);
  }, [navigate, cartItems, clearCart, cartTotal]);

  const subtotal = orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = subtotal > 100 ? 0 : 10;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  return (
    <div className="py-10 bg-gray-50">
        <div className="container px-4 max-w-4xl mx-auto">
          {isLoading ? (
            <Card className="text-center py-12">
              <CardContent className="space-y-4">
                <div className="flex justify-center">
                  <div className="h-16 w-16 rounded-full bg-servie/10 flex items-center justify-center animate-pulse">
                    <ShoppingBag className="h-8 w-8 text-servie" />
                  </div>
                </div>
                <h2 className="text-2xl font-semibold">Processing your order...</h2>
                <p className="text-muted-foreground">
                  Please wait while we confirm your purchase
                </p>
              </CardContent>
            </Card>
          ) : (
            <>
              <div className="text-center mb-10">
                <div className="flex justify-center mb-4">
                  <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center">
                    <Check className="h-8 w-8 text-green-600" />
                  </div>
                </div>
                <h1 className="text-3xl font-bold mb-2">Order Confirmed!</h1>
                <p className="text-muted-foreground mb-2">
                  Thank you for your purchase. We've received your order.
                </p>
                <p className="text-sm">
                  Order #{orderNumber} • {orderDate}
                </p>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                  <Card>
                    <CardContent className="p-6 space-y-6">
                      <h2 className="text-xl font-semibold mb-4">Order Details</h2>
                      
                      {orderItems.length > 0 ? (
                        <div className="space-y-4">
                          {orderItems.map((item, index) => (
                            <div key={item.id} className="flex gap-4">
                              <div className="h-16 w-16 rounded-md overflow-hidden flex-shrink-0">
                                <img 
                                  src={item.image} 
                                  alt={item.name} 
                                  className="h-full w-full object-cover"
                                />
                              </div>
                              <div className="flex-1">
                                <div className="font-medium">{item.name}</div>
                                <div className="text-sm text-muted-foreground">
                                  Quantity: {item.quantity}
                                </div>
                                <div className="text-sm text-muted-foreground">
                                  Sold by: {item.providerName}
                                </div>
                              </div>
                              <div className="font-medium">
                                ${(item.price * item.quantity).toFixed(2)}
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p>No items in your order.</p>
                      )}
                      
                      <Separator />
                      
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Subtotal</span>
                          <span>${subtotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Shipping</span>
                          <span>{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Tax</span>
                          <span>${tax.toFixed(2)}</span>
                        </div>
                        <Separator />
                        <div className="flex justify-between font-medium">
                          <span>Total</span>
                          <span>${total.toFixed(2)}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <div className="mt-6">
                    <Card>
                      <CardContent className="p-6">
                        <h2 className="text-xl font-semibold mb-4">Shipping Information</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                          <div>
                            <h3 className="font-medium text-sm text-muted-foreground mb-1">
                              Shipping Address
                            </h3>
                            <p>
                              123 Main Street<br />
                              Apt 4B<br />
                              New York, NY 10001<br />
                              United States
                            </p>
                          </div>
                          <div>
                            <h3 className="font-medium text-sm text-muted-foreground mb-1">
                              Shipping Method
                            </h3>
                            <p>Standard Shipping (3-5 business days)</p>
                            <p className="mt-4">
                              <span className="flex items-center text-sm text-green-600 font-medium">
                                <Calendar className="h-4 w-4 mr-1" />
                                Estimated delivery: {new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toLocaleDateString()}
                              </span>
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
                
                <div>
                  <Card>
                    <CardContent className="p-6 space-y-6">
                      <h2 className="text-xl font-semibold">What's Next?</h2>
                      <div className="space-y-4">
                        <p className="text-sm">
                          You will receive an email confirmation with your order details and tracking information once your order ships.
                        </p>
                        <p className="text-sm">
                          Need help with your order? Contact our customer support team.
                        </p>
                      </div>
                      <div className="space-y-3">
                        <Button 
                          className="w-full bg-servie hover:bg-servie-600"
                          onClick={() => navigate("/dashboard/client")}
                        >
                          View My Orders
                        </Button>
                        <Button 
                          variant="outline" 
                          className="w-full"
                          onClick={() => navigate("/shop")}
                        >
                          Continue Shopping
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </>
          )}
        </div>
    </div>
  );
};

export default OrderConfirmation;
