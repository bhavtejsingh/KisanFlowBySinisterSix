export interface PunjabMandi {
  name: string;
  district: string;
  pincode: string;
  latitude: number;
  longitude: number;
}

export const PUNJAB_DISTRICTS = [
  'Amritsar',
  'Barnala',
  'Bathinda',
  'Faridkot',
  'Fatehgarh Sahib',
  'Fazilka',
  'Firozpur',
  'Gurdaspur',
  'Hoshiarpur',
  'Jalandhar',
  'Kapurthala',
  'Ludhiana',
  'Malerkotla',
  'Mansa',
  'Moga',
  'Sri Muktsar Sahib',
  'Pathankot',
  'Patiala',
  'Rupnagar',
  'SAS Nagar (Mohali)',
  'Sangrur',
  'Shaheed Bhagat Singh Nagar',
  'Tarn Taran',
] as const;

export const PUNJAB_MANDIS: Record<string, PunjabMandi> = {
  Amritsar: { name: 'Bhagtanwala Mandi', district: 'Amritsar', pincode: '143001', latitude: 31.634, longitude: 74.8723 },
  Barnala: { name: 'Barnala Grain Market', district: 'Barnala', pincode: '148101', latitude: 30.3801, longitude: 75.55 },
  Bathinda: { name: 'Bathinda Grain Market', district: 'Bathinda', pincode: '151001', latitude: 30.211, longitude: 74.9455 },
  Faridkot: { name: 'Faridkot Mandi', district: 'Faridkot', pincode: '151203', latitude: 30.6722, longitude: 74.7436 },
  'Fatehgarh Sahib': { name: 'Sirhind Mandi', district: 'Fatehgarh Sahib', pincode: '140406', latitude: 30.65, longitude: 76.4 },
  Fazilka: { name: 'Fazilka Grain Market', district: 'Fazilka', pincode: '152123', latitude: 30.329, longitude: 74.024 },
  Firozpur: { name: 'Firozpur Mandi', district: 'Firozpur', pincode: '152001', latitude: 30.923, longitude: 74.607 },
  Gurdaspur: { name: 'Gurdaspur Mandi', district: 'Gurdaspur', pincode: '143521', latitude: 32.044, longitude: 75.403 },
  Hoshiarpur: { name: 'Hoshiarpur Grain Market', district: 'Hoshiarpur', pincode: '146001', latitude: 31.526, longitude: 75.931 },
  Jalandhar: { name: 'Jalandhar Grain Market', district: 'Jalandhar', pincode: '144001', latitude: 31.326, longitude: 75.576 },
  Kapurthala: { name: 'Kapurthala Mandi', district: 'Kapurthala', pincode: '144601', latitude: 31.377, longitude: 75.381 },
  Ludhiana: { name: 'Khanna Grain Market', district: 'Ludhiana', pincode: '141401', latitude: 30.7066, longitude: 76.2225 },
  Malerkotla: { name: 'Malerkotla Mandi', district: 'Malerkotla', pincode: '148021', latitude: 30.526, longitude: 75.881 },
  Mansa: { name: 'Mansa Grain Market', district: 'Mansa', pincode: '151505', latitude: 29.991, longitude: 75.024 },
  Moga: { name: 'Moga Mandi', district: 'Moga', pincode: '142001', latitude: 30.818, longitude: 75.171 },
  'Sri Muktsar Sahib': { name: 'Muktsar Mandi', district: 'Sri Muktsar Sahib', pincode: '152026', latitude: 30.476, longitude: 74.514 },
  Pathankot: { name: 'Pathankot Mandi', district: 'Pathankot', pincode: '145001', latitude: 32.264, longitude: 75.646 },
  Patiala: { name: 'Rajpura Grain Market', district: 'Patiala', pincode: '147001', latitude: 30.3398, longitude: 76.3869 },
  Rupnagar: { name: 'Ropar Mandi', district: 'Rupnagar', pincode: '140001', latitude: 30.975, longitude: 76.52 },
  'SAS Nagar (Mohali)': { name: 'Kharar Grain Market', district: 'SAS Nagar (Mohali)', pincode: '160055', latitude: 30.7046, longitude: 76.7179 },
  Sangrur: { name: 'Sangrur Grain Market', district: 'Sangrur', pincode: '148001', latitude: 30.2432, longitude: 75.8335 },
  'Shaheed Bhagat Singh Nagar': { name: 'Nawanshahr Mandi', district: 'Shaheed Bhagat Singh Nagar', pincode: '144514', latitude: 31.097, longitude: 76.116 },
  'Tarn Taran': { name: 'Tarn Taran Grain Market', district: 'Tarn Taran', pincode: '143401', latitude: 31.453, longitude: 74.926 },
};
