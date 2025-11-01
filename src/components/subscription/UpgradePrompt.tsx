import { AlertCircle, ArrowUpRight } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { SUBSCRIPTION_TIERS } from '@/services/subscriptionAPI';

interface UpgradePromptProps {
  open: boolean;
  onClose: () => void;
  reason?: string;
  currentTier?: 'free' | 'pro' | 'premium';
}

export const UpgradePrompt = ({ open, onClose, reason, currentTier = 'free' }: UpgradePromptProps) => {
  const recommendedTier = currentTier === 'free' ? 'pro' : 'premium';
  const tier = SUBSCRIPTION_TIERS[recommendedTier];

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Upgrade Your Plan</DialogTitle>
          <DialogDescription>
            {reason || 'Unlock more features and grow your business faster'}
          </DialogDescription>
        </DialogHeader>

        <Card className="p-6 border-2 border-servie">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-2xl font-bold capitalize">{tier.tier}</h3>
              <p className="text-3xl font-bold text-servie mt-1">
                ${tier.price}
                <span className="text-base font-normal text-muted-foreground">/mo</span>
              </p>
            </div>
            <Badge className="bg-servie">Recommended</Badge>
          </div>

          <ul className="space-y-3 mb-6">
            <li className="flex items-start gap-2">
              <ArrowUpRight className="h-5 w-5 text-servie flex-shrink-0 mt-0.5" />
              <span>
                {tier.features.max_listings === -1 ? 'Unlimited' : tier.features.max_listings} product listings
              </span>
            </li>
            {tier.features.advanced_analytics && (
              <li className="flex items-start gap-2">
                <ArrowUpRight className="h-5 w-5 text-servie flex-shrink-0 mt-0.5" />
                <span>Advanced analytics & insights</span>
              </li>
            )}
            {tier.features.downloadable_reports && (
              <li className="flex items-start gap-2">
                <ArrowUpRight className="h-5 w-5 text-servie flex-shrink-0 mt-0.5" />
                <span>Downloadable financial reports</span>
              </li>
            )}
            {tier.features.priority_placement && (
              <li className="flex items-start gap-2">
                <ArrowUpRight className="h-5 w-5 text-servie flex-shrink-0 mt-0.5" />
                <span>Priority listing placement</span>
              </li>
            )}
            {tier.features.dedicated_support && (
              <li className="flex items-start gap-2">
                <ArrowUpRight className="h-5 w-5 text-servie flex-shrink-0 mt-0.5" />
                <span>Dedicated account support</span>
              </li>
            )}
          </ul>

          <Button className="w-full bg-servie hover:bg-servie-600">
            Upgrade to {tier.tier}
          </Button>
        </Card>

        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>7-Day Free Trial</AlertTitle>
          <AlertDescription>
            Start your free trial today. Cancel anytime, no questions asked.
          </AlertDescription>
        </Alert>
      </DialogContent>
    </Dialog>
  );
};
