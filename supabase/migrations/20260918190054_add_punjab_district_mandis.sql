/*
# Add all Punjab district mandis

1. Inserts mandis for all 23 Punjab districts that don't already have one
2. Each mandi gets realistic mock data for capacity, queue length, and available slots
3. Uses ON CONFLICT DO NOTHING to avoid duplicating existing mandis
*/

INSERT INTO mandis (name, address, district, state, pincode, latitude, longitude, capacity_per_day, current_queue_length, available_slots)
VALUES
  ('Bhagtanwala Mandi', 'Bhagtanwala Road, Amritsar', 'Amritsar', 'Punjab', '143001', 31.6340, 74.8723, 250, 15, 35),
  ('Barnala Grain Market', 'Mansa Road, Barnala', 'Barnala', 'Punjab', '148101', 30.3801, 75.5500, 120, 8, 30),
  ('Bathinda Grain Market', 'Mansa Road, Bathinda', 'Bathinda', 'Punjab', '151001', 30.2110, 74.9455, 200, 20, 25),
  ('Faridkot Mandi', 'Kotkapura Road, Faridkot', 'Faridkot', 'Punjab', '151203', 30.6722, 74.7436, 100, 5, 40),
  ('Sirhind Mandi', 'Sirhind Road, Fatehgarh Sahib', 'Fatehgarh Sahib', 'Punjab', '140406', 30.6500, 76.4000, 100, 0, 50),
  ('Fazilka Grain Market', 'Abohar Road, Fazilka', 'Fazilka', 'Punjab', '152123', 30.3290, 74.0240, 130, 10, 28),
  ('Firozpur Mandi', 'Moga Road, Firozpur', 'Firozpur', 'Punjab', '152001', 30.9230, 74.6070, 150, 12, 22),
  ('Gurdaspur Mandi', 'Pathankot Road, Gurdaspur', 'Gurdaspur', 'Punjab', '143521', 32.0440, 75.4030, 110, 6, 35),
  ('Hoshiarpur Grain Market', 'Phagwara Road, Hoshiarpur', 'Hoshiarpur', 'Punjab', '146001', 31.5260, 75.9310, 160, 14, 26),
  ('Jalandhar Grain Market', 'Phagwara Road, Jalandhar', 'Jalandhar', 'Punjab', '144001', 31.3260, 75.5760, 220, 25, 15),
  ('Kapurthala Mandi', 'Sultanpur Road, Kapurthala', 'Kapurthala', 'Punjab', '144601', 31.3770, 75.3810, 100, 4, 42),
  ('Khanna Grain Market', 'GT Road, Khanna', 'Ludhiana', 'Punjab', '141401', 30.7066, 76.2225, 180, 5, 45),
  ('Malerkotla Mandi', 'Sangrur Road, Malerkotla', 'Malerkotla', 'Punjab', '148021', 30.5260, 75.8810, 90, 3, 38),
  ('Mansa Grain Market', 'Bathinda Road, Mansa', 'Mansa', 'Punjab', '151505', 29.9910, 75.0240, 110, 7, 30),
  ('Moga Mandi', 'Ferozepur Road, Moga', 'Moga', 'Punjab', '142001', 30.8180, 75.1710, 140, 9, 28),
  ('Muktsar Mandi', 'Kotkapura Road, Sri Muktsar Sahib', 'Sri Muktsar Sahib', 'Punjab', '152026', 30.4760, 74.5140, 100, 2, 45),
  ('Pathankot Mandi', 'Jammu Road, Pathankot', 'Pathankot', 'Punjab', '145001', 32.2640, 75.6460, 90, 5, 32),
  ('Rajpura Grain Market', 'Rajpura Road, Patiala', 'Patiala', 'Punjab', '147001', 30.3398, 76.3869, 200, 18, 22),
  ('Ropar Mandi', 'Nangal Road, Rupnagar', 'Rupnagar', 'Punjab', '140001', 30.9750, 76.5200, 130, 7, 35),
  ('Kharar Grain Market', 'Phase 7, Mohali', 'SAS Nagar (Mohali)', 'Punjab', '160055', 30.7046, 76.7179, 220, 25, 15),
  ('Sangrur Grain Market', 'Sunam Road, Sangrur', 'Sangrur', 'Punjab', '148001', 30.2432, 75.8335, 150, 3, 50),
  ('Nawanshahr Mandi', 'Garhshankar Road, Nawanshahr', 'Shaheed Bhagat Singh Nagar', 'Punjab', '144514', 31.0970, 76.1160, 80, 1, 40),
  ('Tarn Taran Grain Market', 'Amritsar Road, Tarn Taran', 'Tarn Taran', 'Punjab', '143401', 31.4530, 74.9260, 100, 8, 28)
ON CONFLICT DO NOTHING;
