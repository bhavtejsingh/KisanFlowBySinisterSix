/*
# KisanFlow - Smart Mandi Procurement Platform Schema

## Overview
Complete database schema for AI-powered mandi procurement scheduling, queue management,
farmer verification, procurement tracking, and payment management.

## New Tables

1. **mandis** - Procurement centers (mandis)
   - id (uuid, PK)
   - name, address, district, state, pincode
   - latitude, longitude (for distance calc)
   - capacity_per_day (max farmers)
   - current_queue_length (live count)
   - available_slots (for booking)
   - created_at

2. **farmers** - Verified farmer records
   - id (uuid, PK)
   - name, mobile_number, aadhaar_number, farmer_id
   - farmer_type (land_owner / tenant)
   - state, district, survey_number (land details)
   - land_area_acres, crop_type, yield_benchmark_qtl
   - max_procurement_quota_qtl, remaining_quota_qtl
   - lease_agreement_url, panchayat_cert_url (tenant docs)
   - is_verified (bool)
   - language (preferred language)
   - created_at, updated_at

3. **bookings** - Slot bookings / tokens
   - id (uuid, PK)
   - booking_id (text, human-readable like KF-2026-XXXX)
   - farmer_id (FK -> farmers)
   - mandi_id (FK -> mandis)
   - crop_type, expected_quantity_qtl
   - preferred_date (date)
   - slot_time (text, time window)
   - token_number (int, sequential per mandi per day)
   - qr_code_data (text, encoded booking info)
   - status (booked / arrived / in_progress / completed / cancelled)
   - expected_wait_minutes
   - ai_recommended (bool)
   - created_at

4. **procurements** - Procurement records (inspection + approval)
   - id (uuid, PK)
   - procurement_id (text, human-readable)
   - booking_id (FK -> bookings)
   - farmer_id (FK -> farmers)
   - mandi_id (FK -> mandis)
   - crop_type, actual_quantity_qtl, accepted_quantity_qtl
   - moisture_level_pct, quality_grade (A/B/C)
   - storage_location, remarks
   - msp_rate (per quintal)
   - amount (calculated)
   - status (pending / approved / rejected)
   - inspected_by (officer name)
   - approved_by (officer name)
   - inspected_at, approved_at, created_at

5. **payments** - Payment tracking
   - id (uuid, PK)
   - payment_id (text, human-readable)
   - procurement_id (FK -> procurements)
   - farmer_id (FK -> farmers)
   - amount
   - status (pending / processing / completed / failed)
   - utr_number (transaction ref)
   - timeline (jsonb array of {status, timestamp, label})
   - created_at, updated_at

6. **officers** - Procurement officer records
   - id (uuid, PK)
   - official_id, name, mobile_number
   - role, centre_name
   - govt_id_url, auth_letter_url
   - is_verified
   - created_at

7. **queue_events** - Live queue state per mandi
   - id (uuid, PK)
   - mandi_id (FK -> mandis)
   - current_token (int, token being served)
   - total_tokens (int, total issued today)
   - updated_at

## Security
- All tables have RLS enabled
- Single-tenant prototype: anon+authenticated CRUD on all tables (data is intentionally shared for demo)
*/

-- Mandis table
CREATE TABLE IF NOT EXISTS mandis (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  address text,
  district text NOT NULL,
  state text NOT NULL,
  pincode text NOT NULL,
  latitude numeric DEFAULT 30.73,
  longitude numeric DEFAULT 76.78,
  capacity_per_day int DEFAULT 200,
  current_queue_length int DEFAULT 0,
  available_slots int DEFAULT 50,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE mandis ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_crud_mandis" ON mandis;
CREATE POLICY "anon_crud_mandis" ON mandis FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_mandis" ON mandis;
CREATE POLICY "anon_insert_mandis" ON mandis FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_mandis" ON mandis;
CREATE POLICY "anon_update_mandis" ON mandis FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_mandis" ON mandis;
CREATE POLICY "anon_delete_mandis" ON mandis FOR DELETE TO anon, authenticated USING (true);

-- Farmers table
CREATE TABLE IF NOT EXISTS farmers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  mobile_number text NOT NULL,
  aadhaar_number text,
  farmer_id text,
  farmer_type text DEFAULT 'land_owner',
  state text,
  district text,
  survey_number text,
  land_area_acres numeric DEFAULT 0,
  crop_type text,
  yield_benchmark_qtl numeric DEFAULT 0,
  max_procurement_quota_qtl numeric DEFAULT 0,
  remaining_quota_qtl numeric DEFAULT 0,
  lease_agreement_url text,
  panchayat_cert_url text,
  is_verified boolean DEFAULT false,
  language text DEFAULT 'en',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE farmers ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_crud_farmers" ON farmers;
CREATE POLICY "anon_crud_farmers" ON farmers FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_farmers" ON farmers;
CREATE POLICY "anon_insert_farmers" ON farmers FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_farmers" ON farmers;
CREATE POLICY "anon_update_farmers" ON farmers FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_farmers" ON farmers;
CREATE POLICY "anon_delete_farmers" ON farmers FOR DELETE TO anon, authenticated USING (true);

-- Bookings table
CREATE TABLE IF NOT EXISTS bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id text UNIQUE NOT NULL,
  farmer_id uuid REFERENCES farmers(id) ON DELETE CASCADE,
  mandi_id uuid REFERENCES mandis(id) ON DELETE CASCADE,
  crop_type text NOT NULL,
  expected_quantity_qtl numeric NOT NULL,
  preferred_date date NOT NULL,
  slot_time text NOT NULL,
  token_number int NOT NULL,
  qr_code_data text,
  status text DEFAULT 'booked',
  expected_wait_minutes int DEFAULT 0,
  ai_recommended boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_crud_bookings" ON bookings;
CREATE POLICY "anon_crud_bookings" ON bookings FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_bookings" ON bookings;
CREATE POLICY "anon_insert_bookings" ON bookings FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_bookings" ON bookings;
CREATE POLICY "anon_update_bookings" ON bookings FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_bookings" ON bookings;
CREATE POLICY "anon_delete_bookings" ON bookings FOR DELETE TO anon, authenticated USING (true);

-- Procurements table
CREATE TABLE IF NOT EXISTS procurements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  procurement_id text UNIQUE NOT NULL,
  booking_id uuid REFERENCES bookings(id) ON DELETE CASCADE,
  farmer_id uuid REFERENCES farmers(id) ON DELETE CASCADE,
  mandi_id uuid REFERENCES mandis(id) ON DELETE CASCADE,
  crop_type text NOT NULL,
  actual_quantity_qtl numeric DEFAULT 0,
  accepted_quantity_qtl numeric DEFAULT 0,
  moisture_level_pct numeric DEFAULT 0,
  quality_grade text DEFAULT 'A',
  storage_location text,
  remarks text,
  msp_rate numeric DEFAULT 0,
  amount numeric DEFAULT 0,
  status text DEFAULT 'pending',
  inspected_by text,
  approved_by text,
  inspected_at timestamptz,
  approved_at timestamptz,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE procurements ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_crud_procurements" ON procurements;
CREATE POLICY "anon_crud_procurements" ON procurements FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_procurements" ON procurements;
CREATE POLICY "anon_insert_procurements" ON procurements FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_procurements" ON procurements;
CREATE POLICY "anon_update_procurements" ON procurements FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_procurements" ON procurements;
CREATE POLICY "anon_delete_procurements" ON procurements FOR DELETE TO anon, authenticated USING (true);

-- Payments table
CREATE TABLE IF NOT EXISTS payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  payment_id text UNIQUE NOT NULL,
  procurement_id uuid REFERENCES procurements(id) ON DELETE CASCADE,
  farmer_id uuid REFERENCES farmers(id) ON DELETE CASCADE,
  amount numeric NOT NULL DEFAULT 0,
  status text DEFAULT 'pending',
  utr_number text,
  timeline jsonb DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_crud_payments" ON payments;
CREATE POLICY "anon_crud_payments" ON payments FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_payments" ON payments;
CREATE POLICY "anon_insert_payments" ON payments FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_payments" ON payments;
CREATE POLICY "anon_update_payments" ON payments FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_payments" ON payments;
CREATE POLICY "anon_delete_payments" ON payments FOR DELETE TO anon, authenticated USING (true);

-- Officers table
CREATE TABLE IF NOT EXISTS officers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  official_id text UNIQUE NOT NULL,
  name text NOT NULL,
  mobile_number text NOT NULL,
  role text DEFAULT 'Procurement Officer',
  centre_name text,
  govt_id_url text,
  auth_letter_url text,
  is_verified boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE officers ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_crud_officers" ON officers;
CREATE POLICY "anon_crud_officers" ON officers FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_officers" ON officers;
CREATE POLICY "anon_insert_officers" ON officers FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_officers" ON officers;
CREATE POLICY "anon_update_officers" ON officers FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_officers" ON officers;
CREATE POLICY "anon_delete_officers" ON officers FOR DELETE TO anon, authenticated USING (true);

-- Queue events table
CREATE TABLE IF NOT EXISTS queue_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  mandi_id uuid REFERENCES mandis(id) ON DELETE CASCADE,
  current_token int DEFAULT 0,
  total_tokens int DEFAULT 0,
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE queue_events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_crud_queue_events" ON queue_events;
CREATE POLICY "anon_crud_queue_events" ON queue_events FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_queue_events" ON queue_events;
CREATE POLICY "anon_insert_queue_events" ON queue_events FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_queue_events" ON queue_events;
CREATE POLICY "anon_update_queue_events" ON queue_events FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_queue_events" ON queue_events;
CREATE POLICY "anon_delete_queue_events" ON queue_events FOR DELETE TO anon, authenticated USING (true);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_bookings_farmer ON bookings(farmer_id);
CREATE INDEX IF NOT EXISTS idx_bookings_mandi ON bookings(mandi_id);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_procurements_booking ON procurements(booking_id);
CREATE INDEX IF NOT EXISTS idx_procurements_status ON procurements(status);
CREATE INDEX IF NOT EXISTS idx_payments_procurement ON payments(procurement_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);
CREATE INDEX IF NOT EXISTS idx_farmers_mobile ON farmers(mobile_number);
CREATE INDEX IF NOT EXISTS idx_mandis_pincode ON mandis(pincode);
