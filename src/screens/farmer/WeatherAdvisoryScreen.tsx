import { useApp } from '@/context/AppContext';
import {
  RefreshCw, Calendar, AlertTriangle, CheckCircle2, Sparkles, ChevronRight, Droplet, Wind, CloudRain, Clock, MapPin, ChevronDown, Check, ShieldCheck,
} from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { ScreenContainer, LoadingSpinner } from '@/components/ui';
import { Header, BottomNav, FloatingMic } from '@/components/common';
import {
  fetchCurrentWeather,
  fetchForecast,
  generateAlerts,
  generateAdvice,
  generatePrecautions,
  type CurrentWeather,
  type ForecastDay,
  type WeatherAlert,
  type CropAdvice,
  type CropPrecaution,
} from '@/lib/weather';
import { PUNJAB_DISTRICTS } from '@/lib/punjabData';

export function WeatherAdvisoryScreen() {
  const { farmer, navigate, t } = useApp();
  const [location, setLocation] = useState(
    farmer?.district ? `${farmer.district}, Punjab` : 'Punjab'
  );
  const [weather, setWeather] = useState<CurrentWeather | null>(null);
  const [forecast, setForecast] = useState<ForecastDay[]>([]);
  const [alerts, setAlerts] = useState<WeatherAlert[]>([]);
  const [advice, setAdvice] = useState<CropAdvice[]>([]);
  const [precautions, setPrecautions] = useState<CropPrecaution[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showForecast, setShowForecast] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [search, setSearch] = useState('');
  const pickerRef = useRef<HTMLDivElement>(null);

  const loadWeather = async (loc: string) => {
    const [w, f] = await Promise.all([
      fetchCurrentWeather(loc),
      fetchForecast(loc, 7),
    ]);
    if (w) {
      setWeather(w);
      setForecast(f);
      setAlerts(generateAlerts(w, f));
      setAdvice(generateAdvice(w, farmer?.crop_type || 'Wheat', f));
      setPrecautions(generatePrecautions(w, farmer?.crop_type || 'Wheat', f));
    }
    setLoading(false);
  };

  useEffect(() => {
    loadWeather(location);
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

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(async () => {
      await loadWeather(location);
      setRefreshing(false);
    }, 800);
  };

  const handleSelectLocation = (district: string) => {
    setLocation(`${district}, Punjab`);
    setPickerOpen(false);
    setSearch('');
    setLoading(true);
  };

  const filteredDistricts = PUNJAB_DISTRICTS.filter((d) =>
    d.toLowerCase().includes(search.toLowerCase())
  );

  if (loading || !weather) return <LoadingSpinner />;

  const severityStyles = {
    high: { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-700', badge: 'bg-red-100 text-red-700' },
    medium: { bg: 'bg-kisan-orange-50', border: 'border-kisan-orange-200', text: 'text-kisan-orange-700', badge: 'bg-kisan-orange-100 text-kisan-orange-700' },
    low: { bg: 'bg-kisan-green-50', border: 'border-kisan-green-200', text: 'text-kisan-green-700', badge: 'bg-kisan-green-100 text-kisan-green-700' },
  };

  return (
    <ScreenContainer>
      <Header title="Weather & Crop Advisory" />
      <div className="px-4 py-4 pb-28 space-y-4">
        {/* Current Weather Card with Location Picker */}
        <div className="rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 p-5 text-white shadow-lg shadow-blue-500/20 animate-slide-up">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <img src={weather.iconUrl} alt={weather.condition} className="w-14 h-14" />
              <div>
                <p className="text-3xl font-bold leading-none">{weather.temp}°C</p>
                <p className="text-sm opacity-90 mt-1">{weather.condition}</p>
                {/* Location Picker */}
                <div ref={pickerRef} className="relative mt-1">
                  <button
                    onClick={() => setPickerOpen(!pickerOpen)}
                    className="flex items-center gap-1.5 text-xs opacity-80 hover:opacity-100 transition-opacity"
                  >
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{weather.location}</span>
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
                                location.startsWith(d)
                                  ? 'bg-blue-50 text-blue-700 font-semibold'
                                  : 'text-slate-700 hover:bg-slate-50'
                              }`}
                            >
                              <span>{d}</span>
                              {location.startsWith(d) && <Check className="w-4 h-4 text-blue-600" />}
                            </button>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <button
              onClick={handleRefresh}
              className="p-2 rounded-xl bg-white/20 backdrop-blur hover:bg-white/30 transition-colors"
              aria-label="Refresh"
            >
              <RefreshCw className={`w-5 h-5 ${refreshing ? 'animate-spin' : ''}`} />
            </button>
          </div>
          <div className="grid grid-cols-4 gap-2">
            <div className="text-center">
              <Droplet className="w-5 h-5 mx-auto mb-1 opacity-80" />
              <p className="text-xs opacity-70">Humidity</p>
              <p className="font-semibold">{weather.humidity}%</p>
            </div>
            <div className="text-center">
              <Wind className="w-5 h-5 mx-auto mb-1 opacity-80" />
              <p className="text-xs opacity-70">Wind</p>
              <p className="font-semibold">{weather.windSpeed} km/h</p>
            </div>
            <div className="text-center">
              <CloudRain className="w-5 h-5 mx-auto mb-1 opacity-80" />
              <p className="text-xs opacity-70">Rain</p>
              <p className="font-semibold">{forecast[1]?.rainProb || 0}%</p>
            </div>
            <div className="text-center">
              <Clock className="w-5 h-5 mx-auto mb-1 opacity-80" />
              <p className="text-xs opacity-70">Updated</p>
              <p className="font-semibold text-sm">{weather.updatedAt}</p>
            </div>
          </div>
        </div>

        {/* Current Weather Detail Card */}
        <div className="card">
          <div className="flex items-center gap-2 mb-3">
            <Droplet className="w-5 h-5 text-blue-600" />
            <h3 className="font-bold text-slate-900">Current Conditions</h3>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center">
                <Droplet className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <p className="text-xs text-slate-400">Humidity</p>
                <p className="font-semibold text-slate-700">{weather.humidity}%</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center">
                <Wind className="w-4 h-4 text-slate-600" />
              </div>
              <div>
                <p className="text-xs text-slate-400">Wind Speed</p>
                <p className="font-semibold text-slate-700">{weather.windSpeed} km/h</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-lg bg-kisan-orange-50 flex items-center justify-center">
                <CloudRain className="w-4 h-4 text-kisan-orange-600" />
              </div>
              <div>
                <p className="text-xs text-slate-400">Tomorrow Rain</p>
                <p className="font-semibold text-slate-700">{forecast[1]?.rainProb || 0}%</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center">
                <Clock className="w-4 h-4 text-slate-600" />
              </div>
              <div>
                <p className="text-xs text-slate-400">Last Updated</p>
                <p className="font-semibold text-slate-700">{weather.updatedAt}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Weather Risk Alerts */}
        <div>
          <h3 className="section-title mb-3 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-kisan-orange-600" />
            Weather Risk Alerts
          </h3>
          <div className="space-y-2">
            {alerts.map((alert, i) => {
              const s = severityStyles[alert.severity];
              return (
                <div key={i} className={`rounded-xl ${s.bg} border ${s.border} p-4 animate-slide-up`} style={{ animationDelay: `${i * 0.05}s` }}>
                  <div className="flex items-start gap-3">
                    <div className={`w-9 h-9 rounded-lg ${s.badge} flex items-center justify-center flex-shrink-0`}>
                      <alert.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`badge ${s.badge}`}>{alert.severity.toUpperCase()}</span>
                        <span className="font-semibold text-slate-900 text-sm">{alert.type}</span>
                      </div>
                      <p className={`text-sm ${s.text}`}>{alert.message}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Crop Advisory */}
        <div>
          <h3 className="section-title mb-3 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-kisan-green-600" />
            Crop Advisory — {farmer?.crop_type || 'Wheat'}
          </h3>
          <div className="space-y-2">
            {advice.map((item, i) => (
              <div
                key={i}
                className={`rounded-xl p-4 border animate-slide-up ${
                  item.positive
                    ? 'bg-kisan-green-50 border-kisan-green-200'
                    : 'bg-kisan-orange-50 border-kisan-orange-200'
                }`}
                style={{ animationDelay: `${i * 0.05}s` }}
              >
                <div className="flex items-start gap-3">
                  <item.icon className={`w-5 h-5 flex-shrink-0 mt-0.5 ${item.positive ? 'text-kisan-green-600' : 'text-kisan-orange-600'}`} />
                  <p className={`text-sm font-medium ${item.positive ? 'text-kisan-green-800' : 'text-kisan-orange-800'}`}>
                    {item.text}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Crop Precaution Measures */}
        <div>
          <h3 className="section-title mb-3 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-blue-600" />
            Crop Protection Measures
          </h3>
          <div className="space-y-2">
            {precautions.map((item, i) => {
              const priorityStyles = {
                high: { bg: 'bg-red-50', border: 'border-red-200', badge: 'bg-red-100 text-red-700', icon: 'text-red-600' },
                medium: { bg: 'bg-kisan-orange-50', border: 'border-kisan-orange-200', badge: 'bg-kisan-orange-100 text-kisan-orange-700', icon: 'text-kisan-orange-600' },
                low: { bg: 'bg-slate-50', border: 'border-slate-200', badge: 'bg-slate-100 text-slate-600', icon: 'text-slate-500' },
              };
              const ps = priorityStyles[item.priority];
              return (
                <div
                  key={i}
                  className={`rounded-xl ${ps.bg} border ${ps.border} p-4 animate-slide-up`}
                  style={{ animationDelay: `${i * 0.05}s` }}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-9 h-9 rounded-lg ${ps.badge} flex items-center justify-center flex-shrink-0`}>
                      <item.icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`badge ${ps.badge}`}>{item.priority.toUpperCase()}</span>
                        <span className="font-semibold text-slate-900 text-sm">{item.title}</span>
                      </div>
                      <p className="text-sm text-slate-600 leading-relaxed">{item.description}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 7-Day Forecast */}
        <div className="card">
          <button
            onClick={() => setShowForecast(!showForecast)}
            className="w-full flex items-center justify-between"
          >
            <h3 className="font-bold text-slate-900 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-600" />
              7-Day Forecast
            </h3>
            <ChevronRight className={`w-5 h-5 text-slate-400 transition-transform ${showForecast ? 'rotate-90' : ''}`} />
          </button>
          {showForecast && forecast.length > 0 && (
            <div className="mt-4 space-y-2 animate-fade-in">
              {forecast.map((day, i) => (
                <div key={i} className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0">
                  <div className="flex items-center gap-3">
                    <img src={day.iconUrl} alt={day.condition} className="w-8 h-8" />
                    <div>
                      <p className="font-semibold text-slate-900 text-sm">{day.day}</p>
                      <p className="text-xs text-slate-500">{day.condition}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <div className="text-center">
                      <p className="text-xs text-slate-400">Temp</p>
                      <p className="font-semibold text-slate-700">{day.maxTemp}°/{day.minTemp}°</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-slate-400">Rain</p>
                      <p className="font-semibold text-slate-700">{day.rainProb}%</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-slate-400">Wind</p>
                      <p className="font-semibold text-slate-700">{day.windSpeed}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button onClick={handleRefresh} className="btn-secondary flex-1" disabled={refreshing}>
            <RefreshCw className={`w-5 h-5 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          <button onClick={() => navigate('findMandis')} className="btn-primary flex-1">
            <Calendar className="w-5 h-5" />
            Book Recommended Slot
          </button>
        </div>
      </div>
      <BottomNav />
      <FloatingMic />
    </ScreenContainer>
  );
}
