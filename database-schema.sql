-- Assist App Database Schema
-- Run this in your Supabase SQL editor

-- Create users table
CREATE TABLE public.users (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create categories table
CREATE TABLE public.categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  icon TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create requests table
CREATE TABLE public.requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  category_id UUID REFERENCES public.categories(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  location TEXT NOT NULL,
  status TEXT DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'completed', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create offers table
CREATE TABLE public.offers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  request_id UUID REFERENCES public.requests(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert sample categories
INSERT INTO public.categories (name, description, icon) VALUES
('Home & Garden', 'Help with household tasks and gardening', '🏠'),
('Technology', 'Computer, phone, and tech support', '💻'),
('Transportation', 'Rides, moving help, and delivery', '🚗'),
('Education', 'Tutoring, language learning, and skills', '📚'),
('Health & Wellness', 'Fitness, mental health, and wellness', '💪'),
('Business', 'Professional services and business help', '💼'),
('Events', 'Party planning, event coordination', '🎉'),
('Other', 'Miscellaneous help and support', '🤝');

-- Enable Row Level Security on our tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.offers ENABLE ROW LEVEL SECURITY;

-- Row Level Security Policies

-- Users can only see their own profile
CREATE POLICY "Users can view own profile" ON public.users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.users
  FOR UPDATE USING (auth.uid() = id);

-- Anyone can view categories
CREATE POLICY "Anyone can view categories" ON public.categories
  FOR SELECT USING (true);

-- Users can view all requests
CREATE POLICY "Anyone can view requests" ON public.requests
  FOR SELECT USING (true);

-- Users can only create requests for themselves
CREATE POLICY "Users can create own requests" ON public.requests
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can only update their own requests
CREATE POLICY "Users can update own requests" ON public.requests
  FOR UPDATE USING (auth.uid() = user_id);

-- Users can view all offers
CREATE POLICY "Anyone can view offers" ON public.offers
  FOR SELECT USING (true);

-- Users can create offers
CREATE POLICY "Users can create offers" ON public.offers
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update their own offers
CREATE POLICY "Users can update own offers" ON public.offers
  FOR UPDATE USING (auth.uid() = user_id);

-- Function to handle user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create user profile on signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
