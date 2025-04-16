
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { CreditCard, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';
import { AppleIcon } from './ecommerce/icons/AppleIcon';

// Create a PayPal icon since it's not available in lucide-react
const PaypalIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-paypal" {...props}>
    <path d="M7 11.5L8 14.5C8.13333 14.9667 8.36667 15.3333 8.7 15.6C9.03333 15.8667 9.46667 16 10 16H11.5C12.0333 16 12.5 15.8173 12.9 15.452C13.3 15.0867 13.5 14.6453 13.5 14.128C13.5 13.976 13.4747 13.832 13.424 13.696C13.3733 13.56 13.3033 13.432 13.214 13.312C13.1247 13.192 13.024 13.076 12.912 12.964C12.8 12.852 12.684 12.7513 12.564 12.662C12.444 12.5727 12.316 12.5027 12.18 12.452C12.044 12.4013 11.9 12.376 11.748 12.376H10.252C10.084 12.376 9.93333 12.348 9.8 12.292C9.66667 12.236 9.54533 12.1613 9.436 12.068C9.32667 11.9747 9.23867 11.8627 9.172 11.732C9.10533 11.6013 9.072 11.4613 9.072 11.312C9.072 11.1467 9.10533 11.0067 9.172 10.892C9.23867 10.7773 9.31867 10.684 9.412 10.612C9.50533 10.54 9.608 10.488 9.72 10.456C9.832 10.424 9.94133 10.408 10.048 10.408H11.072C11.2107 10.408 11.3413 10.4307 11.464 10.476C11.5867 10.5213 11.692 10.584 11.78 10.664C11.868 10.744 11.9373 10.8347 11.988 10.936C12.0387 11.0373 12.064 11.144 12.064 11.256" />
    <path d="M19.42 7.25C19.2733 7.93333 19.0933 8.61667 18.88 9.3C18.6667 9.98333 18.4533 10.6667 18.24 11.35C18.0267 12.0333 17.82 12.7167 17.62 13.4C17.42 14.0833 17.244 14.7667 17.092 15.45C17.0333 15.7033 16.9267 15.9033 16.772 16.05C16.6173 16.1967 16.4307 16.27 16.212 16.27H14.908C14.8493 16.27 14.786 16.25 14.718 16.21C14.65 16.17 14.6033 16.1093 14.578 16.028C14.554 15.9467 14.5513 15.8627 14.57 15.776C14.5887 15.6893 14.6193 15.6107 14.662 15.54L17.372 8.83C17.4333 8.67667 17.526 8.554 17.65 8.462C17.774 8.37 17.918 8.324 18.082 8.324H19.144C19.2213 8.324 19.284 8.342 19.332 8.378C19.38 8.414 19.4107 8.462 19.424 8.522C19.4373 8.582 19.436 8.64867 19.42 8.722C19.404 8.79533 19.3813 8.87267 19.352 8.954L19.42 7.25Z" />
    <path d="M4.5 7.5L7.5 7.5" />
    <path d="M13 10.5L16 10.5" />
    <path d="M11 7.5L15 7.5" />
  </svg>
);

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
            <PaypalIcon className="h-5 w-5 mr-3 text-blue-500" />
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
