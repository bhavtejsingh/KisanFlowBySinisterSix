import { useApp } from '@/context/AppContext';
import { Wallet, TrendingUp, Clock } from 'lucide-react';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import type { Payment, Procurement } from '@/lib/types';
import { ScreenContainer, LoadingSpinner, EmptyState } from '@/components/ui';
import { Header, BottomNav, FloatingMic } from '@/components/common';
import { Timeline } from '@/components/widgets';

export function PaymentTrackingScreen() {
  const { farmer, t } = useApp();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [procurements, setProcurements] = useState<Procurement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!farmer) return;
    (async () => {
      setLoading(true);
      const { data: pays } = await supabase
        .from('payments')
        .select('*')
        .eq('farmer_id', farmer.id)
        .order('created_at', { ascending: false });
      setPayments((pays as Payment[]) || []);

      if (pays && pays.length > 0) {
        const procIds = (pays as Payment[]).map((p) => p.procurement_id);
        const { data: procs } = await supabase
          .from('procurements')
          .select('*')
          .in('id', procIds);
        setProcurements((procs as Procurement[]) || []);
      }
      setLoading(false);
    })();
  }, [farmer]);

  if (loading) return <LoadingSpinner />;
  if (!farmer) return null;

  if (payments.length === 0) {
    return (
      <ScreenContainer>
        <Header title={t('paymentTracking')} />
        <EmptyState icon={Wallet} title={t('noPayments')} description={t('noPaymentsDesc')} />
        <BottomNav />
        <FloatingMic />
      </ScreenContainer>
    );
  }

  const payment = payments[0];
  const procurement = procurements.find((p) => p.id === payment.procurement_id);

  const timelineSteps = [
    { label: t('awaitingProcurement'), done: true, timestamp: 'Completed' },
    { label: t('paymentInitiated'), done: payment.status !== 'pending', current: payment.status === 'pending' },
    { label: t('sentToBank'), done: payment.status === 'processing' || payment.status === 'completed', current: payment.status === 'processing' },
    { label: t('creditedToAccount'), done: payment.status === 'completed', current: false },
  ];

  return (
    <ScreenContainer>
      <Header title={t('paymentTracking')} />
      <div className="px-4 py-4 pb-28 space-y-4">
        <p className="text-sm text-slate-500">{t('paymentTrackingSubtitle')}</p>

        <div className="rounded-2xl bg-gradient-to-br from-kisan-green-500 to-kisan-green-700 p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm opacity-90">{t('amount')}</span>
            <TrendingUp className="w-5 h-5 opacity-80" />
          </div>
          <p className="text-4xl font-bold">₹{payment.amount.toLocaleString('en-IN')}</p>
          <p className="text-sm opacity-80 mt-1">{payment.payment_id}</p>
          <div className="mt-3">
            <span className={`badge ${
              payment.status === 'completed' ? 'bg-white text-kisan-green-700' :
              payment.status === 'processing' ? 'bg-white text-kisan-orange-700' :
              'bg-white/30 text-white'
            }`}>
              {payment.status}
            </span>
          </div>
        </div>

        {procurement && (
          <div className="card">
            <h3 className="font-bold text-slate-900 mb-3">{t('cropDetails')}</h3>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-slate-400">{t('cropType')}</p>
                <p className="font-semibold text-slate-900">{procurement.crop_type}</p>
              </div>
              <div>
                <p className="text-slate-400">{t('acceptedQuantity')}</p>
                <p className="font-semibold text-slate-900">{procurement.accepted_quantity_qtl} qtl</p>
              </div>
              <div>
                <p className="text-slate-400">{t('mspRate')}</p>
                <p className="font-semibold text-slate-900">₹{procurement.msp_rate.toLocaleString('en-IN')} {t('perQuintal')}</p>
              </div>
              <div>
                <p className="text-slate-400">{t('amount')}</p>
                <p className="font-semibold text-slate-900">₹{procurement.amount.toLocaleString('en-IN')}</p>
              </div>
            </div>
          </div>
        )}

        <div className="card">
          <h3 className="font-bold text-slate-900 mb-4">{t('paymentTimeline')}</h3>
          <Timeline steps={timelineSteps} />
        </div>

        {payments.length > 1 && (
          <div>
            <h3 className="section-title mb-3">Previous Payments</h3>
            <div className="space-y-2">
              {payments.slice(1).map((p) => (
                <div key={p.id} className="card flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-slate-900">₹{p.amount.toLocaleString('en-IN')}</p>
                    <p className="text-xs text-slate-500">{p.payment_id}</p>
                  </div>
                  <span className={`badge ${
                    p.status === 'completed' ? 'badge-green' :
                    p.status === 'processing' ? 'badge-orange' : 'badge-gray'
                  }`}>{p.status}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      <BottomNav />
      <FloatingMic />
    </ScreenContainer>
  );
}
