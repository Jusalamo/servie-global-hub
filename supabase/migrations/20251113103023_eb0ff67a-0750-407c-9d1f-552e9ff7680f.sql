-- Add stock/inventory management fields
ALTER TABLE services ADD COLUMN IF NOT EXISTS stock_quantity INTEGER DEFAULT NULL;
ALTER TABLE services ADD COLUMN IF NOT EXISTS stock_status TEXT DEFAULT 'available' CHECK (stock_status IN ('available', 'low-stock', 'out-of-stock', 'unavailable'));
ALTER TABLE services ADD COLUMN IF NOT EXISTS category TEXT;

-- Update products stock_status if not exists
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'stock_status') THEN
    ALTER TABLE products ADD COLUMN stock_status TEXT DEFAULT 'in-stock' CHECK (stock_status IN ('in-stock', 'low-stock', 'out-of-stock', 'unavailable'));
  END IF;
END $$;

-- Add branding settings to profiles
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS company_name TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS company_logo_url TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS brand_color_primary TEXT DEFAULT 'hsl(var(--primary))';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS brand_color_accent TEXT DEFAULT 'hsl(var(--accent))';

-- Create expanded service categories table
CREATE TABLE IF NOT EXISTS service_categories_expanded (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  parent_category TEXT,
  icon TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS on service_categories_expanded
ALTER TABLE service_categories_expanded ENABLE ROW LEVEL SECURITY;

-- Anyone can view categories
CREATE POLICY "Anyone can view service categories expanded" 
  ON service_categories_expanded FOR SELECT 
  USING (true);

-- Only admins can modify categories
CREATE POLICY "Only admins can modify service categories expanded" 
  ON service_categories_expanded FOR ALL 
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Insert expanded categories
INSERT INTO service_categories_expanded (name, description, parent_category, icon) VALUES
-- Digital & Online Services
('Web Development', 'Website creation, maintenance, and optimization', 'Digital Services', 'Code'),
('App Development', 'Mobile and desktop application development', 'Digital Services', 'Smartphone'),
('Design & Graphics', 'Logo design, branding, illustrations', 'Digital Services', 'Palette'),
('Writing & Translation', 'Content writing, copywriting, translation services', 'Digital Services', 'BookOpen'),
('Marketing & SEO', 'Digital marketing, SEO optimization, social media', 'Digital Services', 'Megaphone'),
('Video & Animation', 'Video editing, animation, motion graphics', 'Digital Services', 'Video'),
('Audio & Music Production', 'Audio editing, music production, voice-over', 'Digital Services', 'Music'),
('Business Consulting', 'Strategy, operations, business planning', 'Digital Services', 'Briefcase'),
('Virtual Assistance', 'Administrative support, data entry, scheduling', 'Digital Services', 'UserCog'),

-- Home & Local Tasks
('Cleaning Services', 'Home cleaning, deep cleaning, office cleaning', 'Home Services', 'Home'),
('Moving Help', 'Packing, loading, moving assistance', 'Home Services', 'Truck'),
('Handyman Services', 'General repairs, installations, maintenance', 'Home Services', 'Wrench'),
('Plumbing Services', 'Pipe repairs, installations, drainage', 'Home Services', 'Droplets'),
('Painting Services', 'Interior and exterior painting', 'Home Services', 'Palette'),
('Electrical Work', 'Wiring, installations, electrical repairs', 'Home Services', 'Zap'),
('Gardening & Yard Work', 'Landscaping, lawn care, garden maintenance', 'Home Services', 'Sprout'),
('Event Setup', 'Event planning, decoration, setup services', 'Home Services', 'CalendarClock'),
('Delivery & Errands', 'Package delivery, shopping, errand running', 'Home Services', 'Truck'),
('Furniture Assembly', 'Assembly and installation of furniture', 'Home Services', 'Hammer'),

-- Education & Coaching
('Tutoring', 'Academic tutoring, homework help', 'Education', 'GraduationCap'),
('Language Lessons', 'Language teaching and conversation practice', 'Education', 'Globe'),
('Music Lessons', 'Instrument lessons, vocal training', 'Education', 'Music'),
('Fitness Coaching', 'Personal training, workout plans', 'Education', 'Dumbbell'),
('Personal Development', 'Life coaching, career counseling', 'Education', 'Target'),

-- Retail & Product-Based
('Handmade Goods', 'Crafts, custom-made items', 'Retail', 'Gift'),
('Art & Crafts', 'Artwork, sculptures, decorative items', 'Retail', 'Palette'),
('Fashion & Apparel', 'Clothing, accessories, custom tailoring', 'Retail', 'Shirt'),
('Beauty Products', 'Cosmetics, skincare, beauty items', 'Retail', 'Heart'),
('Electronics', 'Gadgets, computers, electronic devices', 'Retail', 'Laptop'),
('Home Décor', 'Furniture, decorations, home accessories', 'Retail', 'Home'),
('Tools & Equipment', 'Hardware tools, equipment rental', 'Retail', 'Wrench')
ON CONFLICT DO NOTHING;