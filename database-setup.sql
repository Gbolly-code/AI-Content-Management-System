-- AI Content Management System - Database Setup
-- Run this in your Supabase SQL Editor

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create content_posts table
CREATE TABLE IF NOT EXISTS content_posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT,
  featured_image TEXT,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  author_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  seo_title TEXT,
  seo_description TEXT,
  tags TEXT[] DEFAULT '{}',
  category TEXT,
  published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_posts ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Anyone can view published posts" ON content_posts;
DROP POLICY IF EXISTS "Users can view own posts" ON content_posts;
DROP POLICY IF EXISTS "Users can create posts" ON content_posts;
DROP POLICY IF EXISTS "Users can update own posts" ON content_posts;
DROP POLICY IF EXISTS "Users can delete own posts" ON content_posts;

-- Create policies for profiles
CREATE POLICY "Users can view all profiles" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Create policies for content_posts
CREATE POLICY "Anyone can view published posts" ON content_posts FOR SELECT USING (status = 'published');
CREATE POLICY "Users can view own posts" ON content_posts FOR SELECT USING (auth.uid() = author_id);
CREATE POLICY "Users can create posts" ON content_posts FOR INSERT WITH CHECK (auth.uid() = author_id);
CREATE POLICY "Users can update own posts" ON content_posts FOR UPDATE USING (auth.uid() = author_id);
CREATE POLICY "Users can delete own posts" ON content_posts FOR DELETE USING (auth.uid() = author_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_content_posts_status ON content_posts(status);
CREATE INDEX IF NOT EXISTS idx_content_posts_author ON content_posts(author_id);
CREATE INDEX IF NOT EXISTS idx_content_posts_published ON content_posts(published_at);
CREATE INDEX IF NOT EXISTS idx_content_posts_slug ON content_posts(slug);
CREATE INDEX IF NOT EXISTS idx_content_posts_category ON content_posts(category);

-- Create function to handle user profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (new.id, new.email, new.raw_user_meta_data->>'full_name');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to automatically create profile on user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers to automatically update updated_at
DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_content_posts_updated_at ON content_posts;
CREATE TRIGGER update_content_posts_updated_at
    BEFORE UPDATE ON content_posts
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data (optional)
-- Uncomment the following lines to add sample content

/*
-- Sample profile (replace with actual user ID from auth.users)
INSERT INTO profiles (id, email, full_name) VALUES 
('your-user-id-here', 'admin@example.com', 'Admin User');

-- Sample blog posts
INSERT INTO content_posts (title, slug, content, excerpt, status, author_id, category, tags, seo_title, seo_description, published_at) VALUES 
(
  'Welcome to AI-Powered Content Management',
  'welcome-to-ai-powered-content-management',
  'This is your first AI-generated blog post. The AI Content Management System makes it easy to create, manage, and optimize content with the power of artificial intelligence. You can generate engaging articles, optimize them for SEO, and publish them with just a few clicks.',
  'Discover how AI can revolutionize your content creation process.',
  'published',
  'your-user-id-here',
  'Technology',
  ARRAY['AI', 'Content Management', 'Technology'],
  'Welcome to AI-Powered Content Management | AI CMS',
  'Discover how AI can revolutionize your content creation process with our powerful CMS.',
  NOW()
),
(
  'The Future of AI in Content Creation',
  'future-of-ai-in-content-creation',
  'Artificial Intelligence is transforming how we create and manage content. From automated writing assistants to SEO optimization tools, AI is helping content creators work more efficiently and produce higher quality content. In this post, we explore the latest trends and technologies shaping the future of content creation.',
  'Explore how AI is revolutionizing content creation and what the future holds.',
  'published',
  'your-user-id-here',
  'AI',
  ARRAY['AI', 'Future', 'Content Creation', 'Technology'],
  'The Future of AI in Content Creation | AI CMS',
  'Explore how AI is revolutionizing content creation and what the future holds for content creators.',
  NOW() - INTERVAL '1 day'
);
*/
