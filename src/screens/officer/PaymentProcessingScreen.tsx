import { useApp } from '@/context/AppContext';
import { Send, Wallet, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import type { Payment, Procurement, Farmer } from '@/lib/types';
import { ScreenContainer, LoadingSpinner, EmptyState, StatusBadge } from '@/components/ui';
import { Header } from '@/components/common';

export function PaymentProcessingScreen() {
  const { navigate, t } = useApp();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [procurements, setProcurements] = useState<Record<string, Procurement>>({});
  const [farmers, setFarmers] = useState<Record<string, Farmer>>({});
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState<string | null>(null);
  const [sentMsg, setSentMsg] = useState('');

  useEffect(() => {
    (async () => {
      setLoading(true);
      const { data: pays } = await supabase
        .from('payments')
        .select('*')
        .order('created_at', { ascending: false });
      if (pays) {
        setPayments(pays as Payment[]);
        const procIds = (pays as Payment[]).map((p) => p.procurement_id);
        const { data: procs } = await supabase.from('procurements').select('*').in('id', procIds);
        if (procs) {
          const map: Record<string, Procurement> = {};
          (procs as Procurement[]).forEach((p) => { map[p.id] = p; });
          setProcurements(map);
          const farmerIds = [...new Set((procs as Procurement[]).map((p) => p.farmer_id))];
          const { data: fs } = await supabase.from('farmers').select('*').in('id', farmerIds);
          if (fs) {
            const fMap: Record<string, Farmer> = {};
            (fs as Farmer[]).forEach((f) => { fMap[f.id] = f; });
            setFarmers(fMap);
          }
        }
      }
      setLoading(false);
    })();
  }, []);

  const handleSendPayment = async (payment: Payment) => {
    setSending(payment.id);
    const newTimeline = [
      ...(payment.timeline || []),
      { status: 'processing', timestamp: new Date().toISOString(), label: t('sentToBank') },
    ];
    await supabase
      .from('payments')
      .update({ status: 'processing', timeline: JSON.stringify(newTimeline), utr_number: `UTR${Date.now()}` })
      .eq('id', payment.id);
    setSentMsg(t('paymentSent'));
    setTimeout(() => setSentMsg(''), 2500);
    setSending(null);
    const { data: pays } = await supabase.from('payments').select('*').order('created_at', { ascending: false });
    if (pays) setPayments(pays as Payment[]);
  };

  if (loading) return <LoadingSpinner />;

  return (
    <ScreenContainer>
      <Header title={t('paymentProcessingOfficer')} />
      <div className="px-4 py-4 pb-10 space-y-4">
        {sentMsg && (
          <div className="p-3 rounded-xl bg-kisan-green-50 border border-kisan-green-200 text-kisan-green-700 text-sm font-medium animate-fade-in flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            {sentMsg}
          </div>
        )}

        {payments.length === 0 ? (
          <EmptyState icon={Wallet} title="No payments to process" description="" />
        ) : (
          payments.map((payment) => {
            const proc = procurements[payment.procurement_id];
            const farmer = proc ? farmers[proc.farmer_id] : null;
            return (
              <div key={payment.id} className="card space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-bold text-slate-900">₹{payment.amount.toLocaleString('en-IN')}</p>
                    <p className="text-xs text-slate-500">{payment.payment_id}</p>
                  </div>
                  <StatusBadge status={payment.status} />
                </div>
                {farmer && (
                  <div className="text-sm text-slate-600">
                    <p>{t('farmerName')}: <span className="font-medium text-slate-900">{farmer.name}</span></p>
                    {proc && <p>{t('cropType')}: {proc.crop_type} • {proc.accepted_quantity_qtl} qtl</p>}
                  </div>
                )}
                {payment.utr_number && (
                  <p className="text-xs text-slate-400">UTR: {payment.utr_number}</p>
                )}
                {payment.status === 'pending' && (
                  <button
                    onClick={() => handleSendPayment(payment)}
                    className="btn-primary w-full py-2.5 text-sm"
                    disabled={sending === payment.id}
                  >
                    {sending === payment.id ? t('loading') : (
                      <>
                        <Send className="w-4 h-4" />
                        {t('sendToPayment')}
                      </>
                    )}
                  </button>
                )}
              </div>
            );
          })
        )}

        <button onClick={() => navigate('officerDashboard')} className="btn-ghost w-full">
          {t('officerDashboard')} <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </ScreenContainer>
  );
}
