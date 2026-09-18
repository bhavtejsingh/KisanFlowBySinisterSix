import { Users, Mic, Clock, RefreshCw } from 'lucide-react';
import { useApp } from '../App';
import Header from '../components/Header';

export default function QueueScreen() {
  const { tr, go, booking } = useApp();

  const currentToken = 42;
  const myToken = booking ? parseInt(booking.token.replace(/\D/g, '')) || 49 : 49;
  const peopleAhead = myToken - currentToken;
  const progress = Math.round((currentToken / myToken) * 100);

  return (
    <div className="min-h-full bg-gray-50">
      <Header title={tr.queueStatus} />

      <div className="px-5 py-5 pb-24">
        {/* Mandi info */}
        <div className="flex items-center gap-3 p-4 rounded-2xl bg-white shadow-sm border border-gray-100 mb-5">
          <div className="w-12 h-12 rounded-xl bg-teal-100 flex items-center justify-center">
            <Users className="w-6 h-6 text-teal-600" />
          </div>
          <div>
            <p className="text-base font-bold text-gray-800">{booking?.mandi || 'Khanna Mandi'}</p>
            <p className="text-sm text-gray-400">Live queue • Updated 1 min ago</p>
          </div>
          <RefreshCw className="w-5 h-5 text-gray-300 ml-auto" />
        </div>

        {/* Token comparison */}
        <div className="grid grid-cols-2 gap-3 mb-5">
          <div className="p-5 rounded-2xl bg-kisan-600 text-white text-center shadow-md">
            <p className="text-xs text-kisan-100 font-semibold uppercase mb-1">{tr.currentToken}</p>
            <p className="text-4xl font-extrabold">{currentToken}</p>
          </div>
          <div className="p-5 rounded-2xl bg-white border-2 border-kisan-200 text-center shadow-sm">
            <p className="text-xs text-gray-400 font-semibold uppercase mb-1">{tr.myToken}</p>
            <p className="text-4xl font-extrabold text-kisan-700">{myToken}</p>
          </div>
        </div>

        {/* People ahead */}
        <div className="flex items-center justify-between p-4 rounded-2xl bg-saffron-50 border border-saffron-200 mb-5">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-saffron-100 flex items-center justify-center">
              <Users className="w-6 h-6 text-saffron-600" />
            </div>
            <div>
              <p className="text-sm text-saffron-700 font-semibold">{tr.peopleAhead}</p>
              <p className="text-2xl font-extrabold text-saffron-800">{peopleAhead}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs text-saffron-700 font-semibold">{tr.estWait}</p>
            <p className="text-xl font-bold text-saffron-800">~{peopleAhead * 6} min</p>
          </div>
        </div>

        {/* Progress bar */}
        <div className="p-5 rounded-2xl bg-white shadow-sm border border-gray-100 mb-5">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-bold text-gray-600">Queue Progress</p>
            <p className="text-sm font-bold text-kisan-600">{progress}%</p>
          </div>
          <div className="h-4 rounded-full bg-gray-100 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-kisan-400 to-kisan-600 transition-all duration-700"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex items-center justify-between mt-3 text-xs text-gray-400">
            <span>Token {currentToken}</span>
            <span>Token {myToken}</span>
          </div>
        </div>

        {/* Estimated time card */}
        <div className="flex items-center gap-4 p-5 rounded-2xl bg-blue-50 border border-blue-100 mb-6">
          <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
            <Clock className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <p className="text-xs text-blue-600 font-semibold uppercase">{tr.estWait}</p>
            <p className="text-xl font-bold text-blue-700">Approx. {peopleAhead * 6} minutes</p>
          </div>
        </div>

        {/* Voice update */}
        <button
          onClick={() => go('voice')}
          className="w-full flex items-center justify-center gap-3 p-4 rounded-2xl bg-kisan-50 border-2 border-kisan-200 text-kisan-700 font-bold active:scale-[0.98] hover:bg-kisan-100 transition"
        >
          <Mic className="w-5 h-5" />
          {tr.voiceUpdate}
        </button>
      </div>
    </div>
  );
}
