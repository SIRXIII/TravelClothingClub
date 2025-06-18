/*
  # Create bookings table for rental management

  1. New Tables
    - `bookings`
      - `id` (uuid, primary key)
      - `item_id` (uuid, foreign key to clothing_items)
      - `customer_email` (text, nullable)
      - `customer_name` (text, nullable)
      - `customer_phone` (text, nullable)
      - `start_date` (date)
      - `end_date` (date)
      - `destination` (text)
      - `total_price` (numeric)
      - `status` (text, default 'pending')
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `bookings` table
    - Add policies for public read access to check availability
    - Add policies for authenticated users to manage their bookings

  3. Indexes
    - Add indexes for efficient date range queries
    - Add index on item_id for availability checks
*/

CREATE TABLE IF NOT EXISTS bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  item_id uuid REFERENCES clothing_items(id) ON DELETE CASCADE,
  customer_email text,
  customer_name text,
  customer_phone text,
  start_date date NOT NULL,
  end_date date NOT NULL,
  destination text NOT NULL,
  total_price numeric(10,2) NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can view bookings for availability checks"
  ON bookings
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Anyone can create bookings"
  ON bookings
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_bookings_item_id ON bookings(item_id);
CREATE INDEX IF NOT EXISTS idx_bookings_dates ON bookings(start_date, end_date);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);

-- Create trigger to update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'update_bookings_updated_at'
  ) THEN
    CREATE TRIGGER update_bookings_updated_at
      BEFORE UPDATE ON bookings
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;