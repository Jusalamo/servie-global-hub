import { Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useSubscription } from '@/hooks/useSubscription';
import { useState } from 'react';

interface AIListingButtonProps {
  onGenerate: () => Promise<void>;
  label?: string;
  disabled?: boolean;
}

export const AIListingButton = ({ onGenerate, label = "AI Assist", disabled }: AIListingButtonProps) => {
  const { hasFeature } = useSubscription();
  const [loading, setLoading] = useState(false);
  
  const handleClick = async () => {
    if (!hasFeature('ai_insights')) {
      toast.error('AI Listing Assistant is a Premium feature. Upgrade to access AI-powered listing optimization.');
      return;
    }
    
    setLoading(true);
    try {
      await onGenerate();
      toast.success('AI suggestions generated successfully!');
    } catch (error) {
      toast.error('Failed to generate AI suggestions');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      onClick={handleClick}
      disabled={disabled || loading}
      className="gap-2"
    >
      <Sparkles className="w-4 h-4" />
      {loading ? 'Generating...' : label}
    </Button>
  );
};
