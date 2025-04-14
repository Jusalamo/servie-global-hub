
import { useState } from "react";
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
};

const languages: Language[] = [
  { code: "en", name: "English", flag: "🇺🇸" },
  { code: "es", name: "Español", flag: "🇪🇸" },
  { code: "fr", name: "Français", flag: "🇫🇷" },
  { code: "de", name: "Deutsch", flag: "🇩🇪" },
  { code: "zh", name: "中文", flag: "🇨🇳" },
  { code: "jp", name: "日本語", flag: "🇯🇵" },
  { code: "ar", name: "العربية", flag: "🇸🇦" },
];

const currencies: Currency[] = [
  { code: "USD", name: "US Dollar", symbol: "$" },
  { code: "EUR", name: "Euro", symbol: "€" },
  { code: "GBP", name: "British Pound", symbol: "£" },
  { code: "JPY", name: "Japanese Yen", symbol: "¥" },
  { code: "CAD", name: "Canadian Dollar", symbol: "$" },
  { code: "AUD", name: "Australian Dollar", symbol: "$" },
  { code: "INR", name: "Indian Rupee", symbol: "₹" },
];

export function LangCurrencySelector() {
  const [currentLanguage, setCurrentLanguage] = useState<Language>(languages[0]);
  const [currentCurrency, setCurrentCurrency] = useState<Currency>(currencies[0]);

  const handleLanguageChange = (language: Language) => {
    setCurrentLanguage(language);
    // In a real app, this would update the app's localization
    toast.success(`Language changed to ${language.name}`);
  };

  const handleCurrencyChange = (currency: Currency) => {
    setCurrentCurrency(currency);
    // In a real app, this would update the app's currency settings
    toast.success(`Currency changed to ${currency.name}`);
  };

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
        <PopoverContent className="w-56 p-0" align="end">
          <div className="p-2">
            <p className="text-sm font-medium px-2 py-1.5">Select Currency</p>
            <div className="mt-2 space-y-1">
              {currencies.map((currency) => (
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
        </PopoverContent>
      </Popover>
    </div>
  );
}
