-- Drop existing policies that conflict
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;

-- Clean up existing conflicting tables if they exist
DROP TABLE IF EXISTS buyers CASCADE;
DROP TABLE IF EXISTS sellers CASCADE;
DROP TABLE IF EXISTS service_providers CASCADE;
DROP TABLE IF EXISTS connections CASCADE;
DROP TABLE IF EXISTS interactions CASCADE;
DROP TABLE IF EXISTS messages CASCADE;
DROP TABLE IF EXISTS subscriptions CASCADE;
DROP TABLE IF EXISTS subscription_transactions CASCADE;

-- Core profiles table updates
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS name TEXT,
ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'buyer',
ADD COLUMN IF NOT EXISTS country TEXT,
ADD COLUMN IF NOT EXISTS currency TEXT DEFAULT 'USD',
ADD COLUMN IF NOT EXISTS avatar_url TEXT,
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Add role check constraint
ALTER TABLE profiles ADD CONSTRAINT check_role CHECK (role IN ('buyer', 'seller', 'service_provider'));

-- Create new tables
CREATE TABLE connections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user1_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  user2_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'blocked')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user1_id, user2_id)
);

CREATE TABLE interactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user1_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  user2_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  interaction_type TEXT NOT NULL CHECK (interaction_type IN ('message', 'sale', 'review')),
  content TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  receiver_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Role-specific tables
CREATE TABLE buyers (
  id UUID PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
  preferred_categories TEXT[],
  budget_range TEXT,
  location TEXT
);

CREATE TABLE sellers (
  id UUID PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
  business_name TEXT,
  business_type TEXT,
  products_offered TEXT[],
  rating_avg FLOAT DEFAULT 0
);

CREATE TABLE service_providers (
  id UUID PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
  company_name TEXT,
  services_offered TEXT[],
  hourly_rate NUMERIC,
  location TEXT
);

-- Transactions table
CREATE TABLE transactions (
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
CREATE TABLE subscriptions (
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

-- Subscription transactions table
CREATE TABLE subscription_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subscription_id UUID REFERENCES subscriptions(id) ON DELETE CASCADE,
  payment_provider TEXT CHECK (payment_provider IN ('stripe', 'flutterwave')),
  amount NUMERIC NOT NULL,
  currency TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
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
ALTER TABLE subscription_transactions ENABLE ROW LEVEL SECURITY;

-- Updated RLS Policies for profiles
CREATE POLICY "Updated profiles viewable by everyone" ON profiles FOR SELECT USING (true);
CREATE POLICY "Updated users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Updated users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Policies for new tables
CREATE POLICY "Users can view own connections" ON connections FOR SELECT 
USING (auth.uid() = user1_id OR auth.uid() = user2_id);
CREATE POLICY "Users can create connections" ON connections FOR INSERT 
WITH CHECK (auth.uid() = user1_id);
CREATE POLICY "Users can update own connections" ON connections FOR UPDATE 
USING (auth.uid() = user1_id OR auth.uid() = user2_id);

CREATE POLICY "Users can view own messages" ON messages FOR SELECT 
USING (auth.uid() = sender_id OR auth.uid() = receiver_id);
CREATE POLICY "Users can send messages" ON messages FOR INSERT 
WITH CHECK (auth.uid() = sender_id);
CREATE POLICY "Users can update own messages" ON messages FOR UPDATE 
USING (auth.uid() = receiver_id);

CREATE POLICY "Users can view own buyer profile" ON buyers FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can manage own buyer profile" ON buyers FOR ALL USING (auth.uid() = id);

CREATE POLICY "Sellers are viewable by everyone" ON sellers FOR SELECT USING (true);
CREATE POLICY "Users can manage own seller profile" ON sellers FOR ALL USING (auth.uid() = id);

CREATE POLICY "Service providers are viewable by everyone" ON service_providers FOR SELECT USING (true);
CREATE POLICY "Users can manage own service provider profile" ON service_providers FOR ALL USING (auth.uid() = id);

CREATE POLICY "Users can view own transactions" ON transactions FOR SELECT 
USING (
  auth.uid() IN (
    SELECT id FROM buyers WHERE id = buyer_id
    UNION
    SELECT id FROM sellers WHERE id = seller_id
    UNION
    SELECT id FROM service_providers WHERE id = service_provider_id
  )
);

CREATE POLICY "Users can view own subscriptions" ON subscriptions FOR SELECT 
USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own subscriptions" ON subscriptions FOR ALL 
USING (auth.uid() = user_id);

-- Updated function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_servie_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Update existing profile or insert new one
  INSERT INTO public.profiles (id, name, email, role, country, currency)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.email),
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'role', 'buyer'),
    COALESCE(NEW.raw_user_meta_data->>'country', 'US'),
    COALESCE(NEW.raw_user_meta_data->>'currency', 'USD')
  )
  ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    role = EXCLUDED.role,
    country = EXCLUDED.country,
    currency = EXCLUDED.currency,
    updated_at = NOW();
  
  -- Create role-specific profile
  IF NEW.raw_user_meta_data->>'role' = 'buyer' THEN
    INSERT INTO public.buyers (id) VALUES (NEW.id) ON CONFLICT (id) DO NOTHING;
  ELSIF NEW.raw_user_meta_data->>'role' = 'seller' THEN
    INSERT INTO public.sellers (id) VALUES (NEW.id) ON CONFLICT (id) DO NOTHING;
  ELSIF NEW.raw_user_meta_data->>'role' = 'service_provider' THEN
    INSERT INTO public.service_providers (id) VALUES (NEW.id) ON CONFLICT (id) DO NOTHING;
  END IF;
  
  -- Create default subscription
  INSERT INTO public.subscriptions (user_id, tier, region, currency)
  VALUES (NEW.id, 'free', COALESCE(NEW.raw_user_meta_data->>'country', 'US'), COALESCE(NEW.raw_user_meta_data->>'currency', 'USD'))
  ON CONFLICT DO NOTHING;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update trigger for new user signup
DROP TRIGGER IF EXISTS on_servie_auth_user_created ON auth.users;
CREATE TRIGGER on_servie_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_servie_new_user();