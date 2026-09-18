import { useState, useEffect } from 'react';
import {
  QrCode,
  Download,
  Share2,
  X,
  ChevronRight,
  Calendar,
  MapPin,
  Loader,
  BookMarked,
} from 'lucide-react';
import { useApp } from '../App';
import Header from '../components/Header';
import BottomNav from '../components/BottomNav';
import { supabase } from '../lib/supabase';
import type { Booking } from '../data';

interface BookingRow extends Booking {
  dbId: string;
}

export default function BookingsScreen() {
  const { tr, booking, go } = useApp();
  const [bookings, setBookings] = useState<BookingRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [qrModal, setQrModal] = useState<BookingRow | null>(null);
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (data && data.length > 0) {
        const rows: BookingRow[] = data.map((r: Record<string, string>) => ({
          dbId: r.id,
          id: r.token,
          crop: r.crop,
          quantity: r.quantity,
          mandi: r.mandi,
          date: r.date,
          time: r.time,
          token: r.token,
          status: r.status as Booking['status'],
        }));
        setBookings(rows);
      } else if (booking) {
        setBookings([{
          dbId: 'local',
          id: booking.id,
          crop: booking.crop,
          quantity: booking.quantity,
          mandi: booking.mandi,
          date: booking.date,
          time: booking.time,
          token: booking.token,
          status: booking.status,
        }]);
      }
    } catch {
      if (booking) {
        setBookings([{
          dbId: 'local',
          id: booking.id,
          crop: booking.crop,
          quantity: booking.quantity,
          mandi: booking.mandi,
          date: booking.date,
          time: booking.time,
          token: booking.token,
          status: booking.status,
        }]);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (dbId: string) => {
    setCancellingId(dbId);
    try {
      if (dbId !== 'local') {
        await supabase.from('bookings').update({ status: 'cancelled' }).eq('id', dbId);
      }
      setBookings((prev) =>
        prev.map((b) => (b.dbId === dbId ? { ...b, status: 'cancelled' as const } : b))
      );
    } catch {
      setBookings((prev) =>
        prev.map((b) => (b.dbId === dbId ? { ...b, status: 'cancelled' as const } : b))
      );
    } finally {
      setCancellingId(null);
    }
  };

  const statusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-kisan-100 text-kisan-700';
      case 'in-queue': return 'bg-blue-100 text-blue-700';
      case 'procured': return 'bg-saffron-100 text-saffron-700';
      case 'paid': return 'bg-teal-100 text-teal-700';
      case 'cancelled': return 'bg-red-100 text-red-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const statusLabel = (status: string) => {
    switch (status) {
      case 'confirmed': return tr.confirmed;
      case 'in-queue': return tr.inQueue;
      case 'procured': return tr.procured;
      case 'paid': return tr.paid;
      case 'cancelled': return tr.cancelled;
      default: return status;
    }
  };

  return (
    <div className="min-h-full bg-gray-50">
      <Header title={tr.myBookings} />

      <div className="px-5 py-5 pb-28">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16">
            <Loader className="w-10 h-10 text-kisan-500 animate-spin mb-3" />
            <p className="text-sm font-semibold text-gray-400">Loading...</p>
          </div>
        ) : bookings.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <BookMarked className="w-12 h-12 text-gray-300 mb-3" />
            <p className="text-sm font-semibold text-gray-400 mb-4">{tr.noBookingsYet}</p>
            <button
              onClick={() => go('booking')}
              className="px-6 py-3 rounded-xl bg-kisan-600 text-white font-bold active:scale-95 transition"
            >
              {tr.startBooking}
            </button>
          </div>
        ) : (
          <>
            {/* QR Storage note */}
            <div className="flex items-center gap-2 p-3 rounded-xl bg-kisan-50 border border-kisan-100 mb-4">
              <QrCode className="w-4 h-4 text-kisan-600 flex-shrink-0" />
              <p className="text-xs font-semibold text-kisan-700">{tr.qrStorage}</p>
            </div>

            {/* Booking cards */}
            <div className="space-y-3">
              {bookings.map((b) => (
                <div
                  key={b.dbId}
                  className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-10 rounded-xl bg-kisan-100 flex items-center justify-center">
                        <Calendar className="w-5 h-5 text-kisan-600" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-400 font-semibold">{tr.bookingId}</p>
                        <p className="text-sm font-bold text-gray-800">{b.token}</p>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${statusColor(b.status)}`}>
                      {statusLabel(b.status)}
                    </span>
                  </div>

                  <div className="space-y-2 mb-3">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <span className="font-semibold">{b.mandi}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span>{b.date} • {b.time}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <span className="text-gray-400">{tr.selectCrop}:</span>
                      <span className="font-semibold text-gray-700">{b.crop} • {b.quantity}</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => setQrModal(b)}
                      className="flex-1 py-2.5 rounded-xl bg-kisan-50 border border-kisan-200 text-kisan-700 font-bold text-sm active:scale-95 hover:bg-kisan-100 transition flex items-center justify-center gap-1.5"
                    >
                      <QrCode className="w-4 h-4" /> {tr.viewQr}
                    </button>
                    <button className="flex-1 py-2.5 rounded-xl bg-white border-2 border-gray-200 text-gray-600 font-bold text-sm active:scale-95 hover:border-kisan-300 transition flex items-center justify-center gap-1.5">
                      {tr.viewDetails} <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>

                  {b.status === 'confirmed' && (
                    <button
                      onClick={() => handleCancel(b.dbId)}
                      disabled={cancellingId === b.dbId}
                      className="w-full mt-2 py-2.5 rounded-xl bg-red-50 border border-red-200 text-red-600 font-bold text-sm active:scale-95 hover:bg-red-100 transition flex items-center justify-center gap-1.5 disabled:opacity-50"
                    >
                      {cancellingId === b.dbId ? (
                        <Loader className="w-4 h-4 animate-spin" />
                      ) : (
                        <X className="w-4 h-4" />
                      )}
                      {tr.cancelBooking}
                    </button>
                  )}
                  {(b.status === 'procured' || b.status === 'in-queue') && (
                    <p className="text-center text-xs text-gray-400 mt-2">{tr.cancelNotAllowed}</p>
                  )}
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* QR Modal */}
      {qrModal && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-6"
          onClick={() => setQrModal(null)}
        >
          <div
            className="bg-white rounded-3xl p-6 max-w-sm w-full animate-fade-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-800">{qrModal.token}</h3>
              <button
                onClick={() => setQrModal(null)}
                className="p-1.5 rounded-full hover:bg-gray-100 active:scale-90 transition"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            <div className="flex flex-col items-center mb-5">
              <div className="w-48 h-48 bg-gray-900 rounded-2xl flex items-center justify-center mb-3">
                <QrCode className="w-40 h-40 text-white" />
              </div>
              <p className="text-xs text-gray-400 font-semibold uppercase">{tr.tokenNo}</p>
              <p className="text-2xl font-extrabold text-kisan-700 tracking-wider">{qrModal.token}</p>
            </div>

            <div className="space-y-2 mb-5">
              <Row label={tr.selectCrop} value={qrModal.crop} />
              <Row label={tr.enterQty} value={qrModal.quantity} />
              <Row label={tr.chooseMandi} value={qrModal.mandi} />
              <Row label={tr.date} value={`${qrModal.date} • ${qrModal.time}`} />
            </div>

            <div className="space-y-2">
              <button className="w-full py-3 rounded-xl bg-kisan-600 text-white font-bold text-sm active:scale-95 hover:bg-kisan-700 transition flex items-center justify-center gap-2">
                <Download className="w-4 h-4" /> {tr.downloadQr}
              </button>
              <button className="w-full py-3 rounded-xl bg-white border-2 border-gray-200 text-gray-600 font-bold text-sm active:scale-95 hover:border-kisan-300 transition flex items-center justify-center gap-2">
                <Share2 className="w-4 h-4" /> {tr.shareQrSms}
              </button>
            </div>
          </div>
        </div>
      )}

      <BottomNav current="bookings" />
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-gray-400">{label}</span>
      <span className="text-sm font-bold text-gray-800">{value}</span>
    </div>
  );
}
