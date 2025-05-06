
import React from 'react';
import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLocalization } from './LangCurrencySelector';
import { toast } from 'sonner';

const CurrencySelector = () => {
  const { 
    currentCurrency,
    setCurrentCurrency,
    currencies
  } = useLocalization();

  const handleCurrencyChange = (currency: any) => {
    setCurrentCurrency(currency);
    toast.success(`Currency changed to ${currency.name}`);
  };

  // Group currencies by region to show African currencies separately
  const africanCurrencies = currencies?.filter(c => c.region === 'Africa') || [];
  const otherCurrencies = currencies?.filter(c => c.region !== 'Africa') || [];

  return (
    <div className="p-4">
      <p className="text-sm font-medium mb-3">Select Currency</p>
      <div className="max-h-[300px] overflow-y-auto">
        <div className="space-y-1">
          <p className="text-xs font-medium text-muted-foreground mt-2">Common Currencies</p>
          {otherCurrencies.map((currency) => (
            <Button
              key={currency.code}
              variant="ghost"
              size="sm"
              className={`w-full justify-start mb-1 ${currentCurrency.code === currency.code ? 'bg-primary/10 text-primary' : ''}`}
              onClick={() => handleCurrencyChange(currency)}
            >
              <span className="mr-2">{currency.symbol}</span>
              {currency.code} - {currency.name}
              {currentCurrency.code === currency.code && (
                <Check className="h-4 w-4 ml-auto text-primary" />
              )}
            </Button>
          ))}
          
          <p className="text-xs font-medium text-muted-foreground mt-4">African Currencies</p>
          {africanCurrencies.map((currency) => (
            <Button
              key={currency.code}
              variant="ghost"
              size="sm" 
              className={`w-full justify-start mb-1 ${currentCurrency.code === currency.code ? 'bg-primary/10 text-primary' : ''}`}
              onClick={() => handleCurrencyChange(currency)}
            >
              <span className="mr-2">{currency.symbol}</span>
              {currency.code} - {currency.name}
              {currentCurrency.code === currency.code && (
                <Check className="h-4 w-4 ml-auto text-primary" />
              )}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CurrencySelector;
