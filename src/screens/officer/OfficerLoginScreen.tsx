import { useApp } from '@/context/AppContext';
import { Briefcase, Phone, Upload, ShieldCheck, ArrowRight, Building2 } from 'lucide-react';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { Officer } from '@/lib/types';
import { ScreenContainer, LoadingSpinner } from '@/components/ui';
import { OTPInput } from '@/components/widgets';

export function OfficerLoginScreen() {
  const { navigate, setOfficer, t } = useApp();
  const [step, setStep] = useState<'credentials' | 'otp' | 'upload' | 'verified'>('credentials');
  const [officialId, setOfficialId] = useState('');
  const [mobile, setMobile] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [docsUploaded, setDocsUploaded] = useState(false);

  const handleSendOtp = () => {
    if (!officialId || mobile.length < 10) {
      setError('Please enter valid credentials');
      return;
    }
    setError('');
    setStep('otp');
  };

  const handleVerifyOtp = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep('upload');
    }, 1200);
  };

  const handleVerifyOfficial = async () => {
    setLoading(true);
    try {
      const { data: existing } = await supabase
        .from('officers')
        .select('*')
        .eq('official_id', officialId)
        .maybeSingle();

      if (existing) {
        setOfficer(existing as Officer);
        setStep('verified');
        setTimeout(() => navigate('officerDashboard'), 2000);
        return;
      }

      const { data: newOfficer } = await supabase
        .from('officers')
        .insert({
          official_id: officialId,
          name: 'Official ' + officialId.slice(-4),
          mobile_number: mobile,
          role: 'Procurement Officer',
          centre_name: 'Krishi Mandi Ludhiana',
          is_verified: true,
        })
        .select('*')
        .maybeSingle();

      if (newOfficer) {
        setOfficer(newOfficer as Officer);
        setStep('verified');
        setTimeout(() => navigate('officerDashboard'), 2000);
      }
    } catch {
      setError(t('error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenContainer>
      <div className="min-h-screen flex flex-col bg-gradient-to-b from-kisan-orange-50 to-white">
        <div className="tricolor-bar h-2 w-full" />
        <div className="flex-1 flex flex-col justify-center px-6 py-8 max-w-md mx-auto w-full">
          <div className="mb-8 animate-slide-up">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-kisan-orange-100 mb-4">
              <Briefcase className="w-8 h-8 text-kisan-orange-600" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900">{t('officerLogin')}</h2>
            <p className="text-slate-500 mt-1">{t('officerLoginSubtitle')}</p>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
              {error}
            </div>
          )}

          {step === 'credentials' && (
            <div className="space-y-4 animate-fade-in">
              <div>
                <label className="label-text">{t('officialId')}</label>
                <input
                  type="text"
                  value={officialId}
                  onChange={(e) => setOfficialId(e.target.value)}
                  placeholder={t('enterOfficialId')}
                  className="input-field"
                />
              </div>
              <div>
                <label className="label-text">{t('mobileNumber')}</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium">+91</span>
                  <input
                    type="tel"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    placeholder={t('enterMobile')}
                    className="input-field pl-14"
                  />
                </div>
              </div>
              <button onClick={handleSendOtp} className="btn-orange w-full">
                {t('sendOtp')}
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          )}

          {step === 'otp' && (
            <div className="space-y-6 animate-fade-in">
              <p className="text-center text-slate-600">{t('otpSent')}</p>
              <OTPInput onComplete={handleVerifyOtp} />
              {loading && <LoadingSpinner />}
              <button onClick={handleVerifyOtp} className="btn-orange w-full" disabled={loading}>
                {t('verifyOtp')}
              </button>
            </div>
          )}

          {step === 'upload' && (
            <div className="space-y-4 animate-fade-in">
              <div>
                <label className="label-text">{t('uploadGovtId')}</label>
                <button
                  onClick={() => setDocsUploaded(true)}
                  className="w-full p-6 rounded-xl border-2 border-dashed border-slate-300 hover:border-kisan-orange-400 transition-colors flex flex-col items-center gap-2"
                >
                  <Upload className="w-8 h-8 text-slate-400" />
                  <span className="text-sm text-slate-600">{t('uploadGovtId')}</span>
                </button>
              </div>
              <div>
                <label className="label-text">{t('uploadAuthLetter')}</label>
                <button
                  onClick={() => setDocsUploaded(true)}
                  className="w-full p-6 rounded-xl border-2 border-dashed border-slate-300 hover:border-kisan-orange-400 transition-colors flex flex-col items-center gap-2"
                >
                  <Upload className="w-8 h-8 text-slate-400" />
                  <span className="text-sm text-slate-600">{t('uploadAuthLetter')}</span>
                </button>
              </div>
              <button onClick={handleVerifyOfficial} className="btn-orange w-full" disabled={loading || !docsUploaded}>
                {loading ? t('verifyingOfficial') : t('verifyOfficial')}
                {!loading && <ShieldCheck className="w-5 h-5" />}
              </button>
            </div>
          )}

          {step === 'verified' && (
            <div className="flex flex-col items-center gap-4 animate-slide-up">
              <div className="w-16 h-16 rounded-full bg-kisan-green-100 flex items-center justify-center">
                <ShieldCheck className="w-10 h-10 text-kisan-green-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">{t('officialVerified')}</h3>
              <div className="w-full card space-y-3">
                <div className="flex items-center gap-3">
                  <Building2 className="w-5 h-5 text-kisan-orange-600" />
                  <div>
                    <p className="text-xs text-slate-400">{t('role')}</p>
                    <p className="font-semibold text-slate-900">Procurement Officer</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Briefcase className="w-5 h-5 text-kisan-orange-600" />
                  <div>
                    <p className="text-xs text-slate-400">{t('centreName')}</p>
                    <p className="font-semibold text-slate-900">Krishi Mandi Ludhiana</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </ScreenContainer>
  );
}
