
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { TrashIcon, MinusIcon, PlusIcon, ShoppingCart, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { useCart } from "@/context/CartContext";

const Cart = () => {
  const navigate = useNavigate();
  const { cartItems, removeFromCart, updateQuantity, cartTotal } = useCart();
  const [promoCode, setPromoCode] = useState("");
  const [isApplyingPromo, setIsApplyingPromo] = useState(false);
  const [discount, setDiscount] = useState(0);
  
  const shipping = cartTotal > 100 ? 0 : 10;
  const total = cartTotal + shipping - discount;
  
  const handleQuantityChange = (id: string, change: number) => {
    const currentQuantity = cartItems.find(item => item.id === id)?.quantity || 0;
    updateQuantity(id, Math.max(1, currentQuantity + change));
  };
  
  const handleApplyPromo = () => {
    if (!promoCode.trim()) {
      toast.error("Please enter a promo code");
      return;
    }
    
    setIsApplyingPromo(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsApplyingPromo(false);
      
      if (promoCode.toUpperCase() === "DISCOUNT20") {
        const newDiscount = cartTotal * 0.2;
        setDiscount(newDiscount);
        toast.success("Promo code applied successfully!");
      } else {
        toast.error("Invalid promo code");
      }
    }, 1000);
  };
  
  return (
    <div className="py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-6 flex items-center">
            <ShoppingCart className="mr-3 h-7 w-7" />
            Your Shopping Cart
          </h1>
          
          {cartItems.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent className="space-y-6">
                <div className="flex justify-center">
                  <ShoppingCart className="h-24 w-24 text-muted-foreground" />
                </div>
                <h2 className="text-2xl font-semibold">Your cart is empty</h2>
                <p className="text-muted-foreground">
                  Looks like you haven't added any products to your cart yet.
                </p>
                <Button size="lg" asChild>
                  <Link to="/shop">Continue Shopping</Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-4">
                <div className="bg-background rounded-lg border p-4">
                  <div className="flex justify-between text-sm font-medium text-muted-foreground mb-4">
                    <span>Product</span>
                    <span>Total</span>
                  </div>
                  
                  {cartItems.map((item) => (
                    <div key={item.id} className="py-4">
                      <div className="flex items-start gap-4">
                        <Link to={`/product/${item.product_id}`} className="shrink-0">
                          <img
                            src={item.product?.image_url || '/placeholder.svg'}
                            alt={item.product?.name || 'Product'}
                            className="h-20 w-20 rounded-md object-cover"
                          />
                        </Link>
                        
                        <div className="flex flex-1 flex-col">
                          <div className="flex justify-between">
                            <div>
                              <Link 
                                to={`/product/${item.product_id}`}
                                className="font-medium hover:underline"
                              >
                                {item.product?.name || 'Product'}
                              </Link>
                              <div className="mt-1 text-sm text-muted-foreground">
                                In stock: {item.product?.stock || 0}
                              </div>
                            </div>
                            <div className="font-medium">
                              ${((item.product?.price || 0) * item.quantity).toFixed(2)}
                            </div>
                          </div>
                          
                          <div className="mt-2 flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <Button 
                                variant="outline" 
                                size="icon" 
                                className="h-8 w-8" 
                                onClick={() => handleQuantityChange(item.id, -1)}
                                disabled={item.quantity <= 1}
                              >
                                <MinusIcon className="h-3 w-3" />
                              </Button>
                              <span className="w-8 text-center text-sm">
                                {item.quantity}
                              </span>
                              <Button 
                                variant="outline" 
                                size="icon" 
                                className="h-8 w-8" 
                                onClick={() => handleQuantityChange(item.id, 1)}
                              >
                                <PlusIcon className="h-3 w-3" />
                              </Button>
                            </div>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="text-red-500 hover:text-red-600 hover:bg-red-50 -mr-2"
                              onClick={() => removeFromCart(item.id)}
                            >
                              <TrashIcon className="h-4 w-4 mr-1" />
                              Remove
                            </Button>
                          </div>
                        </div>
                      </div>
                      {cartItems.indexOf(item) < cartItems.length - 1 && (
                        <Separator className="my-4" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Order Summary */}
              <div>
                <div className="bg-background rounded-lg border p-4 space-y-4 sticky top-4">
                  <h2 className="text-lg font-semibold">Order Summary</h2>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span>${cartTotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Shipping</span>
                      <span>{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</span>
                    </div>
                    {discount > 0 && (
                      <div className="flex justify-between text-green-600">
                        <span>Discount</span>
                        <span>-${discount.toFixed(2)}</span>
                      </div>
                    )}
                    <Separator />
                    <div className="flex justify-between font-semibold">
                      <span>Total</span>
                      <span>${total.toFixed(2)}</span>
                    </div>
                  </div>
                  
                  {/* Promo Code */}
                  <div className="space-y-2">
                    <div className="text-sm font-medium">Promo Code</div>
                    <div className="flex gap-2">
                      <Input 
                        placeholder="Enter code" 
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value)}
                      />
                      <Button 
                        variant="outline"
                        onClick={handleApplyPromo}
                        disabled={isApplyingPromo}
                      >
                        {isApplyingPromo ? "Applying..." : "Apply"}
                      </Button>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Try code "DISCOUNT20" for 20% off
                    </div>
                  </div>
                  
                  <Button 
                    className="w-full bg-servie hover:bg-servie-600" 
                    size="lg"
                    onClick={() => navigate("/checkout")}
                  >
                    Checkout
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                  
                  <div className="text-center">
                    <Link
                      to="/shop"
                      className="text-sm text-muted-foreground hover:text-foreground hover:underline"
                    >
                      Continue Shopping
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
    </div>
  );
};

export default Cart;
