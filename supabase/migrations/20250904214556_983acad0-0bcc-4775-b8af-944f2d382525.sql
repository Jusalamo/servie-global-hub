-- Create a security definer function to get current user role safely
-- This prevents infinite recursion issues in RLS policies
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS TEXT AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid();
$$ LANGUAGE SQL SECURITY DEFINER STABLE SET search_path = public;

-- Drop existing quotations policies to recreate them with better security
DROP POLICY IF EXISTS "Providers can create quotations" ON public.quotations;
DROP POLICY IF EXISTS "Providers can view their own quotations" ON public.quotations;
DROP POLICY IF EXISTS "Providers can update their own quotations" ON public.quotations;
DROP POLICY IF EXISTS "Providers can delete their own quotations" ON public.quotations;

-- Create improved RLS policies for quotations table using the security definer function
CREATE POLICY "Providers can create quotations" 
ON public.quotations 
FOR INSERT 
TO authenticated
WITH CHECK (
  provider_id = auth.uid() 
  AND public.get_current_user_role() = 'provider'
);

CREATE POLICY "Providers can view their own quotations" 
ON public.quotations 
FOR SELECT 
TO authenticated
USING (
  provider_id = auth.uid() 
  AND public.get_current_user_role() = 'provider'
);

CREATE POLICY "Providers can update their own quotations" 
ON public.quotations 
FOR UPDATE 
TO authenticated
USING (
  provider_id = auth.uid() 
  AND public.get_current_user_role() = 'provider'
)
WITH CHECK (
  provider_id = auth.uid() 
  AND public.get_current_user_role() = 'provider'
);

CREATE POLICY "Providers can delete their own quotations" 
ON public.quotations 
FOR DELETE 
TO authenticated
USING (
  provider_id = auth.uid() 
  AND public.get_current_user_role() = 'provider'
);

-- Add additional security: Create a policy for admins to view all quotations if needed
CREATE POLICY "Admins can view all quotations" 
ON public.quotations 
FOR SELECT 
TO authenticated
USING (public.get_current_user_role() = 'admin');

-- Apply the same security approach to quotation_items table
DROP POLICY IF EXISTS "Providers can manage quotation items for their quotations" ON public.quotation_items;
DROP POLICY IF EXISTS "Providers can view quotation items for their quotations" ON public.quotation_items;

CREATE POLICY "Providers can manage quotation items for their quotations" 
ON public.quotation_items 
FOR ALL 
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.quotations 
    WHERE quotations.id = quotation_items.quotation_id 
    AND quotations.provider_id = auth.uid()
  )
  AND public.get_current_user_role() = 'provider'
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.quotations 
    WHERE quotations.id = quotation_items.quotation_id 
    AND quotations.provider_id = auth.uid()
  )
  AND public.get_current_user_role() = 'provider'
);