-- Add missing columns to products table
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS category TEXT;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS stock INTEGER DEFAULT 0;

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_products_seller_status ON public.products(seller_id, status);
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category_id);

-- Enable realtime for products table
ALTER TABLE public.products REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.products;