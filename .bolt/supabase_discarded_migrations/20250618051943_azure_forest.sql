/*
  # Create bookings table for rental management

  1. New Tables
    - `bookings`
      - `id` (uuid, primary key)
      - `item_id` (uuid, foreign key to clothing_items)
      - `customer_email` (text)
      - `customer_name` (text)
      - `customer_phone` (text)
      - `start_date` (date)
      - `end_date` (date)
      - `destination` (text)
      - `total_price` (decimal)
      - `status` (text) - pending, confirmed, completed, cancelled
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `bookings` table
    - Add policies for reading bookings (for availability checking)
    - Add policy for creating bookings (public access for customers)

  3. Indexes
    - Add indexes for efficient date range queries
    - Add index on item_id for quick availability lookups
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
  total_price decimal(10,2) NOT NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Policy for reading bookings (needed for availability checking)
CREATE POLICY "Anyone can read bookings for availability"
  ON bookings
  FOR SELECT
  TO public
  USING (true);

-- Policy for creating bookings (customers can create bookings)
CREATE POLICY "Anyone can create bookings"
  ON bookings
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Policy for lenders to see bookings for their items
CREATE POLICY "Lenders can see bookings for their items"
  ON bookings
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM clothing_items 
      WHERE clothing_items.id = bookings.item_id 
      AND clothing_items.lender_id = auth.uid()
    )
  );

-- Policy for lenders to update booking status
CREATE POLICY "Lenders can update booking status for their items"
  ON bookings
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM clothing_items 
      WHERE clothing_items.id = bookings.item_id 
      AND clothing_items.lender_id = auth.uid()
    )
  );

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_bookings_item_id ON bookings(item_id);
CREATE INDEX IF NOT EXISTS idx_bookings_dates ON bookings(start_date, end_date);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to automatically update updated_at
CREATE TRIGGER update_bookings_updated_at
  BEFORE UPDATE ON bookings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();