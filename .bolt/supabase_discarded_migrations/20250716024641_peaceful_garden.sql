/*
  # Create items table for partner clothing listings

  1. New Tables
    - `items`
      - `id` (uuid, primary key)
      - `owner_id` (uuid, references auth.users)
      - `title` (text)
      - `category` (text)
      - `size` (text)
      - `condition` (text)
      - `price` (numeric)
      - `description` (text)
      - `image_url` (text)
      - `ai_preview_url` (text)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `items` table
    - Add policies for authenticated users to manage their own items
*/

CREATE TABLE IF NOT EXISTS items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  category text NOT NULL,
  size text NOT NULL,
  condition text NOT NULL,
  price numeric NOT NULL CHECK (price > 0),
  description text,
  image_url text NOT NULL,
  ai_preview_url text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE items ENABLE ROW LEVEL SECURITY;

-- Policy for users to read their own items
CREATE POLICY "Users can read own items"
  ON items
  FOR SELECT
  TO authenticated
  USING (auth.uid() = owner_id);

-- Policy for users to insert their own items
CREATE POLICY "Users can insert own items"
  ON items
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = owner_id);

-- Policy for users to update their own items
CREATE POLICY "Users can update own items"
  ON items
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = owner_id)
  WITH CHECK (auth.uid() = owner_id);

-- Policy for users to delete their own items
CREATE POLICY "Users can delete own items"
  ON items
  FOR DELETE
  TO authenticated
  USING (auth.uid() = owner_id);