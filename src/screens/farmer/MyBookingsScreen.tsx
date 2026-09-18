import { useApp } from '@/context/AppContext';
import { Calendar, QrCode, Download, ChevronRight, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import type { Booking, Mandi } from '@/lib/types';
import { ScreenContainer, LoadingSpinner, EmptyState, StatusBadge } from '@/components/ui';
import { Header, BottomNav, FloatingMic } from '@/components/common';
import { QRCodeDisplay, downloadQR } from '@/components/QRCodeDisplay';

export function MyBookingsScreen() {
  const { farmer, navigate, setSelectedBookingId, t } = useApp();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [mandis, setMandis] = useState<Record<string, Mandi>>({});
  const [loading, setLoading] = useState(true);
  const [qrModal, setQrModal] = useState<Booking | null>(null);

  useEffect(() => {
    if (!farmer) return;
    (async () => {
      setLoading(true);
      const { data: bs } = await supabase
        .from('bookings')
        .select('*')
        .eq('farmer_id', farmer.id)
        .order('created_at', { ascending: false });
      if (bs) {
        setBookings(bs as Booking[]);
        const mandiIds = [...new Set((bs as Booking[]).map((b) => b.mandi_id))];
        const { data: ms } = await supabase.from('mandis').select('*').in('id', mandiIds);
        if (ms) {
          const map: Record<string, Mandi> = {};
          (ms as Mandi[]).forEach((m) => { map[m.id] = m; });
          setMandis(map);
        }
      }
      setLoading(false);
    })();
  }, [farmer]);

  if (loading) return <LoadingSpinner />;
  if (!farmer) return null;

  if (bookings.length === 0) {
    return (
      <ScreenContainer>
        <Header title={t('myBookingsTitle')} />
        <EmptyState icon={Calendar} title={t('noBookingsFound')} description={t('noBookingsDesc')} />
        <BottomNav />
        <FloatingMic />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      <Header title={t('myBookingsTitle')} />
      <div className="px-4 py-4 pb-28">
        <p className="text-sm text-slate-500 mb-4">{t('bookingHistory')}</p>
        <div className="space-y-3">
          {bookings.map((booking, i) => {
            const mandi = mandis[booking.mandi_id];
            return (
              <div
                key={booking.id}
                className="card animate-slide-up"
                style={{ animationDelay: `${i * 0.05}s` }}
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold text-kisan-green-600">#{booking.token_number}</span>
                      <StatusBadge status={booking.status} />
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">{booking.booking_id}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-slate-900">{mandi?.name || ''}</p>
                    <p className="text-xs text-slate-500">{booking.preferred_date}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-sm text-slate-600 mb-3">
                  <span>{booking.crop_type}</span>
                  <span>•</span>
                  <span>{booking.expected_quantity_qtl} qtl</span>
                  <span>•</span>
                  <span>{booking.slot_time}</span>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => setQrModal(booking)}
                    className="btn-ghost flex-1 border border-slate-200"
                  >
                    <QrCode className="w-4 h-4" />
                    {t('viewQR')}
                  </button>
                  <button
                    onClick={() => downloadQR(booking.qr_code_data || booking.booking_id, `QR-${booking.booking_id}.png`)}
                    className="btn-ghost flex-1 border border-slate-200"
                  >
                    <Download className="w-4 h-4" />
                    {t('downloadQR')}
                  </button>
                  <button
                    onClick={() => {
                      setSelectedBookingId(booking.id);
                      if (booking.status === 'booked' || booking.status === 'arrived' || booking.status === 'in_progress') {
                        navigate('queueTracking');
                      } else {
                        navigate('paymentTracking');
                      }
                    }}
                    className="btn-primary flex-1 py-2 text-sm"
                  >
                    {t('view')}
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {qrModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setQrModal(null)}>
          <div className="bg-white rounded-2xl p-6 max-w-xs w-full animate-slide-up" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-900">{t('qrCode')}</h3>
              <button onClick={() => setQrModal(null)} className="p-1 rounded-lg hover:bg-slate-100">
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>
            <div className="flex flex-col items-center gap-3">
              <QRCodeDisplay data={qrModal.qr_code_data || qrModal.booking_id} size={200} />
              <p className="font-semibold text-slate-900">Token #{qrModal.token_number}</p>
              <p className="text-sm text-slate-500">{qrModal.booking_id}</p>
              <button
                onClick={() => downloadQR(qrModal.qr_code_data || qrModal.booking_id, `QR-${qrModal.booking_id}.png`)}
                className="btn-primary w-full"
              >
                <Download className="w-5 h-5" />
                {t('downloadQR')}
              </button>
            </div>
          </div>
        </div>
      )}

      <BottomNav />
      <FloatingMic />
    </ScreenContainer>
  );
}
