import { useApp } from '@/context/AppContext';
import { Save, ArrowRight, Droplet } from 'lucide-react';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import type { Booking, Farmer, Mandi } from '@/lib/types';
import { ScreenContainer, LoadingSpinner } from '@/components/ui';
import { Header } from '@/components/common';

const MSP_RATES: Record<string, number> = {
  Wheat: 2275,
  Rice: 2620,
  Maize: 1962,
  Cotton: 5825,
};

export function ProcurementEntryScreen() {
  const { selectedBookingId, navigate, setSelectedProcurementId, officer, t } = useApp();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [farmer, setFarmer] = useState<Farmer | null>(null);
  const [mandi, setMandi] = useState<Mandi | null>(null);
  const [actualQty, setActualQty] = useState('');
  const [moisture, setMoisture] = useState('');
  const [grade, setGrade] = useState('A');
  const [storage, setStorage] = useState('');
  const [remarks, setRemarks] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!selectedBookingId) return;
    (async () => {
      const { data: b } = await supabase
        .from('bookings')
        .select('*')
        .eq('id', selectedBookingId)
        .maybeSingle();
      if (b) {
        setBooking(b as Booking);
        const { data: f } = await supabase.from('farmers').select('*').eq('id', (b as Booking).farmer_id).maybeSingle();
        if (f) setFarmer(f as Farmer);
        const { data: m } = await supabase.from('mandis').select('*').eq('id', (b as Booking).mandi_id).maybeSingle();
        if (m) setMandi(m as Mandi);
      }
    })();
  }, [selectedBookingId]);

  if (!booking || !farmer) return <LoadingSpinner />;

  const handleSave = async () => {
    setSaving(true);
    const actual = Number(actualQty) || 0;
    const moistureNum = Number(moisture) || 0;
    const accepted = moistureNum > 12 ? Math.round(actual * 0.95 * 10) / 10 : actual;
    const mspRate = MSP_RATES[booking.crop_type] || 2000;
    const amount = Math.round(accepted * mspRate);
    const procurementId = `PROC-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    const { data: proc } = await supabase
      .from('procurements')
      .insert({
        procurement_id: procurementId,
        booking_id: booking.id,
        farmer_id: booking.farmer_id,
        mandi_id: booking.mandi_id,
        crop_type: booking.crop_type,
        actual_quantity_qtl: actual,
        accepted_quantity_qtl: accepted,
        moisture_level_pct: moistureNum,
        quality_grade: grade,
        storage_location: storage || 'Storage A',
        remarks: remarks || null,
        msp_rate: mspRate,
        amount,
        status: 'pending',
        inspected_by: officer?.name || 'Officer',
        inspected_at: new Date().toISOString(),
      })
      .select('*')
      .maybeSingle();

    if (proc) {
      setSelectedProcurementId(proc.id);
      navigate('procurementApproval');
    }
    setSaving(false);
  };

  return (
    <ScreenContainer>
      <Header title={t('procurementEntryTitle')} />
      <div className="px-4 py-4 pb-10 space-y-4">
        <p className="text-sm text-slate-500">{t('procurementEntrySubtitle')}</p>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-slate-900">{farmer.name}</p>
              <p className="text-sm text-slate-500">Token #{booking.token_number} • {booking.booking_id}</p>
            </div>
            <span className="badge-blue">{booking.crop_type}</span>
          </div>
        </div>

        <div className="card space-y-4">
          <div>
            <label className="label-text">{t('cropType')}</label>
            <input value={booking.crop_type} disabled className="input-field bg-slate-50" />
          </div>
          <div>
            <label className="label-text">{t('actualQuantity')}</label>
            <input
              type="number"
              value={actualQty}
              onChange={(e) => setActualQty(e.target.value)}
              className="input-field"
              placeholder="0"
            />
          </div>
          <div>
            <label className="label-text">{t('moistureLevel')}</label>
            <div className="relative">
              <Droplet className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="number"
                value={moisture}
                onChange={(e) => setMoisture(e.target.value)}
                className="input-field pr-12"
                placeholder="0"
              />
            </div>
            {moisture && Number(moisture) > 12 && (
              <p className="text-xs text-kisan-orange-600 mt-1">High moisture — 5% quantity deduction applied</p>
            )}
          </div>
          <div>
            <label className="label-text">{t('qualityGrade')}</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { value: 'A', label: t('gradeA') },
                { value: 'B', label: t('gradeB') },
                { value: 'C', label: t('gradeC') },
              ].map((g) => (
                <button
                  key={g.value}
                  onClick={() => setGrade(g.value)}
                  className={`p-3 rounded-xl border-2 text-xs font-semibold transition-all ${
                    grade === g.value
                      ? g.value === 'A' ? 'border-kisan-green-500 bg-kisan-green-50 text-kisan-green-700'
                        : g.value === 'B' ? 'border-kisan-orange-400 bg-kisan-orange-50 text-kisan-orange-700'
                        : 'border-red-400 bg-red-50 text-red-700'
                      : 'border-slate-200 text-slate-600'
                  }`}
                >
                  {g.label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="label-text">{t('storageLocation')}</label>
            <input
              type="text"
              value={storage}
              onChange={(e) => setStorage(e.target.value)}
              className="input-field"
              placeholder={t('enterStorage')}
            />
          </div>
          <div>
            <label className="label-text">{t('remarks')}</label>
            <textarea
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              className="input-field min-h-[80px] resize-none"
              placeholder={t('enterRemarks')}
            />
          </div>
        </div>

        <button onClick={handleSave} className="btn-primary w-full" disabled={saving || !actualQty}>
          {saving ? t('loading') : t('saveInspection')}
          {!saving && <Save className="w-5 h-5" />}
        </button>
      </div>
    </ScreenContainer>
  );
}
