import { useApp } from '@/context/AppContext';
import { ShieldCheck, Landmark, FileText, Upload, CheckCircle2, User, MapPin, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { ScreenContainer, LoadingSpinner } from '@/components/ui';
import { Header } from '@/components/common';
import { VerificationCard } from '@/components/widgets';
import { SearchableDropdown } from '@/components/SearchableDropdown';
import { PUNJAB_DISTRICTS } from '@/lib/punjabData';

export function VerificationScreen() {
  const { farmer, setFarmer, navigate, t } = useApp();
  const [farmerType, setFarmerType] = useState<'land_owner' | 'tenant'>(
    (farmer?.farmer_type as 'land_owner' | 'tenant') || 'land_owner'
  );
  const [state, setState] = useState(farmer?.state || 'Punjab');
  const [district, setDistrict] = useState(farmer?.district || '');
  const [survey, setSurvey] = useState(farmer?.survey_number || '');
  const [verifying, setVerifying] = useState(false);
  const [verified, setVerified] = useState(farmer?.is_verified || false);
  const [requestedQty, setRequestedQty] = useState('');
  const [tenantDocsUploaded, setTenantDocsUploaded] = useState(false);

  if (!farmer) return null;

  const handleVerify = async () => {
    setVerifying(true);
    await new Promise((r) => setTimeout(r, 2000));

    const updated = {
      farmer_type: farmerType,
      state,
      district,
      survey_number: survey,
      land_area_acres: farmerType === 'land_owner' ? 5.5 : 2.5,
      crop_type: 'Wheat',
      yield_benchmark_qtl: farmerType === 'land_owner' ? 22 : 10,
      max_procurement_quota_qtl: farmerType === 'land_owner' ? 120 : 50,
      remaining_quota_qtl: farmerType === 'land_owner' ? 120 : 50,
      is_verified: true,
    };

    const { data } = await supabase
      .from('farmers')
      .update(updated)
      .eq('id', farmer.id)
      .select('*')
      .maybeSingle();

    if (data) {
      setFarmer(data);
      setVerified(true);
    }
    setVerifying(false);
  };

  const quotaNum = Number(requestedQty) || 0;
  const quotaValid = farmer.remaining_quota_qtl > 0 && quotaNum <= farmer.remaining_quota_qtl;

  return (
    <ScreenContainer>
      <Header title={t('verification')} />
      <div className="px-4 py-4 pb-28 space-y-5">
        <p className="text-sm text-slate-500">{t('verificationSubtitle')}</p>

        <div className="card">
          <div className="flex items-center gap-2 mb-4">
            <ShieldCheck className="w-5 h-5 text-kisan-green-600" />
            <h3 className="font-bold text-slate-900">{t('identityVerification')}</h3>
          </div>
          <div className="space-y-3">
            <div>
              <label className="label-text">{t('farmerType')}</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setFarmerType('land_owner')}
                  className={`p-3 rounded-xl border-2 text-sm font-semibold transition-all ${
                    farmerType === 'land_owner'
                      ? 'border-kisan-green-500 bg-kisan-green-50 text-kisan-green-700'
                      : 'border-slate-200 text-slate-600'
                  }`}
                >
                  <Landmark className="w-5 h-5 mx-auto mb-1" />
                  {t('landOwner')}
                </button>
                <button
                  onClick={() => setFarmerType('tenant')}
                  className={`p-3 rounded-xl border-2 text-sm font-semibold transition-all ${
                    farmerType === 'tenant'
                      ? 'border-kisan-green-500 bg-kisan-green-50 text-kisan-green-700'
                      : 'border-slate-200 text-slate-600'
                  }`}
                >
                  <User className="w-5 h-5 mx-auto mb-1" />
                  {t('tenantFarmer')}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center gap-2 mb-4">
            <MapPin className="w-5 h-5 text-kisan-green-600" />
            <h3 className="font-bold text-slate-900">{t('landDetails')}</h3>
          </div>
          <div className="space-y-3">
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
            <div>
              <label className="label-text">{t('surveyNumber')}</label>
              <input value={survey} onChange={(e) => setSurvey(e.target.value)} className="input-field" placeholder={t('enterSurvey')} />
            </div>
          </div>
        </div>

        {farmerType === 'tenant' && !verified && (
          <div className="card">
            <div className="flex items-center gap-2 mb-4">
              <FileText className="w-5 h-5 text-kisan-orange-600" />
              <h3 className="font-bold text-slate-900">{t('tenantDocs')}</h3>
            </div>
            <div className="space-y-3">
              <button
                onClick={() => setTenantDocsUploaded(true)}
                className="w-full p-4 rounded-xl border-2 border-dashed border-slate-300 hover:border-kisan-green-400 transition-colors flex items-center gap-3"
              >
                <Upload className="w-5 h-5 text-slate-400" />
                <span className="text-sm text-slate-600">{t('uploadLease')}</span>
              </button>
              <button
                onClick={() => setTenantDocsUploaded(true)}
                className="w-full p-4 rounded-xl border-2 border-dashed border-slate-300 hover:border-kisan-green-400 transition-colors flex items-center gap-3"
              >
                <Upload className="w-5 h-5 text-slate-400" />
                <span className="text-sm text-slate-600">{t('uploadPanchayat')}</span>
              </button>
              {tenantDocsUploaded && (
                <div className="flex items-center gap-2 text-sm text-kisan-green-600 font-medium">
                  <CheckCircle2 className="w-4 h-4" />
                  {t('tenantVerified')}
                </div>
              )}
            </div>
          </div>
        )}

        {!verified ? (
          <button onClick={handleVerify} className="btn-primary w-full" disabled={verifying || !district || (farmerType === 'tenant' && !tenantDocsUploaded)}>
            {verifying ? (
              <span className="animate-pulse">{t('verifying')}</span>
            ) : (
              <>{t('verifyRecords')} <ShieldCheck className="w-5 h-5" /></>
            )}
          </button>
        ) : (
          <>
            <VerificationCard>
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle2 className="w-5 h-5 text-kisan-green-600" />
                <h3 className="font-bold text-kisan-green-800">{t('verifiedRecord')}</h3>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div><p className="text-kisan-green-700 opacity-70">{t('farmerName')}</p><p className="font-semibold text-kisan-green-900">{farmer.name}</p></div>
                <div><p className="text-kisan-green-700 opacity-70">{t('landArea')}</p><p className="font-semibold text-kisan-green-900">{farmer.land_area_acres} acres</p></div>
                <div><p className="text-kisan-green-700 opacity-70">{t('cropType')}</p><p className="font-semibold text-kisan-green-900">{farmer.crop_type}</p></div>
                <div><p className="text-kisan-green-700 opacity-70">{t('yieldBenchmark')}</p><p className="font-semibold text-kisan-green-900">{farmer.yield_benchmark_qtl} qtl</p></div>
                <div><p className="text-kisan-green-700 opacity-70">{t('maxQuota')}</p><p className="font-semibold text-kisan-green-900">{farmer.max_procurement_quota_qtl} qtl</p></div>
                <div><p className="text-kisan-green-700 opacity-70">{t('remainingQuota')}</p><p className="font-semibold text-kisan-green-900">{farmer.remaining_quota_qtl} qtl</p></div>
              </div>
            </VerificationCard>

            <div className="card">
              <h3 className="font-bold text-slate-900 mb-3">{t('procurementRequest')}</h3>
              <div>
                <label className="label-text">{t('requestedQuantity')} (quintals)</label>
                <input
                  type="number"
                  value={requestedQty}
                  onChange={(e) => setRequestedQty(e.target.value)}
                  className="input-field"
                  placeholder="0"
                />
              </div>
              {requestedQty && (
                <div className={`mt-3 flex items-center gap-2 text-sm font-medium ${quotaValid ? 'text-kisan-green-600' : 'text-red-600'}`}>
                  <CheckCircle2 className="w-4 h-4" />
                  {quotaValid ? t('quotaValid') : t('quotaExceeded')}
                </div>
              )}
            </div>

            <button
              onClick={() => navigate('farmerDashboard')}
              className="btn-primary w-full"
            >
              {t('continue')}
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}
      </div>
    </ScreenContainer>
  );
}
