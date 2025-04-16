
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { 
  CreditCard, 
  CheckCircle, 
  Lock, 
  AlertCircle,
  ShieldCheck
} from 'lucide-react';
import { toast } from 'sonner';
import PaymentMethodSelector from '../PaymentMethodSelector';
import { useTranslation } from 'react-i18next';

interface PaymentIntegrationProps {
  amount: number;
  onComplete?: () => void;
  currency?: string;
}

const PaymentIntegration = ({ 
  amount, 
  onComplete,
  currency = 'USD' 
}: PaymentIntegrationProps) => {
  const { t } = useTranslation();
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
  
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(value);
  };

  const handlePaymentMethodChange = (method: string) => {
    setPaymentMethod(method);
  };

  const handlePayment = () => {
    setIsProcessing(true);
    setPaymentStatus('processing');

    // Simulate payment processing
    setTimeout(() => {
      const success = Math.random() > 0.1; // 90% success rate for demo
      
      if (success) {
        setPaymentStatus('success');
        toast.success(t('Payment successful!'));
        if (onComplete) {
          onComplete();
        }
      } else {
        setPaymentStatus('error');
        toast.error(t('Payment failed. Please try again.'));
      }
      
      setIsProcessing(false);
    }, 2000);
  };

  return (
    <Card className="enhanced-card">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">{t('Complete Your Payment')}</h2>
          <div className="flex items-center text-sm text-muted-foreground">
            <Lock className="h-4 w-4 mr-1" />
            <span>{t('Secure Checkout')}</span>
          </div>
        </div>

        <PaymentMethodSelector 
          onSelect={handlePaymentMethodChange}
          selectedMethod={paymentMethod}
        />

        <Separator className="my-6" />

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">{t('Subtotal')}</span>
            <span>{formatCurrency(amount * 0.9)}</span>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">{t('Tax')}</span>
            <span>{formatCurrency(amount * 0.1)}</span>
          </div>
          
          <Separator />
          
          <div className="flex items-center justify-between font-bold">
            <span>{t('Total')}</span>
            <span className="text-lg">{formatCurrency(amount)}</span>
          </div>
        </div>

        {paymentStatus === 'error' && (
          <div className="mt-6 p-3 bg-red-50 border border-red-200 rounded-md flex items-start">
            <AlertCircle className="h-5 w-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-red-800">
                {t('Payment Failed')}
              </p>
              <p className="text-xs text-red-700 mt-1">
                {t('There was an issue processing your payment. Please try again or use a different payment method.')}
              </p>
            </div>
          </div>
        )}

        {paymentStatus === 'success' && (
          <div className="mt-6 p-3 bg-green-50 border border-green-200 rounded-md flex items-start">
            <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-green-800">
                {t('Payment Successful')}
              </p>
              <p className="text-xs text-green-700 mt-1">
                {t('Your payment has been processed successfully. Thank you for your purchase!')}
              </p>
            </div>
          </div>
        )}

        <div className="mt-6">
          <Button
            onClick={handlePayment}
            disabled={isProcessing || paymentStatus === 'success'}
            className="w-full bg-servie hover:bg-servie-600"
          >
            {isProcessing ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {t('Processing...')}
              </>
            ) : paymentStatus === 'success' ? (
              <>
                <CheckCircle className="mr-2 h-4 w-4" />
                {t('Paid')}
              </>
            ) : (
              <>
                <CreditCard className="mr-2 h-4 w-4" />
                {t('Pay')} {formatCurrency(amount)}
              </>
            )}
          </Button>
        </div>

        <div className="mt-4 flex justify-center text-xs text-muted-foreground gap-2">
          <ShieldCheck className="h-4 w-4" />
          <span>{t('Your payment information is secure and encrypted')}</span>
        </div>
      </div>
    </Card>
  );
};

export default PaymentIntegration;
