import {
  CalendarClock,
  Users,
  Wallet,
  MapPin,
  HelpCircle,
  BookMarked,
  Bell,
  ShieldCheck,
  Mic,
  History,
  Phone,
  ChevronRight,
  Globe,
} from 'lucide-react';
import { useApp } from '../App';
import OfflineIndicator from '../components/OfflineIndicator';
import BottomNav from '../components/BottomNav';

export default function HomeScreen() {
  const { tr, go, booking, lang, setLang } = useApp();

  const quickActions = [
    { icon: BookMarked, label: tr.bookSlot, color: 'bg-kisan-600', screen: 'booking' as const },
    { icon: MapPin, label: tr.findMandis, color: 'bg-teal-500', screen: 'findmandi' as const },
    { icon: Mic, label: tr.voiceAssistant, color: 'bg-saffron-500', screen: 'voice' as const },
    { icon: Wallet, label: tr.payments, color: 'bg-blue-500', screen: 'payment' as const },
    { icon: History, label: tr.bookingHistory, color: 'bg-purple-500', screen: 'bookings' as const },
    { icon: Phone, label: tr.helpCenter, color: 'bg-gray-600', screen: 'voice' as const },
  ];

  const cycleLang = () => {
    const order: typeof lang[] = ['en', 'hi', 'pa'];
    const idx = order.indexOf(lang);
    setLang(order[(idx + 1) % order.length]);
  };

  return (
    <div className="min-h-full bg-gray-50">
      {/* Profile Header */}
      <div className="bg-gradient-to-br from-kisan-600 to-kisan-700 px-5 pt-4 pb-6 rounded-b-3xl shadow-lg">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center text-2xl font-bold text-white border-2 border-white/30">
              RS
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Ramesh Singh</h1>
              <p className="text-xs text-kisan-100 font-semibold">{tr.farmerId} • {tr.verified}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={cycleLang}
              className="p-2 rounded-full bg-white/15 active:scale-90 transition"
              aria-label={tr.switchLang}
            >
              <Globe className="w-5 h-5 text-white" />
            </button>
            <button className="relative p-2 rounded-full bg-white/15 active:scale-90 transition">
              <Bell className="w-5 h-5 text-white" />
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-saffron-400" />
            </button>
          </div>
        </div>
        <div className="mt-3 flex items-center gap-2">
          <OfflineIndicator />
          <span className="px-3 py-1.5 rounded-full bg-kisan-800/40 text-kisan-100 text-xs font-semibold flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" /> {tr.verified}
          </span>
        </div>
      </div>

      <div className="px-5 -mt-2 space-y-4 pb-28">
        {/* Upcoming Booking Card */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-11 h-11 rounded-xl bg-kisan-100 flex items-center justify-center">
              <CalendarClock className="w-6 h-6 text-kisan-600" />
            </div>
            <div className="flex-1">
              <p className="text-xs text-gray-400 font-semibold uppercase">{tr.upcomingBooking}</p>
              <p className="text-base font-bold text-gray-800">
                {booking ? `${booking.crop} • ${booking.time}` : tr.noBookingsYet}
              </p>
            </div>
          </div>
          {booking && (
            <div className="flex items-center justify-between bg-kisan-50 rounded-xl p-3">
              <div>
                <p className="text-xs text-gray-500">{tr.tokenNo}</p>
                <p className="text-lg font-bold text-kisan-700">{booking.token}</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-gray-500">{tr.chooseMandi}</p>
                <p className="text-sm font-semibold text-gray-700">{booking.mandi}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500">{tr.date}</p>
                <p className="text-sm font-semibold text-gray-700">{booking.date}</p>
              </div>
            </div>
          )}
        </div>

        {/* Queue Status Card */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-blue-100 flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <div className="flex-1">
              <p className="text-xs text-gray-400 font-semibold uppercase">{tr.queueStatus}</p>
              <p className="text-base font-bold text-gray-800">
                {booking ? '7 ' + tr.peopleAhead : tr.noBookingsYet}
              </p>
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-bold ${booking ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-400'}`}>
              {booking ? '~45 min' : '—'}
            </span>
          </div>
        </div>

        {/* Payment Status Card */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-saffron-100 flex items-center justify-center">
              <Wallet className="w-6 h-6 text-saffron-600" />
            </div>
            <div className="flex-1">
              <p className="text-xs text-gray-400 font-semibold uppercase">{tr.paymentStatus}</p>
              <p className="text-base font-bold text-gray-800">
                {booking ? '₹12,450 ' + tr.amountPending : tr.noBookingsYet}
              </p>
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-bold ${booking ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-400'}`}>
              {booking ? tr.active : '—'}
            </span>
          </div>
        </div>

        {/* Quick Actions */}
        <div>
          <p className="text-sm font-bold text-gray-500 uppercase mb-3">{tr.quickActions}</p>
          <div className="grid grid-cols-3 gap-3">
            {quickActions.map((a) => (
              <button
                key={a.label}
                onClick={() => go(a.screen)}
                className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-white shadow-sm border border-gray-100 active:scale-95 hover:shadow-md transition"
              >
                <div className={`w-12 h-12 rounded-2xl ${a.color} flex items-center justify-center shadow-md`}>
                  <a.icon className="w-6 h-6 text-white" />
                </div>
                <span className="text-xs font-bold text-gray-700 text-center leading-tight">{a.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Help button */}
        <button
          onClick={() => go('voice')}
          className="w-full flex items-center justify-center gap-3 p-4 rounded-2xl bg-white border-2 border-dashed border-gray-300 text-gray-500 font-semibold active:scale-[0.98] hover:border-kisan-400 hover:text-kisan-600 transition"
        >
          <HelpCircle className="w-5 h-5" />
          {tr.help}
        </button>
      </div>

      <BottomNav current="home" />
    </div>
  );
}
