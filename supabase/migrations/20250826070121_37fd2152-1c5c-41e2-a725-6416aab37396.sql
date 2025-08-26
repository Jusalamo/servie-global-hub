-- First, update existing profiles to have valid roles
UPDATE profiles SET role = 'buyer' WHERE role NOT IN ('buyer', 'seller', 'service_provider') OR role IS NULL;

-- Update existing profiles table structure
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS name TEXT,
ADD COLUMN IF NOT EXISTS country TEXT,
ADD COLUMN IF NOT EXISTS currency TEXT DEFAULT 'USD';

-- Update name field for existing users
UPDATE profiles SET name = COALESCE(first_name || ' ' || last_name, email) WHERE name IS NULL;

-- Now add the role constraint
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'check_role' AND table_name = 'profiles'
  ) THEN
    ALTER TABLE profiles ADD CONSTRAINT check_role CHECK (role IN ('buyer', 'seller', 'service_provider'));
  END IF;
END $$;

-- Create the new Servie tables
CREATE TABLE IF NOT EXISTS connections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user1_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  user2_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'blocked')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user1_id, user2_id)
);

CREATE TABLE IF NOT EXISTS interactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user1_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  user2_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  interaction_type TEXT NOT NULL CHECK (interaction_type IN ('message', 'sale', 'review')),
  content TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  receiver_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Role-specific tables
CREATE TABLE IF NOT EXISTS buyers (
  id UUID PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
  preferred_categories TEXT[],
  budget_range TEXT,
  location TEXT
);

CREATE TABLE IF NOT EXISTS sellers (
  id UUID PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
  business_name TEXT,
  business_type TEXT,
  products_offered TEXT[],
  rating_avg FLOAT DEFAULT 0
);

CREATE TABLE IF NOT EXISTS service_providers (
  id UUID PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
  company_name TEXT,
  services_offered TEXT[],
  hourly_rate NUMERIC,
  location TEXT
);

-- Transactions table
CREATE TABLE IF NOT EXISTS transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  buyer_id UUID REFERENCES buyers(id),
  seller_id UUID REFERENCES sellers(id),
  service_provider_id UUID REFERENCES service_providers(id),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'completed', 'cancelled')),
  amount NUMERIC NOT NULL,
  currency TEXT DEFAULT 'USD',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Subscriptions table  
CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  tier TEXT NOT NULL DEFAULT 'free' CHECK (tier IN ('free', 'basic', 'premium')),
  region TEXT,
  currency TEXT DEFAULT 'USD',
  price NUMERIC,
  active BOOLEAN DEFAULT TRUE,
  start_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  end_date TIMESTAMP WITH TIME ZONE
);

-- Enable RLS on new tables
ALTER TABLE connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE buyers ENABLE ROW LEVEL SECURITY;
ALTER TABLE sellers ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_providers ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- Create policies for new tables
CREATE POLICY "Users can view own connections" ON connections FOR SELECT 
USING (auth.uid() = user1_id OR auth.uid() = user2_id);
CREATE POLICY "Users can create connections" ON connections FOR INSERT 
WITH CHECK (auth.uid() = user1_id);

CREATE POLICY "Users can view own messages" ON messages FOR SELECT 
USING (auth.uid() = sender_id OR auth.uid() = receiver_id);
CREATE POLICY "Users can send messages" ON messages FOR INSERT 
WITH CHECK (auth.uid() = sender_id);

CREATE POLICY "Users can view own buyer profile" ON buyers FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can manage own buyer profile" ON buyers FOR ALL USING (auth.uid() = id);

CREATE POLICY "Sellers are viewable by everyone" ON sellers FOR SELECT USING (true);
CREATE POLICY "Users can manage own seller profile" ON sellers FOR ALL USING (auth.uid() = id);

CREATE POLICY "Service providers are viewable by everyone" ON service_providers FOR SELECT USING (true);
CREATE POLICY "Users can manage own service provider profile" ON service_providers FOR ALL USING (auth.uid() = id);

CREATE POLICY "Users can view own subscriptions" ON subscriptions FOR SELECT 
USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own subscriptions" ON subscriptions FOR ALL 
USING (auth.uid() = user_id);

-- Insert role-specific profiles for existing users
INSERT INTO buyers (id) 
SELECT id FROM profiles WHERE role = 'buyer' 
ON CONFLICT (id) DO NOTHING;

INSERT INTO sellers (id) 
SELECT id FROM profiles WHERE role = 'seller' 
ON CONFLICT (id) DO NOTHING;

INSERT INTO service_providers (id) 
SELECT id FROM profiles WHERE role = 'service_provider' 
ON CONFLICT (id) DO NOTHING;