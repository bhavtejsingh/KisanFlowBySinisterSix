import { useState } from 'react';
import { MapPin, Search, Users, Clock, ChevronRight, Loader } from 'lucide-react';
import { useApp } from '../App';
import Header from '../components/Header';
import BottomNav from '../components/BottomNav';
import { mandiResults } from '../data';
import type { MandiResult } from '../data';

export default function FindMandiScreen() {
  const { tr, go } = useApp();
  const [pincode, setPincode] = useState('');
  const [searching, setSearching] = useState(false);
  const [results, setResults] = useState<MandiResult[] | null>(null);
  const [searched, setSearched] = useState(false);

  const handleSearch = () => {
    setSearching(true);
    setSearched(true);
    setTimeout(() => {
      setSearching(false);
      setResults(mandiResults);
    }, 1500);
  };

  return (
    <div className="min-h-full bg-gray-50">
      <Header title={tr.findMandis} />

      <div className="px-5 py-5 pb-28">
        {/* Pincode input */}
        <div className="mb-5">
          <label className="text-sm font-semibold text-gray-600 mb-2 block">{tr.enterPincode}</label>
          <div className="flex gap-2">
            <div className="flex-1 flex items-center gap-2 px-4 rounded-2xl border-2 border-gray-200 bg-white focus-within:border-kisan-600 transition">
              <MapPin className="w-5 h-5 text-gray-400" />
              <input
                type="tel"
                maxLength={6}
                value={pincode}
                onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))}
                placeholder={tr.pincodePlaceholder}
                className="flex-1 py-4 text-lg font-semibold focus:outline-none"
              />
            </div>
            <button
              onClick={handleSearch}
              disabled={pincode.length < 6 || searching}
              className="px-5 rounded-2xl bg-kisan-600 text-white font-bold shadow-lg active:scale-95 disabled:opacity-40 hover:bg-kisan-700 transition flex items-center gap-2"
            >
              {searching ? <Loader className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Searching state */}
        {searching && (
          <div className="flex flex-col items-center justify-center py-16">
            <Loader className="w-10 h-10 text-kisan-500 animate-spin mb-3" />
            <p className="text-sm font-semibold text-gray-400">{tr.searchMandis}...</p>
          </div>
        )}

        {/* Results */}
        {!searching && results && results.length > 0 && (
          <div className="animate-fade-in">
            <p className="text-sm font-bold text-gray-500 uppercase mb-3">{tr.nearbyCentres}</p>
            <div className="space-y-3">
              {results.map((m) => (
                <div
                  key={m.name}
                  className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100"
                >
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-12 h-12 rounded-xl bg-teal-100 flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-6 h-6 text-teal-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-base font-bold text-gray-800">{m.name}</p>
                      <p className="text-sm text-gray-400">{m.distance} • {m.waitTime}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="flex items-center gap-2 p-3 rounded-xl bg-gray-50">
                      <Users className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-xs text-gray-400 font-semibold">{tr.currentQueue}</p>
                        <p className="text-sm font-bold text-gray-700">{m.queueLength} {tr.peopleAhead}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 p-3 rounded-xl bg-gray-50">
                      <Clock className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-xs text-gray-400 font-semibold">{tr.availableSlotsToday}</p>
                        <p className="text-sm font-bold text-kisan-600">{m.availableSlots} {tr.chooseSlot}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button className="flex-1 py-3 rounded-xl bg-white border-2 border-gray-200 text-gray-600 font-bold text-sm active:scale-95 hover:border-kisan-300 transition flex items-center justify-center gap-1">
                      {tr.viewDetails} <ChevronRight className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => go('booking')}
                      className="flex-1 py-3 rounded-xl bg-kisan-600 text-white font-bold text-sm shadow-md active:scale-95 hover:bg-kisan-700 transition"
                    >
                      {tr.bookSlotBtn}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* No results */}
        {!searching && searched && results && results.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16">
            <MapPin className="w-12 h-12 text-gray-300 mb-3" />
            <p className="text-sm font-semibold text-gray-400">{tr.noMandisFound}</p>
          </div>
        )}

        {/* Initial state */}
        {!searched && (
          <div className="flex flex-col items-center justify-center py-16">
            <MapPin className="w-12 h-12 text-gray-300 mb-3" />
            <p className="text-sm text-gray-400 text-center">{tr.enterPincode} {tr.searchMandis}</p>
          </div>
        )}
      </div>

      <BottomNav current="findmandi" />
    </div>
  );
}
