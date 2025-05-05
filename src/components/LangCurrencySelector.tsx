
import React, { useState, createContext, useContext, ReactNode, useEffect } from "react";
import { Check, ChevronDown, Globe, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

type Language = {
  code: string;
  name: string;
  flag: string;
};

type Currency = {
  code: string;
  name: string;
  symbol: string;
  region?: string;
};

const languages: Language[] = [
  { code: "en", name: "English", flag: "🇺🇸" },
  { code: "es", name: "Español", flag: "🇪🇸" },
  { code: "fr", name: "Français", flag: "🇫🇷" },
  { code: "de", name: "Deutsch", flag: "🇩🇪" },
  { code: "zh", name: "中文", flag: "🇨🇳" },
  { code: "jp", name: "日本語", flag: "🇯🇵" },
  { code: "ar", name: "العربية", flag: "🇸🇦" },
  { code: "sw", name: "Kiswahili", flag: "🇰🇪" },
  { code: "yo", name: "Yorùbá", flag: "🇳🇬" },
  { code: "ha", name: "Hausa", flag: "🇳🇬" },
];

const currencies: Currency[] = [
  { code: "USD", name: "US Dollar", symbol: "$" },
  { code: "EUR", name: "Euro", symbol: "€" },
  { code: "GBP", name: "British Pound", symbol: "£" },
  { code: "JPY", name: "Japanese Yen", symbol: "¥" },
  { code: "CAD", name: "Canadian Dollar", symbol: "$" },
  { code: "AUD", name: "Australian Dollar", symbol: "$" },
  { code: "INR", name: "Indian Rupee", symbol: "₹" },
  // African currencies
  { code: "NGN", name: "Nigerian Naira", symbol: "₦", region: "Africa" },
  { code: "ZAR", name: "South African Rand", symbol: "R", region: "Africa" },
  { code: "KES", name: "Kenyan Shilling", symbol: "KSh", region: "Africa" },
  { code: "GHS", name: "Ghanaian Cedi", symbol: "₵", region: "Africa" },
  { code: "EGP", name: "Egyptian Pound", symbol: "E£", region: "Africa" },
  { code: "MAD", name: "Moroccan Dirham", symbol: "MAD", region: "Africa" },
  { code: "UGX", name: "Ugandan Shilling", symbol: "USh", region: "Africa" },
  { code: "TZS", name: "Tanzanian Shilling", symbol: "TSh", region: "Africa" },
  { code: "XOF", name: "West African CFA franc", symbol: "CFA", region: "Africa" },
  { code: "XAF", name: "Central African CFA franc", symbol: "FCFA", region: "Africa" },
];

// Create context for app-wide language and currency
interface LocalizationContextType {
  currentLanguage: Language;
  currentCurrency: Currency;
  setCurrentLanguage: (language: Language) => void;
  setCurrentCurrency: (currency: Currency) => void;
  formatPrice: (amount: number) => string;
  translate: (key: string) => string;
}

const LocalizationContext = createContext<LocalizationContextType | undefined>(undefined);

// Exchange rates (approximate, would be fetched from API in production)
const exchangeRates: Record<string, number> = {
  USD: 1,
  EUR: 0.92,
  GBP: 0.79,
  JPY: 151.12,
  CAD: 1.37,
  AUD: 1.52,
  INR: 83.31,
  NGN: 1503.41,
  ZAR: 18.57,
  KES: 131.03,
  GHS: 15.46,
  EGP: 47.83,
  MAD: 9.93,
  UGX: 3831.23,
  TZS: 2635.17,
  XOF: 605.14,
  XAF: 605.14,
};

export function LocalizationProvider({ children }: { children: ReactNode }) {
  const { i18n, t } = useTranslation();
  
  // Use local storage to persist language and currency preferences
  const [currentLanguage, setCurrentLanguage] = useState<Language>(() => {
    const savedLanguage = localStorage.getItem('preferredLanguage');
    if (savedLanguage) {
      try {
        return JSON.parse(savedLanguage);
      } catch (e) {
        return languages[0];
      }
    }
    return languages[0];
  });
  
  const [currentCurrency, setCurrentCurrency] = useState<Currency>(() => {
    const savedCurrency = localStorage.getItem('preferredCurrency');
    if (savedCurrency) {
      try {
        return JSON.parse(savedCurrency);
      } catch (e) {
        return currencies[0];
      }
    }
    return currencies[0];
  });

  // Save preferences to localStorage and update i18n language
  useEffect(() => {
    localStorage.setItem('preferredLanguage', JSON.stringify(currentLanguage));
    document.documentElement.setAttribute('lang', currentLanguage.code);
    
    // Update i18n language
    i18n.changeLanguage(currentLanguage.code).catch(error => {
      console.error("Error changing language:", error);
    });
  }, [currentLanguage, i18n]);
  
  useEffect(() => {
    localStorage.setItem('preferredCurrency', JSON.stringify(currentCurrency));
  }, [currentCurrency]);

  const handleSetCurrentLanguage = (language: Language) => {
    setCurrentLanguage(language);
    
    // Force a refresh of any components that might need it
    window.dispatchEvent(new CustomEvent('languageChanged', { detail: language.code }));
  };

  const handleSetCurrentCurrency = (currency: Currency) => {
    setCurrentCurrency(currency);
    
    // Force a refresh of price displays
    window.dispatchEvent(new CustomEvent('currencyChanged', { detail: currency.code }));
  };

  const formatPrice = (amount: number): string => {
    const rate = exchangeRates[currentCurrency.code] || 1;
    const convertedAmount = amount * rate;
    
    return new Intl.NumberFormat(currentLanguage.code, { 
      style: 'currency', 
      currency: currentCurrency.code,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(convertedAmount);
  };
  
  const translate = (key: string): string => {
    return t(key) || key; // Use i18n translation
  };
  
  return (
    <LocalizationContext.Provider value={{
      currentLanguage,
      currentCurrency,
      setCurrentLanguage: handleSetCurrentLanguage,
      setCurrentCurrency: handleSetCurrentCurrency,
      formatPrice,
      translate
    }}>
      {children}
    </LocalizationContext.Provider>
  );
}

export function useLocalization() {
  const context = useContext(LocalizationContext);
  if (context === undefined) {
    throw new Error('useLocalization must be used within a LocalizationProvider');
  }
  return context;
}

interface LangCurrencySelectorProps {
  showLanguages?: boolean;
  showCurrencies?: boolean;
}

export function LangCurrencySelector({ 
  showLanguages = true,
  showCurrencies = true
}: LangCurrencySelectorProps) {
  const { 
    currentLanguage, 
    currentCurrency, 
    setCurrentLanguage, 
    setCurrentCurrency 
  } = useLocalization();

  const handleLanguageChange = (language: Language) => {
    setCurrentLanguage(language);
    toast.success(`Language changed to ${language.name}`);
  };

  const handleCurrencyChange = (currency: Currency) => {
    setCurrentCurrency(currency);
    toast.success(`Currency changed to ${currency.name}`);
  };

  // Group currencies by region to show African currencies separately
  const africanCurrencies = currencies.filter(c => c.region === 'Africa');
  const otherCurrencies = currencies.filter(c => c.region !== 'Africa');

  return (
    <div className="p-4">
      {showLanguages && (
        <div className="mb-4">
          <p className="text-sm font-medium mb-3">Select Language</p>
          <div className="grid grid-cols-2 gap-2">
            {languages.map((language) => (
              <Button
                key={language.code}
                variant="ghost"
                size="sm"
                className="justify-start"
                onClick={() => handleLanguageChange(language)}
              >
                <span className="mr-2">{language.flag}</span>
                {language.name}
                {currentLanguage.code === language.code && (
                  <Check className="h-4 w-4 ml-auto" />
                )}
              </Button>
            ))}
          </div>
        </div>
      )}
      
      {showCurrencies && (
        <div className="mt-6">
          <p className="text-sm font-medium mb-3">Select Currency</p>
          <div className="grid grid-cols-1 gap-1 max-h-[200px] overflow-y-auto pr-2">
            <p className="text-xs font-medium text-muted-foreground mt-2">Common Currencies</p>
            {otherCurrencies.map((currency) => (
              <Button
                key={currency.code}
                variant="ghost"
                size="sm"
                className="justify-start"
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
                className="justify-start"
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
      )}
    </div>
  );
}
