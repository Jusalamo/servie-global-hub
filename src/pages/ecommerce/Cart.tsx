import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { TrashIcon, MinusIcon, PlusIcon, ShoppingCart, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";
import { useCart } from "@/context/CartContext";

const Cart = () => {
  const navigate = useNavigate();
  const { cartItems, removeFromCart, updateQuantity, cartTotal, isLoading } = useCart();
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
    setTimeout(() => {
      setIsApplyingPromo(false);
      if (promoCode.toUpperCase() === "DISCOUNT20") {
        const newDiscount = cartTotal * 0.2;
        setDiscount(newDiscount);
        toast.success("Promo code applied!");
      } else {
        toast.error("Invalid promo code");
      }
    }, 1000);
  };

  if (isLoading) {
    return (
      <div className="py-8">
        <div className="container mx-auto px-4 max-w-[1200px] flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-servie" />
        </div>
      </div>
    );
  }
  
  return (
    <div className="py-8">
      <div className="container mx-auto px-4 max-w-[1200px]">
        <h1 className="text-2xl md:text-3xl font-bold mb-6 flex items-center">
          <ShoppingCart className="mr-3 h-6 w-6" />
          Your Shopping Cart
        </h1>
        
        {cartItems.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent className="space-y-6">
              <ShoppingCart className="h-20 w-20 mx-auto text-muted-foreground" />
              <h2 className="text-xl font-semibold">Your cart is empty</h2>
              <p className="text-muted-foreground">Add products to get started.</p>
              <Button size="lg" asChild>
                <Link to="/shop">Continue Shopping</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              <div className="bg-background rounded-lg border p-4">
                {cartItems.map((item, idx) => (
                  <div key={item.id} className="py-4">
                    <div className="flex items-start gap-4">
                      <Link to={`/product/${item.product_id}`} className="shrink-0">
                        <img src={item.product?.image_url || '/placeholder.svg'} alt={item.product?.name} className="h-20 w-20 rounded-lg object-cover" />
                      </Link>
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <Link to={`/product/${item.product_id}`} className="font-medium hover:underline">{item.product?.name}</Link>
                          <span className="font-medium">${((item.product?.price || 0) * item.quantity).toFixed(2)}</span>
                        </div>
                        <div className="mt-2 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => handleQuantityChange(item.id, -1)} disabled={item.quantity <= 1}><MinusIcon className="h-3 w-3" /></Button>
                            <span className="w-8 text-center">{item.quantity}</span>
                            <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => handleQuantityChange(item.id, 1)}><PlusIcon className="h-3 w-3" /></Button>
                          </div>
                          <Button variant="ghost" size="sm" className="text-destructive" onClick={() => removeFromCart(item.id)}><TrashIcon className="h-4 w-4" /></Button>
                        </div>
                      </div>
                    </div>
                    {idx < cartItems.length - 1 && <Separator className="mt-4" />}
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-background rounded-lg border p-4 space-y-4 h-fit sticky top-20">
              <h2 className="text-lg font-semibold">Order Summary</h2>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span>Subtotal</span><span>${cartTotal.toFixed(2)}</span></div>
                <div className="flex justify-between"><span>Shipping</span><span>{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</span></div>
                {discount > 0 && <div className="flex justify-between text-green-600"><span>Discount</span><span>-${discount.toFixed(2)}</span></div>}
                <Separator />
                <div className="flex justify-between font-semibold text-base"><span>Total</span><span>${total.toFixed(2)}</span></div>
              </div>
              <div className="space-y-2">
                <div className="flex gap-2">
                  <Input placeholder="Promo code" value={promoCode} onChange={(e) => setPromoCode(e.target.value)} />
                  <Button variant="outline" onClick={handleApplyPromo} disabled={isApplyingPromo}>{isApplyingPromo ? "..." : "Apply"}</Button>
                </div>
              </div>
              <Button className="w-full bg-servie hover:bg-servie-600" size="lg" onClick={() => navigate("/checkout")}>
                Checkout <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Link to="/shop" className="block text-center text-sm text-muted-foreground hover:underline">Continue Shopping</Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;