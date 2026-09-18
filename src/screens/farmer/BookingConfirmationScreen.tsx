import { useApp } from '@/context/AppContext';
import { CheckCircle2, Download, Calendar, Clock, MapPin, QrCode } from 'lucide-react';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import type { Booking, Mandi } from '@/lib/types';
import { ScreenContainer, LoadingSpinner } from '@/components/ui';
import { Header } from '@/components/common';
import { QRCodeDisplay, downloadQR } from '@/components/QRCodeDisplay';

export function BookingConfirmationScreen() {
  const { lastBookingId, navigate, t } = useApp();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [mandi, setMandi] = useState<Mandi | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!lastBookingId) return;
    (async () => {
      const { data: b } = await supabase
        .from('bookings')
        .select('*')
        .eq('booking_id', lastBookingId)
        .maybeSingle();
      if (b) {
        setBooking(b as Booking);
        const { data: m } = await supabase
          .from('mandis')
          .select('*')
          .eq('id', (b as Booking).mandi_id)
          .maybeSingle();
        if (m) setMandi(m as Mandi);
      }
      setLoading(false);
    })();
  }, [lastBookingId]);

  if (loading) return <LoadingSpinner />;
  if (!booking) return null;

  return (
    <ScreenContainer>
      <Header title={t('bookingConfirmed')} showBack={false} />
      <div className="px-4 py-6 pb-28">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-kisan-green-100 flex items-center justify-center animate-slide-up">
            <CheckCircle2 className="w-10 h-10 text-kisan-green-600" />
          </div>
          <div className="text-center animate-slide-up">
            <h2 className="text-2xl font-bold text-slate-900">{t('bookingConfirmed')}!</h2>
            <p className="text-slate-500 mt-1">{t('bookingConfirmedDesc')}</p>
          </div>

          <div className="w-full card space-y-4 animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <div className="flex flex-col items-center">
              <QRCodeDisplay data={booking.qr_code_data || booking.booking_id} size={180} />
              <p className="text-sm text-slate-500 mt-2">{t('qrCode')}</p>
            </div>

            <div className="space-y-3 border-t border-slate-100 pt-4">
              <InfoRow label={t('bookingId')} value={booking.booking_id} />
              <InfoRow label={t('tokenNumber')} value={`#${booking.token_number}`} highlight />
              <InfoRow label={t('mandiName')} value={mandi?.name || ''} icon={MapPin} />
              <InfoRow label={t('slotTiming')} value={booking.slot_time} icon={Clock} />
              <InfoRow label={t('date')} value={booking.preferred_date} icon={Calendar} />
              <InfoRow label={t('expectedWait')} value={`~${booking.expected_wait_minutes} ${t('minutes')}`} />
            </div>
          </div>

          <div className="w-full p-3 rounded-xl bg-kisan-orange-50 border border-kisan-orange-200 text-sm text-kisan-orange-700 flex items-center gap-2">
            <QrCode className="w-4 h-4 flex-shrink-0" />
            <span>{t('saveQrNote')}</span>
          </div>

          <div className="w-full flex gap-3">
            <button
              onClick={() => downloadQR(booking.qr_code_data || booking.booking_id, `QR-${booking.booking_id}.png`)}
              className="btn-secondary flex-1"
            >
              <Download className="w-5 h-5" />
              {t('downloadQR')}
            </button>
            <button
              onClick={() => navigate('myBookings')}
              className="btn-primary flex-1"
            >
              {t('viewBooking')}
            </button>
          </div>

          <button
            onClick={() => navigate('queueTracking')}
            className="btn-ghost w-full"
          >
            {t('queueTracking')} →
          </button>
        </div>
      </div>
    </ScreenContainer>
  );
}

function InfoRow({ label, value, highlight, icon: Icon }: { label: string; value: string; highlight?: boolean; icon?: typeof MapPin }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-slate-500 flex items-center gap-1.5">
        {Icon && <Icon className="w-4 h-4 text-slate-400" />}
        {label}
      </span>
      <span className={`font-semibold ${highlight ? 'text-kisan-green-600 text-lg' : 'text-slate-900'}`}>
        {value}
      </span>
    </div>
  );
}
