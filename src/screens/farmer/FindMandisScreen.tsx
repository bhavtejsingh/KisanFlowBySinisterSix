import { useApp } from '@/context/AppContext';
import { MapPin, Users, Calendar, Building2, Clock, Activity, ChevronRight, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import type { Mandi } from '@/lib/types';
import { ScreenContainer, LoadingSpinner, EmptyState } from '@/components/ui';
import { Header, BottomNav, FloatingMic } from '@/components/common';
import { SearchableDropdown } from '@/components/SearchableDropdown';
import { PUNJAB_DISTRICTS, PUNJAB_MANDIS } from '@/lib/punjabData';

export function FindMandisScreen() {
  const { navigate, setSelectedMandiId, t } = useApp();
  const [state, setState] = useState('Punjab');
  const [district, setDistrict] = useState('');
  const [mandis, setMandis] = useState<Mandi[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [detailMandi, setDetailMandi] = useState<Mandi | null>(null);

  const handleSearch = async () => {
    if (!district) return;
    setLoading(true);
    setSearched(true);

    const mandiInfo = PUNJAB_MANDIS[district];
    if (!mandiInfo) {
      setMandis([]);
      setLoading(false);
      return;
    }

    const { data } = await supabase
      .from('mandis')
      .select('*')
      .eq('district', district)
      .order('current_queue_length', { ascending: true });

    setMandis((data as Mandi[]) || []);
    setLoading(false);
  };

  useEffect(() => {
    if (district) {
      handleSearch();
    } else {
      setMandis([]);
      setSearched(false);
    }
  }, [district]);

  const getMandiStatus = (m: Mandi) => {
    if (m.available_slots > 30) return { label: 'Open', className: 'badge-green' };
    if (m.available_slots > 10) return { label: 'Busy', className: 'badge-orange' };
    return { label: 'Full', className: 'badge-red' };
  };

  const getMockDistance = (m: Mandi) => {
    const seed = m.name.length + m.district.length;
    return ((seed % 12) + 2 + (seed % 7) / 10).toFixed(1);
  };

  return (
    <ScreenContainer>
      <Header title={t('findMandisTitle')} />
      <div className="px-4 py-4 pb-28">
        <div className="card space-y-3 mb-5">
          <div>
            <label className="label-text">{t('state')}</label>
            <div className="input-field flex items-center gap-2 bg-slate-50 cursor-not-allowed">
              <MapPin className="w-4 h-4 text-slate-400" />
              <span className="font-medium text-slate-700">{state}</span>
            </div>
          </div>
          <div>
            <label className="label-text">{t('district')}</label>
            <SearchableDropdown
              options={[...PUNJAB_DISTRICTS]}
              value={district}
              onChange={setDistrict}
              placeholder={t('enterDistrict')}
              searchPlaceholder="Search district..."
            />
          </div>
        </div>

        {loading ? (
          <LoadingSpinner />
        ) : searched && mandis.length === 0 ? (
          <EmptyState icon={MapPin} title={t('noMandis')} description="" />
        ) : mandis.length > 0 ? (
          <>
            <div className="flex items-center gap-2 mb-3">
              <Building2 className="w-4 h-4 text-kisan-green-600" />
              <h3 className="section-title">{t('nearbyMandis')}</h3>
              <span className="badge-gray">{mandis.length}</span>
            </div>
            <div className="space-y-3">
              {mandis.map((mandi, i) => {
                const status = getMandiStatus(mandi);
                const distance = getMockDistance(mandi);
                return (
                  <div
                    key={mandi.id}
                    className="card animate-slide-up"
                    style={{ animationDelay: `${i * 0.05}s` }}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-bold text-slate-900">{mandi.name}</h4>
                        <p className="text-sm text-slate-500 flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {mandi.district}, {mandi.state}
                        </p>
                      </div>
                      <span className={status.className}>{status.label}</span>
                    </div>

                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div className="flex items-center gap-2 text-sm">
                        <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                          <MapPin className="w-4 h-4 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-xs text-slate-400">{t('distance')}</p>
                          <p className="font-semibold text-slate-700">{distance} km</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <div className="w-8 h-8 rounded-lg bg-kisan-orange-50 flex items-center justify-center">
                          <Users className="w-4 h-4 text-kisan-orange-600" />
                        </div>
                        <div>
                          <p className="text-xs text-slate-400">{t('queueLength')}</p>
                          <p className="font-semibold text-slate-700">{mandi.current_queue_length} {t('peopleInQueue')}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <div className="w-8 h-8 rounded-lg bg-kisan-green-50 flex items-center justify-center">
                          <Calendar className="w-4 h-4 text-kisan-green-600" />
                        </div>
                        <div>
                          <p className="text-xs text-slate-400">{t('availableSlots')}</p>
                          <p className="font-semibold text-slate-700">{mandi.available_slots}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center">
                          <Activity className="w-4 h-4 text-slate-600" />
                        </div>
                        <div>
                          <p className="text-xs text-slate-400">{t('centreCapacity')}</p>
                          <p className="font-semibold text-slate-700">{mandi.capacity_per_day}/day</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => setDetailMandi(mandi)}
                        className="btn-ghost flex-1 border border-slate-200"
                      >
                        {t('viewDetails')}
                      </button>
                      <button
                        onClick={() => {
                          setSelectedMandiId(mandi.id);
                          navigate('slotBooking');
                        }}
                        className="btn-primary flex-1 py-2.5 text-sm"
                        disabled={mandi.available_slots === 0}
                      >
                        <Calendar className="w-4 h-4" />
                        {t('bookSlotBtn')}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-16 h-16 rounded-full bg-kisan-green-50 flex items-center justify-center mb-3">
              <MapPin className="w-8 h-8 text-kisan-green-300" />
            </div>
            <p className="text-slate-400 font-medium">Select a district to find mandis</p>
          </div>
        )}
      </div>

      {detailMandi && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4" onClick={() => setDetailMandi(null)}>
          <div className="bg-white rounded-t-2xl sm:rounded-2xl w-full max-w-md max-h-[85vh] overflow-y-auto animate-slide-up" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 bg-white p-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-bold text-slate-900">{t('viewDetails')}</h3>
              <button onClick={() => setDetailMandi(null)} className="p-1 rounded-lg hover:bg-slate-100">
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>
            <div className="p-4 space-y-4">
              <div>
                <h4 className="text-xl font-bold text-slate-900">{detailMandi.name}</h4>
                <p className="text-sm text-slate-500 flex items-center gap-1 mt-1">
                  <MapPin className="w-4 h-4" />
                  {detailMandi.address}, {detailMandi.district}, {detailMandi.state}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl bg-kisan-orange-50 p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <Users className="w-4 h-4 text-kisan-orange-600" />
                    <span className="text-xs text-slate-500">{t('queueLength')}</span>
                  </div>
                  <p className="text-lg font-bold text-slate-900">{detailMandi.current_queue_length}</p>
                </div>
                <div className="rounded-xl bg-kisan-green-50 p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <Calendar className="w-4 h-4 text-kisan-green-600" />
                    <span className="text-xs text-slate-500">{t('availableSlots')}</span>
                  </div>
                  <p className="text-lg font-bold text-slate-900">{detailMandi.available_slots}</p>
                </div>
                <div className="rounded-xl bg-blue-50 p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <Activity className="w-4 h-4 text-blue-600" />
                    <span className="text-xs text-slate-500">{t('centreCapacity')}</span>
                  </div>
                  <p className="text-lg font-bold text-slate-900">{detailMandi.capacity_per_day}/day</p>
                </div>
                <div className="rounded-xl bg-slate-100 p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <Clock className="w-4 h-4 text-slate-600" />
                    <span className="text-xs text-slate-500">{t('distance')}</span>
                  </div>
                  <p className="text-lg font-bold text-slate-900">{getMockDistance(detailMandi)} km</p>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50">
                <span className="text-sm text-slate-500">Status</span>
                <span className={getMandiStatus(detailMandi).className}>{getMandiStatus(detailMandi).label}</span>
              </div>

              <button
                onClick={() => {
                  setSelectedMandiId(detailMandi.id);
                  setDetailMandi(null);
                  navigate('slotBooking');
                }}
                className="btn-primary w-full"
                disabled={detailMandi.available_slots === 0}
              >
                <Calendar className="w-5 h-5" />
                {t('bookSlotBtn')}
                <ChevronRight className="w-5 h-5" />
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
