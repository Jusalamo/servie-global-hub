import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Wallet, DollarSign, TrendingUp, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface WalletData {
  id: string;
  balance: number;
  commission_deposit: number;
  currency: string;
  last_deposit_at: string | null;
}

export const SellerWallet = () => {
  const { user } = useAuth();
  const [wallet, setWallet] = useState<WalletData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [depositAmount, setDepositAmount] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    fetchWallet();
  }, [user]);

  const fetchWallet = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('seller_wallets')
        .select('*')
        .eq('seller_id', user.id)
        .eq('currency', 'USD')
        .maybeSingle();

      if (error && error.code !== 'PGRST116') throw error;

      if (!data) {
        // Create wallet if it doesn't exist
        const { data: newWallet, error: createError } = await supabase
          .from('seller_wallets')
          .insert({
            seller_id: user.id,
            currency: 'USD',
            balance: 0,
            commission_deposit: 0
          })
          .select()
          .single();

        if (createError) throw createError;
        setWallet(newWallet);
      } else {
        setWallet(data);
      }
    } catch (error) {
      console.error('Error fetching wallet:', error);
      toast.error('Failed to load wallet');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeposit = async () => {
    if (!user || !wallet) return;

    const amount = parseFloat(depositAmount);
    if (isNaN(amount) || amount <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    // Calculate 5% commission (or 7% based on policy)
    const commissionRate = 0.05; // 5%
    const commissionAmount = amount * commissionRate;

    if (amount < commissionAmount) {
      toast.error(`Minimum deposit must cover 5% commission ($${commissionAmount.toFixed(2)})`);
      return;
    }

    setIsProcessing(true);
    try {
      // In production, this would integrate with payment gateway
      // For now, we'll just update the wallet
      const { error } = await supabase
        .from('seller_wallets')
        .update({
          commission_deposit: wallet.commission_deposit + commissionAmount,
          balance: wallet.balance + (amount - commissionAmount),
          last_deposit_at: new Date().toISOString()
        })
        .eq('id', wallet.id);

      if (error) throw error;

      toast.success(`Deposit successful! Commission: $${commissionAmount.toFixed(2)}`);
      setDepositAmount('');
      await fetchWallet();
    } catch (error) {
      console.error('Error processing deposit:', error);
      toast.error('Failed to process deposit');
    } finally {
      setIsProcessing(false);
    }
  };

  if (isLoading) {
    return <div>Loading wallet...</div>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wallet className="h-5 w-5" />
            Seller Wallet
          </CardTitle>
          <CardDescription>
            Manage your commission deposits and view your balance
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Balance Display */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-primary/10 rounded-lg">
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <DollarSign className="h-4 w-4" />
                <span className="text-sm">Available Balance</span>
              </div>
              <p className="text-2xl font-bold">
                ${wallet?.balance?.toFixed(2) || '0.00'}
              </p>
            </div>

            <div className="p-4 bg-green-50 dark:bg-green-950 rounded-lg">
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <TrendingUp className="h-4 w-4" />
                <span className="text-sm">Commission Deposited</span>
              </div>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                ${wallet?.commission_deposit?.toFixed(2) || '0.00'}
              </p>
            </div>
          </div>

          {/* Info Alert */}
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <strong>Platform Commission Policy:</strong> All sellers must maintain a 5-7% commission deposit 
              for each transaction. This ensures platform sustainability and seller protection.
            </AlertDescription>
          </Alert>

          {/* Deposit Section */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="deposit-amount">Deposit Amount (USD)</Label>
              <div className="flex gap-2">
                <Input
                  id="deposit-amount"
                  type="number"
                  placeholder="0.00"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(e.target.value)}
                  min="0"
                  step="0.01"
                  disabled={isProcessing}
                />
                <Button
                  onClick={handleDeposit}
                  disabled={!depositAmount || isProcessing}
                >
                  {isProcessing ? 'Processing...' : 'Deposit'}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                5% commission will be deducted: ${depositAmount ? (parseFloat(depositAmount) * 0.05).toFixed(2) : '0.00'}
              </p>
            </div>
          </div>

          {/* Transaction History Placeholder */}
          <div className="pt-4 border-t">
            <h4 className="font-medium mb-2">Recent Transactions</h4>
            <p className="text-sm text-muted-foreground">
              {wallet?.last_deposit_at 
                ? `Last deposit: ${new Date(wallet.last_deposit_at).toLocaleDateString()}`
                : 'No transactions yet'}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
