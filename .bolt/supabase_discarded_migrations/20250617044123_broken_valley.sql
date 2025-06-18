/*
  # Lender Portal Database Schema

  1. New Tables
    - `lenders`
      - `id` (uuid, primary key)
      - `email` (text, unique)
      - `full_name` (text)
      - `verified` (boolean, default false)
      - `created_at` (timestamp)
    - `clothing_items`
      - `id` (uuid, primary key)
      - `lender_id` (uuid, foreign key)
      - `title` (text)
      - `description` (text)
      - `category` (text)
      - `size` (text)
      - `price_per_rental` (decimal)
      - `images` (jsonb array)
      - `ai_model_image` (text, nullable)
      - `active` (boolean, default true)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on both tables
    - Add policies for authenticated users to manage their own data
    - Add policy for public read access to active clothing items
*/

-- Create lenders table
CREATE TABLE IF NOT EXISTS lenders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  full_name text NOT NULL,
  verified boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Create clothing_items table
CREATE TABLE IF NOT EXISTS clothing_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lender_id uuid REFERENCES lenders(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text NOT NULL,
  category text NOT NULL,
  size text NOT NULL,
  price_per_rental decimal(10,2) NOT NULL,
  images jsonb DEFAULT '[]'::jsonb,
  ai_model_image text,
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE lenders ENABLE ROW LEVEL SECURITY;
ALTER TABLE clothing_items ENABLE ROW LEVEL SECURITY;

-- Lenders policies
CREATE POLICY "Lenders can read own data"
  ON lenders
  FOR SELECT
  TO authenticated
  USING (auth.uid()::text = id::text);

CREATE POLICY "Lenders can update own data"
  ON lenders
  FOR UPDATE
  TO authenticated
  USING (auth.uid()::text = id::text);

CREATE POLICY "Anyone can create lender profile"
  ON lenders
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid()::text = id::text);

-- Clothing items policies
CREATE POLICY "Lenders can manage own items"
  ON clothing_items
  FOR ALL
  TO authenticated
  USING (lender_id::text = auth.uid()::text);

CREATE POLICY "Public can view active items"
  ON clothing_items
  FOR SELECT
  TO anon, authenticated
  USING (active = true);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for clothing_items
CREATE TRIGGER update_clothing_items_updated_at
  BEFORE UPDATE ON clothing_items
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();