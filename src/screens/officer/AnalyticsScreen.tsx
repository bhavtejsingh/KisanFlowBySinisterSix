import { useApp } from '@/context/AppContext';
import { TrendingUp, Users, Clock, Package, BarChart3 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { ScreenContainer, LoadingSpinner, StatCard } from '@/components/ui';
import { Header } from '@/components/common';
import { SimpleBarChart, DonutChart } from '@/components/widgets';

export function AnalyticsScreen() {
  const { t } = useApp();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ farmers: 0, procurement: 0, avgWait: 0, utilization: 0 });

  useEffect(() => {
    (async () => {
      const { count } = await supabase.from('bookings').select('*', { count: 'exact', head: true });
      const { data: mandi } = await supabase.from('mandis').select('*').limit(1).maybeSingle();
      setStats({
        farmers: count || 0,
        procurement: 0,
        avgWait: 22,
        utilization: mandi ? Math.round(((mandi.capacity_per_day - mandi.available_slots) / mandi.capacity_per_day) * 100) : 0,
      });
      setLoading(false);
    })();
  }, []);

  const hourlyData = [12, 28, 45, 38, 52, 48, 35, 22];
  const hourlyLabels = ['8AM', '9AM', '10AM', '11AM', '12PM', '1PM', '2PM', '3PM'];

  const congestionData = [30, 55, 75, 85, 70, 50, 35, 20];
  const congestionLabels = ['8AM', '9AM', '10AM', '11AM', '12PM', '1PM', '2PM', '3PM'];

  const cropSegments = [
    { label: 'Wheat', value: 45, color: '#f59e0b' },
    { label: 'Rice', value: 30, color: '#22c55e' },
    { label: 'Maize', value: 15, color: '#3b82f6' },
    { label: 'Cotton', value: 10, color: '#ec4899' },
  ];

  if (loading) return <LoadingSpinner />;

  return (
    <ScreenContainer>
      <Header title={t('analyticsDashboard')} />
      <div className="px-4 py-4 pb-10 space-y-5">
        <div className="grid grid-cols-2 gap-3">
          <StatCard icon={Users} label={t('totalFarmers')} value={stats.farmers} color="green" />
          <StatCard icon={Package} label={t('totalProcurement')} value={`${stats.procurement} qtl`} color="orange" />
          <StatCard icon={Clock} label={t('avgWaitTime')} value={`${stats.avgWait} min`} color="blue" />
          <StatCard icon={TrendingUp} label={t('utilization')} value={`${stats.utilization}%`} color="green" />
        </div>

        <div className="card">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="w-5 h-5 text-kisan-green-600" />
            <h3 className="font-bold text-slate-900">{t('hourlyArrivals')}</h3>
          </div>
          <SimpleBarChart data={hourlyData} labels={hourlyLabels} color="#22c55e" />
        </div>

        <div className="card">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="w-5 h-5 text-kisan-orange-600" />
            <h3 className="font-bold text-slate-900">{t('queueCongestion')}</h3>
          </div>
          <SimpleBarChart data={congestionData} labels={congestionLabels} color="#f97316" />
        </div>

        <div className="card">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="w-5 h-5 text-blue-600" />
            <h3 className="font-bold text-slate-900">{t('procurementVolumeChart')}</h3>
          </div>
          <SimpleBarChart data={[15, 28, 42, 35, 55, 48, 38]} labels={['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']} color="#3b82f6" />
        </div>

        <div className="card">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="w-5 h-5 text-purple-600" />
            <h3 className="font-bold text-slate-900">{t('cropDistribution')}</h3>
          </div>
          <DonutChart segments={cropSegments} />
        </div>

        <div className="card">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-kisan-green-600" />
            <h3 className="font-bold text-slate-900">{t('capacityUtilization')}</h3>
          </div>
          <div className="flex items-end justify-between gap-1 h-32">
            {[60, 75, 85, 70, 90, 65, 80].map((val, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <div className="w-full flex-1 flex items-end">
                  <div
                    className="w-full rounded-t-md bg-gradient-to-t from-kisan-green-400 to-kisan-green-600 transition-all duration-700"
                    style={{ height: `${val}%` }}
                  />
                </div>
                <span className="text-xs text-slate-500">{['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i]}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </ScreenContainer>
  );
}
