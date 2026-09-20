import { Droplet, Wind, CloudRain, RefreshCw, ChevronRight, Thermometer, MapPin, ChevronDown, Check } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import {
  fetchCurrentWeather,
  fetchForecast,
  type CurrentWeather,
  type ForecastDay,
} from '@/lib/weather';
import { PUNJAB_DISTRICTS } from '@/lib/punjabData';

interface WeatherWidgetProps {
  location: string;
  onClick?: () => void;
  compact?: boolean;
  showLocationPicker?: boolean;
}

export function WeatherWidget({ location, onClick, compact = false, showLocationPicker = false }: WeatherWidgetProps) {
  const [activeLocation, setActiveLocation] = useState(location);
  const [weather, setWeather] = useState<CurrentWeather | null>(null);
  const [forecast, setForecast] = useState<ForecastDay[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [search, setSearch] = useState('');
  const pickerRef = useRef<HTMLDivElement>(null);

  const load = async (loc: string) => {
    const [w, f] = await Promise.all([
      fetchCurrentWeather(loc),
      fetchForecast(loc, 2),
    ]);
    setWeather(w);
    setForecast(f);
    setLoading(false);
  };

  useEffect(() => {
    setActiveLocation(location);
    setLoading(true);
    load(location);
  }, [location]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(e.target as Node)) {
        setPickerOpen(false);
        setSearch('');
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleRefresh = (e: React.MouseEvent) => {
    e.stopPropagation();
    setRefreshing(true);
    setTimeout(async () => {
      await load(activeLocation);
      setRefreshing(false);
    }, 800);
  };

  const handleSelectLocation = (loc: string) => {
    const fullLoc = `${loc}, Punjab`;
    setActiveLocation(fullLoc);
    setPickerOpen(false);
    setSearch('');
    setLoading(true);
    load(fullLoc);
  };

  const filteredDistricts = PUNJAB_DISTRICTS.filter((d) =>
    d.toLowerCase().includes(search.toLowerCase())
  );

  const renderLocationPicker = () => {
    if (!showLocationPicker) return null;
    return (
      <div ref={pickerRef} className="relative" onClick={(e) => e.stopPropagation()}>
        <button
          onClick={() => setPickerOpen(!pickerOpen)}
          className="flex items-center gap-1.5 text-xs opacity-80 hover:opacity-100 transition-opacity"
        >
          <MapPin className="w-3.5 h-3.5" />
          <span>{activeLocation}</span>
          <ChevronDown className={`w-3.5 h-3.5 transition-transform ${pickerOpen ? 'rotate-180' : ''}`} />
        </button>
        {pickerOpen && (
          <div className="absolute z-50 mt-2 left-0 w-64 bg-white rounded-xl border-2 border-slate-200 shadow-xl max-h-72 overflow-hidden animate-fade-in">
            <div className="p-2 border-b border-slate-100">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search district..."
                className="w-full px-3 py-2 text-sm bg-slate-50 rounded-lg border-0 focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-900"
                autoFocus
              />
            </div>
            <div className="max-h-48 overflow-y-auto">
              {filteredDistricts.length === 0 ? (
                <p className="px-4 py-3 text-sm text-slate-400 text-center">No districts found</p>
              ) : (
                filteredDistricts.map((d) => (
                  <button
                    key={d}
                    onClick={() => handleSelectLocation(d)}
                    className={`w-full px-4 py-2.5 text-left text-sm transition-colors flex items-center justify-between ${
                      activeLocation.startsWith(d)
                        ? 'bg-blue-50 text-blue-700 font-semibold'
                        : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <span>{d}</span>
                    {activeLocation.startsWith(d) && <Check className="w-4 h-4 text-blue-600" />}
                  </button>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    );
  };

  if (loading || !weather) {
    return (
      <div className="rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 p-4 text-white shadow-lg shadow-blue-500/20 animate-pulse h-24" />
    );
  }

  const tomorrowRain = forecast[1]?.rainProb || 0;
  const riskLevel = tomorrowRain > 70 ? 'High' : tomorrowRain > 40 ? 'Medium' : 'Low';
  const riskColor = tomorrowRain > 70 ? 'bg-red-400/30' : tomorrowRain > 40 ? 'bg-kisan-orange-400/30' : 'bg-green-400/30';

  if (compact) {
    return (
      <button
        onClick={onClick}
        className="w-full rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 p-4 text-white shadow-lg shadow-blue-500/20 active:scale-[0.98] transition-transform"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={weather.iconUrl} alt={weather.condition} className="w-12 h-12" />
            <div className="text-left">
              <p className="text-2xl font-bold leading-none">{weather.temp}°C</p>
              <p className="text-xs opacity-80 mt-1">{weather.condition}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-right">
            <div>
              <p className="text-xs opacity-70">{weather.location}</p>
              <div className="flex items-center gap-3 mt-1 text-xs">
                <span className="flex items-center gap-1"><Droplet className="w-3 h-3" />{weather.humidity}%</span>
                <span className="flex items-center gap-1"><Wind className="w-3 h-3" />{weather.windSpeed}</span>
                <span className="flex items-center gap-1"><CloudRain className="w-3 h-3" />{tomorrowRain}%</span>
              </div>
            </div>
            {onClick && <ChevronRight className="w-5 h-5 opacity-60" />}
          </div>
        </div>
      </button>
    );
  }

  return (
    <div
      onClick={onClick}
      className="w-full rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 p-5 text-white shadow-lg shadow-blue-500/20 active:scale-[0.98] transition-transform text-left"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <img src={weather.iconUrl} alt={weather.condition} className="w-14 h-14" />
          <div>
            <p className="text-3xl font-bold leading-none">{weather.temp}°C</p>
            <p className="text-sm opacity-90 mt-1">{weather.condition}</p>
            {showLocationPicker ? (
              renderLocationPicker()
            ) : (
              <p className="text-xs opacity-70 mt-0.5">{weather.location}</p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span
            onClick={handleRefresh}
            className="p-1.5 rounded-lg bg-white/20 hover:bg-white/30 transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
          </span>
          {onClick && <ChevronRight className="w-5 h-5 opacity-60" />}
        </div>
      </div>
      <div className="grid grid-cols-4 gap-2">
        <div className="text-center bg-white/15 rounded-lg py-2">
          <Thermometer className="w-4 h-4 mx-auto mb-0.5 opacity-80" />
          <p className="text-[10px] opacity-70">Feels</p>
          <p className="font-semibold text-sm">{weather.feelsLike}°</p>
        </div>
        <div className="text-center bg-white/15 rounded-lg py-2">
          <Droplet className="w-4 h-4 mx-auto mb-0.5 opacity-80" />
          <p className="text-[10px] opacity-70">Humidity</p>
          <p className="font-semibold text-sm">{weather.humidity}%</p>
        </div>
        <div className="text-center bg-white/15 rounded-lg py-2">
          <CloudRain className="w-4 h-4 mx-auto mb-0.5 opacity-80" />
          <p className="text-[10px] opacity-70">Rain</p>
          <p className="font-semibold text-sm">{tomorrowRain}%</p>
        </div>
        <div className={`text-center rounded-lg py-2 ${riskColor}`}>
          <Wind className="w-4 h-4 mx-auto mb-0.5 opacity-80" />
          <p className="text-[10px] opacity-70">Risk</p>
          <p className="font-semibold text-sm">{riskLevel}</p>
        </div>
      </div>
    </div>
  );
}
