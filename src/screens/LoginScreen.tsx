import { useState } from 'react';
import { Phone, ShieldCheck, Mic, ArrowRight, Check } from 'lucide-react';
import { useApp } from '../App';

export default function LoginScreen() {
  const { tr, go } = useApp();
  const [step, setStep] = useState<'mobile' | 'otp' | 'aadhaar'>('mobile');
  const [mobile, setMobile] = useState('');
  const [otp, setOtp] = useState(['', '', '', '']);
  const [aadhaar, setAadhaar] = useState('');

  return (
    <div className="h-full flex flex-col bg-gradient-to-b from-kisan-50 to-white">
      <div className="px-6 pt-10 pb-4">
        <div className="w-14 h-14 rounded-2xl bg-kisan-600 flex items-center justify-center mb-4 shadow-lg">
          <ShieldCheck className="w-7 h-7 text-white" />
        </div>
        <h1 className="text-2xl font-bold text-gray-800">{tr.login}</h1>
        <p className="text-sm text-gray-500 mt-1">KisanFlow — Farmer Portal</p>
      </div>

      <div className="flex-1 px-6 overflow-y-auto">
        {/* Step indicator */}
        <div className="flex items-center gap-2 mb-6">
          {['mobile', 'otp', 'aadhaar'].map((s, i) => (
            <div key={s} className="flex items-center gap-2 flex-1">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition ${
                  step === s || (['mobile','otp','aadhaar'].indexOf(step) > i)
                    ? 'bg-kisan-600 text-white'
                    : 'bg-gray-200 text-gray-400'
                }`}
              >
                {['mobile','otp','aadhaar'].indexOf(step) > i ? <Check className="w-4 h-4" /> : i + 1}
              </div>
              {i < 2 && <div className={`h-1 flex-1 rounded ${['mobile','otp','aadhaar'].indexOf(step) > i ? 'bg-kisan-600' : 'bg-gray-200'}`} />}
            </div>
          ))}
        </div>

        {step === 'mobile' && (
          <div className="animate-slide-up">
            <label className="text-sm font-semibold text-gray-600 mb-2 block">{tr.mobileNum}</label>
            <div className="flex items-center gap-2 mb-4">
              <span className="px-3 py-4 rounded-xl bg-gray-100 font-semibold text-gray-700 border-2 border-gray-200">+91</span>
              <input
                type="tel"
                maxLength={10}
                value={mobile}
                onChange={(e) => setMobile(e.target.value.replace(/\D/g, ''))}
                placeholder="98765 43210"
                className="flex-1 px-4 py-4 rounded-xl border-2 border-gray-200 text-lg font-semibold focus:border-kisan-600 focus:outline-none"
              />
            </div>
            <button
              onClick={() => setStep('otp')}
              disabled={mobile.length < 10}
              className="w-full py-4 rounded-2xl bg-saffron-500 text-white text-lg font-bold shadow-lg active:scale-[0.98] disabled:opacity-40 hover:bg-saffron-600 transition flex items-center justify-center gap-2"
            >
              {tr.sendOtp} <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        )}

        {step === 'otp' && (
          <div className="animate-slide-up">
            <label className="text-sm font-semibold text-gray-600 mb-3 block">{tr.enterOtp}</label>
            <div className="flex gap-3 mb-6">
              {otp.map((d, i) => (
                <input
                  key={i}
                  type="tel"
                  maxLength={1}
                  value={d}
                  onChange={(e) => {
                    const v = e.target.value.replace(/\D/g, '');
                    const n = [...otp];
                    n[i] = v;
                    setOtp(n);
                  }}
                  className="w-14 h-16 text-center text-2xl font-bold rounded-xl border-2 border-gray-200 focus:border-kisan-600 focus:outline-none"
                />
              ))}
            </div>
            <button
              onClick={() => setStep('aadhaar')}
              disabled={otp.join('').length < 4}
              className="w-full py-4 rounded-2xl bg-saffron-500 text-white text-lg font-bold shadow-lg active:scale-[0.98] disabled:opacity-40 hover:bg-saffron-600 transition flex items-center justify-center gap-2"
            >
              {tr.verify} <ArrowRight className="w-5 h-5" />
            </button>
            <p className="text-center text-sm text-gray-400 mt-4">OTP sent to +91 {mobile}</p>
          </div>
        )}

        {step === 'aadhaar' && (
          <div className="animate-slide-up">
            <label className="text-sm font-semibold text-gray-600 mb-2 block">{tr.aadhaar}</label>
            <input
              type="tel"
              maxLength={12}
              value={aadhaar}
              onChange={(e) => setAadhaar(e.target.value.replace(/\D/g, ''))}
              placeholder="XXXX XXXX XXXX"
              className="w-full px-4 py-4 rounded-xl border-2 border-gray-200 text-lg font-semibold tracking-widest focus:border-kisan-600 focus:outline-none mb-4"
            />
            <button
              onClick={() => go('verification')}
              disabled={aadhaar.length < 12}
              className="w-full py-4 rounded-2xl bg-kisan-600 text-white text-lg font-bold shadow-lg active:scale-[0.98] disabled:opacity-40 hover:bg-kisan-700 transition flex items-center justify-center gap-2"
            >
              {tr.verifyAadhaar} <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>

      {/* Voice login */}
      <div className="px-6 pb-8 pt-4 border-t border-gray-100">
        <button
          onClick={() => go('verification')}
          className="w-full py-4 rounded-2xl bg-kisan-50 border-2 border-kisan-200 text-kisan-700 text-lg font-bold active:scale-[0.98] hover:bg-kisan-100 transition flex items-center justify-center gap-3"
        >
          <div className="w-10 h-10 rounded-full bg-kisan-600 flex items-center justify-center">
            <Mic className="w-5 h-5 text-white" />
          </div>
          {tr.voiceLogin}
        </button>
      </div>
    </div>
  );
}
