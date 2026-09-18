import { useApp } from '@/context/AppContext';
import { Phone, Mic, ArrowRight, ShieldCheck, MessageSquare } from 'lucide-react';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { Farmer } from '@/lib/types';
import { ScreenContainer, LoadingSpinner } from '@/components/ui';
import { OTPInput } from '@/components/widgets';

export function FarmerLoginScreen() {
  const { navigate, t, setFarmer, language } = useApp();
  const [step, setStep] = useState<'mobile' | 'otp' | 'aadhaar'>('mobile');
  const [mobile, setMobile] = useState('');
  const [aadhaar, setAadhaar] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSendOtp = () => {
    if (mobile.length < 10) {
      setError('Please enter a valid mobile number');
      return;
    }
    setError('');
    setStep('otp');
  };

  const handleVerifyOtp = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep('aadhaar');
    }, 1200);
  };

  const handleAadhaarVerify = async () => {
    setLoading(true);
    setError('');
    try {
      const { data: existingFarmer } = await supabase
        .from('farmers')
        .select('*')
        .eq('mobile_number', mobile)
        .maybeSingle();

      if (existingFarmer) {
        const farmer = existingFarmer as Farmer;
        if (farmer.language !== language) {
          await supabase.from('farmers').update({ language }).eq('id', farmer.id);
        }
        setFarmer(farmer);
        navigate('farmerDashboard');
        return;
      }

      const { data: newFarmer } = await supabase
        .from('farmers')
        .insert({
          name: 'New Farmer',
          mobile_number: mobile,
          aadhaar_number: aadhaar || null,
          is_verified: false,
          language,
        })
        .select('*')
        .maybeSingle();

      if (newFarmer) {
        setFarmer(newFarmer as Farmer);
        navigate('verification');
      }
    } catch {
      setError(t('error'));
    } finally {
      setLoading(false);
    }
  };

  const handleVoiceLogin = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep('aadhaar');
    }, 1500);
  };

  return (
    <ScreenContainer>
      <div className="min-h-screen flex flex-col bg-gradient-to-b from-kisan-green-50 to-white">
        <div className="tricolor-bar h-2 w-full" />
        <div className="flex-1 flex flex-col justify-center px-6 py-8 max-w-md mx-auto w-full">
          <div className="mb-8 animate-slide-up">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-kisan-green-100 mb-4">
              <Phone className="w-8 h-8 text-kisan-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900">{t('login')}</h2>
            <p className="text-slate-500 mt-1">{t('loginSubtitle')}</p>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm animate-fade-in">
              {error}
            </div>
          )}

          {step === 'mobile' && (
            <div className="space-y-4 animate-fade-in">
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
              <button onClick={handleSendOtp} className="btn-primary w-full">
                {t('sendOtp')}
                <ArrowRight className="w-5 h-5" />
              </button>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200" />
                </div>
                <div className="relative flex justify-center">
                  <span className="bg-white px-3 text-sm text-slate-400">OR</span>
                </div>
              </div>

              <button
                onClick={handleVoiceLogin}
                className="w-full p-4 rounded-2xl bg-gradient-to-br from-kisan-orange-400 to-kisan-orange-500 text-white font-semibold shadow-lg shadow-kisan-orange-500/25 flex items-center justify-center gap-3 transition-all hover:shadow-xl active:scale-[0.98]"
              >
                <Mic className="w-5 h-5" />
                {t('voiceLogin')}
              </button>
              <p className="text-center text-sm text-slate-400">{t('voiceLoginDesc')}</p>
            </div>
          )}

          {step === 'otp' && (
            <div className="space-y-6 animate-fade-in">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-kisan-green-100 mb-3">
                  <MessageSquare className="w-8 h-8 text-kisan-green-600" />
                </div>
                <p className="text-slate-600">{t('otpSent')}</p>
                <p className="font-semibold text-slate-900">+91 {mobile}</p>
              </div>
              <OTPInput onComplete={handleVerifyOtp} />
              {loading && <LoadingSpinner />}
              <button onClick={handleVerifyOtp} className="btn-primary w-full" disabled={loading}>
                {t('verifyOtp')}
              </button>
              <button onClick={() => setStep('mobile')} className="btn-ghost w-full">
                {t('back')}
              </button>
            </div>
          )}

          {step === 'aadhaar' && (
            <div className="space-y-4 animate-fade-in">
              <div className="flex items-center gap-2 text-kisan-green-600 mb-2">
                <ShieldCheck className="w-5 h-5" />
                <span className="text-sm font-medium">{t('verified')}</span>
              </div>
              <div>
                <label className="label-text">{t('aadhaarNumber')}</label>
                <input
                  type="text"
                  value={aadhaar}
                  onChange={(e) => setAadhaar(e.target.value)}
                  placeholder={t('enterAadhaar')}
                  className="input-field"
                />
              </div>
              <button onClick={handleAadhaarVerify} className="btn-primary w-full" disabled={loading}>
                {loading ? t('loading') : t('continue')}
                {!loading && <ArrowRight className="w-5 h-5" />}
              </button>
            </div>
          )}
        </div>
      </div>
    </ScreenContainer>
  );
}
