import { useApp } from '@/context/AppContext';
import { Calendar, Users, Wallet, Search, BookOpen, Mic, HelpCircle, Clock, MapPin, TrendingUp, ChevronRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import type { Booking, Mandi, Payment } from '@/lib/types';
import { ScreenContainer, LoadingSpinner, EmptyState } from '@/components/ui';
import { Header, BottomNav, FloatingMic } from '@/components/common';

export function FarmerDashboardScreen() {
  const { farmer, navigate, t } = useApp();
  const [upcomingBooking, setUpcomingBooking] = useState<Booking | null>(null);
  const [mandi, setMandi] = useState<Mandi | null>(null);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!farmer) return;
    (async () => {
      setLoading(true);
      const { data: bookings } = await supabase
        .from('bookings')
        .select('*')
        .eq('farmer_id', farmer.id)
        .in('status', ['booked', 'arrived', 'in_progress'])
        .order('preferred_date', { ascending: true })
        .limit(1);

      if (bookings && bookings.length > 0) {
        setUpcomingBooking(bookings[0] as Booking);
        const { data: m } = await supabase
          .from('mandis')
          .select('*')
          .eq('id', (bookings[0] as Booking).mandi_id)
          .maybeSingle();
        if (m) setMandi(m as Mandi);
      }

      const { data: pays } = await supabase
        .from('payments')
        .select('*')
        .eq('farmer_id', farmer.id)
        .order('created_at', { ascending: false })
        .limit(3);
      if (pays) setPayments(pays as Payment[]);

      setLoading(false);
    })();
  }, [farmer]);

  if (!farmer) return null;

  const quickActions = [
    { icon: Calendar, label: t('bookSlot'), screen: 'findMandis' as const, color: 'bg-kisan-green-100 text-kisan-green-600' },
    { icon: Search, label: t('findMandis'), screen: 'findMandis' as const, color: 'bg-blue-100 text-blue-600' },
    { icon: BookOpen, label: t('myBookings'), screen: 'myBookings' as const, color: 'bg-kisan-orange-100 text-kisan-orange-600' },
    { icon: Mic, label: t('voiceAssistant'), screen: 'voiceAssistant' as const, color: 'bg-purple-100 text-purple-600' },
    { icon: Wallet, label: t('payments'), screen: 'paymentTracking' as const, color: 'bg-emerald-100 text-emerald-600' },
    { icon: HelpCircle, label: t('helpCenter'), screen: 'helpCenter' as const, color: 'bg-slate-100 text-slate-600' },
  ];

  return (
    <ScreenContainer>
      <Header title={t('dashboard')} showBack={false} />
      <div className="px-4 py-4 pb-28 space-y-5">
        <div className="flex items-center gap-3 animate-fade-in">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-kisan-green-400 to-kisan-green-600 flex items-center justify-center text-white font-bold text-lg">
            {farmer.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="text-sm text-slate-500">{t('welcome')}</p>
            <h2 className="text-lg font-bold text-slate-900">{farmer.name}</h2>
          </div>
        </div>

        {loading ? (
          <LoadingSpinner />
        ) : (
          <>
            <div className="grid grid-cols-1 gap-3">
              <div className="rounded-2xl bg-gradient-to-br from-kisan-green-500 to-kisan-green-700 p-5 text-white shadow-lg shadow-kisan-green-600/20 animate-slide-up">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm opacity-90">{t('upcomingBooking')}</span>
                  <Calendar className="w-5 h-5 opacity-80" />
                </div>
                {upcomingBooking ? (
                  <>
                    <p className="text-2xl font-bold">Token #{upcomingBooking.token_number}</p>
                    <p className="text-sm opacity-90 mt-1">{mandi?.name || 'Mandi'}</p>
                    <div className="flex items-center gap-2 mt-3 text-sm opacity-80">
                      <Clock className="w-4 h-4" />
                      <span>{upcomingBooking.slot_time}</span>
                    </div>
                    <button
                      onClick={() => navigate('queueTracking')}
                      className="mt-3 w-full bg-white/20 backdrop-blur rounded-xl py-2 text-sm font-semibold hover:bg-white/30 transition-colors"
                    >
                      {t('queueStatus')} →
                    </button>
                  </>
                ) : (
                  <div>
                    <p className="text-lg font-semibold">{t('noBookings')}</p>
                    <p className="text-sm opacity-80 mt-0.5">{t('noBookingsDesc')}</p>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div
                  onClick={() => navigate('queueTracking')}
                  className="card-hover cursor-pointer"
                >
                  <Users className="w-6 h-6 text-kisan-green-600 mb-2" />
                  <p className="text-sm text-slate-500">{t('queueStatus')}</p>
                  <p className="text-lg font-bold text-slate-900">
                    {upcomingBooking ? `#${upcomingBooking.token_number}` : '—'}
                  </p>
                </div>
                <div
                  onClick={() => navigate('paymentTracking')}
                  className="card-hover cursor-pointer"
                >
                  <Wallet className="w-6 h-6 text-kisan-orange-600 mb-2" />
                  <p className="text-sm text-slate-500">{t('paymentStatus')}</p>
                  <p className="text-lg font-bold text-slate-900">
                    {payments.length > 0 ? `₹${(payments[0].amount / 1000).toFixed(1)}K` : '—'}
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="section-title mb-3">{t('quickActions')}</h3>
              <div className="grid grid-cols-3 gap-3">
                {quickActions.map((action, i) => (
                  <button
                    key={i}
                    onClick={() => navigate(action.screen)}
                    className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-white border border-slate-100 hover:shadow-md hover:border-slate-200 transition-all active:scale-95 animate-fade-in"
                    style={{ animationDelay: `${i * 0.05}s` }}
                  >
                    <div className={`w-12 h-12 rounded-xl ${action.color} flex items-center justify-center`}>
                      <action.icon className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-medium text-slate-700 text-center leading-tight">{action.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {payments.length > 0 && (
              <div>
                <h3 className="section-title mb-3">{t('paymentStatus')}</h3>
                <div className="space-y-2">
                  {payments.map((p) => (
                    <div key={p.id} className="card flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-kisan-green-50 flex items-center justify-center">
                          <TrendingUp className="w-5 h-5 text-kisan-green-600" />
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900">₹{p.amount.toLocaleString('en-IN')}</p>
                          <p className="text-xs text-slate-500">{p.payment_id}</p>
                        </div>
                      </div>
                      <span className={`badge ${
                        p.status === 'completed' ? 'badge-green' :
                        p.status === 'processing' ? 'badge-orange' :
                        p.status === 'pending' ? 'badge-gray' : 'badge-red'
                      }`}>
                        {p.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
      <BottomNav />
      <FloatingMic />
    </ScreenContainer>
  );
}
