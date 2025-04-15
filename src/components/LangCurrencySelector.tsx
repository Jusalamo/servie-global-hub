
import { useState, createContext, useContext, ReactNode } from "react";
import { Check, ChevronDown, Globe, DollarSign } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

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

// Simple translation dictionary (to be expanded)
const translations: Record<string, Record<string, string>> = {
  en: {
    welcome: "Welcome to Servie",
    services: "Services",
    shop: "Shop",
    about: "About",
    contact: "Contact Us",
    signIn: "Sign In",
    signUp: "Sign Up",
  },
  es: {
    welcome: "Bienvenido a Servie",
    services: "Servicios",
    shop: "Tienda",
    about: "Acerca de",
    contact: "Contáctenos",
    signIn: "Iniciar Sesión",
    signUp: "Registrarse",
  },
  fr: {
    welcome: "Bienvenue à Servie",
    services: "Services",
    shop: "Boutique",
    about: "À propos",
    contact: "Contactez-nous",
    signIn: "Se Connecter",
    signUp: "S'inscrire",
  },
  // Add more translations as needed
};

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
  const [currentLanguage, setCurrentLanguage] = useState<Language>(languages[0]);
  const [currentCurrency, setCurrentCurrency] = useState<Currency>(currencies[0]);
  
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
    const langCode = currentLanguage.code;
    // Fallback to English if translation not available
    return (translations[langCode]?.[key] || translations.en?.[key] || key);
  };
  
  return (
    <LocalizationContext.Provider value={{
      currentLanguage,
      currentCurrency,
      setCurrentLanguage,
      setCurrentCurrency,
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

export function LangCurrencySelector() {
  // Use context if available, otherwise use local state
  let currentLanguage: Language;
  let currentCurrency: Currency;
  let setCurrentLanguage: (language: Language) => void;
  let setCurrentCurrency: (currency: Currency) => void;
  
  try {
    const localization = useLocalization();
    currentLanguage = localization.currentLanguage;
    currentCurrency = localization.currentCurrency;
    setCurrentLanguage = localization.setCurrentLanguage;
    setCurrentCurrency = localization.setCurrentCurrency;
  } catch {
    // Fallback to local state if context isn't available
    const [langState, setLangState] = useState<Language>(languages[0]);
    const [currState, setCurrState] = useState<Currency>(currencies[0]);
    currentLanguage = langState;
    currentCurrency = currState;
    setCurrentLanguage = setLangState;
    setCurrentCurrency = setCurrState;
  }

  const handleLanguageChange = (language: Language) => {
    setCurrentLanguage(language);
    document.documentElement.setAttribute('lang', language.code);
    // In a real app, this would update the app's localization
    toast.success(`Language changed to ${language.name}`);
  };

  const handleCurrencyChange = (currency: Currency) => {
    setCurrentCurrency(currency);
    // In a real app, this would update the app's currency settings
    toast.success(`Currency changed to ${currency.name}`);
  };

  // Group currencies by region to show African currencies separately
  const africanCurrencies = currencies.filter(c => c.region === 'Africa');
  const otherCurrencies = currencies.filter(c => c.region !== 'Africa');

  return (
    <div className="flex space-x-2">
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" className="flex items-center gap-1">
            <Globe className="h-4 w-4 mr-1" />
            {currentLanguage.flag} <ChevronDown className="h-3 w-3 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-56 p-0" align="end">
          <div className="p-2">
            <p className="text-sm font-medium px-2 py-1.5">Select Language</p>
            <div className="mt-2 space-y-1">
              {languages.map((language) => (
                <Button
                  key={language.code}
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start"
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
        </PopoverContent>
      </Popover>
      
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" className="flex items-center gap-1">
            <DollarSign className="h-4 w-4 mr-1" />
            {currentCurrency.symbol} {currentCurrency.code} <ChevronDown className="h-3 w-3 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-72 p-0 max-h-[400px] overflow-y-auto" align="end">
          <div className="p-2">
            <p className="text-sm font-medium px-2 py-1.5">Select Currency</p>
            
            {/* Common currencies */}
            <div className="mt-2">
              <p className="text-xs font-medium text-muted-foreground px-2 py-1">Common Currencies</p>
              <div className="space-y-1 mt-1">
                {otherCurrencies.map((currency) => (
                  <Button
                    key={currency.code}
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start"
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
            
            {/* African currencies */}
            <div className="mt-4">
              <p className="text-xs font-medium text-muted-foreground px-2 py-1">African Currencies</p>
              <div className="space-y-1 mt-1">
                {africanCurrencies.map((currency) => (
                  <Button
                    key={currency.code}
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start"
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
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
