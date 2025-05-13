
import { useLocalization } from "@/components/LangCurrencySelector";

interface PriceDisplayProps {
  amount: number;
  className?: string;
  showCurrency?: boolean;
}

export function PriceDisplay({ amount, className = "", showCurrency = true }: PriceDisplayProps) {
  const { formatPrice } = useLocalization();
  
  return (
    <span className={className}>
      {formatPrice(amount)}
    </span>
  );
}

export default PriceDisplay;
