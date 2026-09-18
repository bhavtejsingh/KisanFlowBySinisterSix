import { useApp } from '@/context/AppContext';
import { Calendar, Sparkles, Clock, Check, Wheat } from 'lucide-react';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import type { Mandi } from '@/lib/types';
import { ScreenContainer, LoadingSpinner } from '@/components/ui';
import { Header, BottomNav, FloatingMic } from '@/components/common';

interface Slot {
  time: string;
  available: boolean;
  aiRecommended: boolean;
  waitMinutes: number;
}

export function SlotBookingScreen() {
  const { farmer, selectedMandiId, navigate, setLastBookingId, t } = useApp();
  const [mandi, setMandi] = useState<Mandi | null>(null);
  const [crop, setCrop] = useState(farmer?.crop_type || 'Wheat');
  const [quantity, setQuantity] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [booking, setBooking] = useState(false);

  useEffect(() => {
    if (!selectedMandiId) return;
    (async () => {
      const { data } = await supabase
        .from('mandis')
        .select('*')
        .eq('id', selectedMandiId)
        .maybeSingle();
      if (data) setMandi(data as Mandi);
    })();
  }, [selectedMandiId]);

  if (!farmer || !mandi) return <LoadingSpinner />;

  const slots: Slot[] = [
    { time: '08:00 - 09:00 AM', available: true, aiRecommended: false, waitMinutes: 45 },
    { time: '09:00 - 10:00 AM', available: true, aiRecommended: true, waitMinutes: 15 },
    { time: '10:00 - 11:00 AM', available: true, aiRecommended: false, waitMinutes: 30 },
    { time: '11:00 - 12:00 PM', available: false, aiRecommended: false, waitMinutes: 60 },
    { time: '12:00 - 01:00 PM', available: true, aiRecommended: false, waitMinutes: 50 },
    { time: '02:00 - 03:00 PM', available: true, aiRecommended: false, waitMinutes: 25 },
  ];

  const handleGenerateToken = async () => {
    if (!selectedSlot) return;
    setBooking(true);

    const bookingId = `KF-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const tokenNumber = mandi.current_queue_length + 1;
    const slot = slots.find((s) => s.time === selectedSlot);
    const qrData = JSON.stringify({
      bookingId,
      token: tokenNumber,
      mandi: mandi.name,
      farmer: farmer.name,
      crop,
      slot: selectedSlot,
      date,
    });

    const { data } = await supabase
      .from('bookings')
      .insert({
        booking_id: bookingId,
        farmer_id: farmer.id,
        mandi_id: mandi.id,
        crop_type: crop,
        expected_quantity_qtl: Number(quantity) || 0,
        preferred_date: date,
        slot_time: selectedSlot,
        token_number: tokenNumber,
        qr_code_data: qrData,
        status: 'booked',
        expected_wait_minutes: slot?.waitMinutes || 30,
        ai_recommended: slot?.aiRecommended || false,
      })
      .select('*')
      .maybeSingle();

    if (data) {
      await supabase
        .from('mandis')
        .update({
          current_queue_length: mandi.current_queue_length + 1,
          available_slots: Math.max(0, mandi.available_slots - 1),
        })
        .eq('id', mandi.id);

      setLastBookingId(bookingId);
      navigate('bookingConfirmation');
    }
    setBooking(false);
  };

  const crops = [
    { value: 'Wheat', label: t('wheat') },
    { value: 'Rice', label: t('rice') },
    { value: 'Maize', label: t('maize') },
    { value: 'Cotton', label: t('cotton') },
  ];

  return (
    <ScreenContainer>
      <Header title={t('slotBooking')} />
      <div className="px-4 py-4 pb-28 space-y-5">
        <div className="card bg-gradient-to-br from-kisan-green-50 to-white">
          <h3 className="font-bold text-slate-900">{mandi.name}</h3>
          <p className="text-sm text-slate-500">{mandi.district}, {mandi.state}</p>
        </div>

        <div className="card space-y-4">
          <div>
            <label className="label-text">{t('selectCrop')}</label>
            <div className="grid grid-cols-2 gap-2">
              {crops.map((c) => (
                <button
                  key={c.value}
                  onClick={() => setCrop(c.value)}
                  className={`p-3 rounded-xl border-2 text-sm font-semibold transition-all flex items-center gap-2 ${
                    crop === c.value
                      ? 'border-kisan-green-500 bg-kisan-green-50 text-kisan-green-700'
                      : 'border-slate-200 text-slate-600'
                  }`}
                >
                  <Wheat className="w-4 h-4" />
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="label-text">{t('expectedQuantity')}</label>
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="input-field"
              placeholder="0"
            />
            {farmer.remaining_quota_qtl > 0 && (
              <p className="text-xs text-slate-400 mt-1">
                {t('remainingQuota')}: {farmer.remaining_quota_qtl} qtl
              </p>
            )}
          </div>

          <div>
            <label className="label-text">{t('preferredDate')}</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              className="input-field"
            />
          </div>
        </div>

        <div>
          <h3 className="section-title mb-3">{t('availableSlotsTitle')}</h3>
          <div className="space-y-2">
            {slots.map((slot) => (
              <button
                key={slot.time}
                onClick={() => slot.available && setSelectedSlot(slot.time)}
                disabled={!slot.available}
                className={`w-full p-4 rounded-2xl border-2 transition-all flex items-center justify-between ${
                  !slot.available
                    ? 'border-slate-100 bg-slate-50 opacity-50 cursor-not-allowed'
                    : selectedSlot === slot.time
                    ? 'border-kisan-green-500 bg-kisan-green-50'
                    : slot.aiRecommended
                    ? 'border-kisan-orange-300 bg-kisan-orange-50 hover:border-kisan-orange-400'
                    : 'border-slate-200 bg-white hover:border-kisan-green-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    selectedSlot === slot.time ? 'bg-kisan-green-500' : slot.aiRecommended ? 'bg-kisan-orange-200' : 'bg-slate-100'
                  }`}>
                    {selectedSlot === slot.time ? (
                      <Check className="w-5 h-5 text-white" />
                    ) : (
                      <Clock className="w-5 h-5 text-slate-500" />
                    )}
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-slate-900">{slot.time}</p>
                    <p className="text-xs text-slate-500">~{slot.waitMinutes} {t('minutes')} {t('approx')}</p>
                  </div>
                </div>
                {slot.aiRecommended && slot.available && (
                  <span className="badge bg-kisan-orange-100 text-kisan-orange-700">
                    <Sparkles className="w-3 h-3" />
                    {t('aiRecommended')}
                  </span>
                )}
              </button>
            ))}
          </div>
          {slots.find((s) => s.aiRecommended && s.available) && (
            <p className="text-xs text-kisan-orange-600 mt-2 flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              {t('aiRecommendedDesc')}
            </p>
          )}
        </div>

        <button
          onClick={handleGenerateToken}
          className="btn-primary w-full"
          disabled={!selectedSlot || booking}
        >
          {booking ? t('loading') : t('generateToken')}
          {!booking && <Calendar className="w-5 h-5" />}
        </button>
      </div>
      <BottomNav />
      <FloatingMic />
    </ScreenContainer>
  );
}
