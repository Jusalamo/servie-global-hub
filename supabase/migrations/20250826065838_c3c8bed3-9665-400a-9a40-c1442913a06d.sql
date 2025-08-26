-- Core profiles table (extends Supabase auth)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('buyer', 'seller', 'service_provider')),
  country TEXT,
  currency TEXT DEFAULT 'USD',
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Connections table
CREATE TABLE IF NOT EXISTS connections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user1_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  user2_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'blocked')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user1_id, user2_id)
);

-- Interactions table
CREATE TABLE IF NOT EXISTS interactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user1_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  user2_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  interaction_type TEXT NOT NULL CHECK (interaction_type IN ('message', 'sale', 'review')),
  content TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Reviews table
CREATE TABLE IF NOT EXISTS reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reviewer_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  reviewee_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Messages table
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  receiver_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('message', 'review', 'connection', 'transaction')),
  message TEXT NOT NULL,
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

-- Subscription transactions table
CREATE TABLE IF NOT EXISTS subscription_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subscription_id UUID REFERENCES subscriptions(id) ON DELETE CASCADE,
  payment_provider TEXT CHECK (payment_provider IN ('stripe', 'flutterwave')),
  amount NUMERIC NOT NULL,
  currency TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE buyers ENABLE ROW LEVEL SECURITY;
ALTER TABLE sellers ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_providers ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscription_transactions ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Profiles: users can view all profiles but only update their own
CREATE POLICY "Profiles are viewable by everyone" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Connections: users can manage their own connections
CREATE POLICY "Users can view own connections" ON connections FOR SELECT 
USING (auth.uid() = user1_id OR auth.uid() = user2_id);
CREATE POLICY "Users can create connections" ON connections FOR INSERT 
WITH CHECK (auth.uid() = user1_id);
CREATE POLICY "Users can update own connections" ON connections FOR UPDATE 
USING (auth.uid() = user1_id OR auth.uid() = user2_id);

-- Messages: users can view messages they sent or received
CREATE POLICY "Users can view own messages" ON messages FOR SELECT 
USING (auth.uid() = sender_id OR auth.uid() = receiver_id);
CREATE POLICY "Users can send messages" ON messages FOR INSERT 
WITH CHECK (auth.uid() = sender_id);
CREATE POLICY "Users can update own messages" ON messages FOR UPDATE 
USING (auth.uid() = receiver_id);

-- Notifications: users can view their own notifications
CREATE POLICY "Users can view own notifications" ON notifications FOR SELECT 
USING (auth.uid() = user_id);
CREATE POLICY "Users can update own notifications" ON notifications FOR UPDATE 
USING (auth.uid() = user_id);

-- Reviews: anyone can view, users can create reviews
CREATE POLICY "Reviews are viewable by everyone" ON reviews FOR SELECT USING (true);
CREATE POLICY "Users can create reviews" ON reviews FOR INSERT 
WITH CHECK (auth.uid() = reviewer_id);

-- Role-specific policies
CREATE POLICY "Users can view own buyer profile" ON buyers FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own buyer profile" ON buyers FOR ALL USING (auth.uid() = id);

CREATE POLICY "Sellers are viewable by everyone" ON sellers FOR SELECT USING (true);
CREATE POLICY "Users can update own seller profile" ON sellers FOR ALL USING (auth.uid() = id);

CREATE POLICY "Service providers are viewable by everyone" ON service_providers FOR SELECT USING (true);
CREATE POLICY "Users can update own service provider profile" ON service_providers FOR ALL USING (auth.uid() = id);

-- Transactions: users can view transactions they're involved in
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

-- Subscriptions: users can view their own subscriptions
CREATE POLICY "Users can view own subscriptions" ON subscriptions FOR SELECT 
USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own subscriptions" ON subscriptions FOR ALL 
USING (auth.uid() = user_id);

-- Subscription transactions: users can view their own subscription transactions
CREATE POLICY "Users can view own subscription transactions" ON subscription_transactions FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM subscriptions 
    WHERE subscriptions.id = subscription_id 
    AND subscriptions.user_id = auth.uid()
  )
);

-- Function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, name, email, role, country, currency)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.email),
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'role', 'buyer'),
    COALESCE(NEW.raw_user_meta_data->>'country', 'US'),
    COALESCE(NEW.raw_user_meta_data->>'currency', 'USD')
  );
  
  -- Create role-specific profile
  IF NEW.raw_user_meta_data->>'role' = 'buyer' THEN
    INSERT INTO public.buyers (id) VALUES (NEW.id);
  ELSIF NEW.raw_user_meta_data->>'role' = 'seller' THEN
    INSERT INTO public.sellers (id) VALUES (NEW.id);
  ELSIF NEW.raw_user_meta_data->>'role' = 'service_provider' THEN
    INSERT INTO public.service_providers (id) VALUES (NEW.id);
  END IF;
  
  -- Create default subscription
  INSERT INTO public.subscriptions (user_id, tier, region, currency)
  VALUES (NEW.id, 'free', COALESCE(NEW.raw_user_meta_data->>'country', 'US'), COALESCE(NEW.raw_user_meta_data->>'currency', 'USD'));
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_connections_users ON connections(user1_id, user2_id);
CREATE INDEX IF NOT EXISTS idx_messages_conversation ON messages(sender_id, receiver_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_reviews_reviewee ON reviews(reviewee_id);
CREATE INDEX IF NOT EXISTS idx_transactions_buyer ON transactions(buyer_id);
CREATE INDEX IF NOT EXISTS idx_transactions_seller ON transactions(seller_id);
CREATE INDEX IF NOT EXISTS idx_transactions_provider ON transactions(service_provider_id);