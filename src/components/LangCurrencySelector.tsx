
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Globe, DollarSign } from "lucide-react";
import { createContext, useContext } from "react";

interface LocalizationContextType {
  language: string;
  currency: string;
  setLanguage: (lang: string) => void;
  setCurrency: (curr: string) => void;
  formatPrice: (amount: number) => string;
  translate: (key: string) => string;
}

const LocalizationContext = createContext<LocalizationContextType | undefined>(undefined);

export const LocalizationProvider = ({ children }: { children: React.ReactNode }) => {
  const [language, setLanguage] = useState("en");
  const [currency, setCurrency] = useState("USD");

  const formatPrice = (amount: number) => {
    const formatters = {
      USD: new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }),
      EUR: new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }),
      GBP: new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' }),
    };
    return formatters[currency as keyof typeof formatters]?.format(amount) || `$${amount}`;
  };

  const translations = {
    en: {
      add_to_cart: "Add to Cart",
      buy_now: "Buy Now",
      adding: "Adding",
      added_to_cart: "Added"
    },
    es: {
      add_to_cart: "Añadir al Carrito",
      buy_now: "Comprar Ahora",
      adding: "Añadiendo",
      added_to_cart: "Añadido"
    },
    fr: {
      add_to_cart: "Ajouter au Panier",
      buy_now: "Acheter Maintenant",
      adding: "Ajout",
      added_to_cart: "Ajouté"
    }
  };

  const translate = (key: string) => {
    return translations[language as keyof typeof translations]?.[key as keyof typeof translations.en] || key;
  };

  return (
    <LocalizationContext.Provider value={{
      language,
      currency,
      setLanguage,
      setCurrency,
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

const LangCurrencySelector = () => {
  const { language, currency, setLanguage, setCurrency } = useLocalization();

  return (
    <div className="flex items-center gap-2">
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground hover:text-foreground">
            <Globe className="h-4 w-4" />
            <span className="hidden sm:inline">{language.toUpperCase()}</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-48 p-2" align="end">
          <div className="space-y-2">
            <div className="text-sm font-medium mb-2">Language</div>
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger className="h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="es">Español</SelectItem>
                <SelectItem value="fr">Français</SelectItem>
                <SelectItem value="de">Deutsch</SelectItem>
                <SelectItem value="it">Italiano</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </PopoverContent>
      </Popover>

      <Popover>
        <PopoverTrigger asChild>
          <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground hover:text-foreground">
            <DollarSign className="h-4 w-4" />
            <span className="hidden sm:inline">{currency}</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-48 p-2" align="end">
          <div className="space-y-2">
            <div className="text-sm font-medium mb-2">Currency</div>
            <Select value={currency} onValueChange={setCurrency}>
              <SelectTrigger className="h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="USD">USD - US Dollar</SelectItem>
                <SelectItem value="EUR">EUR - Euro</SelectItem>
                <SelectItem value="GBP">GBP - British Pound</SelectItem>
                <SelectItem value="CAD">CAD - Canadian Dollar</SelectItem>
                <SelectItem value="AUD">AUD - Australian Dollar</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default LangCurrencySelector;
