import { useApp } from '@/context/AppContext';
import { Users, Phone, ArrowRight, CheckCircle2, UserCheck } from 'lucide-react';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import type { Booking, Farmer } from '@/lib/types';
import { ScreenContainer, LoadingSpinner, EmptyState, StatusBadge } from '@/components/ui';
import { Header } from '@/components/common';

export function LiveQueueScreen() {
  const { navigate, setSelectedBookingId, t } = useApp();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [farmers, setFarmers] = useState<Record<string, Farmer>>({});
  const [loading, setLoading] = useState(true);
  const [actionMsg, setActionMsg] = useState('');

  const loadQueue = async () => {
    setLoading(true);
    const { data: bs } = await supabase
      .from('bookings')
      .select('*')
      .in('status', ['booked', 'arrived', 'in_progress'])
      .order('token_number', { ascending: true });
    if (bs) {
      setBookings(bs as Booking[]);
      const farmerIds = [...new Set((bs as Booking[]).map((b) => b.farmer_id))];
      const { data: fs } = await supabase.from('farmers').select('*').in('id', farmerIds);
      if (fs) {
        const map: Record<string, Farmer> = {};
        (fs as Farmer[]).forEach((f) => { map[f.id] = f; });
        setFarmers(map);
      }
    }
    setLoading(false);
  };

  useEffect(() => { loadQueue(); }, []);

  const updateStatus = async (booking: Booking, newStatus: string) => {
    await supabase.from('bookings').update({ status: newStatus }).eq('id', booking.id);
    const farmer = farmers[booking.farmer_id];
    const msg =
      newStatus === 'arrived' ? t('markedArrived') :
      newStatus === 'in_progress' ? t('calledFarmer') :
      t('markedComplete');
    setActionMsg(`${msg}: ${farmer?.name || 'Farmer'}`);
    setTimeout(() => setActionMsg(''), 2500);
    loadQueue();

    if (newStatus === 'in_progress') {
      setSelectedBookingId(booking.id);
      navigate('procurementEntry');
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <ScreenContainer>
      <Header title={t('liveQueueTitle')} />
      <div className="px-4 py-4 pb-10 space-y-4">
        {actionMsg && (
          <div className="p-3 rounded-xl bg-kisan-green-50 border border-kisan-green-200 text-kisan-green-700 text-sm font-medium animate-fade-in flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            {actionMsg}
          </div>
        )}

        {bookings.length === 0 ? (
          <EmptyState icon={Users} title={t('noFarmersInQueue')} description="" />
        ) : (
          <>
            <div className="card overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100">
                    <th className="text-left py-2 px-1 font-semibold text-slate-500">{t('token')}</th>
                    <th className="text-left py-2 px-1 font-semibold text-slate-500">{t('farmerNameCol')}</th>
                    <th className="text-left py-2 px-1 font-semibold text-slate-500">{t('cropCol')}</th>
                    <th className="text-left py-2 px-1 font-semibold text-slate-500">{t('quantityCol')}</th>
                    <th className="text-left py-2 px-1 font-semibold text-slate-500">{t('statusCol')}</th>
                    <th className="text-left py-2 px-1 font-semibold text-slate-500">{t('actions')}</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((b) => {
                    const farmer = farmers[b.farmer_id];
                    return (
                      <tr key={b.id} className="border-b border-slate-50">
                        <td className="py-3 px-1">
                          <span className="font-bold text-kisan-green-600">#{b.token_number}</span>
                        </td>
                        <td className="py-3 px-1">
                          <p className="font-medium text-slate-900">{farmer?.name || 'Farmer'}</p>
                          <p className="text-xs text-slate-400">{farmer?.mobile_number}</p>
                        </td>
                        <td className="py-3 px-1 text-slate-700">{b.crop_type}</td>
                        <td className="py-3 px-1 text-slate-700">{b.expected_quantity_qtl} qtl</td>
                        <td className="py-3 px-1"><StatusBadge status={b.status} /></td>
                        <td className="py-3 px-1">
                          <div className="flex flex-col gap-1">
                            {b.status === 'booked' && (
                              <button
                                onClick={() => updateStatus(b, 'arrived')}
                                className="text-xs px-2 py-1 rounded-lg bg-kisan-green-100 text-kisan-green-700 font-medium hover:bg-kisan-green-200"
                              >
                                {t('markArrived')}
                              </button>
                            )}
                            {b.status === 'arrived' && (
                              <button
                                onClick={() => updateStatus(b, 'in_progress')}
                                className="text-xs px-2 py-1 rounded-lg bg-kisan-orange-100 text-kisan-orange-700 font-medium hover:bg-kisan-orange-200"
                              >
                                {t('callNextFarmer')}
                              </button>
                            )}
                            {b.status === 'in_progress' && (
                              <button
                                onClick={() => updateStatus(b, 'completed')}
                                className="text-xs px-2 py-1 rounded-lg bg-blue-100 text-blue-700 font-medium hover:bg-blue-200"
                              >
                                {t('markComplete')}
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <button onClick={() => navigate('qrVerification')} className="btn-primary w-full">
              <UserCheck className="w-5 h-5" />
              {t('qrVerification')}
              <ArrowRight className="w-5 h-5" />
            </button>
          </>
        )}
      </div>
    </ScreenContainer>
  );
}
