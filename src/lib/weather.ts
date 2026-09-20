import { Sun, Cloud, CloudRain, CloudSnow, CloudFog, CloudLightning, Wind, CloudDrizzle, Droplet, Thermometer, Umbrella, Warehouse, Tractor, Wheat, ShieldCheck, type LucideIcon } from 'lucide-react';

export const WEATHER_API_KEY = '58cbea1fc66a4dc7a0183238262009';
export const WEATHER_API_BASE = 'https://api.weatherapi.com/v1';

export interface CurrentWeather {
  temp: number;
  feelsLike: number;
  humidity: number;
  windSpeed: number;
  rainProb: number;
  condition: string;
  conditionCode: number;
  conditionIcon: string;
  iconUrl: string;
  updatedAt: string;
  location: string;
}

export interface ForecastDay {
  day: string;
  date: string;
  maxTemp: number;
  minTemp: number;
  rainProb: number;
  humidity: number;
  windSpeed: number;
  condition: string;
  conditionCode: number;
  iconUrl: string;
  icon: LucideIcon;
}

export interface WeatherAlert {
  type: string;
  severity: 'high' | 'medium' | 'low';
  icon: LucideIcon;
  message: string;
}

export interface CropAdvice {
  icon: LucideIcon;
  text: string;
  positive: boolean;
}

export function getWeatherIcon(code: number): LucideIcon {
  if (code === 1000) return Sun;
  if (code >= 1003 && code <= 1009) return Cloud;
  if (code >= 1087 && code <= 1117) return CloudLightning;
  if (code >= 1150 && code <= 1207) return CloudDrizzle;
  if (code >= 1210 && code <= 1237) return CloudRain;
  if (code >= 1240 && code <= 1252) return CloudRain;
  if (code >= 1255 && code <= 1282) return CloudSnow;
  if (code >= 1066 && code <= 1114) return CloudSnow;
  if (code === 1030 || code === 1135 || code === 1147) return CloudFog;
  return Cloud;
}

export async function fetchCurrentWeather(location: string): Promise<CurrentWeather | null> {
  try {
    const res = await fetch(
      `${WEATHER_API_BASE}/current.json?key=${WEATHER_API_KEY}&q=${encodeURIComponent(location)}&aqi=no`
    );
    if (!res.ok) return null;
    const data = await res.json();
    const code = data.current.condition.code;
    return {
      temp: Math.round(data.current.temp_c),
      feelsLike: Math.round(data.current.feelslike_c),
      humidity: data.current.humidity,
      windSpeed: Math.round(data.current.wind_kph),
      rainProb: 0,
      condition: data.current.condition.text,
      conditionCode: code,
      conditionIcon: getWeatherIcon(code),
      iconUrl: `https:${data.current.condition.icon}`,
      updatedAt: new Date(data.current.last_updated_epoch * 1000).toLocaleTimeString('en-IN', {
        hour: '2-digit',
        minute: '2-digit',
      }),
      location: `${data.location.name}, ${data.location.region}`,
    };
  } catch {
    return null;
  }
}

export async function fetchForecast(location: string, days = 7): Promise<ForecastDay[]> {
  try {
    const res = await fetch(
      `${WEATHER_API_BASE}/forecast.json?key=${WEATHER_API_KEY}&q=${encodeURIComponent(location)}&days=${days}&aqi=no`
    );
    if (!res.ok) return [];
    const data = await res.json();
    const dayLabels = ['Today', 'Tomorrow', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    return (data.forecast.forecastday || []).map((d: any, i: number) => {
      const code = d.day.condition.code;
      return {
        day: dayLabels[i] || d.date,
        date: d.date,
        maxTemp: Math.round(d.day.maxtemp_c),
        minTemp: Math.round(d.day.mintemp_c),
        rainProb: d.day.daily_chance_of_rain,
        humidity: d.day.avghumidity,
        windSpeed: Math.round(d.day.maxwind_kph),
        condition: d.day.condition.text,
        conditionCode: code,
        iconUrl: `https:${d.day.condition.icon}`,
        icon: getWeatherIcon(code),
      };
    });
  } catch {
    return [];
  }
}

export function generateAlerts(
  weather: CurrentWeather,
  forecast: ForecastDay[]
): WeatherAlert[] {
  const alerts: WeatherAlert[] = [];
  const tomorrowRain = forecast[1]?.rainProb || weather.rainProb;

  if (tomorrowRain > 70) {
    alerts.push({
      type: 'Heavy Rain Warning',
      severity: 'high',
      icon: CloudRain,
      message: `Rain probability of ${tomorrowRain}% expected tomorrow. Delay harvesting to avoid moisture increase.`,
    });
  }
  if (weather.temp > 38) {
    alerts.push({
      type: 'Heatwave Alert',
      severity: 'high',
      icon: Sun,
      message: `Temperature ${weather.temp}°C. Avoid transporting produce during peak hours.`,
    });
  }
  if (weather.humidity > 75) {
    alerts.push({
      type: 'High Moisture Risk',
      severity: 'medium',
      icon: CloudFog,
      message: `Humidity at ${weather.humidity}%. Grain quality may be affected. Use moisture protection.`,
    });
  }
  if (weather.windSpeed > 35) {
    alerts.push({
      type: 'Storm Warning',
      severity: 'medium',
      icon: Wind,
      message: `Wind speed ${weather.windSpeed} km/h. Secure stored produce and cover transport vehicles.`,
    });
  }
  if (alerts.length === 0) {
    alerts.push({
      type: 'No Active Alerts',
      severity: 'low',
      icon: Sun,
      message: 'Weather conditions are favorable for procurement activities.',
    });
  }
  return alerts;
}

export interface CropPrecaution {
  icon: LucideIcon;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
}

export function generatePrecautions(
  weather: CurrentWeather,
  crop: string,
  forecast: ForecastDay[]
): CropPrecaution[] {
  const precautions: CropPrecaution[] = [];
  const isWheat = crop.toLowerCase().includes('wheat') || crop === 'Wheat';
  const isRice = crop.toLowerCase().includes('rice') || crop === 'Rice' || crop.toLowerCase().includes('paddy');
  const isMaize = crop.toLowerCase().includes('maize') || crop.toLowerCase().includes('corn');
  const isCotton = crop.toLowerCase().includes('cotton');
  const tomorrowRain = forecast[1]?.rainProb || 0;
  const tomorrowHumidity = forecast[1]?.humidity || weather.humidity;

  // Rain-related precautions
  if (tomorrowRain > 70) {
    precautions.push({
      icon: Umbrella,
      title: 'Cover Harvested Produce',
      description: `Rain probability of ${tomorrowRain}% expected tomorrow. Use tarpaulins to cover all harvested ${crop} in fields and storage areas. Ensure no water seepage into gunny bags.`,
      priority: 'high',
    });
    precautions.push({
      icon: Warehouse,
      title: 'Move to Elevated Storage',
      description: 'Shift all produce to elevated platforms or covered godowns. Avoid ground-level storage to prevent waterlogging damage.',
      priority: 'high',
    });
    precautions.push({
      icon: Tractor,
      title: 'Delay Transportation',
      description: 'Postpone transporting produce to mandi during rainfall. Wet roads increase transit time and risk of spoilage. Wait for clear weather window.',
      priority: 'medium',
    });
  } else if (tomorrowRain > 40) {
    precautions.push({
      icon: Umbrella,
      title: 'Keep Tarpaulins Ready',
      description: `Moderate rain chance (${tomorrowRain}%) expected. Keep waterproof covers readily available for immediate deployment over harvested produce.`,
      priority: 'medium',
    });
    precautions.push({
      icon: Tractor,
      title: 'Schedule Transport Early',
      description: 'Plan produce transportation in early morning hours before potential afternoon rainfall. Check weather updates before departure.',
      priority: 'medium',
    });
  }

  // Humidity-related precautions
  if (tomorrowHumidity > 75) {
    precautions.push({
      icon: Droplet,
      title: 'Moisture Control Measures',
      description: `High humidity (${tomorrowHumidity}%) can increase grain moisture content. Use dehumidifiers or proper ventilation in storage. Check moisture levels with a moisture meter before bringing produce to mandi.`,
      priority: 'high',
    });
    if (isWheat) {
      precautions.push({
        icon: Wheat,
        title: 'Wheat-Specific: Fungal Risk',
        description: 'Wheat is highly susceptible to fungal growth at humidity above 75%. Ensure grains are dried to 12% moisture content before storage. Apply prophylactic fungicide if storing beyond 2 weeks.',
        priority: 'high',
      });
    }
    if (isRice) {
      precautions.push({
        icon: Wheat,
        title: 'Paddy-Specific: Discoloration Risk',
        description: 'High humidity causes paddy discoloration and reduces milling yield. Dry paddy to 14% moisture. Use mechanical dryers if sun drying is not possible due to cloud cover.',
        priority: 'high',
      });
    }
  } else if (tomorrowHumidity > 55) {
    precautions.push({
      icon: Droplet,
      title: 'Monitor Grain Moisture',
      description: `Moderate humidity (${tomorrowHumidity}%). Check grain moisture content regularly. Use airtight storage bags to prevent moisture absorption from the air.`,
      priority: 'low',
    });
  }

  // Temperature-related precautions
  if (weather.temp > 38) {
    precautions.push({
      icon: Thermometer,
      title: 'Heat Protection for Produce',
      description: `Temperature at ${weather.temp}°C. Avoid leaving harvested produce in direct sunlight. Use shade nets or move to covered areas within 30 minutes of harvesting.`,
      priority: 'high',
    });
    precautions.push({
      icon: Tractor,
      title: 'Transport During Cool Hours',
      description: 'Transport produce only during early morning (5-8 AM) or late evening (after 6 PM). High temperatures cause grain weight loss and quality degradation.',
      priority: 'medium',
    });
  } else if (weather.temp > 32) {
    precautions.push({
      icon: Thermometer,
      title: 'Shade Harvested Produce',
      description: `Warm conditions (${weather.temp}°C). Keep harvested produce under shade. Avoid stacking bags in direct sun during loading and unloading at mandi.`,
      priority: 'low',
    });
  }

  // Wind-related precautions
  if (weather.windSpeed > 35) {
    precautions.push({
      icon: Wind,
      title: 'Secure Loose Grains',
      description: `Wind speed at ${weather.windSpeed} km/h. Cover open grain heaps and secure all loose bags. Strong winds can scatter harvested produce and cause significant losses.`,
      priority: 'high',
    });
    precautions.push({
      icon: ShieldCheck,
      title: 'Reinforce Storage Structures',
      description: 'Check and reinforce storage shed roofing and walls. High winds can damage temporary structures and expose produce to the elements.',
      priority: 'medium',
    });
  } else if (weather.windSpeed > 20) {
    precautions.push({
      icon: Wind,
      title: 'Cover Grain Heaps',
      description: `Moderate winds (${weather.windSpeed} km/h). Use nets or covers over loose grain piles to prevent wind-blown losses.`,
      priority: 'low',
    });
  }

  // Crop-specific precautions
  if (isCotton && tomorrowRain > 30) {
    precautions.push({
      icon: ShieldCheck,
      title: 'Cotton-Specific: Protect from Moisture',
      description: 'Cotton quality degrades rapidly with moisture exposure. Keep harvested cotton in sealed plastic covers. Do not store wet cotton with dry lots to prevent contamination.',
      priority: 'high',
    });
  }
  if (isMaize && weather.humidity > 60) {
    precautions.push({
      icon: Wheat,
      title: 'Maize-Specific: Aflatoxin Risk',
      description: 'High humidity increases aflatoxin risk in maize. Dry maize cobs to 15% moisture before shelling. Inspect for any visible mold growth before transport.',
      priority: 'high',
    });
  }

  // General best practice
  precautions.push({
    icon: ShieldCheck,
    title: 'Daily Weather Monitoring',
    description: 'Check weather updates every morning before planning harvesting, storage, or transport activities. Conditions can change rapidly during monsoon season.',
    priority: 'low',
  });

  return precautions;
}

export function generateAdvice(
  weather: CurrentWeather,
  crop: string,
  forecast: ForecastDay[]
): CropAdvice[] {
  const advice: CropAdvice[] = [];
  const isWheat = crop.toLowerCase().includes('wheat') || crop === 'Wheat';
  const isRice = crop.toLowerCase().includes('rice') || crop === 'Rice' || crop.toLowerCase().includes('paddy');
  const tomorrowRain = forecast[1]?.rainProb || weather.rainProb;

  if (tomorrowRain < 30) {
    advice.push({
      icon: Sun,
      text: `Weather suitable for harvesting ${crop}. Recommended to transport produce within next 2 days.`,
      positive: true,
    });
  } else if (tomorrowRain > 60) {
    advice.push({
      icon: CloudRain,
      text: `Heavy rainfall expected in next 48 hours. Delay harvesting to avoid moisture increase.`,
      positive: false,
    });
  } else {
    advice.push({
      icon: Cloud,
      text: `Moderate weather conditions. Harvest possible but monitor rain forecast closely.`,
      positive: true,
    });
  }

  if (isWheat && weather.humidity < 60) {
    advice.push({
      icon: Sun,
      text: `Low humidity (${weather.humidity}%) is ideal for wheat storage. Grain quality will be maintained.`,
      positive: true,
    });
  }
  if (isRice && tomorrowRain > 50) {
    advice.push({
      icon: CloudRain,
      text: `Paddy is sensitive to rain. Cover all transport vehicles and delay if rain exceeds 70%.`,
      positive: false,
    });
  }

  advice.push({
    icon: Sun,
    text: `Low mandi congestion expected tomorrow. Recommended slot: 10:00 AM - 12:00 PM.`,
    positive: true,
  });

  return advice;
}
