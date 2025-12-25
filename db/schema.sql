-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROFILES TABLE
CREATE TABLE profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    full_name TEXT,
    avatar_url TEXT,
    role TEXT CHECK (role IN ('client', 'engineer')),
    is_verified BOOLEAN DEFAULT false,
    bio TEXT,
    skills TEXT[],
    hourly_rate NUMERIC,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Public profiles are viewable by everyone."
    ON profiles FOR SELECT
    USING (true);

CREATE POLICY "Users can insert their own profile."
    ON profiles FOR INSERT
    WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile."
    ON profiles FOR UPDATE
    USING (auth.uid() = id);

-- 2. PORTFOLIO_ITEMS TABLE
CREATE TABLE portfolio_items (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    engineer_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    client_name TEXT NOT NULL,
    client_logo_url TEXT,
    project_link TEXT,
    platform_type TEXT CHECK (platform_type IN ('Telegram', 'Instagram', 'Web')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE portfolio_items ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Portfolio items are viewable by everyone."
    ON portfolio_items FOR SELECT
    USING (true);

CREATE POLICY "Engineers can manage their own portfolio items."
    ON portfolio_items FOR ALL
    USING (auth.uid() = engineer_id);

-- 3. REQUESTS TABLE (Job Board)
CREATE TABLE requests (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    client_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    budget NUMERIC,
    category TEXT CHECK (category IN ('Vardast Architects', 'AI Image Gen', 'AI Video Gen', 'AI Web/App', 'Automation')),
    status TEXT DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'completed', 'cancelled')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE requests ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Requests are viewable by everyone."
    ON requests FOR SELECT
    USING (true);

CREATE POLICY "Clients can manage their own requests."
    ON requests FOR ALL
    USING (auth.uid() = client_id);

-- 4. MESSAGES TABLE
CREATE TABLE messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    sender_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    receiver_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    content TEXT NOT NULL,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view their own messages."
    ON messages FOR SELECT
    USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

CREATE POLICY "Users can insert messages as sender."
    ON messages FOR INSERT
    WITH CHECK (auth.uid() = sender_id);

-- 5. PRODUCTS TABLE (Store)
CREATE TABLE products (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    engineer_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    price NUMERIC NOT NULL,
    asset_url TEXT, -- Link to the digital asset
    type TEXT CHECK (type IN ('prompt', 'workflow')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Products are viewable by everyone."
    ON products FOR SELECT
    USING (true);

CREATE POLICY "Engineers can manage their own products."
    ON products FOR ALL
    USING (auth.uid() = engineer_id);

-- TRIGGER TO HANDLE NEW USER SIGNUP (Optional but recommended)
-- This assumes that when a user signs up, a profile row is created.
-- In a real Supabase app, you'd often use a database trigger for this.

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url)
  VALUES (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- STORAGE BUCKETS (If using Supabase Storage)
-- You would typically create buckets 'avatars', 'portfolio', 'products' via the dashboard or SQL.
-- Example for avatars:
INSERT INTO storage.buckets (id, name, public) VALUES ('avatars', 'avatars', true) ON CONFLICT DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('portfolio', 'portfolio', true) ON CONFLICT DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('products', 'products', false) ON CONFLICT DO NOTHING; -- Products might be private

-- Storage Policies (Simplified examples)
CREATE POLICY "Avatar images are publicly accessible."
  ON storage.objects FOR SELECT
  USING ( bucket_id = 'avatars' );

CREATE POLICY "Anyone can upload an avatar."
  ON storage.objects FOR INSERT
  WITH CHECK ( bucket_id = 'avatars' AND auth.role() = 'authenticated' );

CREATE POLICY "Portfolio images are publicly accessible."
  ON storage.objects FOR SELECT
  USING ( bucket_id = 'portfolio' );

CREATE POLICY "Authenticated users can upload portfolio images."
  ON storage.objects FOR INSERT
  WITH CHECK ( bucket_id = 'portfolio' AND auth.role() = 'authenticated' );
