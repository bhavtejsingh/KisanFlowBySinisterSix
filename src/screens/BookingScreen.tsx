import { useState } from 'react';
import {
  Wheat,
  Cloud,
  CircleDot,
  Flower,
  Sprout,
  MapPin,
  CalendarDays,
  Clock,
  Sparkles,
  Check,
  Leaf,
} from 'lucide-react';
import { useApp } from '../App';
import Header from '../components/Header';
import { crops, mandis, slots, aiRecommendedSlot } from '../data';
import { supabase } from '../lib/supabase';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Wheat,
  Leaf,
  Cloud,
  CircleDot,
  Flower,
  Sprout,
};

export default function BookingScreen() {
  const { tr, go, setBooking, lang } = useApp();
  const [step, setStep] = useState(0);
  const [crop, setCrop] = useState('');
  const [qty, setQty] = useState('');
  const [mandi, setMandi] = useState('');
  const [date, setDate] = useState('');
  const [slot, setSlot] = useState('');

  const dates = ['Today', 'Tomorrow', 'Sep 20', 'Sep 21', 'Sep 22'];

  const handleConfirm = async () => {
    const token = 'KN' + Math.floor(1000 + Math.random() * 9000);
    const bookingData = {
      token,
      crop,
      quantity: qty + ' kg',
      mandi,
      date: date || 'Sep 19',
      time: slot,
      status: 'confirmed',
    };
    setBooking({
      id: token,
      ...bookingData,
    });
    try {
      await supabase.from('bookings').insert(bookingData);
    } catch {
      // booking saved locally even if DB fails
    }
    go('confirmation');
  };

  return (
    <div className="min-h-full bg-gray-50">
      <Header title={tr.bookSlot} />

      <div className="px-5 py-5 pb-24">
        {/* Step 0: Crop */}
        {step === 0 && (
          <div className="animate-fade-in">
            <p className="text-sm font-bold text-gray-500 mb-3">{tr.selectCrop}</p>
            <div className="grid grid-cols-3 gap-3">
              {crops.map((c) => {
                const Icon = iconMap[c.icon] || Wheat;
                return (
                  <button
                    key={c.name}
                    onClick={() => {
                      setCrop(lang === 'hi' ? c.hi : lang === 'pa' ? c.pa : c.name);
                      setStep(1);
                    }}
                    className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition active:scale-95 ${
                      crop === c.name ? 'border-kisan-600 bg-kisan-50' : 'border-gray-200 bg-white'
                    }`}
                  >
                    <div className="w-12 h-12 rounded-xl bg-kisan-100 flex items-center justify-center">
                      <Icon className="w-6 h-6 text-kisan-600" />
                    </div>
                    <span className="text-sm font-bold text-gray-700">
                      {lang === 'hi' ? c.hi : lang === 'pa' ? c.pa : c.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 1: Quantity */}
        {step === 1 && (
          <div className="animate-fade-in">
            <p className="text-sm font-bold text-gray-500 mb-3">{tr.enterQty}</p>
            <input
              type="tel"
              value={qty}
              onChange={(e) => setQty(e.target.value.replace(/\D/g, ''))}
              placeholder="500"
              className="w-full px-4 py-5 rounded-2xl border-2 border-gray-200 text-2xl font-bold text-center focus:border-kisan-600 focus:outline-none mb-4"
            />
            <div className="grid grid-cols-4 gap-2 mb-6">
              {[100, 250, 500, 1000].map((q) => (
                <button
                  key={q}
                  onClick={() => setQty(String(q))}
                  className={`py-3 rounded-xl text-sm font-bold transition ${
                    qty === String(q) ? 'bg-kisan-600 text-white' : 'bg-white border-2 border-gray-200 text-gray-600'
                  }`}
                >
                  {q}kg
                </button>
              ))}
            </div>
            <button
              onClick={() => setStep(2)}
              disabled={!qty}
              className="w-full py-4 rounded-2xl bg-saffron-500 text-white text-lg font-bold shadow-lg active:scale-[0.98] disabled:opacity-40 hover:bg-saffron-600 transition"
            >
              {tr.continue}
            </button>
          </div>
        )}

        {/* Step 2: Mandi */}
        {step === 2 && (
          <div className="animate-fade-in">
            <p className="text-sm font-bold text-gray-500 mb-3">{tr.chooseMandi}</p>
            <div className="space-y-3">
              {mandis.map((m) => (
                <button
                  key={m.name}
                  onClick={() => {
                    setMandi(m.name);
                    setStep(3);
                  }}
                  className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition active:scale-[0.98] ${
                    mandi === m.name ? 'border-kisan-600 bg-kisan-50' : 'border-gray-200 bg-white'
                  }`}
                >
                  <div className="w-12 h-12 rounded-xl bg-teal-100 flex items-center justify-center">
                    <MapPin className="w-6 h-6 text-teal-600" />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="text-base font-bold text-gray-800">{m.name}</p>
                    <p className="text-sm text-gray-400">{m.distance} • Wait: {m.wait}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 3: Date */}
        {step === 3 && (
          <div className="animate-fade-in">
            <p className="text-sm font-bold text-gray-500 mb-3">{tr.selectDate}</p>
            <div className="flex gap-2 overflow-x-auto pb-2 mb-6">
              {dates.map((d) => (
                <button
                  key={d}
                  onClick={() => {
                    setDate(d);
                    setStep(4);
                  }}
                  className={`flex-shrink-0 flex flex-col items-center gap-1 px-5 py-4 rounded-2xl border-2 transition ${
                    date === d ? 'border-kisan-600 bg-kisan-50' : 'border-gray-200 bg-white'
                  }`}
                >
                  <CalendarDays className="w-5 h-5 text-kisan-600" />
                  <span className="text-sm font-bold text-gray-700 whitespace-nowrap">{d}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 4: Slot */}
        {step === 4 && (
          <div className="animate-fade-in">
            <p className="text-sm font-bold text-gray-500 mb-3">{tr.chooseSlot}</p>
            <div className="space-y-3">
              {slots.map((s) => {
                const isAI = s.time === aiRecommendedSlot;
                return (
                  <button
                    key={s.time}
                    disabled={!s.available}
                    onClick={() => setSlot(s.time)}
                    className={`w-full flex items-center gap-3 p-4 rounded-2xl border-2 transition active:scale-[0.98] ${
                      !s.available
                        ? 'border-gray-100 bg-gray-50 opacity-50'
                        : slot === s.time
                        ? 'border-kisan-600 bg-kisan-50'
                        : isAI
                        ? 'border-saffron-400 bg-saffron-50'
                        : 'border-gray-200 bg-white'
                    }`}
                  >
                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${
                      isAI ? 'bg-saffron-100' : 'bg-gray-100'
                    }`}>
                      <Clock className={`w-6 h-6 ${isAI ? 'text-saffron-600' : 'text-gray-500'}`} />
                    </div>
                    <div className="flex-1 text-left">
                      <p className="text-base font-bold text-gray-800">{s.time}</p>
                      <p className="text-xs text-gray-400">
                        {s.available ? `${s.capacity} capacity` : 'Full'}
                      </p>
                    </div>
                    {isAI && (
                      <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-saffron-500 text-white text-xs font-bold">
                        <Sparkles className="w-3 h-3" /> {tr.aiRecommended}
                      </span>
                    )}
                    {slot === s.time && (
                      <div className="w-7 h-7 rounded-full bg-kisan-600 flex items-center justify-center">
                        <Check className="w-4 h-4 text-white" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            {slot && (
              <button
                onClick={handleConfirm}
                className="w-full mt-6 py-4 rounded-2xl bg-kisan-600 text-white text-lg font-bold shadow-lg active:scale-[0.98] hover:bg-kisan-700 transition flex items-center justify-center gap-2"
              >
                {tr.confirmBooking}
              </button>
            )}
          </div>
        )}

        {/* Step indicator */}
        <div className="flex items-center justify-center gap-1.5 mt-8">
          {[0, 1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all ${
                i === step ? 'w-8 bg-kisan-600' : i < step ? 'w-1.5 bg-kisan-400' : 'w-1.5 bg-gray-300'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
