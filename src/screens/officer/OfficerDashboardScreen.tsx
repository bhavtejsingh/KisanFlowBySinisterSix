import { useApp } from '@/context/AppContext';
import { Users, Activity, Package, Building, ChevronRight, ListChecks, QrCode, BarChart3, Wallet } from 'lucide-react';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { ScreenContainer, LoadingSpinner, StatCard } from '@/components/ui';
import { Header } from '@/components/common';

export function OfficerDashboardScreen() {
  const { officer, navigate, t } = useApp();
  const [stats, setStats] = useState({ farmers: 0, queue: 0, procurement: 0, capacity: 0 });
  const [loading, setLoading] = useState(true);
  const [recentBookings, setRecentBookings] = useState<any[]>([]);

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
