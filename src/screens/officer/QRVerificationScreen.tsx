import { useApp } from '@/context/AppContext';
import { QrCode, Upload, ScanLine, CheckCircle2, ArrowRight, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import type { Booking, Farmer, Mandi } from '@/lib/types';
import { ScreenContainer, LoadingSpinner } from '@/components/ui';
import { Header } from '@/components/common';

export function QRVerificationScreen() {
  const { navigate, setSelectedBookingId, setVerifiedBookingId, t } = useApp();
  const [scanning, setScanning] = useState(false);
  const [verified, setVerified] = useState(false);
  const [booking, setBooking] = useState<Booking | null>(null);
  const [farmer, setFarmer] = useState<Farmer | null>(null);
  const [mandi, setMandi] = useState<Mandi | null>(null);

  const handleScan = async () => {
    setScanning(true);
    setTimeout(async () => {
      setScanning(false);
      const { data: bs } = await supabase
        .from('bookings')
        .select('*, mandis(*)')
        .in('status', ['booked', 'arrived'])
        .order('token_number', { ascending: true })
        .limit(1)
        .maybeSingle();

      if (bs) {
        const b = bs as any;
        setBooking(b);
        setMandi(b.mandis as Mandi);
        setVerified(true);
        setVerifiedBookingId(b.id);
        const { data: f } = await supabase
          .from('farmers')
          .select('*')
          .eq('id', b.farmer_id)
          .maybeSingle();
        if (f) setFarmer(f as Farmer);
      }
    }, 2500);
  };

  const handleStartProcurement = () => {
    if (booking) {
      setSelectedBookingId(booking.id);
      navigate('procurementEntry');
    }
  };

  return (
    <ScreenContainer>
      <Header title={t('qrVerification')} />
      <div className="px-4 py-4 pb-10 space-y-5">
        {!verified && (
          <>
            <div className="flex gap-3">
              <button
                onClick={handleScan}
                className={`flex-1 p-4 rounded-2xl border-2 transition-all ${
                  scanning ? 'border-kisan-green-500 bg-kisan-green-50' : 'border-slate-200 bg-white hover:border-kisan-green-300'
                }`}
              >
                <div className="flex flex-col items-center gap-2">
                  {scanning ? (
                    <div className="w-16 h-16 rounded-xl bg-kisan-green-100 flex items-center justify-center animate-pulse">
                      <ScanLine className="w-8 h-8 text-kisan-green-600" />
                    </div>
                  ) : (
                    <div className="w-16 h-16 rounded-xl bg-slate-100 flex items-center justify-center">
                      <QrCode className="w-8 h-8 text-slate-600" />
                    </div>
                  )}
                  <span className="font-semibold text-slate-900 text-sm">{t('scanQRTitle')}</span>
                </div>
              </button>
              <button className="flex-1 p-4 rounded-2xl border-2 border-slate-200 bg-white hover:border-kisan-green-300 transition-all">
                <div className="flex flex-col items-center gap-2">
                  <div className="w-16 h-16 rounded-xl bg-slate-100 flex items-center justify-center">
                    <Upload className="w-8 h-8 text-slate-600" />
                  </div>
                  <span className="font-semibold text-slate-900 text-sm">{t('uploadQRImage')}</span>
                </div>
              </button>
            </div>

            {scanning && (
              <div className="card text-center py-8 animate-fade-in">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-kisan-green-100 mb-3 animate-pulse">
                  <ScanLine className="w-10 h-10 text-kisan-green-600" />
                </div>
                <p className="font-semibold text-slate-900">{t('scanInstructions')}</p>
                <p className="text-sm text-slate-500 mt-1">{t('loading')}</p>
              </div>
            )}
          </>
        )}

        {verified && booking && farmer && (
          <div className="space-y-4 animate-slide-up">
            <div className="flex flex-col items-center gap-2">
              <div className="w-16 h-16 rounded-full bg-kisan-green-100 flex items-center justify-center">
                <CheckCircle2 className="w-10 h-10 text-kisan-green-600" />
              </div>
              <h3 className="text-xl font-bold text-kisan-green-700">{t('verifiedFarmer')}</h3>
            </div>

            <div className="card space-y-3">
              <h4 className="font-bold text-slate-900">{t('farmerDetails')}</h4>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-slate-400">{t('farmerName')}</p>
                  <p className="font-semibold text-slate-900">{farmer.name}</p>
                </div>
                <div>
                  <p className="text-slate-400">{t('bookingId')}</p>
                  <p className="font-semibold text-slate-900">{booking.booking_id}</p>
                </div>
                <div>
                  <p className="text-slate-400">{t('tokenNumber')}</p>
                  <p className="font-semibold text-slate-900">#{booking.token_number}</p>
                </div>
                <div>
                  <p className="text-slate-400">{t('slotTime')}</p>
                  <p className="font-semibold text-slate-900">{booking.slot_time}</p>
                </div>
                <div>
                  <p className="text-slate-400">{t('cropType')}</p>
                  <p className="font-semibold text-slate-900">{booking.crop_type}</p>
                </div>
                <div>
                  <p className="text-slate-400">{t('expectedQuantity')}</p>
                  <p className="font-semibold text-slate-900">{booking.expected_quantity_qtl} qtl</p>
                </div>
                <div className="col-span-2">
                  <p className="text-slate-400">{t('mandiName')}</p>
                  <p className="font-semibold text-slate-900">{mandi?.name || ''}</p>
                </div>
              </div>
            </div>

            <button onClick={handleStartProcurement} className="btn-primary w-full">
              {t('startProcurement')}
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </ScreenContainer>
  );
}
