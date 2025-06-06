
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { MapPin, Shield, Clock } from 'lucide-react';
import AfricanPaymentSelector, { PaymentMethod } from '@/components/payment/AfricanPaymentSelector';
import { useLocalization } from '@/components/LangCurrencySelector';

interface CheckoutItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

interface EnhancedCheckoutProps {
  items: CheckoutItem[];
  userRegion?: 'nigeria' | 'kenya' | 'ghana' | 'south_africa' | 'global';
  onCheckoutComplete: (paymentMethod: PaymentMethod, orderData: any) => void;
}

export default function EnhancedCheckout({ 
  items, 
  userRegion = 'nigeria',
  onCheckoutComplete 
}: EnhancedCheckoutProps) {
  const { formatPrice } = useLocalization();
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod | null>(null);
  const [shippingAddress, setShippingAddress] = useState({
    fullName: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    postalCode: ''
  });
  const [isProcessing, setIsProcessing] = useState(false);

  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shippingFee = selectedPaymentMethod?.type === 'cash' ? 5 : 2; // Higher shipping for cash delivery
  const total = subtotal + shippingFee;

  const handleAddressChange = (field: string, value: string) => {
    setShippingAddress(prev => ({ ...prev, [field]: value }));
  };

  const handlePaymentMethodSelect = (method: PaymentMethod) => {
    setSelectedPaymentMethod(method);
  };

  const handleCheckout = async () => {
    if (!selectedPaymentMethod) return;
    
    setIsProcessing(true);
    
    const orderData = {
      items,
      shippingAddress,
      paymentMethod: selectedPaymentMethod,
      subtotal,
      shippingFee,
      total,
      orderDate: new Date().toISOString(),
      region: userRegion
    };

    try {
      await onCheckoutComplete(selectedPaymentMethod, orderData);
    } catch (error) {
      console.error('Checkout error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const getEstimatedDelivery = () => {
    if (selectedPaymentMethod?.type === 'cash') {
      return '30-60 minutes (Cash on Delivery)';
    }
    return '2-4 hours (Prepaid)';
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Order Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Order Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {items.map((item) => (
              <div key={item.id} className="flex justify-between items-center">
                <div>
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                </div>
                <p className="font-medium">{formatPrice(item.price * item.quantity)}</p>
              </div>
            ))}
            
            <Separator />
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>{formatPrice(shippingFee)}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>{formatPrice(total)}</span>
              </div>
            </div>

            {selectedPaymentMethod && (
              <div className="mt-4 p-3 bg-muted rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="h-4 w-4" />
                  <span className="text-sm font-medium">Estimated Delivery</span>
                </div>
                <p className="text-sm">{getEstimatedDelivery()}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Checkout Form */}
        <div className="space-y-6">
          {/* Shipping Address */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Delivery Address
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input 
                    id="fullName"
                    value={shippingAddress.fullName}
                    onChange={(e) => handleAddressChange('fullName', e.target.value)}
                    placeholder="Enter your full name"
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input 
                    id="phone"
                    value={shippingAddress.phone}
                    onChange={(e) => handleAddressChange('phone', e.target.value)}
                    placeholder="+234 xxx xxx xxxx"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="address">Street Address</Label>
                <Input 
                  id="address"
                  value={shippingAddress.address}
                  onChange={(e) => handleAddressChange('address', e.target.value)}
                  placeholder="Enter your street address"
                />
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="city">City</Label>
                  <Input 
                    id="city"
                    value={shippingAddress.city}
                    onChange={(e) => handleAddressChange('city', e.target.value)}
                    placeholder="City"
                  />
                </div>
                <div>
                  <Label htmlFor="state">State</Label>
                  <Input 
                    id="state"
                    value={shippingAddress.state}
                    onChange={(e) => handleAddressChange('state', e.target.value)}
                    placeholder="State"
                  />
                </div>
                <div>
                  <Label htmlFor="postalCode">Postal Code</Label>
                  <Input 
                    id="postalCode"
                    value={shippingAddress.postalCode}
                    onChange={(e) => handleAddressChange('postalCode', e.target.value)}
                    placeholder="100001"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Method */}
          <Card>
            <CardHeader>
              <CardTitle>Payment Method</CardTitle>
            </CardHeader>
            <CardContent>
              <AfricanPaymentSelector 
                selectedMethod={selectedPaymentMethod?.id}
                onMethodSelect={handlePaymentMethodSelect}
                userRegion={userRegion}
              />
            </CardContent>
          </Card>

          {/* Place Order */}
          <Button 
            onClick={handleCheckout}
            disabled={!selectedPaymentMethod || isProcessing || !shippingAddress.fullName || !shippingAddress.phone}
            className="w-full bg-servie hover:bg-servie-600"
            size="lg"
          >
            {isProcessing ? 'Processing...' : `Place Order - ${formatPrice(total)}`}
          </Button>

          {selectedPaymentMethod?.type === 'cash' && (
            <div className="p-4 border border-orange-200 bg-orange-50 dark:bg-orange-950/20 rounded-lg">
              <h4 className="font-medium text-orange-800 dark:text-orange-200 mb-2">
                Cash on Delivery Instructions
              </h4>
              <ul className="text-sm text-orange-700 dark:text-orange-300 space-y-1">
                <li>• Prepare exact change if possible</li>
                <li>• Our delivery rider will collect payment upon delivery</li>
                <li>• You can inspect items before payment</li>
                <li>• Keep your phone available for delivery coordination</li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
