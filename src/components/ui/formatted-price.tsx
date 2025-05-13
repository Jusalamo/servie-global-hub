
import { useLocalization } from "@/components/LangCurrencySelector";

interface FormattedPriceProps {
  value: number;
  className?: string;
}

export function FormattedPrice({ value, className }: FormattedPriceProps) {
  const { formatPrice } = useLocalization();
  
  return (
    <span className={className}>
      {formatPrice(value)}
    </span>
  );
}
