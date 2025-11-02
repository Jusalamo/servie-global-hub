
-- Create financial_documents table (missing table causing errors)
CREATE TABLE IF NOT EXISTS public.financial_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  client_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  client_name TEXT NOT NULL,
  client_email TEXT,
  client_phone TEXT,
  client_address TEXT,
  document_type TEXT NOT NULL CHECK (document_type IN ('quotation', 'invoice', 'receipt', 'deposit_slip', 'payment_voucher', 'credit_note', 'delivery_note')),
  document_number TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  description TEXT,
  issue_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  due_date TIMESTAMP WITH TIME ZONE,
  valid_until TIMESTAMP WITH TIME ZONE,
  currency TEXT NOT NULL DEFAULT 'USD',
  subtotal NUMERIC(12, 2) NOT NULL DEFAULT 0,
  tax_percentage NUMERIC(5, 2) NOT NULL DEFAULT 0,
  tax_amount NUMERIC(12, 2) NOT NULL DEFAULT 0,
  discount_percentage NUMERIC(5, 2) NOT NULL DEFAULT 0,
  discount_amount NUMERIC(12, 2) NOT NULL DEFAULT 0,
  total_amount NUMERIC(12, 2) NOT NULL DEFAULT 0,
  amount_paid NUMERIC(12, 2) NOT NULL DEFAULT 0,
  balance_due NUMERIC(12, 2) NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'viewed', 'paid', 'overdue', 'cancelled', 'archived')),
  line_items JSONB NOT NULL DEFAULT '[]'::jsonb,
  notes TEXT,
  terms_conditions TEXT,
  payment_instructions TEXT,
  payment_method TEXT,
  related_document_id UUID REFERENCES public.financial_documents(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  sent_at TIMESTAMP WITH TIME ZONE,
  viewed_at TIMESTAMP WITH TIME ZONE,
  paid_at TIMESTAMP WITH TIME ZONE
);

-- Add index for better performance
CREATE INDEX IF NOT EXISTS idx_financial_documents_provider_id ON public.financial_documents(provider_id);
CREATE INDEX IF NOT EXISTS idx_financial_documents_client_id ON public.financial_documents(client_id);
CREATE INDEX IF NOT EXISTS idx_financial_documents_status ON public.financial_documents(status);
CREATE INDEX IF NOT EXISTS idx_financial_documents_document_type ON public.financial_documents(document_type);

-- Enable RLS
ALTER TABLE public.financial_documents ENABLE ROW LEVEL SECURITY;

-- RLS Policies for financial_documents
CREATE POLICY "Providers can view their own documents"
  ON public.financial_documents
  FOR SELECT
  USING (auth.uid() = provider_id);

CREATE POLICY "Providers can create their own documents"
  ON public.financial_documents
  FOR INSERT
  WITH CHECK (auth.uid() = provider_id);

CREATE POLICY "Providers can update their own documents"
  ON public.financial_documents
  FOR UPDATE
  USING (auth.uid() = provider_id);

CREATE POLICY "Providers can delete their own documents"
  ON public.financial_documents
  FOR DELETE
  USING (auth.uid() = provider_id);

CREATE POLICY "Clients can view documents addressed to them"
  ON public.financial_documents
  FOR SELECT
  USING (auth.uid() = client_id);

-- Function to generate unique document numbers
CREATE OR REPLACE FUNCTION generate_document_number(doc_type TEXT)
RETURNS TEXT AS $$
DECLARE
  prefix TEXT;
  next_num INTEGER;
  doc_number TEXT;
BEGIN
  -- Set prefix based on document type
  prefix := CASE doc_type
    WHEN 'quotation' THEN 'QUO'
    WHEN 'invoice' THEN 'INV'
    WHEN 'receipt' THEN 'RCP'
    WHEN 'deposit_slip' THEN 'DEP'
    WHEN 'payment_voucher' THEN 'PV'
    WHEN 'credit_note' THEN 'CN'
    WHEN 'delivery_note' THEN 'DN'
    ELSE 'DOC'
  END;
  
  -- Get next number for this document type
  SELECT COALESCE(MAX(
    NULLIF(
      regexp_replace(document_number, '[^0-9]', '', 'g'), 
      ''
    )::INTEGER
  ), 0) + 1
  INTO next_num
  FROM financial_documents
  WHERE document_type = doc_type;
  
  -- Format: PREFIX-YYYY-NNNNN
  doc_number := prefix || '-' || TO_CHAR(NOW(), 'YYYY') || '-' || LPAD(next_num::TEXT, 5, '0');
  
  RETURN doc_number;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-generate document numbers
CREATE OR REPLACE FUNCTION set_document_number()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.document_number IS NULL OR NEW.document_number = '' THEN
    NEW.document_number := generate_document_number(NEW.document_type);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_document_number_trigger
  BEFORE INSERT ON public.financial_documents
  FOR EACH ROW
  EXECUTE FUNCTION set_document_number();

-- Trigger for updated_at
CREATE TRIGGER update_financial_documents_updated_at
  BEFORE UPDATE ON public.financial_documents
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Fix profiles table trigger to ensure it creates profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (
    id,
    first_name,
    last_name,
    role,
    phone,
    business_name,
    bio
  )
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'first_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'last_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'role', 'client'),
    COALESCE(NEW.raw_user_meta_data->>'phone', ''),
    COALESCE(NEW.raw_user_meta_data->>'business_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'business_description', '')
  )
  ON CONFLICT (id) DO UPDATE SET
    first_name = COALESCE(EXCLUDED.first_name, profiles.first_name),
    last_name = COALESCE(EXCLUDED.last_name, profiles.last_name),
    role = COALESCE(EXCLUDED.role, profiles.role),
    phone = COALESCE(EXCLUDED.phone, profiles.phone),
    business_name = COALESCE(EXCLUDED.business_name, profiles.business_name),
    bio = COALESCE(EXCLUDED.bio, profiles.bio),
    updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop and recreate trigger to ensure it's active
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Ensure seller_wallets are created for sellers
CREATE OR REPLACE FUNCTION create_seller_wallet()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.role = 'seller' THEN
    INSERT INTO public.seller_wallets (seller_id, balance, commission_deposit)
    VALUES (NEW.id, 0, 0)
    ON CONFLICT (seller_id) DO NOTHING;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS create_seller_wallet_trigger ON public.profiles;
CREATE TRIGGER create_seller_wallet_trigger
  AFTER INSERT OR UPDATE OF role ON public.profiles
  FOR EACH ROW
  WHEN (NEW.role = 'seller')
  EXECUTE FUNCTION create_seller_wallet();
