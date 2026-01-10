# Supabase Setup Guide

This guide will help you set up Supabase for your blog application.

## Step 1: Create Supabase Project

1. Go to [https://app.supabase.com](https://app.supabase.com)
2. Sign up or log in
3. Click "New Project"
4. Fill in:
   - **Name**: `mj-blog` (or your preferred name)
   - **Database Password**: Choose a strong password (save it!)
   - **Region**: Choose closest to you
   - **Pricing Plan**: Free tier is sufficient

## Step 2: Get API Credentials

1. In your Supabase project dashboard, go to **Settings** → **API**
2. Copy:
   - **Project URL** (e.g., `https://xxxxxxxxxxxxx.supabase.co`)
   - **anon/public key** (starts with `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`)

## Step 3: Set Environment Variables

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` and add your Supabase credentials:
   ```
   VITE_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

## Step 4: Create Database Schema

Run this SQL in Supabase SQL Editor (Settings → SQL Editor):

```sql
-- Create blogs table
CREATE TABLE IF NOT EXISTS blogs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  emoji TEXT NOT NULL DEFAULT '📝',
  cover_image TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  published_date DATE NOT NULL,
  blocks JSONB NOT NULL DEFAULT '[]'::jsonb,
  is_published BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  author_id UUID REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_blogs_published ON blogs(is_published, published_date DESC);
CREATE INDEX IF NOT EXISTS idx_blogs_author ON blogs(author_id);

-- Enable Row Level Security (RLS)
ALTER TABLE blogs ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can read published blogs
CREATE POLICY "Anyone can read published blogs"
  ON blogs FOR SELECT
  USING (is_published = true);

-- Policy: Authenticated users can insert blogs
CREATE POLICY "Authenticated users can insert blogs"
  ON blogs FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- Policy: Users can update their own blogs
CREATE POLICY "Users can update their own blogs"
  ON blogs FOR UPDATE
  USING (auth.uid() = author_id);

-- Policy: Users can delete their own blogs
CREATE POLICY "Users can delete their own blogs"
  ON blogs FOR DELETE
  USING (auth.uid() = author_id);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update updated_at
CREATE TRIGGER update_blogs_updated_at
  BEFORE UPDATE ON blogs
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

## Step 5: Create Storage Bucket for Images

1. Go to **Storage** in Supabase dashboard
2. Click **New bucket**
3. Name: `blog-images`
4. **Public bucket**: ✅ Yes (so images can be accessed publicly)
5. Click **Create bucket**

6. Set up storage policy (Storage → Policies → blog-images → New Policy):

```sql
-- Allow public read access
CREATE POLICY "Public read access"
ON storage.objects FOR SELECT
USING (bucket_id = 'blog-images');

-- Allow authenticated users to upload
CREATE POLICY "Authenticated users can upload"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'blog-images' 
  AND auth.role() = 'authenticated'
);

-- Allow authenticated users to update their uploads
CREATE POLICY "Authenticated users can update"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'blog-images' 
  AND auth.role() = 'authenticated'
);

-- Allow authenticated users to delete their uploads
CREATE POLICY "Authenticated users can delete"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'blog-images' 
  AND auth.role() = 'authenticated'
);
```

## Step 6: Set Up Authentication (Single Admin)

1. Go to **Authentication** → **Users**
2. Click **Add user** → **Create new user**
3. Enter your email and password
4. **Auto Confirm User**: ✅ Yes (for single admin, no email verification needed)

## Step 7: Test Connection

After setting up, restart your dev server:
```bash
npm run dev
```

The app should now connect to Supabase!

## Troubleshooting

- **"Invalid API key"**: Check your `.env` file has correct values
- **"RLS policy violation"**: Make sure you're authenticated and policies are set correctly
- **"Storage bucket not found"**: Verify bucket name is exactly `blog-images`

