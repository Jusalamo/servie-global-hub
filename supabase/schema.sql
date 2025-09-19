
-- Servie Platform Database Schema

-- Check if extension is already installed before creating
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Profiles table (extends Supabase auth users)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users,
  first_name TEXT,
  last_name TEXT,
  avatar_url TEXT,
  phone TEXT,
  role TEXT NOT NULL DEFAULT 'client' CHECK (role IN ('client', 'provider', 'seller', 'admin')),
  business_name TEXT,
  bio TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Service Providers
CREATE TABLE IF NOT EXISTS providers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users,
  business_name TEXT NOT NULL,
  description TEXT,
  contact_email TEXT NOT NULL,
  contact_phone TEXT,
  address TEXT,
  categories TEXT[] DEFAULT '{}',
  rating DECIMAL(3,2) DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  verified BOOLEAN DEFAULT false,
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Service Categories
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  icon TEXT NOT NULL,
  description TEXT,
  parent_id UUID REFERENCES categories(id),
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Services
CREATE TABLE IF NOT EXISTS services (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  provider_id UUID NOT NULL REFERENCES providers(id),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  duration INTEGER NOT NULL, -- in minutes
  category_id UUID REFERENCES categories(id),
  images TEXT[] DEFAULT '{}',
  rating DECIMAL(3,2) DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  featured BOOLEAN DEFAULT false,
  available_online BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Bookings
CREATE TABLE IF NOT EXISTS bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id UUID NOT NULL REFERENCES auth.users,
  provider_id UUID NOT NULL REFERENCES providers(id),
  service_id UUID NOT NULL REFERENCES services(id),
  status TEXT NOT NULL CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
  date_time TIMESTAMP WITH TIME ZONE NOT NULL,
  duration INTEGER NOT NULL, -- in minutes
  price DECIMAL(10,2) NOT NULL,
  address TEXT NOT NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Product Sellers
CREATE TABLE IF NOT EXISTS sellers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id),
  business_name TEXT NOT NULL,
  description TEXT,
  contact_email TEXT NOT NULL,
  contact_phone TEXT,
  address TEXT,
  categories TEXT[] DEFAULT '{}',
  rating DECIMAL(3,2) DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  verified BOOLEAN DEFAULT false,
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Products
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  seller_id UUID NOT NULL REFERENCES sellers(id),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  compare_at_price DECIMAL(10,2),
  images TEXT[] DEFAULT '{}',
  category_id UUID REFERENCES categories(id),
  inventory INTEGER NOT NULL DEFAULT 0,
  rating DECIMAL(3,2) DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Orders
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users,
  status TEXT NOT NULL CHECK (status IN ('pending', 'processing', 'shipped', 'delivered', 'cancelled')),
  shipping_address JSONB NOT NULL,
  billing_address JSONB NOT NULL,
  payment_method TEXT NOT NULL,
  subtotal DECIMAL(10,2) NOT NULL,
  tax DECIMAL(10,2) NOT NULL,
  shipping DECIMAL(10,2) NOT NULL,
  discount DECIMAL(10,2) NOT NULL DEFAULT 0,
  total DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Order Items
CREATE TABLE IF NOT EXISTS order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id),
  name TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  quantity INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Reviews
CREATE TABLE IF NOT EXISTS reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users,
  target_id UUID NOT NULL,
  target_type TEXT NOT NULL CHECK (target_type IN ('service', 'provider', 'product')),
  rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Conversations
CREATE TABLE IF NOT EXISTS conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  participants UUID[] NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Messages
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  sender UUID NOT NULL REFERENCES users(id),
  recipient UUID NOT NULL REFERENCES users(id),
  content TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('sent', 'delivered', 'read')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Notifications
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('booking', 'message', 'review', 'payment', 'system')),
  read BOOLEAN NOT NULL DEFAULT false,
  related_id UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add necessary indexes for performance
CREATE INDEX IF NOT EXISTS idx_services_provider ON services(provider_id);
CREATE INDEX IF NOT EXISTS idx_services_category ON services(category_id);
CREATE INDEX IF NOT EXISTS idx_bookings_client ON bookings(client_id);
CREATE INDEX IF NOT EXISTS idx_bookings_provider ON bookings(provider_id);
CREATE INDEX IF NOT EXISTS idx_bookings_service ON bookings(service_id);
CREATE INDEX IF NOT EXISTS idx_products_seller ON products(seller_id);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_order_items_order ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_product ON order_items(product_id);
CREATE INDEX IF NOT EXISTS idx_reviews_user ON reviews(user_id);
CREATE INDEX IF NOT EXISTS idx_reviews_target ON reviews(target_id, target_type);
CREATE INDEX IF NOT EXISTS idx_messages_conversation ON messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_messages_sender ON messages(sender);
CREATE INDEX IF NOT EXISTS idx_messages_recipient ON messages(recipient);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id);

-- Row Level Security Policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE providers ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE sellers ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Public read access for services, providers, categories, products, reviews
CREATE POLICY "Public services are viewable by everyone" ON services FOR SELECT USING (true);
CREATE POLICY "Public providers are viewable by everyone" ON providers FOR SELECT USING (true);
CREATE POLICY "Public categories are viewable by everyone" ON categories FOR SELECT USING (true);
CREATE POLICY "Public products are viewable by everyone" ON products FOR SELECT USING (true);
CREATE POLICY "Public reviews are viewable by everyone" ON reviews FOR SELECT USING (true);

-- Profiles can be read by owner
CREATE POLICY "Users can read their own information" ON profiles FOR SELECT USING (auth.uid() = id);

-- Profiles can be updated by owner
CREATE POLICY "Users can update their own information" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Bookings policies
CREATE POLICY "Users can read their own bookings" ON bookings FOR SELECT USING (auth.uid() = client_id);
CREATE POLICY "Providers can read bookings for their services" ON bookings FOR SELECT USING (
  auth.uid() IN (SELECT user_id FROM providers WHERE id = provider_id)
);
CREATE POLICY "Users can create their own bookings" ON bookings FOR INSERT WITH CHECK (auth.uid() = client_id);
CREATE POLICY "Users can update their own bookings" ON bookings FOR UPDATE USING (auth.uid() = client_id);

-- Messages policies
CREATE POLICY "Users can read messages they sent or received" ON messages FOR SELECT USING (
  auth.uid() = sender OR auth.uid() = recipient
);
CREATE POLICY "Users can send messages" ON messages FOR INSERT WITH CHECK (auth.uid() = sender);

-- Notifications policies
CREATE POLICY "Users can read their own notifications" ON notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can mark their own notifications as read" ON notifications FOR UPDATE USING (auth.uid() = user_id);

-- Insert some initial data for categories
INSERT INTO categories (name, icon, description, featured) VALUES
('Cleaning', 'spray-can', 'Home and office cleaning services', true),
('Plumbing', 'droplet', 'All plumbing repair and installation services', true),
('Electrical', 'zap', 'Electrical repair and installation services', true),
('Landscaping', 'plant', 'Lawn care and landscaping services', true),
('HVAC', 'thermometer', 'Heating, ventilation, and air conditioning services', true),
('Carpentry', 'tool', 'Woodworking and carpentry services', false),
('Painting', 'brush', 'Interior and exterior painting services', false),
('Moving', 'truck', 'Moving and packing services', false),
('Pest Control', 'bug', 'Pest extermination and prevention services', false),
('Appliance Repair', 'settings', 'Repair services for household appliances', false),
('Roofing', 'home', 'Roof repair and installation services', false),
('Flooring', 'grid', 'Floor installation and repair services', false),
('Window Cleaning', 'wind', 'Window cleaning and repair services', false),
('Pool Services', 'droplets', 'Swimming pool maintenance and repair', false)
ON CONFLICT (name) DO NOTHING;
