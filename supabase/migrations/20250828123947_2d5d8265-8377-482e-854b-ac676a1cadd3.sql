-- Fix security issue: Secure quotations table to prevent customer data exposure
-- Drop any existing policies that might allow public access
DROP POLICY IF EXISTS "Enable read access for all users" ON quotations;
DROP POLICY IF EXISTS "Public can view quotations" ON quotations;
DROP POLICY IF EXISTS "Anyone can view quotations" ON quotations;

-- Ensure RLS is enabled
ALTER TABLE quotations ENABLE ROW LEVEL SECURITY;

-- Remove existing policies and recreate secure ones
DROP POLICY IF EXISTS "Providers can manage their own quotations" ON quotations;

-- Create secure policies for quotations
-- Only providers can view their own quotations
CREATE POLICY "Providers can view their own quotations" 
ON quotations FOR SELECT 
USING (
  provider_id = auth.uid() AND 
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'provider'
  )
);

-- Only providers can create quotations
CREATE POLICY "Providers can create quotations" 
ON quotations FOR INSERT 
WITH CHECK (
  provider_id = auth.uid() AND 
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'provider'
  )
);

-- Only providers can update their own quotations
CREATE POLICY "Providers can update their own quotations" 
ON quotations FOR UPDATE 
USING (
  provider_id = auth.uid() AND 
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'provider'
  )
);

-- Only providers can delete their own quotations
CREATE POLICY "Providers can delete their own quotations" 
ON quotations FOR DELETE 
USING (
  provider_id = auth.uid() AND 
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'provider'
  )
);

-- Also secure quotation_items table
ALTER TABLE quotation_items ENABLE ROW LEVEL SECURITY;

-- Drop existing policies on quotation_items
DROP POLICY IF EXISTS "Providers can manage quotation items for their quotations" ON quotation_items;
DROP POLICY IF EXISTS "Providers can view quotation items for their quotations" ON quotation_items;

-- Create secure policies for quotation_items
CREATE POLICY "Providers can view quotation items for their quotations" 
ON quotation_items FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM quotations 
    WHERE quotations.id = quotation_items.quotation_id 
    AND quotations.provider_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'provider'
    )
  )
);

CREATE POLICY "Providers can manage quotation items for their quotations" 
ON quotation_items FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM quotations 
    WHERE quotations.id = quotation_items.quotation_id 
    AND quotations.provider_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'provider'
    )
  )
);