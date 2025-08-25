-- Fix critical RLS security issues

-- 1. Fix profiles table RLS - restrict personal data access
DROP POLICY IF EXISTS "Anyone can view profiles" ON profiles;

-- Create restrictive profile policies
CREATE POLICY "Users can view their own profile" ON profiles
FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can view basic provider info" ON profiles  
FOR SELECT USING (role = 'provider');

-- 2. Secure database functions with proper search_path
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  INSERT INTO public.profiles (id, first_name, last_name, role)
  VALUES (
    NEW.id, 
    NEW.raw_user_meta_data->>'first_name',
    NEW.raw_user_meta_data->>'last_name',
    COALESCE(NEW.raw_user_meta_data->>'role', 'client')
  );
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.update_earnings_summary()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
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
$function$;

CREATE OR REPLACE FUNCTION public.update_quotation_total()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  UPDATE public.quotations
  SET 
    subtotal = (
      SELECT COALESCE(SUM(total_price), 0)
      FROM public.quotation_items
      WHERE quotation_id = COALESCE(NEW.quotation_id, OLD.quotation_id)
    ),
    updated_at = now()
  WHERE id = COALESCE(NEW.quotation_id, OLD.quotation_id);
  
  -- Recalculate total with tax and discount
  UPDATE public.quotations
  SET total = subtotal - discount_amount + tax_amount
  WHERE id = COALESCE(NEW.quotation_id, OLD.quotation_id);
  
  RETURN COALESCE(NEW, OLD);
END;
$function$;

CREATE OR REPLACE FUNCTION public.generate_quote_number()
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
DECLARE
  next_number INTEGER;
  quote_number TEXT;
BEGIN
  -- Get the next sequential number
  SELECT COALESCE(MAX(CAST(SUBSTRING(quote_number FROM 'QT-(\d+)') AS INTEGER)), 0) + 1
  INTO next_number
  FROM quotations
  WHERE quote_number ~ '^QT-\d+$';
  
  -- Format as QT-YYYY-NNNN
  quote_number := 'QT-' || TO_CHAR(CURRENT_DATE, 'YYYY') || '-' || LPAD(next_number::TEXT, 4, '0');
  
  RETURN quote_number;
END;
$function$;

CREATE OR REPLACE FUNCTION public.set_quote_number()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  IF NEW.quote_number IS NULL OR NEW.quote_number = '' THEN
    NEW.quote_number := generate_quote_number();
  END IF;
  RETURN NEW;
END;
$function$;

-- 3. Add security policies for quotations
DROP POLICY IF EXISTS "Providers can manage their own quotations" ON quotations;
DROP POLICY IF EXISTS "Providers can view their own quotations" ON quotations;

CREATE POLICY "Providers can manage their own quotations" ON quotations
FOR ALL USING (
  provider_id = auth.uid() AND 
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'provider')
);

-- 4. Ensure financial_transactions user_id is not nullable in future
-- Note: Cannot modify existing nullable column without potential data issues
-- Add constraint to ensure user_id is always set for new records
CREATE OR REPLACE FUNCTION validate_financial_transaction()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  IF NEW.user_id IS NULL THEN
    RAISE EXCEPTION 'user_id cannot be null for financial transactions';
  END IF;
  RETURN NEW;
END;
$function$;

DROP TRIGGER IF EXISTS validate_financial_transaction_trigger ON financial_transactions;
CREATE TRIGGER validate_financial_transaction_trigger
  BEFORE INSERT OR UPDATE ON financial_transactions
  FOR EACH ROW EXECUTE FUNCTION validate_financial_transaction();