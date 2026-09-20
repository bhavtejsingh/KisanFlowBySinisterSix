import { useApp } from '@/context/AppContext';
import { Users, Activity, Package, Building, ChevronRight, ListChecks, QrCode, BarChart3, Wallet, Droplet, AlertTriangle, Zap, CloudRain } from 'lucide-react';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { ScreenContainer, LoadingSpinner, StatCard } from '@/components/ui';
import { Header } from '@/components/common';
import { WeatherWidget } from '@/components/WeatherWidget';
import { fetchCurrentWeather, fetchForecast, type CurrentWeather, type ForecastDay } from '@/lib/weather';

export function OfficerDashboardScreen() {
  const { officer, navigate, t } = useApp();
  const [stats, setStats] = useState({ farmers: 0, queue: 0, procurement: 0, capacity: 0 });
  const [loading, setLoading] = useState(true);
  const [recentBookings, setRecentBookings] = useState<any[]>([]);
  const [weather, setWeather] = useState<CurrentWeather | null>(null);
  const [forecast, setForecast] = useState<ForecastDay[]>([]);

  const officerLocation = officer?.centre_name ? `${officer.centre_name}, Punjab` : 'Punjab';

  useEffect(() => {
    (async () => {
      setLoading(true);
      const { count: farmerCount } = await supabase
        .from('bookings')
        .select('*', { count: 'exact', head: true });

      const { data: bookings } = await supabase
        .from('bookings')
        .select('*, mandis(name)')
        .order('created_at', { ascending: false })
        .limit(5);

      const { data: mandi } = await supabase
        .from('mandis')
        .select('*')
        .limit(1)
        .maybeSingle();

      setStats({
        farmers: farmerCount || 0,
        queue: mandi?.current_queue_length || 0,
        procurement: 0,
        capacity: mandi ? Math.round(((mandi.capacity_per_day - mandi.available_slots) / mandi.capacity_per_day) * 100) : 0,
      });
      setRecentBookings(bookings || []);

      const [w, f] = await Promise.all([
        fetchCurrentWeather(officerLocation),
        fetchForecast(officerLocation, 2),
      ]);
      setWeather(w);
      setForecast(f);

      setLoading(false);
    })();
  }, []);

  if (!officer) return null;

  const sections = [
    { icon: ListChecks, label: t('liveQueue'), screen: 'liveQueue' as const, color: 'text-kisan-green-600 bg-kisan-green-50' },
    { icon: QrCode, label: t('scanQR'), screen: 'qrVerification' as const, color: 'text-kisan-orange-600 bg-kisan-orange-50' },
    { icon: Wallet, label: t('paymentProcessingTitle'), screen: 'paymentProcessing' as const, color: 'text-blue-600 bg-blue-50' },
    { icon: BarChart3, label: t('analytics'), screen: 'analytics' as const, color: 'text-purple-600 bg-purple-50' },
  ];

  const tomorrowRain = forecast[1]?.rainProb || 0;
  const riskLevel = tomorrowRain > 70 ? 'High' : tomorrowRain > 40 ? 'Medium' : 'Low';
  const riskColor = tomorrowRain > 70 ? 'bg-red-400/30' : tomorrowRain > 40 ? 'bg-kisan-orange-400/30' : 'bg-green-400/30';
  const impactPct = tomorrowRain > 70 ? -15 : tomorrowRain > 40 ? -8 : 0;

  return (
    <ScreenContainer>
      <Header title={t('officerDashboard')} showBack={false} />
      <div className="px-4 py-4 pb-10 space-y-5">
        <div className="flex items-center gap-3 animate-fade-in">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-kisan-orange-400 to-kisan-orange-600 flex items-center justify-center text-white font-bold text-lg">
            {officer.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="text-sm text-slate-500">{t('welcome')}</p>
            <h2 className="text-lg font-bold text-slate-900">{officer.name}</h2>
            <p className="text-xs text-slate-400">{officer.role} • {officer.centre_name}</p>
          </div>
        </div>

        <WeatherWidget location={officerLocation} showLocationPicker />

        {loading ? (
          <LoadingSpinner />
        ) : (
          <>
            <div className="grid grid-cols-2 gap-3">
              <StatCard icon={Users} label={t('todaysFarmers')} value={stats.farmers} color="green" />
              <StatCard icon={Activity} label={t('activeQueue')} value={stats.queue} color="orange" />
              <StatCard icon={Package} label={t('procurementVolume')} value={`${stats.procurement} qtl`} color="blue" />
              <StatCard icon={Building} label={t('centreCapacity')} value={`${stats.capacity}%`} color="green" />
            </div>

            {/* Weather Impact on Procurement */}
            {weather && (
              <div className="card">
                <h3 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-kisan-orange-600" />
                  Weather Impact Analysis
                </h3>
                <div className="grid grid-cols-3 gap-3 mb-3">
                  <div className="text-center rounded-xl bg-blue-50 py-3">
                    <CloudRain className="w-5 h-5 mx-auto mb-1 text-blue-600" />
                    <p className="text-xs text-slate-400">Rain Prob</p>
                    <p className="font-bold text-slate-900">{tomorrowRain}%</p>
                  </div>
                  <div className="text-center rounded-xl bg-kisan-orange-50 py-3">
                    <AlertTriangle className="w-5 h-5 mx-auto mb-1 text-kisan-orange-600" />
                    <p className="text-xs text-slate-400">Risk Level</p>
                    <p className="font-bold text-slate-900">{riskLevel}</p>
                  </div>
                  <div className={`text-center rounded-xl py-3 ${riskColor}`}>
                    <Zap className="w-5 h-5 mx-auto mb-1 text-white" />
                    <p className="text-xs text-white/80">Capacity Impact</p>
                    <p className="font-bold text-white">{impactPct > 0 ? '+' : ''}{impactPct}%</p>
                  </div>
                </div>
                <div className="rounded-xl bg-slate-50 p-3">
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {tomorrowRain > 70
                      ? `Rain probability of ${tomorrowRain}% expected tomorrow. Farmers may delay arrivals. Centre capacity can be reduced by ${Math.abs(impactPct)}%.`
                      : tomorrowRain > 40
                      ? `Moderate rain (${tomorrowRain}%) expected. Some farmers may delay. Plan for ${Math.abs(impactPct)}% lower turnout.`
                      : `Weather conditions are favorable. Expected normal farmer arrivals and full capacity utilization.`}
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-3 mt-3">
                  <div className="flex items-center gap-2">
                    <Droplet className="w-4 h-4 text-blue-500" />
                    <div>
                      <p className="text-xs text-slate-400">Moisture Risk</p>
                      <p className="font-semibold text-slate-700 text-sm">
                        {weather.humidity > 75 ? 'High' : weather.humidity > 55 ? 'Medium' : 'Low'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-kisan-green-500" />
                    <div>
                      <p className="text-xs text-slate-400">Expected Arrivals</p>
                      <p className="font-semibold text-slate-700 text-sm">
                        {tomorrowRain > 70 ? 'Reduced' : tomorrowRain > 40 ? 'Slightly Lower' : 'Normal'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div>
              <h3 className="section-title mb-3">Quick Actions</h3>
              <div className="grid grid-cols-2 gap-3">
                {sections.map((section, i) => (
                  <button
                    key={i}
                    onClick={() => navigate(section.screen)}
                    className="card-hover flex items-center gap-3 animate-fade-in"
                    style={{ animationDelay: `${i * 0.05}s` }}
                  >
                    <div className={`w-10 h-10 rounded-xl ${section.color} flex items-center justify-center`}>
                      <section.icon className="w-5 h-5" />
                    </div>
                    <span className="text-sm font-semibold text-slate-700 text-left flex-1">{section.label}</span>
                    <ChevronRight className="w-4 h-4 text-slate-300" />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="section-title mb-3">{t('liveQueue')}</h3>
              <div className="space-y-2">
                {recentBookings.length === 0 ? (
                  <div className="card text-center text-sm text-slate-500 py-6">{t('noFarmersInQueue')}</div>
                ) : (
                  recentBookings.map((b) => (
                    <div key={b.id} className="card flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-kisan-green-50 flex items-center justify-center">
                          <span className="font-bold text-kisan-green-600">#{b.token_number}</span>
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900 text-sm">{b.crop_type} • {b.expected_quantity_qtl} qtl</p>
                          <p className="text-xs text-slate-500">{b.mandis?.name || ''} • {b.slot_time}</p>
                        </div>
                      </div>
                      <span className={`badge ${
                        b.status === 'completed' ? 'badge-green' :
                        b.status === 'in_progress' ? 'badge-orange' :
                        b.status === 'arrived' ? 'badge-blue' : 'badge-gray'
                      }`}>{b.status}</span>
                    </div>
                  ))
                )}
              </div>
            </div>

            <button onClick={() => navigate('liveQueue')} className="btn-primary w-full">
              {t('manageQueue')}
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}
      </div>
    </ScreenContainer>
  );
}
