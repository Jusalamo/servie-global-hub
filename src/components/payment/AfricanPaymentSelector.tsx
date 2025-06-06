
import React, { useState } from 'react';
import { Check, CreditCard, Smartphone, Banknote, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export type PaymentMethod = {
  id: string;
  name: string;
  type: 'mobile_money' | 'bank_transfer' | 'cash' | 'card' | 'crypto';
  icon: React.ReactNode;
  region: 'nigeria' | 'kenya' | 'ghana' | 'south_africa' | 'global';
  popular?: boolean;
  description: string;
};

const paymentMethods: PaymentMethod[] = [
  // Nigerian Payment Methods
  { id: 'mtn_momo', name: 'MTN Mobile Money', type: 'mobile_money', icon: <Smartphone className="h-5 w-5" />, region: 'nigeria', popular: true, description: 'Pay with MTN MoMo - Most popular in Nigeria' },
  { id: 'airtel_money', name: 'Airtel Money', type: 'mobile_money', icon: <Smartphone className="h-5 w-5" />, region: 'nigeria', popular: true, description: 'SmartCash PSB - 44M+ customers' },
  { id: 'paystack', name: 'Paystack Bank Transfer', type: 'bank_transfer', icon: <Building2 className="h-5 w-5" />, region: 'nigeria', popular: true, description: 'Instant bank transfers with unique account' },
  { id: 'cash_delivery', name: 'Cash on Delivery', type: 'cash', icon: <Banknote className="h-5 w-5" />, region: 'nigeria', popular: true, description: 'Pay cash to delivery rider' },
  
  // Kenyan Payment Methods
  { id: 'mpesa', name: 'M-Pesa', type: 'mobile_money', icon: <Smartphone className="h-5 w-5" />, region: 'kenya', popular: true, description: 'Kenya\'s leading mobile money service' },
  { id: 'airtel_kenya', name: 'Airtel Money Kenya', type: 'mobile_money', icon: <Smartphone className="h-5 w-5" />, region: 'kenya', description: 'Airtel mobile money for Kenya' },
  
  // Ghanaian Payment Methods
  { id: 'mtn_ghana', name: 'MTN Mobile Money Ghana', type: 'mobile_money', icon: <Smartphone className="h-5 w-5" />, region: 'ghana', popular: true, description: 'MTN MoMo Ghana' },
  { id: 'vodafone_cash', name: 'Vodafone Cash', type: 'mobile_money', icon: <Smartphone className="h-5 w-5" />, region: 'ghana', description: 'Vodafone mobile money service' },
  
  // South African Payment Methods
  { id: 'capitec_pay', name: 'Capitec Pay', type: 'bank_transfer', icon: <Building2 className="h-5 w-5" />, region: 'south_africa', description: 'Instant EFT payments' },
  { id: 'fnb_pay', name: 'FNB Pay', type: 'bank_transfer', icon: <Building2 className="h-5 w-5" />, region: 'south_africa', description: 'First National Bank payments' },
  
  // Global Payment Methods
  { id: 'visa', name: 'Visa', type: 'card', icon: <CreditCard className="h-5 w-5" />, region: 'global', description: 'Visa credit/debit cards' },
  { id: 'mastercard', name: 'Mastercard', type: 'card', icon: <CreditCard className="h-5 w-5" />, region: 'global', description: 'Mastercard credit/debit cards' },
  { id: 'paypal', name: 'PayPal', type: 'card', icon: <CreditCard className="h-5 w-5" />, region: 'global', description: 'PayPal wallet payments' },
];

interface AfricanPaymentSelectorProps {
  selectedMethod?: string;
  onMethodSelect: (method: PaymentMethod) => void;
  userRegion?: 'nigeria' | 'kenya' | 'ghana' | 'south_africa' | 'global';
}

export default function AfricanPaymentSelector({ 
  selectedMethod, 
  onMethodSelect, 
  userRegion = 'nigeria' 
}: AfricanPaymentSelectorProps) {
  const [selectedId, setSelectedId] = useState(selectedMethod);

  // Filter and prioritize payment methods based on user region
  const prioritizedMethods = [
    ...paymentMethods.filter(m => m.region === userRegion && m.popular),
    ...paymentMethods.filter(m => m.region === userRegion && !m.popular),
    ...paymentMethods.filter(m => m.region === 'global'),
    ...paymentMethods.filter(m => m.region !== userRegion && m.region !== 'global'),
  ];

  const handleMethodSelect = (method: PaymentMethod) => {
    setSelectedId(method.id);
    onMethodSelect(method);
  };

  const getMethodTypeColor = (type: PaymentMethod['type']) => {
    switch (type) {
      case 'mobile_money': return 'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300';
      case 'bank_transfer': return 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300';
      case 'cash': return 'bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-300';
      case 'card': return 'bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300';
      default: return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300';
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Select Payment Method</h3>
      
      <div className="grid gap-3">
        {prioritizedMethods.map((method) => (
          <Card 
            key={method.id}
            className={`cursor-pointer transition-all hover:shadow-md ${
              selectedId === method.id 
                ? 'ring-2 ring-servie border-servie bg-servie/5' 
                : 'hover:border-servie/50'
            }`}
            onClick={() => handleMethodSelect(method)}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${getMethodTypeColor(method.type)}`}>
                    {method.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{method.name}</span>
                      {method.popular && (
                        <Badge variant="secondary" className="text-xs">Popular</Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{method.description}</p>
                  </div>
                </div>
                {selectedId === method.id && (
                  <Check className="h-5 w-5 text-servie" />
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
