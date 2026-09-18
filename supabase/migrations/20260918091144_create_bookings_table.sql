/*
# Create bookings table for farmer procurement bookings

1. New Tables
- `bookings`
  - `id` (uuid, primary key)
  - `token` (text, unique token number e.g. KN1234)
  - `crop` (text, crop name)
  - `quantity` (text, quantity with unit e.g. "500 kg")
  - `mandi` (text, mandi/procurement center name)
  - `date` (text, booking date)
  - `time` (text, time slot)
  - `status` (text, booking status: confirmed, in-queue, procured, paid, cancelled)
  - `farmer_name` (text, farmer name)
  - `farmer_id` (text, farmer ID e.g. FRM-2045)
  - `pincode` (text, optional pincode used for mandi search)
  - `created_at` (timestamp, record creation time)

2. Security
- Enable RLS on `bookings`.
- Allow anon + authenticated CRUD since this is a no-auth prototype app with simulated login.
*/

CREATE TABLE IF NOT EXISTS bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  token text UNIQUE NOT NULL,
  crop text NOT NULL,
  quantity text NOT NULL,
  mandi text NOT NULL,
  date text NOT NULL,
  time text NOT NULL,
  status text NOT NULL DEFAULT 'confirmed',
  farmer_name text DEFAULT 'Ramesh Singh',
  farmer_id text DEFAULT 'FRM-2045',
  pincode text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_bookings" ON bookings;
CREATE POLICY "anon_select_bookings" ON bookings FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_bookings" ON bookings;
CREATE POLICY "anon_insert_bookings" ON bookings FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_bookings" ON bookings;
CREATE POLICY "anon_update_bookings" ON bookings FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_bookings" ON bookings;
CREATE POLICY "anon_delete_bookings" ON bookings FOR DELETE
  TO anon, authenticated USING (true);

CREATE INDEX IF NOT EXISTS idx_bookings_created_at ON bookings (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_bookings_token ON bookings (token);
