export type Language = 'en' | 'hi' | 'pa';

export type AppMode = 'farmer' | 'officer';

export type FarmerType = 'land_owner' | 'tenant';

export type BookingStatus = 'booked' | 'arrived' | 'in_progress' | 'completed' | 'cancelled';

export type ProcurementStatus = 'pending' | 'approved' | 'rejected';

export type PaymentStatus = 'pending' | 'processing' | 'completed' | 'failed';

export type QualityGrade = 'A' | 'B' | 'C';

export interface Mandi {
  id: string;
  name: string;
  address: string | null;
  district: string;
  state: string;
  pincode: string;
  latitude: number | null;
  longitude: number | null;
  capacity_per_day: number;
  current_queue_length: number;
  available_slots: number;
  created_at: string;
}

export interface Farmer {
  id: string;
  name: string;
  mobile_number: string;
  aadhaar_number: string | null;
  farmer_id: string | null;
  farmer_type: string;
  state: string | null;
  district: string | null;
  survey_number: string | null;
  land_area_acres: number;
  crop_type: string | null;
  yield_benchmark_qtl: number;
  max_procurement_quota_qtl: number;
  remaining_quota_qtl: number;
  lease_agreement_url: string | null;
  panchayat_cert_url: string | null;
  is_verified: boolean;
  language: string;
  created_at: string;
  updated_at: string;
}

export interface Booking {
  id: string;
  booking_id: string;
  farmer_id: string;
  mandi_id: string;
  crop_type: string;
  expected_quantity_qtl: number;
  preferred_date: string;
  slot_time: string;
  token_number: number;
  qr_code_data: string | null;
  status: string;
  expected_wait_minutes: number;
  ai_recommended: boolean;
  created_at: string;
}

export interface Procurement {
  id: string;
  procurement_id: string;
  booking_id: string;
  farmer_id: string;
  mandi_id: string;
  crop_type: string;
  actual_quantity_qtl: number;
  accepted_quantity_qtl: number;
  moisture_level_pct: number;
  quality_grade: string;
  storage_location: string | null;
  remarks: string | null;
  msp_rate: number;
  amount: number;
  status: string;
  inspected_by: string | null;
  approved_by: string | null;
  inspected_at: string | null;
  approved_at: string | null;
  created_at: string;
}

export interface Payment {
  id: string;
  payment_id: string;
  procurement_id: string;
  farmer_id: string;
  amount: number;
  status: string;
  utr_number: string | null;
  timeline: PaymentTimelineEntry[];
  created_at: string;
  updated_at: string;
}

export interface PaymentTimelineEntry {
  status: string;
  timestamp: string;
  label: string;
}

export interface Officer {
  id: string;
  official_id: string;
  name: string;
  mobile_number: string;
  role: string;
  centre_name: string | null;
  govt_id_url: string | null;
  auth_letter_url: string | null;
  is_verified: boolean;
  created_at: string;
}

export interface QueueEvent {
  id: string;
  mandi_id: string;
  current_token: number;
  total_tokens: number;
  updated_at: string;
}

export interface BookingWithMandi extends Booking {
  mandi?: Mandi;
  farmer?: Farmer;
}

export interface ProcurementWithDetails extends Procurement {
  booking?: Booking;
  farmer?: Farmer;
  mandi?: Mandi;
  payment?: Payment;
}
