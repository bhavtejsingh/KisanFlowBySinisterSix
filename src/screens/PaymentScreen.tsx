import { Wallet, Building2, CheckCircle, Clock, Loader, Phone, MessageSquare } from 'lucide-react';
import { useApp } from '../App';
import Header from '../components/Header';

const timeline = [
  { icon: CheckCircle, label: 'Procurement Verified', time: 'Sep 18, 9:30 AM', status: 'done' },
  { icon: CheckCircle, label: 'Quality Check Passed', time: 'Sep 18, 10:15 AM', status: 'done' },
  { icon: Loader, label: 'Payment Processing', time: 'In progress', status: 'active' },
  { icon: Clock, label: 'Bank Transfer', time: 'Pending', status: 'pending' },
];

export default function PaymentScreen() {
  const { tr, booking } = useApp();

  return (
    <div className="min-h-full bg-gray-50">
      <Header title={tr.paymentStatus} />

      <div className="px-5 py-5 pb-24">
        {/* Amount card */}
        <div className="rounded-3xl bg-gradient-to-br from-kisan-600 to-kisan-700 p-6 text-white shadow-lg mb-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-white/15 flex items-center justify-center">
              <Wallet className="w-6 h-6 text-white" />
            </div>
            <p className="text-sm text-kisan-100 font-semibold uppercase">{tr.amountPayable}</p>
          </div>
          <p className="text-4xl font-extrabold mb-1">₹12,450</p>
          <p className="text-sm text-kisan-100">{booking ? `${booking.crop} • ${booking.quantity}` : 'Wheat • 500 kg'}</p>
          <div className="mt-4 flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-saffron-400 text-white text-xs font-bold">
              Processing
            </span>
            <span className="px-3 py-1 rounded-full bg-white/15 text-white text-xs font-semibold">
              MSP Rate: ₹2,490/qtl
            </span>
          </div>
        </div>

        {/* Procurement details */}
        <div className="p-4 rounded-2xl bg-white shadow-sm border border-gray-100 mb-5">
          <p className="text-sm font-bold text-gray-500 uppercase mb-3">{tr.procDetails}</p>
          <div className="space-y-2.5">
            <Row label="Crop" value={booking?.crop || 'Wheat'} />
            <Row label="Quantity" value={booking?.quantity || '500 kg'} />
            <Row label="Mandi" value={booking?.mandi || 'Khanna Mandi'} />
            <Row label="Date" value={booking?.date || 'Sep 19'} />
            <Row label="Grade" value="A (Fair Average Quality)" />
          </div>
        </div>

        {/* Payment timeline */}
        <div className="p-5 rounded-2xl bg-white shadow-sm border border-gray-100 mb-5">
          <p className="text-sm font-bold text-gray-500 uppercase mb-4">{tr.payTimeline}</p>
          <div className="space-y-1">
            {timeline.map((t, i) => (
              <div key={i} className="flex gap-3">
                {/* Line + icon */}
                <div className="flex flex-col items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      t.status === 'done'
                        ? 'bg-kisan-100'
                        : t.status === 'active'
                        ? 'bg-saffron-100'
                        : 'bg-gray-100'
                    }`}
                  >
                    <t.icon
                      className={`w-5 h-5 ${
                        t.status === 'done'
                          ? 'text-kisan-600'
                          : t.status === 'active'
                          ? 'text-saffron-600 animate-spin'
                          : 'text-gray-400'
                      }`}
                    />
                  </div>
                  {i < timeline.length - 1 && (
                    <div className={`w-0.5 h-8 ${t.status === 'done' ? 'bg-kisan-400' : 'bg-gray-200'}`} />
                  )}
                </div>
                {/* Text */}
                <div className="pt-1.5 pb-6">
                  <p
                    className={`text-sm font-bold ${
                      t.status === 'pending' ? 'text-gray-400' : 'text-gray-800'
                    }`}
                  >
                    {t.label}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">{t.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bank transfer status */}
        <div className="flex items-center gap-4 p-4 rounded-2xl bg-blue-50 border border-blue-100 mb-5">
          <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
            <Building2 className="w-6 h-6 text-blue-600" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-bold text-blue-700">{tr.bankTransfer}</p>
            <p className="text-xs text-blue-500">State Bank of India • ****4521</p>
          </div>
          <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-700 text-xs font-bold">
            Pending
          </span>
        </div>

        {/* SMS + IVR support */}
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center gap-2 p-3 rounded-2xl bg-white border border-gray-100 shadow-sm">
            <MessageSquare className="w-5 h-5 text-kisan-600" />
            <span className="text-sm font-semibold text-gray-600">SMS Alerts</span>
          </div>
          <div className="flex items-center gap-2 p-3 rounded-2xl bg-white border border-gray-100 shadow-sm">
            <Phone className="w-5 h-5 text-saffron-600" />
            <span className="text-sm font-semibold text-gray-600">IVR Support</span>
          </div>
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


