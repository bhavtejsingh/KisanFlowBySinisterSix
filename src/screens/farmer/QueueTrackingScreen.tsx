import { useApp } from '@/context/AppContext';
import { Users, Clock, Mic, CheckCircle2, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import type { Booking, Mandi, QueueEvent } from '@/lib/types';
import { ScreenContainer, LoadingSpinner, EmptyState } from '@/components/ui';
import { Header, BottomNav, FloatingMic } from '@/components/common';
import { ProgressBar } from '@/components/widgets';

export function QueueTrackingScreen() {
  const { farmer, navigate, t } = useApp();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [mandi, setMandi] = useState<Mandi | null>(null);
  const [queueEvent, setQueueEvent] = useState<QueueEvent | null>(null);
  const [loading, setLoading] = useState(true);
  const [voiceUpdate, setVoiceUpdate] = useState(false);

  useEffect(() => {
    if (!farmer) return;
    (async () => {
      setLoading(true);
      const { data: b } = await supabase
        .from('bookings')
        .select('*')
        .eq('farmer_id', farmer.id)
        .in('status', ['booked', 'arrived', 'in_progress'])
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (b) {
        setBooking(b as Booking);
        const { data: m } = await supabase
          .from('mandis')
          .select('*')
          .eq('id', (b as Booking).mandi_id)
          .maybeSingle();
        if (m) setMandi(m as Mandi);

        const { data: qe } = await supabase
          .from('queue_events')
          .select('*')
          .eq('mandi_id', (b as Booking).mandi_id)
          .maybeSingle();
        if (qe) setQueueEvent(qe as QueueEvent);
      }
      setLoading(false);
    })();
  }, [farmer]);

  if (loading) return <LoadingSpinner />;
  if (!booking || !mandi) {
    return (
      <ScreenContainer>
        <Header title={t('queueTracking')} />
        <EmptyState icon={Users} title={t('noBookings')} description={t('noBookingsDesc')} />
        <BottomNav />
        <FloatingMic />
      </ScreenContainer>
    );
  }

  const currentToken = queueEvent?.current_token || 1;
  const myToken = booking.token_number;
  const peopleAhead = Math.max(0, myToken - currentToken);
  const isMyTurn = peopleAhead === 0;
  const isInProgress = booking.status === 'in_progress';
  const totalTokens = queueEvent?.total_tokens || myToken;
  const progressPct = totalTokens > 0 ? Math.round((currentToken / totalTokens) * 100) : 0;

  const handleVoiceUpdate = () => {
    setVoiceUpdate(true);
    setTimeout(() => setVoiceUpdate(false), 3000);
  };

  return (
    <ScreenContainer>
      <Header title={t('queueTracking')} />
      <div className="px-4 py-4 pb-28 space-y-4">
        <div className="card">
          <p className="text-sm text-slate-500">{mandi.name}</p>
          <p className="text-xs text-slate-400 mt-0.5">{booking.booking_id}</p>
        </div>

        {isInProgress ? (
          <div className="rounded-2xl bg-gradient-to-br from-kisan-green-500 to-kisan-green-700 p-6 text-white text-center shadow-lg">
            <CheckCircle2 className="w-12 h-12 mx-auto mb-2" />
            <p className="text-lg font-bold">{t('inProgress')}</p>
          </div>
        ) : isMyTurn ? (
          <div className="rounded-2xl bg-gradient-to-br from-kisan-orange-400 to-kisan-orange-600 p-6 text-white text-center shadow-lg animate-pulse">
            <p className="text-2xl font-bold">{t('yourTurnSoon')}</p>
          </div>
        ) : (
          <div className="rounded-2xl bg-gradient-to-br from-kisan-green-500 to-kisan-green-700 p-6 text-white shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm opacity-80">{t('myToken')}</p>
                <p className="text-4xl font-bold">#{myToken}</p>
              </div>
              <div className="text-right">
                <p className="text-sm opacity-80">{t('currentToken')}</p>
                <p className="text-4xl font-bold">#{currentToken}</p>
              </div>
            </div>
            <div className="flex items-center justify-center gap-2 text-sm opacity-90">
              <Users className="w-4 h-4" />
              <span>{t('queuePosition')} {peopleAhead + 1}</span>
            </div>
          </div>
        )}

        {!isMyTurn && !isInProgress && (
          <>
            <div className="grid grid-cols-2 gap-3">
              <div className="card text-center">
                <Users className="w-6 h-6 text-kisan-orange-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-slate-900">{peopleAhead}</p>
                <p className="text-sm text-slate-500">{t('peopleAhead')}</p>
              </div>
              <div className="card text-center">
                <Clock className="w-6 h-6 text-kisan-green-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-slate-900">~{peopleAhead * 15}</p>
                <p className="text-sm text-slate-500">{t('estimatedWait')} ({t('minutes')})</p>
              </div>
            </div>

            <div className="card">
              <ProgressBar value={currentToken} max={totalTokens} label={t('queueStatus')} />
            </div>
          </>
        )}

        <button onClick={handleVoiceUpdate} className="btn-secondary w-full">
          {voiceUpdate ? (
            <><Loader2 className="w-5 h-5 animate-spin" /> {t('voiceListening')}</>
          ) : (
            <><Mic className="w-5 h-5" /> {t('voiceUpdate')}</>
          )}
        </button>

        <button onClick={() => navigate('paymentTracking')} className="btn-ghost w-full">
          {t('paymentTracking')} →
        </button>
      </div>
      <BottomNav />
      <FloatingMic />
    </ScreenContainer>
  );
}
