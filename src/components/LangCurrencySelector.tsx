
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Globe, DollarSign, Check } from "lucide-react";
import { createContext, useContext } from "react";

interface Currency {
  code: string;
  name: string;
  symbol: string;
  region?: string;
}

interface Language {
  code: string;
  name: string;
}

interface LocalizationContextType {
  language: string;
  currency: string;
  currentLanguage: Language;
  currentCurrency: Currency;
  currencies: Currency[];
  setLanguage: (lang: string) => void;
  setCurrency: (curr: string) => void;
  setCurrentCurrency: (curr: Currency) => void;
  formatPrice: (amount: number) => string;
  translate: (key: string) => string;
}

const LocalizationContext = createContext<LocalizationContextType | undefined>(undefined);

const languages: Language[] = [
  { code: "en", name: "English" },
  { code: "es", name: "Español" },
  { code: "fr", name: "Français" },
  { code: "de", name: "Deutsch" },
  { code: "it", name: "Italiano" }
];

const currencies: Currency[] = [
  { code: "USD", name: "US Dollar", symbol: "$", region: "Americas" },
  { code: "EUR", name: "Euro", symbol: "€", region: "Europe" },
  { code: "GBP", name: "British Pound", symbol: "£", region: "Europe" },
  { code: "CAD", name: "Canadian Dollar", symbol: "C$", region: "Americas" },
  { code: "AUD", name: "Australian Dollar", symbol: "A$", region: "Oceania" },
  { code: "NGN", name: "Nigerian Naira", symbol: "₦", region: "Africa" },
  { code: "ZAR", name: "South African Rand", symbol: "R", region: "Africa" },
  { code: "KES", name: "Kenyan Shilling", symbol: "KSh", region: "Africa" },
  { code: "GHS", name: "Ghanaian Cedi", symbol: "₵", region: "Africa" }
];

export const LocalizationProvider = ({ children }: { children: React.ReactNode }) => {
  const [language, setLanguage] = useState("en");
  const [currency, setCurrency] = useState("USD");

  const currentLanguage = languages.find(lang => lang.code === language) || languages[0];
  const currentCurrency = currencies.find(curr => curr.code === currency) || currencies[0];

  const setCurrentCurrency = (curr: Currency) => {
    setCurrency(curr.code);
  };

  const formatPrice = (amount: number) => {
    const formatters = {
      USD: new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }),
      EUR: new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }),
      GBP: new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' }),
      CAD: new Intl.NumberFormat('en-CA', { style: 'currency', currency: 'CAD' }),
      AUD: new Intl.NumberFormat('en-AU', { style: 'currency', currency: 'AUD' }),
      NGN: new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }),
      ZAR: new Intl.NumberFormat('en-ZA', { style: 'currency', currency: 'ZAR' }),
      KES: new Intl.NumberFormat('en-KE', { style: 'currency', currency: 'KES' }),
      GHS: new Intl.NumberFormat('en-GH', { style: 'currency', currency: 'GHS' })
    };
    return formatters[currency as keyof typeof formatters]?.format(amount) || `${currentCurrency.symbol}${amount}`;
  };

  const translations = {
    en: {
      add_to_cart: "Add to Cart",
      buy_now: "Buy Now",
      adding: "Adding",
      added_to_cart: "Added",
      signIn: "Sign In",
      signUp: "Sign Up"
    },
    es: {
      add_to_cart: "Añadir al Carrito",
      buy_now: "Comprar Ahora",
      adding: "Añadiendo",
      added_to_cart: "Añadido",
      signIn: "Iniciar Sesión",
      signUp: "Registrarse"
    },
    fr: {
      add_to_cart: "Ajouter au Panier",
      buy_now: "Acheter Maintenant",
      adding: "Ajout",
      added_to_cart: "Ajouté",
      signIn: "Se Connecter",
      signUp: "S'inscrire"
    },
    de: {
      add_to_cart: "In den Warenkorb",
      buy_now: "Jetzt Kaufen",
      adding: "Hinzufügen",
      added_to_cart: "Hinzugefügt",
      signIn: "Anmelden",
      signUp: "Registrieren"
    },
    it: {
      add_to_cart: "Aggiungi al Carrello",
      buy_now: "Compra Ora",
      adding: "Aggiungendo",
      added_to_cart: "Aggiunto",
      signIn: "Accedi",
      signUp: "Registrati"
    }
  };

  const translate = (key: string) => {
    return translations[language as keyof typeof translations]?.[key as keyof typeof translations.en] || key;
  };

  return (
    <LocalizationContext.Provider value={{
      language,
      currency,
      currentLanguage,
      currentCurrency,
      currencies,
      setLanguage,
      setCurrency,
      setCurrentCurrency,
      formatPrice,
      translate
    }}>
      {children}
    </LocalizationContext.Provider>
  );
};

export const useLocalization = () => {
  const context = useContext(LocalizationContext);
  if (!context) {
    throw new Error("useLocalization must be used within LocalizationProvider");
  }
  return context;
};

interface LangCurrencySelectorProps {
  showCurrencies?: boolean;
}

const LangCurrencySelector = ({ showCurrencies = true }: LangCurrencySelectorProps) => {
  const { 
    language, 
    currency, 
    currentLanguage, 
    currentCurrency, 
    currencies, 
    setLanguage, 
    setCurrency, 
    setCurrentCurrency 
  } = useLocalization();

  const handleCurrencyChange = (currencyItem: Currency) => {
    setCurrentCurrency(currencyItem);
  };

  const africanCurrencies = currencies.filter(c => c.region === 'Africa');
  const otherCurrencies = currencies.filter(c => c.region !== 'Africa');

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border">
      {/* Language Section */}
      <div className="p-4 border-b">
        <div className="flex items-center gap-2 mb-3">
          <Globe className="h-4 w-4" />
          <span className="text-sm font-medium">Language</span>
        </div>
        <Select value={language} onValueChange={setLanguage}>
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {languages.map((lang) => (
              <SelectItem key={lang.code} value={lang.code}>
                {lang.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Currency Section */}
      {showCurrencies && (
        <div className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <DollarSign className="h-4 w-4" />
            <span className="text-sm font-medium">Currency</span>
          </div>
          <div className="max-h-[200px] overflow-y-auto space-y-1">
            <div className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground">Common Currencies</p>
              {otherCurrencies.map((currencyItem) => (
                <Button
                  key={currencyItem.code}
                  variant="ghost"
                  size="sm"
                  className={`w-full justify-start ${currentCurrency.code === currencyItem.code ? 'bg-primary/10 text-primary' : ''}`}
                  onClick={() => handleCurrencyChange(currencyItem)}
                >
                  <span className="mr-2">{currencyItem.symbol}</span>
                  {currencyItem.code} - {currencyItem.name}
                  {currentCurrency.code === currencyItem.code && (
                    <Check className="h-4 w-4 ml-auto text-primary" />
                  )}
                </Button>
              ))}
              
              <p className="text-xs font-medium text-muted-foreground mt-4">African Currencies</p>
              {africanCurrencies.map((currencyItem) => (
                <Button
                  key={currencyItem.code}
                  variant="ghost"
                  size="sm"
                  className={`w-full justify-start ${currentCurrency.code === currencyItem.code ? 'bg-primary/10 text-primary' : ''}`}
                  onClick={() => handleCurrencyChange(currencyItem)}
                >
                  <span className="mr-2">{currencyItem.symbol}</span>
                  {currencyItem.code} - {currencyItem.name}
                  {currentCurrency.code === currencyItem.code && (
                    <Check className="h-4 w-4 ml-auto text-primary" />
                  )}
                </Button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LangCurrencySelector;
export { LangCurrencySelector };
