-- Add unique constraint to service_categories_expanded name column if not exists
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'service_categories_expanded_name_key'
  ) THEN
    ALTER TABLE service_categories_expanded 
    ADD CONSTRAINT service_categories_expanded_name_key UNIQUE (name);
  END IF;
END $$;

-- Insert expanded service categories (only if they don't exist)
INSERT INTO service_categories_expanded (name, description, icon, parent_category)
SELECT * FROM (VALUES
  -- Digital & Online Services
  ('Web Development', 'Website creation, full-stack development, e-commerce sites', 'Code', 'Digital Services'),
  ('App Development', 'Mobile apps, web apps, custom software solutions', 'Smartphone', 'Digital Services'),
  ('Design & Graphics', 'Logo design, branding, UI/UX, illustrations', 'Palette', 'Digital Services'),
  ('Writing & Translation', 'Content writing, copywriting, translation services', 'ScrollText', 'Digital Services'),
  ('Marketing & SEO', 'Digital marketing, social media, search engine optimization', 'Megaphone', 'Digital Services'),
  ('Video & Animation', 'Video editing, motion graphics, 3D animation', 'Video', 'Digital Services'),
  ('Audio & Music Production', 'Music production, audio editing, voice-over', 'Music', 'Digital Services'),
  ('Business Consulting', 'Strategy, management consulting, business planning', 'Briefcase', 'Digital Services'),
  ('Virtual Assistance', 'Administrative support, data entry, customer service', 'UserCog', 'Digital Services'),
  
  -- Home & Local Tasks
  ('Cleaning', 'House cleaning, deep cleaning, office cleaning', 'Home', 'Home Services'),
  ('Moving Help', 'Packing, loading, furniture moving assistance', 'Truck', 'Home Services'),
  ('Handyman', 'General repairs, installations, maintenance', 'Wrench', 'Home Services'),
  ('Plumbing', 'Pipe repairs, installations, leak fixing', 'Wrench', 'Home Services'),
  ('Painting', 'Interior/exterior painting, wall treatments', 'Palette', 'Home Services'),
  ('Electrical Work', 'Wiring, installations, electrical repairs', 'Zap', 'Home Services'),
  ('Gardening & Yard Work', 'Lawn care, landscaping, tree trimming', 'Sprout', 'Home Services'),
  ('Event Setup', 'Party setup, event decoration, equipment rental', 'Calendar', 'Home Services'),
  ('Delivery/Errands', 'Package delivery, shopping, pickup services', 'Truck', 'Home Services'),
  ('Furniture Assembly', 'IKEA assembly, furniture setup, installation', 'Hammer', 'Home Services'),
  
  -- Education & Coaching
  ('Tutoring', 'Academic tutoring, test prep, homework help', 'GraduationCap', 'Education'),
  ('Language Lessons', 'English, Spanish, French, language instruction', 'Globe', 'Education'),
  ('Music Lessons', 'Piano, guitar, vocal, instrument instruction', 'Music', 'Education'),
  ('Fitness Coaching', 'Personal training, workout plans, nutrition', 'Dumbbell', 'Education'),
  ('Personal Development', 'Life coaching, career coaching, mentorship', 'Target', 'Education'),
  
  -- Retail & Product-Based
  ('Handmade Goods', 'Crafts, handmade items, custom creations', 'Gift', 'Products'),
  ('Art & Crafts', 'Paintings, sculptures, custom artwork', 'Palette', 'Products'),
  ('Fashion', 'Clothing, accessories, custom tailoring', 'Shirt', 'Products'),
  ('Beauty Products', 'Cosmetics, skincare, beauty supplies', 'Heart', 'Products'),
  ('Electronics', 'Gadgets, computers, tech accessories', 'Laptop', 'Products'),
  ('Home Décor', 'Furniture, decorations, home accessories', 'Home', 'Products'),
  ('Tools & Equipment', 'Power tools, equipment rental, supplies', 'Wrench', 'Products')
) AS v(name, description, icon, parent_category)
WHERE NOT EXISTS (
  SELECT 1 FROM service_categories_expanded 
  WHERE service_categories_expanded.name = v.name
);