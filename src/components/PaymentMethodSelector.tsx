import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { CreditCard, Paypal, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';
import { AppleIcon } from './ecommerce/icons/AppleIcon';

interface PaymentMethodSelectorProps {
  onSelect: (method: string) => void;
  selectedMethod?: string;
}

const PaymentMethodSelector = ({ onSelect, selectedMethod = 'card' }: PaymentMethodSelectorProps) => {
  const [paymentMethod, setPaymentMethod] = useState(selectedMethod);

  const handleMethodChange = (value: string) => {
    setPaymentMethod(value);
    onSelect(value);
    toast.success(`${value.charAt(0).toUpperCase() + value.slice(1)} selected as payment method`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Payment Method</h3>
        <div className="flex items-center text-sm text-muted-foreground gap-1">
          <ShieldCheck className="h-4 w-4" />
          <span>Secure Payment</span>
        </div>
      </div>

      <RadioGroup value={paymentMethod} onValueChange={handleMethodChange} className="grid gap-4">
        <div>
          <RadioGroupItem value="card" id="card" className="peer sr-only" />
          <Label 
            htmlFor="card" 
            className={`payment-method-card ${paymentMethod === 'card' ? 'payment-method-active' : ''}`}
          >
            <CreditCard className="h-5 w-5 mr-3 text-gray-600" />
            <div className="flex-1">
              <div className="font-medium">Credit / Debit Card</div>
              <div className="text-xs text-muted-foreground">Visa, Mastercard, Amex</div>
            </div>
          </Label>
        </div>

        <div>
          <RadioGroupItem value="paypal" id="paypal" className="peer sr-only" />
          <Label 
            htmlFor="paypal" 
            className={`payment-method-card ${paymentMethod === 'paypal' ? 'payment-method-active' : ''}`}
          >
            <Paypal className="h-5 w-5 mr-3 text-blue-500" />
            <div className="flex-1">
              <div className="font-medium">PayPal</div>
              <div className="text-xs text-muted-foreground">Pay with your PayPal account</div>
            </div>
          </Label>
        </div>

        <div>
          <RadioGroupItem value="apple-pay" id="apple-pay" className="peer sr-only" />
          <Label 
            htmlFor="apple-pay" 
            className={`payment-method-card ${paymentMethod === 'apple-pay' ? 'payment-method-active' : ''}`}
          >
            <AppleIcon className="h-5 w-5 mr-3" />
            <div className="flex-1">
              <div className="font-medium">Apple Pay</div>
              <div className="text-xs text-muted-foreground">Pay with Apple Pay</div>
            </div>
          </Label>
        </div>
      </RadioGroup>

      <Button type="button" className="w-full mt-4 bg-servie hover:bg-servie-600">
        Continue to Payment
      </Button>
    </div>
  );
};

export default PaymentMethodSelector;
