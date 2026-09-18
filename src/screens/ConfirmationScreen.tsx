import { CheckCircle, QrCode, Clock, MessageSquare, Home, Download, BookOpen } from 'lucide-react';
import { useApp } from '../App';
import Header from '../components/Header';

export default function ConfirmationScreen() {
  const { tr, go, booking } = useApp();

  if (!booking) {
    return (
      <div className="min-h-full bg-gray-50">
        <Header title={tr.confirmBooking} />
        <div className="flex flex-col items-center justify-center h-96 px-6">
          <p className="text-gray-400 mb-4">No booking found</p>
          <button onClick={() => go('booking')} className="px-6 py-3 rounded-xl bg-kisan-600 text-white font-bold">
            {tr.bookSlot}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-full bg-gray-50">
      <Header title={tr.confirmBooking} showBack={false} />

      <div className="flex flex-col items-center px-5 py-6">
        {/* Success icon */}
        <div className="w-20 h-20 rounded-full bg-kisan-100 flex items-center justify-center mb-4 animate-fade-in">
          <CheckCircle className="w-12 h-12 text-kisan-600" />
        </div>
        <h2 className="text-xl font-bold text-gray-800 mb-1">Booking Confirmed!</h2>
        <p className="text-sm text-gray-400 mb-6">बुकिंग सफल • ਬੁਕਿੰਗ ਸਫਲ</p>

        {/* QR card */}
        <div className="w-full bg-white rounded-3xl p-6 shadow-md border border-gray-100 mb-5">
          <div className="flex flex-col items-center mb-5">
            <div className="w-40 h-40 bg-gray-900 rounded-2xl flex items-center justify-center mb-3">
              <QrCode className="w-32 h-32 text-white" />
            </div>
            <p className="text-xs text-gray-400 font-semibold uppercase">{tr.tokenNo}</p>
            <p className="text-3xl font-extrabold text-kisan-700 tracking-wider">{booking.token}</p>
          </div>

          <div className="space-y-3 border-t border-gray-100 pt-4">
            <Row label={tr.selectCrop} value={booking.crop} />
            <Row label={tr.enterQty} value={booking.quantity} />
            <Row label={tr.chooseMandi} value={booking.mandi} />
            <Row label={tr.date} value={`${booking.date} • ${booking.time}`} />
          </div>
        </div>

        {/* Expected wait */}
        <div className="w-full flex items-center gap-4 p-4 rounded-2xl bg-saffron-50 border border-saffron-200 mb-5">
          <div className="w-12 h-12 rounded-xl bg-saffron-100 flex items-center justify-center">
            <Clock className="w-6 h-6 text-saffron-600" />
          </div>
          <div>
            <p className="text-xs text-saffron-700 font-semibold uppercase">{tr.expWait}</p>
            <p className="text-lg font-bold text-saffron-800">Approx. 45 minutes</p>
          </div>
        </div>

        {/* SMS status */}
        <div className="w-full flex items-center gap-4 p-4 rounded-2xl bg-kisan-50 border border-kisan-200 mb-6">
          <div className="w-12 h-12 rounded-xl bg-kisan-100 flex items-center justify-center">
            <MessageSquare className="w-6 h-6 text-kisan-600" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-bold text-kisan-700">{tr.smsSent}</p>
            <p className="text-xs text-kisan-600">SMS sent to +91 98765 43210</p>
          </div>
          <CheckCircle className="w-6 h-6 text-kisan-600" />
        </div>

        <div className="w-full space-y-3">
          <button
            onClick={() => go('queue')}
            className="w-full py-4 rounded-2xl bg-kisan-600 text-white text-lg font-bold shadow-lg active:scale-[0.98] hover:bg-kisan-700 transition"
          >
            {tr.queueStatus}
          </button>
          <button
            onClick={() => {}}
            className="w-full py-4 rounded-2xl bg-saffron-500 text-white text-lg font-bold shadow-lg active:scale-[0.98] hover:bg-saffron-600 transition flex items-center justify-center gap-2"
          >
            <Download className="w-5 h-5" /> {tr.downloadQr}
          </button>
          <button
            onClick={() => go('bookings')}
            className="w-full py-4 rounded-2xl bg-white border-2 border-gray-200 text-gray-600 text-lg font-bold active:scale-[0.98] hover:border-kisan-300 transition flex items-center justify-center gap-2"
          >
            <BookOpen className="w-5 h-5" /> {tr.viewBooking}
          </button>
          <button
            onClick={() => go('home')}
            className="w-full py-4 rounded-2xl bg-white border-2 border-gray-200 text-gray-600 text-lg font-bold active:scale-[0.98] hover:border-kisan-300 transition flex items-center justify-center gap-2"
          >
            <Home className="w-5 h-5" /> Home
          </button>
        </div>
      </div>
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
