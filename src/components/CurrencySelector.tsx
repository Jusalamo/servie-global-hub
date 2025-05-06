
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
    <div className="p-4 max-h-[400px] overflow-hidden">
      <p className="text-sm font-medium mb-3">Select Currency</p>
      <div className="overflow-y-auto pr-2 max-h-[340px] currency-scrollbar">
        <p className="text-xs font-medium text-muted-foreground mt-2">Common Currencies</p>
        {otherCurrencies.map((currency) => (
          <Button
            key={currency.code}
            variant="ghost"
            size="sm"
            className="w-full justify-start mb-1"
            onClick={() => handleCurrencyChange(currency)}
          >
            <span className="mr-2">{currency.symbol}</span>
            {currency.code} - {currency.name}
            {currentCurrency.code === currency.code && (
              <Check className="h-4 w-4 ml-auto" />
            )}
          </Button>
        ))}
        <p className="text-xs font-medium text-muted-foreground mt-2">African Currencies</p>
        {africanCurrencies.map((currency) => (
          <Button
            key={currency.code}
            variant="ghost"
            size="sm" 
            className="w-full justify-start mb-1"
            onClick={() => handleCurrencyChange(currency)}
          >
            <span className="mr-2">{currency.symbol}</span>
            {currency.code} - {currency.name}
            {currentCurrency.code === currency.code && (
              <Check className="h-4 w-4 ml-auto" />
            )}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default CurrencySelector;
