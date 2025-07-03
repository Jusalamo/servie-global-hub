
-- Create quotations table
CREATE TABLE IF NOT EXISTS public.quotations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  quote_number TEXT NOT NULL UNIQUE,
  provider_id UUID REFERENCES auth.users NOT NULL,
  client_name TEXT NOT NULL,
  client_email TEXT,
  client_phone TEXT,
  title TEXT NOT NULL,
  description TEXT,
  subtotal DECIMAL(10,2) NOT NULL DEFAULT 0,
  discount_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
  discount_percentage DECIMAL(5,2) NOT NULL DEFAULT 0,
  tax_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
  tax_percentage DECIMAL(5,2) NOT NULL DEFAULT 0,
  total DECIMAL(10,2) NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'accepted', 'declined', 'expired')),
  due_date DATE,
  valid_until DATE,
  notes TEXT,
  terms_conditions TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  sent_at TIMESTAMP WITH TIME ZONE,
  accepted_at TIMESTAMP WITH TIME ZONE,
  declined_at TIMESTAMP WITH TIME ZONE
);

-- Create quotation items table
CREATE TABLE IF NOT EXISTS public.quotation_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  quotation_id UUID REFERENCES public.quotations(id) ON DELETE CASCADE NOT NULL,
  item_name TEXT NOT NULL,
  description TEXT,
  quantity DECIMAL(10,2) NOT NULL DEFAULT 1,
  unit_price DECIMAL(10,2) NOT NULL,
  total_price DECIMAL(10,2) NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create function to generate quote numbers
CREATE OR REPLACE FUNCTION generate_quote_number()
RETURNS TEXT AS $$
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
$$ LANGUAGE plpgsql;

-- Create trigger to auto-generate quote numbers
CREATE OR REPLACE FUNCTION set_quote_number()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.quote_number IS NULL OR NEW.quote_number = '' THEN
    NEW.quote_number := generate_quote_number();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER quotation_quote_number_trigger
  BEFORE INSERT ON public.quotations
  FOR EACH ROW EXECUTE FUNCTION set_quote_number();

-- Create trigger to update quotation total when items change
CREATE OR REPLACE FUNCTION update_quotation_total()
RETURNS TRIGGER AS $$
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
$$ LANGUAGE plpgsql;

CREATE TRIGGER quotation_items_total_trigger
  AFTER INSERT OR UPDATE OR DELETE ON public.quotation_items
  FOR EACH ROW EXECUTE FUNCTION update_quotation_total();

-- Enable Row Level Security
ALTER TABLE public.quotations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quotation_items ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for quotations
CREATE POLICY "Providers can manage their own quotations" ON public.quotations
  FOR ALL USING (provider_id = auth.uid());

CREATE POLICY "Providers can view their own quotations" ON public.quotations
  FOR SELECT USING (provider_id = auth.uid());

-- Create RLS policies for quotation items
CREATE POLICY "Providers can manage quotation items for their quotations" ON public.quotation_items
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.quotations 
      WHERE quotations.id = quotation_items.quotation_id 
      AND quotations.provider_id = auth.uid()
    )
  );

CREATE POLICY "Providers can view quotation items for their quotations" ON public.quotation_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.quotations 
      WHERE quotations.id = quotation_items.quotation_id 
      AND quotations.provider_id = auth.uid()
    )
  );
