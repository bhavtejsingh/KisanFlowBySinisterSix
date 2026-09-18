import { useApp } from '@/context/AppContext';
import { CheckCircle2, XCircle, ArrowRight, Calculator } from 'lucide-react';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import type { Procurement, Farmer } from '@/lib/types';
import { ScreenContainer, LoadingSpinner } from '@/components/ui';
import { Header } from '@/components/common';

export function ProcurementApprovalScreen() {
  const { selectedProcurementId, navigate, officer, t } = useApp();
  const [procurement, setProcurement] = useState<Procurement | null>(null);
  const [farmer, setFarmer] = useState<Farmer | null>(null);
  const [approving, setApproving] = useState(false);

  useEffect(() => {
    if (!selectedProcurementId) return;
    (async () => {
      const { data: p } = await supabase
        .from('procurements')
        .select('*')
        .eq('id', selectedProcurementId)
        .maybeSingle();
      if (p) {
        setProcurement(p as Procurement);
        const { data: f } = await supabase
          .from('farmers')
          .select('*')
          .eq('id', (p as Procurement).farmer_id)
          .maybeSingle();
        if (f) setFarmer(f as Farmer);
      }
    })();
  }, [selectedProcurementId]);

  if (!procurement || !farmer) return <LoadingSpinner />;

  const handleApprove = async () => {
    setApproving(true);
    await supabase
      .from('procurements')
      .update({
        status: 'approved',
        approved_by: officer?.name || 'Officer',
        approved_at: new Date().toISOString(),
      })
      .eq('id', procurement.id);

    const paymentId = `PAY-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    await supabase.from('payments').insert({
      payment_id: paymentId,
      procurement_id: procurement.id,
      farmer_id: procurement.farmer_id,
      amount: procurement.amount,
      status: 'pending',
      timeline: JSON.stringify([
        { status: 'procurement_approved', timestamp: new Date().toISOString(), label: t('procurementApproved') },
      ]),
    });

    setApproving(false);
    navigate('paymentProcessing');
  };

  const handleReject = async () => {
    await supabase.from('procurements').update({ status: 'rejected' }).eq('id', procurement.id);
    navigate('officerDashboard');
  };

  return (
    <ScreenContainer>
      <Header title={t('procurementApproval')} />
      <div className="px-4 py-4 pb-10 space-y-4">
        <p className="text-sm text-slate-500">{t('procurementApprovalSubtitle')}</p>

        <div className="card">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="font-bold text-slate-900">{farmer.name}</p>
              <p className="text-sm text-slate-500">{procurement.procurement_id}</p>
            </div>
            <span className="badge-blue">{procurement.crop_type}</span>
          </div>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <p className="text-slate-400">{t('actualQuantity')}</p>
              <p className="font-semibold text-slate-900">{procurement.actual_quantity_qtl} qtl</p>
            </div>
            <div>
              <p className="text-slate-400">{t('acceptedQuantity')}</p>
              <p className="font-semibold text-slate-900">{procurement.accepted_quantity_qtl} qtl</p>
            </div>
            <div>
              <p className="text-slate-400">{t('moistureLevel')}</p>
              <p className="font-semibold text-slate-900">{procurement.moisture_level_pct}%</p>
            </div>
            <div>
              <p className="text-slate-400">{t('qualityGrade')}</p>
              <p className="font-semibold text-slate-900">Grade {procurement.quality_grade}</p>
            </div>
          </div>
        </div>

        <div className="card bg-gradient-to-br from-kisan-green-50 to-white">
          <div className="flex items-center gap-2 mb-3">
            <Calculator className="w-5 h-5 text-kisan-green-600" />
            <h3 className="font-bold text-slate-900">{t('mspCalculation')}</h3>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-600">{t('acceptedQuantity')}</span>
              <span className="font-semibold text-slate-900">{procurement.accepted_quantity_qtl} qtl</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">{t('mspRate')}</span>
              <span className="font-semibold text-slate-900">₹{procurement.msp_rate.toLocaleString('en-IN')} {t('perQuintal')}</span>
            </div>
            <div className="border-t border-slate-200 pt-2 flex justify-between">
              <span className="font-bold text-slate-900">{t('amount')}</span>
              <span className="font-bold text-kisan-green-700 text-xl">₹{procurement.amount.toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>

        {procurement.remarks && (
          <div className="card">
            <p className="text-sm text-slate-400 mb-1">{t('remarks')}</p>
            <p className="text-slate-700">{procurement.remarks}</p>
          </div>
        )}

        <div className="flex gap-3">
          <button onClick={handleReject} className="btn-secondary flex-1 border-red-200 text-red-600 hover:border-red-400">
            <XCircle className="w-5 h-5" />
            {t('rejectProcurement')}
          </button>
          <button onClick={handleApprove} className="btn-primary flex-1" disabled={approving}>
            {approving ? t('loading') : (
              <>
                <CheckCircle2 className="w-5 h-5" />
                {t('approveProcurement')}
              </>
            )}
          </button>
        </div>
      </div>
    </ScreenContainer>
  );
}
