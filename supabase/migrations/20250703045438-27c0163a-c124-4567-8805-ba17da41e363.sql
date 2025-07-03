
-- Create financial transactions table to track earnings and expenses
CREATE TABLE IF NOT EXISTS public.financial_transactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('earning', 'expense')),
  category TEXT NOT NULL CHECK (category IN ('service_booking', 'product_sale', 'commission', 'refund', 'withdrawal', 'other')),
  amount DECIMAL(10,2) NOT NULL,
  description TEXT,
  reference_id UUID, -- Links to booking_id, order_id, etc.
  reference_type TEXT, -- 'booking', 'order', 'quotation', etc.
  status TEXT NOT NULL DEFAULT 'completed' CHECK (status IN ('pending', 'completed', 'cancelled')),
  transaction_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create earnings summary table for quick dashboard access
CREATE TABLE IF NOT EXISTS public.earnings_summary (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL UNIQUE,
  total_earnings DECIMAL(10,2) NOT NULL DEFAULT 0,
  total_expenses DECIMAL(10,2) NOT NULL DEFAULT 0,
  monthly_earnings DECIMAL(10,2) NOT NULL DEFAULT 0,
  monthly_expenses DECIMAL(10,2) NOT NULL DEFAULT 0,
  weekly_earnings DECIMAL(10,2) NOT NULL DEFAULT 0,
  weekly_expenses DECIMAL(10,2) NOT NULL DEFAULT 0,
  last_updated TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.financial_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.earnings_summary ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for financial_transactions
CREATE POLICY "Users can view their own transactions" ON public.financial_transactions
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can create their own transactions" ON public.financial_transactions
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own transactions" ON public.financial_transactions
  FOR UPDATE USING (user_id = auth.uid());

-- Create RLS policies for earnings_summary
CREATE POLICY "Users can view their own earnings summary" ON public.earnings_summary
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can manage their own earnings summary" ON public.earnings_summary
  FOR ALL USING (user_id = auth.uid());

-- Function to update earnings summary
CREATE OR REPLACE FUNCTION update_earnings_summary()
RETURNS TRIGGER AS $$
BEGIN
  -- Update or insert earnings summary
  INSERT INTO public.earnings_summary (user_id, total_earnings, total_expenses, monthly_earnings, monthly_expenses, weekly_earnings, weekly_expenses, last_updated)
  VALUES (
    COALESCE(NEW.user_id, OLD.user_id),
    COALESCE((
      SELECT SUM(amount) FROM public.financial_transactions 
      WHERE user_id = COALESCE(NEW.user_id, OLD.user_id) AND type = 'earning' AND status = 'completed'
    ), 0),
    COALESCE((
      SELECT SUM(amount) FROM public.financial_transactions 
      WHERE user_id = COALESCE(NEW.user_id, OLD.user_id) AND type = 'expense' AND status = 'completed'
    ), 0),
    COALESCE((
      SELECT SUM(amount) FROM public.financial_transactions 
      WHERE user_id = COALESCE(NEW.user_id, OLD.user_id) AND type = 'earning' AND status = 'completed'
      AND transaction_date >= date_trunc('month', CURRENT_DATE)
    ), 0),
    COALESCE((
      SELECT SUM(amount) FROM public.financial_transactions 
      WHERE user_id = COALESCE(NEW.user_id, OLD.user_id) AND type = 'expense' AND status = 'completed'
      AND transaction_date >= date_trunc('month', CURRENT_DATE)
    ), 0),
    COALESCE((
      SELECT SUM(amount) FROM public.financial_transactions 
      WHERE user_id = COALESCE(NEW.user_id, OLD.user_id) AND type = 'earning' AND status = 'completed'
      AND transaction_date >= date_trunc('week', CURRENT_DATE)
    ), 0),
    COALESCE((
      SELECT SUM(amount) FROM public.financial_transactions 
      WHERE user_id = COALESCE(NEW.user_id, OLD.user_id) AND type = 'expense' AND status = 'completed'
      AND transaction_date >= date_trunc('week', CURRENT_DATE)
    ), 0),
    now()
  )
  ON CONFLICT (user_id) DO UPDATE SET
    total_earnings = EXCLUDED.total_earnings,
    total_expenses = EXCLUDED.total_expenses,
    monthly_earnings = EXCLUDED.monthly_earnings,
    monthly_expenses = EXCLUDED.monthly_expenses,
    weekly_earnings = EXCLUDED.weekly_earnings,
    weekly_expenses = EXCLUDED.weekly_expenses,
    last_updated = now();
    
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Create trigger to update earnings summary
CREATE TRIGGER financial_transactions_summary_trigger
  AFTER INSERT OR UPDATE OR DELETE ON public.financial_transactions
  FOR EACH ROW EXECUTE FUNCTION update_earnings_summary();
